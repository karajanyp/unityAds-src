/**
 * Created by duo on 2016/8/31.
 */
CMD.register("webview.bridge.IosWebViewBridge", function(require){
    var webViewBridgeProperties = require("Properties").webViewBridge;

    function IosWebViewBridge() {}

    IosWebViewBridge.prototype.handleInvocation = function (t) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", IosWebViewBridge._nativeUrl + "/handleInvocation", false);
        xhr.send(t);
    };
    IosWebViewBridge.prototype.handleCallback = function (id, callbackStatus, parameters) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", IosWebViewBridge._nativeUrl + "/handleCallback", false);
        xhr.send('{"id":"' + id + '","status":"' + callbackStatus + '","parameters":' + parameters + "}");
    };
    IosWebViewBridge._nativeUrl = webViewBridgeProperties.IOS_NATIVE_URL;

    return IosWebViewBridge;
});

