/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.VideoPlayerApi", function (require) {
    var NativeApi =             require("api.NativeApi");
    var IosVideoPlayerApi =     require("api.IosVideoPlayerApi");
    var AndroidVideoPlayerApi = require("api.AndroidVideoPlayerApi");
    var Observable =            require("util.observable");
    var Platform =              require("platform.Platform");

    var Event = {};
    Event[Event.GENERIC_ERROR = 0] = "GENERIC_ERROR";
    Event[Event.PROGRESS = 1] = "PROGRESS";
    Event[Event.COMPLETED = 2] = "COMPLETED";
    Event[Event.PREPARED = 3] = "PREPARED";
    Event[Event.PREPARE_ERROR = 4] = "PREPARE_ERROR";
    Event[Event.PLAY = 5] = "PLAY";
    Event[Event.PAUSE_ERROR = 6] = "PAUSE_ERROR";
    Event[Event.PAUSE = 7] = "PAUSE";
    Event[Event.SEEKTO_ERROR = 8] = "SEEKTO_ERROR";
    Event[Event.SEEKTO = 9] = "SEEKTO";
    Event[Event.STOP = 10] = "STOP";
    Event[Event.ILLEGAL_STATE = 11] = "ILLEGAL_STATE";

    function VideoPlayerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "VideoPlayer");
        this.onError = new Observable.Observable3();
        this.onProgress = new Observable.Observable1();
        this.onCompleted = new Observable.Observable1();
        this.onPrepared = new Observable.Observable4();
        this.onPlay = new Observable.Observable1();
        this.onPause = new Observable.Observable1();
        this.onSeek = new Observable.Observable1();
        this.onStop = new Observable.Observable1();

        if(nativeBridge.getPlatform() === Platform.IOS){
            this.Ios = new IosVideoPlayerApi(nativeBridge);
        }else if(nativeBridge.getPlatform() === Platform.ANDROID){
            this.Android = new AndroidVideoPlayerApi(nativeBridge);
        }
    }
    extend(VideoPlayerApi, NativeApi);

    VideoPlayerApi.prototype.setProgressEventInterval = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setProgressEventInterval", [e]);
    };
    VideoPlayerApi.prototype.getProgressEventInterval = function () {
        return this._nativeBridge.invoke(this._apiClass, "getProgressEventInterval");
    };
    VideoPlayerApi.prototype.prepare = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "prepare", [e, t]);
    };
    VideoPlayerApi.prototype.play = function () {
        return this._nativeBridge.invoke(this._apiClass, "play");
    };
    VideoPlayerApi.prototype.pause = function () {
        return this._nativeBridge.invoke(this._apiClass, "pause");
    };
    VideoPlayerApi.prototype.stop = function () {
        return this._nativeBridge.invoke(this._apiClass, "stop");
    };
    VideoPlayerApi.prototype.seekTo = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "seekTo", [e]);
    };
    VideoPlayerApi.prototype.getCurrentPosition = function () {
        return this._nativeBridge.invoke(this._apiClass, "getCurrentPosition");
    };
    VideoPlayerApi.prototype.getVolume = function () {
        return this._nativeBridge.invoke(this._apiClass, "getVolume");
    };
    VideoPlayerApi.prototype.setVolume = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setVolume", [e]);
    };
    VideoPlayerApi.prototype.handleEvent = function (e, t) {
        switch (e) {
            case Event[Event.GENERIC_ERROR]:
                this.onError.trigger(t[0], t[1], t[2]);
                break;

            case Event[Event.PROGRESS]:
                this.onProgress.trigger(t[0]);
                break;

            case Event[Event.COMPLETED]:
                this.onCompleted.trigger(t[0]);
                break;

            case Event[Event.PREPARED]:
                this.onPrepared.trigger(t[0], t[1], t[2], t[3]);
                break;

            case Event[Event.PLAY]:
                this.onPlay.trigger(t[0]);
                break;

            case Event[Event.PAUSE]:
                this.onPause.trigger(t[0]);
                break;

            case Event[Event.SEEKTO]:
                this.onSeek.trigger(t[0]);
                break;

            case Event[Event.STOP]:
                this.onStop.trigger(t[0]);
                break;

            default:
                if(this._nativeBridge.getPlatform() === Platform.IOS){
                    this.Ios.handleEvent(e, t);
                }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
                    this.Android.handleEvent(e, t);
                }
        }
    };
    return VideoPlayerApi;
});
