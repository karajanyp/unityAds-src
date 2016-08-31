/**
 * Created by duo on 2016/8/31.
 */
CMD.register("device.AndroidStorageType", function () {
    var AndroidStorageType = {};

    AndroidStorageType[AndroidStorageType.EXTERNAL = 0] = "EXTERNAL";
    AndroidStorageType[AndroidStorageType.INTERNAL = 1] = "INTERNAL";

    return AndroidStorageType;
});