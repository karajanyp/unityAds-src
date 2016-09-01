/**
 * Created by duo on 2016/9/1.
 */
CMD.register("request.Request", function () {

    function Request(nativeBridge, wakeUpManager) {
        var me = this;
        this._nativeBridge = nativeBridge;
        this._wakeUpManager = wakeUpManager;
        this._nativeBridge.Request.onComplete.subscribe(function (e, t, i, r, o) {
            return me.onRequestComplete(e, t, i, r, o);
        });
        this._nativeBridge.Request.onFailed.subscribe(function (e, t, i) {
            return me.onRequestFailed(e, t, i);
        });
        this._wakeUpManager.onNetworkConnected.subscribe(function () {
            return me.onNetworkConnected();
        });
    }
    Request.getHeader = function (e, t) {
        if (e instanceof Array) {
            for (var n = 0; n < e.length; ++n) {
                var i = e[n];
                if (i[0].match(new RegExp(t, "i"))){
                    return i[1];
                }
            }
        } else {
            for (var r in e) {
                if (e.hasOwnProperty(r) && r.match(new RegExp(t, "i"))) {
                    return e[r].toString();
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
    Request.prototype.get = function (t, n, i) {
        void 0 === n && (n = []);
        "undefined" == typeof i && (i = Request.getDefaultRequestOptions());
        var id = Request._callbackId++,
            o = this.registerCallback(id);

        this.invokeRequest(id, {
            method: 0,
            url: t,
            headers: n,
            retryCount: 0,
            options: i
        });
        return o;
    };
    Request.prototype.post = function (t, n, i, r) {
        void 0 === n && (n = "");
        void 0 === i && (i = []);
        "undefined" == typeof r && (r = Request.getDefaultRequestOptions());
        i.push(["Content-Type", "application/json"]);
        var id = Request._callbackId++,
            a = this.registerCallback(id);

        this.invokeRequest(id, {
            method: 1,
            url: t,
            data: n,
            headers: i,
            retryCount: 0,
            options: r
        });
        return a;
    };
    Request.prototype.head = function (t, n, i) {
        void 0 === n && (n = []);
        "undefined" == typeof i && (i = Request.getDefaultRequestOptions());
        var r = Request._callbackId++, o = this.registerCallback(r);
        this.invokeRequest(r, {
            method: 2,
            url: t,
            headers: n,
            retryCount: 0,
            options: i
        });
        return o;
    };
    Request.prototype.registerCallback = function (t) {
        return new Promise(function (n, i) {
            var r = {};
            r[0] = n;
            r[1] = i;
            Request._callbacks[t] = r;
        });
    };
    Request.prototype.invokeRequest = function (t, n) {
        Request._requests[t] = n;
        switch (n.method) {
            case 0:
                return this._nativeBridge.Request.get(
                    t.toString(),
                    n.url,
                    n.headers,
                    Request._connectTimeout,
                    Request._readTimeout
                );

            case 1:
                return this._nativeBridge.Request.post(
                    t.toString(),
                    n.url,
                    n.data,
                    n.headers,
                    Request._connectTimeout,
                    Request._readTimeout
                );

            case 2:
                return this._nativeBridge.Request.head(
                    t.toString(),
                    n.url,
                    n.headers,
                    Request._connectTimeout,
                    Request._readTimeout
                );

            default:
                throw new Error('Unsupported request method "' + n.method + '"');
        }
    };
    Request.prototype.finishRequest = function (t, n) {
        for (var i = [], r = 2; r < arguments.length; r++){
            i[r - 2] = arguments[r];
        }
        var o = Request._callbacks[t];
        if(o){
            o[n].apply(o, i);
            delete Request._callbacks[t];
            delete Request._requests[t];
        }
    };
    Request.prototype.handleFailedRequest = function (e, t, n) {
        var me = this;
        if(t.retryCount < t.options.retries ){
            t.retryCount++;
            setTimeout(function () {
                me.invokeRequest(e, t);
            }, t.options.retryDelay)
        }else{
            t.options.retryWithConnectionEvents || this.finishRequest(e, 1, [t, n]);
        }
    };
    Request.prototype.onRequestComplete = function (id, url, response, responseCode, headers) {
        var key = parseInt(id, 10),
            s = {
                url: url,
                response: response,
                responseCode: responseCode,
                headers: headers
            },
            req = Request._requests[key];
        if (-1 !== Request._allowedResponseCodes.indexOf(responseCode)){
            if (-1 !== Request._redirectResponseCodes.indexOf(responseCode) && req.options.followRedirects) {
                var url = req.url = Request.getHeader(headers, "location");
                if(url && url.match(/^https?/i)){
                    this.invokeRequest(key, req)
                }else{
                    this.finishRequest(key, 0, s);
                }
            } else {
                this.finishRequest(key, 0, s);
            }
        }else{
            this.handleFailedRequest(key, req, "FAILED_AFTER_RETRIES");
        }
    };
    Request.prototype.onRequestFailed = function (t, n, i) {
        var r = parseInt(t, 10), o = Request._requests[r];
        this.handleFailedRequest(r, o, i);
    };
    Request.prototype.onNetworkConnected = function () {
        var key;
        for (key in Request._requests){
            if (Request._requests.hasOwnProperty(key)) {
                var n = Request._requests[key];
                if(n.options.retryWithConnectionEvents && n.options.retries === n.retryCount){
                    this.invokeRequest(key, n);
                }
            }
        }
    };
    Request._connectTimeout = 3e4;
    Request._readTimeout = 3e4;
    Request._allowedResponseCodes = [200, 501, 300, 301, 302, 303, 304, 305, 306, 307, 308];
    Request._redirectResponseCodes = [300, 301, 302, 303, 304, 305, 306, 307, 308];
    Request._callbackId = 1;
    Request._callbacks = {};
    Request._requests = {};
    return Request;
});
