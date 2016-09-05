/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.eventhandlers.VastOverlayEventHandlers", function (require, t) {
    var OverlayEventHandlers = require("adunit.eventhandlers.OverlayEventHandlers");

    function VastOverlayEventHandlers() {
        OverlayEventHandlers.apply(this, arguments);
    }
    extend(VastOverlayEventHandlers, OverlayEventHandlers);
    VastOverlayEventHandlers.afterSkip = function (e) {
        e.hide();
    };

    return VastOverlayEventHandlers;
});
