/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AndroidVideoPlayerApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.INFO = 0] = "INFO";

    function AndroidVideoPlayerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "VideoPlayer");
        this.onInfo = new Observable.Observable3();
    }
    extend(AndroidVideoPlayerApi, NativeApi);

    AndroidVideoPlayerApi.prototype.setInfoListenerEnabled = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setInfoListenerEnabled", [e]);
    };
    AndroidVideoPlayerApi.prototype.handleEvent = function (e, d) {
        switch (e) {
            case Event[Event.INFO]:
                this.onInfo.trigger(d[0], d[1], d[2]);
                break;

            default:
                throw new Error("VideoPlayer event " + e + " does not have an observable");
        }
    };
    return AndroidVideoPlayerApi;

});
