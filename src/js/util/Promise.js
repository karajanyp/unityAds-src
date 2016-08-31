/**
 * Created by duo on 2016/8/31.
 */

var e;
(function () {
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
