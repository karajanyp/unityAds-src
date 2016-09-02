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
        this.onAppForeground = new Observable();
        this._screenListener = "screenListener";
        this.ACTION_SCREEN_ON = "android.intent.action.SCREEN_ON";
        this.ACTION_SCREEN_OFF = "android.intent.action.SCREEN_OFF";
        this._nativeBridge = nativeBridge;
        this._lastConnected = Date.now();
        this._nativeBridge.Connectivity.onConnected.subscribe(function (e, t) {
            return me.onConnected(e, t);
        });
        this._nativeBridge.Broadcast.onBroadcastAction.subscribe(function (e, t, i, r) {
            return me.onBroadcastAction(e, t, i, r);
        });
        this._nativeBridge.Notification.onNotification.subscribe(function (e, t) {
            return me.onNotification(e, t);
        });
    }
    WakeUpManager.prototype.setListenConnectivity = function (status) {
        return this._nativeBridge.Connectivity.setListeningStatus(status);
    };
    WakeUpManager.prototype.setListenScreen = function (e) {
        if(e){
            return this._nativeBridge.Broadcast.addBroadcastListener(this._screenListener, [this.ACTION_SCREEN_ON, this.ACTION_SCREEN_OFF]);
        }else{
            return this._nativeBridge.Broadcast.removeBroadcastListener(this._screenListener);
        }
    };
    WakeUpManager.prototype.setListenAppForeground = function (t) {
        if(t){
            return this._nativeBridge.Notification.addNotificationObserver(WakeUpManager._appForegroundNotification, []);
        }else{
            return this._nativeBridge.Notification.removeNotificationObserver(WakeUpManager._appForegroundNotification);
        }
    };
    WakeUpManager.prototype.onConnected = function (e, t) {
        var n = 9e5;
        if(this._lastConnected + n < Date.now()){
            this._lastConnected = Date.now();
            this.onNetworkConnected.trigger();
        }
    };
    WakeUpManager.prototype.onBroadcastAction = function (e, t, n, i) {
        if (e === this._screenListener) {
            switch (t) {
                case this.ACTION_SCREEN_ON:
                    this.onScreenOn.trigger();
                    break;

                case this.ACTION_SCREEN_OFF:
                    this.onScreenOff.trigger();
            }
        }
    };
    WakeUpManager.prototype.onNotification = function (t, n) {
        t === WakeUpManager._appForegroundNotification && this.onAppForeground.trigger();
    };
    WakeUpManager._appForegroundNotification = "UIApplicationDidBecomeActiveNotification";
    return WakeUpManager;

});
