/**
 * Created by duo on 2016/9/1.
 */
CMD.register("resolve.Resolve", function () {
    function Resolve(nativeBridge) {
        this._nativeBridge = nativeBridge;
        this._nativeBridge.Resolve.onComplete.subscribe(function (t, n, i) {
            return Resolve.onResolveComplete(t, n, i);
        });
        this._nativeBridge.Resolve.onFailed.subscribe(function (t, n, i, r) {
            return Resolve.onResolveFailed(t, n, i, r);
        });
    }
    Resolve.onResolveComplete = function (t, n, i) {
        var r = Resolve._callbacks[t];
        if(r){
            r[0]([n, i]);
            delete Resolve._callbacks[t];
        }
    };
    Resolve.onResolveFailed = function (t, n, i, r) {
        var o = Resolve._callbacks[t];
        if(o){
            o[1]([i, r]);
            delete Resolve._callbacks[t];
        }
    };
    Resolve.prototype.resolve = function (t) {
        var n = Resolve._callbackId++,
            i = this.registerCallback(n);
        this._nativeBridge.Resolve.resolve(n.toString(), t);
        return i;
    };
    Resolve.prototype.registerCallback = function (t) {
        return new Promise(function (n, i) {
            var r = {};
            r[0] = n;
            r[1] = i;
            Resolve._callbacks[t] = r;
        });
    };
    Resolve._callbackId = 1;
    Resolve._callbacks = {};
    return Resolve;
});
