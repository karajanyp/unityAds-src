/**
 * Created by duo on 2016/8/31.
 */
CMD.register("util.observable", function(require, exports){

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

    function Observable0() {
        Observable.apply(this, arguments);
    }
    extend(Observable0, Observable);
    Observable0.prototype.trigger = function () {
        this._observers.forEach(function (fn) {
            return fn();
        });
    };

    exports.Observable0 = Observable0;

    function Observable1() {
        Observable.apply(this, arguments);
    }
    extend(Observable1, Observable);
    Observable1.prototype.trigger = function (arg) {
        this._observers.forEach(function (fn) {
            return fn(arg);
        });
    };
    exports.Observable1 = Observable1;

    function Observable2() {
        Observable.apply(this, arguments);
    }
    extend(Observable2, Observable);
    Observable2.prototype.trigger = function (arg1, arg2) {
        this._observers.forEach(function (fn) {
            return fn(arg1, arg2);
        });
    };
    exports.Observable2 = Observable2;

    function Observable3() {
        Observable.apply(this, arguments);
    }
    extend(Observable3, Observable);
    Observable3.prototype.trigger = function (arg1, arg2, arg3) {
        this._observers.forEach(function (fn) {
            return fn(arg1, arg2, arg3);
        });
    };
    exports.Observable3 = Observable3;

    function Observable4() {
        Observable.apply(this, arguments);
    }
    extend(Observable4, Observable);
    Observable4.prototype.trigger = function (arg1, arg2, arg3, arg4) {
        this._observers.forEach(function (fn) {
            return fn(arg1, arg2, arg3, arg4);
        });
    };
    exports.Observable4 = Observable4;

    function Observable5() {
        Observable.apply(this, arguments);
    }
    extend(Observable5, Observable);
    Observable5.prototype.trigger = function (arg1, arg2, arg3, arg4, arg5) {
        this._observers.forEach(function (fn) {
            return fn(arg1, arg2, arg3, arg4, arg5);
        });
    };
    exports.Observable5 = Observable5;

    function Observable6() {
        Observable.apply(this, arguments);
    }
    extend(Observable6, Observable);
    Observable6.prototype.trigger = function (arg1, arg2, arg3, arg4, arg5, arg6) {
        this._observers.forEach(function (fn) {
            return fn(arg1, arg2, arg3, arg4, arg5, arg6);
        });
    };
    exports.Observable6 = Observable6;
});