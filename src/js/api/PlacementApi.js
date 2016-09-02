/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.PlacementApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var PlacementState = require("placement.PlacementState");

    function PlacementApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Placement");
    }
    extend(PlacementApi, NativeApi);

    /**
     *
     * @param placement {String}
     * @returns {Promise}
     */
    PlacementApi.prototype.setDefaultPlacement = function (placement) {
        return this._nativeBridge.invoke(this._apiClass, "setDefaultPlacement", [placement]);
    };
    /**
     *
     * @param placement {String}
     * @param placementState {Number}
     * @returns {*}
     */
    PlacementApi.prototype.setPlacementState = function (placement, placementState) {
        return this._nativeBridge.invoke(this._apiClass, "setPlacementState", [placement, PlacementState[placementState]]);
    };

    PlacementApi.prototype.setPlacementAnalytics = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setPlacementAnalytics", [e]);
    };
    return PlacementApi;
});
