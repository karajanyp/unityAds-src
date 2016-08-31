/**
 * Created by duo on 2016/8/31.
 */
CMD.register("storage.StorageType", function () {
    var StorageType = {};

    StorageType[StorageType.PRIVATE = 0] = "PRIVATE";
    StorageType[StorageType.PUBLIC = 1] = "PUBLIC";

    return StorageType;
});
