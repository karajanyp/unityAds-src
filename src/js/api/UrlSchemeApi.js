/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.UrlSchemeApi", function (require) {
    var NativeApi = require("api.NativeApi");

    function UrlSchemeApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "UrlScheme");
    }
    extend(UrlSchemeApi, NativeApi);

    UrlSchemeApi.prototype.open = function (url) {
        return this._nativeBridge.invoke(this._apiClass, "open", [url]);
    };
    return UrlSchemeApi;
});
