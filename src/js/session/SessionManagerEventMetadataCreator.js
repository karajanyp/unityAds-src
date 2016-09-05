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
        return this._eventManager.getUniqueEventId().then(function (eventId) {
            return me.getInfoJson(adUnit, eventId, session, gamerServerId);
        });
    };
    SessionManagerEventMetadataCreator.prototype.getInfoJson = function (adUnit, eventId, session, sid) {
        var me = this;
        var metaData = {
            eventId: eventId,
            sessionId: session.getId(),
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
        var tasks = [];
        tasks.push(this._deviceInfo.getNetworkType());
        tasks.push(this._deviceInfo.getConnectionType());

        return Promise.all(tasks).then(function (res) {
            metaData.networkType = res[0];
            metaData.connectionType = res[1];
            return MetaDataManager.fetchMediationMetaData(me._nativeBridge).then(function (mediation) {
                if(mediation){
                    metaData.mediationName = mediation.getName();
                    metaData.mediationVersion = mediation.getVersion();
                    metaData.mediationOrdinal = mediation.getOrdinal();
                }
                return [eventId, metaData];
            });
        });
    };
    return SessionManagerEventMetadataCreator;
});
