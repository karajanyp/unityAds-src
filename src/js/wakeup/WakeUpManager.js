/**
 * Created by duo on 2016/9/1.
 */
CMD.register("wakeup.WakeUpManager", function (require) {
    var Observable = require("util.Observable");

    function WakeUpManager(nativeBridge) {
        var me = this;
        this.onNetworkConnected = new Observable();
        this.onScreenOn = new Observable();
        this.onScreenOff = new Observable();
        //for iOS
        this.onAppForeground = new Observable();

        this._screenListener = "screenListener";
        this._nativeBridge = nativeBridge;
        this._lastConnected = Date.now();
        this._nativeBridge.Connectivity.onConnected.subscribe(function (wifi, networkType) {
            return me.onConnected(wifi, networkType);
        });
        // Android
        this._nativeBridge.Broadcast.onBroadcastAction.subscribe(function (name, action, data, extra) {
            return me.onBroadcastAction(name, action, data, extra);
        });
        // iOS
        this._nativeBridge.Notification.onNotification.subscribe(function (name, data) {
            return me.onNotification(name, data);
        });
    }
    WakeUpManager.prototype.setListenConnectivity = function (status) {
        return this._nativeBridge.Connectivity.setListeningStatus(status);
    };
    WakeUpManager.prototype.setListenScreen = function (enable) {
        if(enable){
            return this._nativeBridge.Broadcast.addBroadcastListener(this._screenListener, [WakeUpManager._actionScreenOn, WakeUpManager._actionScreenOff]);
        }else{
            return this._nativeBridge.Broadcast.removeBroadcastListener(this._screenListener);
        }
    };
    WakeUpManager.prototype.setListenAppForeground = function (enable) {
        if(enable){
            return this._nativeBridge.Notification.addNotificationObserver(WakeUpManager._appForegroundNotification, []);
        }else{
            return this._nativeBridge.Notification.removeNotificationObserver(WakeUpManager._appForegroundNotification);
        }
    };
    WakeUpManager.prototype.onConnected = function (wifi, networkType) {
        var n = 9e5;
        if(this._lastConnected + n < Date.now()){
            this._lastConnected = Date.now();
            this.onNetworkConnected.trigger();
        }
    };
    WakeUpManager.prototype.onBroadcastAction = function (listenerName, action, data, extra) {
        if (listenerName === this._screenListener) {
            switch (action) {
                case WakeUpManager._actionScreenOn:
                    this.onScreenOn.trigger();
                    break;

                case WakeUpManager._actionScreenOff:
                    this.onScreenOff.trigger();
            }
        }
    };
    WakeUpManager.prototype.onNotification = function (name, data) {
        name === WakeUpManager._appForegroundNotification && this.onAppForeground.trigger();
    };
    WakeUpManager._actionScreenOn = "android.intent.action.SCREEN_ON";
    WakeUpManager._actionScreenOff = "android.intent.action.SCREEN_OFF";
    WakeUpManager._appForegroundNotification = "UIApplicationDidBecomeActiveNotification";
    return WakeUpManager;

});
