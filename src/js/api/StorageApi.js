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

    StorageApi.prototype.read = function (storageType) {
        return this._nativeBridge.invoke(this._apiClass, "read", [StorageType[storageType]]);
    };
    StorageApi.prototype.write = function (storageType) {
        return this._nativeBridge.invoke(this._apiClass, "write", [StorageType[storageType]]);
    };
    StorageApi.prototype.get = function (storageType, key) {
        return this._nativeBridge.invoke(this._apiClass, "get", [StorageType[storageType], key]);
    };
    StorageApi.prototype.set = function (storageType, key, value) {
        return this._nativeBridge.invoke(this._apiClass, "set", [StorageType[storageType], key, value]);
    };
    StorageApi.prototype["delete"] = function (storageType, category) {
        return this._nativeBridge.invoke(this._apiClass, "delete", [StorageType[storageType], category]);
    };
    StorageApi.prototype.clear = function (storageType) {
        return this._nativeBridge.invoke(this._apiClass, "clear", [StorageType[storageType]]);
    };

    /**
     *
     * @param storageType   {String}
     * @param category      {String}
     * @param recursive     {Boolean}
     * @return {Promise}    resolve(keys:Array) | reject(err:StorageError, storageType:StorageType, category:String)
     */
    StorageApi.prototype.getKeys = function (storageType, category, recursive) {
        return this._nativeBridge.invoke(this._apiClass, "getKeys", [StorageType[storageType], category, recursive]);
    };
    StorageApi.prototype.handleEvent = function (e, arg) {
        switch (e) {
        }
    };
    return StorageApi;
});
