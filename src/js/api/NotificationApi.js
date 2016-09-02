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

    NotificationApi.prototype.addNotificationObserver = function (name, userInfoKeys) {
        return this._nativeBridge.invoke(this._apiClass, "addNotificationObserver", [name, userInfoKeys]);
    };
    NotificationApi.prototype.removeNotificationObserver = function (name) {
        return this._nativeBridge.invoke(this._apiClass, "removeNotificationObserver", [name]);
    };
    NotificationApi.prototype.removeAllNotificationObservers = function () {
        return this._nativeBridge.invoke(this._apiClass, "removeAllNotificationObservers");
    };
    NotificationApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case Event[Event.ACTION]:
                this.onNotification.trigger(args[0], args[1]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, args);
        }
    };
    return NotificationApi;
});
