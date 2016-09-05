/**
 * Created by duo on 2016/8/31.
 */

CMD.register("webview.bridge.CallbackContainer", function () {
    function CallbackContainer(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }

    return CallbackContainer;
});
