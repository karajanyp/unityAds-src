/**
 * Created by duo on 2016/8/31.
 *
 * Android only
 */
CMD.register("api.BroadcastApi", function(require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.ACTION = 0] = "ACTION";


    function BroadcastApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Broadcast");
        this.onBroadcastAction = new Observable();
    }
    extend(BroadcastApi, NativeApi);
    BroadcastApi.prototype.addBroadcastListener = function (name, actions) {
        return this._nativeBridge.invoke(this._apiClass, "addBroadcastListener", [name, actions]);
    };
    BroadcastApi.prototype.addDataSchemeBroadcastListener = function (name, scheme, actions) {
        return this._nativeBridge.invoke(this._apiClass, "addBroadcastListener", [name, scheme, actions]);
    };
    BroadcastApi.prototype.removeBroadcastListener = function (name) {
        return this._nativeBridge.invoke(this._apiClass, "removeBroadcastListener", [name]);
    };
    BroadcastApi.prototype.removeAllBroadcastListeners = function () {
        return this._nativeBridge.invoke(this._apiClass, "removeAllBroadcastListeners", []);
    };
    BroadcastApi.prototype.handleEvent = function (e, args) {
        if(e === Event[Event.ACTION]){
            //name action data extra
            this.onBroadcastAction.trigger(args[0], args[1], args[2], args[3])
        }else{
            NativeApi.prototype.handleEvent.call(this, e, args);
        }


    };
    return BroadcastApi;
});
