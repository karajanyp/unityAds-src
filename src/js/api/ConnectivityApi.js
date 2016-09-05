/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.ConnectivityApi", function(require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.CONNECTED = 0] = "CONNECTED";
    Event[Event.DISCONNECTED = 1] = "DISCONNECTED";
    Event[Event.NETWORK_CHANGE = 2] = "NETWORK_CHANGE";

    function ConnectivityApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Connectivity");
        this.onConnected = new Observable();
        this.onDisconnected = new Observable();
    }
    extend(ConnectivityApi, NativeApi);

    /**
     *
     * @param monitoring {Boolean}
     * @returns {Promise}
     */
    ConnectivityApi.prototype.setListeningStatus = function (monitoring) {
        return this._nativeBridge.invoke(this._apiClass, "setConnectionMonitoring", [monitoring]);
    };
    ConnectivityApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case Event[Event.CONNECTED]:
                this.onConnected.trigger(args[0], args[1]);
                break;

            case Event[Event.DISCONNECTED]:
                this.onDisconnected.trigger();
                break;

            case Event[Event.NETWORK_CHANGE]:
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, args);
        }
    };
    return ConnectivityApi;
});