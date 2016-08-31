/**
 * Created by duo on 2016/8/31.
 */
CMD.register("request.RequestEvent", function(){
    var RequestEvent = {};

    RequestEvent[RequestEvent.COMPLETE = 0] = "COMPLETE";
    RequestEvent[RequestEvent.FAILED = 1] = "FAILED";

    return RequestEvent;
});
