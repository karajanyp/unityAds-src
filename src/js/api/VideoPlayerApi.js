/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.VideoPlayerApi", function (require) {
    var NativeApi =             require("api.NativeApi");
    var IosVideoPlayerApi =     require("api.IosVideoPlayerApi");
    var AndroidVideoPlayerApi = require("api.AndroidVideoPlayerApi");
    var Observable =            require("util.Observable");
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
        this.onError = new Observable();
        this.onProgress = new Observable();
        this.onCompleted = new Observable();
        this.onPrepared = new Observable();
        this.onPlay = new Observable();
        this.onPause = new Observable();
        this.onSeek = new Observable();
        this.onStop = new Observable();

        if(nativeBridge.getPlatform() === Platform.IOS){
            this.Ios = new IosVideoPlayerApi(nativeBridge);
        }else if(nativeBridge.getPlatform() === Platform.ANDROID){
            this.Android = new AndroidVideoPlayerApi(nativeBridge);
        }
    }
    extend(VideoPlayerApi, NativeApi);

    /**
     *
     * @param milliseconds {Number}
     * @returns {Promise}
     */
    VideoPlayerApi.prototype.setProgressEventInterval = function (milliseconds) {
        return this._nativeBridge.invoke(this._apiClass, "setProgressEventInterval", [milliseconds]);
    };
    VideoPlayerApi.prototype.getProgressEventInterval = function () {
        return this._nativeBridge.invoke(this._apiClass, "getProgressEventInterval");
    };
    /**
     *
     * @param url           {String}
     * @param initialVolume {Double}
     * @returns {Promise}
     */
    VideoPlayerApi.prototype.prepare = function (url, initialVolume) {
        return this._nativeBridge.invoke(this._apiClass, "prepare", [url, initialVolume]);
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
    /**
     *
     * @param time {Number}
     * @returns {Promise}
     */
    VideoPlayerApi.prototype.seekTo = function (time) {
        return this._nativeBridge.invoke(this._apiClass, "seekTo", [time]);
    };
    VideoPlayerApi.prototype.getCurrentPosition = function () {
        return this._nativeBridge.invoke(this._apiClass, "getCurrentPosition");
    };
    VideoPlayerApi.prototype.getVolume = function () {
        return this._nativeBridge.invoke(this._apiClass, "getVolume");
    };
    /**
     *
     * @param volume {Double}
     * @returns {Promise}
     */
    VideoPlayerApi.prototype.setVolume = function (volume) {
        return this._nativeBridge.invoke(this._apiClass, "setVolume", [volume]);
    };
    VideoPlayerApi.prototype.handleEvent = function (e, arg) {
        switch (e) {
            case Event[Event.GENERIC_ERROR]:
                this.onError.trigger(arg[0], arg[1], arg[2]);
                break;

            case Event[Event.PROGRESS]:
                this.onProgress.trigger(arg[0]);
                break;

            case Event[Event.COMPLETED]:
                this.onCompleted.trigger(arg[0]);
                break;

            case Event[Event.PREPARED]:
                this.onPrepared.trigger(arg[0], arg[1], arg[2], arg[3]);
                break;

            case Event[Event.PLAY]:
                this.onPlay.trigger(arg[0]);
                break;

            case Event[Event.PAUSE]:
                this.onPause.trigger(arg[0]);
                break;

            case Event[Event.SEEKTO]:
                this.onSeek.trigger(arg[0]);
                break;

            case Event[Event.STOP]:
                this.onStop.trigger(arg[0]);
                break;

            default:
                if(this._nativeBridge.getPlatform() === Platform.IOS){
                    this.Ios.handleEvent(e, arg);
                }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
                    this.Android.handleEvent(e, arg);
                }
        }
    };
    return VideoPlayerApi;
});
