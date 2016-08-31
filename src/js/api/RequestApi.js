/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.RequestApi", function (require) {
    var Platform = require("platform.Platform");
    var NativeApi = require("api.NativeApi");
    var RequestEvent = require("request.RequestEvent");

    function RequestApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Request");
        this.onComplete = new t.Observable5();
        this.onFailed = new t.Observable3();
    }
    extend(RequestApi, NativeApi);

    RequestApi.prototype.get = function (e, t, n, r, o) {
        return this._nativeBridge.getPlatform() === Platform.IOS ?
            this._nativeBridge.invoke(this._apiClass, "get", [e, t, n, r]) :
            this._nativeBridge.invoke(this._apiClass, "get", [e, t, n, r, o]);
    };
    RequestApi.prototype.post = function (e, t, n, r, o, a) {
        return this._nativeBridge.getPlatform() === Platform.IOS ?
            this._nativeBridge.invoke(this._apiClass, "post", [e, t, n, r, o]) :
            this._nativeBridge.invoke(this._apiClass, "post", [e, t, n, r, o, a]);
    };
    RequestApi.prototype.head = function (e, t, n, r, o) {
        return this._nativeBridge.getPlatform() === Platform.IOS ?
            this._nativeBridge.invoke(this._apiClass, "head", [e, t, n, r]) :
            this._nativeBridge.invoke(this._apiClass, "head", [e, t, n, r, o]);
    };
    RequestApi.prototype.setConnectTimeout = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setConnectTimeout", [e]);
    };
    RequestApi.prototype.getConnectTimeout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getConnectTimeout");
    };
    RequestApi.prototype.setReadTimeout = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setReadTimeout", [e]);
    };
    RequestApi.prototype.getReadTimeout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getReadTimeout");
    };
    RequestApi.prototype.handleEvent = function (e, d) {
        switch (e) {
            case RequestEvent[RequestEvent.COMPLETE]:
                this.onComplete.trigger(d[0], d[1], d[2], d[3], d[4]);
                break;

            case RequestEvent[RequestEvent.FAILED]:
                this.onFailed.trigger(d[0], d[1], d[2]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, d);
        }
    };
    return RequestApi;
});