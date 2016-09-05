/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AndroidAdUnitApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.ON_START = 0] = "ON_START";
    Event[Event.ON_CREATE = 1] = "ON_CREATE";
    Event[Event.ON_RESUME = 2] = "ON_RESUME";
    Event[Event.ON_DESTROY = 3] = "ON_DESTROY";
    Event[Event.ON_PAUSE = 4] = "ON_PAUSE";
    Event[Event.KEY_DOWN = 5] = "KEY_DOWN";
    Event[Event.ON_RESTORE = 6] = "ON_RESTORE";
    Event[Event.ON_STOP = 7] = "ON_STOP";

    function AndroidAdUnitApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "AdUnit");

        this.onStart = new Observable();
        this.onCreate = new Observable();
        this.onResume = new Observable();
        this.onDestroy = new Observable();
        this.onPause = new Observable();
        this.onKeyDown = new Observable();
        this.onRestore = new Observable();
        this.onStop = new Observable();
    }
    extend(AndroidAdUnitApi, NativeApi);

    AndroidAdUnitApi.prototype.open = function (activityId, views, orientation, keyevents, systemUiVisibility, hardwareAcceleration) {
        void 0 === keyevents && (keyevents = null);
        void 0 === systemUiVisibility && (systemUiVisibility = 0);
        void 0 === hardwareAcceleration && (hardwareAcceleration = true);
        return this._nativeBridge.invoke(this._apiClass, "open", [activityId, views, orientation, keyevents, systemUiVisibility, hardwareAcceleration]);
    };
    AndroidAdUnitApi.prototype.close = function () {
        return this._nativeBridge.invoke(this._apiClass, "close");
    };
    AndroidAdUnitApi.prototype.setViews = function (views) {
        return this._nativeBridge.invoke(this._apiClass, "setViews", [views]);
    };
    AndroidAdUnitApi.prototype.getViews = function () {
        return this._nativeBridge.invoke(this._apiClass, "getViews");
    };
    AndroidAdUnitApi.prototype.setOrientation = function (orientation) {
        return this._nativeBridge.invoke(this._apiClass, "setOrientation", [orientation]);
    };
    AndroidAdUnitApi.prototype.getOrientation = function () {
        return this._nativeBridge.invoke(this._apiClass, "getOrientation");
    };
    AndroidAdUnitApi.prototype.setKeepScreenOn = function (isOn) {
        return this._nativeBridge.invoke(this._apiClass, "setKeepScreenOn", [isOn]);
    };
    AndroidAdUnitApi.prototype.setSystemUiVisibility = function (visible) {
        return this._nativeBridge.invoke(this._apiClass, "setSystemUiVisibility", [visible]);
    };
    AndroidAdUnitApi.prototype.setKeyEventList = function (list) {
        return this._nativeBridge.invoke(this._apiClass, "setKeyEventList", [list]);
    };
    AndroidAdUnitApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case Event[Event.ON_START]:
                this.onStart.trigger(args[0]);
                break;

            case Event[Event.ON_CREATE]:
                this.onCreate.trigger(args[0]);
                break;

            case Event[Event.ON_RESUME]:
                this.onResume.trigger(args[0]);
                break;

            case Event[Event.ON_DESTROY]:
                this.onDestroy.trigger(args[0], args[1]);
                break;

            case Event[Event.ON_PAUSE]:
                this.onPause.trigger(args[0], args[1]);
                break;

            case Event[Event.KEY_DOWN]:
                this.onKeyDown.trigger(args[0], args[1], args[2], args[3], args[4]);
                break;

            case Event[Event.ON_RESTORE]:
                this.onRestore.trigger(args[0]);
                break;

            case Event[Event.ON_STOP]:
                this.onStop.trigger(args[0]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, args);
        }
    };

    return AndroidAdUnitApi;
});
