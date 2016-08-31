/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AppSheetApi", function (require, t, n) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");
    var AppSheetEvent = require("appsheet.AppSheetEvent");


    function AppSheetApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "AppSheet");

        this.onPrepared = new Observable.Observable1();
        this.onOpen = new Observable.Observable1();
        this.onClose = new Observable.Observable1();
        this.onError = new Observable.Observable2();
    }
    extend(AppSheetApi, NativeApi);

    AppSheetApi.prototype.canOpen = function () {
        return this._nativeBridge.invoke(this._apiClass, "canOpen");
    };
    AppSheetApi.prototype.prepare = function (e, t) {
        void 0 === t && (t = 3e4);
        return this._nativeBridge.invoke(this._apiClass, "prepare", [e, t]);
    };
    AppSheetApi.prototype.present = function (e, t) {
        void 0 === t && (t = true);
        return this._nativeBridge.invoke(this._apiClass, "present", [e, t]);
    };
    AppSheetApi.prototype.destroy = function (e) {
        if("undefined" == typeof e){
            return this._nativeBridge.invoke(this._apiClass, "destroy");
        }else{
            return this._nativeBridge.invoke(this._apiClass, "destroy", [e]);
        }
    };
    AppSheetApi.prototype.setPrepareTimeout = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setPrepareTimeout", [e]);
    };
    AppSheetApi.prototype.getPrepareTimeout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getPrepareTimeout");
    };
    AppSheetApi.prototype.handleEvent = function (t, n) {
        switch (t) {
            case AppSheetEvent[AppSheetEvent.PREPARED]:
                this.onPrepared.trigger(n[0]);
                break;

            case AppSheetEvent[AppSheetEvent.OPENED]:
                this.onOpen.trigger(n[0]);
                break;

            case AppSheetEvent[AppSheetEvent.CLOSED]:
                this.onClose.trigger(n[0]);
                break;

            case AppSheetEvent[AppSheetEvent.FAILED]:
                this.onError.trigger(n[0], n[1]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, t, n);
        }
    };

    return AppSheetApi;
});
