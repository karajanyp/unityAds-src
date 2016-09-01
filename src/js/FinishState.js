/**
 * Created by duo on 2016/8/31.
 */
CMD.register("FinishState", function () {
    var FinishState = {};

    FinishState[FinishState.COMPLETED = 0] = "COMPLETED";
    FinishState[FinishState.SKIPPED = 1] = "SKIPPED";
    FinishState[FinishState.ERROR = 2] = "ERROR";

    return FinishState;
});
