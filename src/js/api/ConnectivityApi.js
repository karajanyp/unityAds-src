/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.ConnectivityApi", function(require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.CONNECTED = 0] = "CONNECTED";
    Event[Event.DISCONNECTED = 1] = "DISCONNECTED";
    Event[Event.NETWORK_CHANGE = 2] = "NETWORK_CHANGE";

    function ConnectivityApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Connectivity");
        this.onConnected = new Observable.Observable2();
        this.onDisconnected = new Observable.Observable0();
    }
    extend(ConnectivityApi, NativeApi);

    ConnectivityApi.prototype.setListeningStatus = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setConnectionMonitoring", [e]);
    };
    ConnectivityApi.prototype.handleEvent = function (e, d) {
        switch (e) {
            case Event[Event.CONNECTED]:
                this.onConnected.trigger(d[0], d[1]);
                break;

            case Event[Event.DISCONNECTED]:
                this.onDisconnected.trigger();
                break;

            case Event[Event.NETWORK_CHANGE]:
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, d);
        }
    };
    return ConnectivityApi;
});