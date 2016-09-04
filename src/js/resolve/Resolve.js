/**
 * Created by duo on 2016/9/1.
 */
CMD.register("resolve.Resolve", function () {
    function Resolve(nativeBridge) {
        this._nativeBridge = nativeBridge;
        this._nativeBridge.Resolve.onComplete.subscribe(function (callbackId, host, address) {
            return Resolve.onResolveComplete(callbackId, host, address);
        });
        this._nativeBridge.Resolve.onFailed.subscribe(function (callbackId, host, errorName, errorMsg) {
            return Resolve.onResolveFailed(callbackId, host, errorName, errorMsg);
        });
    }
    Resolve.onResolveComplete = function (callbackId, host, address) {
        var callback = Resolve._callbacks[callbackId];
        if(callback){
            callback[0]([host, address]);
            delete Resolve._callbacks[callbackId];
        }
    };
    Resolve.onResolveFailed = function (callbackId, host, errorName, errorMsg) {
        var callback = Resolve._callbacks[callbackId];
        if(callback){
            callback[1]([errorName, errorMsg]);
            delete Resolve._callbacks[callbackId];
        }
    };
    Resolve.prototype.resolve = function (host) {
        var callbackId = Resolve._callbackId++,
            promise = this.registerCallback(callbackId);
        this._nativeBridge.Resolve.resolve(callbackId.toString(), host);
        return promise;
    };
    Resolve.prototype.registerCallback = function (callbackId) {
        return new Promise(function (resolve, reject) {
            var callback = {};
            callback[0] = resolve;
            callback[1] = reject;
            Resolve._callbacks[callbackId] = callback;
        });
    };
    Resolve._callbackId = 1;
    Resolve._callbacks = {};
    return Resolve;
});
