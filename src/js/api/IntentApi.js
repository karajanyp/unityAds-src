/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.IntentApi", function (require) {
    var NativeApi = require("api.NativeApi");

    function IntentApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Intent");
    }
    extend(IntentApi, NativeApi);

    IntentApi.prototype.launch = function (intentData) {
        return this._nativeBridge.invoke(this._apiClass, "launch", [intentData]);
    };
    return IntentApi;
});
