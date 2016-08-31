/**
 * Created by duo on 2016/8/31.
 */

CMD.register("device.DeviceInfo", function (require, t, n, i, r) {
    var Model = require("model.Model");
    var Platform = require("platform.Platform");

    function DeviceInfo(nativeBridge) {
        Model.call(this);
        this._nativeBridge = nativeBridge;
    }
    extend(DeviceInfo, Model);
    DeviceInfo.prototype.fetch = function () {
        var e = this, t = [];
        t.push(this._nativeBridge.DeviceInfo.getAdvertisingTrackingId().then(function (t) {
            return e._advertisingIdentifier = t;
        }).catch(function (t) {
            return e.handleDeviceInfoError(t);
        }));

        t.push(this._nativeBridge.DeviceInfo.getLimitAdTrackingFlag().then(function (t) {
            e._nativeBridge.getPlatform() === Platform.IOS ? e._limitAdTracking = !t : e._limitAdTracking = t;
        })["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));

        t.push(this._nativeBridge.DeviceInfo.getOsVersion().then(function (t) {
            return e._osVersion = t;
        })["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));

        t.push(this._nativeBridge.DeviceInfo.getModel().then(function (t) {
            return e._model = t;
        })["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));

        t.push(this._nativeBridge.DeviceInfo.getScreenWidth().then(function (t) {
            return e._screenWidth = t;
        })["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));

        t.push(this._nativeBridge.DeviceInfo.getScreenHeight().then(function (t) {
            return e._screenHeight = t;
        })["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));

        t.push(this._nativeBridge.DeviceInfo.getSystemLanguage().then(function (t) {
            return e._language = t;
        })["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));

        t.push(this._nativeBridge.DeviceInfo.isRooted().then(function (t) {
            return e._rooted = t;
        })["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));

        t.push(this._nativeBridge.DeviceInfo.getTimeZone(!1).then(function (t) {
            return e._timeZone = t;
        })["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));

        t.push(this._nativeBridge.DeviceInfo.getTotalMemory().then(function (t) {
            return e._totalMemory = t;
        })["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));

        if(this._nativeBridge.getPlatform() === Platform.IOS ){
            t.push(this._nativeBridge.DeviceInfo.Ios.getUserInterfaceIdiom().then(function (t) {
                return e._userInterfaceIdiom = t;
            })["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }));

            t.push(this._nativeBridge.DeviceInfo.Ios.getScreenScale().then(function (t) {
                return e._screenScale = t;
            })["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }));

            t.push(this._nativeBridge.DeviceInfo.Ios.isSimulator().then(function (t) {
                return e._simulator = t;
            })["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }));

            t.push(this._nativeBridge.DeviceInfo.Ios.getTotalSpace().then(function (t) {
                return e._totalInternalSpace = t;
            })["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }))
        } else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            t.push(this._nativeBridge.DeviceInfo.Android.getAndroidId().then(function (t) {
                return e._androidId = t;
            })["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getApiLevel().then(function (t) {
                return e._apiLevel = t;
            })["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getTotalSpace(r.StorageType.INTERNAL).then(function (t) {
                return e._totalInternalSpace = t;
            })["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getTotalSpace(r.StorageType.EXTERNAL).then(function (t) {
                return e._totalExternalSpace = t;
            })["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getManufacturer().then(function (t) {
                return e._manufacturer = t;
            })["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getScreenDensity().then(function (t) {
                return e._screenDensity = t;
            })["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getScreenLayout().then(function (t) {
                return e._screenLayout = t;
            })["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }))
        }

        return Promise.all(t);
    };
    DeviceInfo.prototype.getAndroidId = function () {
        return this._androidId;
    };
    DeviceInfo.prototype.getAdvertisingIdentifier = function () {
        return this._advertisingIdentifier;
    };
    DeviceInfo.prototype.getLimitAdTracking = function () {
        return this._limitAdTracking;
    };
    DeviceInfo.prototype.getApiLevel = function () {
        return this._apiLevel;
    };
    DeviceInfo.prototype.getManufacturer = function () {
        return this._manufacturer;
    };
    DeviceInfo.prototype.getModel = function () {
        return this._model;
    };
    DeviceInfo.prototype.getNetworkType = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getNetworkType().then(function (type) {
            me._networkType = type;
            return me._networkType;
        });
    };
    DeviceInfo.prototype.getNetworkOperator = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS || this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.getNetworkOperator().then(function (t) {
                me._networkOperator = t;
                return me._networkOperator;
            })
        }else{
            return Promise.resolve(this._networkOperator);
        }
    };
    DeviceInfo.prototype.getNetworkOperatorName = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS || this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.getNetworkOperatorName().then(function (t) {
                me._networkOperatorName = t;
                return me._networkOperatorName;
            });
        }else{
            return Promise.resolve(this._networkOperatorName);
        }
    };
    DeviceInfo.prototype.getOsVersion = function () {
        return this._osVersion;
    };
    DeviceInfo.prototype.getScreenLayout = function () {
        return this._screenLayout;
    };
    DeviceInfo.prototype.getScreenDensity = function () {
        return this._screenDensity;
    };
    DeviceInfo.prototype.getScreenWidth = function () {
        return this._screenWidth;
    };
    DeviceInfo.prototype.getScreenHeight = function () {
        return this._screenHeight;
    };
    DeviceInfo.prototype.getScreenScale = function () {
        return this._screenScale;
    };
    DeviceInfo.prototype.getUserInterfaceIdiom = function () {
        return this._userInterfaceIdiom;
    };
    DeviceInfo.prototype.isRooted = function () {
        return this._rooted;
    };
    DeviceInfo.prototype.getConnectionType = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getConnectionType().then(function (type) {
            me._connectionType = type;
            return me._connectionType;
        });
    };
    DeviceInfo.prototype.getTimeZone = function () {
        return this._timeZone;
    };
    DeviceInfo.prototype.getFreeSpace = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS){
            return this._nativeBridge.DeviceInfo.Ios.getFreeSpace().then(function (t) {
                me._freeInternalSpace = t;
                return me._freeInternalSpace;
            });
        }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getFreeSpace(r.StorageType.INTERNAL).then(function (t) {
                me._freeInternalSpace = t;
                return me._freeInternalSpace;
            });
        }else{
            return Promise.resolve(this._freeInternalSpace);
        }
    };
    DeviceInfo.prototype.getFreeSpaceExternal = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getFreeSpace(r.StorageType.EXTERNAL).then(function (t) {
                me._freeExternalSpace = t;
                return me._freeExternalSpace;
            })
        }else{
            return Promise.resolve(this._freeExternalSpace);
        }
    };
    DeviceInfo.prototype.getTotalSpace = function () {
        return this._totalInternalSpace;
    };
    DeviceInfo.prototype.getTotalSpaceExternal = function () {
        return this._totalExternalSpace;
    };
    DeviceInfo.prototype.getLanguage = function () {
        return this._language;
    };
    DeviceInfo.prototype.isSimulator = function () {
        return this._simulator;
    };
    DeviceInfo.prototype.isAppleWatchPaired = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS){
            return this._nativeBridge.DeviceInfo.Ios.isAppleWatchPaired().then(function (t) {
                me._appleWatchPaired = t;
                return me._appleWatchPaired;
            });
        }else{
            return Promise.resolve(this._appleWatchPaired);
        }
    };
    DeviceInfo.prototype.getHeadset = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getHeadset().then(function (t) {
            me._headset = t;
            return me._headset;
        });
    };
    DeviceInfo.prototype.getRingerMode = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getRingerMode().then(function (t) {
                me._ringerMode = t;
                return me._ringerMode;
            });
        }else{
            return Promise.resolve(this._ringerMode);
        }
    };
    DeviceInfo.prototype.getDeviceVolume = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS){
            return this._nativeBridge.DeviceInfo.Ios.getDeviceVolume().then(function (t) {
                me._volume = t;
                return me._volume;
            });
        }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getDeviceVolume(t.StreamType.STREAM_SYSTEM).then(function (t) {
                me._volume = t;
                return me._volume;
            });
        }else{
            return Promise.resolve(this._volume);
        }
    };
    DeviceInfo.prototype.getScreenBrightness = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getScreenBrightness().then(function (t) {
            me._screenBrightness = t;
            return me._screenBrightness;
        });
    };
    DeviceInfo.prototype.getBatteryLevel = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getBatteryLevel().then(function (t) {
            me._batteryLevel = t;
            return me._batteryLevel;
        });
    };
    DeviceInfo.prototype.getBatteryStatus = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getBatteryStatus().then(function (t) {
            me._batteryStatus = t;
            return me._batteryStatus;
        });
    };
    DeviceInfo.prototype.getFreeMemory = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getFreeMemory().then(function (t) {
            me._freeMemory = t;
            return me._freeMemory;
        });
    };
    DeviceInfo.prototype.getTotalMemory = function () {
        return this._totalMemory;
    };
    DeviceInfo.prototype.getDTO = function () {
        var e = this, t = [];
        t.push(this.getConnectionType()["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));
        t.push(this.getNetworkType()["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));
        t.push(this.getNetworkOperator()["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));
        t.push(this.getNetworkOperatorName()["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));
        t.push(this.getHeadset()["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));
        t.push(this.getDeviceVolume()["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));
        t.push(this.getScreenBrightness()["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));
        t.push(this.getFreeSpace()["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));
        t.push(this.getBatteryLevel()["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));
        t.push(this.getBatteryStatus()["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));
        t.push(this.getFreeMemory()["catch"](function (t) {
            return e.handleDeviceInfoError(t);
        }));
        if(this._nativeBridge.getPlatform() === Platform.IOS ){
            t.push(this.isAppleWatchPaired()["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }))
        }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            t.push(this.getFreeSpaceExternal()["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }));
            t.push(this.getRingerMode()["catch"](function (t) {
                return e.handleDeviceInfoError(t);
            }))
        }
        return Promise.all(t).then(function (t) {
            return {
                androidId: e._androidId,
                advertisingId: e._advertisingIdentifier,
                trackingEnabled: e._limitAdTracking,
                apiLevel: e._apiLevel,
                osVersion: e._osVersion,
                deviceMake: e._manufacturer,
                deviceModel: e._model,
                connectionType: e._connectionType,
                networkType: e._networkType,
                screenLayout: e._screenLayout,
                screenDensity: e._screenDensity,
                screenWidth: e._screenWidth,
                screenHeight: e._screenHeight,
                screenScale: e._screenScale,
                userInterfaceIdiom: e._userInterfaceIdiom,
                networkOperator: e._networkOperator,
                networkOperatorName: e._networkOperatorName,
                timeZone: e._timeZone,
                headset: e._headset,
                ringerMode: e._ringerMode,
                language: e._language,
                deviceVolume: e._volume,
                screenBrightness: e._screenBrightness,
                freeSpaceInternal: e._freeInternalSpace,
                totalSpaceInternal: e._totalInternalSpace,
                freeSpaceExternal: e._freeExternalSpace,
                totalSpaceExternal: e._totalExternalSpace,
                batteryLevel: e._batteryLevel,
                batteryStatus: e._batteryStatus,
                freeMemory: e._freeMemory,
                totalMemory: e._totalMemory,
                rooted: e._rooted,
                simulator: e._simulator,
                appleWatchPaired: e._appleWatchPaired
            };
        });
    };
    DeviceInfo.prototype.handleDeviceInfoError = function (e) {
        this._nativeBridge.Sdk.logWarning(JSON.stringify(e));
    };
    return DeviceInfo;
});
