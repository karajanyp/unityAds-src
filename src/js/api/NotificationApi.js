/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.NotificationApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.ACTION = 0] = "ACTION";

    function NotificationApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Notification");
        this.onNotification = new Observable();
    }
    extend(NotificationApi, NativeApi);

    NotificationApi.prototype.addNotificationObserver = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "addNotificationObserver", [e, t]);
    };
    NotificationApi.prototype.removeNotificationObserver = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "removeNotificationObserver", [e]);
    };
    NotificationApi.prototype.removeAllNotificationObservers = function () {
        return this._nativeBridge.invoke(this._apiClass, "removeAllNotificationObservers");
    };
    NotificationApi.prototype.handleEvent = function (t, n) {
        switch (t) {
            case Event[Event.ACTION]:
                this.onNotification.trigger(n[0], n[1]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, t, n);
        }
    };
    return NotificationApi;
});
