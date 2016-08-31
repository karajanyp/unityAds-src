/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.IosAdUnitApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.VIEW_CONTROLLER_INIT = 0] = "VIEW_CONTROLLER_INIT";
    Event[Event.VIEW_CONTROLLER_DID_LOAD = 1] = "VIEW_CONTROLLER_DID_LOAD";
    Event[Event.VIEW_CONTROLLER_DID_APPEAR = 2] = "VIEW_CONTROLLER_DID_APPEAR";
    Event[Event.VIEW_CONTROLLER_WILL_DISAPPEAR = 3] = "VIEW_CONTROLLER_WILL_DISAPPEAR";
    Event[Event.VIEW_CONTROLLER_DID_DISAPPEAR = 4] = "VIEW_CONTROLLER_DID_DISAPPEAR";
    Event[Event.VIEW_CONTROLLER_DID_RECEIVE_MEMORY_WARNING = 5] = "VIEW_CONTROLLER_DID_RECEIVE_MEMORY_WARNING";

    function IosAdUnitApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "AdUnit");

        this.onViewControllerInit = new Observable.Observable0();
        this.onViewControllerDidLoad = new Observable.Observable0();
        this.onViewControllerDidAppear = new Observable.Observable0();
        this.onViewControllerWillDisappear = new Observable.Observable0();
        this.onViewControllerDidDisappear = new Observable.Observable0();
        this.onViewControllerDidReceiveMemoryWarning = new Observable.Observable0();
    }
    extend(IosAdUnitApi, NativeApi);

    IosAdUnitApi.prototype.open = function (e, t, n, i) {
        return this._nativeBridge.invoke(this._apiClass, "open", [e, t, n, i]);
    };
    IosAdUnitApi.prototype.close = function () {
        return this._nativeBridge.invoke(this._apiClass, "close");
    };
    IosAdUnitApi.prototype.setViews = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setViews", [e]);
    };
    IosAdUnitApi.prototype.getViews = function () {
        return this._nativeBridge.invoke(this._apiClass, "getViews");
    };
    IosAdUnitApi.prototype.setSupportedOrientations = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setSupportedOrientations", [e]);
    };
    IosAdUnitApi.prototype.getSupportedOrientations = function () {
        return this._nativeBridge.invoke(this._apiClass, "getSupportedOrientations");
    };
    IosAdUnitApi.prototype.setKeepScreenOn = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setKeepScreenOn", [e]);
    };
    IosAdUnitApi.prototype.setStatusBarHidden = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setStatusBarHidden", [e]);
    };
    IosAdUnitApi.prototype.getStatusBarHidden = function () {
        return this._nativeBridge.invoke(this._apiClass, "getStatusBarHidden");
    };
    IosAdUnitApi.prototype.setShouldAutorotate = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setShouldAutorotate", [e]);
    };
    IosAdUnitApi.prototype.getShouldAutorotate = function () {
        return this._nativeBridge.invoke(this._apiClass, "getShouldAutorotate");
    };
    IosAdUnitApi.prototype.handleEvent = function (t, n) {
        switch (t) {
            case Event[Event.VIEW_CONTROLLER_INIT]:
                this.onViewControllerInit.trigger();
                break;

            case Event[Event.VIEW_CONTROLLER_DID_LOAD]:
                this.onViewControllerDidLoad.trigger();
                break;

            case Event[Event.VIEW_CONTROLLER_DID_APPEAR]:
                this.onViewControllerDidAppear.trigger();
                break;

            case Event[Event.VIEW_CONTROLLER_WILL_DISAPPEAR]:
                this.onViewControllerWillDisappear.trigger();
                break;

            case Event[Event.VIEW_CONTROLLER_DID_DISAPPEAR]:
                this.onViewControllerDidDisappear.trigger();
                break;

            case Event[Event.VIEW_CONTROLLER_DID_RECEIVE_MEMORY_WARNING]:
                this.onViewControllerDidReceiveMemoryWarning.trigger();
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, t, n);
        }
    };
    return IosAdUnitApi;
});
