/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AndroidDeviceInfoApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var AndroidStorageType = require("device.AndroidStorageType");

    function AndroidDeviceInfoApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "DeviceInfo");
    }
    extend(AndroidDeviceInfoApi, NativeApi);

    AndroidDeviceInfoApi.prototype.getAndroidId = function () {
        return this._nativeBridge.invoke(this._apiClass, "getAndroidId");
    };
    AndroidDeviceInfoApi.prototype.getApiLevel = function () {
        return this._nativeBridge.invoke(this._apiClass, "getApiLevel");
    };
    AndroidDeviceInfoApi.prototype.getManufacturer = function () {
        return this._nativeBridge.invoke(this._apiClass, "getManufacturer");
    };
    AndroidDeviceInfoApi.prototype.getScreenLayout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenLayout");
    };
    AndroidDeviceInfoApi.prototype.getScreenDensity = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenDensity");
    };
    AndroidDeviceInfoApi.prototype.isAppInstalled = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "isAppInstalled", [e]);
    };
    AndroidDeviceInfoApi.prototype.getInstalledPackages = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getInstalledPackages", [e]);
    };
    AndroidDeviceInfoApi.prototype.getSystemProperty = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "getSystemProperty", [e, t]);
    };
    AndroidDeviceInfoApi.prototype.getRingerMode = function () {
        return this._nativeBridge.invoke(this._apiClass, "getRingerMode");
    };
    AndroidDeviceInfoApi.prototype.getDeviceVolume = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getDeviceVolume", [e]);
    };
    AndroidDeviceInfoApi.prototype.getFreeSpace = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getFreeSpace", [AndroidStorageType[e]]);
    };
    AndroidDeviceInfoApi.prototype.getTotalSpace = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getTotalSpace", [AndroidStorageType[e]]);
    };

    return AndroidDeviceInfoApi;
});

