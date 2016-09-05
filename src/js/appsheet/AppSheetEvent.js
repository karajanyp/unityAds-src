/**
 * Created by duo on 2016/8/31.
 */
CMD.register("appsheet.AppSheetEvent", function () {
    var AppSheetEvent = {};

    AppSheetEvent[AppSheetEvent.PREPARED = 0] = "PREPARED";
    AppSheetEvent[AppSheetEvent.OPENED = 1] = "OPENED";
    AppSheetEvent[AppSheetEvent.CLOSED = 2] = "CLOSED";
    AppSheetEvent[AppSheetEvent.FAILED = 3] = "FAILED";

    return AppSheetEvent;
});