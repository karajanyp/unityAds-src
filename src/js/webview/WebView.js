/**
 * Created by duo on 2016/9/1.
 */
CMD.register("webview.WebView", function (require) {
    var CallbackStatus = require("webview.bridge.CallbackStatus");
    var DeviceInfo = require("device.DeviceInfo");
    var ConfigManager = require("configuration.ConfigManager");
    var CacheMode = require("cache.CacheMode");
    var CampaignManager = require("campaign.CampaignManager");
    var CacheManager = require("cache.CacheManager");
    var PlacementState = require("placement.PlacementState");
    var Request = require("request.Request");
    var SessionManager = require("session.SessionManager");
    var ClientInfo = require("device.ClientInfo");
    var Diagnostics = require("util.Diagnostics");
    var EventManager = require("event.EventManager");
    var FinishState = require("FinishState");
    var AdsError = require("AdsError");
    var Platform = require("platform.Platform");
    var MetaDataManager = require("metadata.MetaDataManager");
    var Resolve = require("resolve.Resolve");
    var WakeUpManager = require("wakeup.WakeUpManager");
    var AdUnitFactory = require("adunit.AdUnitFactory");
    var VastParser = require("util.VastParser");
    var JsonParser = require("util.JsonParser");
    var StorageType = require("storage.StorageType");

    /**
     * @param bridge
     * @constructor
     */
    function WebView(bridge) {
        var me = this;
        me._showing = false;
        me._initialized = false;
        me._mustReinitialize = false;
        me._nativeBridge = bridge;

        if(window && window.addEventListener) {
            window.addEventListener("error", function (e) {
                return me.onError(e);
            }, false);
        }
    }
    WebView.prototype.initialize = function () {
        var me = this;
        return this._nativeBridge.Sdk.loadComplete()
            .then(function (nativeClientInfo) {
                me._deviceInfo = new DeviceInfo(me._nativeBridge);
                me._wakeUpManager = new WakeUpManager(me._nativeBridge);
                me._cacheManager = new CacheManager(me._nativeBridge, me._wakeUpManager);
                me._request = new Request(me._nativeBridge, me._wakeUpManager);
                me._resolve = new Resolve(me._nativeBridge);
                me._eventManager = new EventManager(me._nativeBridge, me._request);
                me._clientInfo = new ClientInfo(me._nativeBridge.getPlatform(), nativeClientInfo);
                return me._deviceInfo.fetch();
            })
            .then(function () {
                if (me._clientInfo.getPlatform() === Platform.ANDROID) {
                    document.body.classList.add("android");
                    me._nativeBridge.setApiLevel(me._deviceInfo.getApiLevel());
                }else if (me._clientInfo.getPlatform() === Platform.IOS) {
                    var t = me._deviceInfo.getModel();
                    if( t.match(/iphone/i) || t.match(/ipod/i) ){
                        document.body.classList.add("iphone")
                    }else if( t.match(/ipad/i) ){
                        document.body.classList.add("ipad");
                    }
                }
                me._sessionManager = new SessionManager(me._nativeBridge, me._clientInfo, me._deviceInfo, me._eventManager);
                me._initializedAt = me._configJsonCheckedAt = Date.now();
                me._nativeBridge.Sdk.initComplete();
                me._wakeUpManager.setListenConnectivity(true);
                me._wakeUpManager.onNetworkConnected.subscribe(function () {
                    return me.onNetworkConnected();
                });
                if( me._nativeBridge.getPlatform() === Platform.IOS ){
                    me._wakeUpManager.setListenAppForeground(true);
                    me._wakeUpManager.onAppForeground.subscribe(function () {
                        return me.onAppForeground();
                    })
                }else{
                    me._wakeUpManager.setListenScreen(true);
                    me._wakeUpManager.onScreenOn.subscribe(function () {
                        return me.onScreenOn();
                    })
                }
                me._cacheManager.cleanCache();

                return me.setupTestEnvironment();
            })
            .then(function () {
                return ConfigManager.fetch(me._nativeBridge, me._request, me._clientInfo, me._deviceInfo);
            })
            .then(function (configuration) {
                me._configuration = configuration;
                return me._sessionManager.create();
            })
            .then(function () {
                var placement = me._configuration.getDefaultPlacement();
                me._nativeBridge.Placement.setDefaultPlacement(placement.getId());
                me.setPlacementStates(PlacementState.NOT_AVAILABLE);
                me._campaignManager = new CampaignManager(me._nativeBridge, me._request, me._clientInfo, me._deviceInfo, new VastParser());
                me._campaignManager.onCampaign.subscribe(function (campaign) {
                    return me.onCampaign(campaign);
                });
                me._campaignManager.onVastCampaign.subscribe(function (campaign) {
                    return me.onVastCampaign(campaign);
                });
                me._campaignManager.onNoFill.subscribe(function (t) {
                    return me.onNoFill(t);
                });
                me._campaignManager.onError.subscribe(function (e) {
                    return me.onCampaignError(e);
                });
                me._refillTimestamp = 0;
                return me._campaignManager.request();
            })
            .then(function () {
                me._initialized = true;
                return me._eventManager.sendUnsentSessions();
            })
            .catch(function (e) {
                if(e instanceof Error ){
                    e = {
                        message: e.message,
                        name: e.name,
                        stack: e.stack
                    };
                    if( e.message === AdsError[AdsError.INVALID_ARGUMENT] ){
                        me._nativeBridge.Listener.sendErrorEvent(AdsError[AdsError.INVALID_ARGUMENT], "Game ID is not valid")
                    }
                }

                me._nativeBridge.Sdk.logError(JSON.stringify(e));
                Diagnostics.trigger(
                    me._eventManager,
                    {
                        type: "initialization_error",
                        error: e
                    },
                    me._clientInfo,
                    me._deviceInfo
                );
            });
    };

    WebView.prototype.show = function (placementId, nativeOptions, i) {
        var me = this;
        i(CallbackStatus.OK);
        if (this._showing) {
            this.showError(false, placementId, "Can't show a new ad unit when ad unit is already open");
            return
        }
        var placement = this._configuration.getPlacement(placementId);
        if(!placement){
            this.showError(true, placementId, "No such placement: " + placementId);
            return;
        }

        if(!this._campaign){
            this.showError(true, placementId, "Campaign not found");
            return;
        }

        this._nativeBridge.getPlatform() !== Platform.IOS || this._campaign.getBypassAppSheet() || this._nativeBridge.AppSheet.prepare({
            id: parseInt(this._campaign.getAppStoreId(), 10)
        });
        this._showing = true;

        this.shouldReinitialize().then(function (mustReinit) {
            me._mustReinitialize = mustReinit;
        });

        if(this._configuration.getCacheMode() === CacheMode.ALLOWED){
            this._cacheManager.stop();
        }

        MetaDataManager.fetchPlayerMetaData(this._nativeBridge).then(function (playerMetaData) {
            if(playerMetaData){
                me._sessionManager.setGamerServerId(playerMetaData.getServerId());
            }
            me._adUnit = AdUnitFactory.createAdUnit(me._nativeBridge, me._sessionManager, placement, me._campaign, me._configuration);
            me._adUnit.setNativeOptions(nativeOptions);
            me._adUnit.onNewAdRequestAllowed.subscribe(function () {
                return me.onNewAdRequestAllowed();
            });
            me._adUnit.onClose.subscribe(function () {
                return me.onClose();
            });
            me._adUnit.show().then(function () {
                me._sessionManager.sendShow(me._adUnit);
            });
            me._campaign = null;
            me.setPlacementStates(PlacementState.WAITING);
            me._refillTimestamp = 0;
            me._mustRefill = true;
        });
    };

    WebView.prototype.showError = function (finished, placementId, msg) {
        this._nativeBridge.Sdk.logError("Show invocation failed: " + msg);
        this._nativeBridge.Listener.sendErrorEvent(AdsError[AdsError.SHOW_ERROR], msg);
        if( finished ){
            this._nativeBridge.Listener.sendFinishEvent(placementId, FinishState.ERROR);
        }
    };
    WebView.prototype.setPlacementStates = function (state) {
        var placements = this._configuration.getPlacements();
        for (var key in placements){
            if (placements.hasOwnProperty(key)) {
                var placement = placements[key];
                this._nativeBridge.Placement.setPlacementState(placement.getId(), state);
                if(state === PlacementState.READY ){
                    this._nativeBridge.Listener.sendReadyEvent(placement.getId());
                }
            }
        }
    };
    WebView.prototype.onCampaign = function (campaign) {
        var me = this;
        this._campaign = campaign;
        var mode = this._configuration.getCacheMode();
        var cache = function (e) {
            return me._cacheManager.cache(e, {
                retries: 5
            }).then(function (e) {
                var n = e[0], i = e[1];
                if (n === a.CacheStatus.OK) {
                    return me._cacheManager.getFileUrl(i);
                }
                throw n;
            }).catch(function (e) {
                if (e !== a.CacheStatus.STOPPED){
                    me.onError(e);
                    return e;
                }
                throw e;
            });
        };
        var o = function () {
            return cache(campaign.getVideoUrl())
                .then(function (t) {
                    campaign.setVideoUrl(t);
                    campaign.setVideoCached(true);
                })
                .then(function () {
                    return cache(campaign.getLandscapeUrl());
                })
                .then(function (t) {
                    return campaign.setLandscapeUrl(t);
                })
                .then(function () {
                    return cache(campaign.getPortraitUrl());
                })
                .then(function (t) {
                    return campaign.setPortraitUrl(t);
                })
                .then(function () {
                    return cache(campaign.getGameIcon());
                })
                .then(function (t) {
                    return campaign.setGameIcon(t);
                })
                .catch(function (e) {
                    if(e === a.CacheStatus.STOPPED){
                        me._nativeBridge.Sdk.logInfo("Caching was stopped, using streaming instead");
                    }
                });
        };
        var c = function () {
            me.setPlacementStates(PlacementState.READY);
        };

        if (mode === CacheMode.FORCED) {
            o().then(function () {
                if (me._showing){
                    var e = me._adUnit.onClose.subscribe(function () {
                        me._adUnit.onClose.unsubscribe(e);
                        c();
                    });
                }else {
                    c();
                }
            });
        }else if (mode === CacheMode.ALLOWED) {
            if (this._showing) {
                var u = this._adUnit.onClose.subscribe(function () {
                    me._adUnit.onClose.unsubscribe(u);
                    o();
                    c();
                });
            }else {
                o();
                c();
            }
        }else{
            c();
        }
    };

    WebView.prototype.onVastCampaign = function (campaign) {
        var me = this;
        this._campaign = campaign;
        var n = this._configuration.getCacheMode();
        var i = function (e) {
            return me._cacheManager.cache(e, {
                retries: 5
            }).then(function (e) {
                var n = e[0], i = e[1];
                if (n === a.CacheStatus.OK) return me._cacheManager.getFileUrl(i);
                throw n;
            })["catch"](function (n) {
                if (n !== a.CacheStatus.STOPPED) return me.onError(n), e;
                throw n;
            });
        };
        var o = function () {
            var n = campaign.getVideoUrl();
            return me._request.head(n, [], {
                retries: 5,
                retryDelay: 1e3,
                followRedirects: !0,
                retryWithConnectionEvents: !1
            }).then(function (r) {
                var o = r.url || n;
                i(o).then(function (t) {
                    campaign.setVideoUrl(t);
                    campaign.setVideoCached(!0);
                })["catch"](function (e) {
                    e === a.CacheStatus.STOPPED && me._nativeBridge.Sdk.logInfo("Caching was stopped, using streaming instead");
                });
            })["catch"](function (e) {
                me._nativeBridge.Sdk.logError("Caching failed to get VAST video URL location: " + e);
            });
        };
        var c = function () {
            me.setPlacementStates(PlacementState.READY);
        };

        if (n === CacheMode.FORCED) {
            o().then(function () {
                if (me._showing){
                    var e = me._adUnit.onClose.subscribe(function () {
                        me._adUnit.onClose.unsubscribe(e);
                        c();
                    });

                }else{
                    c();
                }
            });
        }else if (n === CacheMode.ALLOWED) {
            if (this._showing){
                var u = this._adUnit.onClose.subscribe(function () {
                    me._adUnit.onClose.unsubscribe(u);
                    o();
                    c();
                });
            }else{
                o();
                c();
            }
        }else{
            c();
        }
    };
    WebView.prototype.onNoFill = function (e) {
        this._refillTimestamp = Date.now() + 1000 * e;
        this._nativeBridge.Sdk.logInfo("Unity Ads server returned no fill, no ads to show");
        this.setPlacementStates(PlacementState.NO_FILL);
    };
    WebView.prototype.onCampaignError = function (e) {
        e instanceof Error && (e = {
            message: e.message,
            name: e.name,
            stack: e.stack
        });
        this._nativeBridge.Sdk.logError(JSON.stringify(e));
        Diagnostics.trigger(
            this._eventManager,
            {
                type: "campaign_request_failed",
                error: e
            },
            this._clientInfo,
            this._deviceInfo
        );
        this.onNoFill(3600);
    };
    WebView.prototype.onNewAdRequestAllowed = function () {
        if(this._mustRefill){
            this._mustRefill = false;
            this._campaignManager.request()
        }
    };
    WebView.prototype.onClose = function () {
        this._nativeBridge.Sdk.logInfo("Closing Unity Ads ad unit");
        this._showing = false;
        if(this._mustReinitialize){
            this._nativeBridge.Sdk.logInfo("Unity Ads webapp has been updated, reinitializing Unity Ads");
            this.reinitialize();
        }else{
            if(this._mustRefill ){
                this._mustRefill = false;
                this._campaignManager.request()
            }
            this._sessionManager.create();
        }
    };
    WebView.prototype.isShowing = function () {
        return this._showing;
    };
    WebView.prototype.onNetworkConnected = function () {
        var me = this;
        if(!this.isShowing() && this._initialized ){
            this.shouldReinitialize().then(function (t) {
                if(t){
                    if(me.isShowing()){
                        me._mustReinitialize = true
                    }else{
                        me._nativeBridge.Sdk.logInfo("Unity Ads webapp has been updated, reinitializing Unity Ads");
                        me.reinitialize()
                    }
                }else{
                    me.checkRefill();
                    me._eventManager.sendUnsentSessions();
                }
            });
        }
    };
    WebView.prototype.onScreenOn = function () {
        this.checkRefill();
    };
    WebView.prototype.onAppForeground = function () {
        this.checkRefill();
    };
    WebView.prototype.checkRefill = function () {
        if(0 !== this._refillTimestamp && Date.now() > this._refillTimestamp ){
            this._refillTimestamp = 0;
            this._campaignManager.request();
        }
    };
    WebView.prototype.onError = function (e) {
        Diagnostics.trigger(
            this._eventManager,
            {
                type: "js_error",
                message: e.message,
                url: e.filename,
                line: e.lineno,
                column: e.colno,
                object: e.error
            },
            this._clientInfo,
            this._deviceInfo);
        return true;
    };
    WebView.prototype.reinitialize = function () {
        this._nativeBridge.Sdk.reinitialize();
    };
    WebView.prototype.getConfigJson = function () {
        return this._request.get(this._clientInfo.getConfigUrl() + "?ts=" + Date.now() + "&sdkVersion=" + this._clientInfo.getSdkVersion());
    };
    WebView.prototype.shouldReinitialize = function () {
        var me = this;

        if(this._clientInfo.getWebviewHash()){
            if(Date.now() - this._configJsonCheckedAt <= 9e5 ){
                return Promise.resolve(false)
            }else{
                return this.getConfigJson().then(function (configJson) {
                    me._configJsonCheckedAt = Date.now();
                    var response = JsonParser.parse(configJson.response);
                    return response.hash !== me._clientInfo.getWebviewHash();
                })["catch"](function (e) {
                    return false;
                })
            }
        }else{
            return Promise.resolve(false);
        }
    };
    WebView.prototype.setupTestEnvironment = function () {
        var me = this;
        this._nativeBridge.Storage.get(StorageType.PUBLIC, "test.serverUrl.value").then(function (t) {
            if(t){
                ConfigManager.setTestBaseUrl(t);
                CampaignManager.setTestBaseUrl(t);
                SessionManager.setTestBaseUrl(t);
                me._nativeBridge.Storage["delete"](StorageType.PUBLIC, "test.serverUrl");
                me._nativeBridge.Storage.write(StorageType.PUBLIC)
            }
        }).catch(function (e) {
            var t = e[0];
            switch (t) {
                case S.StorageError[S.StorageError.COULDNT_GET_VALUE]:
                    break;

                default:
                    throw new Error(t);
            }
        });

        this._nativeBridge.Storage.get(StorageType.PUBLIC, "test.kafkaUrl.value").then(function (t) {
            if(t){
                Diagnostics.setTestBaseUrl(t);
                me._nativeBridge.Storage["delete"](StorageType.PUBLIC, "test.kafkaUrl");
                me._nativeBridge.Storage.write(StorageType.PUBLIC)
            }
        }).catch(function (e) {
            var t = e[0];
            switch (t) {
                case S.StorageError[S.StorageError.COULDNT_GET_VALUE]:
                    break;

                default:
                    throw new Error(t);
            }
        });
    };
    return WebView;
});