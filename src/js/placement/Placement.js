/**
 * Created by duo on 2016/8/31.
 */

CMD.register("placement.Placement", function (require) {

    function Placement(e) {
        this._id = e.id;
        this._name = e.name;
        this._default = e["default"];
        this._allowSkip = e.allowSkip;
        this._skipInSeconds = e.skipInSeconds;
        this._disableBackButton = e.disableBackButton;
        this._useDeviceOrientationForVideo = e.useDeviceOrientationForVideo;
        this._muteVideo = e.muteVideo;
    }
    Placement.prototype.getId = function () {
        return this._id;
    };
    Placement.prototype.getName = function () {
        return this._name;
    };
    Placement.prototype.isDefault = function () {
        return this._default;
    };
    Placement.prototype.allowSkip = function () {
        return this._allowSkip;
    };
    Placement.prototype.allowSkipInSeconds = function () {
        return this._skipInSeconds;
    };
    Placement.prototype.disableBackButton = function () {
        return this._disableBackButton;
    };
    Placement.prototype.useDeviceOrientationForVideo = function () {
        return this._useDeviceOrientationForVideo;
    };
    Placement.prototype.muteVideo = function () {
        return this._muteVideo;
    };

    return Placement;
});
