/**
 * Created by duo on 2016/8/31.
 */
CMD.register("webview.bridge.IosWebViewBridge", function(){

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
    IosWebViewBridge._nativeUrl = "https://webviewbridge.unityads.unity3d.com";

    return IosWebViewBridge;
});

