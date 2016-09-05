/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.SdkApi", function (require) {
    var NativeApi = require("api.NativeApi");

    function SdkApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Sdk");
    }
    extend(SdkApi, NativeApi);
    SdkApi.prototype.loadComplete = function () {
        return this._nativeBridge.invoke(this._apiClass, "loadComplete");
    };
    SdkApi.prototype.initComplete = function () {
        return this._nativeBridge.invoke(this._apiClass, "initComplete");
    };
    SdkApi.prototype.setDebugMode = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setDebugMode", [e]);
    };
    SdkApi.prototype.getDebugMode = function () {
        return this._nativeBridge.invoke(this._apiClass, "getDebugMode");
    };
    SdkApi.prototype.logError = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "logError", [e]);
    };
    SdkApi.prototype.logWarning = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "logWarning", [e]);
    };
    SdkApi.prototype.logInfo = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "logInfo", [e]);
    };
    SdkApi.prototype.logDebug = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "logDebug", [e]);
    };
    SdkApi.prototype.setShowTimeout = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setShowTimeout", [e]);
    };
    SdkApi.prototype.reinitialize = function () {
        this._nativeBridge.invoke(this._apiClass, "reinitialize");
    };
    return SdkApi;
});
