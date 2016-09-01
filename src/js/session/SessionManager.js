/**
 * Created by duo on 2016/9/1.
 */
CMD.register("session.SessionManager", function (require) {
    var Session = require("session.Session");
    var SessionManagerEventMetadataCreator = require("session.SessionManagerEventMetadataCreator");
    var Url = require("util.Url");

    function SessionManager(nativeBridge, clientInfo, deviceInfo, eventManager, eventMetadataCreator) {
        this._nativeBridge = nativeBridge;
        this._clientInfo = clientInfo;
        this._deviceInfo = deviceInfo;
        this._eventManager = eventManager;
        this._eventMetadataCreator = eventMetadataCreator || new SessionManagerEventMetadataCreator(this._eventManager, this._deviceInfo, this._nativeBridge);
    }
    SessionManager.setTestBaseUrl = function (baseUrl) {
        SessionManager.VideoEventBaseUrl = baseUrl + "/mobile/gamers";
        SessionManager.ClickEventBaseUrl = baseUrl + "/mobile/campaigns";
    };
    SessionManager.prototype.create = function () {
        var me = this;
        return this._eventManager.getUniqueEventId().then(function (n) {
            me._currentSession = new Session(n);
            return me._eventManager.startNewSession(n);
        });
    };
    SessionManager.prototype.getSession = function () {
        return this._currentSession;
    };
    SessionManager.prototype.setSession = function (session) {
        this._currentSession = session;
    };
    SessionManager.prototype.sendShow = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.showSent){
                return;
            }
            this._currentSession.showSent = true;
        }
        var n = function (n) {
            var i = n[0], r = n[1];
            me._eventManager.operativeEvent("show", i, r.sessionId, me.createShowEventUrl(adUnit), JSON.stringify(r));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(n);
    };
    SessionManager.prototype.sendImpressionEvent = function (e) {
        if (this._currentSession) {
            if (this._currentSession.impressionSent){
                return;
            }
            this._currentSession.impressionSent = true;
        }
        e.sendImpressionEvent(this._eventManager, this._currentSession.getId());
        e.sendTrackingEvent(this._eventManager, "creativeView", this._currentSession.getId());
    };
    SessionManager.prototype.sendStart = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.startSent) {
                return;
            }
            this._currentSession.startSent = true;
        }
        var n = function (n) {
            var i = n[0], r = n[1];
            me._eventManager.operativeEvent("start", i, r.sessionId, me.createVideoEventUrl(adUnit, "video_start"), JSON.stringify(r));
            adUnit.sendTrackingEvent(me._eventManager, "start", r.sessionId);
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(n);
    };
    SessionManager.prototype.sendProgress = function (adUnit, session, n, position) {
        session && adUnit.sendProgressEvents(this._eventManager, session.getId(), n, position);
    };
    SessionManager.prototype.sendFirstQuartile = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.firstQuartileSent){
                return;
            }
            this._currentSession.firstQuartileSent = true;
        }
        var n = function (n) {
            var i = n[0], r = n[1];
            me._eventManager.operativeEvent("first_quartile", i, r.sessionId, me.createVideoEventUrl(adUnit, "first_quartile"), JSON.stringify(r));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(n);
    };
    SessionManager.prototype.sendMidpoint = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.midpointSent) {
                return;
            }
            this._currentSession.midpointSent = true;
        }
        var n = function (n) {
            var i = n[0], r = n[1];
            me._eventManager.operativeEvent("midpoint", i, r.sessionId, me.createVideoEventUrl(adUnit, "midpoint"), JSON.stringify(r));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(n);
    };
    SessionManager.prototype.sendThirdQuartile = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.thirdQuartileSent){
                return;
            }
            this._currentSession.thirdQuartileSent = true;
        }
        var n = function (n) {
            var i = n[0], r = n[1];
            me._eventManager.operativeEvent("third_quartile", i, r.sessionId, me.createVideoEventUrl(adUnit, "third_quartile"), JSON.stringify(r));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(n);
    };
    SessionManager.prototype.sendSkip = function (adUnit, position) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.skipSent){
                return;
            }
            this._currentSession.skipSent = true;
        }
        var i = function (i) {
            var r = i[0], o = i[1];
            position && (o.skippedAt = position);
            me._eventManager.operativeEvent("skip", r, me._currentSession.getId(), me.createVideoEventUrl(adUnit, "video_skip"), JSON.stringify(o));
        };
        this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(i);
    };
    SessionManager.prototype.sendView = function (e) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.viewSent) {
                return;
            }
            this._currentSession.viewSent = true;
        }
        var n = function (n) {
            var i = n[0], r = n[1];
            me._eventManager.operativeEvent("view", i, r.sessionId, me.createVideoEventUrl(e, "video_end"), JSON.stringify(r));
            e.sendTrackingEvent(me._eventManager, "complete", r.sessionId);
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(e, this._currentSession, this._gamerServerId).then(n);
    };
    SessionManager.prototype.sendClick = function (adUnit) {
        var t = this,
            n = adUnit.getCampaign(),
            i = function (n) {
                var i = n[0], r = n[1];
                t._eventManager.operativeEvent("click", i, t._currentSession.getId(), t.createClickEventUrl(adUnit), JSON.stringify(r));
            };
        this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(i);
        if(n.getClickAttributionUrl()){
            return this._eventManager.clickAttributionEvent(this._currentSession.getId(), n.getClickAttributionUrl(), n.getClickAttributionUrlFollowsRedirects())
        }else{
            return Promise.reject("Missing click attribution url");
        }
    };
    SessionManager.prototype.sendMute = function (adUnit, session, n) {
        if(n){
            adUnit.sendTrackingEvent(this._eventManager, "mute", session.getId())
        }else{
            adUnit.sendTrackingEvent(this._eventManager, "unmute", session.getId());
        }
    };
    SessionManager.prototype.sendVideoClickTracking = function (adUnit, session) {
        adUnit.sendVideoClickTrackingEvent(this._eventManager, session.getId());
    };
    SessionManager.prototype.setGamerServerId = function (id) {
        this._gamerServerId = id;
    };
    SessionManager.prototype.createShowEventUrl = function (adUnit) {
        var campaign = adUnit.getCampaign();
        return [SessionManager.VideoEventBaseUrl, campaign.getGamerId(), "show", campaign.getId(), this._clientInfo.getGameId()].join("/");
    };
    SessionManager.prototype.createVideoEventUrl = function (adUnit, n) {
        var campaign = adUnit.getCampaign();
        return [SessionManager.VideoEventBaseUrl, campaign.getGamerId(), "video", n, campaign.getId(), this._clientInfo.getGameId()].join("/");
    };
    SessionManager.prototype.createClickEventUrl = function (adUnit) {
        var campaign = adUnit.getCampaign(),
            r = [SessionManager.ClickEventBaseUrl, campaign.getId(), "click", campaign.getGamerId()].join("/");
        return Url.addParameters(r, {
            gameId: this._clientInfo.getGameId(),
            redirect: !1
        });
    };
    SessionManager.VideoEventBaseUrl = "https://adserver.unityads.unity3d.com/mobile/gamers";
    SessionManager.ClickEventBaseUrl = "https://adserver.unityads.unity3d.com/mobile/campaigns";

    return SessionManager;
});
