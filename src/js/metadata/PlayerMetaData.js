/**
 * Created by duo on 2016/9/1.
 */
CMD.register("metadata.PlayerMetaData", function (require) {
    var Model = require("model.Model");

    function PlayerMetaData(metaData) {
        Model.call(this);
        this._serverId = metaData[0];
    }
    extend(PlayerMetaData, Model);

    PlayerMetaData.getCategory = function () {
        return "player";
    };
    PlayerMetaData.getKeys = function () {
        return ["server_id.value"];
    };

    PlayerMetaData.prototype.getServerId = function () {
        return this._serverId;
    };
    PlayerMetaData.prototype.getDTO = function () {
        return {
            sid: this._serverId
        };
    };
    return PlayerMetaData;
});
