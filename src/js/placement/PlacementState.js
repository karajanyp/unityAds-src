/**
 * Created by duo on 2016/8/31.
 */
CMD.register("placement.PlacementState", function () {
    var PlacementState = {};

    PlacementState[PlacementState.READY = 0] = "READY";
    PlacementState[PlacementState.NOT_AVAILABLE = 1] = "NOT_AVAILABLE";
    PlacementState[PlacementState.DISABLED = 2] = "DISABLED";
    PlacementState[PlacementState.WAITING = 3] = "WAITING";
    PlacementState[PlacementState.NO_FILL = 4] = "NO_FILL";

    return PlacementState;
});
