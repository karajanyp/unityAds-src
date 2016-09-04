/**
 * Created by duo on 2016/9/1.
 */
CMD.register("request.Request", function () {

    function Request(nativeBridge, wakeUpManager) {
        var me = this;
        this._nativeBridge = nativeBridge;
        this._wakeUpManager = wakeUpManager;
        this._nativeBridge.Request.onComplete.subscribe(function (callbackId, url, response, responseCode, headers) {
            return me.onRequestComplete(callbackId, url, response, responseCode, headers);
        });
        this._nativeBridge.Request.onFailed.subscribe(function (callbackId, url, errorMsg) {
            return me.onRequestFailed(callbackId, url, errorMsg);
        });
        this._wakeUpManager.onNetworkConnected.subscribe(function () {
            return me.onNetworkConnected();
        });
    }

    /**
     * 获取header内容，header不存在，返回null
     * @param headers   {Object} {Array}  头部对象，可以为对象{headerKey: headerContent}, 或数组[[headerKey, headerContent],...s]
     * @param key       {String} headerKey
     * @returns {String}
     */
    Request.getHeader = function (headers, key) {
        if (headers instanceof Array) {
            for (var i = 0; i < headers.length; ++i) {
                var header = headers[i];
                if (header[0].match(new RegExp(key, "i"))){
                    return header[1];
                }
            }
        } else {
            for (var header in headers) {
                if (headers.hasOwnProperty(header) && header.match(new RegExp(key, "i"))) {
                    return headers[header].toString();
                }
            }
        }
        return null;
    };
    Request.getDefaultRequestOptions = function () {
        return {
            retries: 0,
            retryDelay: 0,
            followRedirects: false,
            retryWithConnectionEvents: false
        };
    };
    /**
     * HttpGet
     * @param url
     * @param headers
     * @param options
     * @returns {Promise} resolve({url:String, response:String, responseCode:Number, headers:Object})
     */
    Request.prototype.get = function (url, headers, options) {
        if(void 0 === headers){
            headers = [];
        }
        if("undefined" == typeof options){
            options = Request.getDefaultRequestOptions();
        }
        var callbackId = Request._callbackId++,
            promise = this.registerCallback(callbackId);

        this.invokeRequest(callbackId, {
            method: 0,
            url: url,
            headers: headers,
            retryCount: 0,
            options: options
        });
        return promise;
    };
    /**
     * HttpPost
     * @param url
     * @param requestBody
     * @param headers
     * @param options
     * @returns {Promise} resolve({url:String, response:String, responseCode:Number, headers:Object})
     */
    Request.prototype.post = function (url, requestBody, headers, options) {
        if(void 0 === requestBody){
            requestBody = "";
        }
        if(void 0 === headers){
            headers = [];
        }
        if("undefined" == typeof options){
            options = Request.getDefaultRequestOptions();
        }
        headers.push(["Content-Type", "application/json"]);
        var callbackId = Request._callbackId++,
            promise = this.registerCallback(callbackId);

        this.invokeRequest(callbackId, {
            method: 1,
            url: url,
            data: requestBody,
            headers: headers,
            retryCount: 0,
            options: options
        });
        return promise;
    };
    /**
     * HttpHead
     * @param url
     * @param headers
     * @param options
     * @returns {Promise} resolve({url:String, response:String, responseCode:Number, headers:Object})
     */
    Request.prototype.head = function (url, headers, options) {
        if(void 0 === headers){
            headers = [];
        }
        if("undefined" == typeof options){
            options = Request.getDefaultRequestOptions();
        }
        var callbackId = Request._callbackId++,
            promise = this.registerCallback(callbackId);
        this.invokeRequest(callbackId, {
            method: 2,
            url: url,
            headers: headers,
            retryCount: 0,
            options: options
        });
        return promise;
    };
    /**
     * 注册回调方法，用于请求完毕后Native调用
     * @param callbackId {Number}
     * @returns {Promise}
     */
    Request.prototype.registerCallback = function (callbackId) {
        return new Promise(function (resolve, reject) {
            var callback = {};
            callback[0] = resolve;
            callback[1] = reject;
            Request._callbacks[callbackId] = callback;
        });
    };
    /**
     * 执行http请求
     * @param callbackId    {Number}    回调id
     * @param requestConfig {Object}    请求配置信息
     * @returns {Promise}
     */
    Request.prototype.invokeRequest = function (callbackId, requestConfig) {
        Request._requests[callbackId] = requestConfig;
        switch (requestConfig.method) {
            case 0:
                return this._nativeBridge.Request.get(
                    callbackId.toString(),
                    requestConfig.url,
                    requestConfig.headers,
                    Request._connectTimeout,
                    Request._readTimeout
                );

            case 1:
                return this._nativeBridge.Request.post(
                    callbackId.toString(),
                    requestConfig.url,
                    requestConfig.data,
                    requestConfig.headers,
                    Request._connectTimeout,
                    Request._readTimeout
                );

            case 2:
                return this._nativeBridge.Request.head(
                    callbackId.toString(),
                    requestConfig.url,
                    requestConfig.headers,
                    Request._connectTimeout,
                    Request._readTimeout
                );

            default:
                throw new Error('Unsupported request method "' + requestConfig.method + '"');
        }
    };
    /**
     * request完成后执行回调，从第三个参数开始作为回调方法的参数
     * @param callbackId {Number} 回调id
     * @param callbackState {Number} 回调状态{0:成功|1:失败}
     */
    Request.prototype.finishRequest = function (callbackId, callbackState) {
        var args = [];
        for (var i = 2; i < arguments.length; i++){
            args[i - 2] = arguments[i];
        }
        var callback = Request._callbacks[callbackId];
        if(callback){
            callback[callbackState].apply(callback, args);
            delete Request._callbacks[callbackId];
            delete Request._requests[callbackId];
        }
    };
    /**
     * 请求失败的处理方法，如果设置有请求重试，则重试
     * @param callbackId    {Number}
     * @param requestConfig {Object}
     * @param errorMsg      {String}
     */
    Request.prototype.handleFailedRequest = function (callbackId, requestConfig, errorMsg) {
        var me = this;
        if(requestConfig.retryCount < requestConfig.options.retries ){
            requestConfig.retryCount++;
            setTimeout(function () {
                me.invokeRequest(callbackId, requestConfig);
            }, requestConfig.options.retryDelay)
        }else{
            requestConfig.options.retryWithConnectionEvents || this.finishRequest(callbackId, 1, [requestConfig, errorMsg]);
        }
    };
    /**
     * 事件监听器：请求成功
     * @param id
     * @param url
     * @param response
     * @param responseCode
     * @param headers
     */
    Request.prototype.onRequestComplete = function (id, url, response, responseCode, headers) {
        var callbackId = parseInt(id, 10),
            json = {
                url: url,
                response: response,
                responseCode: responseCode,
                headers: headers
            },
            requestConfig = Request._requests[callbackId];
        if (-1 !== Request._allowedResponseCodes.indexOf(responseCode)){
            //重定向
            if (-1 !== Request._redirectResponseCodes.indexOf(responseCode) && requestConfig.options.followRedirects) {
                var url = requestConfig.url = Request.getHeader(headers, "location");
                if(url && url.match(/^https?/i)){
                    this.invokeRequest(callbackId, requestConfig)
                }else{
                    this.finishRequest(callbackId, 0, json);
                }
            } else {
                this.finishRequest(callbackId, 0, json);
            }
        }else{
            this.handleFailedRequest(callbackId, requestConfig, "FAILED_AFTER_RETRIES");
        }
    };
    /**
     * 事件监听器：请求失败
     * @param id
     * @param url
     * @param errorMsg
     */
    Request.prototype.onRequestFailed = function (id, url, errorMsg) {
        var callbackId = parseInt(id, 10),
            requestConfig = Request._requests[callbackId];
        this.handleFailedRequest(callbackId, requestConfig, errorMsg);
    };
    /**
     * 事件监听器：网络重连
     */
    Request.prototype.onNetworkConnected = function () {
        var callbackId;
        for (callbackId in Request._requests){
            if (Request._requests.hasOwnProperty(callbackId)) {
                var requestConfig = Request._requests[callbackId];
                if(requestConfig.options.retryWithConnectionEvents && requestConfig.options.retries === requestConfig.retryCount){
                    this.invokeRequest(callbackId, requestConfig);
                }
            }
        }
    };
    Request._connectTimeout = 30000;
    Request._readTimeout = 30000;
    Request._allowedResponseCodes = [200, 501, 300, 301, 302, 303, 304, 305, 306, 307, 308];
    Request._redirectResponseCodes = [300, 301, 302, 303, 304, 305, 306, 307, 308];
    Request._callbackId = 1;
    Request._callbacks = {};
    Request._requests = {};
    return Request;
});
