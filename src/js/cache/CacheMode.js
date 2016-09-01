/**
 * Created by duo on 2016/8/31.
 */
CMD.register("cache.CacheMode", function (){
    var CacheMode = {};

    CacheMode[CacheMode.FORCED = 0] = "FORCED";
    CacheMode[CacheMode.ALLOWED = 1] = "ALLOWED";
    CacheMode[CacheMode.DISABLED = 2] = "DISABLED";

    return CacheMode;
});