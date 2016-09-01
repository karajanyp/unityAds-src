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
        this._nativeBridge.Cache.onDownloadStarted.subscribe(function (e, t, i, r, o) {
            return me.onDownloadStarted(e, t, i, r, o);
        });
        this._nativeBridge.Cache.onDownloadProgress.subscribe(function (e, t, i) {
            return me.onDownloadProgress(e, t, i);
        });
        this._nativeBridge.Cache.onDownloadEnd.subscribe(function (e, t, i, r, o, a) {
            return me.onDownloadEnd(e, t, i, r, o, a);
        });
        this._nativeBridge.Cache.onDownloadStopped.subscribe(function (e, t, i, r, o, a) {
            return me.onDownloadStopped(e, t, i, r, o, a);
        });
        this._nativeBridge.Cache.onDownloadError.subscribe(function (e, t, i) {
            return me.onDownloadError(e, t, i);
        });
    }
    CacheManager.getDefaultCacheOptions = function () {
        return {
            retries: 0
        };
    };
    CacheManager.prototype.cache = function (n, i) {
        var me = this;
        "undefined" == typeof i && (i = CacheManager.getDefaultCacheOptions());
        return this._nativeBridge.Cache.isCaching().then(function (e) {
            return e ? Promise.reject(CacheError.FILE_ALREADY_CACHING) : Promise.all([me.shouldCache(n), me.getFileId(n)]).then(function (e) {
                var t = e[0], a = e[1];
                if (!t) return Promise.resolve([CacheStatus.OK, a]);
                var s = me.registerCallback(n, a, i);
                me.downloadFile(n, a);
                return s;
            });
        });
    };
    CacheManager.prototype.stop = function () {
        var e, t = false;
        for (e in this._callbacks) if (this._callbacks.hasOwnProperty(e)) {
            var n = this._callbacks[e];
            n.networkRetry ? (n.reject([CacheStatus.STOPPED, n.fileId]), delete this._callbacks[e]) : t = !0;
        }
        t && this._nativeBridge.Cache.stop();
    };
    CacheManager.prototype.cleanCache = function () {
        var e = this;
        return this._nativeBridge.Cache.getFiles().then(function (t) {
            if (!t || !t.length) return Promise.resolve();
            var i = new Date().getTime() - 18144e5, r = 52428800, o = [], a = 0;
            t.sort(function (e, t) {
                return t.mtime - e.mtime;
            });
            for (var s = 0; s < t.length; s++) {
                var c = t[s];
                a += c.size;
                (c.mtime < i || a > r) && o.push(c.id);
            }
            if (0 === o.length) return Promise.resolve();
            e._nativeBridge.Sdk.logInfo("Unity Ads cache: Deleting " + o.length + " old files");
            var u = [];
            o.map(function (t) {
                u.push(e._nativeBridge.Storage["delete"](StorageType.PRIVATE, "cache." + t)),
                    u.push(e._nativeBridge.Cache.deleteFile(t));
            });
            u.push(e._nativeBridge.Storage.write(StorageType.PRIVATE))
            return Promise.all(u);
        });
    };
    CacheManager.prototype.getFileId = function (e) {
        var t = this;
        if (e in this._fileIds) return Promise.resolve(this._fileIds[e]);
        var n, i = e, r = e.split("/");
        r.length > 1 && (i = r[r.length - 1]);
        var o = i.split(".");
        o.length > 1 && (n = o[o.length - 1]);
        return this._nativeBridge.Cache.getHash(e).then(function (i) {
            var r;
            return r = n ? t._fileIds[e] = i + "." + n : t._fileIds[e] = i;
        });
    };
    CacheManager.prototype.getFileUrl = function (e) {
        return this._nativeBridge.Cache.getFilePath(e).then(function (e) {
            return "file://" + e;
        });
    };
    CacheManager.prototype.shouldCache = function (e) {
        var t = this;
        return this.getFileId(e).then(function (e) {
            return t._nativeBridge.Cache.getFileInfo(e).then(function (r) {
                return r.found && r.size > 0 ? t._nativeBridge.Storage.get(StorageType.PRIVATE, "cache." + e).then(function (e) {
                    var t = JsonParser.parse(e);
                    return !t.fullyDownloaded;
                }) : !0;
            });
        });
    };
    CacheManager.prototype.downloadFile = function (e, n) {
        var i = this;
        this._nativeBridge.Cache.download(e, n)["catch"](function (r) {
            var o = i._callbacks[e];
            if (o) switch (r) {
                case CacheError[CacheError.FILE_ALREADY_CACHING]:
                    return i._nativeBridge.Sdk.logError("Unity Ads cache error: attempted to add second download from " + e + " to " + n),
                        void o.reject(r);

                case CacheError[CacheError.NO_INTERNET]:
                    return void i.handleRetry(o, e, CacheError[CacheError.NO_INTERNET]);

                default:
                    return void o.reject(r);
            }
        });
    };
    CacheManager.prototype.registerCallback = function (e, t, n) {
        var i = this;
        return new Promise(function (r, o) {
            var a = {
                fileId: t,
                networkRetry: !1,
                retryCount: 0,
                resolve: r,
                reject: o,
                options: n
            };
            i._callbacks[e] = a;
        });
    };
    CacheManager.prototype.createCacheResponse = function (e, t, n, i, r, o, a) {
        return {
            fullyDownloaded: e,
            url: t,
            size: n,
            totalSize: i,
            duration: r,
            responseCode: o,
            headers: a
        };
    };
    CacheManager.prototype.writeCacheResponse = function (e, t) {
        this._nativeBridge.Storage.set(StorageType.PRIVATE, "cache." + this._fileIds[e], JSON.stringify(t));
        this._nativeBridge.Storage.write(StorageType.PRIVATE);
    };
    CacheManager.prototype.onDownloadStarted = function (e, t, n, i, r) {
        if(0 === t) {
            this.writeCacheResponse(e, this.createCacheResponse(false, e, t, n, 0, i, r));
        }
    };
    CacheManager.prototype.onDownloadProgress = function (e, t, n) {
        this._nativeBridge.Sdk.logDebug('Cache progress for "' + e + '": ' + Math.round(t / n * 100) + "%");
    };
    CacheManager.prototype.onDownloadEnd = function (e, t, n, i, o, a) {
        var s = this._callbacks[e];
        if(s){
            this.writeCacheResponse(e, this.createCacheResponse(!0, e, t, n, i, o, a));
            s.resolve([CacheStatus.OK, s.fileId]), delete this._callbacks[e];
        }
    };
    CacheManager.prototype.onDownloadStopped = function (e, t, n, i, o, a) {
        var s = this._callbacks[e];
        if(s){
            this.writeCacheResponse(e, this.createCacheResponse(!1, e, t, n, i, o, a));
            s.resolve([CacheStatus.STOPPED, s.fileId]);
            delete this._callbacks[e];
        }
    };
    CacheManager.prototype.onDownloadError = function (e, n, i) {
        var r = this._callbacks[n];
        if (r) switch (e) {
            case CacheError[CacheError.FILE_IO_ERROR]:
                this.handleRetry(r, n, e);
                return;

            default:
                r.reject(e);
                delete this._callbacks[n];
                return
        }
    };
    CacheManager.prototype.handleRetry = function (e, t, n) {
        if(e.retryCount < e.options.retries){
            e.retryCount++;
            e.networkRetry = true;
        }else{
            e.reject(n);
            delete this._callbacks[t];
        }
    };
    CacheManager.prototype.onNetworkConnected = function () {
        var e;
        for (e in this._callbacks){
            if (this._callbacks.hasOwnProperty(e)) {
                var t = this._callbacks[e];
                if(t.networkRetry){
                    t.networkRetry = false;
                    this.downloadFile(e, t.fileId);
                }
            }
        }
    };
    return CacheManager;
});
