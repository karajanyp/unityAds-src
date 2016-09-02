/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AndroidVideoPlayerApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.INFO = 0] = "INFO";

    function AndroidVideoPlayerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "VideoPlayer");
        this.onInfo = new Observable();
    }
    extend(AndroidVideoPlayerApi, NativeApi);

    AndroidVideoPlayerApi.prototype.setInfoListenerEnabled = function (enabled) {
        return this._nativeBridge.invoke(this._apiClass, "setInfoListenerEnabled", [enabled]);
    };
    AndroidVideoPlayerApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case Event[Event.INFO]:
                this.onInfo.trigger(args[0], args[1], args[2]);
                break;

            default:
                throw new Error("VideoPlayer event " + e + " does not have an observable");
        }
    };
    return AndroidVideoPlayerApi;

});
