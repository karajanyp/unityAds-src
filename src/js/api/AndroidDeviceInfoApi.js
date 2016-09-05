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
    AndroidDeviceInfoApi.prototype.isAppInstalled = function (isInstalled) {
        return this._nativeBridge.invoke(this._apiClass, "isAppInstalled", [isInstalled]);
    };
    AndroidDeviceInfoApi.prototype.getInstalledPackages = function (packages) {
        return this._nativeBridge.invoke(this._apiClass, "getInstalledPackages", [packages]);
    };
    AndroidDeviceInfoApi.prototype.getSystemProperty = function (propertyName, defaultValue) {
        return this._nativeBridge.invoke(this._apiClass, "getSystemProperty", [propertyName, defaultValue]);
    };
    AndroidDeviceInfoApi.prototype.getRingerMode = function () {
        return this._nativeBridge.invoke(this._apiClass, "getRingerMode");
    };
    AndroidDeviceInfoApi.prototype.getDeviceVolume = function (streamType) {
        return this._nativeBridge.invoke(this._apiClass, "getDeviceVolume", [streamType]);
    };
    AndroidDeviceInfoApi.prototype.getFreeSpace = function (storageType) {
        return this._nativeBridge.invoke(this._apiClass, "getFreeSpace", [AndroidStorageType[storageType]]);
    };
    AndroidDeviceInfoApi.prototype.getTotalSpace = function (storageType) {
        return this._nativeBridge.invoke(this._apiClass, "getTotalSpace", [AndroidStorageType[storageType]]);
    };

    return AndroidDeviceInfoApi;
});

