/**
 * Created by duo on 2016/8/31.
 */

CMD.register("webview.bridge.BatchInvocation", function(require){
    var Platform = require("platform.Platform");

    function BatchInvocation(nativeBridge) {
        this._batch = [];
        this._nativeBridge = nativeBridge;
    }
    BatchInvocation.prototype.queue = function (apiClass, method, args) {
        void 0 === args && (args = []);
        switch (this._nativeBridge.getPlatform()) {
            case Platform.ANDROID:
                return this.rawQueue("com.unity3d.ads.api." + apiClass, method, args);

            case Platform.IOS:
                return this.rawQueue("UADSApi" + apiClass, method, args);

            default:
                return this.rawQueue(apiClass, method, args);
        }
    };
    BatchInvocation.prototype.rawQueue = function (apiClass, method, args) {
        var me = this;
        void 0 === args && (args = []);
        return new Promise(function (resolve, reject) {
            var jsCallbackId = me._nativeBridge.registerCallback(resolve, reject);
            me._batch.push([apiClass, method, args, jsCallbackId.toString()]);
        });
    };
    BatchInvocation.prototype.getBatch = function () {
        return this._batch;
    };

    return BatchInvocation;
});
