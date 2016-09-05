/**
 * Created by duo on 2016/9/1.
 */
CMD.register("metadata.MediationMetaData", function (require) {
    var Model = require("model.Model");

    function MediationMetaData(metaData) {
        Model.call(this);
        this._name = metaData[0];
        this._version = metaData[1];
        this._ordinal = parseInt(metaData[2], 10);
    }
    extend(MediationMetaData, Model);

    MediationMetaData.getCategory = function () {
        return "mediation";
    };
    MediationMetaData.getKeys = function () {
        return ["name.value", "version.value", "ordinal.value"];
    };

    MediationMetaData.prototype.getName = function () {
        return this._name;
    };
    MediationMetaData.prototype.getVersion = function () {
        return this._version;
    };
    MediationMetaData.prototype.getOrdinal = function () {
        return this._ordinal;
    };
    MediationMetaData.prototype.getDTO = function () {
        return {
            mediationName: this._name,
            mediationVersion: this._version,
            mediationOrdinal: this._ordinal
        };
    };
    return MediationMetaData;
});
