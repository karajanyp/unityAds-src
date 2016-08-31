/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.DeviceInfoApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var IosDeviceInfoApi = require("api.IosDeviceInfoApi");
    var AndroidDeviceInfoApi = require("api.AndroidDeviceInfoApi");
    var Platform = require("platform.Platform");

    function DeviceInfoApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "DeviceInfo");
        if(nativeBridge.getPlatform() === Platform.IOS ){
            this.Ios = new IosDeviceInfoApi(nativeBridge)
        }else{
            this.Android = new AndroidDeviceInfoApi(nativeBridge);
        }
    }
    extend(DeviceInfoApi, NativeApi);

    DeviceInfoApi.prototype.getAdvertisingTrackingId = function () {
        return this._nativeBridge.invoke(this._apiClass, "getAdvertisingTrackingId");
    };
    DeviceInfoApi.prototype.getLimitAdTrackingFlag = function () {
        return this._nativeBridge.invoke(this._apiClass, "getLimitAdTrackingFlag");
    };
    DeviceInfoApi.prototype.getOsVersion = function () {
        return this._nativeBridge.invoke(this._apiClass, "getOsVersion");
    };
    DeviceInfoApi.prototype.getModel = function () {
        return this._nativeBridge.invoke(this._apiClass, "getModel");
    };
    DeviceInfoApi.prototype.getScreenWidth = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenWidth");
    };
    DeviceInfoApi.prototype.getScreenHeight = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenHeight");
    };
    DeviceInfoApi.prototype.getTimeZone = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getTimeZone", [e]);
    };
    DeviceInfoApi.prototype.getConnectionType = function () {
        return this._nativeBridge.invoke(this._apiClass, "getConnectionType");
    };
    DeviceInfoApi.prototype.getNetworkType = function () {
        return this._nativeBridge.invoke(this._apiClass, "getNetworkType");
    };
    DeviceInfoApi.prototype.getNetworkOperator = function () {
        return this._nativeBridge.invoke(this._apiClass, "getNetworkOperator");
    };
    DeviceInfoApi.prototype.getNetworkOperatorName = function () {
        return this._nativeBridge.invoke(this._apiClass, "getNetworkOperatorName");
    };
    DeviceInfoApi.prototype.isRooted = function () {
        return this._nativeBridge.invoke(this._apiClass, "isRooted");
    };
    DeviceInfoApi.prototype.getUniqueEventId = function () {
        return this._nativeBridge.invoke(this._apiClass, "getUniqueEventId");
    };
    DeviceInfoApi.prototype.getHeadset = function () {
        return this._nativeBridge.invoke(this._apiClass, "getHeadset");
    };
    DeviceInfoApi.prototype.getSystemLanguage = function () {
        return this._nativeBridge.invoke(this._apiClass, "getSystemLanguage");
    };
    DeviceInfoApi.prototype.getScreenBrightness = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenBrightness");
    };
    DeviceInfoApi.prototype.getBatteryLevel = function () {
        return this._nativeBridge.invoke(this._apiClass, "getBatteryLevel");
    };
    DeviceInfoApi.prototype.getBatteryStatus = function () {
        return this._nativeBridge.invoke(this._apiClass, "getBatteryStatus");
    };
    DeviceInfoApi.prototype.getFreeMemory = function () {
        return this._nativeBridge.invoke(this._apiClass, "getFreeMemory");
    };
    DeviceInfoApi.prototype.getTotalMemory = function () {
        return this._nativeBridge.invoke(this._apiClass, "getTotalMemory");
    };

    return DeviceInfoApi;
});
