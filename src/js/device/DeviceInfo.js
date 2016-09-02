/**
 * Created by duo on 2016/8/31.
 */

CMD.register("device.DeviceInfo", function (require) {
    var Model = require("model.Model");
    var Platform = require("platform.Platform");
    var AndroidStorageType = require("device.AndroidStorageType");
    var StreamType = require("device.StreamType");


    function DeviceInfo(nativeBridge) {
        Model.call(this);
        this._nativeBridge = nativeBridge;
    }
    extend(DeviceInfo, Model);
    DeviceInfo.prototype.fetch = function () {
        var me = this, t = [];
        t.push(this._nativeBridge.DeviceInfo.getAdvertisingTrackingId().then(function (id) {
            return me._advertisingIdentifier = id;
        }).catch(function (e) {
            return me.handleDeviceInfoError(e);
        }));

        t.push(this._nativeBridge.DeviceInfo.getLimitAdTrackingFlag().then(function (flag) {
            me._nativeBridge.getPlatform() === Platform.IOS ? me._limitAdTracking = !flag : me._limitAdTracking = flag;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        t.push(this._nativeBridge.DeviceInfo.getOsVersion().then(function (version) {
            return me._osVersion = version;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        t.push(this._nativeBridge.DeviceInfo.getModel().then(function (model) {
            return me._model = model;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        t.push(this._nativeBridge.DeviceInfo.getScreenWidth().then(function (width) {
            return me._screenWidth = width;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        t.push(this._nativeBridge.DeviceInfo.getScreenHeight().then(function (height) {
            return me._screenHeight = height;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        t.push(this._nativeBridge.DeviceInfo.getSystemLanguage().then(function (lang) {
            return me._language = lang;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        t.push(this._nativeBridge.DeviceInfo.isRooted().then(function (rooted) {
            return me._rooted = rooted;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        t.push(this._nativeBridge.DeviceInfo.getTimeZone(false).then(function (timeZone) {
            return me._timeZone = timeZone;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        t.push(this._nativeBridge.DeviceInfo.getTotalMemory().then(function (totalMemory) {
            return me._totalMemory = totalMemory;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        if(this._nativeBridge.getPlatform() === Platform.IOS ){
            t.push(this._nativeBridge.DeviceInfo.Ios.getUserInterfaceIdiom().then(function (userInterfaceIdiom) {
                return me._userInterfaceIdiom = userInterfaceIdiom;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            t.push(this._nativeBridge.DeviceInfo.Ios.getScreenScale().then(function (scale) {
                return me._screenScale = scale;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            t.push(this._nativeBridge.DeviceInfo.Ios.isSimulator().then(function (isSimulator) {
                return me._simulator = isSimulator;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            t.push(this._nativeBridge.DeviceInfo.Ios.getTotalSpace().then(function (totalSpace) {
                return me._totalInternalSpace = totalSpace;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }))
        } else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            t.push(this._nativeBridge.DeviceInfo.Android.getAndroidId().then(function (id) {
                return me._androidId = id;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getApiLevel().then(function (apiLevel) {
                return me._apiLevel = apiLevel;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getTotalSpace(AndroidStorageType.INTERNAL).then(function (totalSpace) {
                return me._totalInternalSpace = totalSpace;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getTotalSpace(AndroidStorageType.EXTERNAL).then(function (totalSpace) {
                return me._totalExternalSpace = totalSpace;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getManufacturer().then(function (manufacturer) {
                return me._manufacturer = manufacturer;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getScreenDensity().then(function (screenDensity) {
                return me._screenDensity = screenDensity;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            t.push(this._nativeBridge.DeviceInfo.Android.getScreenLayout().then(function (screenLayout) {
                return me._screenLayout = screenLayout;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
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
            return this._nativeBridge.DeviceInfo.getNetworkOperator().then(function (networkOperator) {
                me._networkOperator = networkOperator;
                return me._networkOperator;
            })
        }else{
            return Promise.resolve(this._networkOperator);
        }
    };
    DeviceInfo.prototype.getNetworkOperatorName = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS || this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.getNetworkOperatorName().then(function (networkOperatorName) {
                me._networkOperatorName = networkOperatorName;
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
            return this._nativeBridge.DeviceInfo.Ios.getFreeSpace().then(function (freeSpace) {
                me._freeInternalSpace = freeSpace;
                return me._freeInternalSpace;
            });
        }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getFreeSpace(AndroidStorageType.INTERNAL).then(function (freeSpace) {
                me._freeInternalSpace = freeSpace;
                return me._freeInternalSpace;
            });
        }else{
            return Promise.resolve(this._freeInternalSpace);
        }
    };
    DeviceInfo.prototype.getFreeSpaceExternal = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getFreeSpace(AndroidStorageType.EXTERNAL).then(function (freeSpace) {
                me._freeExternalSpace = freeSpace;
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
            return this._nativeBridge.DeviceInfo.Ios.isAppleWatchPaired().then(function (isAppleWatchPaired) {
                me._appleWatchPaired = isAppleWatchPaired;
                return me._appleWatchPaired;
            });
        }else{
            return Promise.resolve(this._appleWatchPaired);
        }
    };
    DeviceInfo.prototype.getHeadset = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getHeadset().then(function (headset) {
            me._headset = headset;
            return me._headset;
        });
    };
    DeviceInfo.prototype.getRingerMode = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getRingerMode().then(function (ringerMode) {
                me._ringerMode = ringerMode;
                return me._ringerMode;
            });
        }else{
            return Promise.resolve(this._ringerMode);
        }
    };
    DeviceInfo.prototype.getDeviceVolume = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS){
            return this._nativeBridge.DeviceInfo.Ios.getDeviceVolume().then(function (volume) {
                me._volume = volume;
                return me._volume;
            });
        }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getDeviceVolume(StreamType.STREAM_SYSTEM).then(function (volume) {
                me._volume = volume;
                return me._volume;
            });
        }else{
            return Promise.resolve(this._volume);
        }
    };
    DeviceInfo.prototype.getScreenBrightness = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getScreenBrightness().then(function (screenBrightness) {
            me._screenBrightness = screenBrightness;
            return me._screenBrightness;
        });
    };
    DeviceInfo.prototype.getBatteryLevel = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getBatteryLevel().then(function (batteryLevel) {
            me._batteryLevel = batteryLevel;
            return me._batteryLevel;
        });
    };
    DeviceInfo.prototype.getBatteryStatus = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getBatteryStatus().then(function (batteryStatus) {
            me._batteryStatus = batteryStatus;
            return me._batteryStatus;
        });
    };
    DeviceInfo.prototype.getFreeMemory = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getFreeMemory().then(function (freeMemory) {
            me._freeMemory = freeMemory;
            return me._freeMemory;
        });
    };
    DeviceInfo.prototype.getTotalMemory = function () {
        return this._totalMemory;
    };
    DeviceInfo.prototype.getDTO = function () {
        var me = this, t = [];
        t.push(this.getConnectionType()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        t.push(this.getNetworkType()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        t.push(this.getNetworkOperator()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        t.push(this.getNetworkOperatorName()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        t.push(this.getHeadset()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        t.push(this.getDeviceVolume()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        t.push(this.getScreenBrightness()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        t.push(this.getFreeSpace()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        t.push(this.getBatteryLevel()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        t.push(this.getBatteryStatus()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        t.push(this.getFreeMemory()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        if(this._nativeBridge.getPlatform() === Platform.IOS ){
            t.push(this.isAppleWatchPaired()["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }))
        }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            t.push(this.getFreeSpaceExternal()["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));
            t.push(this.getRingerMode()["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }))
        }
        return Promise.all(t).then(function (t) {
            return {
                androidId: me._androidId,
                advertisingId: me._advertisingIdentifier,
                trackingEnabled: me._limitAdTracking,
                apiLevel: me._apiLevel,
                osVersion: me._osVersion,
                deviceMake: me._manufacturer,
                deviceModel: me._model,
                connectionType: me._connectionType,
                networkType: me._networkType,
                screenLayout: me._screenLayout,
                screenDensity: me._screenDensity,
                screenWidth: me._screenWidth,
                screenHeight: me._screenHeight,
                screenScale: me._screenScale,
                userInterfaceIdiom: me._userInterfaceIdiom,
                networkOperator: me._networkOperator,
                networkOperatorName: me._networkOperatorName,
                timeZone: me._timeZone,
                headset: me._headset,
                ringerMode: me._ringerMode,
                language: me._language,
                deviceVolume: me._volume,
                screenBrightness: me._screenBrightness,
                freeSpaceInternal: me._freeInternalSpace,
                totalSpaceInternal: me._totalInternalSpace,
                freeSpaceExternal: me._freeExternalSpace,
                totalSpaceExternal: me._totalExternalSpace,
                batteryLevel: me._batteryLevel,
                batteryStatus: me._batteryStatus,
                freeMemory: me._freeMemory,
                totalMemory: me._totalMemory,
                rooted: me._rooted,
                simulator: me._simulator,
                appleWatchPaired: me._appleWatchPaired
            };
        });
    };
    DeviceInfo.prototype.handleDeviceInfoError = function (e) {
        this._nativeBridge.Sdk.logWarning(JSON.stringify(e));
    };
    return DeviceInfo;
});
