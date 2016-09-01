/**
 * Created by duo on 2016/9/1.
 */
CMD.register("event.EventManager", function (require) {
    var StorageType = require("storage.StorageType");

    function EventManager(nativeBridge, request) {
        this._nativeBridge = nativeBridge;
        this._request = request;
    }
    EventManager.getSessionKey = function (key) {
        return "session." + key;
    };
    EventManager.getSessionTimestampKey = function (key) {
        return EventManager.getSessionKey(key) + ".ts";
    };
    EventManager.getEventKey = function (key, e) {
        return EventManager.getSessionKey(key) + ".operative." + e;
    };
    EventManager.getUrlKey = function (t, n) {
        return EventManager.getEventKey(t, n) + ".url";
    };
    EventManager.getDataKey = function (t, n) {
        return EventManager.getEventKey(t, n) + ".data";
    };
    EventManager.prototype.operativeEvent = function (n, i, r, o, a) {
        var me = this;
        this._nativeBridge.Sdk.logInfo("Unity Ads event: sending " + n + " event to " + o);
        this._nativeBridge.Storage.set(StorageType.PRIVATE, EventManager.getUrlKey(r, i), o);
        this._nativeBridge.Storage.set(StorageType.PRIVATE, EventManager.getDataKey(r, i), a);
        this._nativeBridge.Storage.write(StorageType.PRIVATE);
        return this._request.post(o, a, [], {
            retries: 5,
            retryDelay: 5e3,
            followRedirects: !1,
            retryWithConnectionEvents: !1
        }).then(function () {
            return Promise.all([me._nativeBridge.Storage["delete"](StorageType.PRIVATE, EventManager.getEventKey(r, i)), me._nativeBridge.Storage.write(StorageType.PRIVATE)]);
        });
    };
    EventManager.prototype.clickAttributionEvent = function (e, t, n) {
        return n ? this._request.get(t, [], {
            retries: 0,
            retryDelay: 0,
            followRedirects: !0,
            retryWithConnectionEvents: !1
        }) : this._request.get(t);
    };
    EventManager.prototype.thirdPartyEvent = function (e, t, n) {
        this._nativeBridge.Sdk.logInfo("Unity Ads third party event: sending " + e + " event to " + n + " (session " + t + ")");
        return this._request.get(n, [], {
            retries: 0,
            retryDelay: 0,
            followRedirects: !0,
            retryWithConnectionEvents: !1
        });
    };
    EventManager.prototype.diagnosticEvent = function (e, t) {
        return this._request.post(e, t);
    };
    EventManager.prototype.startNewSession = function (n) {
        return Promise.all([this._nativeBridge.Storage.set(StorageType.PRIVATE, EventManager.getSessionTimestampKey(n), Date.now()), this._nativeBridge.Storage.write(StorageType.PRIVATE)]);
    };
    EventManager.prototype.sendUnsentSessions = function () {
        var me = this;
        return this.getUnsentSessions().then(function (t) {
            var n = t.map(function (t) {
                return me.isSessionOutdated(t).then(function (n) {
                    return n ? me.deleteSession(t) : me.getUnsentOperativeEvents(t).then(function (n) {
                        return Promise.all(n.map(function (n) {
                            return me.resendEvent(t, n);
                        }));
                    });
                });
            });
            return Promise.all(n);
        });
    };
    EventManager.prototype.getUniqueEventId = function () {
        return this._nativeBridge.DeviceInfo.getUniqueEventId();
    };
    EventManager.prototype.getUnsentSessions = function () {
        return this._nativeBridge.Storage.getKeys(StorageType.PRIVATE, "session", !1);
    };
    EventManager.prototype.isSessionOutdated = function (n) {
        return this._nativeBridge.Storage.get(StorageType.PRIVATE, EventManager.getSessionTimestampKey(n)).then(function (e) {
            var t = new Date().getTime() - 6048e5, n = new Date().getTime();
            return !(e > t && n > e);
        })["catch"](function () {
            return !0;
        });
    };
    EventManager.prototype.getUnsentOperativeEvents = function (e) {
        return this._nativeBridge.Storage.getKeys(StorageType.PRIVATE, "session." + e + ".operative", false);
    };
    EventManager.prototype.resendEvent = function (n, i) {
        var me = this;
        return this.getStoredOperativeEvent(n, i).then(function (e) {
            var t = e[0], o = e[1];
            me._nativeBridge.Sdk.logInfo("Unity Ads operative event: resending operative event to " + t + " (session " + n + ", event " + i + ")");
            return me._request.post(t, o);
        }).then(function () {
            return Promise.all([me._nativeBridge.Storage["delete"](StorageType.PRIVATE, EventManager.getEventKey(n, i)), me._nativeBridge.Storage.write(StorageType.PRIVATE)]);
        });
    };
    EventManager.prototype.getStoredOperativeEvent = function (n, i) {
        return Promise.all([this._nativeBridge.Storage.get(StorageType.PRIVATE, EventManager.getUrlKey(n, i)), this._nativeBridge.Storage.get(StorageType.PRIVATE, EventManager.getDataKey(n, i))]);
    };
    EventManager.prototype.deleteSession = function (n) {
        return Promise.all([this._nativeBridge.Storage["delete"](StorageType.PRIVATE, EventManager.getSessionKey(n)), this._nativeBridge.Storage.write(StorageType.PRIVATE)]);
    };
    return EventManager;
});
