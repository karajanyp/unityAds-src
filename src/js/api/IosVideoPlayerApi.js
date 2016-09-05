/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.IosVideoPlayerApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.LIKELY_TO_KEEP_UP = 0] = "LIKELY_TO_KEEP_UP";
    Event[Event.BUFFER_EMPTY = 1] = "BUFFER_EMPTY";
    Event[Event.BUFFER_FULL = 2] = "BUFFER_FULL";

    function IosVideoPlayerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "VideoPlayer");
        this.onLikelyToKeepUp = new Observable();
        this.onBufferEmpty = new Observable();
        this.onBufferFull = new Observable();
    }
    extend(IosVideoPlayerApi, NativeApi);

    IosVideoPlayerApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case Event[Event.LIKELY_TO_KEEP_UP]:
                this.onLikelyToKeepUp.trigger(args[0], args[1]);
                break;

            case Event[Event.BUFFER_EMPTY]:
                this.onBufferEmpty.trigger(args[0], args[1]);
                break;

            case Event[Event.BUFFER_FULL]:
                this.onBufferFull.trigger(args[0], args[1]);
                break;

            default:
                throw new Error("VideoPlayer event " + e + " does not have an observable");
        }
    };
    return IosVideoPlayerApi;
});