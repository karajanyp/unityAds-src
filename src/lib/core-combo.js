/**
 * Created by duo on 2016/9/2.
 */
!(function(exports){
    var moduleCache = {},
        pending = {};

    var require = exports.require = function(id) {
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
 * Created by duo on 2016/8/24.
 */
var extend = this && this.extend || function (constructor, superClass) {
    function cls() {
        this.constructor = constructor;
    }

    for (var key in superClass){
        if(superClass.hasOwnProperty(key) ){
            constructor[key] = superClass[key];
        }
    }
    if(null === superClass){
        constructor.prototype = Object.create(superClass);
    }else{
        cls.prototype = superClass.prototype;
        constructor.prototype = new cls();
    }
};
/**
 * 遍历数组项
 * @param fn {Function} 遍历回调方法
 * @param context {Object} optional. 可选，回调方法的上下文
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
 * 为DOMElement添加兼容的classList属性
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

/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
 * @version   3.2.1
 */

!(function () {
    "use strict";

    /**
     * 判断入参类型是否为Object
     * @grammer isObject
     * @param o
     * @returns {boolean}
     */
    function isObject(o) {
        return "function" == typeof o || "object" == typeof o && null !== o;
    }

    /**
     * 判断入参类型是否为Function
     * @param o
     * @returns {boolean}
     */
    function isFunction(o) {
        return "function" == typeof o;
    }

    function setScheduler(e) {
        scheduler = e;
    }

    function setAsap(e) {
        asap = e;
    }

    function buildProcess() {
        return function () {
            process.nextTick(consume);
        };
    }

    function buildMutationObserver() {
        var i = 0,
            Observer = new MutationObserver(consume),
            node = document.createTextNode("");

        Observer.observe(node, {
            characterData: true
        });
        return function () {
            i = ++i % 2;
            node.data = i;
        };
    }

    function buildMessageChannel() {
        var e = new MessageChannel();
        e.port1.onmessage = consume;
        return function () {
            e.port2.postMessage(0);
        };
    }

    function buildTimeout() {
        return function () {
            setTimeout(consume, 1);
        };
    }

    function consume() {
        for (var i = 0; z > i; i += 2) {
            var fn = callbackPool[i],
                status = callbackPool[i + 1];
            fn(status);
            callbackPool[i] = undefined;
            callbackPool[i + 1] = undefined;
        }
        z = 0;
    }

    function buildRunLoop() {
        try {
            var vertx = require("vertx");
            var run = vertx.runOnLoop || vertx.runOnContext;
            return function () {
                run(consume);
            };
        } catch (e) {
            return buildTimeout();
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
            asap(function () {
                R(state, i, callback, promise._result);
            });
        } else {
            O(promise, i, success, failure);
        }
        return i;
    }

    function resolve(e) {
        var ctx = this;
        if (e && "object" == typeof e && e.constructor === ctx){
            return e
        }
        var n = new ctx(noop);
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
        asap(function (e) {
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
        if(t._state === STATE_SUCCESS){
            A(e, t._result)
        }else if(t._state === STATE_FAILURE){
            b(e, t._result)
        }else{
            O(t, void 0, function (t) {
                I(e, t);
            }, function (t) {
                b(e, t);
            });
        }
    }

    function S(e, t, i) {
        if(t.constructor === e.constructor && i === then && constructor.resolve === resolve){
            E(e, t)
        }else if(i === ce){
            b(e, ce.error)
        }else if(void 0 === i){
            A(e, t)
        }else if(isFunction(i)){
            y(e, t, i)
        }else{
            A(e, t);
        }
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
        if(promise._state === undefined ){
            promise._result = result;
            promise._state = STATE_SUCCESS;
            if(0 !== promise._subscribers.length){
                asap(notify, promise)
            }
        }
    }

    function b(promise, err) {
        if(promise._state === undefined ) {
            promise._state = STATE_FAILURE;
            promise._result = err;
            asap(C, promise)
        }
    }

    function O(e, t, success, fail) {
        var subscribers = e._subscribers,
            len = subscribers.length;
        e._onerror = null;
        subscribers[len] = t;
        subscribers[len + STATE_SUCCESS] = success;
        subscribers[len + STATE_FAILURE] = fail;
        if(0 === len && e._state ){
            asap(notify, e);
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
        if(t._state === undefined ){
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

    function all(e) {
        return new ve(this, e).promise;
    }

    function race(e) {
        var t = this;
        return new t(isArray(e) ? function (n, i) {
            for (var r = e.length, o = 0; r > o; o++) t.resolve(e[o]).then(n, i);
        } : function (e, t) {
            t(new TypeError("You must pass an array to race."));
        });
    }

    function reject(e) {
        var t = this,
            n = new t(noop);
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

    function x(Constructor, tasks) {
        this._instanceConstructor = Constructor;
        this.promise = new Constructor(noop);
        this.promise[re] || P(this.promise);
        if(isArray(tasks)){
            this._input = tasks;
            this.length = tasks.length;
            this._remaining = tasks.length;
            this._result = new Array(this.length);
            if(0 === this.length){
                A(this.promise, this._result)
            }else{
                this.length = this.length || 0;
                this._enumerate();
                if(0 === this._remaining){
                    A(this.promise, this._result)
                }
            }
        }else{
            b(this.promise, W());
        }
    }

    function W() {
        return new Error("Array Methods must be provided an Array");
    }

    var isArray = Array.isArray || function (e) {
        return "[object Array]" === Object.prototype.toString.call(e);
    };


    var scheduler, trigger, z = 0;
    var asap = function (callback, promise) {
        callbackPool[z] = callback;
        callbackPool[z + 1] = promise;
        z += 2;
        2 === z && (scheduler ? scheduler(consume) : trigger());
    };

    //Environment Check
    var Context = "undefined" != typeof window ? window : void 0,
        Global = Context || {},
        MutationObserver = Global.MutationObserver || Global.WebKitMutationObserver,
        idNode = "undefined" == typeof self && "undefined" != typeof process && "[object process]" === {}.toString.call(process),
        isWebWorkers = "undefined" != typeof Uint8ClampedArray && "undefined" != typeof importScripts && "undefined" != typeof MessageChannel,
        callbackPool = new Array(1000);

    if(idNode){
        trigger = buildProcess()
    }else if(MutationObserver){
        trigger = buildMutationObserver()
    }else if(isWebWorkers){
        trigger = buildMessageChannel()
    }else if(void 0 === Context && "function" == typeof require){ //vertx
        trigger = buildRunLoop()
    }else{
        trigger = buildTimeout();
    }

    var re = Math.random().toString(36).substring(16),
        undefined = void 0,
        STATE_SUCCESS = 1,
        STATE_FAILURE = 2,
        ce = new w(),
        ue = new w(),
        le = 0;

    Promise.all = all;
    Promise.race = race;
    Promise.resolve = resolve;
    Promise.reject = reject;
    Promise._setScheduler = setScheduler;
    Promise._setAsap = setAsap;
    Promise._asap = asap;
    Promise.prototype = {
        constructor: Promise,
        then: then,
        "catch": function (e) {
            return this.then(null, e);
        }
    };
    var ve = x;
    x.prototype._enumerate = function () {
        var len = this.length,
            input = this._input;
        for (var i = 0; this._state === undefined && len > i; i++){
            this._eachEntry(input[i], i);
        }
    };
    x.prototype._eachEntry = function (task, taskIndex) {
        var Constructor = this._instanceConstructor,
            i = Constructor.resolve;
        if (i === resolve) {
            var r = _(task);
            if (r === then && task._state !== undefined) {
                this._settledAt(task._state, taskIndex, task._result);
            } else if ("function" != typeof r){
                this._remaining--;
                this._result[taskIndex] = task;
            }else if (Constructor === Promise) {
                var o = new Constructor(noop);
                S(o, task, r);
                this._willSettleAt(o, taskIndex);
            } else {
                this._willSettleAt(new Constructor(function (t) {t(task);}), taskIndex);
            }
        } else {
            this._willSettleAt(i(task), taskIndex);
        }
    };
    x.prototype._settledAt = function (state, t, result) {
        var promise = this.promise;
        if(promise._state === undefined){
            this._remaining--;
            if(state === STATE_FAILURE){
                b(promise, result)
            }else{
                this._result[t] = result;
            }
        }
        if(0 === this._remaining){
            A(promise, this._result);
        }
    };
    x.prototype._willSettleAt = function (e, t) {
        var me = this;
        O(e, void 0, function (result) {
            me._settledAt(STATE_SUCCESS, t, result);
        }, function (result) {
            me._settledAt(STATE_FAILURE, t, result);
        });
    };

    function polyfill() {
        var context;
        if("undefined" != typeof global){
            context = global;
        }else if ("undefined" != typeof self){
            context = self;
        }else{
            try {
                context = Function("return this")();
            } catch (t) {
                throw new Error("polyfill failed because global object is unavailable in this environment");
            }
        }
        var p = context.Promise;
        if(!p || "[object Promise]" !== Object.prototype.toString.call(p.resolve()) || p.cast){
            context.Promise = Promise;
        }
    }

    polyfill();

}).call(this);

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.AbstractAdUnit", function (require) {
    var Observable = require("util.Observable");
    var FinishState = require("FinishState");

    function AbstractAdUnit(nativeBridge, placement, campaign) {
        this.onStart = new Observable();
        this.onNewAdRequestAllowed = new Observable();
        this.onClose = new Observable();
        this._showing = false;
        this._nativeBridge = nativeBridge;
        this._placement = placement;
        this._campaign = campaign;
    }
    AbstractAdUnit.prototype.getPlacement = function () {
        return this._placement;
    };
    AbstractAdUnit.prototype.getCampaign = function () {
        return this._campaign;
    };
    AbstractAdUnit.prototype.setFinishState = function (state) {
        if(this._finishState !== FinishState.COMPLETED){
            this._finishState = state;
        }
    };
    AbstractAdUnit.prototype.getFinishState = function () {
        return this._finishState;
    };
    AbstractAdUnit.prototype.isShowing = function () {
        return this._showing;
    };
    AbstractAdUnit.prototype.sendImpressionEvent = function (eventManager, sessionId) {
    };
    AbstractAdUnit.prototype.sendTrackingEvent = function (eventManager, eventName, sessionId) {
    };
    AbstractAdUnit.prototype.sendProgressEvents = function (eventManager, sessionId, n, i) {
    };
    return AbstractAdUnit;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.AdUnitFactory", function (require) {
    var VastCampaign = require("campaign.VastCampaign");
    var Overlay = require("adunit.view.Overlay");
    var EndScreen = require("adunit.view.EndScreen");
    var VideoAdUnit = require("adunit.VideoAdUnit");
    var VastAdUnit = require("adunit.VastAdUnit");
    var Platform = require("platform.Platform");
    var VastVideoEventHandlers = require("adunit.eventhandlers.VastVideoEventHandlers");
    var VideoEventHandlers = require("adunit.eventhandlers.VideoEventHandlers");
    var EndScreenEventHandlers = require("adunit.eventhandlers.EndScreenEventHandlers");
    var VastOverlayEventHandlers = require("adunit.eventhandlers.VastOverlayEventHandlers");
    var OverlayEventHandlers = require("adunit.eventhandlers.OverlayEventHandlers");


    function AdUnitFactory() {
    }
    AdUnitFactory.createAdUnit = function (nativeBridge, sessionManager, placement, campaign, configuration) {
        if(campaign instanceof VastCampaign){
            return this.createVastAdUnit(nativeBridge, sessionManager, placement, campaign, configuration);
        }else{
            return this.createVideoAdUnit(nativeBridge, sessionManager, placement, campaign, configuration);
        }
    };
    AdUnitFactory.createVideoAdUnit = function (nativeBridge, sessionManager, placement, campaign, configuration) {
        var overlay = new Overlay(placement.muteVideo()),
            endScreen = new EndScreen(campaign, configuration.isCoppaCompliant()),
            videoAdUnit = new VideoAdUnit(nativeBridge, placement, campaign, overlay, endScreen);

        this.prepareOverlay(overlay, nativeBridge, sessionManager, videoAdUnit, placement, campaign);
        this.prepareEndScreen(endScreen, nativeBridge, sessionManager, videoAdUnit);
        this.prepareVideoPlayer(nativeBridge, sessionManager, videoAdUnit);
        return videoAdUnit;
    };
    AdUnitFactory.createVastAdUnit = function (nativeBridge, sessionManager, placement, campaign, configuration) {
        var overlay = new Overlay(placement.muteVideo()),
            vastAdUnit = new VastAdUnit(nativeBridge, placement, campaign, overlay);

        this.prepareOverlay(overlay, nativeBridge, sessionManager, vastAdUnit, placement, campaign);
        this.prepareVideoPlayer(nativeBridge, sessionManager, vastAdUnit);
        return vastAdUnit;
    };
    AdUnitFactory.prepareOverlay = function (overlay, nativeBridge, sessionManager, adUnit, placement, campaign) {
        overlay.render();
        document.body.appendChild(overlay.container());
        this.prepareOverlayEventHandlers(overlay, nativeBridge, sessionManager, adUnit);
        overlay.setSpinnerEnabled(!campaign.isVideoCached());
        if( placement.allowSkip() ){
            overlay.setSkipEnabled(true);
            overlay.setSkipDuration(placement.allowSkipInSeconds())
        }else{
            overlay.setSkipEnabled(false);
        }
    };
    AdUnitFactory.prepareOverlayEventHandlers = function (overlay, nativeBridge, sessionManager, adUnit) {
        if(adUnit instanceof VastAdUnit){
            overlay.onSkip.subscribe(function (e) {
                return VastOverlayEventHandlers.onSkip(nativeBridge, sessionManager, adUnit);
            });
            overlay.onMute.subscribe(function (e) {
                return VastOverlayEventHandlers.onMute(nativeBridge, sessionManager, adUnit, e);
            });
            overlay.onCallButton.subscribe(function () {
                return VastOverlayEventHandlers.onCallButton(nativeBridge, sessionManager, adUnit);
            })
        }else{
            overlay.onSkip.subscribe(function (e) {
                return OverlayEventHandlers.onSkip(nativeBridge, sessionManager, adUnit);
            });
            overlay.onMute.subscribe(function (e) {
                return OverlayEventHandlers.onMute(nativeBridge, sessionManager, adUnit, e);
            });
        }
    };
    AdUnitFactory.prepareEndScreen = function (endScreen, nativeBridge, sessionManager, adUnit) {
        endScreen.render();
        endScreen.hide();
        document.body.appendChild(endScreen.container());
        endScreen.onDownload.subscribe(function () {
            return EndScreenEventHandlers.onDownload(nativeBridge, sessionManager, adUnit);
        });
        endScreen.onPrivacy.subscribe(function (e) {
            return EndScreenEventHandlers.onPrivacy(nativeBridge, e);
        });
        endScreen.onClose.subscribe(function () {
            return EndScreenEventHandlers.onClose(nativeBridge, adUnit);
        });
    };
    AdUnitFactory.prepareVideoPlayer = function (nativeBridge, sessionManager, adUnit) {
        var r, o;
        var a = nativeBridge.VideoPlayer.onPrepared.subscribe(function (t, n, r) {
            return VideoEventHandlers.onVideoPrepared(nativeBridge, adUnit, t);
        });
        var u = nativeBridge.VideoPlayer.onProgress.subscribe(function (n) {
            return VideoEventHandlers.onVideoProgress(nativeBridge, sessionManager, adUnit, n);
        });
        var l = nativeBridge.VideoPlayer.onPlay.subscribe(function () {
            return VideoEventHandlers.onVideoStart(nativeBridge, sessionManager, adUnit);
        });

        if(adUnit instanceof VastAdUnit){
            r = nativeBridge.VideoPlayer.onCompleted.subscribe(function (n) {
                return VastVideoEventHandlers.onVideoCompleted(nativeBridge, sessionManager, adUnit);
            });
            o = nativeBridge.VideoPlayer.onError.subscribe(function (t, n, r) {
                return VastVideoEventHandlers.onVideoError(nativeBridge, adUnit, t, n);
            })
        }else{
            r = nativeBridge.VideoPlayer.onCompleted.subscribe(function (n) {
                return VideoEventHandlers.onVideoCompleted(nativeBridge, sessionManager, adUnit);
            });
            o = nativeBridge.VideoPlayer.onError.subscribe(function (t, n, r) {
                return VideoEventHandlers.onVideoError(nativeBridge, adUnit, t, n);
            });
        }

        adUnit.onClose.subscribe(function () {
            nativeBridge.VideoPlayer.onPrepared.unsubscribe(a);
            nativeBridge.VideoPlayer.onProgress.unsubscribe(u);
            nativeBridge.VideoPlayer.onPlay.unsubscribe(l);
            nativeBridge.VideoPlayer.onCompleted.unsubscribe(r);
            nativeBridge.VideoPlayer.onError.unsubscribe(o);
        });

        if ( nativeBridge.getPlatform() === Platform.IOS) {
            var p = nativeBridge.VideoPlayer.Ios.onLikelyToKeepUp.subscribe(function (t, n) {
                n === true && nativeBridge.VideoPlayer.play();
            });
            adUnit.onClose.subscribe(function () {
                nativeBridge.VideoPlayer.Ios.onLikelyToKeepUp.unsubscribe(p);
            });
        }
    };

    return AdUnitFactory;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.VastAdUnit", function (require) {
    var VideoAdUnit = require("adunit.VideoAdUnit");

    function VastAdUnit(nativeBridge, placement, campaign, overlay) {
        VideoAdUnit.call(this, nativeBridge, placement, campaign, overlay, null);
    }
    extend(VastAdUnit, VideoAdUnit);
    VastAdUnit.prototype.hideChildren = function () {
        var overlay = this.getOverlay();
        overlay.container().parentElement.removeChild(overlay.container());
    };
    VastAdUnit.prototype.getVast = function () {
        return this.getCampaign().getVast();
    };
    VastAdUnit.prototype.getDuration = function () {
        return this.getVast().getDuration();
    };
    VastAdUnit.prototype.sendImpressionEvent = function (eventManager, sessionId) {
        var urls = this.getVast().getImpressionUrls();
        if (urls){
            for (var i = 0; i < urls.length; i++) {
                var url = urls[i];
                this.sendThirdPartyEvent(eventManager, "vast impression", sessionId, url);
            }
        }
    };
    VastAdUnit.prototype.sendTrackingEvent = function (eventManager, eventName, sessionId) {
        var urls = this.getVast().getTrackingEventUrls(eventName);
        if (urls){
            for (var i = 0; i < urls.length; i++) {
                var url = urls[i];
                this.sendThirdPartyEvent(eventManager, "vast " + eventName, sessionId, url);
            }
        }
    };
    VastAdUnit.prototype.sendProgressEvents = function (eventManager, sessionId, n, position) {
        this.sendQuartileEvent(eventManager, sessionId, n, position, 1);
        this.sendQuartileEvent(eventManager, sessionId, n, position, 2);
        this.sendQuartileEvent(eventManager, sessionId, n, position, 3);
    };
    VastAdUnit.prototype.getVideoClickThroughURL = function () {
        var url = this.getVast().getVideoClickThroughURL(),
            isHttps = new RegExp("^(https?)://.+$");
        return isHttps.test(url) ? url : null;
    };
    VastAdUnit.prototype.sendVideoClickTrackingEvent = function (eventManager, sessionId) {
        var urls = this.getVast().getVideoClickTrackingURLs();
        if (urls) {
            for (var i = 0; i < urls.length; i++) {
                this.sendThirdPartyEvent(eventManager, "vast video click", sessionId, urls[i]);
            }
        }
    };
    VastAdUnit.prototype.sendQuartileEvent = function (eventManager, sessionId, n, position, point) {
        var eventName;
        if(1 === point){
            eventName = "firstQuartile";
        }else if(2 === point){
            eventName = "midpoint";
        }else if(3 === point){
            eventName = "thirdQuartile";
        }
        if (this.getTrackingEventUrls(eventName)) {
            var duration = this.getDuration();
            if(duration > 0 && n / 1e3 > .25 * duration * point && .25 * duration * point > position / 1e3){
                this.sendTrackingEvent(eventManager, eventName, sessionId);
            }
        }
    };
    VastAdUnit.prototype.sendThirdPartyEvent = function (eventManager, eventName, sessionId, eventUrl) {
        eventUrl = eventUrl.replace(/%ZONE%/, this.getPlacement().getId());
        eventManager.thirdPartyEvent(eventName, sessionId, eventUrl);
    };
    /**
     * 鏍规嵁浜嬩欢鍚嶇О杩斿洖瀵瑰簲鐨勮窡韪摼鎺?
     * @param event {String} 浜嬩欢鍚嶇О
     * @returns {String}
     */
    VastAdUnit.prototype.getTrackingEventUrls = function (event) {
        return this.getVast().getTrackingEventUrls(event);
    };
    return VastAdUnit;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.VideoAdUnit", function (require) {
    var AbstractAdUnit = require("adunit.AbstractAdUnit");
    var UIInterfaceOrientationMask = require("device.UIInterfaceOrientationMask");
    var Platform = require("platform.Platform");
    var Double = require("util.Double");
    var FinishState = require("FinishState");
    var ScreenOrientation = require("device.ScreenOrientation");

    function VideoAdUnit(nativeBridge, placement, campaign, overlay, endScreen) {
        var me = this;
        AbstractAdUnit.call(this, nativeBridge, placement, campaign);
        if(nativeBridge.getPlatform() === Platform.IOS){
            this._onViewControllerDidAppearObserver = this._nativeBridge.IosAdUnit.onViewControllerDidAppear.subscribe(function () {
                return me.onViewDidAppear();
            })
        }else{
            this._activityId = VideoAdUnit._activityIdCounter++;
            this._onResumeObserver = this._nativeBridge.AndroidAdUnit.onResume.subscribe(function (e) {
                return me.onResume(e);
            });
            this._onPauseObserver = this._nativeBridge.AndroidAdUnit.onPause.subscribe(function (e, t) {
                return me.onPause(e, t);
            });
            this._onDestroyObserver = this._nativeBridge.AndroidAdUnit.onDestroy.subscribe(function (e, t) {
                return me.onDestroy(e, t);
            });
        }
        this._videoPosition = 0;
        this._videoQuartile = 0;
        this._videoActive = true;
        this._watches = 0;
        this._overlay = overlay;
        this._endScreen = endScreen;
    }
    extend(VideoAdUnit, AbstractAdUnit);
    VideoAdUnit.prototype.show = function () {
        var me = this;
        this._showing = true;
        this.onStart.trigger();
        this.setVideoActive(true);
        if (this._nativeBridge.getPlatform() === Platform.IOS) {
            var n = this._iosOptions.supportedOrientations;
            this._placement.useDeviceOrientationForVideo() ||
            (this._iosOptions.supportedOrientations & UIInterfaceOrientationMask.INTERFACE_ORIENTATION_MASK_LANDSCAPE) !== UIInterfaceOrientationMask.INTERFACE_ORIENTATION_MASK_LANDSCAPE || (n = UIInterfaceOrientationMask.INTERFACE_ORIENTATION_MASK_LANDSCAPE);
            this._onNotificationObserver = this._nativeBridge.Notification.onNotification.subscribe(function (t, n) {
                return me.onNotification(t, n);
            });
            this._nativeBridge.Notification.addNotificationObserver(VideoAdUnit._audioSessionInterrupt, ["AVAudioSessionInterruptionTypeKey", "AVAudioSessionInterruptionOptionKey"]);
            this._nativeBridge.Notification.addNotificationObserver(VideoAdUnit._audioSessionRouteChange, []);
            this._nativeBridge.Sdk.logInfo("Opening game ad with orientation " + n);
            return this._nativeBridge.IosAdUnit.open(["videoplayer", "webview"], n, true, true);
        }
        var orientation = this._androidOptions.requestedOrientation;
        if(!this._placement.useDeviceOrientationForVideo()){
            orientation = ScreenOrientation.SCREEN_ORIENTATION_SENSOR_LANDSCAPE;
        }
        var keyevents = [];
        if(this._placement.disableBackButton()){
            keyevents = [4];
            this._onBackKeyObserver = this._nativeBridge.AndroidAdUnit.onKeyDown.subscribe(function (t, n, i, r) {
                return me.onKeyEvent(t);
            });
        }
        var acceleration = true;
        if(this._nativeBridge.getApiLevel() < 17 ){
            acceleration = false;
        }
        this._nativeBridge.Sdk.logInfo("Opening game ad with orientation " + orientation + ", hardware acceleration " + (acceleration ? "enabled" : "disabled"));
        return this._nativeBridge.AndroidAdUnit.open(this._activityId, ["videoplayer", "webview"], orientation, keyevents, 1, acceleration);
    };
    VideoAdUnit.prototype.onKeyEvent = function (e) {
        4 !== e || this.isVideoActive() || this.hide();
    };
    VideoAdUnit.prototype.hide = function () {
        var me = this;
        if(this.isVideoActive()){
            this._nativeBridge.VideoPlayer.stop();
        }
        this.hideChildren();
        this.unsetReferences();
        this._nativeBridge.Listener.sendFinishEvent(this.getPlacement().getId(), this.getFinishState());

        if(this._nativeBridge.getPlatform() === Platform.IOS){
            this._nativeBridge.IosAdUnit.onViewControllerDidAppear.unsubscribe(this._onViewControllerDidAppearObserver);
            this._nativeBridge.Notification.onNotification.unsubscribe(this._onNotificationObserver);
            this._nativeBridge.Notification.removeNotificationObserver(VideoAdUnit._audioSessionInterrupt);
            this._nativeBridge.Notification.removeNotificationObserver(VideoAdUnit._audioSessionRouteChange);
            return this._nativeBridge.IosAdUnit.close().then(function () {
                me._showing = false;
                me.onClose.trigger();
            })
        }else{
            this._nativeBridge.AndroidAdUnit.onResume.unsubscribe(this._onResumeObserver);
            this._nativeBridge.AndroidAdUnit.onPause.unsubscribe(this._onPauseObserver);
            this._nativeBridge.AndroidAdUnit.onDestroy.unsubscribe(this._onDestroyObserver);
            this._nativeBridge.AndroidAdUnit.onKeyDown.unsubscribe(this._onBackKeyObserver);
            return this._nativeBridge.AndroidAdUnit.close().then(function () {
                me._showing = false;
                me.onClose.trigger();
            });
        }
    };
    VideoAdUnit.prototype.hideChildren = function () {
        this.getOverlay().container().parentElement.removeChild(this.getOverlay().container());
        this.getEndScreen().container().parentElement.removeChild(this.getEndScreen().container());
    };
    VideoAdUnit.prototype.setNativeOptions = function (options) {
        if(this._nativeBridge.getPlatform() === Platform.IOS){
            this._iosOptions = options
        } else {
            this._androidOptions = options;
        }
    };
    VideoAdUnit.prototype.isShowing = function () {
        return this._showing;
    };
    VideoAdUnit.prototype.getWatches = function () {
        return this._watches;
    };
    VideoAdUnit.prototype.getVideoDuration = function () {
        return this._videoDuration;
    };
    VideoAdUnit.prototype.setVideoDuration = function (duration) {
        this._videoDuration = duration;
    };
    VideoAdUnit.prototype.getVideoPosition = function () {
        return this._videoPosition;
    };
    VideoAdUnit.prototype.setVideoPosition = function (position) {
        this._videoPosition = position;
        if(this._videoDuration){
            this._videoQuartile = Math.floor(4 * this._videoPosition / this._videoDuration);
        }
    };
    VideoAdUnit.prototype.getVideoQuartile = function () {
        return this._videoQuartile;
    };
    VideoAdUnit.prototype.isVideoActive = function () {
        return this._videoActive;
    };
    VideoAdUnit.prototype.setVideoActive = function (active) {
        this._videoActive = active;
    };
    VideoAdUnit.prototype.setWatches = function (watches) {
        this._watches = watches;
    };
    VideoAdUnit.prototype.getOverlay = function () {
        return this._overlay;
    };
    VideoAdUnit.prototype.getEndScreen = function () {
        return this._endScreen;
    };
    VideoAdUnit.prototype.newWatch = function () {
        this._watches += 1;
    };
    VideoAdUnit.prototype.unsetReferences = function () {
        this._endScreen = null, this._overlay = null;
    };
    VideoAdUnit.prototype.onResume = function (e) {
        if(this._showing && this.isVideoActive() && e === this._activityId){
            this._nativeBridge.VideoPlayer.prepare(this.getCampaign().getVideoUrl(), new Double(this.getPlacement().muteVideo() ? 0 : 1));
        }
    };
    VideoAdUnit.prototype.onPause = function (e, t) {
        if(e && this._showing && t === this._activityId ){
            this.setFinishState(FinishState.SKIPPED);
            this.hide();
        }
    };
    VideoAdUnit.prototype.onDestroy = function (e, t) {
        if(this._showing && e && t === this._activityId){
            this.setFinishState(FinishState.SKIPPED);
            this.hide();
        }
    };
    VideoAdUnit.prototype.onViewDidAppear = function () {
        if(this._showing && this.isVideoActive() ){
            this._nativeBridge.VideoPlayer.prepare(this.getCampaign().getVideoUrl(), new Double(this.getPlacement().muteVideo() ? 0 : 1));
        }
    };
    VideoAdUnit.prototype.onNotification = function (e, t) {
        switch (e) {
            case VideoAdUnit._appDidBecomeActive:
                if(this._showing && this.isVideoActive()){
                    this._nativeBridge.Sdk.logInfo("Resuming OneWay SDK video playback, app is active");
                    this._nativeBridge.VideoPlayer.play();
                }
                break;

            case VideoAdUnit._audioSessionInterrupt:
                var n = t;
                if(0 === n.AVAudioSessionInterruptionTypeKey && 1 === n.AVAudioSessionInterruptionOptionKey && this._showing && this.isVideoActive()){
                    this._nativeBridge.Sdk.logInfo("Resuming OneWay SDK video playback after audio interrupt");
                    this._nativeBridge.VideoPlayer.play();
                }
                break;

            case VideoAdUnit._audioSessionRouteChange:
                if(this._showing && this.isVideoActive()){
                    this._nativeBridge.Sdk.logInfo("Continuing OneWay SDK video playback after audio session route change");
                    this._nativeBridge.VideoPlayer.play();
                }
        }
    };
    VideoAdUnit._appDidBecomeActive = "UIApplicationDidBecomeActiveNotification";
    VideoAdUnit._audioSessionInterrupt = "AVAudioSessionInterruptionNotification";
    VideoAdUnit._audioSessionRouteChange = "AVAudioSessionRouteChangeNotification";
    VideoAdUnit._activityIdCounter = 1;

    return VideoAdUnit;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.eventhandlers.EndScreenEventHandlers", function (require) {
    var Request = require("request.Request");
    var Platform = require("platform.Platform");

    function EndScreenEventHandlers() {
    }
    EndScreenEventHandlers.onDownload = function (nativeBridge, sessionManager, adUnit) {
        var platform = nativeBridge.getPlatform(),
            campaign = adUnit.getCampaign();
        if(campaign.getClickAttributionUrlFollowsRedirects()){
            sessionManager.sendClick(adUnit).then(function (e) {
                var url = Request.getHeader(e.headers, "location");
                if (!url){ throw new Error("No location found");}
                if(platform === Platform.IOS){
                    nativeBridge.UrlScheme.open(url)
                } else{
                    nativeBridge.Intent.launch({
                        action: "android.intent.action.VIEW",
                        uri: url
                    });
                }
            })
        }else{
            sessionManager.sendClick(adUnit);
            if(platform === Platform.IOS){
                nativeBridge.AppSheet.canOpen().then(function (t) {
                    if(t && !campaign.getBypassAppSheet()){
                        EndScreenEventHandlers.openAppSheet(nativeBridge, {
                            id: parseInt(campaign.getAppStoreId(), 10)
                        })
                    }else{
                        nativeBridge.UrlScheme.open(EndScreenEventHandlers.getAppStoreUrl(platform, campaign));
                    }
                })
            }else{
                nativeBridge.Intent.launch({
                    action: "android.intent.action.VIEW",
                    uri: EndScreenEventHandlers.getAppStoreUrl(platform, campaign)
                });
            }
        }
    };
    EndScreenEventHandlers.onPrivacy = function (nativeBridge, url) {
        if(nativeBridge.getPlatform() === Platform.IOS ){
            nativeBridge.UrlScheme.open(url)
        }else if(nativeBridge.getPlatform() === Platform.ANDROID){
            nativeBridge.Intent.launch({
                action: "android.intent.action.VIEW",
                uri: url
            });
        }
    };
    EndScreenEventHandlers.onClose = function (nativeBridge, adUnit) {
        nativeBridge.getPlatform() !== Platform.IOS || adUnit.getCampaign().getBypassAppSheet() || nativeBridge.AppSheet.destroy({
            id: parseInt(adUnit.getCampaign().getAppStoreId(), 10)
        });
        adUnit.hide();
    };
    EndScreenEventHandlers.getAppStoreUrl = function (platform, campaign) {
        if(platform === Platform.IOS){
            return "https://itunes.apple.com/" + campaign.getAppStoreCountry() + "/app/id" + campaign.getAppStoreId();
        }else{
            return "market://details?id=" + campaign.getAppStoreId();
        }
    };
    EndScreenEventHandlers.openAppSheet = function (nativeBridge, t) {
        nativeBridge.AppSheet.present(t).then(function () {
            return nativeBridge.AppSheet.destroy(t);
        })["catch"](function (t) {
            var n = t[0], i = t[1];
            if ("APPSHEET_NOT_FOUND" === n) {
                return nativeBridge.AppSheet.prepare(i).then(function () {
                    var t = nativeBridge.AppSheet.onPrepared.subscribe(function () {
                        nativeBridge.AppSheet.present(i).then(function () {
                            nativeBridge.AppSheet.destroy(i);
                        }), nativeBridge.AppSheet.onPrepared.unsubscribe(t);
                    });
                });
            }
            throw [n, i];
        });
    };
    return EndScreenEventHandlers;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.eventhandlers.OverlayEventHandlers", function (require) {
    var ScreenOrientation = require("device.ScreenOrientation");
    var UIInterfaceOrientationMask = require("device.UIInterfaceOrientationMask");
    var Platform = require("platform.Platform");
    var FinishState = require("FinishState");
    var Double = require("util.Double");

    function OverlayEventHandlers() {
    }
    OverlayEventHandlers.onSkip = function (nativeBridge, sessionManager, adUnit) {
        nativeBridge.VideoPlayer.pause();
        adUnit.setVideoActive(false);
        adUnit.setFinishState(FinishState.SKIPPED);
        sessionManager.sendSkip(adUnit, adUnit.getVideoPosition());
        if(nativeBridge.getPlatform() === Platform.IOS){
            nativeBridge.IosAdUnit.setViews(["webview"])
        }else{
            nativeBridge.AndroidAdUnit.setViews(["webview"]);
        }
        if(nativeBridge.getPlatform() === Platform.ANDROID){
            nativeBridge.AndroidAdUnit.setOrientation(ScreenOrientation.SCREEN_ORIENTATION_FULL_SENSOR);
        }else if(nativeBridge.getPlatform() === Platform.IOS){
            nativeBridge.IosAdUnit.setSupportedOrientations(UIInterfaceOrientationMask.INTERFACE_ORIENTATION_MASK_ALL)
        }
        adUnit.getOverlay().hide();
        this.afterSkip(adUnit);
    };
    OverlayEventHandlers.afterSkip = function (adUnit) {
        adUnit.getEndScreen().show();
        adUnit.onNewAdRequestAllowed.trigger();
    };
    OverlayEventHandlers.onMute = function (nativeBridge, sessionManager, i, r) {
        nativeBridge.VideoPlayer.setVolume(new Double(r ? 0 : 1));
        sessionManager.sendMute(i, sessionManager.getSession(), r);
    };
    OverlayEventHandlers.onCallButton = function (nativeBridge, sessionManager, adUnit) {
        var url = adUnit.getVideoClickThroughURL();
        sessionManager.sendVideoClickTracking(adUnit, sessionManager.getSession());
        if(nativeBridge.getPlatform() === Platform.IOS){
            nativeBridge.UrlScheme.open(url)
        }else{
            nativeBridge.Intent.launch({
                action: "android.intent.action.VIEW",
                uri: url
            });
        }
    };
    return OverlayEventHandlers;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.eventhandlers.VastOverlayEventHandlers", function (require, t) {
    var OverlayEventHandlers = require("adunit.eventhandlers.OverlayEventHandlers");

    function VastOverlayEventHandlers() {
        OverlayEventHandlers.apply(this, arguments);
    }
    extend(VastOverlayEventHandlers, OverlayEventHandlers);
    VastOverlayEventHandlers.afterSkip = function (e) {
        e.hide();
    };

    return VastOverlayEventHandlers;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.eventhandlers.VastVideoEventHandlers", function (require) {
    var VideoEventHandlers = require("adunit.eventhandlers.VideoEventHandlers");

    function VastVideoEventHandlers() {
        VideoEventHandlers.apply(this, arguments);
    }
    extend(VastVideoEventHandlers, VideoEventHandlers);

    VastVideoEventHandlers.afterVideoCompleted = function (e, t) {
        t.hide();
    };

    return VastVideoEventHandlers;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.eventhandlers.VideoEventHandlers", function (require) {
    var ScreenOrientation = require("device.ScreenOrientation");
    var UIInterfaceOrientationMask = require("device.UIInterfaceOrientationMask");
    var Platform = require("platform.Platform");
    var AdsError = require("AdsError");
    var FinishState = require("FinishState");
    var StorageType = require("storage.StorageType");
    var Double = require("util.Double");
    var adUnitProperties = require("Properties").adUnit;

    function VideoEventHandlers() {
    }
    VideoEventHandlers.isVast = function (adUnit) {
        return void 0 !== adUnit.getVast;
    };
    VideoEventHandlers.onVideoPrepared = function (nativeBridge, adUnit, duration) {
        var me = this, overlay = adUnit.getOverlay();
        adUnit.setVideoDuration(duration);
        overlay.setVideoDuration(duration);
        if(adUnit.getVideoPosition() > 0 ){
            overlay.setVideoProgress(adUnit.getVideoPosition());
        }
        if(adUnit.getPlacement().allowSkip()){
            overlay.setSkipVisible(true);
        }
        overlay.setMuteEnabled(true);
        overlay.setVideoDurationEnabled(true);
        if(this.isVast(adUnit) && adUnit.getVideoClickThroughURL()){
            overlay.setCallButtonVisible(true);
        }
        nativeBridge.Storage.get(StorageType.PUBLIC, "test.debugOverlayEnabled.value").then(function (e) {
            if (e === true) {
                overlay.setDebugMessageVisible(true);
                var msg = me.isVast(adUnit) ? "Programmatic Ad" : "Performance Ad";
                overlay.setDebugMessage(msg);
            }
        });
        nativeBridge.VideoPlayer.setVolume(new Double(overlay.isMuted() ? 0 : 1)).then(function () {
            if(adUnit.getVideoPosition() > 0 ){
                nativeBridge.VideoPlayer.seekTo(adUnit.getVideoPosition()).then(function () {
                    nativeBridge.VideoPlayer.play();
                })
            }else{
                nativeBridge.VideoPlayer.play();
            }
        });
    };
    VideoEventHandlers.onVideoProgress = function (nativeBridge, sessionManager, adUnit, i) {
        sessionManager.sendProgress(adUnit, sessionManager.getSession(), i, adUnit.getVideoPosition());
        if (i > 0) {
            var r = adUnit.getVideoPosition();
            if(r > 0 && 100 > i - r ){
                adUnit.getOverlay().setSpinnerEnabled(true)
            }else{
                adUnit.getOverlay().setSpinnerEnabled(false);
            }
            var o = adUnit.getVideoQuartile();
            adUnit.setVideoPosition(i);
            if(0 === o && 1 === adUnit.getVideoQuartile() ){
                sessionManager.sendFirstQuartile(adUnit)
            }else if(1 === o && 2 === adUnit.getVideoQuartile() ){
                sessionManager.sendMidpoint(adUnit)
            }else if(2 === o && 3 === adUnit.getVideoQuartile() ){
                sessionManager.sendThirdQuartile(adUnit);
            }
        }
        adUnit.getOverlay().setVideoProgress(i);
    };
    VideoEventHandlers.onVideoStart = function (nativeBridge, sessionManager, adUnit) {
        sessionManager.sendImpressionEvent(adUnit);
        sessionManager.sendStart(adUnit);
        adUnit.getOverlay().setSpinnerEnabled(false);
        nativeBridge.VideoPlayer.setProgressEventInterval(250);
        if(0 === adUnit.getWatches()){
            nativeBridge.Listener.sendStartEvent(adUnit.getPlacement().getId());
        }
        adUnit.newWatch();
    };
    VideoEventHandlers.onVideoCompleted = function (nativeBridge, sessionManager, adUnit) {
        adUnit.setVideoActive(!1);
        adUnit.setFinishState(FinishState.COMPLETED);
        sessionManager.sendView(adUnit);
        if(nativeBridge.getPlatform() === Platform.IOS ){
            nativeBridge.IosAdUnit.setViews(["webview"])
        }else{
            nativeBridge.AndroidAdUnit.setViews(["webview"]);
        }
        this.afterVideoCompleted(nativeBridge, adUnit);
        nativeBridge.Storage.get(StorageType.PUBLIC, "integration_test.value").then(function (t) {
            if(t){
                if(nativeBridge.getPlatform() === Platform.ANDROID){
                    nativeBridge.rawInvoke(adUnitProperties.ANDROID_INTEGRATION_TEST_CLASS, "onVideoCompleted", [adUnit.getPlacement().getId()])
                }else{
                    nativeBridge.rawInvoke(adUnitProperties.IOS_INTEGRATION_TEST_CLASS, "onVideoCompleted", [adUnit.getPlacement().getId()]);
                }
            }
        });
    };
    VideoEventHandlers.onVideoError = function (nativeBridge, adUnit, i, a) {
        adUnit.setVideoActive(!1);
        adUnit.setFinishState(FinishState.ERROR);
        nativeBridge.Listener.sendErrorEvent(AdsError[AdsError.VIDEO_PLAYER_ERROR], "Video player error");
        if(nativeBridge.getPlatform() === Platform.IOS ){
            nativeBridge.Sdk.logError("SDK video player error");
            nativeBridge.IosAdUnit.setViews(["webview"]);
        }else{
            nativeBridge.Sdk.logError("video player error " + i + " " + a);
            nativeBridge.AndroidAdUnit.setViews(["webview"]);
        }
        adUnit.getOverlay().hide();
        var s = adUnit.getEndScreen();
        s && adUnit.getEndScreen().show();
        adUnit.onNewAdRequestAllowed.trigger();
    };
    VideoEventHandlers.afterVideoCompleted = function (nativeBridge, adUnit) {
        adUnit.getOverlay().hide();
        adUnit.getEndScreen().show();
        adUnit.onNewAdRequestAllowed.trigger();
        if(nativeBridge.getPlatform() === Platform.ANDROID){
            nativeBridge.AndroidAdUnit.setOrientation(ScreenOrientation.SCREEN_ORIENTATION_FULL_SENSOR)
        }else if(nativeBridge.getPlatform() === Platform.IOS ){
            nativeBridge.IosAdUnit.setSupportedOrientations(UIInterfaceOrientationMask.INTERFACE_ORIENTATION_MASK_ALL);
        }
    };

    return VideoEventHandlers;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.View", function (require) {
    var Tap = require("adunit.view.util.Tap");

    function View(id) {
        this._id = id;
    }
    View.prototype.render = function () {
        var me = this;
        this._container = document.createElement("div");
        this._container.id = this._id;
        this._container.innerHTML = this._template.render(this._templateData);
        this._bindings.forEach(function (interaction) {
            var els = me._container.querySelectorAll(interaction.selector);
            for (var i = 0; i < els.length; ++i) {
                var el = els[i];
                if("click" === interaction.event ){
                    interaction.tap = new Tap(el);
                }
                el.addEventListener(interaction.event, interaction.listener, false);
            }
        });
    };
    View.prototype.container = function () {
        return this._container;
    };
    View.prototype.show = function () {
        this._container.style.visibility = "visible";
    };
    View.prototype.hide = function () {
        this._container.style.visibility = "hidden";
    };
    return View;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.Privacy", function (require) {
    var View = require("adunit.view.View");
    var Observable = require("util.Observable");
    var Template = require("adunit.view.util.Template");

    var tpl = '' +
        '<div class="pop-up">\n' +
        '<% if(!data.isCoppaCompliant) { %>\n' +
        '<div class="privacy-text">\n' +
        'This advertisement has been served by OneWay SDK.\n' +
        'OneWay SDK collects and uses information gathered through your use of your apps in order to create an individualized and more relevant user experience, to predict your preferences, and to show you ads that are more likely to interest you (锟斤拷personalized ads锟斤拷).\n' +
        'Please read our <a href="https://unity3d.com/legal/privacy-policy">Privacy Policy</a> for a full description of our data practices.\n' +
        'You may be able to opt-out of OneWay SDK锟斤拷 collection and use of your mobile app data for personalized ads through your device settings.\n' +
        '</div>\n' +
        '<% } else { %>\n' +
        '<div class="privacy-simple-text">\n' +
        'This advertisement has been served by OneWay SDK. Please read our <a href="https://unity3d.com/legal/privacy-policy">Privacy Policy</a> for a full description of our data practices.\n' +
        '</div>\n' +
        '<% } %>\n' +
        '<div class="ok-button">Ok</div>\n' +
        '</div>\n';

    function Privacy(coppaCompliant) {
        var me = this;
        View.call(this, "privacy");
        this.onPrivacy = new Observable();
        this.onClose = new Observable();
        this._template = new Template(tpl);
        this._templateData = {
            isCoppaCompliant: coppaCompliant
        };
        this._bindings = [{
            event: "click",
            listener: function (e) {
                return me.onOkEvent(e);
            },
            selector: ".ok-button"
        }, {
            event: "click",
            listener: function (e) {
                return me.onPrivacyEvent(e);
            },
            selector: "a"
        }];
    }
    extend(Privacy, View);
    Privacy.prototype.onPrivacyEvent = function (e) {
        e.preventDefault();
        this.onPrivacy.trigger(e.target.href);
    };
    Privacy.prototype.onOkEvent = function (e) {
        e.preventDefault();
        this.onClose.trigger();
    };
    return Privacy;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.Overlay", function (require) {
    var View = require("adunit.view.View");
    var Template = require("adunit.view.util.Template");
    var Observable = require("util.Observable");

    var tpl = '<div class="skip-button">You can skip this video in <span class="skip-duration">0</span> seconds</div>\n' +
        '<div class="buffering-spinner">\n' +
        '   <div class="spinner-animation"></div>\n' +
        '   <div class="spinner-text">Buffering</div>\n' +
        '</div>\n' +
        '<div class="mute-button <%= data.muted ? \'muted\' : \'\' %>">\n' +
        '   <div class="mute-icon"><span class="icon-volume"></span></div>\n' +
        '   <div class="unmute-icon"><span class="icon-volume-mute"></span></div>\n' +
        '</div>\n' +
        '<div class="video-duration-text">This video ends in <span class="video-duration">0</span> seconds</div>\n' +
        '<div class="call-button">Learn More</div>\n' +
        '<div class="debug-message-text"></div>';

    function Overlay(muted) {
        var me = this;
        View.call(this, "overlay");
        this.onSkip = new Observable();
        this.onMute = new Observable();
        this.onCallButton = new Observable();
        this._spinnerEnabled = false;
        this._skipVisible = false;
        this._videoDurationEnabled = false;
        this._muteEnabled = false;
        this._debugMessageVisible = false;
        this._callButtonVisible = false;
        this._template = new Template(tpl);
        this._muted = muted;
        this._templateData = {
            muted: this._muted
        };
        this._bindings = [{
            event: "click",
            listener: function (e) {
                return me.onSkipEvent(e);
            },
            selector: ".skip-button"
        }, {
            event: "click",
            listener: function (e) {
                return me.onMuteEvent(e);
            },
            selector: ".mute-button"
        }, {
            event: "click",
            listener: function (e) {
                return me.onCallButtonEvent(e);
            },
            selector: ".call-button"
        }];
    }
    extend(Overlay, View);
    Overlay.prototype.render = function () {
        View.prototype.render.call(this);
        this._skipElement = this._container.querySelector(".skip-button");
        this._spinnerElement = this._container.querySelector(".buffering-spinner");
        this._skipDurationElement = this._container.querySelector(".skip-duration");
        this._videoDurationElement = this._container.querySelector(".video-duration-text");
        this._videoDurationCounterElement = this._container.querySelector(".video-duration");
        this._muteButtonElement = this._container.querySelector(".mute-button");
        this._debugMessageElement = this._container.querySelector(".debug-message-text");
        this._callButtonElement = this._container.querySelector(".call-button");
    };
    Overlay.prototype.setSpinnerEnabled = function (spinnerEnabled) {
        if(this._spinnerEnabled !== spinnerEnabled){
            this._spinnerEnabled = spinnerEnabled;
            this._spinnerElement.style.display = spinnerEnabled ? "block" : "none";
        }
    };
    Overlay.prototype.setSkipVisible = function (skipVisible) {
        if(this._skipVisible !== skipVisible){
            this._skipElement.style.display = skipVisible ? "block" : "none";
        }
    };
    Overlay.prototype.setSkipEnabled = function (skipEnabled) {
        if(this._skipEnabled !== skipEnabled ){
            this._skipEnabled = skipEnabled;
        }
    };
    Overlay.prototype.setSkipDuration = function (duration) {
        this._skipDuration = this._skipRemaining = 1000 * duration;
        this.setSkipText(duration);
    };
    Overlay.prototype.setVideoDurationEnabled = function (durationEnabled) {
        if(this._videoDurationEnabled !== durationEnabled ){
            this._videoDurationEnabled = durationEnabled;
            this._videoDurationElement.style.display = durationEnabled ? "block" : "none";
        }
    };
    Overlay.prototype.setVideoDuration = function (millisconds) {
        this._videoDuration = millisconds;
        this._videoDurationCounterElement.innerHTML = Math.round(millisconds / 1000).toString();
    };
    Overlay.prototype.setVideoProgress = function (playedMillisconds) {
        this._videoProgress = playedMillisconds;
        if(this._skipEnabled && this._skipRemaining > 0 ){
            this._skipRemaining = Math.round((this._skipDuration - playedMillisconds) / 1000);
            this.setSkipText(this._skipRemaining);
        }
        if(this._videoDuration > playedMillisconds ){
            this._videoDurationCounterElement.innerHTML = Math.round((this._videoDuration - playedMillisconds) / 1000).toString();
        }else{
            this._videoDurationCounterElement.innerHTML = "0";
        }
    };
    Overlay.prototype.setMuteEnabled = function (muteEnabled) {
        if(this._muteEnabled !== muteEnabled ){
            this._muteEnabled = muteEnabled;
            this._muteButtonElement.style.display = muteEnabled ? "block" : "none";
        }
    };
    Overlay.prototype.setDebugMessage = function (msg) {
        this._debugMessageElement.innerHTML = msg;
    };
    Overlay.prototype.setDebugMessageVisible = function (isVisible) {
        if(this._debugMessageVisible !== isVisible ){
            this._debugMessageElement.style.display = isVisible ? "block" : "none";
        }
    };
    Overlay.prototype.setCallButtonVisible = function (isVisible) {
        if(this._callButtonVisible !== isVisible ){
            this._callButtonElement.style.display = isVisible ? "block" : "none";
        }
    };
    Overlay.prototype.isMuted = function () {
        return this._muted;
    };
    Overlay.prototype.setSkipText = function (e) {
        if(0 >= e ){
            this._skipElement.innerHTML = "Skip Video"
        }else{
            this._skipDurationElement.innerHTML = e.toString();
        }
    };
    Overlay.prototype.onSkipEvent = function (e) {
        e.preventDefault();
        if(this._skipEnabled && this._videoProgress > this._skipDuration ){
            this.onSkip.trigger(this._videoProgress);
        }
    };
    Overlay.prototype.onMuteEvent = function (e) {
        e.preventDefault();
        if(this._muted){
            this._muteButtonElement.classList.remove("muted");
            this._muted = false;
        }else{
            this._muteButtonElement.classList.add("muted");
            this._muted = true;
        }
        this.onMute.trigger(this._muted);
    };
    Overlay.prototype.onCallButtonEvent = function (e) {
        e.preventDefault();
        this.onCallButton.trigger(true);
    };

    return Overlay;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.EndScreen", function (require) {
    var View = require("adunit.view.View");
    var Privacy = require("adunit.view.Privacy");
    var Template = require("adunit.view.util.Template");
    var Observable = require("util.Observable");

    var tpl = '<div class="btn-close-region">' +
        '   <a class="btn-close">' +
        '       <span class="icon-close"></span>' +
        '   </a>' +
        '</div>\n' +
        '<div class="campaign-container">\n' +
        '   <div class="game-background game-background-landscape" style="background-image: url(<%= data.endScreenLandscape %>)"></div>' +
        '   <div class="game-background game-background-portrait" style="background-image: url(<%= data.endScreenPortrait %>)"></div>\n' +
        '   <div class="end-screen-info-background">\n' +
        '       <div class="end-screen-stripe"></div>\n' +
        '       <div class="end-screen-info">\n' +
        '           <div class="game-info">\n' +
        '               <div class="game-icon" style="background-image: url(<%= data.gameIcon %>)"></div>\n' +
        '               <div class="name-container">Test<%= data.gameName %></div>\n' +
        '               <div class="name-container">OneWay</div>\n' +
        '           </div>\n' +
        '       <div class="store-container">\n' +
        '           <a class="store-button"></a>\n' +
        '           <div class="game-store-info">\n' +
        '               <span class="game-rating">\n' +
        '                   <span class="game-rating-mask" style="width: <%= data.rating %>%">\n' +
        '                   <% for (var i = 0; i < 5; i++) { %><span class="icon-star"></span><% } %>\n' +
        '                   </span>\n' +
        '                   <% for (var i = 0; i < 5; i++) { %>' +
        '                   <span class="icon-star"></span>' +
        '                   <% } %>\n' +
        '               </span>\n' +
        '               <br class="game-rating-br">\n' +
        '               <span class="game-rating-count">\n' +
        '                   (<span class="game-rating-count-number"><%= data.ratingCount %></span>' +
        '                   <span class="game-rating-postfix"> Ratings</span>)\n' +
        '               </span>\n' +
        '           </div>\n' +
        '       </div>\n' +
        '       <div class="download-container">\n' +
        '           <a class="btn-download">\n' +
        '               <span class="download-text">Download It!</span>\n' +
        '           </a>\n' +
        '       </div>\n' +
        '       <div class="store-badge-container">\n' +
        '           <a class="btn-store-badge"></a>\n' +
        '       </div>\n' +
        '       <div class="unityads-logo"></div>\n' +
        '   </div>\n' +
        '   <div class="privacy-button">' +
        '       <span class="icon-info"></span>' +
        '   </div>\n' +
        '</div>\n' +
        '</div>\n';

    function EndScreen(campaign, coppaCompliant) {
        var me = this;
        View.call(this, "end-screen");
        this.onDownload = new Observable();
        this.onPrivacy = new Observable();
        this.onClose = new Observable();
        this._coppaCompliant = coppaCompliant;
        this._gameName = campaign.getGameName();
        this._template = new Template(tpl);
        if (campaign) {
            var width = 20 * campaign.getRating();
            this._templateData = {
                gameName: campaign.getGameName(),
                gameIcon: campaign.getGameIcon(),
                endScreenLandscape: campaign.getLandscapeUrl(),
                endScreenPortrait: campaign.getPortraitUrl(),
                rating: width.toString(),
                ratingCount: campaign.getRatingCount().toString()
            };
        }
        this._bindings = [{
            event: "click",
            listener: function (e) {
                return me.onDownloadEvent(e);
            },
            selector: ".game-background, .btn-download, .store-button, .game-icon, .store-badge-container"
        }, {
            event: "click",
            listener: function (e) {
                return me.onCloseEvent(e);
            },
            selector: ".btn-close-region"
        }, {
            event: "click",
            listener: function (e) {
                return me.onPrivacyEvent(e);
            },
            selector: ".privacy-button"
        }];
    }
    extend(EndScreen, View);

    EndScreen.prototype.show = function () {
        View.prototype.show.call(this);
        var el = this._container.querySelector(".name-container");
        el.innerHTML = this._gameName + " ";
    };
    EndScreen.prototype.onDownloadEvent = function (e) {
        e.preventDefault();
        this.onDownload.trigger();
    };
    EndScreen.prototype.onCloseEvent = function (e) {
        e.preventDefault();
        this.onClose.trigger();
    };
    EndScreen.prototype.onPrivacyEvent = function (e) {
        var me = this;
        e.preventDefault();
        var privacy = new Privacy(this._coppaCompliant);
        privacy.render();
        document.body.appendChild(privacy.container());
        privacy.onPrivacy.subscribe(function (url) {
            me.onPrivacy.trigger(url);
        });
        privacy.onClose.subscribe(function () {
            privacy.hide();
            privacy.container().parentElement.removeChild(privacy.container());
        });
    };

    return EndScreen;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.util.Tap", function () {
    function Tap(elem) {
        var me = this;
        this._element = elem;
        this._moved = false;
        this._startX = 0;
        this._startY = 0;
        this._element.addEventListener("touchstart", function (e) {
            return me.onTouchStart(e);
        }, false);
    }
    Tap.prototype.onTouchStart = function (e) {
        var me = this;
        this._onTouchMoveListener = function (e) {
            return me.onTouchMove(e);
        };
        this._onTouchEndListener = function (e) {
            return me.onTouchEnd(e);
        };
        this._onTouchCancelListener = function (e) {
            return me.onTouchCancel(e);
        };
        this._element.addEventListener("touchmove", this._onTouchMoveListener, false);
        this._element.addEventListener("touchend", this._onTouchEndListener, false);
        this._element.addEventListener("touchcancel", this._onTouchCancelListener, false);
        this._moved = false;
        this._startX = e.touches[0].clientX;
        this._startY = e.touches[0].clientY;
    };
    Tap.prototype.onTouchMove = function (e) {
        var x = e.touches[0].clientX,
            y = e.touches[0].clientY;
        if(Math.abs(x - this._startX) > Tap._moveTolerance || Math.abs(y - this._startY) > Tap._moveTolerance){
            this._moved = true;
        }
    };
    Tap.prototype.onTouchEnd = function (e) {
        this._element.removeEventListener("touchmove", this._onTouchMoveListener, false);
        this._element.removeEventListener("touchend", this._onTouchEndListener, false);
        this._element.removeEventListener("touchcancel", this._onTouchCancelListener, false);
        this._onTouchMoveListener = void 0;
        this._onTouchEndListener = void 0;
        this._onTouchCancelListener = void 0;

        if (!this._moved) {
            var t = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            e.stopPropagation();
            if(!e.target.dispatchEvent(t)){
                e.preventDefault();
            }
        }
    };
    Tap.prototype.onTouchCancel = function (e) {
        this._moved = false;
        this._startX = 0;
        this._startY = 0;
    };
    Tap._moveTolerance = 10;

    return Tap;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.util.Template", function () {
    function Template(str) {
        var me = this,
            i = 0,
            body = "__p+='";

        str.replace(Template._matcher, function (matchText, subText, index, s) {
            body += str.slice(i, s).replace(Template._escapeRegExp, Template._escapeChar);
            i = s + matchText.length;
            if(subText){
                body += "'+\n((__t=(" + subText + "))==null?'':__t)+\n'"
            }else if(index){
                body += "';\n" + index + "\n__p+='";
            }
            return matchText;
        });
        body += "';\n";
        body = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + body + "return __p;\n";
        try {
            var fn = new Function("data", body);
            this._templateFunction = function (data) {
                return fn.call(me, data);
            };
        } catch (e) {
            e.source = body;
            throw e;
        }
    }
    Template.prototype.render = function (data) {
        return this._templateFunction(data);
    };
    Template._matcher = /<%=([\s\S]+?)%>|<%([\s\S]+?)%>|$/g;
    Template._escapes = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
    };
    Template._escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
    Template._escapeChar = function (char) {
        return "\\" + Template._escapes[char];
    };

    return Template;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.vast.Vast", function () {

    function Vast(ads, urlTemplates, additionalTrackingEvents) {
        this._ads = ads;
        this._errorURLTemplates = urlTemplates;
        this._additionalTrackingEvents = additionalTrackingEvents;
    }
    Vast.prototype.getAds = function () {
        return this._ads;
    };
    Vast.prototype.getErrorURLTemplates = function () {
        var ad = this.getAd();
        if (ad) {
            var templates = ad.getErrorURLTemplates();
            if (templates instanceof Array){
                return templates.concat(this._errorURLTemplates || []);
            }
        }
        return this._errorURLTemplates;
    };
    Vast.prototype.getAd = function () {
        if(this.getAds() && this.getAds().length > 0){
            return this.getAds()[0];
        }else{
            return null;
        }
    };
    Vast.prototype.getVideoUrl = function () {
        var ad = this.getAd();
        if (ad) {
            var creatives = ad.getCreatives();
            for (var i = 0;  i < creatives.length; i++) {
                var creative = creatives[i], files = creative.getMediaFiles();
                for (var  j = 0; j < files.length; j++) {
                    var file = files[j],
                        isPlayable = this.isPlayableMIMEType(file.getMIMEType());
                    if (file.getFileURL() && isPlayable){
                        return file.getFileURL();
                    }
                }
            }
        }
        return null;
    };
    Vast.prototype.getImpressionUrls = function () {
        var ad = this.getAd();
        return ad ? ad.getImpressionURLTemplates() : [];
    };
    Vast.prototype.getTrackingEventUrls = function (e) {
        var ad = this.getAd();
        if (ad) {
            var urls = ad.getTrackingEventUrls(e),
                additionalUrls = [];
            if(this._additionalTrackingEvents ){
                additionalUrls = this._additionalTrackingEvents[e] || [];
            }
            return urls instanceof Array ? urls.concat(additionalUrls) : additionalUrls;
        }
        return null;
    };
    //逻辑有点问题 重置了?
    Vast.prototype.addTrackingEventUrl = function (event, url) {
        if(!this._additionalTrackingEvents){
            this._additionalTrackingEvents = {};
        }
        if(!this._additionalTrackingEvents[event]){
            this._additionalTrackingEvents[event] = [];
        }
        this._additionalTrackingEvents[event].push(url);
    };
    Vast.prototype.getDuration = function () {
        var ad = this.getAd();
        return ad ? ad.getDuration() : null;
    };
    Vast.prototype.getWrapperURL = function () {
        var ad = this.getAd();
        return ad ? ad.getWrapperURL() : null;
    };
    Vast.prototype.getVideoClickThroughURL = function () {
        var ad = this.getAd();
        return ad ? ad.getVideoClickThroughURLTemplate() : null;
    };
    Vast.prototype.getVideoClickTrackingURLs = function () {
        var ad = this.getAd();
        return ad ? ad.getVideoClickTrackingURLTemplates() : null;
    };
    Vast.prototype.isPlayableMIMEType = function (mimeType) {
        var mime = "video/mp4";
        return mimeType === mime;
    };

    return Vast;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.vast.VastAd", function (require) {
    var VastCreativeLinear = require("adunit.vast.VastCreativeLinear");

    function VastAd(id, creatives, errorURLTemplates, impressionURLTemplates, wrapperURLs) {
        this._id = id;
        this._creatives = creatives || [];
        this._errorURLTemplates = errorURLTemplates || [];
        this._impressionURLTemplates = impressionURLTemplates || [];
        this._wrapperURLs = wrapperURLs || [];
    }
    VastAd.prototype.getId = function () {
        return this._id;
    };
    VastAd.prototype.setId = function (id) {
        this._id = id;
    };
    VastAd.prototype.getCreatives = function () {
        return this._creatives;
    };
    VastAd.prototype.getCreative = function () {
        if(this.getCreatives() && this.getCreatives().length > 0){
            return this.getCreatives()[0];
        }else{
            return null;
        }
    };
    VastAd.prototype.addCreative = function (creative) {
        this._creatives.push(creative);
    };
    VastAd.prototype.getErrorURLTemplates = function () {
        return this._errorURLTemplates;
    };
    VastAd.prototype.addErrorURLTemplate = function (template) {
        this._errorURLTemplates.push(template);
    };
    VastAd.prototype.getImpressionURLTemplates = function () {
        return this._impressionURLTemplates;
    };
    VastAd.prototype.addImpressionURLTemplate = function (template) {
        this._impressionURLTemplates.push(template);
    };
    VastAd.prototype.getWrapperURL = function () {
        return this._wrapperURLs[0];
    };
    VastAd.prototype.addWrapperURL = function (url) {
        this._wrapperURLs.push(url);
    };
    VastAd.prototype.getTrackingEventUrls = function (eventName) {
        var creative = this.getCreative();
        if(creative && creative.getTrackingEvents()){
            return creative.getTrackingEvents()[eventName];
        }else{
            return null;
        }
    };
    VastAd.prototype.getDuration = function () {
        var creative = this.getCreative();
        if(creative){
            return creative.getDuration()
        }else{
            return null;
        }
    };
    VastAd.prototype.getVideoClickThroughURLTemplate = function () {
        var creative = this.getCreative();
        if(creative instanceof VastCreativeLinear){
            return creative.getVideoClickThroughURLTemplate();
        }else{
            return null;
        }
    };
    VastAd.prototype.getVideoClickTrackingURLTemplates = function () {
        var creative = this.getCreative();
        if(creative instanceof VastCreativeLinear){
            return creative.getVideoClickTrackingURLTemplates()
        } else{
            null;
        }
    };
    VastAd.prototype.addVideoClickTrackingURLTemplate = function (e) {
        var creative = this.getCreative();
        if(creative instanceof VastCreativeLinear ){
            creative.addVideoClickTrackingURLTemplate(e);
        }
    };

    return VastAd;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.vast.VastCreative", function () {
    function VastCreative(type, events) {
        this._type = type;
        this._trackingEvents = events || {};
    }
    VastCreative.prototype.getType = function () {
        return this._type;
    };
    VastCreative.prototype.getTrackingEvents = function () {
        return this._trackingEvents;
    };
    VastCreative.prototype.addTrackingEvent = function (eventName, eventHandler) {
        if(null == this._trackingEvents[eventName] ){
            this._trackingEvents[eventName] = [];
        }
        this._trackingEvents[eventName].push(eventHandler);
    };
    return VastCreative;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.vast.VastCreativeLinear", function (require) {
    var VastCreative = require("adunit.vast.VastCreative");

    function VastCreativeLinear(t, n, i, r, o, a, s) {
        VastCreative.call(this, "linear");
        this._duration = t || 0;
        this._skipDelay = n || null;
        this._mediaFiles = i || [];
        this._videoClickThroughURLTemplate = r || null;
        this._videoClickTrackingURLTemplates = o || [];
        this._videoCustomClickURLTemplates = a || [];
        this._adParameters = s || null;
    }
    extend(VastCreativeLinear, VastCreative);

    VastCreativeLinear.prototype.getDuration = function () {
        return this._duration;
    };
    VastCreativeLinear.prototype.setDuration = function (e) {
        this._duration = e;
    };
    VastCreativeLinear.prototype.getSkipDelay = function () {
        return this._skipDelay;
    };
    VastCreativeLinear.prototype.setSkipDelay = function (e) {
        this._skipDelay = e;
    };
    VastCreativeLinear.prototype.getMediaFiles = function () {
        return this._mediaFiles;
    };
    VastCreativeLinear.prototype.addMediaFile = function (e) {
        this._mediaFiles.push(e);
    };
    VastCreativeLinear.prototype.getVideoClickThroughURLTemplate = function () {
        return this._videoClickThroughURLTemplate;
    };
    VastCreativeLinear.prototype.setVideoClickThroughURLTemplate = function (e) {
        this._videoClickThroughURLTemplate = e;
    };
    VastCreativeLinear.prototype.getVideoClickTrackingURLTemplates = function () {
        return this._videoClickTrackingURLTemplates;
    };
    VastCreativeLinear.prototype.addVideoClickTrackingURLTemplate = function (e) {
        this._videoClickTrackingURLTemplates.push(e);
    };
    VastCreativeLinear.prototype.getVideoCustomClickURLTemplates = function () {
        return this._videoCustomClickURLTemplates;
    };
    VastCreativeLinear.prototype.getAdParameters = function () {
        return this._adParameters;
    };

    return VastCreativeLinear;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.vast.VastMediaFile", function () {
    function VastMediaFile(fileURL, deliveryType, codec, mimeType, bitrate, minBitrate, maxBitrate, width, height) {
        this._fileURL = fileURL || null;
        this._deliveryType = deliveryType || "progressive";
        this._mimeType = mimeType || null;
        this._codec = codec || null;
        this._bitrate = bitrate || 0;
        this._minBitrate = minBitrate || 0;
        this._maxBitrate = maxBitrate || 0;
        this._width = width || 0;
        this._height = height || 0;
        this._apiFramework = null;
        this._scalable = null;
        this._maintainAspectRatio = null;
    }
    VastMediaFile.prototype.getFileURL = function () {
        return this._fileURL;
    };
    VastMediaFile.prototype.getMIMEType = function () {
        return this._mimeType;
    };
    return VastMediaFile;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AndroidAdUnitApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

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

        this.onStart = new Observable();
        this.onCreate = new Observable();
        this.onResume = new Observable();
        this.onDestroy = new Observable();
        this.onPause = new Observable();
        this.onKeyDown = new Observable();
        this.onRestore = new Observable();
        this.onStop = new Observable();
    }
    extend(AndroidAdUnitApi, NativeApi);

    AndroidAdUnitApi.prototype.open = function (activityId, views, orientation, keyevents, systemUiVisibility, hardwareAcceleration) {
        void 0 === keyevents && (keyevents = null);
        void 0 === systemUiVisibility && (systemUiVisibility = 0);
        void 0 === hardwareAcceleration && (hardwareAcceleration = true);
        return this._nativeBridge.invoke(this._apiClass, "open", [activityId, views, orientation, keyevents, systemUiVisibility, hardwareAcceleration]);
    };
    AndroidAdUnitApi.prototype.close = function () {
        return this._nativeBridge.invoke(this._apiClass, "close");
    };
    AndroidAdUnitApi.prototype.setViews = function (views) {
        return this._nativeBridge.invoke(this._apiClass, "setViews", [views]);
    };
    AndroidAdUnitApi.prototype.getViews = function () {
        return this._nativeBridge.invoke(this._apiClass, "getViews");
    };
    AndroidAdUnitApi.prototype.setOrientation = function (orientation) {
        return this._nativeBridge.invoke(this._apiClass, "setOrientation", [orientation]);
    };
    AndroidAdUnitApi.prototype.getOrientation = function () {
        return this._nativeBridge.invoke(this._apiClass, "getOrientation");
    };
    AndroidAdUnitApi.prototype.setKeepScreenOn = function (isOn) {
        return this._nativeBridge.invoke(this._apiClass, "setKeepScreenOn", [isOn]);
    };
    AndroidAdUnitApi.prototype.setSystemUiVisibility = function (visible) {
        return this._nativeBridge.invoke(this._apiClass, "setSystemUiVisibility", [visible]);
    };
    AndroidAdUnitApi.prototype.setKeyEventList = function (list) {
        return this._nativeBridge.invoke(this._apiClass, "setKeyEventList", [list]);
    };
    AndroidAdUnitApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case Event[Event.ON_START]:
                this.onStart.trigger(args[0]);
                break;

            case Event[Event.ON_CREATE]:
                this.onCreate.trigger(args[0]);
                break;

            case Event[Event.ON_RESUME]:
                this.onResume.trigger(args[0]);
                break;

            case Event[Event.ON_DESTROY]:
                this.onDestroy.trigger(args[0], args[1]);
                break;

            case Event[Event.ON_PAUSE]:
                this.onPause.trigger(args[0], args[1]);
                break;

            case Event[Event.KEY_DOWN]:
                this.onKeyDown.trigger(args[0], args[1], args[2], args[3], args[4]);
                break;

            case Event[Event.ON_RESTORE]:
                this.onRestore.trigger(args[0]);
                break;

            case Event[Event.ON_STOP]:
                this.onStop.trigger(args[0]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, args);
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
    AndroidDeviceInfoApi.prototype.isAppInstalled = function (isInstalled) {
        return this._nativeBridge.invoke(this._apiClass, "isAppInstalled", [isInstalled]);
    };
    AndroidDeviceInfoApi.prototype.getInstalledPackages = function (packages) {
        return this._nativeBridge.invoke(this._apiClass, "getInstalledPackages", [packages]);
    };
    AndroidDeviceInfoApi.prototype.getSystemProperty = function (propertyName, defaultValue) {
        return this._nativeBridge.invoke(this._apiClass, "getSystemProperty", [propertyName, defaultValue]);
    };
    AndroidDeviceInfoApi.prototype.getRingerMode = function () {
        return this._nativeBridge.invoke(this._apiClass, "getRingerMode");
    };
    AndroidDeviceInfoApi.prototype.getDeviceVolume = function (streamType) {
        return this._nativeBridge.invoke(this._apiClass, "getDeviceVolume", [streamType]);
    };
    AndroidDeviceInfoApi.prototype.getFreeSpace = function (storageType) {
        return this._nativeBridge.invoke(this._apiClass, "getFreeSpace", [AndroidStorageType[storageType]]);
    };
    AndroidDeviceInfoApi.prototype.getTotalSpace = function (storageType) {
        return this._nativeBridge.invoke(this._apiClass, "getTotalSpace", [AndroidStorageType[storageType]]);
    };

    return AndroidDeviceInfoApi;
});


/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.AndroidVideoPlayerApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.INFO = 0] = "INFO";

    function AndroidVideoPlayerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "VideoPlayer");
        this.onInfo = new Observable();
    }
    extend(AndroidVideoPlayerApi, NativeApi);

    AndroidVideoPlayerApi.prototype.setInfoListenerEnabled = function (enabled) {
        return this._nativeBridge.invoke(this._apiClass, "setInfoListenerEnabled", [enabled]);
    };
    AndroidVideoPlayerApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case Event[Event.INFO]:
                this.onInfo.trigger(args[0], args[1], args[2]);
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

CMD.register("api.AppSheetApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");
    var AppSheetEvent = require("appsheet.AppSheetEvent");


    function AppSheetApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "AppSheet");

        this.onPrepared = new Observable();
        this.onOpen = new Observable();
        this.onClose = new Observable();
        this.onError = new Observable();
    }
    extend(AppSheetApi, NativeApi);

    AppSheetApi.prototype.canOpen = function () {
        return this._nativeBridge.invoke(this._apiClass, "canOpen");
    };
    /**
     *
     * @param parameters {Object}
     * @param timeout    {Number}
     * @returns {Promise}
     */
    AppSheetApi.prototype.prepare = function (parameters, timeout) {
        void 0 === timeout && (timeout = 3e4);
        return this._nativeBridge.invoke(this._apiClass, "prepare", [parameters, timeout]);
    };
    /**
     *
     * @param parameters {Object}
     * @param animated   {Number}
     * @returns {Promise}
     */
    AppSheetApi.prototype.present = function (parameters, animated) {
        void 0 === animated && (animated = true);
        return this._nativeBridge.invoke(this._apiClass, "present", [parameters, animated]);
    };
    /**
     *
     * @param parameters {Object}
     * @returns {Promise}
     */
    AppSheetApi.prototype.destroy = function (parameters) {
        if("undefined" == typeof parameters){
            return this._nativeBridge.invoke(this._apiClass, "destroy");
        }else{
            return this._nativeBridge.invoke(this._apiClass, "destroy", [parameters]);
        }
    };
    /**
     *
     * @param timeout {Number}
     * @returns {Promise}
     */
    AppSheetApi.prototype.setPrepareTimeout = function (timeout) {
        return this._nativeBridge.invoke(this._apiClass, "setPrepareTimeout", [timeout]);
    };
    AppSheetApi.prototype.getPrepareTimeout = function () {
        return this._nativeBridge.invoke(this._apiClass, "getPrepareTimeout");
    };
    AppSheetApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case AppSheetEvent[AppSheetEvent.PREPARED]:
                this.onPrepared.trigger(args[0]);
                break;

            case AppSheetEvent[AppSheetEvent.OPENED]:
                this.onOpen.trigger(args[0]);
                break;

            case AppSheetEvent[AppSheetEvent.CLOSED]:
                this.onClose.trigger(args[0]);
                break;

            case AppSheetEvent[AppSheetEvent.FAILED]:
                this.onError.trigger(args[0], args[1]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, args);
        }
    };

    return AppSheetApi;
});

/**
 * Created by duo on 2016/8/31.
 *
 * Android only
 */
CMD.register("api.BroadcastApi", function(require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.ACTION = 0] = "ACTION";


    function BroadcastApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Broadcast");
        this.onBroadcastAction = new Observable();
    }
    extend(BroadcastApi, NativeApi);
    BroadcastApi.prototype.addBroadcastListener = function (name, actions) {
        return this._nativeBridge.invoke(this._apiClass, "addBroadcastListener", [name, actions]);
    };
    BroadcastApi.prototype.addDataSchemeBroadcastListener = function (name, scheme, actions) {
        return this._nativeBridge.invoke(this._apiClass, "addBroadcastListener", [name, scheme, actions]);
    };
    BroadcastApi.prototype.removeBroadcastListener = function (name) {
        return this._nativeBridge.invoke(this._apiClass, "removeBroadcastListener", [name]);
    };
    BroadcastApi.prototype.removeAllBroadcastListeners = function () {
        return this._nativeBridge.invoke(this._apiClass, "removeAllBroadcastListeners", []);
    };
    BroadcastApi.prototype.handleEvent = function (e, args) {
        if(e === Event[Event.ACTION]){
            //name action data extra
            this.onBroadcastAction.trigger(args[0], args[1], args[2], args[3])
        }else{
            NativeApi.prototype.handleEvent.call(this, e, args);
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

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("api.ConnectivityApi", function(require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.CONNECTED = 0] = "CONNECTED";
    Event[Event.DISCONNECTED = 1] = "DISCONNECTED";
    Event[Event.NETWORK_CHANGE = 2] = "NETWORK_CHANGE";

    function ConnectivityApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Connectivity");
        this.onConnected = new Observable();
        this.onDisconnected = new Observable();
    }
    extend(ConnectivityApi, NativeApi);

    /**
     *
     * @param monitoring {Boolean}
     * @returns {Promise}
     */
    ConnectivityApi.prototype.setListeningStatus = function (monitoring) {
        return this._nativeBridge.invoke(this._apiClass, "setConnectionMonitoring", [monitoring]);
    };
    ConnectivityApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case Event[Event.CONNECTED]:
                this.onConnected.trigger(args[0], args[1]);
                break;

            case Event[Event.DISCONNECTED]:
                this.onDisconnected.trigger();
                break;

            case Event[Event.NETWORK_CHANGE]:
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, args);
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
    DeviceInfoApi.prototype.getTimeZone = function (dayLight) {
        return this._nativeBridge.invoke(this._apiClass, "getTimeZone", [dayLight]);
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

    IntentApi.prototype.launch = function (intentData) {
        return this._nativeBridge.invoke(this._apiClass, "launch", [intentData]);
    };
    return IntentApi;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.IosAdUnitApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.VIEW_CONTROLLER_INIT = 0] = "VIEW_CONTROLLER_INIT";
    Event[Event.VIEW_CONTROLLER_DID_LOAD = 1] = "VIEW_CONTROLLER_DID_LOAD";
    Event[Event.VIEW_CONTROLLER_DID_APPEAR = 2] = "VIEW_CONTROLLER_DID_APPEAR";
    Event[Event.VIEW_CONTROLLER_WILL_DISAPPEAR = 3] = "VIEW_CONTROLLER_WILL_DISAPPEAR";
    Event[Event.VIEW_CONTROLLER_DID_DISAPPEAR = 4] = "VIEW_CONTROLLER_DID_DISAPPEAR";
    Event[Event.VIEW_CONTROLLER_DID_RECEIVE_MEMORY_WARNING = 5] = "VIEW_CONTROLLER_DID_RECEIVE_MEMORY_WARNING";

    function IosAdUnitApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "AdUnit");

        this.onViewControllerInit = new Observable();
        this.onViewControllerDidLoad = new Observable();
        this.onViewControllerDidAppear = new Observable();
        this.onViewControllerWillDisappear = new Observable();
        this.onViewControllerDidDisappear = new Observable();
        this.onViewControllerDidReceiveMemoryWarning = new Observable();
    }
    extend(IosAdUnitApi, NativeApi);
    /**
     *
     * @param views                 {Array}
     * @param supportedOrientations {Number}
     * @param statusBarHidden       {Number}
     * @param shouldAutorotate      {Number}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.open = function (views, supportedOrientations, statusBarHidden, shouldAutorotate) {
        return this._nativeBridge.invoke(this._apiClass, "open", [views, supportedOrientations, statusBarHidden, shouldAutorotate]);
    };
    IosAdUnitApi.prototype.close = function () {
        return this._nativeBridge.invoke(this._apiClass, "close");
    };
    /**
     *
     * @param views {Array}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.setViews = function (views) {
        return this._nativeBridge.invoke(this._apiClass, "setViews", [views]);
    };
    IosAdUnitApi.prototype.getViews = function () {
        return this._nativeBridge.invoke(this._apiClass, "getViews");
    };
    /**
     *
     * @param orientations {Number}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.setSupportedOrientations = function (orientations) {
        return this._nativeBridge.invoke(this._apiClass, "setSupportedOrientations", [orientations]);
    };
    IosAdUnitApi.prototype.getSupportedOrientations = function () {
        return this._nativeBridge.invoke(this._apiClass, "getSupportedOrientations");
    };
    /**
     *
     * @param screenOn {Number}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.setKeepScreenOn = function (screenOn) {
        return this._nativeBridge.invoke(this._apiClass, "setKeepScreenOn", [screenOn]);
    };
    /**
     *
     * @param hidden {Number}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.setStatusBarHidden = function (hidden) {
        return this._nativeBridge.invoke(this._apiClass, "setStatusBarHidden", [hidden]);
    };
    IosAdUnitApi.prototype.getStatusBarHidden = function () {
        return this._nativeBridge.invoke(this._apiClass, "getStatusBarHidden");
    };
    /**
     *
     * @param autorotate {Number}
     * @returns {Promise}
     */
    IosAdUnitApi.prototype.setShouldAutorotate = function (autorotate) {
        return this._nativeBridge.invoke(this._apiClass, "setShouldAutorotate", [autorotate]);
    };
    IosAdUnitApi.prototype.getShouldAutorotate = function () {
        return this._nativeBridge.invoke(this._apiClass, "getShouldAutorotate");
    };
    IosAdUnitApi.prototype.handleEvent = function (e, args) {
        switch (e) {
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
                NativeApi.prototype.handleEvent.call(this, e, args);
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
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.LIKELY_TO_KEEP_UP = 0] = "LIKELY_TO_KEEP_UP";
    Event[Event.BUFFER_EMPTY = 1] = "BUFFER_EMPTY";
    Event[Event.BUFFER_FULL = 2] = "BUFFER_FULL";

    function IosVideoPlayerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "VideoPlayer");
        this.onLikelyToKeepUp = new Observable();
        this.onBufferEmpty = new Observable();
        this.onBufferFull = new Observable();
    }
    extend(IosVideoPlayerApi, NativeApi);

    IosVideoPlayerApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case Event[Event.LIKELY_TO_KEEP_UP]:
                this.onLikelyToKeepUp.trigger(args[0], args[1]);
                break;

            case Event[Event.BUFFER_EMPTY]:
                this.onBufferEmpty.trigger(args[0], args[1]);
                break;

            case Event[Event.BUFFER_FULL]:
                this.onBufferFull.trigger(args[0], args[1]);
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
    var FinishState = require("FinishState");

    function ListenerApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Listener");
    }
    extend(ListenerApi, NativeApi);
    /**
     *
     * @param placementId {String}
     * @returns {Promise}
     */
    ListenerApi.prototype.sendReadyEvent = function (placementId) {
        return this._nativeBridge.invoke(this._apiClass, "sendReadyEvent", [placementId]);
    };
    /**
     *
     * @param placementId {String}
     * @returns {Promise}
     */
    ListenerApi.prototype.sendStartEvent = function (placementId) {
        return this._nativeBridge.invoke(this._apiClass, "sendStartEvent", [placementId]);
    };
    /**
     * 
     * @param placementId {String}
     * @param resultState {String}
     * @returns {Promise}
     */
    ListenerApi.prototype.sendFinishEvent = function (placementId, resultState) {
        return this._nativeBridge.invoke(this._apiClass, "sendFinishEvent", [placementId, FinishState[resultState]]);
    };
    /**
     *
     * @param error {String} AdsErrorCode
     * @param message {String}
     * @returns {Promise}
     */
    ListenerApi.prototype.sendErrorEvent = function (error, message) {
        return this._nativeBridge.invoke(this._apiClass, "sendErrorEvent", [error, message]);
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
    NativeApi.prototype.handleEvent = function (e, args) {
        throw new Error(this._apiClass + " event " + e + " does not have an observable");
    };
    return NativeApi;
});

/**
 * Created by duo on 2016/8/31.
 *
 * iOS only
 */

CMD.register("api.NotificationApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var Observable = require("util.Observable");

    var Event = {};
    Event[Event.ACTION = 0] = "ACTION";

    function NotificationApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Notification");
        this.onNotification = new Observable();
    }
    extend(NotificationApi, NativeApi);

    NotificationApi.prototype.addNotificationObserver = function (name, userInfoKeys) {
        return this._nativeBridge.invoke(this._apiClass, "addNotificationObserver", [name, userInfoKeys]);
    };
    NotificationApi.prototype.removeNotificationObserver = function (name) {
        return this._nativeBridge.invoke(this._apiClass, "removeNotificationObserver", [name]);
    };
    NotificationApi.prototype.removeAllNotificationObservers = function () {
        return this._nativeBridge.invoke(this._apiClass, "removeAllNotificationObservers");
    };
    NotificationApi.prototype.handleEvent = function (e, args) {
        switch (e) {
            case Event[Event.ACTION]:
                // name info
                this.onNotification.trigger(args[0], args[1]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, args);
        }
    };
    return NotificationApi;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.PlacementApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var PlacementState = require("placement.PlacementState");

    function PlacementApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Placement");
    }
    extend(PlacementApi, NativeApi);

    /**
     *
     * @param placement {String}
     * @returns {Promise}
     */
    PlacementApi.prototype.setDefaultPlacement = function (placement) {
        return this._nativeBridge.invoke(this._apiClass, "setDefaultPlacement", [placement]);
    };
    /**
     *
     * @param placement {String}
     * @param placementState {Number}
     * @returns {*}
     */
    PlacementApi.prototype.setPlacementState = function (placement, placementState) {
        return this._nativeBridge.invoke(this._apiClass, "setPlacementState", [placement, PlacementState[placementState]]);
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
                //id url response responseCode headers
                this.onComplete.trigger(arg[0], arg[1], arg[2], arg[3], arg[4]);
                break;

            case RequestEvent[RequestEvent.FAILED]:
                //id url errorMsg
                this.onFailed.trigger(arg[0], arg[1], arg[2]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, arg);
        }
    };
    return RequestApi;
});
/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.ResolveApi", function (require) {
    var NativeApi = require("api.NativeApi");
    var ResolveEvent = require("resolve.ResolveEvent");
    var Observable = require("util.Observable");

    function ResolveApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "Resolve");
        this.onComplete = new Observable();
        this.onFailed = new Observable();
    }
    extend(ResolveApi, NativeApi);

    /**
     *
     * @param id    {String}
     * @param host  {String}
     * @returns {Promise}
     */
    ResolveApi.prototype.resolve = function (id, host) {
        return this._nativeBridge.invoke(this._apiClass, "resolve", [id, host]);
    };
    ResolveApi.prototype.handleEvent = function (e, arg) {
        switch (e) {
            case ResolveEvent[ResolveEvent.COMPLETE]:
                this.onComplete.trigger(arg[0], arg[1], arg[2]);
                break;

            case ResolveEvent[ResolveEvent.FAILED]:
                this.onFailed.trigger(arg[0], arg[1], arg[2], arg[3]);
                break;

            default:
                NativeApi.prototype.handleEvent.call(this, e, arg);
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

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("api.UrlSchemeApi", function (require) {
    var NativeApi = require("api.NativeApi");

    function UrlSchemeApi(nativeBridge) {
        NativeApi.call(this, nativeBridge, "UrlScheme");
    }
    extend(UrlSchemeApi, NativeApi);

    UrlSchemeApi.prototype.open = function (url) {
        return this._nativeBridge.invoke(this._apiClass, "open", [url]);
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
    var Observable =            require("util.Observable");
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
        this.onError = new Observable();
        this.onProgress = new Observable();
        this.onCompleted = new Observable();
        this.onPrepared = new Observable();
        this.onPlay = new Observable();
        this.onPause = new Observable();
        this.onSeek = new Observable();
        this.onStop = new Observable();

        if(nativeBridge.getPlatform() === Platform.IOS){
            this.Ios = new IosVideoPlayerApi(nativeBridge);
        }else if(nativeBridge.getPlatform() === Platform.ANDROID){
            this.Android = new AndroidVideoPlayerApi(nativeBridge);
        }
    }
    extend(VideoPlayerApi, NativeApi);

    /**
     *
     * @param milliseconds {Number}
     * @returns {Promise}
     */
    VideoPlayerApi.prototype.setProgressEventInterval = function (milliseconds) {
        return this._nativeBridge.invoke(this._apiClass, "setProgressEventInterval", [milliseconds]);
    };
    VideoPlayerApi.prototype.getProgressEventInterval = function () {
        return this._nativeBridge.invoke(this._apiClass, "getProgressEventInterval");
    };
    /**
     *
     * @param url           {String}
     * @param initialVolume {Double}
     * @returns {Promise}
     */
    VideoPlayerApi.prototype.prepare = function (url, initialVolume) {
        return this._nativeBridge.invoke(this._apiClass, "prepare", [url, initialVolume]);
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
    /**
     *
     * @param time {Number}
     * @returns {Promise}
     */
    VideoPlayerApi.prototype.seekTo = function (time) {
        return this._nativeBridge.invoke(this._apiClass, "seekTo", [time]);
    };
    VideoPlayerApi.prototype.getCurrentPosition = function () {
        return this._nativeBridge.invoke(this._apiClass, "getCurrentPosition");
    };
    VideoPlayerApi.prototype.getVolume = function () {
        return this._nativeBridge.invoke(this._apiClass, "getVolume");
    };
    /**
     *
     * @param volume {Double}
     * @returns {Promise}
     */
    VideoPlayerApi.prototype.setVolume = function (volume) {
        return this._nativeBridge.invoke(this._apiClass, "setVolume", [volume]);
    };
    VideoPlayerApi.prototype.handleEvent = function (e, arg) {
        switch (e) {
            case Event[Event.GENERIC_ERROR]:
                this.onError.trigger(arg[0], arg[1], arg[2]);
                break;

            case Event[Event.PROGRESS]:
                this.onProgress.trigger(arg[0]);
                break;

            case Event[Event.COMPLETED]:
                this.onCompleted.trigger(arg[0]);
                break;

            case Event[Event.PREPARED]:
                this.onPrepared.trigger(arg[0], arg[1], arg[2], arg[3]);
                break;

            case Event[Event.PLAY]:
                this.onPlay.trigger(arg[0]);
                break;

            case Event[Event.PAUSE]:
                this.onPause.trigger(arg[0]);
                break;

            case Event[Event.SEEKTO]:
                this.onSeek.trigger(arg[0]);
                break;

            case Event[Event.STOP]:
                this.onStop.trigger(arg[0]);
                break;

            default:
                if(this._nativeBridge.getPlatform() === Platform.IOS){
                    this.Ios.handleEvent(e, arg);
                }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
                    this.Android.handleEvent(e, arg);
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
CMD.register("cache.CacheMode", function (){
    var CacheMode = {};

    CacheMode[CacheMode.FORCED = 0] = "FORCED";
    CacheMode[CacheMode.ALLOWED = 1] = "ALLOWED";
    CacheMode[CacheMode.DISABLED = 2] = "DISABLED";

    return CacheMode;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("cache.CacheStatus", function(){
    var CacheStatus = {};

    CacheStatus[CacheStatus.OK = 0] = "OK";
    CacheStatus[CacheStatus.STOPPED = 1] = "STOPPED";

    return CacheStatus;
});
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
                    var promise = me.registerCallback(fileUrl, fileId, options);
                    me.downloadFile(fileUrl, fileId);
                    return promise;
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
     * 删锟斤拷锟斤拷锟斤拷(21锟斤拷前)锟侥伙拷锟芥，锟斤拷锟斤拷证锟斤拷锟斤拷锟叫★拷锟斤拷锟斤拷锟?12Kb
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
            me._nativeBridge.Sdk.logInfo("OneWay SDK cache: Deleting " + oldFiles.length + " old files");
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
     * 锟斤拷锟斤拷锟侥硷拷路锟斤拷锟斤拷取锟侥硷拷id, 锟斤拷锟斤拷募锟絠d锟斤拷锟斤拷锟节ｏ拷锟斤拷锟斤拷锟斤拷锟侥硷拷id锟斤拷锟斤拷锟芥。
     * 锟侥硷拷id锟结构锟斤拷锟侥硷拷路锟斤拷锟侥癸拷希锟斤拷[.锟侥硷拷锟斤拷缀锟斤拷]
     *
     * @param fileUrl {String} 锟侥硷拷路锟斤拷
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
                        me._nativeBridge.Sdk.logError("OneWay SDK cache error: attempted to add second download from " + fileUrl + " to " + fileId);
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
     * 锟斤拷锟侥硷拷锟斤拷锟斤拷锟斤拷息写锟诫本锟截存储锟斤拷
     * @param fileUrl       {String} 锟侥硷拷路锟斤拷
     * @param cacheResponse {Object} 锟侥硷拷锟斤拷锟斤拷锟斤拷息
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

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("campaign.Campaign", function () {
    function Campaign(campaign, gamerId, abGroup) {
        this._isVideoCached = false;
        this._id = campaign.id;
        this._appStoreId = campaign.appStoreId;
        this._appStoreCountry = campaign.appStoreCountry;
        this._gameId = campaign.gameId;
        this._gameName = campaign.gameName;
        this._gameIcon = campaign.gameIcon;
        this._rating = campaign.rating;
        this._ratingCount = campaign.ratingCount;
        this._landscapeImage = campaign.endScreenLandscape;
        this._portraitImage = campaign.endScreenPortrait;
        this._video = campaign.trailerDownloadable;
        this._videoSize = campaign.trailerDownloadableSize;
        this._streamingVideo = campaign.trailerStreaming;
        this._clickAttributionUrl = campaign.clickAttributionUrl;
        this._clickAttributionUrlFollowsRedirects = campaign.clickAttributionUrlFollowsRedirects;
        this._bypassAppSheet = campaign.bypassAppSheet;
        this._gamerId = gamerId;
        this._abGroup = abGroup;
    }
    Campaign.prototype.getId = function () {
        return this._id;
    };
    Campaign.prototype.getAppStoreId = function () {
        return this._appStoreId;
    };
    Campaign.prototype.getAppStoreCountry = function () {
        return this._appStoreCountry;
    };
    Campaign.prototype.getGameId = function () {
        return this._gameId;
    };
    Campaign.prototype.getGameName = function () {
        return this._gameName;
    };
    Campaign.prototype.getGameIcon = function () {
        return this._gameIcon;
    };
    Campaign.prototype.setGameIcon = function (icon) {
        this._gameIcon = icon;
    };
    Campaign.prototype.getRating = function () {
        return this._rating;
    };
    Campaign.prototype.getRatingCount = function () {
        return this._ratingCount;
    };
    Campaign.prototype.getPortraitUrl = function () {
        return this._portraitImage;
    };
    Campaign.prototype.setPortraitUrl = function (imgUrl) {
        this._portraitImage = imgUrl;
    };
    Campaign.prototype.getLandscapeUrl = function () {
        return this._landscapeImage;
    };
    Campaign.prototype.setLandscapeUrl = function (url) {
        this._landscapeImage = url;
    };
    Campaign.prototype.getVideoUrl = function () {
        return this._video;
    };
    Campaign.prototype.setVideoUrl = function (url) {
        this._video = url;
    };
    Campaign.prototype.getClickAttributionUrl = function () {
        return this._clickAttributionUrl;
    };
    Campaign.prototype.getClickAttributionUrlFollowsRedirects = function () {
        return this._clickAttributionUrlFollowsRedirects;
    };
    Campaign.prototype.getBypassAppSheet = function () {
        return this._bypassAppSheet;
    };
    Campaign.prototype.getGamerId = function () {
        return this._gamerId;
    };
    Campaign.prototype.getAbGroup = function () {
        return this._abGroup;
    };
    Campaign.prototype.isVideoCached = function () {
        return this._isVideoCached;
    };
    Campaign.prototype.setVideoCached = function (cached) {
        this._isVideoCached = cached;
    };
    return Campaign;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("campaign.CampaignManager", function (require) {
    var Campaign = require("campaign.Campaign");
    var VastCampaign = require("campaign.VastCampaign");
    var JsonParser = require("util.JsonParser");
    var MetaDataManager = require("metadata.MetaDataManager");
    var Platform = require("platform.Platform");
    var Url = require("util.Url");
    var Observable = require("util.Observable");
    var campaignProperties = require("Properties").campaign;

    function CampaignManager(nativeBridge, request, clientInfo, deviceInfo, vastParser) {
        this.onCampaign = new Observable();
        this.onVastCampaign = new Observable();
        this.onNoFill = new Observable();
        this.onError = new Observable();
        this._nativeBridge = nativeBridge;
        this._request = request;
        this._clientInfo = clientInfo;
        this._deviceInfo = deviceInfo;
        this._vastParser = vastParser;
    }
    CampaignManager.setTestBaseUrl = function (baseUrl) {
        CampaignManager.CampaignBaseUrl = baseUrl + "/games";
    };
    CampaignManager.prototype.request = function () {
        var me = this;
        return Promise.all([this.createRequestUrl(), this.createRequestBody()]).then(function (res) {
            var requestUrl = res[0],
                requestBody = res[1];
            me._nativeBridge.Sdk.logInfo("Requesting ad plan from " + requestUrl);
            return me._request.post(requestUrl, requestBody, [], {
                retries: 5,
                retryDelay: 5e3,
                followRedirects: false,
                retryWithConnectionEvents: true
            }).then(function (data) {
                var response = JsonParser.parse(data.response);
                if (response.campaign) {
                    me._nativeBridge.Sdk.logInfo("OneWay SDK server returned game advertisement");
                    var campaign = new Campaign(response.campaign, response.gamerId, response.abGroup);
                    me.onCampaign.trigger(campaign);
                } else if("vast" in response ){
                    if(null === response.vast){
                        me._nativeBridge.Sdk.logInfo("OneWay SDK server returned no fill");
                        me.onNoFill.trigger(3600)
                    }else{
                        me._nativeBridge.Sdk.logInfo("OneWay SDK server returned VAST advertisement");
                        me._vastParser.retrieveVast(response.vast, me._nativeBridge, me._request).then(function (vastData) {
                            var campaignId = void 0;
                            if(me._nativeBridge.getPlatform() === Platform.IOS){
                                campaignId = "00005472656d6f7220694f53";
                            }else if(me._nativeBridge.getPlatform() === Platform.ANDROID){
                                campaignId = "005472656d6f7220416e6472";
                            }

                            var vastCampaign = new VastCampaign(vastData, campaignId, response.gamerId, response.abGroup);
                            if(0 === vastCampaign.getVast().getImpressionUrls().length){
                                me.onError.trigger(new Error("Campaign does not have an impression url"))

                            }else{
                                if(0 === vastCampaign.getVast().getErrorURLTemplates().length){
                                    me._nativeBridge.Sdk.logWarning("Campaign does not have an error url for game id " + me._clientInfo.getGameId())
                                }
                                if(vastCampaign.getVideoUrl()){
                                    me.onVastCampaign.trigger(vastCampaign)
                                }else{
                                    me.onError.trigger(new Error("Campaign does not have a video url"))
                                }
                            }


                        })["catch"](function (e) {
                            me.onError.trigger(e);
                        })
                    }
                }else{
                    me._nativeBridge.Sdk.logInfo("OneWay SDK server returned no fill");
                    me.onNoFill.trigger(3600);
                }
            });
        })["catch"](function (e) {
            me.onError.trigger(e);
        });
    };
    CampaignManager.prototype.createRequestUrl = function () {
        var requestUrl = [CampaignManager.CampaignBaseUrl, this._clientInfo.getGameId(), "fill"].join("/");

        if(this._deviceInfo.getAdvertisingIdentifier() ){
            requestUrl = Url.addParameters(requestUrl, {
                advertisingTrackingId: this._deviceInfo.getAdvertisingIdentifier(),
                limitAdTracking: this._deviceInfo.getLimitAdTracking()
            })
        }else if(this._clientInfo.getPlatform() === Platform.ANDROID){
            requestUrl = Url.addParameters(requestUrl, {
                androidId: this._deviceInfo.getAndroidId()
            })
        }

        requestUrl = Url.addParameters(requestUrl, {
            deviceMake: this._deviceInfo.getManufacturer(),
            deviceModel: this._deviceInfo.getModel(),
            platform: Platform[this._clientInfo.getPlatform()].toLowerCase(),
            screenDensity: this._deviceInfo.getScreenDensity(),
            screenWidth: this._deviceInfo.getScreenWidth(),
            screenHeight: this._deviceInfo.getScreenHeight(),
            sdkVersion: this._clientInfo.getSdkVersion(),
            screenSize: this._deviceInfo.getScreenLayout()
        });

        if("undefined" != typeof navigator && navigator.userAgent ){
            requestUrl = Url.addParameters(requestUrl, {
                webviewUa: encodeURIComponent(navigator.userAgent)
            });
        }

        if(this._clientInfo.getPlatform() === Platform.IOS){
            requestUrl = Url.addParameters(requestUrl, {osVersion: this._deviceInfo.getOsVersion()})
        }else{
            requestUrl = Url.addParameters(requestUrl, {apiLevel: this._deviceInfo.getApiLevel()});
        }

        if(this._clientInfo.getTestMode()){
            requestUrl = Url.addParameters(requestUrl, {test: true});
        }
        var tasks = [];
        tasks.push(this._deviceInfo.getConnectionType());
        tasks.push(this._deviceInfo.getNetworkType());
        return Promise.all(tasks).then(function (res) {
            var connectionType = res[0], networkType = res[1];
            return requestUrl = Url.addParameters(requestUrl, {
                connectionType: connectionType,
                networkType: networkType
            });
        });
    };
    CampaignManager.prototype.createRequestBody = function () {
        var me = this,
            tasks = [];
        tasks.push(this._deviceInfo.getFreeSpace());
        tasks.push(this._deviceInfo.getNetworkOperator());
        tasks.push(this._deviceInfo.getNetworkOperatorName());
        var params = {
            bundleVersion: this._clientInfo.getApplicationVersion(),
            bundleId: this._clientInfo.getApplicationName(),
            language: this._deviceInfo.getLanguage(),
            timeZone: this._deviceInfo.getTimeZone()
        };
        return Promise.all(tasks).then(function (res) {
            var deviceFreeSpace = res[0],
                networkOperator = res[1],
                networkOperatorName = res[2];
            params.deviceFreeSpace = deviceFreeSpace;
            params.networkOperator = networkOperator;
            params.networkOperatorName = networkOperatorName;
            return MetaDataManager.fetchMediationMetaData(me._nativeBridge).then(function (metaData) {
                metaData && (params.mediation = metaData.getDTO());
                return JSON.stringify(params);
            });
        });
    };
    CampaignManager.CampaignBaseUrl = campaignProperties.CAMPAIGN_BASE_URL;
    return CampaignManager;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("campaign.VastCampaign", function (require) {
    var Campaign = require("campaign.Campaign");

    function VastCampaign(vast, campaignId, gamerId, abGroup) {
        Campaign.call(this, {}, gamerId, abGroup);
        this._campaignId = campaignId;
        this._vast = vast;
    }
    extend(VastCampaign, Campaign);

    VastCampaign.prototype.getId = function () {
        return this._campaignId;
    };
    VastCampaign.prototype.getVast = function () {
        return this._vast;
    };
    VastCampaign.prototype.getVideoUrl = function () {
        var url = Campaign.prototype.getVideoUrl.call(this);
        return url ? url : this._vast.getVideoUrl();
    };
    return VastCampaign;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("configuration.Configuration", function (require){
    var CacheMode = require("cache.CacheMode");
    var Placement = require("placement.Placement");

    function Configuration(configData) {
        var me = this;
        this._placements = {};
        this._defaultPlacement = null;
        this._enabled = configData.enabled;
        this._country = configData.country;
        this._coppaCompliant = configData.coppaCompliant;

        switch (configData.assetCaching) {
            case "forced":
                this._cacheMode = CacheMode.FORCED;
                break;

            case "allowed":
                this._cacheMode = CacheMode.ALLOWED;
                break;

            case "disabled":
                this._cacheMode = CacheMode.DISABLED;
                break;

            default:
                throw new Error('Unknown assetCaching value "' + configData.assetCaching + '"');
        }

        var placements = configData.placements;
        placements.forEach(function (item) {
            var placement = new Placement(item);
            me._placements[placement.getId()] = placement;

            if(placement.isDefault()){
                me._defaultPlacement = placement;
            }
        });
    }
    Configuration.prototype.isEnabled = function () {
        return this._enabled;
    };
    Configuration.prototype.getCountry = function () {
        return this._country;
    };
    Configuration.prototype.isCoppaCompliant = function () {
        return this._coppaCompliant;
    };
    Configuration.prototype.getCacheMode = function () {
        return this._cacheMode;
    };
    Configuration.prototype.getPlacement = function (placementId) {
        return this._placements[placementId];
    };
    Configuration.prototype.getPlacements = function () {
        return this._placements;
    };
    Configuration.prototype.getPlacementCount = function () {
        if (!this._placements) {
            return 0;
        }
        var count = 0;
        for (var key in this._placements) {
            if(this._placements.hasOwnProperty(key)){
                count++;
            }
        }
        return count;
    };
    Configuration.prototype.getDefaultPlacement = function () {
        return this._defaultPlacement;
    };

    return Configuration;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("configuration.ConfigManager", function (require) {
    var MetaDataManager = require("metadata.MetaDataManager");
    var Configuration = require("configuration.Configuration");
    var configurationProperties = require("Properties").configuration;
    var Url = require("util.Url");
    var JsonParser = require("util.JsonParser");

    function ConfigManager() {}

    ConfigManager.fetch = function (nativeBridge, request, clientInfo, deviceInfo) {
        return MetaDataManager.fetchAdapterMetaData(nativeBridge).then(function (metaData) {
            var configUrl = ConfigManager.createConfigUrl(clientInfo, deviceInfo, metaData);
            nativeBridge.Sdk.logInfo("Requesting configuration from " + configUrl);
            return request.get(configUrl, [], {
                retries: 5,
                retryDelay: 5e3,
                followRedirects: false,
                retryWithConnectionEvents: true
            }).then(function (res) {
                try {
                    var configData = JsonParser.parse(res.response),
                        configuration = new Configuration(configData);
                    nativeBridge.Sdk.logInfo("Received configuration with " + configuration.getPlacementCount() + " placements");
                    return configuration;
                } catch (e) {
                    nativeBridge.Sdk.logError("Config request failed " + e);
                    throw new Error(e);
                }
            });
        });
    };
    ConfigManager.setTestBaseUrl = function (baseUrl) {
        ConfigManager.ConfigBaseUrl = baseUrl + "/games";
    };
    ConfigManager.createConfigUrl = function (clientInfo, deviceInfo, metaData) {
        var configUrl = [ConfigManager.ConfigBaseUrl, clientInfo.getGameId(), "configuration"].join("/");
        configUrl = Url.addParameters(configUrl, {
            bundleId: clientInfo.getApplicationName(),
            encrypted: !clientInfo.isDebuggable(),
            rooted: deviceInfo.isRooted()
        });
        if(metaData){
            configUrl = Url.addParameters(configUrl, metaData.getDTO());
        }
        return configUrl;
    };
    ConfigManager.ConfigBaseUrl = configurationProperties.CONFIG_BASE_URL;

    return ConfigManager;
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
 * Created by duo on 2016/9/1.
 */
CMD.register("device.ClientInfo", function (require) {
    var Model = require("model.Model");
    var AdsError = require("AdsError");
    var Platform = require("platform.Platform");

    /**
     * SDK Environment info
     * @param platform
     * @param nativeClientInfo {Array} from native
     * @constructor
     */
    function ClientInfo(platform, nativeClientInfo) {
        Model.call(this);
        this._platform = platform;
        var gameId = nativeClientInfo.shift();
        if ("string" != typeof gameId || !/^\d+$/.test(gameId)){
            throw new Error(AdsError[AdsError.INVALID_ARGUMENT]);
        }
        this._gameId = gameId;
        this._testMode = nativeClientInfo.shift();
        this._applicationName = nativeClientInfo.shift();
        this._applicationVersion = nativeClientInfo.shift();
        this._sdkVersion = nativeClientInfo.shift();
        this._sdkVersionName = nativeClientInfo.shift();
        this._debuggable = nativeClientInfo.shift();
        this._configUrl = nativeClientInfo.shift();
        this._webviewUrl = nativeClientInfo.shift();
        this._webviewHash = nativeClientInfo.shift();
        this._webviewVersion = nativeClientInfo.shift();
    }
    extend(ClientInfo, Model);

    ClientInfo.prototype.getGameId = function () {
        return this._gameId;
    };
    ClientInfo.prototype.getTestMode = function () {
        return this._testMode;
    };
    ClientInfo.prototype.getApplicationVersion = function () {
        return this._applicationVersion;
    };
    ClientInfo.prototype.getApplicationName = function () {
        return this._applicationName;
    };
    ClientInfo.prototype.getSdkVersion = function () {
        return this._sdkVersion;
    };
    ClientInfo.prototype.getSdkVersionName = function () {
        return this._sdkVersionName;
    };
    ClientInfo.prototype.getPlatform = function () {
        return this._platform;
    };
    ClientInfo.prototype.isDebuggable = function () {
        return this._debuggable;
    };
    ClientInfo.prototype.getConfigUrl = function () {
        return this._configUrl;
    };
    ClientInfo.prototype.getWebviewUrl = function () {
        return this._webviewUrl;
    };
    ClientInfo.prototype.getWebviewHash = function () {
        return this._webviewHash;
    };
    ClientInfo.prototype.getWebviewVersion = function () {
        return this._webviewVersion;
    };
    ClientInfo.prototype.getDTO = function () {
        return {
            gameId: this._gameId,
            testMode: this._testMode,
            bundleId: this._applicationName,
            bundleVersion: this._applicationVersion,
            sdkVersion: this._sdkVersion,
            sdkVersionName: this._sdkVersionName,
            platform: Platform[this._platform].toLowerCase(),
            encrypted: !this._debuggable,
            configUrl: this._configUrl,
            webviewUrl: this._webviewUrl,
            webviewHash: this._webviewHash,
            webviewVersion: this._webviewVersion
        };
    };

    return ClientInfo;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("device.DeviceInfo", function (require) {
    var Model = require("model.Model");
    var Platform = require("platform.Platform");
    var AndroidStorageType = require("device.AndroidStorageType");
    var StreamType = require("device.StreamType");


    function DeviceInfo(nativeBridge) {
        Model.call(this);
        this._nativeBridge = nativeBridge;
    }
    extend(DeviceInfo, Model);
    DeviceInfo.prototype.fetch = function () {
        var me = this, tasks = [];
        tasks.push(this._nativeBridge.DeviceInfo.getAdvertisingTrackingId().then(function (id) {
            return me._advertisingIdentifier = id;
        }).catch(function (e) {
            return me.handleDeviceInfoError(e);
        }));

        tasks.push(this._nativeBridge.DeviceInfo.getLimitAdTrackingFlag().then(function (flag) {
            if(me._nativeBridge.getPlatform() === Platform.IOS){
                me._limitAdTracking = !flag
            }else{
                me._limitAdTracking = flag;
            }
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        tasks.push(this._nativeBridge.DeviceInfo.getOsVersion().then(function (version) {
            return me._osVersion = version;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        tasks.push(this._nativeBridge.DeviceInfo.getModel().then(function (model) {
            return me._model = model;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        tasks.push(this._nativeBridge.DeviceInfo.getScreenWidth().then(function (width) {
            return me._screenWidth = width;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        tasks.push(this._nativeBridge.DeviceInfo.getScreenHeight().then(function (height) {
            return me._screenHeight = height;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        tasks.push(this._nativeBridge.DeviceInfo.getSystemLanguage().then(function (lang) {
            return me._language = lang;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        tasks.push(this._nativeBridge.DeviceInfo.isRooted().then(function (rooted) {
            return me._rooted = rooted;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        tasks.push(this._nativeBridge.DeviceInfo.getTimeZone(false).then(function (timeZone) {
            return me._timeZone = timeZone;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        tasks.push(this._nativeBridge.DeviceInfo.getTotalMemory().then(function (totalMemory) {
            return me._totalMemory = totalMemory;
        })["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));

        if(this._nativeBridge.getPlatform() === Platform.IOS ){
            tasks.push(this._nativeBridge.DeviceInfo.Ios.getUserInterfaceIdiom().then(function (userInterfaceIdiom) {
                return me._userInterfaceIdiom = userInterfaceIdiom;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            tasks.push(this._nativeBridge.DeviceInfo.Ios.getScreenScale().then(function (scale) {
                return me._screenScale = scale;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            tasks.push(this._nativeBridge.DeviceInfo.Ios.isSimulator().then(function (isSimulator) {
                return me._simulator = isSimulator;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            tasks.push(this._nativeBridge.DeviceInfo.Ios.getTotalSpace().then(function (totalSpace) {
                return me._totalInternalSpace = totalSpace;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }))
        } else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            tasks.push(this._nativeBridge.DeviceInfo.Android.getAndroidId().then(function (id) {
                return me._androidId = id;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            tasks.push(this._nativeBridge.DeviceInfo.Android.getApiLevel().then(function (apiLevel) {
                return me._apiLevel = apiLevel;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            tasks.push(this._nativeBridge.DeviceInfo.Android.getTotalSpace(AndroidStorageType.INTERNAL).then(function (totalSpace) {
                return me._totalInternalSpace = totalSpace;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            tasks.push(this._nativeBridge.DeviceInfo.Android.getTotalSpace(AndroidStorageType.EXTERNAL).then(function (totalSpace) {
                return me._totalExternalSpace = totalSpace;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            tasks.push(this._nativeBridge.DeviceInfo.Android.getManufacturer().then(function (manufacturer) {
                return me._manufacturer = manufacturer;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            tasks.push(this._nativeBridge.DeviceInfo.Android.getScreenDensity().then(function (screenDensity) {
                return me._screenDensity = screenDensity;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));

            tasks.push(this._nativeBridge.DeviceInfo.Android.getScreenLayout().then(function (screenLayout) {
                return me._screenLayout = screenLayout;
            })["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }))
        }

        return Promise.all(tasks);
    };
    DeviceInfo.prototype.getAndroidId = function () {
        return this._androidId;
    };
    DeviceInfo.prototype.getAdvertisingIdentifier = function () {
        return this._advertisingIdentifier;
    };
    DeviceInfo.prototype.getLimitAdTracking = function () {
        return this._limitAdTracking;
    };
    DeviceInfo.prototype.getApiLevel = function () {
        return this._apiLevel;
    };
    DeviceInfo.prototype.getManufacturer = function () {
        return this._manufacturer;
    };
    DeviceInfo.prototype.getModel = function () {
        return this._model;
    };
    DeviceInfo.prototype.getNetworkType = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getNetworkType().then(function (type) {
            me._networkType = type;
            return me._networkType;
        });
    };
    DeviceInfo.prototype.getNetworkOperator = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS || this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.getNetworkOperator().then(function (networkOperator) {
                me._networkOperator = networkOperator;
                return me._networkOperator;
            })
        }else{
            return Promise.resolve(this._networkOperator);
        }
    };
    DeviceInfo.prototype.getNetworkOperatorName = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS || this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.getNetworkOperatorName().then(function (networkOperatorName) {
                me._networkOperatorName = networkOperatorName;
                return me._networkOperatorName;
            });
        }else{
            return Promise.resolve(this._networkOperatorName);
        }
    };
    DeviceInfo.prototype.getOsVersion = function () {
        return this._osVersion;
    };
    DeviceInfo.prototype.getScreenLayout = function () {
        return this._screenLayout;
    };
    DeviceInfo.prototype.getScreenDensity = function () {
        return this._screenDensity;
    };
    DeviceInfo.prototype.getScreenWidth = function () {
        return this._screenWidth;
    };
    DeviceInfo.prototype.getScreenHeight = function () {
        return this._screenHeight;
    };
    DeviceInfo.prototype.getScreenScale = function () {
        return this._screenScale;
    };
    DeviceInfo.prototype.getUserInterfaceIdiom = function () {
        return this._userInterfaceIdiom;
    };
    DeviceInfo.prototype.isRooted = function () {
        return this._rooted;
    };
    DeviceInfo.prototype.getConnectionType = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getConnectionType().then(function (type) {
            me._connectionType = type;
            return me._connectionType;
        });
    };
    DeviceInfo.prototype.getTimeZone = function () {
        return this._timeZone;
    };
    DeviceInfo.prototype.getFreeSpace = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS){
            return this._nativeBridge.DeviceInfo.Ios.getFreeSpace().then(function (freeSpace) {
                me._freeInternalSpace = freeSpace;
                return me._freeInternalSpace;
            });
        }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getFreeSpace(AndroidStorageType.INTERNAL).then(function (freeSpace) {
                me._freeInternalSpace = freeSpace;
                return me._freeInternalSpace;
            });
        }else{
            return Promise.resolve(this._freeInternalSpace);
        }
    };
    DeviceInfo.prototype.getFreeSpaceExternal = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getFreeSpace(AndroidStorageType.EXTERNAL).then(function (freeSpace) {
                me._freeExternalSpace = freeSpace;
                return me._freeExternalSpace;
            })
        }else{
            return Promise.resolve(this._freeExternalSpace);
        }
    };
    DeviceInfo.prototype.getTotalSpace = function () {
        return this._totalInternalSpace;
    };
    DeviceInfo.prototype.getTotalSpaceExternal = function () {
        return this._totalExternalSpace;
    };
    DeviceInfo.prototype.getLanguage = function () {
        return this._language;
    };
    DeviceInfo.prototype.isSimulator = function () {
        return this._simulator;
    };
    DeviceInfo.prototype.isAppleWatchPaired = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS){
            return this._nativeBridge.DeviceInfo.Ios.isAppleWatchPaired().then(function (isAppleWatchPaired) {
                me._appleWatchPaired = isAppleWatchPaired;
                return me._appleWatchPaired;
            });
        }else{
            return Promise.resolve(this._appleWatchPaired);
        }
    };
    DeviceInfo.prototype.getHeadset = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getHeadset().then(function (headset) {
            me._headset = headset;
            return me._headset;
        });
    };
    DeviceInfo.prototype.getRingerMode = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getRingerMode().then(function (ringerMode) {
                me._ringerMode = ringerMode;
                return me._ringerMode;
            });
        }else{
            return Promise.resolve(this._ringerMode);
        }
    };
    DeviceInfo.prototype.getDeviceVolume = function () {
        var me = this;
        if(this._nativeBridge.getPlatform() === Platform.IOS){
            return this._nativeBridge.DeviceInfo.Ios.getDeviceVolume().then(function (volume) {
                me._volume = volume;
                return me._volume;
            });
        }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            return this._nativeBridge.DeviceInfo.Android.getDeviceVolume(StreamType.STREAM_SYSTEM).then(function (volume) {
                me._volume = volume;
                return me._volume;
            });
        }else{
            return Promise.resolve(this._volume);
        }
    };
    DeviceInfo.prototype.getScreenBrightness = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getScreenBrightness().then(function (screenBrightness) {
            me._screenBrightness = screenBrightness;
            return me._screenBrightness;
        });
    };
    DeviceInfo.prototype.getBatteryLevel = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getBatteryLevel().then(function (batteryLevel) {
            me._batteryLevel = batteryLevel;
            return me._batteryLevel;
        });
    };
    DeviceInfo.prototype.getBatteryStatus = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getBatteryStatus().then(function (batteryStatus) {
            me._batteryStatus = batteryStatus;
            return me._batteryStatus;
        });
    };
    DeviceInfo.prototype.getFreeMemory = function () {
        var me = this;
        return this._nativeBridge.DeviceInfo.getFreeMemory().then(function (freeMemory) {
            me._freeMemory = freeMemory;
            return me._freeMemory;
        });
    };
    DeviceInfo.prototype.getTotalMemory = function () {
        return this._totalMemory;
    };
    DeviceInfo.prototype.getDTO = function () {
        var me = this, tasks = [];
        tasks.push(this.getConnectionType()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        tasks.push(this.getNetworkType()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        tasks.push(this.getNetworkOperator()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        tasks.push(this.getNetworkOperatorName()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        tasks.push(this.getHeadset()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        tasks.push(this.getDeviceVolume()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        tasks.push(this.getScreenBrightness()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        tasks.push(this.getFreeSpace()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        tasks.push(this.getBatteryLevel()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        tasks.push(this.getBatteryStatus()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        tasks.push(this.getFreeMemory()["catch"](function (e) {
            return me.handleDeviceInfoError(e);
        }));
        if(this._nativeBridge.getPlatform() === Platform.IOS ){
            tasks.push(this.isAppleWatchPaired()["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }))
        }else if(this._nativeBridge.getPlatform() === Platform.ANDROID){
            tasks.push(this.getFreeSpaceExternal()["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }));
            tasks.push(this.getRingerMode()["catch"](function (e) {
                return me.handleDeviceInfoError(e);
            }))
        }
        return Promise.all(tasks).then(function () {
            return {
                androidId: me._androidId,
                advertisingId: me._advertisingIdentifier,
                trackingEnabled: me._limitAdTracking,
                apiLevel: me._apiLevel,
                osVersion: me._osVersion,
                deviceMake: me._manufacturer,
                deviceModel: me._model,
                connectionType: me._connectionType,
                networkType: me._networkType,
                screenLayout: me._screenLayout,
                screenDensity: me._screenDensity,
                screenWidth: me._screenWidth,
                screenHeight: me._screenHeight,
                screenScale: me._screenScale,
                userInterfaceIdiom: me._userInterfaceIdiom,
                networkOperator: me._networkOperator,
                networkOperatorName: me._networkOperatorName,
                timeZone: me._timeZone,
                headset: me._headset,
                ringerMode: me._ringerMode,
                language: me._language,
                deviceVolume: me._volume,
                screenBrightness: me._screenBrightness,
                freeSpaceInternal: me._freeInternalSpace,
                totalSpaceInternal: me._totalInternalSpace,
                freeSpaceExternal: me._freeExternalSpace,
                totalSpaceExternal: me._totalExternalSpace,
                batteryLevel: me._batteryLevel,
                batteryStatus: me._batteryStatus,
                freeMemory: me._freeMemory,
                totalMemory: me._totalMemory,
                rooted: me._rooted,
                simulator: me._simulator,
                appleWatchPaired: me._appleWatchPaired
            };
        });
    };
    DeviceInfo.prototype.handleDeviceInfoError = function (e) {
        this._nativeBridge.Sdk.logWarning(JSON.stringify(e));
    };
    return DeviceInfo;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("device.ScreenOrientation", function () {
    var ScreenOrientation = {};

    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_UNSPECIFIED = -1] = "SCREEN_ORIENTATION_UNSPECIFIED";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_LANDSCAPE = 0] = "SCREEN_ORIENTATION_LANDSCAPE";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_PORTRAIT = 1] = "SCREEN_ORIENTATION_PORTRAIT";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_USER = 2] = "SCREEN_ORIENTATION_USER";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_BEHIND = 3] = "SCREEN_ORIENTATION_BEHIND";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_SENSOR = 4] = "SCREEN_ORIENTATION_SENSOR";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_NOSENSOR = 5] = "SCREEN_ORIENTATION_NOSENSOR";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_SENSOR_LANDSCAPE = 6] = "SCREEN_ORIENTATION_SENSOR_LANDSCAPE";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_SENSOR_PORTRAIT = 7] = "SCREEN_ORIENTATION_SENSOR_PORTRAIT";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_REVERSE_LANDSCAPE = 8] = "SCREEN_ORIENTATION_REVERSE_LANDSCAPE";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_REVERSE_PORTRAIT = 9] = "SCREEN_ORIENTATION_REVERSE_PORTRAIT";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_FULL_SENSOR = 10] = "SCREEN_ORIENTATION_FULL_SENSOR";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_USER_LANDSCAPE = 11] = "SCREEN_ORIENTATION_USER_LANDSCAPE";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_USER_PORTRAIT = 12] = "SCREEN_ORIENTATION_USER_PORTRAIT";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_FULL_USER = 13] = "SCREEN_ORIENTATION_FULL_USER";
    ScreenOrientation[ScreenOrientation.SCREEN_ORIENTATION_LOCKED = 14] = "SCREEN_ORIENTATION_LOCKED";

    return ScreenOrientation;
});
/**
 * Created by duo on 2016/8/31.
 */
CMD.register("device.StreamType", function () {
    var StreamType = {};

    StreamType[StreamType.STREAM_ALARM = 4] = "STREAM_ALARM";
    StreamType[StreamType.STREAM_DTMF = 8] = "STREAM_DTMF";
    StreamType[StreamType.STREAM_MUSIC = 3] = "STREAM_MUSIC";
    StreamType[StreamType.STREAM_NOTIFICATION = 5] = "STREAM_NOTIFICATION";
    StreamType[StreamType.STREAM_RING = 2] = "STREAM_RING";
    StreamType[StreamType.STREAM_SYSTEM = 1] = "STREAM_SYSTEM";
    StreamType[StreamType.STREAM_VOICE_CALL = 0] = "STREAM_VOICE_CALL";

    return StreamType;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("device.UIInterfaceOrientationMask", function () {
    var mask = {};

    mask[mask.INTERFACE_ORIENTATION_MASK_PORTRAIT = 2] = "INTERFACE_ORIENTATION_MASK_PORTRAIT";
    mask[mask.INTERFACE_ORIENTATION_MASK_LANDSCAPE_LEFT = 16] = "INTERFACE_ORIENTATION_MASK_LANDSCAPE_LEFT";
    mask[mask.INTERFACE_ORIENTATION_MASK_LANDSCAPE_RIGHT = 8] = "INTERFACE_ORIENTATION_MASK_LANDSCAPE_RIGHT";
    mask[mask.INTERFACE_ORIENTATION_MASK_PORTRAIT_UPSIDE_DOWN = 4] = "INTERFACE_ORIENTATION_MASK_PORTRAIT_UPSIDE_DOWN";
    mask[mask.INTERFACE_ORIENTATION_MASK_LANDSCAPE = 24] = "INTERFACE_ORIENTATION_MASK_LANDSCAPE";
    mask[mask.INTERFACE_ORIENTATION_MASK_ALL = 30] = "INTERFACE_ORIENTATION_MASK_ALL";
    mask[mask.INTERFACE_ORIENTATION_MASK_ALL_BUT_UPSIDE_DOWN = 26] = "INTERFACE_ORIENTATION_MASK_ALL_BUT_UPSIDE_DOWN";

    return mask;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("event.EventManager", function (require) {
    var StorageType = require("storage.StorageType");

    function EventManager(nativeBridge, request) {
        this._nativeBridge = nativeBridge;
        this._request = request;
    }
    EventManager.getSessionKey = function (sessionId) {
        return "session." + sessionId;
    };
    EventManager.getSessionTimestampKey = function (sessionId) {
        return EventManager.getSessionKey(sessionId) + ".ts";
    };
    EventManager.getEventKey = function (sessionId, eventId) {
        return EventManager.getSessionKey(sessionId) + ".operative." + eventId;
    };
    EventManager.getUrlKey = function (sessionId, eventId) {
        return EventManager.getEventKey(sessionId, eventId) + ".url";
    };
    EventManager.getDataKey = function (sessionId, eventId) {
        return EventManager.getEventKey(sessionId, eventId) + ".data";
    };
    EventManager.prototype.operativeEvent = function (eventName, eventId, sessionId, eventUrl, metaDataStr) {
        var me = this;
        this._nativeBridge.Sdk.logInfo("OneWay SDK event: sending " + eventName + " event to " + eventUrl);
        this._nativeBridge.Storage.set(StorageType.PRIVATE, EventManager.getUrlKey(sessionId, eventId), eventUrl);
        this._nativeBridge.Storage.set(StorageType.PRIVATE, EventManager.getDataKey(sessionId, eventId), metaDataStr);
        this._nativeBridge.Storage.write(StorageType.PRIVATE);
        return this._request.post(eventUrl, metaDataStr, [], {
            retries: 5,
            retryDelay: 5e3,
            followRedirects: false,
            retryWithConnectionEvents: false
        }).then(function () {
            return Promise.all([
                me._nativeBridge.Storage["delete"](StorageType.PRIVATE, EventManager.getEventKey(sessionId, eventId)),
                me._nativeBridge.Storage.write(StorageType.PRIVATE)
            ]);
        });
    };
    EventManager.prototype.clickAttributionEvent = function (sessionId, clickAttributionUrl, clickAttributionUrlFollowsRedirects) {
        if(clickAttributionUrlFollowsRedirects){
            return this._request.get(clickAttributionUrl, [], {
                retries: 0,
                retryDelay: 0,
                followRedirects: true,
                retryWithConnectionEvents: false
            })
        }else{
            return this._request.get(clickAttributionUrl);
        }
    };
    EventManager.prototype.thirdPartyEvent = function (eventName, sessionId, eventUrl) {
        this._nativeBridge.Sdk.logInfo("OneWay SDK third party event: sending " + eventName + " event to " + eventUrl + " (session " + sessionId + ")");
        return this._request.get(eventUrl, [], {
            retries: 0,
            retryDelay: 0,
            followRedirects: true,
            retryWithConnectionEvents: false
        });
    };
    EventManager.prototype.diagnosticEvent = function (url, data) {
        return this._request.post(url, data);
    };
    EventManager.prototype.startNewSession = function (id) {
        return Promise.all([this._nativeBridge.Storage.set(StorageType.PRIVATE, EventManager.getSessionTimestampKey(id), Date.now()), this._nativeBridge.Storage.write(StorageType.PRIVATE)]);
    };
    /**
     * 鍙戦€佹墍鏈夋湭鍙戦€佽繃鐨剆ession淇℃伅锛屾垚鍔熷悗鍒犻櫎Storage淇℃伅
     * @returns {Promise}
     */
    EventManager.prototype.sendUnsentSessions = function () {
        var me = this;
        return this.getUnsentSessions().then(function (sessionIds) {
            var n = sessionIds.map(function (sessionId) {
                return me.isSessionOutdated(sessionId).then(function (isOutdated) {
                    if(isOutdated){
                        return me.deleteSession(sessionId)
                    }else{
                        return me.getUnsentOperativeEvents(sessionId).then(function (events) {
                            return Promise.all(events.map(function (eventId) {
                                return me.resendEvent(sessionId, eventId);
                            }));
                        });
                    }
                });
            });
            return Promise.all(n);
        });
    };
    EventManager.prototype.getUniqueEventId = function () {
        return this._nativeBridge.DeviceInfo.getUniqueEventId();
    };
    EventManager.prototype.getUnsentSessions = function () {
        return this._nativeBridge.Storage.getKeys(StorageType.PRIVATE, "session", false);
    };
    /**
     * session鏄惁杩囨湡锛岃繃鏈熸椂闂翠负7澶?
     * @param sessionId {String}
     * @returns {Promise} resolve(boolean) | reject(true)
     */
    EventManager.prototype.isSessionOutdated = function (sessionId) {
        return this._nativeBridge.Storage.get(StorageType.PRIVATE, EventManager.getSessionTimestampKey(sessionId)).then(function (timestamp) {
            var sevenDaysBefore = new Date().getTime() - 6048e5,
                now = new Date().getTime();
            return !(timestamp > sevenDaysBefore && now > timestamp);
        })["catch"](function () {
            return true;
        });
    };
    /**
     * 鑾峰彇鎵€鏈夋湭鍙戦€佺殑浜嬩欢id
     * @param sessionId
     * @returns {Promise} resolve(events:Array)
     */
    EventManager.prototype.getUnsentOperativeEvents = function (sessionId) {
        return this._nativeBridge.Storage.getKeys(StorageType.PRIVATE, "session." + sessionId + ".operative", false);
    };
    /**
     * 鍙戦€佷簨浠跺埌native锛屾垚鍔熷悗鍒犻櫎Storage鐨勪簨浠惰褰?
     * @param sessionId {String}
     * @param eventId   {String}
     * @returns {Promise} resolve([storageType:String, storageType:String])
     */
    EventManager.prototype.resendEvent = function (sessionId, eventId) {
        var me = this;
        return this.getStoredOperativeEvent(sessionId, eventId).then(function (res) {
            var url = res[0], data = res[1];
            me._nativeBridge.Sdk.logInfo("OneWay SDK operative event: resending operative event to " + url + " (session " + sessionId + ", event " + eventId + ")");
            return me._request.post(url, data);
        }).then(function () {
            return Promise.all([
                me._nativeBridge.Storage["delete"](StorageType.PRIVATE, EventManager.getEventKey(sessionId, eventId)),
                me._nativeBridge.Storage.write(StorageType.PRIVATE)
            ]);
        });
    };
    EventManager.prototype.getStoredOperativeEvent = function (sessionId, eventId) {
        return Promise.all([
            this._nativeBridge.Storage.get(StorageType.PRIVATE, EventManager.getUrlKey(sessionId, eventId)),
            this._nativeBridge.Storage.get(StorageType.PRIVATE, EventManager.getDataKey(sessionId, eventId))
        ]);
    };
    EventManager.prototype.deleteSession = function (sessionId) {
        return Promise.all([
            this._nativeBridge.Storage["delete"](StorageType.PRIVATE, EventManager.getSessionKey(sessionId)),
            this._nativeBridge.Storage.write(StorageType.PRIVATE)]);
    };
    return EventManager;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("metadata.AdapterMetaData", function (require) {
    var Model = require("model.Model");

    function AdapterMetaData(metaData) {
        Model.call(this);
        this._name = metaData[0];
        this._version = metaData[1];
    }
    extend(AdapterMetaData, Model);

    AdapterMetaData.getCategory = function () {
        return "adapter";
    };
    AdapterMetaData.getKeys = function () {
        return ["name.value", "version.value"];
    };
    AdapterMetaData.prototype.getName = function () {
        return this._name;
    };
    AdapterMetaData.prototype.getVersion = function () {
        return this._version;
    };
    AdapterMetaData.prototype.getDTO = function () {
        return {
            adapterName: this._name,
            adapterVersion: this._version
        };
    };
    return AdapterMetaData;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("metadata.FrameworkMetaData", function (require) {
    var Model = require("model.Model");

    function FrameworkMetaData(metaData) {
        Model.call(this);
        this._name = metaData[0];
        this._version = metaData[1];
    }
    extend(FrameworkMetaData, Model);

    FrameworkMetaData.getCategory = function () {
        return "framework";
    };
    FrameworkMetaData.getKeys = function () {
        return ["name.value", "version.value"];
    };

    FrameworkMetaData.prototype.getName = function () {
        return this._name;
    };
    FrameworkMetaData.prototype.getVersion = function () {
        return this._version;
    };
    FrameworkMetaData.prototype.getDTO = function () {
        return {
            frameworkName: this._name,
            frameworkVersion: this._version
        };
    };
    return FrameworkMetaData;
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("metadata.MediationMetaData", function (require) {
    var Model = require("model.Model");

    function MediationMetaData(metaData) {
        Model.call(this);
        this._name = metaData[0];
        this._version = metaData[1];
        this._ordinal = parseInt(metaData[2], 10);
    }
    extend(MediationMetaData, Model);

    MediationMetaData.getCategory = function () {
        return "mediation";
    };
    MediationMetaData.getKeys = function () {
        return ["name.value", "version.value", "ordinal.value"];
    };

    MediationMetaData.prototype.getName = function () {
        return this._name;
    };
    MediationMetaData.prototype.getVersion = function () {
        return this._version;
    };
    MediationMetaData.prototype.getOrdinal = function () {
        return this._ordinal;
    };
    MediationMetaData.prototype.getDTO = function () {
        return {
            mediationName: this._name,
            mediationVersion: this._version,
            mediationOrdinal: this._ordinal
        };
    };
    return MediationMetaData;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("metadata.PlayerMetaData", function (require) {
    var Model = require("model.Model");

    function PlayerMetaData(metaData) {
        Model.call(this);
        this._serverId = metaData[0];
    }
    extend(PlayerMetaData, Model);

    PlayerMetaData.getCategory = function () {
        return "player";
    };
    PlayerMetaData.getKeys = function () {
        return ["server_id.value"];
    };

    PlayerMetaData.prototype.getServerId = function () {
        return this._serverId;
    };
    PlayerMetaData.prototype.getDTO = function () {
        return {
            sid: this._serverId
        };
    };
    return PlayerMetaData;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("metadata.MetaDataManager", function (require) {
    var StorageType = require("storage.StorageType");
    var FrameworkMetaData = require("metadata.FrameworkMetaData");
    var AdapterMetaData = require("metadata.AdapterMetaData");
    var MediationMetaData = require("metadata.MediationMetaData");
    var PlayerMetaData = require("metadata.PlayerMetaData");

    function MetaDataManager() {
    }

    /**
     * 从本地存储里获取指定类型的多个元数据值。
     * @param category      {String}        元数据类型
     * @param keys          {Array}         元数据键值名列表
     * @param nativeBridge  {NativeBridge}  Native Api
     * @returns Promise A+  {Promise}       {Array:values | undefined}
     */
    MetaDataManager.getValues = function (category, keys, nativeBridge) {
        return MetaDataManager.categoryExists(category, nativeBridge).then(function (exists) {
            if(exists){
                return Promise.all(keys.map(function (key) {
                    return nativeBridge.Storage.get(StorageType.PUBLIC, category + "." + key)["catch"](function () {});
                }));
            }else{
                return Promise.resolve(void 0);
            }
        });
    };
    MetaDataManager.fetchFrameworkMetaData = function (nativeBridge, useCache) {
        if(void 0 === useCache){
            useCache = true;
        }
        return MetaDataManager.fetch(FrameworkMetaData.getCategory(), FrameworkMetaData.getKeys(), nativeBridge, useCache).then(function (metaData) {
            return Promise.resolve(metaData);
        });
    };
    MetaDataManager.fetchAdapterMetaData = function (nativeBridge, useCache) {
        if(void 0 === useCache){
            useCache = true;
        }
        return MetaDataManager.fetch(AdapterMetaData.getCategory(), AdapterMetaData.getKeys(), nativeBridge, useCache).then(function (metaData) {
            return Promise.resolve(metaData);
        });
    };
    MetaDataManager.fetchMediationMetaData = function (nativeBridge, useCache) {
        if(void 0 === useCache){
            useCache = true;
        }
        return MetaDataManager.fetch(MediationMetaData.getCategory(), MediationMetaData.getKeys(), nativeBridge, useCache).then(function (metaData) {
            return Promise.resolve(metaData);
        });
    };
    MetaDataManager.fetchPlayerMetaData = function (nativeBridge) {
        return MetaDataManager.fetch(PlayerMetaData.getCategory(), PlayerMetaData.getKeys(), nativeBridge, false).then(function (metaData) {
            if(null != metaData){
                MetaDataManager.caches.player = void 0;
                return nativeBridge.Storage["delete"](StorageType.PUBLIC, PlayerMetaData.getCategory()).then(function () {
                    return metaData;
                });
            }else{
                return Promise.resolve(metaData);
            }
        });
    };
    /**
     * 通用接口：获取元数据
     * @param category      {String}        元数据类型
     * @param keys          {Array}         元数据键值名列表
     * @param nativeBridge  {NativeBridge}  Native Api
     * @param useCache      {Boolean}       是否使用缓存，如果为true, 优先使用缓存数据，并在第一次获取元数据的同时缓存起来。
     * @returns Promise A+  {Promise}       {MetaData | undefined}
     */
    MetaDataManager.fetch = function (category, keys, nativeBridge, useCache) {
        if(void 0 === useCache ){
            useCache = true;
        }
        if(useCache && MetaDataManager.caches[category]){
            return Promise.resolve(MetaDataManager.caches[category]);
        }else{
            return MetaDataManager.getValues(category, keys, nativeBridge).then(function (values) {
                return MetaDataManager.createAndCache(category, values, useCache);
            });
        }
    };
    MetaDataManager.createAndCache = function (category, values, useCache) {
        if(void 0 === useCache){
            useCache = true
        }
        if(void 0 !== values){
            if(useCache && !MetaDataManager.caches[category] ){
                MetaDataManager.caches[category] = MetaDataManager.createByCategory(category, values);
            }
            return useCache ? MetaDataManager.caches[category] : MetaDataManager.createByCategory(category, values)
        }else{
            return void 0
        }
    };
    MetaDataManager.createByCategory = function (category, values) {
        switch (category) {
            case "framework":
                return new FrameworkMetaData(values);

            case "adapter":
                return new AdapterMetaData(values);

            case "mediation":
                return new MediationMetaData(values);

            case "player":
                return new PlayerMetaData(values);

            default:
                return null;
        }
    };
    MetaDataManager.clearCaches = function () {
        MetaDataManager.caches = {
            framework: void 0,
            adapter: void 0,
            mediation: void 0,
            player: void 0
        };
    };
    MetaDataManager.categoryExists = function (category, nativeBridge) {
        return nativeBridge.Storage.getKeys(StorageType.PUBLIC, category, false).then(function (keys) {
            return keys.length > 0;
        });
    };
    MetaDataManager.caches = {
        framework: void 0,
        adapter: void 0,
        mediation: void 0,
        player: void 0
    };

    return MetaDataManager;
});
/**
 * Created by duo on 2016/8/31.
 */
CMD.register("model.Model", function () {
    var Model = function () {
    };
    return Model;
});
/**
 * Created by duo on 2016/8/31.
 */

CMD.register("placement.Placement", function () {

    function Placement(placementData) {
        this._id = placementData.id;
        this._name = placementData.name;
        this._default = placementData["default"];
        this._allowSkip = placementData.allowSkip;
        this._skipInSeconds = placementData.skipInSeconds;
        this._disableBackButton = placementData.disableBackButton;
        this._useDeviceOrientationForVideo = placementData.useDeviceOrientationForVideo;
        this._muteVideo = placementData.muteVideo;
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

CMD.register("platform.Platform", function(require, exports){
    var platform = {};

    platform[platform.ANDROID = 0] = "ANDROID";
    platform[platform.IOS = 1] = "IOS";
    platform[platform.TEST = 2] = "TEST";

    return platform;
});

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
     * 鑾峰彇header鍐呭锛宧eader涓嶅瓨鍦紝杩斿洖null
     * @param headers   {Object} {Array}  澶撮儴瀵硅薄锛屽彲浠ヤ负瀵硅薄{headerKey: headerContent}, 鎴栨暟缁刐[headerKey, headerContent],...s]
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
     * 娉ㄥ唽鍥炶皟鏂规硶锛岀敤浜庤姹傚畬姣曞悗Native璋冪敤
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
     * 鎵цhttp璇锋眰
     * @param callbackId    {Number}    鍥炶皟id
     * @param requestConfig {Object}    璇锋眰閰嶇疆淇℃伅
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
     * request瀹屾垚鍚庢墽琛屽洖璋冿紝浠庣涓変釜鍙傛暟寮€濮嬩綔涓哄洖璋冩柟娉曠殑鍙傛暟
     * @param callbackId {Number} 鍥炶皟id
     * @param callbackState {Number} 鍥炶皟鐘舵€亄0:鎴愬姛|1:澶辫触}
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
     * 璇锋眰澶辫触鐨勫鐞嗘柟娉曪紝濡傛灉璁剧疆鏈夎姹傞噸璇曪紝鍒欓噸璇?
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
     * 浜嬩欢鐩戝惉鍣細璇锋眰鎴愬姛
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
            //閲嶅畾鍚?
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
     * 浜嬩欢鐩戝惉鍣細璇锋眰澶辫触
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
     * 浜嬩欢鐩戝惉鍣細缃戠粶閲嶈繛
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
 * Created by duo on 2016/9/1.
 */
CMD.register("resolve.Resolve", function () {
    function Resolve(nativeBridge) {
        this._nativeBridge = nativeBridge;
        this._nativeBridge.Resolve.onComplete.subscribe(function (callbackId, host, address) {
            return Resolve.onResolveComplete(callbackId, host, address);
        });
        this._nativeBridge.Resolve.onFailed.subscribe(function (callbackId, host, errorName, errorMsg) {
            return Resolve.onResolveFailed(callbackId, host, errorName, errorMsg);
        });
    }
    Resolve.onResolveComplete = function (callbackId, host, address) {
        var callback = Resolve._callbacks[callbackId];
        if(callback){
            callback[0]([host, address]);
            delete Resolve._callbacks[callbackId];
        }
    };
    Resolve.onResolveFailed = function (callbackId, host, errorName, errorMsg) {
        var callback = Resolve._callbacks[callbackId];
        if(callback){
            callback[1]([errorName, errorMsg]);
            delete Resolve._callbacks[callbackId];
        }
    };
    Resolve.prototype.resolve = function (host) {
        var callbackId = Resolve._callbackId++,
            promise = this.registerCallback(callbackId);
        this._nativeBridge.Resolve.resolve(callbackId.toString(), host);
        return promise;
    };
    Resolve.prototype.registerCallback = function (callbackId) {
        return new Promise(function (resolve, reject) {
            var callback = {};
            callback[0] = resolve;
            callback[1] = reject;
            Resolve._callbacks[callbackId] = callback;
        });
    };
    Resolve._callbackId = 1;
    Resolve._callbacks = {};
    return Resolve;
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
 * Created by duo on 2016/9/1.
 */
CMD.register("session.Session", function () {
    function Session(id) {
        this.showSent = false;
        this.startSent = false;
        this.firstQuartileSent = false;
        this.midpointSent = false;
        this.thirdQuartileSent = false;
        this.viewSent = false;
        this.skipSent = false;
        this.impressionSent = false;
        this._id = id;
    }
    Session.prototype.getId = function () {
        return this._id;
    };

    return Session;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("session.SessionManager", function (require) {
    var Session = require("session.Session");
    var SessionManagerEventMetadataCreator = require("session.SessionManagerEventMetadataCreator");
    var sessionProperties = require("Properties").session;
    var Url = require("util.Url");

    function SessionManager(nativeBridge, clientInfo, deviceInfo, eventManager, eventMetadataCreator) {
        this._nativeBridge = nativeBridge;
        this._clientInfo = clientInfo;
        this._deviceInfo = deviceInfo;
        this._eventManager = eventManager;
        this._eventMetadataCreator = eventMetadataCreator || new SessionManagerEventMetadataCreator(this._eventManager, this._deviceInfo, this._nativeBridge);
    }
    SessionManager.setTestBaseUrl = function (baseUrl) {
        SessionManager.VideoEventBaseUrl = baseUrl + "/mobile/gamers";
        SessionManager.ClickEventBaseUrl = baseUrl + "/mobile/campaigns";
    };
    SessionManager.prototype.create = function () {
        var me = this;
        return this._eventManager.getUniqueEventId().then(function (id) {
            me._currentSession = new Session(id);
            return me._eventManager.startNewSession(id);
        });
    };
    SessionManager.prototype.getSession = function () {
        return this._currentSession;
    };
    SessionManager.prototype.setSession = function (session) {
        this._currentSession = session;
    };
    SessionManager.prototype.sendShow = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.showSent){
                return;
            }
            this._currentSession.showSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("show", eventId, metaData.sessionId, me.createShowEventUrl(adUnit), JSON.stringify(metaData));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendImpressionEvent = function (adUnit) {
        if (this._currentSession) {
            if (this._currentSession.impressionSent){
                return;
            }
            this._currentSession.impressionSent = true;
        }
        adUnit.sendImpressionEvent(this._eventManager, this._currentSession.getId());
        adUnit.sendTrackingEvent(this._eventManager, "creativeView", this._currentSession.getId());
    };
    SessionManager.prototype.sendStart = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.startSent) {
                return;
            }
            this._currentSession.startSent = true;
        }
        var sendVent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("start", eventId, metaData.sessionId, me.createVideoEventUrl(adUnit, "video_start"), JSON.stringify(metaData));
            adUnit.sendTrackingEvent(me._eventManager, "start", metaData.sessionId);
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendVent);
    };
    SessionManager.prototype.sendProgress = function (adUnit, session, n, position) {
        session && adUnit.sendProgressEvents(this._eventManager, session.getId(), n, position);
    };
    SessionManager.prototype.sendFirstQuartile = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.firstQuartileSent){
                return;
            }
            this._currentSession.firstQuartileSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("first_quartile", eventId, metaData.sessionId, me.createVideoEventUrl(adUnit, "first_quartile"), JSON.stringify(metaData));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendMidpoint = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.midpointSent) {
                return;
            }
            this._currentSession.midpointSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("midpoint", eventId, metaData.sessionId, me.createVideoEventUrl(adUnit, "midpoint"), JSON.stringify(metaData));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendThirdQuartile = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.thirdQuartileSent){
                return;
            }
            this._currentSession.thirdQuartileSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("third_quartile", eventId, metaData.sessionId, me.createVideoEventUrl(adUnit, "third_quartile"), JSON.stringify(metaData));
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendSkip = function (adUnit, position) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.skipSent){
                return;
            }
            this._currentSession.skipSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            //璺宠繃鏃剁殑杩涘害
            if(position){
                metaData.skippedAt = position;
            }
            me._eventManager.operativeEvent("skip", eventId, me._currentSession.getId(), me.createVideoEventUrl(adUnit, "video_skip"), JSON.stringify(metaData));
        };
        this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendView = function (adUnit) {
        var me = this;
        if (this._currentSession) {
            if (this._currentSession.viewSent) {
                return;
            }
            this._currentSession.viewSent = true;
        }
        var sendEvent = function (res) {
            var eventId = res[0], metaData = res[1];
            me._eventManager.operativeEvent("view", eventId, metaData.sessionId, me.createVideoEventUrl(adUnit, "video_end"), JSON.stringify(metaData));
            adUnit.sendTrackingEvent(me._eventManager, "complete", metaData.sessionId);
        };
        return this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
    };
    SessionManager.prototype.sendClick = function (adUnit) {
        var me = this,
            campaign = adUnit.getCampaign(),
            sendEvent = function (res) {
                var eventId = res[0], metaData = res[1];
                me._eventManager.operativeEvent("click", eventId, me._currentSession.getId(), me.createClickEventUrl(adUnit), JSON.stringify(metaData));
            };
        this._eventMetadataCreator.createUniqueEventMetadata(adUnit, this._currentSession, this._gamerServerId).then(sendEvent);
        if(campaign.getClickAttributionUrl()){
            return this._eventManager.clickAttributionEvent(this._currentSession.getId(), campaign.getClickAttributionUrl(), campaign.getClickAttributionUrlFollowsRedirects())
        }else{
            return Promise.reject("Missing click attribution url");
        }
    };
    SessionManager.prototype.sendMute = function (adUnit, session, isMute) {
        if(isMute){
            adUnit.sendTrackingEvent(this._eventManager, "mute", session.getId())
        }else{
            adUnit.sendTrackingEvent(this._eventManager, "unmute", session.getId());
        }
    };
    SessionManager.prototype.sendVideoClickTracking = function (adUnit, session) {
        adUnit.sendVideoClickTrackingEvent(this._eventManager, session.getId());
    };
    SessionManager.prototype.setGamerServerId = function (id) {
        this._gamerServerId = id;
    };
    SessionManager.prototype.createShowEventUrl = function (adUnit) {
        var campaign = adUnit.getCampaign();
        return [SessionManager.VideoEventBaseUrl, campaign.getGamerId(), "show", campaign.getId(), this._clientInfo.getGameId()].join("/");
    };
    SessionManager.prototype.createVideoEventUrl = function (adUnit, eventName) {
        var campaign = adUnit.getCampaign();
        return [SessionManager.VideoEventBaseUrl, campaign.getGamerId(), "video", eventName, campaign.getId(), this._clientInfo.getGameId()].join("/");
    };
    SessionManager.prototype.createClickEventUrl = function (adUnit) {
        var campaign = adUnit.getCampaign(),
            r = [SessionManager.ClickEventBaseUrl, campaign.getId(), "click", campaign.getGamerId()].join("/");
        return Url.addParameters(r, {
            gameId: this._clientInfo.getGameId(),
            redirect: false
        });
    };
    SessionManager.VideoEventBaseUrl = sessionProperties.VIDEO_EVENT_BASE_URL;
    SessionManager.ClickEventBaseUrl = sessionProperties.CLICK_EVENT_BASE_URL;

    return SessionManager;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("session.SessionManagerEventMetadataCreator", function (require) {
    var MetaDataManager = require("metadata.MetaDataManager");

    function SessionManagerEventMetadataCreator(eventManager, deviceInfo, nativeBridge) {
        this._eventManager = eventManager;
        this._deviceInfo = deviceInfo;
        this._nativeBridge = nativeBridge;
    }
    SessionManagerEventMetadataCreator.prototype.createUniqueEventMetadata = function (adUnit, session, gamerServerId) {
        var me = this;
        return this._eventManager.getUniqueEventId().then(function (eventId) {
            return me.getInfoJson(adUnit, eventId, session, gamerServerId);
        });
    };
    SessionManagerEventMetadataCreator.prototype.getInfoJson = function (adUnit, eventId, session, sid) {
        var me = this;
        var metaData = {
            eventId: eventId,
            sessionId: session.getId(),
            gamerId: adUnit.getCampaign().getGamerId(),
            campaignId: adUnit.getCampaign().getId(),
            placementId: adUnit.getPlacement().getId(),
            apiLevel: this._deviceInfo.getApiLevel(),
            cached: true,
            advertisingId: this._deviceInfo.getAdvertisingIdentifier(),
            trackingEnabled: this._deviceInfo.getLimitAdTracking(),
            osVersion: this._deviceInfo.getOsVersion(),
            sid: sid,
            deviceMake: this._deviceInfo.getManufacturer(),
            deviceModel: this._deviceInfo.getModel()
        };
        var tasks = [];
        tasks.push(this._deviceInfo.getNetworkType());
        tasks.push(this._deviceInfo.getConnectionType());

        return Promise.all(tasks).then(function (res) {
            metaData.networkType = res[0];
            metaData.connectionType = res[1];
            return MetaDataManager.fetchMediationMetaData(me._nativeBridge).then(function (mediation) {
                if(mediation){
                    metaData.mediationName = mediation.getName();
                    metaData.mediationVersion = mediation.getVersion();
                    metaData.mediationOrdinal = mediation.getOrdinal();
                }
                return [eventId, metaData];
            });
        });
    };
    return SessionManagerEventMetadataCreator;
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
 * Created by duo on 2016/9/1.
 */
CMD.register("util.Diagnostics", function (require) {
    var diagnosticsProperties = require("Properties").diagnostics;
    function Diagnostics() {
    }
    Diagnostics.trigger = function (eventManager, error, clientInfo, deviceInfo) {
        var infoList = [];
        infoList.push({
            type: "ads.sdk2.diagnostics",
            msg: error
        });
        return Diagnostics.createCommonObject(clientInfo, deviceInfo).then(function (o) {
            infoList.unshift(o);
            var arr = infoList.map(function (info) {
                return JSON.stringify(info);
            }).join("\n");
            return eventManager.diagnosticEvent(Diagnostics.DiagnosticsBaseUrl, arr);
        });
    };
    Diagnostics.createCommonObject = function (clientInfo, deviceInfo) {
        var o = {
            common: {
                client: clientInfo ? clientInfo.getDTO() : null,
                device: null
            }
        };
        if(deviceInfo){
            return deviceInfo.getDTO().then(function (deviceDto) {
                o.device = deviceDto;
                return o;
            })["catch"](function () {
                return o;
            });
        }else{
            return Promise.resolve(o);
        }
    };
    Diagnostics.setTestBaseUrl = function (baseUrl) {
        Diagnostics.DiagnosticsBaseUrl = baseUrl + "/v1/events";
    };
    Diagnostics.DiagnosticsBaseUrl = diagnosticsProperties.DIAGNOSTICS_BASE_URL;
    return Diagnostics;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("util.DOMParser", function () {
    function DOMParser(e) {
        this.options = e || {
                locator: {}
            };
    }

    function t(e, t, i) {
        function o(t) {
            var n = e[t];
            !n && s && (n = 2 == e.length ? function (n) {
                e(t, n);
            } : e), a[t] = n && function (e) {
                    n("[xmldom " + t + "]	" + e + r(i));
                } || function () {
                };
        }

        if (!e) {
            if (t instanceof n) return t;
            e = t;
        }
        var a = {}, s = e instanceof Function;
        return i = i || {}, o("warning"), o("error"), o("fatalError"), a;
    }

    function n() {
        this.cdata = !1;
    }

    function i(e, t) {
        t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber;
    }

    function r(e) {
        return e ? "\n@" + (e.systemId || "") + "#[line:" + e.lineNumber + ",col:" + e.columnNumber + "]" : void 0;
    }

    function o(e, t, n) {
        return "string" == typeof e ? e.substr(t, n) : e.length >= t + n || t ? new java.lang.String(e, t, n) + "" : e;
    }

    function a(e, t) {
        e.currentElement ? e.currentElement.appendChild(t) : e.document.appendChild(t);
    }

    var s = function () {
            function e(e, t) {
                for (var n in e) t[n] = e[n];
            }

            function t(t, n) {
                function i() {
                }

                var r = t.prototype;
                if (Object.create) {
                    var o = Object.create(n.prototype);
                    r.__proto__ = o;
                }
                r instanceof n || (i.prototype = n.prototype, i = new i(), e(r, i), t.prototype = r = i),
                r.constructor != t && ("function" != typeof t && console.error("unknow Class:" + t),
                    r.constructor = t);
            }

            function n(e, t) {
                if (t instanceof Error) var i = t; else i = this, Error.call(this, ee[e]), this.message = ee[e],
                Error.captureStackTrace && Error.captureStackTrace(this, n);
                return i.code = e, t && (this.message = this.message + ": " + t), i;
            }

            function i() {
            }

            function r(e, t) {
                this._node = e, this._refresh = t, o(this);
            }

            function o(t) {
                var n = t._node._inc || t._node.ownerDocument._inc;
                if (t._inc != n) {
                    var i = t._refresh(t._node);
                    V(t, "length", i.length), e(i, t), t._inc = n;
                }
            }

            function a() {
            }

            function s(e, t) {
                for (var n = e.length; n--;) if (e[n] === t) return n;
            }

            function c(e, t, n, i) {
                if (i ? t[s(t, i)] = n : t[t.length++] = n, e) {
                    n.ownerElement = e;
                    var r = e.ownerDocument;
                    r && (i && g(r, e, i), v(r, e, n));
                }
            }

            function u(e, t, i) {
                var r = s(t, i);
                if (!(r >= 0)) throw n(te, new Error());
                for (var o = t.length - 1; o > r;) t[r] = t[++r];
                if (t.length = o, e) {
                    var a = e.ownerDocument;
                    a && (g(a, e, i), i.ownerElement = null);
                }
            }

            function l(e) {
                if (this._features = {}, e) for (var t in e) this._features = e[t];
            }

            function h() {
            }

            function p(e) {
                return "<" == e && "&lt;" || ">" == e && "&gt;" || "&" == e && "&amp;" || '"' == e && "&quot;" || "&#" + e.charCodeAt() + ";";
            }

            function d(e, t) {
                if (t(e)) return !0;
                if (e = e.firstChild) do if (d(e, t)) return !0; while (e = e.nextSibling);
            }

            function f() {
            }

            function v(e, t, n) {
                e && e._inc++;
                var i = n.namespaceURI;
                "http://www.w3.org/2000/xmlns/" == i && (t._nsMap[n.prefix ? n.localName : ""] = n.value);
            }

            function g(e, t, n, i) {
                e && e._inc++;
                var r = n.namespaceURI;
                "http://www.w3.org/2000/xmlns/" == r && delete t._nsMap[n.prefix ? n.localName : ""];
            }

            function _(e, t, n) {
                if (e && e._inc) {
                    e._inc++;
                    var i = t.childNodes;
                    if (n) i[i.length++] = n; else {
                        for (var r = t.firstChild, o = 0; r;) i[o++] = r, r = r.nextSibling;
                        i.length = o;
                    }
                }
            }

            function m(e, t) {
                var n = t.previousSibling, i = t.nextSibling;
                return n ? n.nextSibling = i : e.firstChild = i, i ? i.previousSibling = n : e.lastChild = n,
                    _(e.ownerDocument, e), t;
            }

            function y(e, t, n) {
                var i = t.parentNode;
                if (i && i.removeChild(t), t.nodeType === X) {
                    var r = t.firstChild;
                    if (null == r) return t;
                    var o = t.lastChild;
                } else r = o = t;
                var a = n ? n.previousSibling : e.lastChild;
                r.previousSibling = a, o.nextSibling = n, a ? a.nextSibling = r : e.firstChild = r,
                    null == n ? e.lastChild = o : n.previousSibling = o;
                do r.parentNode = e; while (r !== o && (r = r.nextSibling));
                return _(e.ownerDocument || e, e), t.nodeType == X && (t.firstChild = t.lastChild = null),
                    t;
            }

            function E(e, t) {
                var n = t.parentNode;
                if (n) {
                    var i = e.lastChild;
                    n.removeChild(t);
                    var i = e.lastChild;
                }
                var i = e.lastChild;
                return t.parentNode = e, t.previousSibling = i, t.nextSibling = null, i ? i.nextSibling = t : e.firstChild = t,
                    e.lastChild = t, _(e.ownerDocument, e, t), t;
            }

            function S() {
                this._nsMap = {};
            }

            function I() {
            }

            function C() {
            }

            function A() {
            }

            function b() {
            }

            function O() {
            }

            function T() {
            }

            function w() {
            }

            function N() {
            }

            function R() {
            }

            function D() {
            }

            function k() {
            }

            function P() {
            }

            function B(e, t, n, i) {
                switch (e.nodeType) {
                    case W:
                        var r = e.attributes, o = r.length, a = e.firstChild, s = e.tagName;
                        i = F === e.namespaceURI || i, t.push("<", s), n && t.sort.apply(r, n);
                        for (var c = 0; o > c; c++) B(r.item(c), t, n, i);
                        if (a || i && !/^(?:meta|link|img|br|hr|input|button)$/i.test(s)) {
                            if (t.push(">"), i && /^script$/i.test(s)) a && t.push(a.data); else for (; a;) B(a, t, n, i),
                                a = a.nextSibling;
                            t.push("</", s, ">");
                        } else t.push("/>");
                        return;

                    case Q:
                    case X:
                        for (var a = e.firstChild; a;) B(a, t, n, i), a = a.nextSibling;
                        return;

                    case q:
                        return t.push(" ", e.name, '="', e.value.replace(/[<&"]/g, p), '"');

                    case K:
                        return t.push(e.data.replace(/[<&]/g, p));

                    case H:
                        return t.push("<![CDATA[", e.data, "]]>");

                    case z:
                        return t.push("<!--", e.data, "-->");

                    case J:
                        var u = e.publicId, l = e.systemId;
                        if (t.push("<!DOCTYPE ", e.name), u) t.push(' PUBLIC "', u), l && "." != l && t.push('" "', l),
                            t.push('">'); else if (l && "." != l) t.push(' SYSTEM "', l, '">'); else {
                            var h = e.internalSubset;
                            h && t.push(" [", h, "]"), t.push(">");
                        }
                        return;

                    case Y:
                        return t.push("<?", e.target, " ", e.data, "?>");

                    case j:
                        return t.push("&", e.nodeName, ";");

                    default:
                        t.push("??", e.nodeName);
                }
            }

            function L(e, t, n) {
                var i;
                switch (t.nodeType) {
                    case W:
                        i = t.cloneNode(!1), i.ownerDocument = e;

                    case X:
                        break;

                    case q:
                        n = !0;
                }
                if (i || (i = t.cloneNode(!1)), i.ownerDocument = e, i.parentNode = null, n) for (var r = t.firstChild; r;) i.appendChild(L(e, r, n)),
                    r = r.nextSibling;
                return i;
            }

            function U(e, t, n) {
                var r = new t.constructor();
                for (var o in t) {
                    var s = t[o];
                    "object" != typeof s && s != r[o] && (r[o] = s);
                }
                switch (t.childNodes && (r.childNodes = new i()), r.ownerDocument = e, r.nodeType) {
                    case W:
                        var c = t.attributes, u = r.attributes = new a(), l = c.length;
                        u._ownerElement = r;
                        for (var h = 0; l > h; h++) r.setAttributeNode(U(e, c.item(h), !0));
                        break;

                    case q:
                        n = !0;
                }
                if (n) for (var p = t.firstChild; p;) r.appendChild(U(e, p, n)), p = p.nextSibling;
                return r;
            }

            function V(e, t, n) {
                e[t] = n;
            }

            function M(e) {
                switch (e.nodeType) {
                    case 1:
                    case 11:
                        var t = [];
                        for (e = e.firstChild; e;) 7 !== e.nodeType && 8 !== e.nodeType && t.push(M(e)),
                            e = e.nextSibling;
                        return t.join("");

                    default:
                        return e.nodeValue;
                }
            }

            var F = "http://www.w3.org/1999/xhtml",
                x = {},
                W = x.ELEMENT_NODE = 1,
                q = x.ATTRIBUTE_NODE = 2,
                K = x.TEXT_NODE = 3,
                H = x.CDATA_SECTION_NODE = 4,
                j = x.ENTITY_REFERENCE_NODE = 5,
                G = x.ENTITY_NODE = 6,
                Y = x.PROCESSING_INSTRUCTION_NODE = 7,
                z = x.COMMENT_NODE = 8,
                Q = x.DOCUMENT_NODE = 9,
                J = x.DOCUMENT_TYPE_NODE = 10,
                X = x.DOCUMENT_FRAGMENT_NODE = 11,
                $ = x.NOTATION_NODE = 12,
                Z = {},
                ee = {},
                te = (Z.INDEX_SIZE_ERR = (ee[1] = "Index size error",
                    1), Z.DOMSTRING_SIZE_ERR = (ee[2] = "DOMString size error", 2), Z.HIERARCHY_REQUEST_ERR = (ee[3] = "Hierarchy request error",
                    3), Z.WRONG_DOCUMENT_ERR = (ee[4] = "Wrong document", 4), Z.INVALID_CHARACTER_ERR = (ee[5] = "Invalid character",
                    5), Z.NO_DATA_ALLOWED_ERR = (ee[6] = "No data allowed", 6), Z.NO_MODIFICATION_ALLOWED_ERR = (ee[7] = "No modification allowed",
                    7), Z.NOT_FOUND_ERR = (ee[8] = "Not found", 8)),
                ne = (Z.NOT_SUPPORTED_ERR = (ee[9] = "Not supported",
                    9), Z.INUSE_ATTRIBUTE_ERR = (ee[10] = "Attribute in use", 10));

            Z.INVALID_STATE_ERR = (ee[11] = "Invalid state", 11);
            Z.SYNTAX_ERR = (ee[12] = "Syntax error", 12);
            Z.INVALID_MODIFICATION_ERR = (ee[13] = "Invalid modification", 13);
            Z.NAMESPACE_ERR = (ee[14] = "Invalid namespace", 14);
            Z.INVALID_ACCESS_ERR = (ee[15] = "Invalid access", 15);

            n.prototype = Error.prototype;
            e(Z, n);
            i.prototype = {
                length: 0,
                item: function (e) {
                    return this[e] || null;
                },
                toString: function () {
                    for (var e = [], t = 0; t < this.length; t++) B(this[t], e);
                    return e.join("");
                }
            };
            r.prototype.item = function (e) {
                return o(this), this[e];
            };
            t(r, i);
            a.prototype = {
                length: 0,
                item: i.prototype.item,
                getNamedItem: function (e) {
                    for (var t = this.length; t--;) {
                        var n = this[t];
                        if (n.nodeName == e) return n;
                    }
                },
                setNamedItem: function (e) {
                    var t = e.ownerElement;
                    if (t && t != this._ownerElement) throw new n(ne);
                    var i = this.getNamedItem(e.nodeName);
                    return c(this._ownerElement, this, e, i), i;
                },
                setNamedItemNS: function (e) {
                    var t, i = e.ownerElement;
                    if (i && i != this._ownerElement) throw new n(ne);
                    return t = this.getNamedItemNS(e.namespaceURI, e.localName), c(this._ownerElement, this, e, t),
                        t;
                },
                removeNamedItem: function (e) {
                    var t = this.getNamedItem(e);
                    return u(this._ownerElement, this, t), t;
                },
                removeNamedItemNS: function (e, t) {
                    var n = this.getNamedItemNS(e, t);
                    return u(this._ownerElement, this, n), n;
                },
                getNamedItemNS: function (e, t) {
                    for (var n = this.length; n--;) {
                        var i = this[n];
                        if (i.localName == t && i.namespaceURI == e) return i;
                    }
                    return null;
                }
            };
            l.prototype = {
                hasFeature: function (e, t) {
                    var n = this._features[e.toLowerCase()];
                    return n && (!t || t in n) ? !0 : !1;
                },
                createDocument: function (e, t, n) {
                    var r = new f();
                    if (r.implementation = this, r.childNodes = new i(), r.doctype = n, n && r.appendChild(n),
                            t) {
                        var o = r.createElementNS(e, t);
                        r.appendChild(o);
                    }
                    return r;
                },
                createDocumentType: function (e, t, n) {
                    var i = new T();
                    return i.name = e, i.nodeName = e, i.publicId = t, i.systemId = n, i;
                }
            };
            h.prototype = {
                firstChild: null,
                lastChild: null,
                previousSibling: null,
                nextSibling: null,
                attributes: null,
                parentNode: null,
                childNodes: null,
                ownerDocument: null,
                nodeValue: null,
                namespaceURI: null,
                prefix: null,
                localName: null,
                insertBefore: function (e, t) {
                    return y(this, e, t);
                },
                replaceChild: function (e, t) {
                    this.insertBefore(e, t), t && this.removeChild(t);
                },
                removeChild: function (e) {
                    return m(this, e);
                },
                appendChild: function (e) {
                    return this.insertBefore(e, null);
                },
                hasChildNodes: function () {
                    return null != this.firstChild;
                },
                cloneNode: function (e) {
                    return U(this.ownerDocument || this, this, e);
                },
                normalize: function () {
                    for (var e = this.firstChild; e;) {
                        var t = e.nextSibling;
                        t && t.nodeType == K && e.nodeType == K ? (this.removeChild(t), e.appendData(t.data)) : (e.normalize(),
                            e = t);
                    }
                },
                isSupported: function (e, t) {
                    return this.ownerDocument.implementation.hasFeature(e, t);
                },
                hasAttributes: function () {
                    return this.attributes.length > 0;
                },
                lookupPrefix: function (e) {
                    for (var t = this; t;) {
                        var n = t._nsMap;
                        if (n) for (var i in n) if (n[i] == e) return i;
                        t = 2 == t.nodeType ? t.ownerDocument : t.parentNode;
                    }
                    return null;
                },
                lookupNamespaceURI: function (e) {
                    for (var t = this; t;) {
                        var n = t._nsMap;
                        if (n && e in n) return n[e];
                        t = 2 == t.nodeType ? t.ownerDocument : t.parentNode;
                    }
                    return null;
                },
                isDefaultNamespace: function (e) {
                    var t = this.lookupPrefix(e);
                    return null == t;
                }
            };
            e(x, h);
            e(x, h.prototype);

            f.prototype = {
                nodeName: "#document",
                nodeType: Q,
                doctype: null,
                documentElement: null,
                _inc: 1,
                insertBefore: function (e, t) {
                    if (e.nodeType == X) {
                        for (var n = e.firstChild; n;) {
                            var i = n.nextSibling;
                            this.insertBefore(n, t), n = i;
                        }
                        return e;
                    }
                    return null == this.documentElement && 1 == e.nodeType && (this.documentElement = e),
                        y(this, e, t), e.ownerDocument = this, e;
                },
                removeChild: function (e) {
                    return this.documentElement == e && (this.documentElement = null), m(this, e);
                },
                importNode: function (e, t) {
                    return L(this, e, t);
                },
                getElementById: function (e) {
                    var t = null;
                    return d(this.documentElement, function (n) {
                        return 1 == n.nodeType && n.getAttribute("id") == e ? (t = n, !0) : void 0;
                    }), t;
                },
                createElement: function (e) {
                    var t = new S();
                    t.ownerDocument = this, t.nodeName = e, t.tagName = e, t.childNodes = new i();
                    var n = t.attributes = new a();
                    return n._ownerElement = t, t;
                },
                createDocumentFragment: function () {
                    var e = new D();
                    return e.ownerDocument = this, e.childNodes = new i(), e;
                },
                createTextNode: function (e) {
                    var t = new A();
                    return t.ownerDocument = this, t.appendData(e), t;
                },
                createComment: function (e) {
                    var t = new b();
                    return t.ownerDocument = this, t.appendData(e), t;
                },
                createCDATASection: function (e) {
                    var t = new O();
                    return t.ownerDocument = this, t.appendData(e), t;
                },
                createProcessingInstruction: function (e, t) {
                    var n = new k();
                    return n.ownerDocument = this, n.tagName = n.target = e, n.nodeValue = n.data = t,
                        n;
                },
                createAttribute: function (e) {
                    var t = new I();
                    return t.ownerDocument = this, t.name = e, t.nodeName = e, t.localName = e, t.specified = !0,
                        t;
                },
                createEntityReference: function (e) {
                    var t = new R();
                    return t.ownerDocument = this, t.nodeName = e, t;
                },
                createElementNS: function (e, t) {
                    var n = new S(), r = t.split(":"), o = n.attributes = new a();
                    return n.childNodes = new i(), n.ownerDocument = this, n.nodeName = t, n.tagName = t,
                        n.namespaceURI = e, 2 == r.length ? (n.prefix = r[0], n.localName = r[1]) : n.localName = t,
                        o._ownerElement = n, n;
                },
                createAttributeNS: function (e, t) {
                    var n = new I(), i = t.split(":");
                    return n.ownerDocument = this, n.nodeName = t, n.name = t, n.namespaceURI = e, n.specified = !0,
                        2 == i.length ? (n.prefix = i[0], n.localName = i[1]) : n.localName = t, n;
                }
            };
            t(f, h);

            S.prototype = {
                nodeType: W,
                hasAttribute: function (e) {
                    return null != this.getAttributeNode(e);
                },
                getAttribute: function (e) {
                    var t = this.getAttributeNode(e);
                    return t && t.value || "";
                },
                getAttributeNode: function (e) {
                    return this.attributes.getNamedItem(e);
                },
                setAttribute: function (e, t) {
                    var n = this.ownerDocument.createAttribute(e);
                    n.value = n.nodeValue = "" + t, this.setAttributeNode(n);
                },
                removeAttribute: function (e) {
                    var t = this.getAttributeNode(e);
                    t && this.removeAttributeNode(t);
                },
                appendChild: function (e) {
                    return e.nodeType === X ? this.insertBefore(e, null) : E(this, e);
                },
                setAttributeNode: function (e) {
                    return this.attributes.setNamedItem(e);
                },
                setAttributeNodeNS: function (e) {
                    return this.attributes.setNamedItemNS(e);
                },
                removeAttributeNode: function (e) {
                    return this.attributes.removeNamedItem(e.nodeName);
                },
                removeAttributeNS: function (e, t) {
                    var n = this.getAttributeNodeNS(e, t);
                    n && this.removeAttributeNode(n);
                },
                hasAttributeNS: function (e, t) {
                    return null != this.getAttributeNodeNS(e, t);
                },
                getAttributeNS: function (e, t) {
                    var n = this.getAttributeNodeNS(e, t);
                    return n && n.value || "";
                },
                setAttributeNS: function (e, t, n) {
                    var i = this.ownerDocument.createAttributeNS(e, t);
                    i.value = i.nodeValue = "" + n, this.setAttributeNode(i);
                },
                getAttributeNodeNS: function (e, t) {
                    return this.attributes.getNamedItemNS(e, t);
                },
                getElementsByTagName: function (e) {
                    return new r(this, function (t) {
                        var n = [];
                        return d(t, function (i) {
                            i === t || i.nodeType != W || "*" !== e && i.tagName != e || n.push(i);
                        }), n;
                    });
                },
                getElementsByTagNameNS: function (e, t) {
                    return new r(this, function (n) {
                        var i = [];
                        return d(n, function (r) {
                            r === n || r.nodeType !== W || "*" !== e && r.namespaceURI !== e || "*" !== t && r.localName != t || i.push(r);
                        }), i;
                    });
                }
            };

            f.prototype.getElementsByTagName = S.prototype.getElementsByTagName, f.prototype.getElementsByTagNameNS = S.prototype.getElementsByTagNameNS,
                t(S, h), I.prototype.nodeType = q, t(I, h), C.prototype = {
                data: "",
                substringData: function (e, t) {
                    return this.data.substring(e, e + t);
                },
                appendData: function (e) {
                    e = this.data + e, this.nodeValue = this.data = e, this.length = e.length;
                },
                insertData: function (e, t) {
                    this.replaceData(e, 0, t);
                },
                appendChild: function (e) {
                    throw new Error(ee[3]);
                },
                deleteData: function (e, t) {
                    this.replaceData(e, t, "");
                },
                replaceData: function (e, t, n) {
                    var i = this.data.substring(0, e), r = this.data.substring(e + t);
                    n = i + n + r, this.nodeValue = this.data = n, this.length = n.length;
                }
            };
            t(C, h);

            A.prototype = {
                nodeName: "#text",
                nodeType: K,
                splitText: function (e) {
                    var t = this.data, n = t.substring(e);
                    t = t.substring(0, e), this.data = this.nodeValue = t, this.length = t.length;
                    var i = this.ownerDocument.createTextNode(n);
                    return this.parentNode && this.parentNode.insertBefore(i, this.nextSibling), i;
                }
            };
            t(A, C);

            b.prototype = {
                nodeName: "#comment",
                nodeType: z
            };
            t(b, C);

            O.prototype = {
                nodeName: "#cdata-section",
                nodeType: H
            };
            t(O, C);

            T.prototype.nodeType = J;
            t(T, h);

            w.prototype.nodeType = $;
            t(w, h);

            N.prototype.nodeType = G;
            t(N, h);

            R.prototype.nodeType = j;
            t(R, h);

            D.prototype.nodeName = "#document-fragment";
            D.prototype.nodeType = X;
            t(D, h);

            k.prototype.nodeType = Y;
            t(k, h);

            P.prototype.serializeToString = function (e, t) {
                return e.toString(t);
            };

            h.prototype.toString = function (e) {
                var t = [];
                B(this, t, e);
                return t.join("");
            };

            try {
                if(Object.defineProperty){
                    Object.defineProperty(r.prototype, "length", {
                        get: function () {
                            return o(this), this.$length;
                        }
                    });
                    Object.defineProperty(h.prototype, "textContent", {
                        get: function () {
                            return M(this);
                        },
                        set: function (e) {
                            switch (this.nodeType) {
                                case 1:
                                case 11:
                                    for (; this.firstChild;) this.removeChild(this.firstChild);
                                    (e || String(e)) && this.appendChild(this.ownerDocument.createTextNode(e));
                                    break;

                                default:
                                    this.data = e, this.value = value, this.nodeValue = e;
                            }
                        }
                    });
                    V = function (e, t, n) {
                        e["$" + t] = n;
                    };
                }
            } catch (ie) {
            }
            var re = {
                DOMImplementation: l,
                XMLSerializer: P
            };
            return re;
        },

        c = function () {
            function e(e, a, l, h, p) {
                function d(e) {
                    if (e > 65535) {
                        e -= 65536;
                        var t = 55296 + (e >> 10), n = 56320 + (1023 & e);
                        return String.fromCharCode(t, n);
                    }
                    return String.fromCharCode(e);
                }

                function f(e) {
                    var t = e.slice(1, -1);
                    return t in l ? l[t] : "#" === t.charAt(0) ? d(parseInt(t.substr(1).replace("x", "0x"))) : (p.error("entity not found:" + e),
                        e);
                }

                function v(t) {
                    if (t > C) {
                        var n = e.substring(C, t).replace(/&#?\w+;/g, f);
                        E && g(C), h.characters(n, 0, t - C), C = t;
                    }
                }

                function g(t, n) {
                    for (; t >= m && (n = y.exec(e));) _ = n.index, m = _ + n[0].length, E.lineNumber++;
                    E.columnNumber = t - _ + 1;
                }

                for (var _ = 0, m = 0, y = /.+(?:\r\n?|\n)|.*$/g, E = h.locator, S = [{
                    currentNSMap: a
                }], I = {}, C = 0; ;) {
                    try {
                        var A = e.indexOf("<", C);
                        if (0 > A) {
                            if (!e.substr(C).match(/^\s*$/)) {
                                var b = h.document, O = b.createTextNode(e.substr(C));
                                b.appendChild(O), h.currentElement = O;
                            }
                            return;
                        }
                        switch (A > C && v(A), e.charAt(A + 1)) {
                            case "/":
                                var T = e.indexOf(">", A + 3), w = e.substring(A + 2, T), N = S.pop(), R = N.localNSMap;
                                if (N.tagName != w && p.fatalError("end tag name: " + w + " is not match the current start tagName:" + N.tagName),
                                        h.endElement(N.uri, N.localName, w), R) for (var D in R) h.endPrefixMapping(D);
                                T++;
                                break;

                            case "?":
                                E && g(A), T = c(e, A, h);
                                break;

                            case "!":
                                E && g(A), T = s(e, A, h, p);
                                break;

                            default:
                                E && g(A);
                                var k = new u(), T = n(e, A, k, f, p), P = k.length;
                                if (E) {
                                    if (P) for (var B = 0; P > B; B++) {
                                        var L = k[B];
                                        g(L.offset), L.offset = t(E, {});
                                    }
                                    g(T);
                                }
                                !k.closed && o(e, T, k.tagName, I) && (k.closed = !0, l.nbsp || p.warning("unclosed xml attribute")),
                                    i(k, h, S), "http://www.w3.org/1999/xhtml" !== k.uri || k.closed ? T++ : T = r(e, T, k.tagName, f, h);
                        }
                    } catch (U) {
                        p.error("element parse error: " + U), T = -1;
                    }
                    T > C ? C = T : v(Math.max(A, C) + 1);
                }
            }

            function t(e, t) {
                return t.lineNumber = e.lineNumber, t.columnNumber = e.columnNumber, t;
            }

            function n(e, t, n, i, r) {
                for (var o, a, s = ++t, c = v; ;) {
                    var u = e.charAt(s);
                    switch (u) {
                        case "=":
                            if (c === g) o = e.slice(t, s), c = m; else {
                                if (c !== _) throw new Error("attribute equal must after attrName");
                                c = m;
                            }
                            break;

                        case "'":
                        case '"':
                            if (c === m) {
                                if (t = s + 1, s = e.indexOf(u, t), !(s > 0)) throw new Error("attribute value no end '" + u + "' match");
                                a = e.slice(t, s).replace(/&#?\w+;/g, i), n.add(o, a, t - 1), c = E;
                            } else {
                                if (c != y) throw new Error('attribute value must after "="');
                                a = e.slice(t, s).replace(/&#?\w+;/g, i), n.add(o, a, t), r.warning('attribute "' + o + '" missed start quot(' + u + ")!!"),
                                    t = s + 1, c = E;
                            }
                            break;

                        case "/":
                            switch (c) {
                                case v:
                                    n.setTagName(e.slice(t, s));

                                case E:
                                case S:
                                case I:
                                    c = I, n.closed = !0;

                                case y:
                                case g:
                                case _:
                                    break;

                                default:
                                    throw new Error("attribute invalid close char('/')");
                            }
                            break;

                        case "":
                            r.error("unexpected end of input");

                        case ">":
                            switch (c) {
                                case v:
                                    n.setTagName(e.slice(t, s));

                                case E:
                                case S:
                                case I:
                                    break;

                                case y:
                                case g:
                                    a = e.slice(t, s), "/" === a.slice(-1) && (n.closed = !0, a = a.slice(0, -1));

                                case _:
                                    c === _ && (a = o), c == y ? (r.warning('attribute "' + a + '" missed quot(")!!'),
                                        n.add(o, a.replace(/&#?\w+;/g, i), t)) : (r.warning('attribute "' + a + '" missed value!! "' + a + '" instead!!'),
                                        n.add(a, a, t));
                                    break;

                                case m:
                                    throw new Error("attribute value missed!!");
                            }
                            return s;

                        case "?":
                            u = " ";

                        default:
                            if (" " >= u) switch (c) {
                                case v:
                                    n.setTagName(e.slice(t, s)), c = S;
                                    break;

                                case g:
                                    o = e.slice(t, s), c = _;
                                    break;

                                case y:
                                    var a = e.slice(t, s).replace(/&#?\w+;/g, i);
                                    r.warning('attribute "' + a + '" missed quot(")!!'), n.add(o, a, t);

                                case E:
                                    c = S;
                            } else switch (c) {
                                case _:
                                    r.warning('attribute "' + o + '" missed value!! "' + o + '" instead!!'), n.add(o, o, t),
                                        t = s, c = g;
                                    break;

                                case E:
                                    r.warning('attribute space is required"' + o + '"!!');

                                case S:
                                    c = g, t = s;
                                    break;

                                case m:
                                    c = y, t = s;
                                    break;

                                case I:
                                    throw new Error("elements closed character '/' and '>' must be connected to");
                            }
                    }
                    s++;
                }
            }

            function i(e, t, n) {
                for (var i = e.tagName, r = null, o = n[n.length - 1].currentNSMap, s = e.length; s--;) {
                    var c = e[s], u = c.qName, l = c.value, h = u.indexOf(":");
                    if (h > 0) var p = c.prefix = u.slice(0, h), d = u.slice(h + 1), f = "xmlns" === p && d; else d = u,
                        p = null, f = "xmlns" === u && "";
                    c.localName = d, f !== !1 && (null == r && (r = {}, a(o, o = {})), o[f] = r[f] = l,
                        c.uri = "http://www.w3.org/2000/xmlns/", t.startPrefixMapping(f, l));
                }
                for (var s = e.length; s--;) {
                    c = e[s];
                    var p = c.prefix;
                    p && ("xml" === p && (c.uri = "http://www.w3.org/XML/1998/namespace"), "xmlns" !== p && (c.uri = o[p]));
                }
                var h = i.indexOf(":");
                h > 0 ? (p = e.prefix = i.slice(0, h), d = e.localName = i.slice(h + 1)) : (p = null,
                    d = e.localName = i);
                var v = e.uri = o[p || ""];
                if (t.startElement(v, d, i, e), e.closed) {
                    if (t.endElement(v, d, i), r) for (p in r) t.endPrefixMapping(p);
                } else e.currentNSMap = o, e.localNSMap = r, n.push(e);
            }

            function r(e, t, n, i, r) {
                if (/^(?:script|textarea)$/i.test(n)) {
                    var o = e.indexOf("</" + n + ">", t), a = e.substring(t + 1, o);
                    if (/[&<]/.test(a)) return /^script$/i.test(n) ? (r.characters(a, 0, a.length),
                        o) : (a = a.replace(/&#?\w+;/g, i), r.characters(a, 0, a.length), o);
                }
                return t + 1;
            }

            function o(e, t, n, i) {
                var r = i[n];
                return null == r && (r = i[n] = e.lastIndexOf("</" + n + ">")), t > r;
            }

            function a(e, t) {
                for (var n in e) t[n] = e[n];
            }

            function s(e, t, n, i) {
                var r = e.charAt(t + 2);
                switch (r) {
                    case "-":
                        if ("-" === e.charAt(t + 3)) {
                            var o = e.indexOf("-->", t + 4);
                            return o > t ? (n.comment(e, t + 4, o - t - 4), o + 3) : (i.error("Unclosed comment"),
                                -1);
                        }
                        return -1;

                    default:
                        if ("CDATA[" == e.substr(t + 3, 6)) {
                            var o = e.indexOf("]]>", t + 9);
                            return n.startCDATA(), n.characters(e, t + 9, o - t - 9), n.endCDATA(), o + 3;
                        }
                        var a = h(e, t), s = a.length;
                        if (s > 1 && /!doctype/i.test(a[0][0])) {
                            var c = a[1][0], u = s > 3 && /^public$/i.test(a[2][0]) && a[3][0], l = s > 4 && a[4][0], p = a[s - 1];
                            return n.startDTD(c, u && u.replace(/^(['"])(.*?)\1$/, "$2"), l && l.replace(/^(['"])(.*?)\1$/, "$2")),
                                n.endDTD(), p.index + p[0].length;
                        }
                }
                return -1;
            }

            function c(e, t, n) {
                var i = e.indexOf("?>", t);
                if (i) {
                    var r = e.substring(t, i).match(/^<\?(\S*)\s*([\s\S]*?)\s*$/);
                    if (r) {
                        r[0].length;
                        return n.processingInstruction(r[1], r[2]), i + 2;
                    }
                    return -1;
                }
                return -1;
            }

            function u(e) {
            }

            function l(e, t) {
                return e.__proto__ = t, e;
            }

            function h(e, t) {
                var n, i = [], r = /'[^']+'|"[^"]+"|[^\s<>\/=]+=?|(\/?\s*>|<)/g;
                for (r.lastIndex = t, r.exec(e); n = r.exec(e);) if (i.push(n), n[1]) return i;
            }

            var p = /[A-Z_a-z\xC0-\xD6\xD8-\xF6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/;
            var d = new RegExp("[\\-\\.0-9" + p.source.slice(1, -1) + "·?\\-?\\u203F\\-?]");
            var f = new RegExp("^" + p.source + d.source + "*(?::" + p.source + d.source + "*)?$");
            v = 0, g = 1, _ = 2, m = 3, y = 4, E = 5, S = 6, I = 7, C = function () {
            };
            C.prototype = {
                parse: function (t, n, i) {
                    var r = this.domBuilder;
                    r.startDocument(), a(n, n = {}), e(t, n, i, r, this.errorHandler), r.endDocument();
                }
            }, u.prototype = {
                setTagName: function (e) {
                    if (!f.test(e)) throw new Error("invalid tagName:" + e);
                    this.tagName = e;
                },
                add: function (e, t, n) {
                    if (!f.test(e)) throw new Error("invalid attribute:" + e);
                    this[this.length++] = {
                        qName: e,
                        value: t,
                        offset: n
                    };
                },
                length: 0,
                getLocalName: function (e) {
                    return this[e].localName;
                },
                getOffset: function (e) {
                    return this[e].offset;
                },
                getQName: function (e) {
                    return this[e].qName;
                },
                getURI: function (e) {
                    return this[e].uri;
                },
                getValue: function (e) {
                    return this[e].value;
                }
            }, l({}, l.prototype) instanceof l || (l = function (e, t) {
                function n() {
                }

                n.prototype = t, n = new n();
                for (t in e) n[t] = e[t];
                return n;
            });
            var A = {
                XMLReader: C
            };
            return A;
        }, u = s(), l = c();

    DOMParser.prototype.parseFromString = function (e, i) {
        var r = this.options, o = new l.XMLReader(), a = r.domBuilder || new n(), s = r.errorHandler, c = r.locator, u = r.xmlns || {}, h = {
            lt: "<",
            gt: ">",
            amp: "&",
            quot: '"',
            apos: "'"
        };
        return c && a.setDocumentLocator(c), o.errorHandler = t(s, a, c), o.domBuilder = r.domBuilder || a,
        /\/x?html?$/.test(i) && (h.nbsp = "?", h.copy = "?", u[""] = "http://www.w3.org/1999/xhtml"),
            u.xml = u.xml || "http://www.w3.org/XML/1998/namespace", e ? o.parse(e, u, h) : o.errorHandler.error("invalid document source"),
            a.document;
    };

    n.prototype = {
        startDocument: function () {
            this.document = new u.DOMImplementation().createDocument(null, null, null), this.locator && (this.document.documentURI = this.locator.systemId);
        },
        startElement: function (e, t, n, r) {
            var o = this.document, s = o.createElementNS(e, n || t), c = r.length;
            a(this, s), this.currentElement = s, this.locator && i(this.locator, s);
            for (var u = 0; c > u; u++) {
                var e = r.getURI(u), l = r.getValue(u), n = r.getQName(u), h = o.createAttributeNS(e, n);
                h.getOffset && i(h.getOffset(1), h), h.value = h.nodeValue = l, s.setAttributeNode(h);
            }
        },
        endElement: function (e, t, n) {
            var i = this.currentElement;
            i.tagName;
            this.currentElement = i.parentNode;
        },
        startPrefixMapping: function (e, t) {
        },
        endPrefixMapping: function (e) {
        },
        processingInstruction: function (e, t) {
            var n = this.document.createProcessingInstruction(e, t);
            this.locator && i(this.locator, n), a(this, n);
        },
        ignorableWhitespace: function (e, t, n) {
        },
        characters: function (e, t, n) {
            if (e = o.apply(this, arguments), this.currentElement && e) {
                if (this.cdata) {
                    var r = this.document.createCDATASection(e);
                    this.currentElement.appendChild(r);
                } else {
                    var r = this.document.createTextNode(e);
                    this.currentElement.appendChild(r);
                }
                this.locator && i(this.locator, r);
            }
        },
        skippedEntity: function (e) {
        },
        endDocument: function () {
            this.document.normalize();
        },
        setDocumentLocator: function (e) {
            (this.locator = e) && (e.lineNumber = 0);
        },
        comment: function (e, t, n) {
            e = o.apply(this, arguments);
            var r = this.document.createComment(e);
            this.locator && i(this.locator, r), a(this, r);
        },
        startCDATA: function () {
            this.cdata = !0;
        },
        endCDATA: function () {
            this.cdata = !1;
        },
        startDTD: function (e, t, n) {
            var r = this.document.implementation;
            if (r && r.createDocumentType) {
                var o = r.createDocumentType(e, t, n);
                this.locator && i(this.locator, o), a(this, o);
            }
        },
        warning: function (e) {
            console.warn("[xmldom warning]	" + e, r(this.locator));
        },
        error: function (e) {
            console.error("[xmldom error]	" + e, r(this.locator));
        },
        fatalError: function (e) {
            throw console.error("[xmldom fatalError]	" + e, r(this.locator)), e;
        }
    };

    "endDTD,startEntity,endEntity,attributeDecl,elementDecl,externalEntityDecl,internalEntityDecl,resolveEntity,getExternalSubset,notationDecl,unparsedEntityDecl".replace(/\w+/g, function (e) {
        n.prototype[e] = function () {
            return null;
        };
    });
    return DOMParser;
});


/**
 * Created by duo on 2016/9/1.
 */
CMD.register("util.Double", function () {
    function Double(num) {
        this._value = num;
    }
    Double.prototype.toJSON = function () {
        return this._value.toFixed(20) + "=double";
    };
    return Double;
});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("util.JsonParser", function () {
    var JsonSyntaxError = function (SyntaxError) {
        function JsonSyntaxError() {
            SyntaxError.apply(this, arguments);
        }
        extend(JsonSyntaxError, SyntaxError);
        return JsonSyntaxError;
    }(SyntaxError);

    function JsonParser() {}

    /**
     * 灏咼SON鏍煎紡鐨勫瓧绗︿覆瑙ｉ噴涓篔SON瀵硅薄
     * @param text      {String}    JSON瀛楃涓?
     * @param reviver   {Function}  optional, 瀵硅薄鍊煎鐞嗗嚱鏁?
     * @returns {Object}
     */
    JsonParser.parse = function (text, reviver) {
        try {
            return JSON.parse(text, reviver);
        } catch (e) {
            e.failingContent = text;
            e.name = "JsonSyntaxError";
            throw e;
        }
    };

    return JsonParser;
});

/**
 * Created by duo on 2016/8/31.
 */
CMD.register("util.Observable", function(){

    function Observable() {
        this._observers = [];
    }
    /**
     * 添加订阅者
     * @param fn
     * @returns {*}
     */
    Observable.prototype.subscribe = function (fn) {
        this._observers.push(fn);
        return fn;
    };
    /**
     * 取消指定订阅者，如果不传入参数，则清空所有订阅者
     * @param fn
     */
    Observable.prototype.unsubscribe = function (fn) {
        if(!this._observers.length){
            return;
        }
        if("undefined" != typeof fn ){
            this._observers = this._observers.filter(function (o) {
                return o !== fn;
            })
        }else{
            this._observers = [];
        }
    };
    /**
     * 发布
     */
    Observable.prototype.trigger = function () {
        var args = arguments;
        this._observers.forEach(function (fn) {
            return fn.apply(undefined, args);
        });
    };

    return Observable;
});
/**
 * Created by duo on 2016/8/31.
 */

CMD.register("util.Url", function (){
    function Url() {}

    /**
     *
     * @param baseUrl   {String}    url
     * @param params    {Object}    query string object
     * @returns {string}
     */
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
    /**
     * 鍦ㄧ粰瀹氱殑url涓煡璇㈠弬鏁板€?
     * @param url       {String}    url
     * @param paramName {String}    瑕佹煡璇㈢殑鍙傛暟鍚?
     * @returns {*}     {Unknown} or {null}
     */
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
 * Created by duo on 2016/9/1.
 */
CMD.register("util.VastParser", function (require) {
    var DOMParser = require("util.DOMParser");
    var VastMediaFile = require("adunit.vast.VastMediaFile");
    var VastCreativeLinear = require("adunit.vast.VastCreativeLinear");
    var VastAd = require("adunit.vast.VastAd");
    var Vast = require("adunit.vast.Vast");

    function VastParser(domParser, maxWrapperDepth) {
        if(void 0 === maxWrapperDepth ){
            maxWrapperDepth = VastParser.DEFAULT_MAX_WRAPPER_DEPTH;
        }
        this._domParser = domParser || VastParser.createDOMParser();
        this._maxWrapperDepth = maxWrapperDepth;
    }
    VastParser.createDOMParser = function () {
        return new DOMParser();
    };
    VastParser.prototype.setMaxWrapperDepth = function (maxWrapperDepth) {
        this._maxWrapperDepth = maxWrapperDepth;
    };
    VastParser.prototype.parseVast = function (vastData) {
        if (!vastData){
            throw new Error("VAST data is missing");
        }
        var vastXml = this._domParser.parseFromString(decodeURIComponent(vastData.data).trim(), "text/xml"),
            adTags = [],
            errorTags = [];
        if (null == vastXml){
            throw new Error("VAST xml data is missing");
        }
        if (null == vastXml.documentElement){
            throw new Error("VAST xml data is missing");
        }
        if ("VAST" !== vastXml.documentElement.nodeName) {
            throw new Error("VAST xml is invalid - document element must be VAST but was " + vastXml.documentElement.nodeName);
        }
        var nodes = vastXml.documentElement.childNodes, i, node;
        for (i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if("Error" === node.nodeName ){
                errorTags.push(this.parseNodeText(node));
            }
        }
        for (i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if (0 === adTags.length && "Ad" === node.nodeName) {
                var adTag = this.parseAdElement(node);
                if(null != adTag){
                    adTags.push(adTag);
                }
            }
        }
        if (0 === adTags.length){
            throw new Error("VAST Ad tag is missing");
        }
        return new Vast(adTags, errorTags, vastData.tracking);
    };
    VastParser.prototype.retrieveVast = function (vastData, nativeBridge, request, parentVast, level) {
        var me = this;
        if(void 0 === level ){
            level = 0;
        }
        var vast = this.parseVast(vastData);
        this.applyParentURLs(vast, parentVast);
        var url = vast.getWrapperURL();
        if (!url){
            return Promise.resolve(vast);
        }
        if (level >= this._maxWrapperDepth){
            throw new Error("VAST wrapper depth exceeded");
        }
        nativeBridge.Sdk.logInfo("OneWay SDK is requesting VAST ad unit from " + url);
        return request.get(url, [], {
            retries: 5,
            retryDelay: 5e3,
            followRedirects: true,
            retryWithConnectionEvents: false
        }).then(function (e) {
            return me.retrieveVast({
                data: e.response,
                tracking: {}
            }, nativeBridge, request, vast, level + 1);
        });
    };
    VastParser.prototype.applyParentURLs = function (vast, parentVast) {
        if (parentVast) {
            var errorURLTemplates = parentVast.getAd().getErrorURLTemplates(), i, tpl;
            for (i = 0; i < errorURLTemplates.length; i++) {
                tpl = errorURLTemplates[i];
                vast.getAd().addErrorURLTemplate(tpl);
            }

            var impressionURLTemplates = parentVast.getAd().getImpressionURLTemplates();
            for (i = 0; i < impressionURLTemplates.length; i++) {
                tpl = impressionURLTemplates[i];
                vast.getAd().addImpressionURLTemplate(tpl);
            }

            var videoClickTrackingURLTemplates = parentVast.getAd().getVideoClickTrackingURLTemplates();
            for (i = 0; i < videoClickTrackingURLTemplates.length; i++) {
                tpl = videoClickTrackingURLTemplates[i];
                vast.getAd().addVideoClickTrackingURLTemplate(tpl);
            }

            var trackingEvents = ["creativeView", "start", "firstQuartile", "midpoint", "thirdQuartile", "complete", "mute", "unmute"];
            for (i = 0; i < trackingEvents.length; i++) {
                var trackingEvent = trackingEvents[i],
                    trackingEventUrl = parentVast.getTrackingEventUrls(trackingEvent);
                for (var j = 0; j < trackingEventUrl.length; j++) {
                    var url = trackingEventUrl[j];
                    vast.addTrackingEventUrl(trackingEvent, url);
                }
            }
        }
    };
    VastParser.prototype.parseNodeText = function (node) {
        return node && (node.textContent || node.text);
    };
    VastParser.prototype.parseAdElement = function (adElement) {
        for (var el, nodes = adElement.childNodes, i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if ("Wrapper" === node.nodeName) {
                el = this.parseWrapperElement(node);
                break;
            }
            if ("InLine" === node.nodeName) {
                el = this.parseInLineElement(node);
                break;
            }
        }
        el && el.setId(adElement.getAttribute("id"));
        return el;
    };
    VastParser.prototype.parseWrapperElement = function (wrapperElement) {
        return this.parseInLineElement(wrapperElement);
    };
    VastParser.prototype.parseInLineElement = function (inlineElement) {
        var ad = new VastAd();
        for (var nodes = inlineElement.childNodes, i = 0; i < nodes.length; i++) {
            var node = nodes[i],
                txt = this.parseNodeText(node);
            switch (node.nodeName) {
                case "Error":
                    txt && ad.addErrorURLTemplate(txt);
                    break;

                case "Impression":
                    txt && ad.addImpressionURLTemplate(txt);
                    break;

                case "Creatives":
                    var creativeNodes = this.childsByName(node, "Creative");
                    for (var j = 0; j < creativeNodes.length; j++) {
                        var creativeNode = creativeNodes[j],
                            childNodes = creativeNode.childNodes;
                        for (var k = 0; k < childNodes.length; k++) {
                            var childNode = childNodes[k], linear = void 0;
                            switch (childNode.nodeName) {
                                case "Linear":
                                    if(0 === ad.getCreatives().length){
                                        linear = this.parseCreativeLinearElement(childNode);
                                        if(linear){
                                            ad.addCreative(linear);
                                        }
                                    }
                            }
                        }
                    }
                    break;

                case "VASTAdTagURI":
                    txt && ad.addWrapperURL(txt.trim());
            }
        }
        return ad;
    };
    VastParser.prototype.parseCreativeLinearElement = function (linearElement) {
        var linear = new VastCreativeLinear();
        linear.setDuration(this.parseDuration(this.parseNodeText(this.childByName(linearElement, "Duration"))));
        if (-1 === linear.getDuration() && "Wrapper" !== linearElement.parentNode.parentNode.parentNode.nodeName) {
            return null;
        }
        var skipOffset = linearElement.getAttribute("skipoffset");
        if (null == skipOffset) {
            linear.setSkipDelay(null);
        } else if ("%" === skipOffset.charAt(skipOffset.length - 1)) {
            var offset = parseInt(skipOffset, 10);
            linear.setSkipDelay(linear.getDuration() * (offset / 100));
        } else {
            linear.setSkipDelay(this.parseDuration(skipOffset));
        }
        var videoClicksElement = this.childByName(linearElement, "VideoClicks"), i;
        if (null != videoClicksElement) {
            linear.setVideoClickThroughURLTemplate(this.parseNodeText(this.childByName(videoClicksElement, "ClickThrough")));
            var clickTrackingElements = this.childsByName(videoClicksElement, "ClickTracking");
            for (i = 0; i < clickTrackingElements.length; i++) {
                var clickTrackingElement = clickTrackingElements[i],
                    tpl = this.parseNodeText(clickTrackingElement);
                if(null != tpl){
                    linear.addVideoClickTrackingURLTemplate(tpl);
                }
            }
        }
        var trackingEventsElements = this.childsByName(linearElement, "TrackingEvents");
        for (i = 0; i < trackingEventsElements.length; i++) {
            var trackingEventsElement = trackingEventsElements[i],
                trackingElements = this.childsByName(trackingEventsElement, "Tracking");
            for (var j = 0; j < trackingElements.length; j++) {
                var trackingElement = trackingElements[j],
                    event = trackingElement.getAttribute("event"),
                    handler = this.parseNodeText(trackingElement);
                if(null != event && null != handler){
                    linear.addTrackingEvent(event, handler);
                }
            }
        }
        var mediaFilesElements = this.childsByName(linearElement, "MediaFiles");
        if (mediaFilesElements.length > 0){
            var mediaFilesElement = mediaFilesElements[0],
                mediaFileElements = this.childsByName(mediaFilesElement, "MediaFile");
            for (i = 0; i < mediaFileElements.length; i++) {
                var mediaFileElement = mediaFileElements[i],
                    mediaFile = new VastMediaFile(
                        this.parseNodeText(mediaFileElement).trim(),
                        mediaFileElement.getAttribute("delivery"),
                        mediaFileElement.getAttribute("codec"),
                        mediaFileElement.getAttribute("type"),
                        parseInt(mediaFileElement.getAttribute("bitrate") || 0, 10),
                        parseInt(mediaFileElement.getAttribute("minBitrate") || 0, 10),
                        parseInt(mediaFileElement.getAttribute("maxBitrate") || 0, 10),
                        parseInt(mediaFileElement.getAttribute("width") || 0, 10),
                        parseInt(mediaFileElement.getAttribute("height") || 0, 10)
                    );
                linear.addMediaFile(mediaFile);
            }
        }
        return linear;
    };
    VastParser.prototype.parseDuration = function (durationText) {
        if (null == durationText){
            return -1;
        }
        var t = durationText.split(":");
        if (3 !== t.length){
            return -1;
        }
        var n = t[2].split("."),
            i = parseInt(n[0], 10);
        if(2 === n.length){
            i += parseFloat("0." + n[1]);
        }
        var r = 60 * parseInt(t[1], 10),
            o = 60 * parseInt(t[0], 10) * 60;
        if(isNaN(o) || isNaN(r) || isNaN(i) || r > 3600 || i > 60){
            return -1
        }else{
            return o + r + i;
        }
    };
    VastParser.prototype.childByName = function (parentNode, name) {
        for (var nodes = parentNode.childNodes, i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.nodeName === name){
                return node;
            }
        }
    };
    VastParser.prototype.childsByName = function (parentNode, name) {
        for (var childs = [], nodes = parentNode.childNodes, i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            node.nodeName === name && childs.push(node);
        }
        return childs;
    };
    VastParser.DEFAULT_MAX_WRAPPER_DEPTH = 8;
    return VastParser;

});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("wakeup.WakeUpManager", function (require) {
    var Observable = require("util.Observable");

    function WakeUpManager(nativeBridge) {
        var me = this;
        this.onNetworkConnected = new Observable();
        this.onScreenOn = new Observable();
        this.onScreenOff = new Observable();
        //for iOS
        this.onAppForeground = new Observable();

        this._screenListener = "screenListener";
        this._nativeBridge = nativeBridge;
        this._lastConnected = Date.now();
        this._nativeBridge.Connectivity.onConnected.subscribe(function (wifi, networkType) {
            return me.onConnected(wifi, networkType);
        });
        // Android
        this._nativeBridge.Broadcast.onBroadcastAction.subscribe(function (name, action, data, extra) {
            return me.onBroadcastAction(name, action, data, extra);
        });
        // iOS
        this._nativeBridge.Notification.onNotification.subscribe(function (name, data) {
            return me.onNotification(name, data);
        });
    }
    WakeUpManager.prototype.setListenConnectivity = function (status) {
        return this._nativeBridge.Connectivity.setListeningStatus(status);
    };
    WakeUpManager.prototype.setListenScreen = function (enable) {
        if(enable){
            return this._nativeBridge.Broadcast.addBroadcastListener(this._screenListener, [WakeUpManager._actionScreenOn, WakeUpManager._actionScreenOff]);
        }else{
            return this._nativeBridge.Broadcast.removeBroadcastListener(this._screenListener);
        }
    };
    WakeUpManager.prototype.setListenAppForeground = function (enable) {
        if(enable){
            return this._nativeBridge.Notification.addNotificationObserver(WakeUpManager._appForegroundNotification, []);
        }else{
            return this._nativeBridge.Notification.removeNotificationObserver(WakeUpManager._appForegroundNotification);
        }
    };
    WakeUpManager.prototype.onConnected = function (wifi, networkType) {
        var n = 9e5;
        if(this._lastConnected + n < Date.now()){
            this._lastConnected = Date.now();
            this.onNetworkConnected.trigger();
        }
    };
    WakeUpManager.prototype.onBroadcastAction = function (listenerName, action, data, extra) {
        if (listenerName === this._screenListener) {
            switch (action) {
                case WakeUpManager._actionScreenOn:
                    this.onScreenOn.trigger();
                    break;

                case WakeUpManager._actionScreenOff:
                    this.onScreenOff.trigger();
            }
        }
    };
    WakeUpManager.prototype.onNotification = function (name, data) {
        name === WakeUpManager._appForegroundNotification && this.onAppForeground.trigger();
    };
    WakeUpManager._actionScreenOn = "android.intent.action.SCREEN_ON";
    WakeUpManager._actionScreenOff = "android.intent.action.SCREEN_OFF";
    WakeUpManager._appForegroundNotification = "UIApplicationDidBecomeActiveNotification";
    return WakeUpManager;

});

/**
 * Created by duo on 2016/9/1.
 */
CMD.register("webview.WebView", function (require) {
    var CallbackStatus = require("webview.bridge.CallbackStatus");
    var DeviceInfo = require("device.DeviceInfo");
    var ConfigManager = require("configuration.ConfigManager");
    var CacheMode = require("cache.CacheMode");
    var CacheStatus = require("cache.CacheStatus");
    var CampaignManager = require("campaign.CampaignManager");
    var CacheManager = require("cache.CacheManager");
    var PlacementState = require("placement.PlacementState");
    var Request = require("request.Request");
    var SessionManager = require("session.SessionManager");
    var ClientInfo = require("device.ClientInfo");
    var Diagnostics = require("util.Diagnostics");
    var EventManager = require("event.EventManager");
    var FinishState = require("FinishState");
    var AdsError = require("AdsError");
    var Platform = require("platform.Platform");
    var MetaDataManager = require("metadata.MetaDataManager");
    var Resolve = require("resolve.Resolve");
    var WakeUpManager = require("wakeup.WakeUpManager");
    var AdUnitFactory = require("adunit.AdUnitFactory");
    var VastParser = require("util.VastParser");
    var JsonParser = require("util.JsonParser");
    var StorageType = require("storage.StorageType");
    var StorageError = require("storage.StorageError");

    /**
     * @param bridge
     * @constructor
     */
    function WebView(bridge) {
        var me = this;
        me._showing = false;
        me._initialized = false;
        me._mustReinitialize = false;
        me._nativeBridge = bridge;

        if(window && window.addEventListener) {
            window.addEventListener("error", function (e) {
                return me.onError(e);
            }, false);
        }
    }
    WebView.prototype.initialize = function () {
        var me = this;
        return this._nativeBridge.Sdk.loadComplete()
            .then(function (nativeClientInfo) {
                me._deviceInfo = new DeviceInfo(me._nativeBridge);
                me._wakeUpManager = new WakeUpManager(me._nativeBridge);
                me._cacheManager = new CacheManager(me._nativeBridge, me._wakeUpManager);
                me._request = new Request(me._nativeBridge, me._wakeUpManager);
                me._resolve = new Resolve(me._nativeBridge);
                me._eventManager = new EventManager(me._nativeBridge, me._request);
                me._clientInfo = new ClientInfo(me._nativeBridge.getPlatform(), nativeClientInfo);
                return me._deviceInfo.fetch();
            })
            .then(function () {
                if (me._clientInfo.getPlatform() === Platform.ANDROID) {
                    document.body.classList.add("android");
                    me._nativeBridge.setApiLevel(me._deviceInfo.getApiLevel());

                }else if (me._clientInfo.getPlatform() === Platform.IOS) {
                    var model = me._deviceInfo.getModel();
                    if( model.match(/iphone/i) || model.match(/ipod/i) ){
                        document.body.classList.add("iphone")
                    }else if( model.match(/ipad/i) ){
                        document.body.classList.add("ipad");
                    }
                }

                me._sessionManager = new SessionManager(me._nativeBridge, me._clientInfo, me._deviceInfo, me._eventManager);
                me._initializedAt = me._configJsonCheckedAt = Date.now();
                me._nativeBridge.Sdk.initComplete();
                me._wakeUpManager.setListenConnectivity(true);
                me._wakeUpManager.onNetworkConnected.subscribe(function () {
                    return me.onNetworkConnected();
                });
                if( me._nativeBridge.getPlatform() === Platform.IOS ){
                    me._wakeUpManager.setListenAppForeground(true);
                    me._wakeUpManager.onAppForeground.subscribe(function () {
                        return me.onAppForeground();
                    })
                }else{
                    me._wakeUpManager.setListenScreen(true);
                    me._wakeUpManager.onScreenOn.subscribe(function () {
                        return me.onScreenOn();
                    })
                }
                me._cacheManager.cleanCache();

                return me.setupTestEnvironment();
            })
            .then(function () {
                return ConfigManager.fetch(me._nativeBridge, me._request, me._clientInfo, me._deviceInfo);
            })
            .then(function (configuration) {
                me._configuration = configuration;
                return me._sessionManager.create();
            })
            .then(function () {
                var placement = me._configuration.getDefaultPlacement();
                me._nativeBridge.Placement.setDefaultPlacement(placement.getId());
                me.setPlacementStates(PlacementState.NOT_AVAILABLE);
                me._campaignManager = new CampaignManager(me._nativeBridge, me._request, me._clientInfo, me._deviceInfo, new VastParser());
                me._campaignManager.onCampaign.subscribe(function (campaign) {
                    return me.onCampaign(campaign);
                });
                me._campaignManager.onVastCampaign.subscribe(function (campaign) {
                    return me.onVastCampaign(campaign);
                });
                me._campaignManager.onNoFill.subscribe(function (seconds) {
                    return me.onNoFill(seconds);
                });
                me._campaignManager.onError.subscribe(function (e) {
                    return me.onCampaignError(e);
                });
                me._refillTimestamp = 0;
                return me._campaignManager.request();
            })
            .then(function () {
                me._initialized = true;
                return me._eventManager.sendUnsentSessions();
            })
            .catch(function (e) {
                if(e instanceof Error ){
                    e = {
                        message: e.message,
                        name: e.name,
                        stack: e.stack
                    };
                    if( e.message === AdsError[AdsError.INVALID_ARGUMENT] ){
                        me._nativeBridge.Listener.sendErrorEvent(AdsError[AdsError.INVALID_ARGUMENT], "Game ID is not valid")
                    }
                }

                me._nativeBridge.Sdk.logError(JSON.stringify(e));
                Diagnostics.trigger(
                    me._eventManager,
                    {
                        type: "initialization_error",
                        error: e
                    },
                    me._clientInfo,
                    me._deviceInfo
                );
            });
    };

    WebView.prototype.show = function (placementId, nativeOptions, i) {
        var me = this;
        i(CallbackStatus.OK);
        if (this._showing) {
            this.showError(false, placementId, "Can't show a new ad unit when ad unit is already open");
            return
        }
        var placement = this._configuration.getPlacement(placementId);
        if(!placement){
            this.showError(true, placementId, "No such placement: " + placementId);
            return;
        }

        if(!this._campaign){
            this.showError(true, placementId, "Campaign not found");
            return;
        }

        this._nativeBridge.getPlatform() !== Platform.IOS || this._campaign.getBypassAppSheet() || this._nativeBridge.AppSheet.prepare({
            id: parseInt(this._campaign.getAppStoreId(), 10)
        });
        this._showing = true;

        this.shouldReinitialize().then(function (mustReinit) {
            me._mustReinitialize = mustReinit;
        });

        if(this._configuration.getCacheMode() === CacheMode.ALLOWED){
            this._cacheManager.stop();
        }

        MetaDataManager.fetchPlayerMetaData(this._nativeBridge).then(function (playerMetaData) {
            if(playerMetaData){
                me._sessionManager.setGamerServerId(playerMetaData.getServerId());
            }
            me._adUnit = AdUnitFactory.createAdUnit(me._nativeBridge, me._sessionManager, placement, me._campaign, me._configuration);
            me._adUnit.setNativeOptions(nativeOptions);
            me._adUnit.onNewAdRequestAllowed.subscribe(function () {
                return me.onNewAdRequestAllowed();
            });
            me._adUnit.onClose.subscribe(function () {
                return me.onClose();
            });
            me._adUnit.show().then(function () {
                me._sessionManager.sendShow(me._adUnit);
            });
            me._campaign = null;
            me.setPlacementStates(PlacementState.WAITING);
            me._refillTimestamp = 0;
            me._mustRefill = true;
        });
    };

    WebView.prototype.showError = function (finished, placementId, msg) {
        this._nativeBridge.Sdk.logError("Show invocation failed: " + msg);
        this._nativeBridge.Listener.sendErrorEvent(AdsError[AdsError.SHOW_ERROR], msg);
        if( finished ){
            this._nativeBridge.Listener.sendFinishEvent(placementId, FinishState.ERROR);
        }
    };
    WebView.prototype.setPlacementStates = function (state) {
        var placements = this._configuration.getPlacements();
        for (var key in placements){
            if (placements.hasOwnProperty(key)) {
                var placement = placements[key];
                this._nativeBridge.Placement.setPlacementState(placement.getId(), state);
                if(state === PlacementState.READY ){
                    this._nativeBridge.Listener.sendReadyEvent(placement.getId());
                }
            }
        }
    };
    WebView.prototype.onCampaign = function (campaign) {
        var me = this;
        this._campaign = campaign;
        var mode = this._configuration.getCacheMode();
        var cacheFile = function (fileUrl) {
            return me._cacheManager.cache(fileUrl, {
                retries: 5
            }).then(function (res) {
                var cacheStatus = res[0],
                    fileId = res[1];

                if (cacheStatus === CacheStatus.OK) {
                    return me._cacheManager.getFileUrl(fileId);
                }
                throw cacheStatus;

            }).catch(function (e) {
                if (e !== CacheStatus.STOPPED){
                    me.onError(e);
                    return e;
                }
                throw e;
            });
        };
        var cacheAllFiles = function () {
            return cacheFile(campaign.getVideoUrl())
                .then(function (t) {
                    campaign.setVideoUrl(t);
                    campaign.setVideoCached(true);
                })
                .then(function () {
                    return cacheFile(campaign.getLandscapeUrl());
                })
                .then(function (t) {
                    return campaign.setLandscapeUrl(t);
                })
                .then(function () {
                    return cacheFile(campaign.getPortraitUrl());
                })
                .then(function (t) {
                    return campaign.setPortraitUrl(t);
                })
                .then(function () {
                    return cacheFile(campaign.getGameIcon());
                })
                .then(function (t) {
                    return campaign.setGameIcon(t);
                })
                .catch(function (e) {
                    if(e === CacheStatus.STOPPED){
                        me._nativeBridge.Sdk.logInfo("Caching was stopped, using streaming instead");
                    }
                });
        };
        var setPlacementReady = function () {
            me.setPlacementStates(PlacementState.READY);
        };

        if (mode === CacheMode.FORCED) {
            cacheAllFiles().then(function () {
                if (me._showing){
                    var fn = me._adUnit.onClose.subscribe(function () {
                        me._adUnit.onClose.unsubscribe(fn);
                        setPlacementReady();
                    });
                }else {
                    setPlacementReady();
                }
            });
        }else if (mode === CacheMode.ALLOWED) {
            if (this._showing) {
                var fn = this._adUnit.onClose.subscribe(function () {
                    me._adUnit.onClose.unsubscribe(fn);
                    cacheAllFiles();
                    setPlacementReady();
                });
            }else {
                cacheAllFiles();
                setPlacementReady();
            }
        }else{
            setPlacementReady();
        }
    };

    WebView.prototype.onVastCampaign = function (campaign) {
        var me = this;
        this._campaign = campaign;
        var cacheMode = this._configuration.getCacheMode();
        var cacheFile = function (fileUrl) {
            return me._cacheManager.cache(fileUrl, {
                retries: 5
            }).then(function (res) {
                var cacheStatus = res[0], fileId = res[1];
                if (cacheStatus === CacheStatus.OK){
                    return me._cacheManager.getFileUrl(fileId);
                }
                throw cacheStatus;

            })["catch"](function (e) {
                if (e !== CacheStatus.STOPPED) {
                    me.onError(e);
                    return fileUrl;
                }
                throw e;
            });
        };
        var cacheAllFiles = function () {
            var videoUrl = campaign.getVideoUrl();
            return me._request.head(videoUrl, [], {
                retries: 5,
                retryDelay: 1e3,
                followRedirects: true,
                retryWithConnectionEvents: false
            }).then(function (response) {
                var url = response.url || videoUrl;
                cacheFile(url).then(function (cachedFileUrl) {
                    campaign.setVideoUrl(cachedFileUrl);
                    campaign.setVideoCached(true);
                })["catch"](function (e) {
                    if(e === CacheStatus.STOPPED){
                        me._nativeBridge.Sdk.logInfo("Caching was stopped, using streaming instead");
                    }
                });
            })["catch"](function (e) {
                me._nativeBridge.Sdk.logError("Caching failed to get VAST video URL location: " + e);
            });
        };
        var setPlacementReady = function () {
            me.setPlacementStates(PlacementState.READY);
        };

        if (cacheMode === CacheMode.FORCED) {
            cacheAllFiles().then(function () {
                if (me._showing){
                    var fn = me._adUnit.onClose.subscribe(function () {
                        me._adUnit.onClose.unsubscribe(fn);
                        setPlacementReady();
                    });

                }else{
                    setPlacementReady();
                }
            });
        }else if (cacheMode === CacheMode.ALLOWED) {
            if (this._showing){
                var fn = this._adUnit.onClose.subscribe(function () {
                    me._adUnit.onClose.unsubscribe(fn);
                    cacheAllFiles();
                    setPlacementReady();
                });
            }else{
                cacheAllFiles();
                setPlacementReady();
            }
        }else{
            setPlacementReady();
        }
    };
    WebView.prototype.onNoFill = function (seconds) {
        this._refillTimestamp = Date.now() + 1000 * seconds;
        this._nativeBridge.Sdk.logInfo("OneWay SDK server returned no fill, no ads to show");
        this.setPlacementStates(PlacementState.NO_FILL);
    };
    WebView.prototype.onCampaignError = function (e) {
        if(e instanceof Error){
            e = {
                message: e.message,
                name: e.name,
                stack: e.stack
            };
        }
        this._nativeBridge.Sdk.logError(JSON.stringify(e));
        Diagnostics.trigger(
            this._eventManager,
            {
                type: "campaign_request_failed",
                error: e
            },
            this._clientInfo,
            this._deviceInfo
        );
        this.onNoFill(3600);
    };
    WebView.prototype.onNewAdRequestAllowed = function () {
        if(this._mustRefill){
            this._mustRefill = false;
            this._campaignManager.request()
        }
    };
    WebView.prototype.onClose = function () {
        this._nativeBridge.Sdk.logInfo("Closing OneWay SDK ad unit");
        this._showing = false;
        if(this._mustReinitialize){
            this._nativeBridge.Sdk.logInfo("OneWay SDK webapp has been updated, reinitializing OneWay SDK");
            this.reinitialize();
        }else{
            if(this._mustRefill ){
                this._mustRefill = false;
                this._campaignManager.request()
            }
            this._sessionManager.create();
        }
    };
    WebView.prototype.isShowing = function () {
        return this._showing;
    };
    WebView.prototype.onNetworkConnected = function () {
        var me = this;
        if(!this.isShowing() && this._initialized ){
            this.shouldReinitialize().then(function (isShouldReInit) {
                if(isShouldReInit){
                    if(me.isShowing()){
                        me._mustReinitialize = true
                    }else{
                        me._nativeBridge.Sdk.logInfo("OneWay SDK webapp has been updated, reinitializing OneWay SDK");
                        me.reinitialize()
                    }
                }else{
                    me.checkRefill();
                    me._eventManager.sendUnsentSessions();
                }
            });
        }
    };
    WebView.prototype.onScreenOn = function () {
        this.checkRefill();
    };
    WebView.prototype.onAppForeground = function () {
        this.checkRefill();
    };
    WebView.prototype.checkRefill = function () {
        if(0 !== this._refillTimestamp && Date.now() > this._refillTimestamp ){
            this._refillTimestamp = 0;
            this._campaignManager.request();
        }
    };
    WebView.prototype.onError = function (e) {
        Diagnostics.trigger(
            this._eventManager,
            {
                type: "js_error",
                message: e.message,
                url: e.filename,
                line: e.lineno,
                column: e.colno,
                object: e.error
            },
            this._clientInfo,
            this._deviceInfo);
        return true;
    };
    WebView.prototype.reinitialize = function () {
        this._nativeBridge.Sdk.reinitialize();
    };
    WebView.prototype.getConfigJson = function () {
        return this._request.get(this._clientInfo.getConfigUrl() + "?ts=" + Date.now() + "&sdkVersion=" + this._clientInfo.getSdkVersion());
    };
    WebView.prototype.shouldReinitialize = function () {
        var me = this;

        if(this._clientInfo.getWebviewHash()){
            if(Date.now() - this._configJsonCheckedAt <= 9e5 ){
                return Promise.resolve(false)
            }else{
                return this.getConfigJson().then(function (configJson) {
                    me._configJsonCheckedAt = Date.now();
                    var response = JsonParser.parse(configJson.response);
                    return response.hash !== me._clientInfo.getWebviewHash();
                })["catch"](function (e) {
                    return false;
                })
            }
        }else{
            return Promise.resolve(false);
        }
    };
    WebView.prototype.setupTestEnvironment = function () {
        var me = this;
        this._nativeBridge.Storage.get(StorageType.PUBLIC, "test.serverUrl.value").then(function (testUrl) {
            if(testUrl){
                ConfigManager.setTestBaseUrl(testUrl);
                CampaignManager.setTestBaseUrl(testUrl);
                SessionManager.setTestBaseUrl(testUrl);
                me._nativeBridge.Storage["delete"](StorageType.PUBLIC, "test.serverUrl");
                me._nativeBridge.Storage.write(StorageType.PUBLIC)
            }
        }).catch(function (e) {
            var errorState = e[0];
            switch (errorState) {
                case StorageError[StorageError.COULDNT_GET_VALUE]:
                    break;

                default:
                    throw new Error(errorState);
            }
        });

        this._nativeBridge.Storage.get(StorageType.PUBLIC, "test.kafkaUrl.value").then(function (testUrl) {
            if(testUrl){
                Diagnostics.setTestBaseUrl(testUrl);
                me._nativeBridge.Storage["delete"](StorageType.PUBLIC, "test.kafkaUrl");
                me._nativeBridge.Storage.write(StorageType.PUBLIC)
            }
        }).catch(function (e) {
            var errorState = e[0];
            switch (errorState) {
                case StorageError[StorageError.COULDNT_GET_VALUE]:
                    break;

                default:
                    throw new Error(errorState);
            }
        });
    };
    return WebView;
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
        return new Promise(function (resolve, reject) {
            var jsCallbackId = me._nativeBridge.registerCallback(resolve, reject);
            me._batch.push([apiClass, method, args, jsCallbackId.toString()]);
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
CMD.register("webview.bridge.IosWebViewBridge", function(require){
    var webViewBridgeProperties = require("Properties").webViewBridge;

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
    IosWebViewBridge._nativeUrl = webViewBridgeProperties.IOS_NATIVE_URL;

    return IosWebViewBridge;
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
/**
 * Created by duo on 2016/9/5.
 */
CMD.register("Properties", function(require, exports){
    exports.adUnit = {};
    exports.adUnit.ANDROID_INTEGRATION_TEST_CLASS = "com.unity3d.ads.test.integration.IntegrationTest";
    exports.adUnit.IOS_INTEGRATION_TEST_CLASS = "UADSIntegrationTest";

    exports.campaign = {};
    exports.campaign.CAMPAIGN_BASE_URL = "https://adserver.unityads.unity3d.com/games";

    exports.configuration = {};
    exports.configuration.CONFIG_BASE_URL = "https://adserver.unityads.unity3d.com/games";

    exports.session = {};
    exports.session.VIDEO_EVENT_BASE_URL = "https://adserver.unityads.unity3d.com/mobile/gamers";
    exports.session.CLICK_EVENT_BASE_URL = "https://adserver.unityads.unity3d.com/mobile/campaigns";

    exports.diagnostics = {};
    exports.diagnostics.DIAGNOSTICS_BASE_URL = "https://httpkafka.unityads.unity3d.com/v1/events";

    exports.webViewBridge = {};
    exports.webViewBridge.IOS_NATIVE_URL = "https://webviewbridge.unityads.unity3d.com";
});
/**
 * Created by duo on 2016/9/1.
 */
CMD.register("AdsError", function(){
    var AdsError = {};

    AdsError[AdsError.NOT_INITIALIZED = 0] = "NOT_INITIALIZED";
    AdsError[AdsError.INITIALIZE_FAILED = 1] = "INITIALIZE_FAILED";
    AdsError[AdsError.INVALID_ARGUMENT = 2] = "INVALID_ARGUMENT";
    AdsError[AdsError.VIDEO_PLAYER_ERROR = 3] = "VIDEO_PLAYER_ERROR";
    AdsError[AdsError.INIT_SANITY_CHECK_FAIL = 4] = "INIT_SANITY_CHECK_FAIL";
    AdsError[AdsError.AD_BLOCKER_DETECTED = 5] = "AD_BLOCKER_DETECTED";
    AdsError[AdsError.FILE_IO_ERROR = 6] = "FILE_IO_ERROR";
    AdsError[AdsError.DEVICE_ID_ERROR = 7] = "DEVICE_ID_ERROR";
    AdsError[AdsError.SHOW_ERROR = 8] = "SHOW_ERROR";
    AdsError[AdsError.INTERNAL_ERROR = 9] = "INTERNAL_ERROR";

    return AdsError;
});
/**
 * Created by duo on 2016/8/31.
 */
CMD.register("FinishState", function () {
    var FinishState = {};

    FinishState[FinishState.COMPLETED = 0] = "COMPLETED";
    FinishState[FinishState.SKIPPED = 1] = "SKIPPED";
    FinishState[FinishState.ERROR = 2] = "ERROR";

    return FinishState;
});

/**
 * Created by duo on 2016/8/31.
 */

CMD.register("main", function(require){
    var Url         = require("util.Url");
    var Platform    = require("platform.Platform");
    var NativeBridge = require("webview.bridge.NativeBridge");
    var IosWebViewBridge = require("webview.bridge.IosWebViewBridge");
    var WebView     = require("webview.WebView");

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
            //JS 调用 Android API: 提供webviewbridge接口
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
    win.webview = new WebView(nativeBridge);
    win.webview.initialize();
});
CMD.require("main");