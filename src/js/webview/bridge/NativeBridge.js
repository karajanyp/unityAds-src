/**
 * Created by duo on 2016/8/31.
 */

CMD.register("webview.bridge.NativeBridge", function(require){
    var CallbackStatus  = require("webview.bridge.CallbackStatus");
    var Platform        = require("platform.Platform");
    var AppSheetApi     = require("");
    var IosAdUnitApi    = require("");
    var AndroidAdUnitApi= require("");
    var BroadcastApi    = require("");
    var CacheApi        = require("");
    var ConnectivityApi = require("");
    var DeviceInfoApi   = require("");
    var IntentApi       = require("");
    var ListenerApi     = require("");
    var NotificationApi = require("");
    var PlacementApi    = require("");
    var RequestApi      = require("");
    var ResolveApi      = require("");
    var SdkApi          = require("");
    var StorageApi      = require("");
    var VideoPlayerApi  = require("");
    var UrlSchemeApi    = require("");
    var CallbackContainer = require("");
    var BatchInvocation   = require("webview.bridge.BatchInvocation");
    var EventCategory     = require("");

    function NativeBridge(backend, platform, autoBatchEnabled) {
        void 0 === platform && (platform = Platform.TEST);
        void 0 === autoBatchEnabled && (autoBatchEnabled = true);
        this.AppSheet = null;
        this.AndroidAdUnit = null;
        this.Broadcast = null;
        this.Cache = null;
        this.Connectivity = null;
        this.DeviceInfo = null;
        this.Intent = null;
        this.IosAdUnit = null;
        this.Listener = null;
        this.Notification = null;
        this.Placement = null;
        this.Request = null;
        this.Resolve = null;
        this.Sdk = null;
        this.Storage = null;
        this.VideoPlayer = null;
        this.UrlScheme = null;
        this._callbackId = 1;
        this._callbackTable = {};
        this._autoBatchInterval = 50;
        this._autoBatchEnabled = autoBatchEnabled;
        this._platform = platform;
        this._backend = backend;
        this.AppSheet = new AppSheetApi(this);
        if(platform === Platform.IOS){
            this.IosAdUnit = new IosAdUnitApi(this);
        } else{
            this.AndroidAdUnit = new AndroidAdUnitApi(this);
        }
        this.Broadcast = new BroadcastApi(this);
        this.Cache = new CacheApi(this);
        this.Connectivity = new ConnectivityApi(this);
        this.DeviceInfo = new DeviceInfoApi(this);
        this.Intent = new IntentApi(this);
        this.Listener = new ListenerApi(this);
        this.Notification = new NotificationApi(this);
        this.Placement = new PlacementApi(this);
        this.Request = new RequestApi(this);
        this.Resolve = new ResolveApi(this);
        this.Sdk = new SdkApi(this);
        this.Storage = new StorageApi(this);
        this.VideoPlayer = new VideoPlayerApi(this);
        this.UrlScheme = new UrlSchemeApi(this);
    }

    NativeBridge.convertStatus = function (status) {
        switch (status) {
            case CallbackStatus[CallbackStatus.OK]:
                return CallbackStatus.OK;

            case CallbackStatus[CallbackStatus.ERROR]:
                return CallbackStatus.ERROR;

            default:
                throw new Error("Status string is not valid: " + status);
        }
    };
    NativeBridge.prototype.registerCallback = function (resolve, reject) {
        var id = this._callbackId++;
        this._callbackTable[id] = new CallbackContainer(resolve, reject);
        return id;
    };

    /**
     * JS Call Native
     *
     * @param nativeClass {String} Native类的类名，如"Broadcast"
     * @param nativeMethod {String} Native方法名，如"addBroadcastListener"
     * @param parameters {Array} Native方法的实参列表，如[]
     */
    NativeBridge.prototype.invoke = function (nativeClass, nativeMethod, parameters) {
        var me = this;
        if (this._autoBatchEnabled) {
            if(!this._autoBatch){
                this._autoBatch = new BatchInvocation(this);
            }
            var o = this._autoBatch.queue(nativeClass, nativeMethod, parameters);

            if( !this._autoBatchTimer){
                this._autoBatchTimer = setTimeout(function () {
                    me.invokeBatch(me._autoBatch);
                    me._autoBatch = null;
                    me._autoBatchTimer = null;
                }, this._autoBatchInterval)
            }
            return o;
        }
        var batch = new BatchInvocation(this),
            promise = batch.queue(nativeClass, nativeMethod, parameters);

        this.invokeBatch(batch);
        return promise;
    };

    /**
     * JS Call Native
     *
     * @param nativeFullPathClass {String} Native类的全路径类名，如"com.unity3d.ads.api.Broadcast"
     * @param nativeMethod {String} Native方法名，如"addBroadcastListener"
     * @param parameters {Array} Native方法的实参列表，如[]
     *
     * batch.batch = [[nativeFullPathClass, nativeMethod, parameters, callbackId]]
     */
    NativeBridge.prototype.rawInvoke = function (nativeFullPathClass, nativeMethod, parameters) {
        var batch = new BatchInvocation(this),
            promise = batch.rawQueue(nativeFullPathClass, nativeMethod, parameters);
        this.invokeBatch(batch);
        return promise;
    };

    /**
     * JS Call Native
     * JS端批量调用Java端接口 className.methodName(parameters)。
     * 调用完毕后Native端会调用WebView的接口：window.nativeBridge.handleCallback(jsCallbackId, callbackStatus, paramList);
     *
     * @param batch {Array} 批量参数，结构为：[[nativeClassName, nativeMethodName, nativeParamList, jsCallbackId]]
     */
    NativeBridge.prototype.invokeBatch = function (batch) {
        this._backend.handleInvocation(JSON.stringify(batch.getBatch()).replace(NativeBridge._doubleRegExp, "$1"));
    };

    /**
     * JS Call Native. JS端调用Native端接口
     * JS执行Native的接口。在Android环境中，会调用以下接口:
     *
     * WebViewBridgeInterface.handleCallback(nativeCallbackId, callbackStatus)
     *
     * @param nativeCallbackId {String} Java回调方法id
     * @param callbackStatus {String} 回调状态，作为实参传入nativeCallbackId所表示的方法中
     */
    NativeBridge.prototype.invokeCallback = function (nativeCallbackId, callbackStatus) {
        var parameters = [];
        for (var i = 2; i < arguments.length; i++){
            parameters[i - 2] = arguments[i];
        }
        this._backend.handleCallback(nativeCallbackId, callbackStatus, JSON.stringify(parameters));
    };

    /**
     * Native call JS. Native端调用JS端接口
     * 此方法用于Native端调用JS端接口: window.jsClassName.jsMethodName(jsParams).
     * 调用完毕后JS端会再次调用Native端的接口。在Android环境中，会调用以下接口:
     *
     * WebViewBridgeInterface.handleCallback
     *
     * window.nativeBridge.invokeCallback(callbackId, callbackStatus, param1, param2...);
     * @param Array args [[jsClassName, jsMethodName, nativeCallbackId, jsParams...]]
     */
    NativeBridge.prototype.handleInvocation = function (args) {
        var me = this,
            jsClassName = args.shift(), //className
            jsMethodName = args.shift(), //methodName
            nativeCallbackId = args.shift();

        args.push(function (status) {
            var extArgs = [];
            for (var i = 1; i < arguments.length; i++) {
                extArgs[i - 1] = arguments[i];
            }
            me.invokeCallback.apply(me, [nativeCallbackId, CallbackStatus[status]].concat(extArgs));
        });
        window[jsClassName][jsMethodName].apply(window[jsClassName], args);
    };
    /**
     * 此方法用于Native端调用JS端接口(Native call JS)
     * @param callbackGroup [[jsCallbackId, callbackStatus, callbackData]]
     */
    NativeBridge.prototype.handleCallback = function (callbackGroup) {
        var me = this;
        callbackGroup.forEach(function (arg) {
            var jsCallbackId = parseInt(arg.shift(), 10),
                callbackStatus = NativeBridge.convertStatus(arg.shift()),
                callbackData = arg.shift(),
                callbackContainer = me._callbackTable[jsCallbackId];

            if (!callbackContainer) {
                throw new Error("Unable to find matching callback object from callback id " + jsCallbackId);
            }
            //只有一个参数时不使用数组
            if(1 === callbackData.length){
                callbackData = callbackData[0];
            }
            switch (callbackStatus) {
                case CallbackStatus.OK:
                    callbackContainer.resolve(callbackData);
                    break;

                case CallbackStatus.ERROR:
                    callbackContainer.reject(callbackData);
            }
            delete me._callbackTable[jsCallbackId];
        });
    };

    /**
     * 此方法用于Native端调用JS端接口(Native call JS)
     * @param parameters [eventCategoryName, eventName, param1, param2...]
     */
    NativeBridge.prototype.handleEvent = function (parameters) {
        var eventCategoryName = parameters.shift(),
            eventName = parameters.shift();

        switch (eventCategoryName) {
            case EventCategory[EventCategory.APPSHEET]:
                this.AppSheet.handleEvent(eventName, parameters);
                break;

            case EventCategory[EventCategory.ADUNIT]:
                if(this.getPlatform() === Platform.IOS){
                    this.IosAdUnit.handleEvent(eventName, parameters)
                }else{
                    this.AndroidAdUnit.handleEvent(eventName, parameters);
                }
                break;

            case EventCategory[EventCategory.BROADCAST]:
                this.Broadcast.handleEvent(eventName, parameters);
                break;

            case EventCategory[EventCategory.CACHE]:
                this.Cache.handleEvent(eventName, parameters);
                break;

            case EventCategory[EventCategory.CONNECTIVITY]:
                this.Connectivity.handleEvent(eventName, parameters);
                break;

            case EventCategory[EventCategory.NOTIFICATION]:
                this.Notification.handleEvent(eventName, parameters);
                break;

            case EventCategory[EventCategory.REQUEST]:
                this.Request.handleEvent(eventName, parameters);
                break;

            case EventCategory[EventCategory.RESOLVE]:
                this.Resolve.handleEvent(eventName, parameters);
                break;

            case EventCategory[EventCategory.VIDEOPLAYER]:
                this.VideoPlayer.handleEvent(eventName, parameters);
                break;

            case EventCategory[EventCategory.STORAGE]:
                this.Storage.handleEvent(eventName, parameters);
                break;

            default:
                throw new Error("Unknown event category: " + eventCategoryName);
        }
    };
    NativeBridge.prototype.setApiLevel = function (level) {
        this._apiLevel = level;
    };

    NativeBridge.prototype.getApiLevel = function () {
        return this._apiLevel;
    };

    NativeBridge.prototype.getPlatform = function () {
        return this._platform;
    };
    NativeBridge._doubleRegExp = /"(\d+\.\d+)=double"/g; //version:"1.2=double" => version:1.2

    return NativeBridge;
});