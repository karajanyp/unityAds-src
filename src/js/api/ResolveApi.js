/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.ResolveApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var ResolveEvent = require("resolve.ResolveEvent");
    var Observable = require("util.Observable");

    function ResolveApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Resolve");
        this.onComplete = new Observable();
        this.onFailed = new Observable();
    }
    extend(ResolveApi, NativeApi);

    /**
     *
     * @param id    {String}
     * @param host  {String}
     * @returns {Promise}
     */
    ResolveApi.prototype.resolve = function (id, host) {
        return this._nativeBridge.invoke(this._apiClass, "resolve", [id, host]);
    };
    ResolveApi.prototype.handleEvent = function (e, arg) {
        switch (e) {
            case ResolveEvent[ResolveEvent.COMPLETE]:
                this.onComplete.trigger(arg[0], arg[1], arg[2]);
                break;

            case ResolveEvent[ResolveEvent.FAILED]:
                this.onFailed.trigger(arg[0], arg[1], arg[2], arg[3]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, arg);
        }
    };
    return ResolveApi;
});
