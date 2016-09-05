/**
 * Created by duo on 2016/8/31.
 */
CMD.register("resolve.ResolveEvent", function(){
    var ResolveEvent = {};

    ResolveEvent[ResolveEvent.COMPLETE = 0] = "COMPLETE";
    ResolveEvent[ResolveEvent.FAILED = 1] = "FAILED";

    return ResolveEvent;
});