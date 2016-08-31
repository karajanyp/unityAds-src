/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.ListenerApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var FinishState = require("resolve.FinishState");

    function ListenerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Listener");
    }
    extend(ListenerApi, NativeApi);

    ListenerApi.prototype.sendReadyEvent = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "sendReadyEvent", [e]);
    };
    ListenerApi.prototype.sendStartEvent = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "sendStartEvent", [e]);
    };
    ListenerApi.prototype.sendFinishEvent = function (e, n) {
        return this._nativeBridge.invoke(this._apiClass, "sendFinishEvent", [e, FinishState[n]]);
    };
    ListenerApi.prototype.sendErrorEvent = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "sendErrorEvent", [e, t]);
    };

    return ListenerApi;
});
