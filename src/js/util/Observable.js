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