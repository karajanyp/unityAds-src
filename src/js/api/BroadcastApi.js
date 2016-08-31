/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.BroadcastApi", function(require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.ACTION = 0] = "ACTION";


    function BroadcastApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Broadcast");
        this.onBroadcastAction = new Observable.Observable4();
    }
    extend(BroadcastApi, NativeApi);
    BroadcastApi.prototype.addBroadcastListener = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "addBroadcastListener", [e, t]);
    };
    BroadcastApi.prototype.addDataSchemeBroadcastListener = function (e, t, n) {
        return this._nativeBridge.invoke(this._apiClass, "addBroadcastListener", [e, t, n]);
    };
    BroadcastApi.prototype.removeBroadcastListener = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "removeBroadcastListener", [e]);
    };
    BroadcastApi.prototype.removeAllBroadcastListeners = function () {
        return this._nativeBridge.invoke(this._apiClass, "removeAllBroadcastListeners", []);
    };
    BroadcastApi.prototype.handleEvent = function (e, data) {
        if(e === Event[Event.ACTION]){
            this.onBroadcastAction.trigger(data[0], data[1], data[2], data[3])
        }else{
            NativeApi.prototype.handleEvent.call(this, e, data);
        }


    };
    return BroadcastApi;
});
