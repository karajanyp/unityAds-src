/**
 * Created by duo on 2016/9/1.
 */
CMD.register("metadata.FrameworkMetaData", function (require) {
    var Model = require("model.Model");
    function FrameworkMetaData(t) {
        Model.call(this);
        this._name = t[0];
        this._version = t[1];
    }
    extend(FrameworkMetaData, Model);

    FrameworkMetaData.getCategory = function () {
        return "framework";
    };
    FrameworkMetaData.getKeys = function () {
        return ["name.value", "version.value"];
    };
    FrameworkMetaData.prototype.getName = function () {
        return this._name;
    };
    FrameworkMetaData.prototype.getVersion = function () {
        return this._version;
    };
    FrameworkMetaData.prototype.getDTO = function () {
        return {
            frameworkName: this._name,
            frameworkVersion: this._version
        };
    };
    return FrameworkMetaData;
});