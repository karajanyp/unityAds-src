/**
 * Created by duo on 2016/9/1.
 */
CMD.register("metadata.AdapterMetaData", function (require) {
    var Model = require("model.Model");
    function AdapterMetaData(t) {
        Model.call(this);
        this._name = t[0];
        this._version = t[1];
    }
    extend(AdapterMetaData, Model);

    AdapterMetaData.getCategory = function () {
        return "adapter";
    };
    AdapterMetaData.getKeys = function () {
        return ["name.value", "version.value"];
    };
    AdapterMetaData.prototype.getName = function () {
        return this._name;
    };
    AdapterMetaData.prototype.getVersion = function () {
        return this._version;
    };
    AdapterMetaData.prototype.getDTO = function () {
        return {
            adapterName: this._name,
            adapterVersion: this._version
        };
    };
    return AdapterMetaData;
});
