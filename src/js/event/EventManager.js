/**
 * Created by duo on 2016/9/1.
 */
CMD.register("event.EventManager", function (require) {
    var StorageType = require("storage.StorageType");

    function EventManager(nativeBridge, request) {
        this._nativeBridge = nativeBridge;
        this._request = request;
    }
    EventManager.getSessionKey = function (sessionId) {
        return "session." + sessionId;
    };
    EventManager.getSessionTimestampKey = function (sessionId) {
        return EventManager.getSessionKey(sessionId) + ".ts";
    };
    EventManager.getEventKey = function (sessionId, eventId) {
        return EventManager.getSessionKey(sessionId) + ".operative." + eventId;
    };
    EventManager.getUrlKey = function (sessionId, eventId) {
        return EventManager.getEventKey(sessionId, eventId) + ".url";
    };
    EventManager.getDataKey = function (sessionId, eventId) {
        return EventManager.getEventKey(sessionId, eventId) + ".data";
    };
    EventManager.prototype.operativeEvent = function (eventName, eventId, sessionId, eventUrl, metaDataStr) {
        var me = this;
        this._nativeBridge.Sdk.logInfo("OneWay SDK event: sending " + eventName + " event to " + eventUrl);
        this._nativeBridge.Storage.set(StorageType.PRIVATE, EventManager.getUrlKey(sessionId, eventId), eventUrl);
        this._nativeBridge.Storage.set(StorageType.PRIVATE, EventManager.getDataKey(sessionId, eventId), metaDataStr);
        this._nativeBridge.Storage.write(StorageType.PRIVATE);
        return this._request.post(eventUrl, metaDataStr, [], {
            retries: 5,
            retryDelay: 5e3,
            followRedirects: false,
            retryWithConnectionEvents: false
        }).then(function () {
            return Promise.all([
                me._nativeBridge.Storage["delete"](StorageType.PRIVATE, EventManager.getEventKey(sessionId, eventId)),
                me._nativeBridge.Storage.write(StorageType.PRIVATE)
            ]);
        });
    };
    EventManager.prototype.clickAttributionEvent = function (sessionId, clickAttributionUrl, clickAttributionUrlFollowsRedirects) {
        if(clickAttributionUrlFollowsRedirects){
            return this._request.get(clickAttributionUrl, [], {
                retries: 0,
                retryDelay: 0,
                followRedirects: true,
                retryWithConnectionEvents: false
            })
        }else{
            return this._request.get(clickAttributionUrl);
        }
    };
    EventManager.prototype.thirdPartyEvent = function (eventName, sessionId, eventUrl) {
        this._nativeBridge.Sdk.logInfo("OneWay SDK third party event: sending " + eventName + " event to " + eventUrl + " (session " + sessionId + ")");
        return this._request.get(eventUrl, [], {
            retries: 0,
            retryDelay: 0,
            followRedirects: true,
            retryWithConnectionEvents: false
        });
    };
    EventManager.prototype.diagnosticEvent = function (url, data) {
        return this._request.post(url, data);
    };
    EventManager.prototype.startNewSession = function (id) {
        return Promise.all([this._nativeBridge.Storage.set(StorageType.PRIVATE, EventManager.getSessionTimestampKey(id), Date.now()), this._nativeBridge.Storage.write(StorageType.PRIVATE)]);
    };
    /**
     * 发送所有未发送过的session信息，成功后删除Storage信息
     * @returns {Promise}
     */
    EventManager.prototype.sendUnsentSessions = function () {
        var me = this;
        return this.getUnsentSessions().then(function (sessionIds) {
            var n = sessionIds.map(function (sessionId) {
                return me.isSessionOutdated(sessionId).then(function (isOutdated) {
                    if(isOutdated){
                        return me.deleteSession(sessionId)
                    }else{
                        return me.getUnsentOperativeEvents(sessionId).then(function (events) {
                            return Promise.all(events.map(function (eventId) {
                                return me.resendEvent(sessionId, eventId);
                            }));
                        });
                    }
                });
            });
            return Promise.all(n);
        });
    };
    EventManager.prototype.getUniqueEventId = function () {
        return this._nativeBridge.DeviceInfo.getUniqueEventId();
    };
    EventManager.prototype.getUnsentSessions = function () {
        return this._nativeBridge.Storage.getKeys(StorageType.PRIVATE, "session", false);
    };
    /**
     * session是否过期，过期时间为7天
     * @param sessionId {String}
     * @returns {Promise} resolve(boolean) | reject(true)
     */
    EventManager.prototype.isSessionOutdated = function (sessionId) {
        return this._nativeBridge.Storage.get(StorageType.PRIVATE, EventManager.getSessionTimestampKey(sessionId)).then(function (timestamp) {
            var sevenDaysBefore = new Date().getTime() - 6048e5,
                now = new Date().getTime();
            return !(timestamp > sevenDaysBefore && now > timestamp);
        })["catch"](function () {
            return true;
        });
    };
    /**
     * 获取所有未发送的事件id
     * @param sessionId
     * @returns {Promise} resolve(events:Array)
     */
    EventManager.prototype.getUnsentOperativeEvents = function (sessionId) {
        return this._nativeBridge.Storage.getKeys(StorageType.PRIVATE, "session." + sessionId + ".operative", false);
    };
    /**
     * 发送事件到native，成功后删除Storage的事件记录
     * @param sessionId {String}
     * @param eventId   {String}
     * @returns {Promise} resolve([storageType:String, storageType:String])
     */
    EventManager.prototype.resendEvent = function (sessionId, eventId) {
        var me = this;
        return this.getStoredOperativeEvent(sessionId, eventId).then(function (res) {
            var url = res[0], data = res[1];
            me._nativeBridge.Sdk.logInfo("OneWay SDK operative event: resending operative event to " + url + " (session " + sessionId + ", event " + eventId + ")");
            return me._request.post(url, data);
        }).then(function () {
            return Promise.all([
                me._nativeBridge.Storage["delete"](StorageType.PRIVATE, EventManager.getEventKey(sessionId, eventId)),
                me._nativeBridge.Storage.write(StorageType.PRIVATE)
            ]);
        });
    };
    EventManager.prototype.getStoredOperativeEvent = function (sessionId, eventId) {
        return Promise.all([
            this._nativeBridge.Storage.get(StorageType.PRIVATE, EventManager.getUrlKey(sessionId, eventId)),
            this._nativeBridge.Storage.get(StorageType.PRIVATE, EventManager.getDataKey(sessionId, eventId))
        ]);
    };
    EventManager.prototype.deleteSession = function (sessionId) {
        return Promise.all([
            this._nativeBridge.Storage["delete"](StorageType.PRIVATE, EventManager.getSessionKey(sessionId)),
            this._nativeBridge.Storage.write(StorageType.PRIVATE)]);
    };
    return EventManager;
});
