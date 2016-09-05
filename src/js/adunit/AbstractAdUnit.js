/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.AbstractAdUnit", function (require) {
    var Observable = require("util.Observable");
    var FinishState = require("FinishState");

    function AbstractAdUnit(nativeBridge, placement, campaign) {
        this.onStart = new Observable();
        this.onNewAdRequestAllowed = new Observable();
        this.onClose = new Observable();
        this._showing = false;
        this._nativeBridge = nativeBridge;
        this._placement = placement;
        this._campaign = campaign;
    }
    AbstractAdUnit.prototype.getPlacement = function () {
        return this._placement;
    };
    AbstractAdUnit.prototype.getCampaign = function () {
        return this._campaign;
    };
    AbstractAdUnit.prototype.setFinishState = function (state) {
        if(this._finishState !== FinishState.COMPLETED){
            this._finishState = state;
        }
    };
    AbstractAdUnit.prototype.getFinishState = function () {
        return this._finishState;
    };
    AbstractAdUnit.prototype.isShowing = function () {
        return this._showing;
    };
    AbstractAdUnit.prototype.sendImpressionEvent = function (eventManager, sessionId) {
    };
    AbstractAdUnit.prototype.sendTrackingEvent = function (eventManager, eventName, sessionId) {
    };
    AbstractAdUnit.prototype.sendProgressEvents = function (eventManager, sessionId, n, i) {
    };
    return AbstractAdUnit;
});
