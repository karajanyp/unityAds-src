/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.CacheApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var CacheEvent = require("cache.CacheEvent");
    var Observable = require("util.observable");

    function CacheApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Cache");
        this.onDownloadStarted = new Observable.Observable5();
        this.onDownloadProgress = new Observable.Observable3();
        this.onDownloadEnd = new Observable.Observable6();
        this.onDownloadStopped = new Observable.Observable6();
        this.onDownloadError = new Observable.Observable3();
    }
    extend(CacheApi, NativeApi);

    CacheApi.prototype.download = function (fileUrl, fileId) {
        return this._nativeBridge.invoke(this._apiClass, "download", [fileUrl, fileId]);
    };
    CacheApi.prototype.stop = function () {
        return this._nativeBridge.invoke(this._apiClass, "stop");
    };
    CacheApi.prototype.isCaching = function () {
        return this._nativeBridge.invoke(this._apiClass, "isCaching");
    };
    CacheApi.prototype.getFiles = function () {
        return this._nativeBridge.invoke(this._apiClass, "getFiles");
    };
    CacheApi.prototype.getFileInfo = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getFileInfo", [e]);
    };
    CacheApi.prototype.getFilePath = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getFilePath", [e]);
    };
    CacheApi.prototype.getHash = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getHash", [e]);
    };
    CacheApi.prototype.deleteFile = function (file) {
        return this._nativeBridge.invoke(this._apiClass, "deleteFile", [file]);
    };
    CacheApi.prototype.setProgressInterval = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setProgressInterval", [e]);
    };
    CacheApi.prototype.getProgressInterval = function () {
        return this._nativeBridge.invoke(this._apiClass, "getProgressInterval");
    };
    CacheApi.prototype.setTimeouts = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "setTimeouts", [e, t]);
    };
    CacheApi.prototype.getTimeouts = function () {
        return this._nativeBridge.invoke(this._apiClass, "getTimeouts");
    };
    CacheApi.prototype.getFreeSpace = function () {
        return this._nativeBridge.invoke(this._apiClass, "getFreeSpace");
    };
    CacheApi.prototype.getTotalSpace = function () {
        return this._nativeBridge.invoke(this._apiClass, "getTotalSpace");
    };
    CacheApi.prototype.handleEvent = function (e, d) {
        switch (e) {
            case CacheEvent[CacheEvent.DOWNLOAD_STARTED]:
                this.onDownloadStarted.trigger(d[0], d[1], d[2], d[3], d[4]);
                break;

            case CacheEvent[CacheEvent.DOWNLOAD_PROGRESS]:
                this.onDownloadProgress.trigger(d[0], d[1], d[2]);
                break;

            case CacheEvent[CacheEvent.DOWNLOAD_END]:
                this.onDownloadEnd.trigger(d[0], d[1], d[2], d[3], d[4], d[5]);
                break;

            case CacheEvent[CacheEvent.DOWNLOAD_STOPPED]:
                this.onDownloadStopped.trigger(d[0], d[1], d[2], d[3], d[4], d[5]);
                break;

            case CacheEvent[CacheEvent.DOWNLOAD_ERROR]:
                this.onDownloadError.trigger(d[0], d[1], d[2]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, d);
        }
    };
    return CacheApi;
});
