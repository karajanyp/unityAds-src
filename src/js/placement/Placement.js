/**
 * Created by duo on 2016/8/31.
 */

CMD.register("placement.Placement", function () {

    function Placement(placementData) {
        this._id = placementData.id;
        this._name = placementData.name;
        this._default = placementData["default"];
        this._allowSkip = placementData.allowSkip;
        this._skipInSeconds = placementData.skipInSeconds;
        this._disableBackButton = placementData.disableBackButton;
        this._useDeviceOrientationForVideo = placementData.useDeviceOrientationForVideo;
        this._muteVideo = placementData.muteVideo;
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
