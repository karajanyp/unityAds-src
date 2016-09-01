/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.vast.VastCreative", function () {
    function VastCreative(type, events) {
        this._type = type;
        this._trackingEvents = events || {};
    }
    VastCreative.prototype.getType = function () {
        return this._type;
    };
    VastCreative.prototype.getTrackingEvents = function () {
        return this._trackingEvents;
    };
    VastCreative.prototype.addTrackingEvent = function (eventName, eventHandler) {
        if(null == this._trackingEvents[eventName] ){
            this._trackingEvents[eventName] = [];
        }
        this._trackingEvents[eventName].push(eventHandler);
    };
    return VastCreative;
});