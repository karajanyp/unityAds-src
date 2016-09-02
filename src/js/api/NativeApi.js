/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.NativeApi", function() {
    function NativeApi(nativeBridge, apiClass) {
        this._nativeBridge = nativeBridge;
        this._apiClass = apiClass;
    }
    NativeApi.prototype.handleEvent = function (e, args) {
        throw new Error(this._apiClass + " event " + e + " does not have an observable");
    };
    return NativeApi;
});
