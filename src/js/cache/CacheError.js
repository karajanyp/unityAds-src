/**
 * Created by duo on 2016/8/31.
 */
CMD.register("cache.CacheError", function(){
    var CacheError = {};

    CacheError[CacheError.FILE_IO_ERROR = 0] = "FILE_IO_ERROR";
    CacheError[CacheError.FILE_NOT_FOUND = 1] = "FILE_NOT_FOUND";
    CacheError[CacheError.FILE_ALREADY_CACHING = 2] = "FILE_ALREADY_CACHING";
    CacheError[CacheError.NOT_CACHING = 3] = "NOT_CACHING";
    CacheError[CacheError.JSON_ERROR = 4] = "JSON_ERROR";
    CacheError[CacheError.NO_INTERNET = 5] = "NO_INTERNET";

    return CacheError;
});