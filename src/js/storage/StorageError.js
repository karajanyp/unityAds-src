/**
 * Created by duo on 2016/8/31.
 */
CMD.register("storage.StorageError", function () {
    var StorageError = {};

    StorageError[StorageError.COULDNT_SET_VALUE = 0] = "COULDNT_SET_VALUE";
    StorageError[StorageError.COULDNT_GET_VALUE = 1] = "COULDNT_GET_VALUE";
    StorageError[StorageError.COULDNT_WRITE_STORAGE_TO_CACHE = 2] = "COULDNT_WRITE_STORAGE_TO_CACHE";
    StorageError[StorageError.COULDNT_CLEAR_STORAGE = 3] = "COULDNT_CLEAR_STORAGE";
    StorageError[StorageError.COULDNT_GET_STORAGE = 4] = "COULDNT_GET_STORAGE";
    StorageError[StorageError.COULDNT_DELETE_VALUE = 5] = "COULDNT_DELETE_VALUE";

    return StorageError;
});