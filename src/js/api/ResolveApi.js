/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.ResolveApi", function (require, t, n) {
    var NativeApi = require("api.NativeApi");
    var ResolveEvent = require("resolve.ResolveEvent");
    var Observable = require("util.Observable");

    function ResolveApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Resolve");
        this.onComplete = new Observable();
        this.onFailed = new Observable();
    }
    extend(ResolveApi, NativeApi);

    ResolveApi.prototype.resolve = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "resolve", [e, t]);
    };
    ResolveApi.prototype.handleEvent = function (t, n) {
        switch (t) {
            case ResolveEvent[ResolveEvent.COMPLETE]:
                this.onComplete.trigger(n[0], n[1], n[2]);
                break;

            case ResolveEvent[ResolveEvent.FAILED]:
                this.onFailed.trigger(n[0], n[1], n[2], n[3]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, t, n);
        }
    };
    return ResolveApi;
});
