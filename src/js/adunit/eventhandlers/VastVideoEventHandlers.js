/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.eventhandlers.VastVideoEventHandlers", function (require) {
    var VideoEventHandlers = require("adunit.eventhandlers.VideoEventHandlers");

    function VastVideoEventHandlers() {
        VideoEventHandlers.apply(this, arguments);
    }
    extend(VastVideoEventHandlers, VideoEventHandlers);

    VastVideoEventHandlers.afterVideoCompleted = function (e, t) {
        t.hide();
    };

    return VastVideoEventHandlers;
});
