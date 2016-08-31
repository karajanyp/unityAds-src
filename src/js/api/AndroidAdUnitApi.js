/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AndroidAdUnitApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

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

        this.onStart = new Observable.Observable1();
        this.onCreate = new Observable.Observable1();
        this.onResume = new Observable.Observable1();
        this.onDestroy = new Observable.Observable2();
        this.onPause = new Observable.Observable2();
        this.onKeyDown = new Observable.Observable5();
        this.onRestore = new Observable.Observable1();
        this.onStop = new Observable.Observable1();
    }
    extend(AndroidAdUnitApi, NativeApi);

    AndroidAdUnitApi.prototype.open = function (e, t, n, i, r, o) {
        void 0 === i && (i = null);
        void 0 === r && (r = 0);
        void 0 === o && (o = !0);
        return this._nativeBridge.invoke(this._apiClass, "open", [e, t, n, i, r, o]);
    };
    AndroidAdUnitApi.prototype.close = function () {
        return this._nativeBridge.invoke(this._apiClass, "close");
    };
    AndroidAdUnitApi.prototype.setViews = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setViews", [e]);
    };
    AndroidAdUnitApi.prototype.getViews = function () {
        return this._nativeBridge.invoke(this._apiClass, "getViews");
    };
    AndroidAdUnitApi.prototype.setOrientation = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setOrientation", [e]);
    };
    AndroidAdUnitApi.prototype.getOrientation = function () {
        return this._nativeBridge.invoke(this._apiClass, "getOrientation");
    };
    AndroidAdUnitApi.prototype.setKeepScreenOn = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setKeepScreenOn", [e]);
    };
    AndroidAdUnitApi.prototype.setSystemUiVisibility = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setSystemUiVisibility", [e]);
    };
    AndroidAdUnitApi.prototype.setKeyEventList = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setKeyEventList", [e]);
    };
    AndroidAdUnitApi.prototype.handleEvent = function (t, n) {
        switch (t) {
            case Event[Event.ON_START]:
                this.onStart.trigger(n[0]);
                break;

            case Event[Event.ON_CREATE]:
                this.onCreate.trigger(n[0]);
                break;

            case Event[Event.ON_RESUME]:
                this.onResume.trigger(n[0]);
                break;

            case Event[Event.ON_DESTROY]:
                this.onDestroy.trigger(n[0], n[1]);
                break;

            case Event[Event.ON_PAUSE]:
                this.onPause.trigger(n[0], n[1]);
                break;

            case Event[Event.KEY_DOWN]:
                this.onKeyDown.trigger(n[0], n[1], n[2], n[3], n[4]);
                break;

            case Event[Event.ON_RESTORE]:
                this.onRestore.trigger(n[0]);
                break;

            case Event[Event.ON_STOP]:
                this.onStop.trigger(n[0]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, t, n);
        }
    };

    return AndroidAdUnitApi;
});
