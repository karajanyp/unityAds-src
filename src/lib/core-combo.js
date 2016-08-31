
document.addEventListener('DOMContentLoaded', function () {//}, false);

/**
 * Created by duo on 2016/8/24.
 */

(function(exports){
    var moduleCache = {},
    pending = {};

    var require = exports.require = function(id) {
        console.log(this, id)
        var mod = moduleCache[id];
        if (!mod) {
            throw ('required module not found: ' + id);
        }
        return (mod.loaded || pending[id]) ? mod : exec(mod);
    };
    var register = exports.register = function(id, factory) {
        if (typeof factory !== 'function')
            throw ('invalid module: ' + factory);
        makeModule(id, factory);
    };
    function exec(module) {
        pending[module.id] = true;
        var exports = module.factory(module.require, module.exports, module);
        if(exports){
            module.exports = exports;
        }
        module.loaded = true;

        pending[module.id] = false;
        return module;
    }
    function makeModule(id, factory) {
        var mod = {
            require: function(mid) {
                var dep = require(mid);
                return dep.exports;
            },
            id: id,
            exports: {},
            factory: factory,
            loaded: false
        };

        return moduleCache[id] = mod;
    }
    return {
        require: require,
        register: register
    }
}(window.CMD || (window.CMD = {})));

/**
 * ��չ����
 * @grammer __extends(dest, src);
 * @type {Function}
 * @param Object dest
 * @param Object src
 */
var extend = (this && this.extend) || function (dest, src) {
    for (var key in src){
        if (src.hasOwnProperty(key)){
            dest[key] = src[key];
        }
    }
    function __() {
        this.constructor = dest;
    }

    if(src === null){
        dest.prototype = Object.create(src);
    }else{
        __.prototype = src.prototype;
        dest.prototype = new __();
    }
};

/**
 * ����������
 * @param fn {Function} �����ص�����
 * @param context {Object} optional. ��ѡ���ص�������������
 */
Array.prototype.forEach || (Array.prototype.forEach = function (fn, context) {
    if ("function" != typeof fn){
        throw new TypeError(fn + " is not a function!");
    }
    for (var len = this.length, i = 0; len > i; i++){
        fn.call(context, this[i], i, this);
    }
});

/**
 * ΪDOMElement���Ӽ��ݵ�classList����
 * DOMElement.classList.add(className);
 * DOMElement.classList.remove(className);
 * DOMElement.classList.toggle(className);
 * DOMElement.classList.length;
 */
"classList" in document.documentElement || !Object.defineProperty || "undefined" == typeof HTMLElement || Object.defineProperty(HTMLElement.prototype, "classList", {
    get: function () {
        function e(fn) {
            return function (className) {
                var list = elem.className.split(/\s+/),
                    index = list.indexOf(className);
                fn(list, index, className);
                elem.className = list.join(" ");
            };
        }

        var elem = this,
            api = {
            add: e(function (classList, index, className) {
                ~index || classList.push(className);
            }),
            remove: e(function (classList, index) {
                ~index && classList.splice(index, 1);
            }),
            toggle: e(function (classList, index, className) {
                ~index ? classList.splice(index, 1) : classList.push(className);
            }),
            contains: function (className) {
                return !!~elem.className.split(/\s+/).indexOf(className);
            },
            item: function (e) {
                return elem.className.split(/\s+/)[e] || null;
            }
        };
        Object.defineProperty(api, "length", {
            get: function () {
                return elem.className.split(/\s+/).length;
            }
        });
        return api;
    }
});
CMD.register("platform.Platform", function(require, exports){
    var platform = {};

    platform[platform.ANDROID = 0] = "ANDROID";
    platform[platform.IOS = 1] = "IOS";
    platform[platform.TEST = 2] = "TEST";

    return platform;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("webview.bridge.IosWebViewBridge", function(){

    function IosWebViewBridge() {}

    IosWebViewBridge.prototype.handleInvocation = function (t) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", IosWebViewBridge._nativeUrl + "/handleInvocation", false);
        xhr.send(t);
    };
    IosWebViewBridge.prototype.handleCallback = function (id, callbackStatus, parameters) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", IosWebViewBridge._nativeUrl + "/handleCallback", false);
        xhr.send('{"id":"' + id + '","status":"' + callbackStatus + '","parameters":' + parameters + "}");
    };
    IosWebViewBridge._nativeUrl = "https://webviewbridge.unityads.unity3d.com";

    return IosWebViewBridge;
});


/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AndroidAdUnitApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.ON_START = 0] = "ON_START";
    Event[Event.ON_CREATE = 1] = "ON_CREATE";
    Event[Event.ON_RESUME = 2] = "ON_RESUME";
    Event[Event.ON_DESTROY = 3] = "ON_DESTROY";
    Event[Event.ON_PAUSE = 4] = "ON_PAUSE";
    Event[Event.KEY_DOWN = 5] = "KEY_DOWN";
    Event[Event.ON_RESTORE = 6] = "ON_RESTORE";
    Event[Event.ON_STOP = 7] = "ON_STOP";

    function AndroidAdUnitApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "AdUnit");

        this.onStart = new Observable.Observable1();
        this.onCreate = new Observable.Observable1();
        this.onResume = new Observable.Observable1();
        this.onDestroy = new Observable.Observable2();
        this.onPause = new Observable.Observable2();
        this.onKeyDown = new Observable.Observable5();
        this.onRestore = new Observable.Observable1();
        this.onStop = new Observable.Observable1();
    }
    extend(AndroidAdUnitApi, NativeApi);

    AndroidAdUnitApi.prototype.open = function (e, t, n, i, r, o) {
        void 0 === i && (i = null);
        void 0 === r && (r = 0);
        void 0 === o && (o = !0);
        return this._nativeBridge.invoke(this._apiClass, "open", [e, t, n, i, r, o]);
    };
    AndroidAdUnitApi.prototype.close = function () {
        return this._nativeBridge.invoke(this._apiClass, "close");
    };
    AndroidAdUnitApi.prototype.setViews = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setViews", [e]);
    };
    AndroidAdUnitApi.prototype.getViews = function () {
        return this._nativeBridge.invoke(this._apiClass, "getViews");
    };
    AndroidAdUnitApi.prototype.setOrientation = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setOrientation", [e]);
    };
    AndroidAdUnitApi.prototype.getOrientation = function () {
        return this._nativeBridge.invoke(this._apiClass, "getOrientation");
    };
    AndroidAdUnitApi.prototype.setKeepScreenOn = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setKeepScreenOn", [e]);
    };
    AndroidAdUnitApi.prototype.setSystemUiVisibility = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setSystemUiVisibility", [e]);
    };
    AndroidAdUnitApi.prototype.setKeyEventList = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setKeyEventList", [e]);
    };
    AndroidAdUnitApi.prototype.handleEvent = function (t, n) {
        switch (t) {
            case Event[Event.ON_START]:
                this.onStart.trigger(n[0]);
                break;

            case Event[Event.ON_CREATE]:
                this.onCreate.trigger(n[0]);
                break;

            case Event[Event.ON_RESUME]:
                this.onResume.trigger(n[0]);
                break;

            case Event[Event.ON_DESTROY]:
                this.onDestroy.trigger(n[0], n[1]);
                break;

            case Event[Event.ON_PAUSE]:
                this.onPause.trigger(n[0], n[1]);
                break;

            case Event[Event.KEY_DOWN]:
                this.onKeyDown.trigger(n[0], n[1], n[2], n[3], n[4]);
                break;

            case Event[Event.ON_RESTORE]:
                this.onRestore.trigger(n[0]);
                break;

            case Event[Event.ON_STOP]:
                this.onStop.trigger(n[0]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, t, n);
        }
    };

    return AndroidAdUnitApi;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AndroidDeviceInfoApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var AndroidStorageType = require("device.AndroidStorageType");

    function AndroidDeviceInfoApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "DeviceInfo");
    }
    extend(AndroidDeviceInfoApi, NativeApi);

    AndroidDeviceInfoApi.prototype.getAndroidId = function () {
        return this._nativeBridge.invoke(this._apiClass, "getAndroidId");
    };
    AndroidDeviceInfoApi.prototype.getApiLevel = function () {
        return this._nativeBridge.invoke(this._apiClass, "getApiLevel");
    };
    AndroidDeviceInfoApi.prototype.getManufacturer = function () {
        return this._nativeBridge.invoke(this._apiClass, "getManufacturer");
    };
    AndroidDeviceInfoApi.prototype.getScreenLayout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenLayout");
    };
    AndroidDeviceInfoApi.prototype.getScreenDensity = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenDensity");
    };
    AndroidDeviceInfoApi.prototype.isAppInstalled = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "isAppInstalled", [e]);
    };
    AndroidDeviceInfoApi.prototype.getInstalledPackages = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getInstalledPackages", [e]);
    };
    AndroidDeviceInfoApi.prototype.getSystemProperty = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "getSystemProperty", [e, t]);
    };
    AndroidDeviceInfoApi.prototype.getRingerMode = function () {
        return this._nativeBridge.invoke(this._apiClass, "getRingerMode");
    };
    AndroidDeviceInfoApi.prototype.getDeviceVolume = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getDeviceVolume", [e]);
    };
    AndroidDeviceInfoApi.prototype.getFreeSpace = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getFreeSpace", [AndroidStorageType[e]]);
    };
    AndroidDeviceInfoApi.prototype.getTotalSpace = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getTotalSpace", [AndroidStorageType[e]]);
    };

    return AndroidDeviceInfoApi;
});


/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AndroidVideoPlayerApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.INFO = 0] = "INFO";

    function AndroidVideoPlayerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "VideoPlayer");
        this.onInfo = new Observable.Observable3();
    }
    extend(AndroidVideoPlayerApi, NativeApi);

    AndroidVideoPlayerApi.prototype.setInfoListenerEnabled = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setInfoListenerEnabled", [e]);
    };
    AndroidVideoPlayerApi.prototype.handleEvent = function (e, d) {
        switch (e) {
            case Event[Event.INFO]:
                this.onInfo.trigger(d[0], d[1], d[2]);
                break;

            default:
                throw new Error("VideoPlayer event " + e + " does not have an observable");
        }
    };
    return AndroidVideoPlayerApi;

});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AppSheetApi", function (require, t, n) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");
    var AppSheetEvent = require("appsheet.AppSheetEvent");


    function AppSheetApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "AppSheet");

        this.onPrepared = new Observable.Observable1();
        this.onOpen = new Observable.Observable1();
        this.onClose = new Observable.Observable1();
        this.onError = new Observable.Observable2();
    }
    extend(AppSheetApi, NativeApi);

    AppSheetApi.prototype.canOpen = function () {
        return this._nativeBridge.invoke(this._apiClass, "canOpen");
    };
    AppSheetApi.prototype.prepare = function (e, t) {
        void 0 === t && (t = 3e4);
        return this._nativeBridge.invoke(this._apiClass, "prepare", [e, t]);
    };
    AppSheetApi.prototype.present = function (e, t) {
        void 0 === t && (t = true);
        return this._nativeBridge.invoke(this._apiClass, "present", [e, t]);
    };
    AppSheetApi.prototype.destroy = function (e) {
        if("undefined" == typeof e){
            return this._nativeBridge.invoke(this._apiClass, "destroy");
        }else{
            return this._nativeBridge.invoke(this._apiClass, "destroy", [e]);
        }
    };
    AppSheetApi.prototype.setPrepareTimeout = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setPrepareTimeout", [e]);
    };
    AppSheetApi.prototype.getPrepareTimeout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getPrepareTimeout");
    };
    AppSheetApi.prototype.handleEvent = function (t, n) {
        switch (t) {
            case AppSheetEvent[AppSheetEvent.PREPARED]:
                this.onPrepared.trigger(n[0]);
                break;

            case AppSheetEvent[AppSheetEvent.OPENED]:
                this.onOpen.trigger(n[0]);
                break;

            case AppSheetEvent[AppSheetEvent.CLOSED]:
                this.onClose.trigger(n[0]);
                break;

            case AppSheetEvent[AppSheetEvent.FAILED]:
                this.onError.trigger(n[0], n[1]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, t, n);
        }
    };

    return AppSheetApi;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.BroadcastApi", function(require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.ACTION = 0] = "ACTION";


    function BroadcastApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Broadcast");
        this.onBroadcastAction = new Observable.Observable4();
    }
    extend(BroadcastApi, NativeApi);
    BroadcastApi.prototype.addBroadcastListener = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "addBroadcastListener", [e, t]);
    };
    BroadcastApi.prototype.addDataSchemeBroadcastListener = function (e, t, n) {
        return this._nativeBridge.invoke(this._apiClass, "addBroadcastListener", [e, t, n]);
    };
    BroadcastApi.prototype.removeBroadcastListener = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "removeBroadcastListener", [e]);
    };
    BroadcastApi.prototype.removeAllBroadcastListeners = function () {
        return this._nativeBridge.invoke(this._apiClass, "removeAllBroadcastListeners", []);
    };
    BroadcastApi.prototype.handleEvent = function (e, data) {
        if(e === Event[Event.ACTION]){
            this.onBroadcastAction.trigger(data[0], data[1], data[2], data[3])
        }else{
            NativeApi.prototype.handleEvent.call(this, e, data);
        }


    };
    return BroadcastApi;
});

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

    CacheApi.prototype.download = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "download", [e, t]);
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
    CacheApi.prototype.deleteFile = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "deleteFile", [e]);
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

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.ConnectivityApi", function(require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.CONNECTED = 0] = "CONNECTED";
    Event[Event.DISCONNECTED = 1] = "DISCONNECTED";
    Event[Event.NETWORK_CHANGE = 2] = "NETWORK_CHANGE";

    function ConnectivityApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Connectivity");
        this.onConnected = new Observable.Observable2();
        this.onDisconnected = new Observable.Observable0();
    }
    extend(ConnectivityApi, NativeApi);

    ConnectivityApi.prototype.setListeningStatus = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setConnectionMonitoring", [e]);
    };
    ConnectivityApi.prototype.handleEvent = function (e, d) {
        switch (e) {
            case Event[Event.CONNECTED]:
                this.onConnected.trigger(d[0], d[1]);
                break;

            case Event[Event.DISCONNECTED]:
                this.onDisconnected.trigger();
                break;

            case Event[Event.NETWORK_CHANGE]:
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, d);
        }
    };
    return ConnectivityApi;
});
/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.DeviceInfoApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var IosDeviceInfoApi = require("api.IosDeviceInfoApi");
    var AndroidDeviceInfoApi = require("api.AndroidDeviceInfoApi");
    var Platform = require("platform.Platform");

    function DeviceInfoApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "DeviceInfo");
        if(nativeBridge.getPlatform() === Platform.IOS ){
            this.Ios = new IosDeviceInfoApi(nativeBridge)
        }else{
            this.Android = new AndroidDeviceInfoApi(nativeBridge);
        }
    }
    extend(DeviceInfoApi, NativeApi);

    DeviceInfoApi.prototype.getAdvertisingTrackingId = function () {
        return this._nativeBridge.invoke(this._apiClass, "getAdvertisingTrackingId");
    };
    DeviceInfoApi.prototype.getLimitAdTrackingFlag = function () {
        return this._nativeBridge.invoke(this._apiClass, "getLimitAdTrackingFlag");
    };
    DeviceInfoApi.prototype.getOsVersion = function () {
        return this._nativeBridge.invoke(this._apiClass, "getOsVersion");
    };
    DeviceInfoApi.prototype.getModel = function () {
        return this._nativeBridge.invoke(this._apiClass, "getModel");
    };
    DeviceInfoApi.prototype.getScreenWidth = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenWidth");
    };
    DeviceInfoApi.prototype.getScreenHeight = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenHeight");
    };
    DeviceInfoApi.prototype.getTimeZone = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "getTimeZone", [e]);
    };
    DeviceInfoApi.prototype.getConnectionType = function () {
        return this._nativeBridge.invoke(this._apiClass, "getConnectionType");
    };
    DeviceInfoApi.prototype.getNetworkType = function () {
        return this._nativeBridge.invoke(this._apiClass, "getNetworkType");
    };
    DeviceInfoApi.prototype.getNetworkOperator = function () {
        return this._nativeBridge.invoke(this._apiClass, "getNetworkOperator");
    };
    DeviceInfoApi.prototype.getNetworkOperatorName = function () {
        return this._nativeBridge.invoke(this._apiClass, "getNetworkOperatorName");
    };
    DeviceInfoApi.prototype.isRooted = function () {
        return this._nativeBridge.invoke(this._apiClass, "isRooted");
    };
    DeviceInfoApi.prototype.getUniqueEventId = function () {
        return this._nativeBridge.invoke(this._apiClass, "getUniqueEventId");
    };
    DeviceInfoApi.prototype.getHeadset = function () {
        return this._nativeBridge.invoke(this._apiClass, "getHeadset");
    };
    DeviceInfoApi.prototype.getSystemLanguage = function () {
        return this._nativeBridge.invoke(this._apiClass, "getSystemLanguage");
    };
    DeviceInfoApi.prototype.getScreenBrightness = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenBrightness");
    };
    DeviceInfoApi.prototype.getBatteryLevel = function () {
        return this._nativeBridge.invoke(this._apiClass, "getBatteryLevel");
    };
    DeviceInfoApi.prototype.getBatteryStatus = function () {
        return this._nativeBridge.invoke(this._apiClass, "getBatteryStatus");
    };
    DeviceInfoApi.prototype.getFreeMemory = function () {
        return this._nativeBridge.invoke(this._apiClass, "getFreeMemory");
    };
    DeviceInfoApi.prototype.getTotalMemory = function () {
        return this._nativeBridge.invoke(this._apiClass, "getTotalMemory");
    };

    return DeviceInfoApi;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.IntentApi", function (require) {
    var NativeApi = require("api.NativeApi");

    function IntentApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Intent");
    }
    extend(IntentApi, NativeApi);

    IntentApi.prototype.launch = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "launch", [e]);
    };
    return IntentApi;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.IosAdUnitApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.VIEW_CONTROLLER_INIT = 0] = "VIEW_CONTROLLER_INIT";
    Event[Event.VIEW_CONTROLLER_DID_LOAD = 1] = "VIEW_CONTROLLER_DID_LOAD";
    Event[Event.VIEW_CONTROLLER_DID_APPEAR = 2] = "VIEW_CONTROLLER_DID_APPEAR";
    Event[Event.VIEW_CONTROLLER_WILL_DISAPPEAR = 3] = "VIEW_CONTROLLER_WILL_DISAPPEAR";
    Event[Event.VIEW_CONTROLLER_DID_DISAPPEAR = 4] = "VIEW_CONTROLLER_DID_DISAPPEAR";
    Event[Event.VIEW_CONTROLLER_DID_RECEIVE_MEMORY_WARNING = 5] = "VIEW_CONTROLLER_DID_RECEIVE_MEMORY_WARNING";

    function IosAdUnitApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "AdUnit");

        this.onViewControllerInit = new Observable.Observable0();
        this.onViewControllerDidLoad = new Observable.Observable0();
        this.onViewControllerDidAppear = new Observable.Observable0();
        this.onViewControllerWillDisappear = new Observable.Observable0();
        this.onViewControllerDidDisappear = new Observable.Observable0();
        this.onViewControllerDidReceiveMemoryWarning = new Observable.Observable0();
    }
    extend(IosAdUnitApi, NativeApi);

    IosAdUnitApi.prototype.open = function (e, t, n, i) {
        return this._nativeBridge.invoke(this._apiClass, "open", [e, t, n, i]);
    };
    IosAdUnitApi.prototype.close = function () {
        return this._nativeBridge.invoke(this._apiClass, "close");
    };
    IosAdUnitApi.prototype.setViews = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setViews", [e]);
    };
    IosAdUnitApi.prototype.getViews = function () {
        return this._nativeBridge.invoke(this._apiClass, "getViews");
    };
    IosAdUnitApi.prototype.setSupportedOrientations = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setSupportedOrientations", [e]);
    };
    IosAdUnitApi.prototype.getSupportedOrientations = function () {
        return this._nativeBridge.invoke(this._apiClass, "getSupportedOrientations");
    };
    IosAdUnitApi.prototype.setKeepScreenOn = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setKeepScreenOn", [e]);
    };
    IosAdUnitApi.prototype.setStatusBarHidden = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setStatusBarHidden", [e]);
    };
    IosAdUnitApi.prototype.getStatusBarHidden = function () {
        return this._nativeBridge.invoke(this._apiClass, "getStatusBarHidden");
    };
    IosAdUnitApi.prototype.setShouldAutorotate = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setShouldAutorotate", [e]);
    };
    IosAdUnitApi.prototype.getShouldAutorotate = function () {
        return this._nativeBridge.invoke(this._apiClass, "getShouldAutorotate");
    };
    IosAdUnitApi.prototype.handleEvent = function (t, n) {
        switch (t) {
            case Event[Event.VIEW_CONTROLLER_INIT]:
                this.onViewControllerInit.trigger();
                break;

            case Event[Event.VIEW_CONTROLLER_DID_LOAD]:
                this.onViewControllerDidLoad.trigger();
                break;

            case Event[Event.VIEW_CONTROLLER_DID_APPEAR]:
                this.onViewControllerDidAppear.trigger();
                break;

            case Event[Event.VIEW_CONTROLLER_WILL_DISAPPEAR]:
                this.onViewControllerWillDisappear.trigger();
                break;

            case Event[Event.VIEW_CONTROLLER_DID_DISAPPEAR]:
                this.onViewControllerDidDisappear.trigger();
                break;

            case Event[Event.VIEW_CONTROLLER_DID_RECEIVE_MEMORY_WARNING]:
                this.onViewControllerDidReceiveMemoryWarning.trigger();
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, t, n);
        }
    };
    return IosAdUnitApi;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.IosDeviceInfoApi", function (require) {
    var NativeApi = require("api.NativeApi");

    function IosDeviceInfoApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "DeviceInfo");
    }
    extend(IosDeviceInfoApi, NativeApi);

    IosDeviceInfoApi.prototype.getScreenScale = function () {
        return this._nativeBridge.invoke(this._apiClass, "getScreenScale");
    };
    IosDeviceInfoApi.prototype.getUserInterfaceIdiom = function () {
        return this._nativeBridge.invoke(this._apiClass, "getUserInterfaceIdiom");
    };
    IosDeviceInfoApi.prototype.getDeviceVolume = function () {
        return this._nativeBridge.invoke(this._apiClass, "getDeviceVolume");
    };
    IosDeviceInfoApi.prototype.getFreeSpace = function () {
        return this._nativeBridge.invoke(this._apiClass, "getFreeSpace");
    };
    IosDeviceInfoApi.prototype.getTotalSpace = function () {
        return this._nativeBridge.invoke(this._apiClass, "getTotalSpace");
    };
    IosDeviceInfoApi.prototype.isSimulator = function () {
        return this._nativeBridge.invoke(this._apiClass, "isSimulator");
    };
    IosDeviceInfoApi.prototype.isAppleWatchPaired = function () {
        return this._nativeBridge.invoke(this._apiClass, "isAppleWatchPaired");
    };

    return IosDeviceInfoApi;
});
/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.IosVideoPlayerApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.LIKELY_TO_KEEP_UP = 0] = "LIKELY_TO_KEEP_UP";
    Event[Event.BUFFER_EMPTY = 1] = "BUFFER_EMPTY";
    Event[Event.BUFFER_FULL = 2] = "BUFFER_FULL";

    function IosVideoPlayerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "VideoPlayer");
        this.onLikelyToKeepUp = new Observable.Observable2();
        this.onBufferEmpty = new Observable.Observable2();
        this.onBufferFull = new Observable.Observable2();
    }
    extend(IosVideoPlayerApi, NativeApi);

    IosVideoPlayerApi.prototype.handleEvent = function (e, d) {
        switch (e) {
            case Event[Event.LIKELY_TO_KEEP_UP]:
                this.onLikelyToKeepUp.trigger(d[0], d[1]);
                break;

            case Event[Event.BUFFER_EMPTY]:
                this.onBufferEmpty.trigger(d[0], d[1]);
                break;

            case Event[Event.BUFFER_FULL]:
                this.onBufferFull.trigger(d[0], d[1]);
                break;

            default:
                throw new Error("VideoPlayer event " + e + " does not have an observable");
        }
    };
    return IosVideoPlayerApi;
});
/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.ListenerApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var FinishState = require("resolve.FinishState");

    function ListenerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Listener");
    }
    extend(ListenerApi, NativeApi);

    ListenerApi.prototype.sendReadyEvent = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "sendReadyEvent", [e]);
    };
    ListenerApi.prototype.sendStartEvent = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "sendStartEvent", [e]);
    };
    ListenerApi.prototype.sendFinishEvent = function (e, n) {
        return this._nativeBridge.invoke(this._apiClass, "sendFinishEvent", [e, FinishState[n]]);
    };
    ListenerApi.prototype.sendErrorEvent = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "sendErrorEvent", [e, t]);
    };

    return ListenerApi;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.NativeApi", function() {
    function NativeApi(nativeBridge, apiClass) {
        this._nativeBridge = nativeBridge;
        this._apiClass = apiClass;
    }
    NativeApi.prototype.handleEvent = function (e, t) {
        throw new Error(this._apiClass + " event " + e + " does not have an observable");
    };
    return NativeApi;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.NotificationApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.observable");

    var Event = {};
    Event[Event.ACTION = 0] = "ACTION";

    function NotificationApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Notification");
        this.onNotification = new Observable.Observable2();
    }
    extend(NotificationApi, NativeApi);

    NotificationApi.prototype.addNotificationObserver = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "addNotificationObserver", [e, t]);
    };
    NotificationApi.prototype.removeNotificationObserver = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "removeNotificationObserver", [e]);
    };
    NotificationApi.prototype.removeAllNotificationObservers = function () {
        return this._nativeBridge.invoke(this._apiClass, "removeAllNotificationObservers");
    };
    NotificationApi.prototype.handleEvent = function (t, n) {
        switch (t) {
            case Event[Event.ACTION]:
                this.onNotification.trigger(n[0], n[1]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, t, n);
        }
    };
    return NotificationApi;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.PlacementApi", function (require, t, n) {
    var NativeApi = require("api.NativeApi");
    var PlacementState = require("placement.PlacementState");

    function PlacementApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Placement");
    }
    extend(PlacementApi, NativeApi);

    PlacementApi.prototype.setDefaultPlacement = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setDefaultPlacement", [e]);
    };

    PlacementApi.prototype.setPlacementState = function (e, n) {
        return this._nativeBridge.invoke(this._apiClass, "setPlacementState", [e, PlacementState[n]]);
    };

    PlacementApi.prototype.setPlacementAnalytics = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setPlacementAnalytics", [e]);
    };
    return PlacementApi;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.RequestApi", function (require) {
    var Platform = require("platform.Platform");
    var NativeApi = require("api.NativeApi");
    var RequestEvent = require("request.RequestEvent");
    var Observable = require("util.observable");

    function RequestApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Request");
        this.onComplete = new Observable.Observable5();
        this.onFailed = new Observable.Observable3();
    }
    extend(RequestApi, NativeApi);

    RequestApi.prototype.get = function (e, t, n, r, o) {
        return this._nativeBridge.getPlatform() === Platform.IOS ?
            this._nativeBridge.invoke(this._apiClass, "get", [e, t, n, r]) :
            this._nativeBridge.invoke(this._apiClass, "get", [e, t, n, r, o]);
    };
    RequestApi.prototype.post = function (e, t, n, r, o, a) {
        return this._nativeBridge.getPlatform() === Platform.IOS ?
            this._nativeBridge.invoke(this._apiClass, "post", [e, t, n, r, o]) :
            this._nativeBridge.invoke(this._apiClass, "post", [e, t, n, r, o, a]);
    };
    RequestApi.prototype.head = function (e, t, n, r, o) {
        return this._nativeBridge.getPlatform() === Platform.IOS ?
            this._nativeBridge.invoke(this._apiClass, "head", [e, t, n, r]) :
            this._nativeBridge.invoke(this._apiClass, "head", [e, t, n, r, o]);
    };
    RequestApi.prototype.setConnectTimeout = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setConnectTimeout", [e]);
    };
    RequestApi.prototype.getConnectTimeout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getConnectTimeout");
    };
    RequestApi.prototype.setReadTimeout = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setReadTimeout", [e]);
    };
    RequestApi.prototype.getReadTimeout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getReadTimeout");
    };
    RequestApi.prototype.handleEvent = function (e, d) {
        switch (e) {
            case RequestEvent[RequestEvent.COMPLETE]:
                this.onComplete.trigger(d[0], d[1], d[2], d[3], d[4]);
                break;

            case RequestEvent[RequestEvent.FAILED]:
                this.onFailed.trigger(d[0], d[1], d[2]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, d);
        }
    };
    return RequestApi;
});
/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.ResolveApi", function (require, t, n) {
    var NativeApi = require("api.NativeApi");
    var ResolveEvent = require("resolve.ResolveEvent");
    var Observable = require("util.observable");

    function ResolveApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Resolve");
        this.onComplete = new Observable.Observable3();
        this.onFailed = new Observable.Observable4();
    }
    extend(ResolveApi, NativeApi);

    ResolveApi.prototype.resolve = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "resolve", [e, t]);
    };
    ResolveApi.prototype.handleEvent = function (t, n) {
        switch (t) {
            case ResolveEvent[ResolveEvent.COMPLETE]:
                this.onComplete.trigger(n[0], n[1], n[2]);
                break;

            case ResolveEvent[ResolveEvent.FAILED]:
                this.onFailed.trigger(n[0], n[1], n[2], n[3]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, t, n);
        }
    };
    return ResolveApi;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.SdkApi", function (require) {
    var NativeApi = require("api.NativeApi");

    function SdkApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Sdk");
    }
    extend(SdkApi, NativeApi);
    SdkApi.prototype.loadComplete = function () {
        return this._nativeBridge.invoke(this._apiClass, "loadComplete");
    };
    SdkApi.prototype.initComplete = function () {
        return this._nativeBridge.invoke(this._apiClass, "initComplete");
    };
    SdkApi.prototype.setDebugMode = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setDebugMode", [e]);
    };
    SdkApi.prototype.getDebugMode = function () {
        return this._nativeBridge.invoke(this._apiClass, "getDebugMode");
    };
    SdkApi.prototype.logError = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "logError", [e]);
    };
    SdkApi.prototype.logWarning = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "logWarning", [e]);
    };
    SdkApi.prototype.logInfo = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "logInfo", [e]);
    };
    SdkApi.prototype.logDebug = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "logDebug", [e]);
    };
    SdkApi.prototype.setShowTimeout = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setShowTimeout", [e]);
    };
    SdkApi.prototype.reinitialize = function () {
        this._nativeBridge.invoke(this._apiClass, "reinitialize");
    };
    return SdkApi;
});

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
    StorageApi.prototype.getKeys = function (e, t, i) {
        return this._nativeBridge.invoke(this._apiClass, "getKeys", [StorageType[e], t, i]);
    };
    StorageApi.prototype.handleEvent = function (e, t) {
        switch (e) {
        }
    };
    return StorageApi;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.UrlSchemeApi", function (require) {
    var NativeApi = require("api.NativeApi");

    function UrlSchemeApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "UrlScheme");
    }
    extend(UrlSchemeApi, NativeApi);

    UrlSchemeApi.prototype.open = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "open", [e]);
    };
    return UrlSchemeApi;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.VideoPlayerApi", function (require) {
    var NativeApi =             require("api.NativeApi");
    var IosVideoPlayerApi =     require("api.IosVideoPlayerApi");
    var AndroidVideoPlayerApi = require("api.AndroidVideoPlayerApi");
    var Observable =            require("util.observable");
    var Platform =              require("platform.Platform");

    var Event = {};
    Event[Event.GENERIC_ERROR = 0] = "GENERIC_ERROR";
    Event[Event.PROGRESS = 1] = "PROGRESS";
    Event[Event.COMPLETED = 2] = "COMPLETED";
    Event[Event.PREPARED = 3] = "PREPARED";
    Event[Event.PREPARE_ERROR = 4] = "PREPARE_ERROR";
    Event[Event.PLAY = 5] = "PLAY";
    Event[Event.PAUSE_ERROR = 6] = "PAUSE_ERROR";
    Event[Event.PAUSE = 7] = "PAUSE";
    Event[Event.SEEKTO_ERROR = 8] = "SEEKTO_ERROR";
    Event[Event.SEEKTO = 9] = "SEEKTO";
    Event[Event.STOP = 10] = "STOP";
    Event[Event.ILLEGAL_STATE = 11] = "ILLEGAL_STATE";

    function VideoPlayerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "VideoPlayer");
        this.onError = new Observable.Observable3();
        this.onProgress = new Observable.Observable1();
        this.onCompleted = new Observable.Observable1();
        this.onPrepared = new Observable.Observable4();
        this.onPlay = new Observable.Observable1();
        this.onPause = new Observable.Observable1();
        this.onSeek = new Observable.Observable1();
        this.onStop = new Observable.Observable1();

        if(nativeBridge.getPlatform() === Platform.IOS){
            this.Ios = new IosVideoPlayerApi(nativeBridge);
        }else if(nativeBridge.getPlatform() === Platform.ANDROID){
            this.Android = new AndroidVideoPlayerApi(nativeBridge);
        }
    }
    extend(VideoPlayerApi, NativeApi);

    VideoPlayerApi.prototype.setProgressEventInterval = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setProgressEventInterval", [e]);
    };
    VideoPlayerApi.prototype.getProgressEventInterval = function () {
        return this._nativeBridge.invoke(this._apiClass, "getProgressEventInterval");
    };
    VideoPlayerApi.prototype.prepare = function (e, t) {
        return this._nativeBridge.invoke(this._apiClass, "prepare", [e, t]);
    };
    VideoPlayerApi.prototype.play = function () {
        return this._nativeBridge.invoke(this._apiClass, "play");
    };
    VideoPlayerApi.prototype.pause = function () {
        return this._nativeBridge.invoke(this._apiClass, "pause");
    };
    VideoPlayerApi.prototype.stop = function () {
        return this._nativeBridge.invoke(this._apiClass, "stop");
    };
    VideoPlayerApi.prototype.seekTo = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "seekTo", [e]);
    };
    VideoPlayerApi.prototype.getCurrentPosition = function () {
        return this._nativeBridge.invoke(this._apiClass, "getCurrentPosition");
    };
    VideoPlayerApi.prototype.getVolume = function () {
        return this._nativeBridge.invoke(this._apiClass, "getVolume");
    };
    VideoPlayerApi.prototype.setVolume = function (e) {
        return this._nativeBridge.invoke(this._apiClass, "setVolume", [e]);
    };
    VideoPlayerApi.prototype.handleEvent = function (e, t) {
        switch (e) {
            case Event[Event.GENERIC_ERROR]:
                this.onError.trigger(t[0], t[1], t[2]);
                break;

            case Event[Event.PROGRESS]:
                this.onProgress.trigger(t[0]);
                break;

            case Event[Event.COMPLETED]:
                this.onCompleted.trigger(t[0]);
                break;

            case Event[Event.PREPARED]:
                this.onPrepared.trigger(t[0], t[1], t[2], t[3]);
                break;

            case Event[Event.PLAY]:
                this.onPlay.trigger(t[0]);
                break;

            case Event[Event.PAUSE]:
                this.onPause.trigger(t[0]);
                break;

            case Event[Event.SEEKTO]:
                this.onSeek.trigger(t[0]);
                break;

            case Event[Event.STOP]:
                this.onStop.trigger(t[0]);
                break;

            default:
                if(this._nativeBridge.getPlatform() === Platform.IOS){
                    this.Ios.handleEvent(e, t);
                }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
                    this.Android.handleEvent(e, t);
                }
        }
    };
    return VideoPlayerApi;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("appsheet.AppSheetEvent", function () {
    var AppSheetEvent = {};

    AppSheetEvent[AppSheetEvent.PREPARED = 0] = "PREPARED";
    AppSheetEvent[AppSheetEvent.OPENED = 1] = "OPENED";
    AppSheetEvent[AppSheetEvent.CLOSED = 2] = "CLOSED";
    AppSheetEvent[AppSheetEvent.FAILED = 3] = "FAILED";

    return AppSheetEvent;
});
/**
 * Created by duo on 2016/8/31.
 */
CMD.register("cache.CacheError", function(){
    var CacheError = {};

    CacheError[CacheError.FILE_IO_ERROR = 0] = "FILE_IO_ERROR";
    CacheError[CacheError.FILE_NOT_FOUND = 1] = "FILE_NOT_FOUND";
    CacheError[CacheError.FILE_ALREADY_CACHING = 2] = "FILE_ALREADY_CACHING";
    CacheError[CacheError.NOT_CACHING = 3] = "NOT_CACHING";
    CacheError[CacheError.JSON_ERROR = 4] = "JSON_ERROR";
    CacheError[CacheError.NO_INTERNET = 5] = "NO_INTERNET";

    return CacheError;
});
/**
 * Created by duo on 2016/8/31.
 */
CMD.register("cache.CacheEvent", function(){
    var CacheEvent = {};

    CacheEvent[CacheEvent.DOWNLOAD_STARTED = 0] = "DOWNLOAD_STARTED";
    CacheEvent[CacheEvent.DOWNLOAD_PROGRESS = 1] = "DOWNLOAD_PROGRESS";
    CacheEvent[CacheEvent.DOWNLOAD_END = 2] = "DOWNLOAD_END";
    CacheEvent[CacheEvent.DOWNLOAD_STOPPED = 3] = "DOWNLOAD_STOPPED";
    CacheEvent[CacheEvent.DOWNLOAD_ERROR = 4] = "DOWNLOAD_ERROR";

    return CacheEvent;
});
/**
 * Created by duo on 2016/8/31.
 */
CMD.register("device.AndroidStorageType", function () {
    var AndroidStorageType = {};

    AndroidStorageType[AndroidStorageType.EXTERNAL = 0] = "EXTERNAL";
    AndroidStorageType[AndroidStorageType.INTERNAL = 1] = "INTERNAL";

    return AndroidStorageType;
});
/**
 * Created by duo on 2016/8/31.
 */

CMD.register("placement.Placement", function (require) {

    function Placement(e) {
        this._id = e.id;
        this._name = e.name;
        this._default = e["default"];
        this._allowSkip = e.allowSkip;
        this._skipInSeconds = e.skipInSeconds;
        this._disableBackButton = e.disableBackButton;
        this._useDeviceOrientationForVideo = e.useDeviceOrientationForVideo;
        this._muteVideo = e.muteVideo;
    }
    Placement.prototype.getId = function () {
        return this._id;
    };
    Placement.prototype.getName = function () {
        return this._name;
    };
    Placement.prototype.isDefault = function () {
        return this._default;
    };
    Placement.prototype.allowSkip = function () {
        return this._allowSkip;
    };
    Placement.prototype.allowSkipInSeconds = function () {
        return this._skipInSeconds;
    };
    Placement.prototype.disableBackButton = function () {
        return this._disableBackButton;
    };
    Placement.prototype.useDeviceOrientationForVideo = function () {
        return this._useDeviceOrientationForVideo;
    };
    Placement.prototype.muteVideo = function () {
        return this._muteVideo;
    };

    return Placement;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("placement.PlacementState", function () {
    var PlacementState = {};

    PlacementState[PlacementState.READY = 0] = "READY";
    PlacementState[PlacementState.NOT_AVAILABLE = 1] = "NOT_AVAILABLE";
    PlacementState[PlacementState.DISABLED = 2] = "DISABLED";
    PlacementState[PlacementState.WAITING = 3] = "WAITING";
    PlacementState[PlacementState.NO_FILL = 4] = "NO_FILL";

    return PlacementState;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("request.RequestEvent", function(){
    var RequestEvent = {};

    RequestEvent[RequestEvent.COMPLETE = 0] = "COMPLETE";
    RequestEvent[RequestEvent.FAILED = 1] = "FAILED";

    return RequestEvent;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("resolve.FinishState", function () {
    var FinishState = {};

    FinishState[FinishState.COMPLETED = 0] = "COMPLETED";
    FinishState[FinishState.SKIPPED = 1] = "SKIPPED";
    FinishState[FinishState.ERROR = 2] = "ERROR";

    return FinishState;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("resolve.ResolveEvent", function(){
    var ResolveEvent = {};

    ResolveEvent[ResolveEvent.COMPLETE = 0] = "COMPLETE";
    ResolveEvent[ResolveEvent.FAILED = 1] = "FAILED";

    return ResolveEvent;
});
/**
 * Created by duo on 2016/8/31.
 */
CMD.register("storage.StorageError", function () {
    var StorageError = {};

    StorageError[StorageError.COULDNT_SET_VALUE = 0] = "COULDNT_SET_VALUE";
    StorageError[StorageError.COULDNT_GET_VALUE = 1] = "COULDNT_GET_VALUE";
    StorageError[StorageError.COULDNT_WRITE_STORAGE_TO_CACHE = 2] = "COULDNT_WRITE_STORAGE_TO_CACHE";
    StorageError[StorageError.COULDNT_CLEAR_STORAGE = 3] = "COULDNT_CLEAR_STORAGE";
    StorageError[StorageError.COULDNT_GET_STORAGE = 4] = "COULDNT_GET_STORAGE";
    StorageError[StorageError.COULDNT_DELETE_VALUE = 5] = "COULDNT_DELETE_VALUE";

    return StorageError;
});
/**
 * Created by duo on 2016/8/31.
 */
CMD.register("storage.StorageType", function () {
    var StorageType = {};

    StorageType[StorageType.PRIVATE = 0] = "PRIVATE";
    StorageType[StorageType.PUBLIC = 1] = "PUBLIC";

    return StorageType;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("util.observable", function(require, exports){
    function Observable() {
        this._observers = [];
    }
    Observable.prototype.subscribe = function (e) {
        this._observers.push(e);
        return e;
    };
    Observable.prototype.unsubscribe = function (e) {
        if(!this._observers.length){
            return;
        }
        if("undefined" != typeof e ){
            this._observers = this._observers.filter(function (t) {
                return t !== e;
            })
        }else{
            this._observers = [];
        }
    };

    function Observable0() {
        Observable.apply(this, arguments);
    }
    extend(Observable0, Observable);
    Observable0.prototype.trigger = function () {
        this._observers.forEach(function (e) {
            return e();
        });
    };

    exports.Observable0 = Observable0;

    function Observable1() {
        Observable.apply(this, arguments);
    }
    extend(Observable1, Observable);
    Observable1.prototype.trigger = function (e) {
        this._observers.forEach(function (t) {
            return t(e);
        });
    };
    exports.Observable1 = Observable1;

    function Observable2() {
        Observable.apply(this, arguments);
    }
    extend(Observable2, Observable);
    Observable2.prototype.trigger = function (e, t) {
        this._observers.forEach(function (n) {
            return n(e, t);
        });
    };
    exports.Observable2 = Observable2;

    function Observable3() {
        Observable.apply(this, arguments);
    }
    extend(Observable3, Observable);
    Observable3.prototype.trigger = function (e, t, n) {
        this._observers.forEach(function (i) {
            return i(e, t, n);
        });
    };
    exports.Observable3 = Observable3;

    function Observable4() {
        Observable.apply(this, arguments);
    }
    extend(Observable4, Observable);
    Observable4.prototype.trigger = function (e, t, n, i) {
        this._observers.forEach(function (r) {
            return r(e, t, n, i);
        });
    };
    exports.Observable4 = Observable4;

    function Observable5() {
        Observable.apply(this, arguments);
    }
    extend(Observable5, Observable);
    Observable5.prototype.trigger = function (e, t, n, i, r) {
        this._observers.forEach(function (o) {
            return o(e, t, n, i, r);
        });
    };
    exports.Observable5 = Observable5;

    function Observable6() {
        Observable.apply(this, arguments);
    }
    extend(Observable6, Observable);
    Observable6.prototype.trigger = function (e, t, n, i, r, o) {
        this._observers.forEach(function (a) {
            return a(e, t, n, i, r, o);
        });
    };
    exports.Observable6 = Observable6;
});
/**
 * Created by duo on 2016/8/31.
 */

var e;
(function () {
    "use strict";

    /**
     * �ж���������Ƿ�ΪObject
     * @grammer isObject
     * @param o
     * @returns {boolean}
     */
    function isObject(o) {
        return "function" == typeof o || "object" == typeof o && null !== o;
    }

    /**
     * �ж���������Ƿ�ΪFunction
     * @param o
     * @returns {boolean}
     */
    function isFunction(o) {
        return "function" == typeof o;
    }

    function i(e) {
        j = e;
    }

    function r(e) {
        Q = e;
    }

    function o() {
        return function () {
            process.nextTick(l);
        };
    }

    function a() {
        return function () {
            H(l);
        };
    }

    function s() {
        var i = 0, t = new MutationObserver(l), n = document.createTextNode("");
        t.observe(n, {
            characterData: true
        });
        return  function () {
            i = ++i % 2;
            n.data = i;
        };
    }

    function c() {
        var e = new MessageChannel();
        return e.port1.onmessage = l, function () {
            e.port2.postMessage(0);
        };
    }

    function u() {
        return function () {
            setTimeout(l, 1);
        };
    }

    function l() {
        for (var i = 0; z > i; i += 2) {
            var t = te[i], n = te[i + 1];
            t(n);
            te[i] = undefined;
            te[i + 1] = undefined;
        }
        z = 0;
    }

    function h() {
        try {
            var e = require, t = e("vertx");
            H = t.runOnLoop || t.runOnContext;
            return a();
        } catch (n) {
            return u();
        }
    }

    //then function
    function then(success, failure) {
        var promise = this,
            i = new this.constructor(noop);

        if( void 0 === i[re] ){
            P(i);
        }
        var state = promise._state;
        if (state) {
            var callback = arguments[state - 1];
            Q(function () {
                R(state, i, callback, promise._result);
            });
        } else {
            O(promise, i, success, failure);
        }
        return i;
    }

    function d(e) {
        var t = this;
        if (e && "object" == typeof e && e.constructor === t){
            return e
        }
        var n = new t(noop);
        I(n, e);
        return n;
    }

    function noop() {
    }

    function error1() {
        return new TypeError("You cannot resolve a promise with itself");
    }

    function error2() {
        return new TypeError("A promises callback cannot return that same promise.");
    }

    function _(e) {
        try {
            return e.then;
        } catch (t) {
            ce.error = t;
            return ce;
        }
    }

    function m(fn, ctx, n, i) {
        try {
            fn.call(ctx, n, i);
        } catch (e) {
            return e;
        }
    }

    function y(e, t, n) {
        Q(function (e) {
            var i = false,
                r = m(n, t, function (n) {
                    i || (i = true, t !== n ? I(e, n) : A(e, n));
                }, function (t) {
                    i || (i = true, b(e, t));
                }, "Settle: " + (e._label || " unknown promise"));

            if(!i && r ){
                i = true;
                b(e, r)
            }
        }, e);
    }

    function E(e, t) {
        t._state === STATE_SUCCESS ? A(e, t._result) : t._state === STATE_FAILURE ? b(e, t._result) : O(t, void 0, function (t) {
            I(e, t);
        }, function (t) {
            b(e, t);
        });
    }

    function S(e, t, i) {
        t.constructor === e.constructor && i === ne && constructor.resolve === ie ? E(e, t) : i === ce ? b(e, ce.error) : void 0 === i ? A(e, t) : isFunction(i) ? y(e, t, i) : A(e, t);
    }

    function I(e, n) {
        if(e === n ){
            b(e, error1())
        }else if(isObject(n)) {
            S(e, n, _(n))
        }else{
            A(e, n);
        }
    }

    function C(e) {
        e._onerror && e._onerror(e._result);
        notify(e);
    }

    function A(promise, result) {
        if(promise._state === oe ){
            promise._result = result;
            promise._state = STATE_SUCCESS;
            0 !== promise._subscribers.length && Q(notify, promise)
        }
    }

    function b(promise, err) {
        if(promise._state === oe ) {
            promise._state = STATE_FAILURE;
            promise._result = err;
            Q(C, promise)
        }
    }

    function O(e, t, success, fail) {
        var r = e._subscribers, o = r.length;
        e._onerror = null;
        r[o] = t;
        r[o + STATE_SUCCESS] = success;
        r[o + STATE_FAILURE] = fail;
        if(0 === o && e._state ){
            Q(notify, e);
        }
    }

    function notify(promise) {
        var subscribers = promise._subscribers,
            state = promise._state;

        if (0 !== subscribers.length) {
            var subscriber, callback, res = promise._result;
            for (var i = 0; i < subscribers.length; i += 3){
                subscriber = subscribers[i];
                callback = subscribers[i + state];
                subscriber ? R(state, subscriber, callback, res) : callback(res);
            }
            promise._subscribers.length = 0;
        }
    }

    function w() {
        this.error = null;
    }

    function invoke(fn, arg) {
        try {
            return fn(arg);
        } catch (e) {
            ue.error = e;
            return ue;
        }
    }

    function R(state, t, callback, result) {
        var callbackResult, err, hasSuccess, hasError, isFn = isFunction(callback);
        if (isFn) {
            callbackResult = invoke(callback, result);
            if(callbackResult === ue ) {
                hasError = true;
                err = callbackResult.error;
                callbackResult = null;
            }else{
                hasSuccess = true;
            }
            if (t === callbackResult) {
                b(t, error2());
                return;
            }
        } else {
            callbackResult = result;
            hasSuccess = true;
        }
        if(t._state === oe ){
            if(isFn && hasSuccess){
                I(t, callbackResult)
            }else if(hasError){
                b(t, err)
            }else if(state === STATE_SUCCESS){
                A(t, callbackResult)
            }else{
                state === STATE_FAILURE && b(t, callbackResult)
            }
        }
    }

    function D(ctx, fn) {
        try {
            fn(function (t) {
                I(ctx, t);
            }, function (t) {
                b(ctx, t);
            });
        } catch (e) {
            b(ctx, e);
        }
    }

    function k() {
        return le++;
    }

    //clear
    function P(e) {
        e[re] = le++;
        e._state = undefined;
        e._result = undefined;
        e._subscribers = [];
    }

    function B(e) {
        return new ve(this, e).promise;
    }

    function L(e) {
        var t = this;
        return new t(Y(e) ? function (n, i) {
            for (var r = e.length, o = 0; r > o; o++) t.resolve(e[o]).then(n, i);
        } : function (e, t) {
            t(new TypeError("You must pass an array to race."));
        });
    }

    function U(e) {
        var t = this, n = new t(noop);
        b(n, e);
        return n;
    }

    function errorArg() {
        throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
    }

    function errorConstruct() {
        throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    }

    function Promise(fn) {
        this[re] = k();
        this._result = this._state = void 0;
        this._subscribers = [];
        if(noop !== fn ){
            if( "function" != typeof fn ){
                errorArg();
            }
            if(this instanceof Promise ){
                D(this, fn)
            }else{
                errorConstruct()
            }
        }
    }

    function x(e, t) {
        this._instanceConstructor = e, this.promise = new e(noop), this.promise[re] || P(this.promise),
            Y(t) ? (this._input = t, this.length = t.length, this._remaining = t.length, this._result = new Array(this.length),
                0 === this.length ? A(this.promise, this._result) : (this.length = this.length || 0,
                    this._enumerate(), 0 === this._remaining && A(this.promise, this._result))) : b(this.promise, W());
    }

    function W() {
        return new Error("Array Methods must be provided an Array");
    }

    function q() {
        var e;
        if ("undefined" != typeof global) e = global; else if ("undefined" != typeof self) e = self; else try {
            e = Function("return this")();
        } catch (t) {
            throw new Error("polyfill failed because global object is unavailable in this environment");
        }
        var n = e.Promise;
        (!n || "[object Promise]" !== Object.prototype.toString.call(n.resolve()) || n.cast) && (e.Promise = fe);
    }

    var isArray;
    isArray = Array.isArray ? Array.isArray : function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
    };

    //Environment
    var H, j, G, Y = isArray, z = 0,
        Q = function (callback, promise) {
            te[z] = callback;
            te[z + 1] = promise;
            z += 2;
            2 === z && (j ? j(l) : G());
        },
    //context
        Context = "undefined" != typeof window ? window : void 0,
        Global = Context || {},
        MutationObserver = Global.MutationObserver || Global.WebKitMutationObserver,
        Z = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process),
        ee = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
        te = new Array(1e3);

    G = Z ? o() : MutationObserver ? s() : ee ? c() : void 0 === Context && "function" == typeof require ? h() : u();
    var ne = then,
        ie = d,
        re = Math.random().toString(36).substring(16),
        oe = void 0,
        STATE_SUCCESS = 1,
        STATE_FAILURE = 2,
        ce = new w(),
        ue = new w(),
        le = 0,
        he = B,
        pe = L,
        de = U,
        fe = Promise;

    Promise.all = he;
    Promise.race = pe;
    Promise.resolve = ie;
    Promise.reject = de;
    Promise._setScheduler = i;
    Promise._setAsap = r;
    Promise._asap = Q;
    Promise.prototype = {
        constructor: Promise,
        then: ne,
        "catch": function (e) {
            return this.then(null, e);
        }
    };
    var ve = x;
    x.prototype._enumerate = function () {
        var len = this.length,
            input = this._input;
        for (var i = 0; this._state === oe && len > i; i++){
            this._eachEntry(input[i], i);
        }
    };
    x.prototype._eachEntry = function (e, t) {
        var n = this._instanceConstructor, i = n.resolve;
        if (i === ie) {
            var r = _(e);
            if (r === ne && e._state !== oe) this._settledAt(e._state, t, e._result); else if ("function" != typeof r) this._remaining--,
                this._result[t] = e; else if (n === fe) {
                var o = new n(noop);
                S(o, e, r), this._willSettleAt(o, t);
            } else this._willSettleAt(new n(function (t) {
                t(e);
            }), t);
        } else this._willSettleAt(i(e), t);
    };
    x.prototype._settledAt = function (e, t, n) {
        var i = this.promise;
        i._state === oe && (this._remaining--, e === STATE_FAILURE ? b(i, n) : this._result[t] = n),
        0 === this._remaining && A(i, this._result);
    };
    x.prototype._willSettleAt = function (e, t) {
        var n = this;
        O(e, void 0, function (e) {
            n._settledAt(STATE_SUCCESS, t, e);
        }, function (e) {
            n._settledAt(STATE_FAILURE, t, e);
        });
    };

    var ge = q,
        _e = {
            Promise: fe,
            polyfill: ge
        };

    e = function () {
        return _e;
    }();

    ge();

}).call(this);

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("util.Url", function (){
    function Url() {}
    Url.addParameters = function (baseUrl, params) {
        var url = baseUrl.toString();
        url += -1 !== url.indexOf("?") ? "&" : "?";
        var paramArr = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var val = params[key];
                if(void 0 !== val){
                    paramArr.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
                }
            }
        }
        return url + paramArr.join("&");
    };
    Url.getQueryParameter = function (url, paramName) {
        var params = url.split("?")[1].split("&");
        for (var i = 0; i < params.length; i++) {
            var r = params[i].split("=");
            if (r[0] === paramName){
                return r[1];
            }
        }
        return null;
    };
    return Url;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("webview.EventCategory", function(){
    var EventCategory = {};

    EventCategory[EventCategory.APPSHEET = 0] = "APPSHEET";
    EventCategory[EventCategory.ADUNIT = 1] = "ADUNIT";
    EventCategory[EventCategory.VIDEOPLAYER = 2] = "VIDEOPLAYER";
    EventCategory[EventCategory.CACHE = 3] = "CACHE";
    EventCategory[EventCategory.CONNECTIVITY = 4] = "CONNECTIVITY";
    EventCategory[EventCategory.STORAGE = 5] = "STORAGE";
    EventCategory[EventCategory.REQUEST = 6] = "REQUEST";
    EventCategory[EventCategory.RESOLVE = 7] = "RESOLVE";
    EventCategory[EventCategory.BROADCAST = 8] = "BROADCAST";
    EventCategory[EventCategory.NOTIFICATION = 9] = "NOTIFICATION";

    return EventCategory;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("webview.bridge.BatchInvocation", function(require){
    var Platform = require("platform.Platform");

    function BatchInvocation(nativeBridge) {
        this._batch = [];
        this._nativeBridge = nativeBridge;
    }
    BatchInvocation.prototype.queue = function (apiClass, method, args) {
        void 0 === args && (args = []);
        switch (this._nativeBridge.getPlatform()) {
            case Platform.ANDROID:
                return this.rawQueue("com.unity3d.ads.api." + apiClass, method, args);

            case Platform.IOS:
                return this.rawQueue("UADSApi" + apiClass, method, args);

            default:
                return this.rawQueue(apiClass, method, args);
        }
    };
    BatchInvocation.prototype.rawQueue = function (apiClass, method, args) {
        var me = this;
        void 0 === args && (args = []);
        return new Promise(function (r, o) {
            var id = me._nativeBridge.registerCallback(r, o);
            me._batch.push([apiClass, method, args, id.toString()]);
        });
    };
    BatchInvocation.prototype.getBatch = function () {
        return this._batch;
    };

    return BatchInvocation;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("webview.bridge.CallbackContainer", function () {
    function CallbackContainer(resolve, reject) {
        this.resolve = resolve;
        this.reject = reject;
    }

    return CallbackContainer;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("webview.bridge.CallbackStatus", function(){
    var CallbackStatus = {};

    CallbackStatus[CallbackStatus.OK = 0] = "OK";
    CallbackStatus[CallbackStatus.ERROR = 1] = "ERROR";

    return CallbackStatus;
});
/**
 * Created by duo on 2016/8/31.
 */

CMD.register("webview.bridge.NativeBridge", function(require){
    var CallbackStatus    = require("webview.bridge.CallbackStatus");
    var CallbackContainer = require("webview.bridge.CallbackContainer");
    var BatchInvocation   = require("webview.bridge.BatchInvocation");
    var EventCategory     = require("webview.EventCategory");
    var Platform        = require("platform.Platform");
    var AppSheetApi     = require("api.AppSheetApi");
    var IosAdUnitApi    = require("api.IosAdUnitApi");
    var AndroidAdUnitApi= require("api.AndroidAdUnitApi");
    var BroadcastApi    = require("api.BroadcastApi");
    var CacheApi        = require("api.CacheApi");
    var ConnectivityApi = require("api.ConnectivityApi");
    var DeviceInfoApi   = require("api.DeviceInfoApi");
    var IntentApi       = require("api.IntentApi");
    var ListenerApi     = require("api.ListenerApi");
    var NotificationApi = require("api.NotificationApi");
    var PlacementApi    = require("api.PlacementApi");
    var RequestApi      = require("api.RequestApi");
    var ResolveApi      = require("api.ResolveApi");
    var SdkApi          = require("api.SdkApi");
    var StorageApi      = require("api.StorageApi");
    var VideoPlayerApi  = require("api.VideoPlayerApi");
    var UrlSchemeApi    = require("api.UrlSchemeApi");

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
     * @param nativeClass {String} Native�����������"Broadcast"
     * @param nativeMethod {String} Native����������"addBroadcastListener"
     * @param parameters {Array} Native������ʵ���б�����[]
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
     * @param nativeFullPathClass {String} Native���ȫ·����������"com.unity3d.ads.api.Broadcast"
     * @param nativeMethod {String} Native����������"addBroadcastListener"
     * @param parameters {Array} Native������ʵ���б�����[]
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
     * JS����������Java�˽ӿ� className.methodName(parameters)��
     * ������Ϻ�Native�˻����WebView�Ľӿڣ�window.nativeBridge.handleCallback(jsCallbackId, callbackStatus, paramList);
     *
     * @param batch {Array} �����������ṹΪ��[[nativeClassName, nativeMethodName, nativeParamList, jsCallbackId]]
     */
    NativeBridge.prototype.invokeBatch = function (batch) {
        this._backend.handleInvocation(JSON.stringify(batch.getBatch()).replace(NativeBridge._doubleRegExp, "$1"));
    };

    /**
     * JS Call Native. JS�˵���Native�˽ӿ�
     * JSִ��Native�Ľӿڡ���Android�����У���������½ӿ�:
     *
     * WebViewBridgeInterface.handleCallback(nativeCallbackId, callbackStatus)
     *
     * @param nativeCallbackId {String} Java�ص�����id
     * @param callbackStatus {String} �ص�״̬����Ϊʵ�δ���nativeCallbackId����ʾ�ķ�����
     */
    NativeBridge.prototype.invokeCallback = function (nativeCallbackId, callbackStatus) {
        var parameters = [];
        for (var i = 2; i < arguments.length; i++){
            parameters[i - 2] = arguments[i];
        }
        this._backend.handleCallback(nativeCallbackId, callbackStatus, JSON.stringify(parameters));
    };

    /**
     * Native call JS. Native�˵���JS�˽ӿ�
     * �˷�������Native�˵���JS�˽ӿ�: window.jsClassName.jsMethodName(jsParams).
     * ������Ϻ�JS�˻��ٴε���Native�˵Ľӿڡ���Android�����У���������½ӿ�:
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
     * �˷�������Native�˵���JS�˽ӿ�(Native call JS)
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
            //ֻ��һ������ʱ��ʹ������
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
     * �˷�������Native�˵���JS�˽ӿ�(Native call JS)
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
/**
 * Created by duo on 2016/8/31.
 */

CMD.register("main", function(require){
    var Url         = require("util.Url");
    var Platform    = require("platform.Platform");
    var NativeBridge = require("webview.bridge.NativeBridge");
    var IosWebViewBridge = require("webview.bridge.IosWebViewBridge");
    //var WebView     = require("webview.WebView");

    var getOrientation = function (e) {
        var calculatedOrientation = window.innerWidth / window.innerHeight >= 1 ? "landscape" : "portrait",
            orientation = null;

        if(document.body.classList.contains("landscape")){
            orientation = "landscape";
        }else if(document.body.classList.contains("portrait")){
            orientation = "portrait";
        }

        if(orientation){
            if(orientation !== calculatedOrientation){
                document.body.classList.remove(orientation);
                document.body.classList.add(calculatedOrientation)
            }
        }else{
            document.body.classList.add(calculatedOrientation)
        }
    };
    getOrientation(null);
    window.addEventListener("resize", getOrientation, false);

    var nativeBridge = null;
    switch (Url.getQueryParameter(location.search, "platform")) {
        case "android":
            //JS ���� Android API: �ṩwebviewbridge�ӿ�
            nativeBridge = new NativeBridge(window.webviewbridge, Platform.ANDROID);
            break;

        case "ios":
            nativeBridge = new NativeBridge(new IosWebViewBridge(), Platform.IOS, false);
            break;

        default:
            throw new Error("webview init failure: no platform defined, unable to initialize native bridge");
    }
    var win = window;
    win.nativebridge = nativeBridge;
    //win.webview = new WebView(nativeBridge);
    //win.webview.initialize();
});
CMD.require("main");

//document.addEventListener('DOMContentLoaded', function () {
}, false);