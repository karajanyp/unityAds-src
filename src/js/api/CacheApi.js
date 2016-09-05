/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.CacheApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var CacheEvent = require("cache.CacheEvent");
    var Observable = require("util.Observable");

    function CacheApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Cache");
        this.onDownloadStarted = new Observable();
        this.onDownloadProgress = new Observable();
        this.onDownloadEnd = new Observable();
        this.onDownloadStopped = new Observable();
        this.onDownloadError = new Observable();
    }
    extend(CacheApi, NativeApi);
    /**
     *
     * @param fileUrl {String}
     * @param fileId {String}
     * @returns {Promise}
     */
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
    /**
     *
     * @param fileId {String}
     * @returns {Promise}
     */
    CacheApi.prototype.getFileInfo = function (fileId) {
        return this._nativeBridge.invoke(this._apiClass, "getFileInfo", [fileId]);
    };
    /**
     *
     * @param fileId {String}
     * @returns {Promise}
     */
    CacheApi.prototype.getFilePath = function (fileId) {
        return this._nativeBridge.invoke(this._apiClass, "getFilePath", [fileId]);
    };
    /**
     *
     * @param fileId {String}
     * @returns {Promise}
     */
    CacheApi.prototype.getHash = function (fileId) {
        return this._nativeBridge.invoke(this._apiClass, "getHash", [fileId]);
    };
    /**
     *
     * @param fileId {String}
     * @returns {Promise}
     */
    CacheApi.prototype.deleteFile = function (fileId) {
        return this._nativeBridge.invoke(this._apiClass, "deleteFile", [fileId]);
    };
    /**
     *
     * @param interval {Number}
     * @returns {Promise}
     */
    CacheApi.prototype.setProgressInterval = function (interval) {
        return this._nativeBridge.invoke(this._apiClass, "setProgressInterval", [interval]);
    };
    CacheApi.prototype.getProgressInterval = function () {
        return this._nativeBridge.invoke(this._apiClass, "getProgressInterval");
    };
    CacheApi.prototype.setTimeouts = function (connectTimeout, readTimeout) {
        return this._nativeBridge.invoke(this._apiClass, "setTimeouts", [connectTimeout, readTimeout]);
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
    CacheApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case CacheEvent[CacheEvent.DOWNLOAD_STARTED]:
                this.onDownloadStarted.trigger(args[0], args[1], args[2], args[3], args[4]);
                break;

            case CacheEvent[CacheEvent.DOWNLOAD_PROGRESS]:
                this.onDownloadProgress.trigger(args[0], args[1], args[2]);
                break;

            case CacheEvent[CacheEvent.DOWNLOAD_END]:
                this.onDownloadEnd.trigger(args[0], args[1], args[2], args[3], args[4], args[5]);
                break;

            case CacheEvent[CacheEvent.DOWNLOAD_STOPPED]:
                this.onDownloadStopped.trigger(args[0], args[1], args[2], args[3], args[4], args[5]);
                break;

            case CacheEvent[CacheEvent.DOWNLOAD_ERROR]:
                this.onDownloadError.trigger(args[0], args[1], args[2]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, args);
        }
    };
    return CacheApi;
});
