/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.RequestApi", function (require) {
    var Platform = require("platform.Platform");
    var NativeApi = require("api.NativeApi");
    var RequestEvent = require("request.RequestEvent");
    var Observable = require("util.Observable");

    function RequestApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Request");
        this.onComplete = new Observable();
        this.onFailed = new Observable();
    }
    extend(RequestApi, NativeApi);

    /**
     *
     * @param id                {String}
     * @param url               {String}
     * @param headers           {Array}   JSONArray
     * @param connectTimeout    {Number}
     * @param readTimeout       {Number}
     * @returns {Promise}
     */
    RequestApi.prototype.get = function (id, url, headers, connectTimeout, readTimeout) {
        return this._nativeBridge.getPlatform() === Platform.IOS ?
            this._nativeBridge.invoke(this._apiClass, "get", [id, url, headers, connectTimeout]) :
            this._nativeBridge.invoke(this._apiClass, "get", [id, url, headers, connectTimeout, readTimeout]);
    };
    /**
     *
     * @param id                {String}
     * @param url               {String}
     * @param requestBody       {String}
     * @param headers           {Array}   JSONArray
     * @param connectTimeout    {Number}
     * @param readTimeout       {Number}
     * @returns {Promise}
     */
    RequestApi.prototype.post = function (id, url, requestBody, headers, connectTimeout, readTimeout) {
        return this._nativeBridge.getPlatform() === Platform.IOS ?
            this._nativeBridge.invoke(this._apiClass, "post", [id, url, requestBody, headers, connectTimeout]) :
            this._nativeBridge.invoke(this._apiClass, "post", [id, url, requestBody, headers, connectTimeout, readTimeout]);
    };
    /**
     *
     * @param id                {String}
     * @param url               {String}
     * @param headers           {Array}   JSONArray
     * @param connectTimeout    {Number}
     * @param readTimeout       {Number}
     * @returns {Promise}
     */
    RequestApi.prototype.head = function (id, url, headers, connectTimeout, readTimeout) {
        return this._nativeBridge.getPlatform() === Platform.IOS ?
            this._nativeBridge.invoke(this._apiClass, "head", [id, url, headers, connectTimeout]) :
            this._nativeBridge.invoke(this._apiClass, "head", [id, url, headers, connectTimeout, readTimeout]);
    };
    /**
     *
     * @param timeout {Number}
     * @returns {Promise}
     */
    RequestApi.prototype.setConnectTimeout = function (timeout) {
        return this._nativeBridge.invoke(this._apiClass, "setConnectTimeout", [timeout]);
    };
    RequestApi.prototype.getConnectTimeout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getConnectTimeout");
    };
    /**
     *
     * @param timeout {Number}
     * @returns {Promise}
     */
    RequestApi.prototype.setReadTimeout = function (timeout) {
        return this._nativeBridge.invoke(this._apiClass, "setReadTimeout", [timeout]);
    };
    RequestApi.prototype.getReadTimeout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getReadTimeout");
    };
    RequestApi.prototype.handleEvent = function (e, arg) {
        switch (e) {
            case RequestEvent[RequestEvent.COMPLETE]:
                this.onComplete.trigger(arg[0], arg[1], arg[2], arg[3], arg[4]);
                break;

            case RequestEvent[RequestEvent.FAILED]:
                this.onFailed.trigger(arg[0], arg[1], arg[2]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, arg);
        }
    };
    return RequestApi;
});