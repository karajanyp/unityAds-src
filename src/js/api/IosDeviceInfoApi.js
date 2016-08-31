/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.IosDeviceInfoApi", function (require) {
    var NativeApi = require("api.NativeApi");

    function IosDeviceInfoApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "DeviceInfo");
    }
    extend(IosDeviceInfoApi, NativeApi);

    IosDeviceInfoApi.prototype.getScreenScale = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenScale");
    };
    IosDeviceInfoApi.prototype.getUserInterfaceIdiom = function () {
        return this._nativeBridge.invoke(this._apiClass, "getUserInterfaceIdiom");
    };
    IosDeviceInfoApi.prototype.getDeviceVolume = function () {
        return this._nativeBridge.invoke(this._apiClass, "getDeviceVolume");
    };
    IosDeviceInfoApi.prototype.getFreeSpace = function () {
        return this._nativeBridge.invoke(this._apiClass, "getFreeSpace");
    };
    IosDeviceInfoApi.prototype.getTotalSpace = function () {
        return this._nativeBridge.invoke(this._apiClass, "getTotalSpace");
    };
    IosDeviceInfoApi.prototype.isSimulator = function () {
        return this._nativeBridge.invoke(this._apiClass, "isSimulator");
    };
    IosDeviceInfoApi.prototype.isAppleWatchPaired = function () {
        return this._nativeBridge.invoke(this._apiClass, "isAppleWatchPaired");
    };

    return IosDeviceInfoApi;
});