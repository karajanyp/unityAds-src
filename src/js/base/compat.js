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
