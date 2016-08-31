/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.IosVideoPlayerApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.LIKELY_TO_KEEP_UP = 0] = "LIKELY_TO_KEEP_UP";
    Event[Event.BUFFER_EMPTY = 1] = "BUFFER_EMPTY";
    Event[Event.BUFFER_FULL = 2] = "BUFFER_FULL";

    function IosVideoPlayerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "VideoPlayer");
        this.onLikelyToKeepUp = new Observable.Observable2();
        this.onBufferEmpty = new Observable.Observable2();
        this.onBufferFull = new Observable.Observable2();
    }
    extend(IosVideoPlayerApi, NativeApi);

    IosVideoPlayerApi.prototype.handleEvent = function (e, d) {
        switch (e) {
            case Event[Event.LIKELY_TO_KEEP_UP]:
                this.onLikelyToKeepUp.trigger(d[0], d[1]);
                break;

            case Event[Event.BUFFER_EMPTY]:
                this.onBufferEmpty.trigger(d[0], d[1]);
                break;

            case Event[Event.BUFFER_FULL]:
                this.onBufferFull.trigger(d[0], d[1]);
                break;

            default:
                throw new Error("VideoPlayer event " + e + " does not have an observable");
        }
    };
    return IosVideoPlayerApi;
});