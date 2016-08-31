/**
 * Created by duo on 2016/8/31.
 */

CMD.register("main", function(require){
    var Url         = require("util.Url");
    var Platform    = require("platform.Platform");
    var NativeBridge = require("webview.bridge.NativeBridge");
    var IosWebViewBridge = require("webview.bridge.IosWebViewBridge");
    //var WebView     = require("webview.WebView");

    var getOrientation = function (e) {
        var calculatedOrientation = window.innerWidth / window.innerHeight >= 1 ? "landscape" : "portrait",
            orientation = null;

        if(document.body.classList.contains("landscape")){
            orientation = "landscape";
        }else if(document.body.classList.contains("portrait")){
            orientation = "portrait";
        }

        if(orientation){
            if(orientation !== calculatedOrientation){
                document.body.classList.remove(orientation);
                document.body.classList.add(calculatedOrientation)
            }
        }else{
            document.body.classList.add(calculatedOrientation)
        }
    };
    getOrientation(null);
    window.addEventListener("resize", getOrientation, false);

    var nativeBridge = null;
    switch (Url.getQueryParameter(location.search, "platform")) {
        case "android":
            //JS 调用 Android API: 提供webviewbridge接口
            nativeBridge = new NativeBridge(window.webviewbridge, Platform.ANDROID);
            break;

        case "ios":
            nativeBridge = new NativeBridge(new IosWebViewBridge(), Platform.IOS, false);
            break;

        default:
            throw new Error("webview init failure: no platform defined, unable to initialize native bridge");
    }
    var win = window;
    win.nativebridge = nativeBridge;
    //win.webview = new WebView(nativeBridge);
    //win.webview.initialize();
});
CMD.require("main");