/**
 * Created by duo on 2016/8/31.
 */
CMD.register("webview.bridge.CallbackStatus", function(){
    var CallbackStatus = {};

    CallbackStatus[CallbackStatus.OK = 0] = "OK";
    CallbackStatus[CallbackStatus.ERROR = 1] = "ERROR";

    return CallbackStatus;
});