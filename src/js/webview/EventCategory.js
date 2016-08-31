/**
 * Created by duo on 2016/8/31.
 */
CMD.register("webview.EventCategory", function(){
    var EventCategory = {};

    EventCategory[EventCategory.APPSHEET = 0] = "APPSHEET";
    EventCategory[EventCategory.ADUNIT = 1] = "ADUNIT";
    EventCategory[EventCategory.VIDEOPLAYER = 2] = "VIDEOPLAYER";
    EventCategory[EventCategory.CACHE = 3] = "CACHE";
    EventCategory[EventCategory.CONNECTIVITY = 4] = "CONNECTIVITY";
    EventCategory[EventCategory.STORAGE = 5] = "STORAGE";
    EventCategory[EventCategory.REQUEST = 6] = "REQUEST";
    EventCategory[EventCategory.RESOLVE = 7] = "RESOLVE";
    EventCategory[EventCategory.BROADCAST = 8] = "BROADCAST";
    EventCategory[EventCategory.NOTIFICATION = 9] = "NOTIFICATION";

    return EventCategory;
});
