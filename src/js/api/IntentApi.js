/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.IntentApi", function (require) {
    var NativeApi = require("api.NativeApi");

    function IntentApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Intent");
    }
    extend(IntentApi, NativeApi);

    IntentApi.prototype.launch = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "launch", [e]);
    };
    return IntentApi;
});
