/**
 * Created by duo on 2016/8/31.
 */
CMD.register("cache.CacheEvent", function(){
    var CacheEvent = {};

    CacheEvent[CacheEvent.DOWNLOAD_STARTED = 0] = "DOWNLOAD_STARTED";
    CacheEvent[CacheEvent.DOWNLOAD_PROGRESS = 1] = "DOWNLOAD_PROGRESS";
    CacheEvent[CacheEvent.DOWNLOAD_END = 2] = "DOWNLOAD_END";
    CacheEvent[CacheEvent.DOWNLOAD_STOPPED = 3] = "DOWNLOAD_STOPPED";
    CacheEvent[CacheEvent.DOWNLOAD_ERROR = 4] = "DOWNLOAD_ERROR";

    return CacheEvent;
});