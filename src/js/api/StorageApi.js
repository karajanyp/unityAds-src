/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.StorageApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var StorageType = require("storage.StorageType");

    function StorageApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Storage");
    }
    extend(StorageApi, NativeApi);

    StorageApi.prototype.read = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "read", [StorageType[e]]);
    };
    StorageApi.prototype.write = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "write", [StorageType[e]]);
    };
    StorageApi.prototype.get = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "get", [StorageType[e], t]);
    };
    StorageApi.prototype.set = function (e, t, i) {
        return this._nativeBridge.invoke(this._apiClass, "set", [StorageType[e], t, i]);
    };
    StorageApi.prototype["delete"] = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "delete", [StorageType[e], t]);
    };
    StorageApi.prototype.clear = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "clear", [StorageType[e]]);
    };

    /**
     *
     * @param storageType
     * @param category
     * @param recursive
     * @return keys {Array}
     */
    StorageApi.prototype.getKeys = function (storageType, category, recursive) {
        return this._nativeBridge.invoke(this._apiClass, "getKeys", [StorageType[storageType], category, recursive]);
    };
    StorageApi.prototype.handleEvent = function (e, t) {
        switch (e) {
        }
    };
    return StorageApi;
});
