/**
 * Created by duo on 2016/9/1.
 */
CMD.register("AdsError", function(){
    var AdsError = {};

    AdsError[AdsError.NOT_INITIALIZED = 0] = "NOT_INITIALIZED";
    AdsError[AdsError.INITIALIZE_FAILED = 1] = "INITIALIZE_FAILED";
    AdsError[AdsError.INVALID_ARGUMENT = 2] = "INVALID_ARGUMENT";
    AdsError[AdsError.VIDEO_PLAYER_ERROR = 3] = "VIDEO_PLAYER_ERROR";
    AdsError[AdsError.INIT_SANITY_CHECK_FAIL = 4] = "INIT_SANITY_CHECK_FAIL";
    AdsError[AdsError.AD_BLOCKER_DETECTED = 5] = "AD_BLOCKER_DETECTED";
    AdsError[AdsError.FILE_IO_ERROR = 6] = "FILE_IO_ERROR";
    AdsError[AdsError.DEVICE_ID_ERROR = 7] = "DEVICE_ID_ERROR";
    AdsError[AdsError.SHOW_ERROR = 8] = "SHOW_ERROR";
    AdsError[AdsError.INTERNAL_ERROR = 9] = "INTERNAL_ERROR";

    return AdsError;
});