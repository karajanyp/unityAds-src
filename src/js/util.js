/**
 * Created by duo on 2016/8/24.
 */

(function(exports){
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
            throw ('Invalid CommonJS module: ' + factory);
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
 * 扩展对象
 * @grammer __extends(dest, src);
 * @type {Function}
 * @param Object dest
 * @param Object src
 */
var __extends = (this && this.__extends) || function (dest, src) {
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