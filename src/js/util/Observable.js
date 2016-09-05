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