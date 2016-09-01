/**
 * Created by duo on 2016/9/1.
 */
CMD.register("session.SessionManagerEventMetadataCreator", function (require) {
    var MetaDataManager = require("metadata.MetaDataManager");

    function SessionManagerEventMetadataCreator(eventManager, deviceInfo, nativeBridge) {
        this._eventManager = eventManager;
        this._deviceInfo = deviceInfo;
        this._nativeBridge = nativeBridge;
    }
    SessionManagerEventMetadataCreator.prototype.createUniqueEventMetadata = function (adUnit, session, gamerServerId) {
        var me = this;
        return this._eventManager.getUniqueEventId().then(function (e) {
            return me.getInfoJson(adUnit, e, session, gamerServerId);
        });
    };
    SessionManagerEventMetadataCreator.prototype.getInfoJson = function (adUnit, eventId, n, sid) {
        var me = this;
        var a = {
            eventId: eventId,
            sessionId: n.getId(),
            gamerId: adUnit.getCampaign().getGamerId(),
            campaignId: adUnit.getCampaign().getId(),
            placementId: adUnit.getPlacement().getId(),
            apiLevel: this._deviceInfo.getApiLevel(),
            cached: true,
            advertisingId: this._deviceInfo.getAdvertisingIdentifier(),
            trackingEnabled: this._deviceInfo.getLimitAdTracking(),
            osVersion: this._deviceInfo.getOsVersion(),
            sid: sid,
            deviceMake: this._deviceInfo.getManufacturer(),
            deviceModel: this._deviceInfo.getModel()
        };
        var s = [];
        s.push(this._deviceInfo.getNetworkType());
        s.push(this._deviceInfo.getConnectionType());

        return Promise.all(s).then(function (e) {
            a.networkType = e[0];
            a.connectionType = e[1];
            return MetaDataManager.fetchMediationMetaData(me._nativeBridge).then(function (e) {
                if(e){
                    a.mediationName = e.getName();
                    a.mediationVersion = e.getVersion();
                    a.mediationOrdinal = e.getOrdinal();
                }
                return [eventId, a];
            });
        });
    };
    return SessionManagerEventMetadataCreator;
});
