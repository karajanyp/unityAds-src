/**
 * Created by duo on 2016/9/1.
 */
CMD.register("cache.CacheStatus", function(){
    var CacheStatus = {};

    CacheStatus[CacheStatus.OK = 0] = "OK";
    CacheStatus[CacheStatus.STOPPED = 1] = "STOPPED";

    return CacheStatus;
});