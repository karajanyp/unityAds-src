/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AppSheetApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");
    var AppSheetEvent = require("appsheet.AppSheetEvent");


    function AppSheetApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "AppSheet");

        this.onPrepared = new Observable();
        this.onOpen = new Observable();
        this.onClose = new Observable();
        this.onError = new Observable();
    }
    extend(AppSheetApi, NativeApi);

    AppSheetApi.prototype.canOpen = function () {
        return this._nativeBridge.invoke(this._apiClass, "canOpen");
    };
    /**
     *
     * @param parameters {Object}
     * @param timeout    {Number}
     * @returns {Promise}
     */
    AppSheetApi.prototype.prepare = function (parameters, timeout) {
        void 0 === timeout && (timeout = 3e4);
        return this._nativeBridge.invoke(this._apiClass, "prepare", [parameters, timeout]);
    };
    /**
     *
     * @param parameters {Object}
     * @param animated   {Number}
     * @returns {Promise}
     */
    AppSheetApi.prototype.present = function (parameters, animated) {
        void 0 === animated && (animated = true);
        return this._nativeBridge.invoke(this._apiClass, "present", [parameters, animated]);
    };
    /**
     *
     * @param parameters {Object}
     * @returns {Promise}
     */
    AppSheetApi.prototype.destroy = function (parameters) {
        if("undefined" == typeof parameters){
            return this._nativeBridge.invoke(this._apiClass, "destroy");
        }else{
            return this._nativeBridge.invoke(this._apiClass, "destroy", [parameters]);
        }
    };
    /**
     *
     * @param timeout {Number}
     * @returns {Promise}
     */
    AppSheetApi.prototype.setPrepareTimeout = function (timeout) {
        return this._nativeBridge.invoke(this._apiClass, "setPrepareTimeout", [timeout]);
    };
    AppSheetApi.prototype.getPrepareTimeout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getPrepareTimeout");
    };
    AppSheetApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case AppSheetEvent[AppSheetEvent.PREPARED]:
                this.onPrepared.trigger(args[0]);
                break;

            case AppSheetEvent[AppSheetEvent.OPENED]:
                this.onOpen.trigger(args[0]);
                break;

            case AppSheetEvent[AppSheetEvent.CLOSED]:
                this.onClose.trigger(args[0]);
                break;

            case AppSheetEvent[AppSheetEvent.FAILED]:
                this.onError.trigger(args[0], args[1]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, args);
        }
    };

    return AppSheetApi;
});
