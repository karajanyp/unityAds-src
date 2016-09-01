/**
 * Created by duo on 2016/8/31.
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
        var i = 0,
            t = new MutationObserver(l),
            n = document.createTextNode("");
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

    function resolve(e) {
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
        t.constructor === e.constructor && i === then && constructor.resolve === resolve ? E(e, t) : i === ce ? b(e, ce.error) : void 0 === i ? A(e, t) : isFunction(i) ? y(e, t, i) : A(e, t);
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
            0 !== promise._subscribers.length && Q(notify, promise)
        }
    }

    function b(promise, err) {
        if(promise._state === undefined ) {
            promise._state = STATE_FAILURE;
            promise._result = err;
            Q(C, promise)
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
        return new t(Y(e) ? function (n, i) {
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

    function x(e, t) {
        this._instanceConstructor = e;
        this.promise = new e(noop);
        this.promise[re] || P(this.promise);
        if(Y(t)){
            this._input = t;
            this.length = t.length;
            this._remaining = t.length;
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

    if(Z){
        G = o()
    }else if(MutationObserver){
        G = s()
    }else if(ee){
        G = c()
    }else if(void 0 === Context && "function" == typeof require){
        G = h()
    }else{
        G = u();
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
    Promise._setScheduler = i;
    Promise._setAsap = r;
    Promise._asap = Q;
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
    x.prototype._eachEntry = function (e, t) {
        var n = this._instanceConstructor, i = n.resolve;
        if (i === resolve) {
            var r = _(e);
            if (r === then && e._state !== undefined) {
                this._settledAt(e._state, t, e._result);
            } else if ("function" != typeof r){
                this._remaining--;
                this._result[t] = e;
            }else if (n === Promise) {
                var o = new n(noop);
                S(o, e, r), this._willSettleAt(o, t);
            } else {
                this._willSettleAt(new n(function (t) {t(e);}), t);
            }
        } else {
            this._willSettleAt(i(e), t);
        }
    };
    x.prototype._settledAt = function (state, t, n) {
        var promise = this.promise;
        if(promise._state === undefined){
            this._remaining--;
            if(state === STATE_FAILURE){
                b(promise, n)
            }else{
                this._result[t] = n;
            }
        }
        if(0 === this._remaining){
            A(promise, this._result);
        }
    };
    x.prototype._willSettleAt = function (e, t) {
        var me = this;
        O(e, void 0, function (e) {
            me._settledAt(STATE_SUCCESS, t, e);
        }, function (e) {
            me._settledAt(STATE_FAILURE, t, e);
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
