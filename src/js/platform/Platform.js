CMD.register("platform.Platform", function(require, exports){
    var platform = {};

    platform[platform.ANDROID = 0] = "ANDROID";
    platform[platform.IOS = 1] = "IOS";
    platform[platform.TEST = 2] = "TEST";

    return platform;
});
