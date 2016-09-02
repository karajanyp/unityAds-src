/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.IosAdUnitApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.VIEW_CONTROLLER_INIT = 0] = "VIEW_CONTROLLER_INIT";
    Event[Event.VIEW_CONTROLLER_DID_LOAD = 1] = "VIEW_CONTROLLER_DID_LOAD";
    Event[Event.VIEW_CONTROLLER_DID_APPEAR = 2] = "VIEW_CONTROLLER_DID_APPEAR";
    Event[Event.VIEW_CONTROLLER_WILL_DISAPPEAR = 3] = "VIEW_CONTROLLER_WILL_DISAPPEAR";
    Event[Event.VIEW_CONTROLLER_DID_DISAPPEAR = 4] = "VIEW_CONTROLLER_DID_DISAPPEAR";
    Event[Event.VIEW_CONTROLLER_DID_RECEIVE_MEMORY_WARNING = 5] = "VIEW_CONTROLLER_DID_RECEIVE_MEMORY_WARNING";

    function IosAdUnitApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "AdUnit");

        this.onViewControllerInit = new Observable();
        this.onViewControllerDidLoad = new Observable();
        this.onViewControllerDidAppear = new Observable();
        this.onViewControllerWillDisappear = new Observable();
        this.onViewControllerDidDisappear = new Observable();
        this.onViewControllerDidReceiveMemoryWarning = new Observable();
    }
    extend(IosAdUnitApi, NativeApi);
    /**
     *
     * @param views                 {Array}
     * @param supportedOrientations {Number}
     * @param statusBarHidden       {Number}
     * @param shouldAutorotate      {Number}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.open = function (views, supportedOrientations, statusBarHidden, shouldAutorotate) {
        return this._nativeBridge.invoke(this._apiClass, "open", [views, supportedOrientations, statusBarHidden, shouldAutorotate]);
    };
    IosAdUnitApi.prototype.close = function () {
        return this._nativeBridge.invoke(this._apiClass, "close");
    };
    /**
     *
     * @param views {Array}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.setViews = function (views) {
        return this._nativeBridge.invoke(this._apiClass, "setViews", [views]);
    };
    IosAdUnitApi.prototype.getViews = function () {
        return this._nativeBridge.invoke(this._apiClass, "getViews");
    };
    /**
     *
     * @param orientations {Number}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.setSupportedOrientations = function (orientations) {
        return this._nativeBridge.invoke(this._apiClass, "setSupportedOrientations", [orientations]);
    };
    IosAdUnitApi.prototype.getSupportedOrientations = function () {
        return this._nativeBridge.invoke(this._apiClass, "getSupportedOrientations");
    };
    /**
     *
     * @param screenOn {Number}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.setKeepScreenOn = function (screenOn) {
        return this._nativeBridge.invoke(this._apiClass, "setKeepScreenOn", [screenOn]);
    };
    /**
     *
     * @param hidden {Number}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.setStatusBarHidden = function (hidden) {
        return this._nativeBridge.invoke(this._apiClass, "setStatusBarHidden", [hidden]);
    };
    IosAdUnitApi.prototype.getStatusBarHidden = function () {
        return this._nativeBridge.invoke(this._apiClass, "getStatusBarHidden");
    };
    /**
     *
     * @param autorotate {Number}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.setShouldAutorotate = function (autorotate) {
        return this._nativeBridge.invoke(this._apiClass, "setShouldAutorotate", [autorotate]);
    };
    IosAdUnitApi.prototype.getShouldAutorotate = function () {
        return this._nativeBridge.invoke(this._apiClass, "getShouldAutorotate");
    };
    IosAdUnitApi.prototype.handleEvent = function (e, args) {
        switch (e) {
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
                NativeApi.prototype.handleEvent.call(this, e, args);
        }
    };
    return IosAdUnitApi;
});
