/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.PlacementApi", function (require, t, n) {
    var NativeApi = require("api.NativeApi");
    var PlacementState = require("placement.PlacementState");

    function PlacementApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Placement");
    }
    extend(PlacementApi, NativeApi);

    PlacementApi.prototype.setDefaultPlacement = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setDefaultPlacement", [e]);
    };

    PlacementApi.prototype.setPlacementState = function (e, n) {
        return this._nativeBridge.invoke(this._apiClass, "setPlacementState", [e, PlacementState[n]]);
    };

    PlacementApi.prototype.setPlacementAnalytics = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setPlacementAnalytics", [e]);
    };
    return PlacementApi;
});
