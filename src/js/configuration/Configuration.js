/**
 * Created by duo on 2016/8/31.
 */
CMD.register("configuration.Configuration", function (require){
    var CacheMode = require("configuration.CacheMode");

    function Configuration(e) {
        var me = this;
        this._placements = {};
        this._defaultPlacement = null;
        this._enabled = e.enabled;
        this._country = e.country;
        this._coppaCompliant = e.coppaCompliant;

        switch (e.assetCaching) {
            case "forced":
                this._cacheMode = CacheMode.FORCED;
                break;

            case "allowed":
                this._cacheMode = CacheMode.ALLOWED;
                break;

            case "disabled":
                this._cacheMode = CacheMode.DISABLED;
                break;

            default:
                throw new Error('Unknown assetCaching value "' + e.assetCaching + '"');
        }

        var placements = e.placements;
        placements.forEach(function (item) {
            var placement = new t.Placement(item);
            me._placements[placement.getId()] = placement;

            if(placement.isDefault()){
                me._defaultPlacement = placement;
            }
        });
    }
    Configuration.prototype.isEnabled = function () {
        return this._enabled;
    };
    Configuration.prototype.getCountry = function () {
        return this._country;
    };
    Configuration.prototype.isCoppaCompliant = function () {
        return this._coppaCompliant;
    };
    Configuration.prototype.getCacheMode = function () {
        return this._cacheMode;
    };
    Configuration.prototype.getPlacement = function (placementId) {
        return this._placements[placementId];
    };
    Configuration.prototype.getPlacements = function () {
        return this._placements;
    };
    Configuration.prototype.getPlacementCount = function () {
        if (!this._placements) {
            return 0;
        }
        var count = 0;
        for (var key in this._placements) {
            if(this._placements.hasOwnProperty(key)){
                count++;
            }
        }
        return count;
    };
    Configuration.prototype.getDefaultPlacement = function () {
        return this._defaultPlacement;
    };

    return Configuration;
});