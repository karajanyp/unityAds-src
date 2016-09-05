/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.ListenerApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var FinishState = require("FinishState");

    function ListenerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Listener");
    }
    extend(ListenerApi, NativeApi);
    /**
     *
     * @param placementId {String}
     * @returns {Promise}
     */
    ListenerApi.prototype.sendReadyEvent = function (placementId) {
        return this._nativeBridge.invoke(this._apiClass, "sendReadyEvent", [placementId]);
    };
    /**
     *
     * @param placementId {String}
     * @returns {Promise}
     */
    ListenerApi.prototype.sendStartEvent = function (placementId) {
        return this._nativeBridge.invoke(this._apiClass, "sendStartEvent", [placementId]);
    };
    /**
     * 
     * @param placementId {String}
     * @param resultState {String}
     * @returns {Promise}
     */
    ListenerApi.prototype.sendFinishEvent = function (placementId, resultState) {
        return this._nativeBridge.invoke(this._apiClass, "sendFinishEvent", [placementId, FinishState[resultState]]);
    };
    /**
     *
     * @param error {String} AdsErrorCode
     * @param message {String}
     * @returns {Promise}
     */
    ListenerApi.prototype.sendErrorEvent = function (error, message) {
        return this._nativeBridge.invoke(this._apiClass, "sendErrorEvent", [error, message]);
    };

    return ListenerApi;
});
