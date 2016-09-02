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
