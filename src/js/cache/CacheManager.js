/**
 * Created by duo on 2016/9/1.
 */
CMD.register("cache.CacheManager", function (require) {
    var CacheStatus = require("cache.CacheStatus");
    var JsonParser = require("util.JsonParser");
    var CacheError = require("cache.CacheError");
    var StorageType = require("storage.StorageType");

    function CacheManager(nativeBridge, wakeUpManager) {
        var me = this;
        this._callbacks = {};
        this._fileIds = {};
        this._nativeBridge = nativeBridge;
        this._wakeUpManager = wakeUpManager;
        this._wakeUpManager.onNetworkConnected.subscribe(function () {
            return me.onNetworkConnected();
        });
        this._nativeBridge.Cache.setProgressInterval(500);
        this._nativeBridge.Cache.onDownloadStarted.subscribe(function (fileUrl, fileSize, totalSize, responseCode, headers) {
            return me.onDownloadStarted(fileUrl, fileSize, totalSize, responseCode, headers);
        });
        this._nativeBridge.Cache.onDownloadProgress.subscribe(function (fileUrl, fileSize, totalSize) {
            return me.onDownloadProgress(fileUrl, fileSize, totalSize);
        });
        this._nativeBridge.Cache.onDownloadEnd.subscribe(function (fileUrl, fileSize, totalSize, duration, responseCode, headers) {
            return me.onDownloadEnd(fileUrl, fileSize, totalSize, duration, responseCode, headers);
        });
        this._nativeBridge.Cache.onDownloadStopped.subscribe(function (fileUrl, fileSize, totalSize, duration, responseCode, headers) {
            return me.onDownloadStopped(fileUrl, fileSize, totalSize, duration, responseCode, headers);
        });
        this._nativeBridge.Cache.onDownloadError.subscribe(function (cacheError, fileUrl, i) {
            return me.onDownloadError(cacheError, fileUrl, i);
        });
    }
    CacheManager.getDefaultCacheOptions = function () {
        return {
            retries: 0
        };
    };
    CacheManager.prototype.cache = function (fileUrl, options) {
        var me = this;
        if("undefined" == typeof options){
            options = CacheManager.getDefaultCacheOptions();
        }
        return this._nativeBridge.Cache.isCaching().then(function (isCaching) {
            if(isCaching){
                return Promise.reject(CacheError.FILE_ALREADY_CACHING);
            }else{
                return Promise.all([me.shouldCache(fileUrl), me.getFileId(fileUrl)]).then(function (result) {
                    var shouldCache = result[0],
                        fileId = result[1];

                    if (!shouldCache){
                        return Promise.resolve([CacheStatus.OK, fileId]);
                    }
                    var callbackId = me.registerCallback(fileUrl, fileId, options);
                    me.downloadFile(fileUrl, fileId);
                    return callbackId;
                });
            }
        });
    };
    CacheManager.prototype.stop = function () {
        var fileUrl, canStop = false;
        for (fileUrl in this._callbacks){
            if (this._callbacks.hasOwnProperty(fileUrl)) {
                var callbackConfig = this._callbacks[fileUrl];
                if(callbackConfig.networkRetry){
                    callbackConfig.reject([CacheStatus.STOPPED, callbackConfig.fileId]);
                    delete this._callbacks[fileUrl];
                }else{
                    canStop = true;
                }
            }
        }
        canStop && this._nativeBridge.Cache.stop();
    };

    /**
     * 删除过期(21天前)的缓存，并保证缓存大小不超过512Kb
     * @returns {Promise}
     */
    CacheManager.prototype.cleanCache = function () {
        var me = this;
        return this._nativeBridge.Cache.getFiles().then(function (files) {
            // files: [{id: "fileId", found: boolean, mtime: Number, size: Number}]
            if (!files || !files.length){
                return Promise.resolve();
            }
            var fromTime = new Date().getTime() - 18144e5,
                maxSize = 52428800,
                oldFiles = [],
                totalSize = 0;

            files.sort(function (file1, file2) {
                return file2.mtime - file1.mtime;
            });
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                totalSize += file.size;
                if(file.mtime < fromTime || totalSize > maxSize){
                    oldFiles.push(file.id);
                }
            }
            if (0 === oldFiles.length){
                return Promise.resolve();
            }
            me._nativeBridge.Sdk.logInfo("Unity Ads cache: Deleting " + oldFiles.length + " old files");
            var tasks = [];
            oldFiles.map(function (file) {
                tasks.push(me._nativeBridge.Storage["delete"](StorageType.PRIVATE, "cache." + file));
                tasks.push(me._nativeBridge.Cache.deleteFile(file));
            });
            tasks.push(me._nativeBridge.Storage.write(StorageType.PRIVATE));
            return Promise.all(tasks);
        });
    };
    /**
     * 根据文件路径获取文件id, 如果文件id不存在，则生成文件id并缓存。
     * 文件id结构：文件路径的哈希码[.文件后缀名]
     *
     * @param fileUrl {String} 文件路径
     * @returns {Promise}
     */
    CacheManager.prototype.getFileId = function (fileUrl) {
        var me = this;
        if (fileUrl in this._fileIds){
            return Promise.resolve(this._fileIds[fileUrl]);
        }
        var ext, fileName = fileUrl, path = fileUrl.split("/");

        if(path.length > 1){
            fileName = path[path.length - 1];
        }

        var o = fileName.split(".");
        if(o.length > 1){
            ext = o[o.length - 1];
        }
        return this._nativeBridge.Cache.getHash(fileUrl).then(function (hash) {
            var r;
            return r = ext ? me._fileIds[fileUrl] = hash + "." + ext : me._fileIds[fileUrl] = hash;
        });
    };
    //{cacheDirectory}/{cacheFilePrefix} + {fileId};
    CacheManager.prototype.getFileUrl = function (fileId) {
        return this._nativeBridge.Cache.getFilePath(fileId).then(function (fileUrl) {
            return "file://" + fileUrl;
        });
    };
    CacheManager.prototype.shouldCache = function (fileUrl) {
        var me = this;
        return this.getFileId(fileUrl).then(function (fileId) {
            return me._nativeBridge.Cache.getFileInfo(fileId).then(function (fileInfo) {
                if(fileInfo.found && fileInfo.size > 0){
                    return me._nativeBridge.Storage.get(StorageType.PRIVATE, "cache." + fileId).then(function (cacheResponseJsonText) {
                        var cacheResponse = JsonParser.parse(cacheResponseJsonText);
                        return !cacheResponse.fullyDownloaded;
                    })
                }else{
                    return true;
                }
            });
        });
    };
    CacheManager.prototype.downloadFile = function (fileUrl, fileId) {
        var me = this;
        this._nativeBridge.Cache.download(fileUrl, fileId)["catch"](function (errorState) {
            var callbackConfig = me._callbacks[fileUrl];
            if (callbackConfig) {
                switch (errorState) {
                    case CacheError[CacheError.FILE_ALREADY_CACHING]:
                        me._nativeBridge.Sdk.logError("Unity Ads cache error: attempted to add second download from " + fileUrl + " to " + fileId);
                        callbackConfig.reject(errorState);
                        return;

                    case CacheError[CacheError.NO_INTERNET]:
                        me.handleRetry(callbackConfig, fileUrl, CacheError[CacheError.NO_INTERNET]);
                        return;

                    default:
                        callbackConfig.reject(errorState);
                        return;
                }
            }
        });
    };
    CacheManager.prototype.registerCallback = function (fileUrl, fileId, options) {
        var me = this;
        return new Promise(function (resolve, reject) {
            var callbackConfig = {
                fileId: fileId,
                networkRetry: false,
                retryCount: 0,
                resolve: resolve,
                reject: reject,
                options: options
            };
            me._callbacks[fileUrl] = callbackConfig;
        });
    };
    CacheManager.prototype.createCacheResponse = function (fullyDownloaded, url, size, totalSize, duration, responseCode, headers) {
        return {
            fullyDownloaded: fullyDownloaded,
            url: url,
            size: size,
            totalSize: totalSize,
            duration: duration,
            responseCode: responseCode,
            headers: headers
        };
    };
    /**
     * 将文件缓存信息写入本地存储中
     * @param fileUrl       {String} 文件路径
     * @param cacheResponse {Object} 文件缓存信息
     */
    CacheManager.prototype.writeCacheResponse = function (fileUrl, cacheResponse) {
        this._nativeBridge.Storage.set(StorageType.PRIVATE, "cache." + this._fileIds[fileUrl], JSON.stringify(cacheResponse));
        this._nativeBridge.Storage.write(StorageType.PRIVATE);
    };
    CacheManager.prototype.onDownloadStarted = function (fileUrl, fileSize, totalSize, responseCode, headers) {
        if(0 === fileSize) {
            this.writeCacheResponse(fileUrl, this.createCacheResponse(false, fileUrl, fileSize, totalSize, 0, responseCode, headers));
        }
    };
    CacheManager.prototype.onDownloadProgress = function (fileUrl, fileSize, totalSize) {
        this._nativeBridge.Sdk.logDebug('Cache progress for "' + fileUrl + '": ' + Math.round(fileSize / totalSize * 100) + "%");
    };
    CacheManager.prototype.onDownloadEnd = function (fileUrl, fileSize, totalSize, duration, responseCode, headers) {
        var callbackConfig = this._callbacks[fileUrl];
        if(callbackConfig){
            this.writeCacheResponse(fileUrl, this.createCacheResponse(true, fileUrl, fileSize, totalSize, duration, responseCode, headers));
            callbackConfig.resolve([CacheStatus.OK, callbackConfig.fileId]);
            delete this._callbacks[fileUrl];
        }
    };
    CacheManager.prototype.onDownloadStopped = function (fileUrl, fileSize, totalSize, duration, responseCode, headers) {
        var callbackConfig = this._callbacks[fileUrl];
        if(callbackConfig){
            this.writeCacheResponse(fileUrl, this.createCacheResponse(false, fileUrl, fileSize, totalSize, duration, responseCode, headers));
            callbackConfig.resolve([CacheStatus.STOPPED, callbackConfig.fileId]);
            delete this._callbacks[fileUrl];
        }
    };
    CacheManager.prototype.onDownloadError = function (cacheError, fileUrl, i) {
        var callbackConfig = this._callbacks[fileUrl];
        if (callbackConfig) {
            switch (cacheError) {
                case CacheError[CacheError.FILE_IO_ERROR]:
                    this.handleRetry(callbackConfig, fileUrl, cacheError);
                    return;

                default:
                    callbackConfig.reject(cacheError);
                    delete this._callbacks[fileUrl];
                    return
            }
        }
    };
    CacheManager.prototype.handleRetry = function (callbackConfig, fileUrl, errorState) {
        if(callbackConfig.retryCount < callbackConfig.options.retries){
            callbackConfig.retryCount++;
            callbackConfig.networkRetry = true;
        }else{
            callbackConfig.reject(errorState);
            delete this._callbacks[fileUrl];
        }
    };
    CacheManager.prototype.onNetworkConnected = function () {
        var fileUrl;
        for (fileUrl in this._callbacks){
            if (this._callbacks.hasOwnProperty(fileUrl)) {
                var callbackConfig = this._callbacks[fileUrl];
                if(callbackConfig.networkRetry){
                    callbackConfig.networkRetry = false;
                    this.downloadFile(fileUrl, callbackConfig.fileId);
                }
            }
        }
    };
    return CacheManager;
});
