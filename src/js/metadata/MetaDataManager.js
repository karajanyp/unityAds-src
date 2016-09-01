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
    MetaDataManager.getValues = function (n, i, r) {
        return MetaDataManager.categoryExists(n, r).then(function (e) {
            if(e){
                return Promise.all(i.map(function (e) {
                    return r.Storage.get(StorageType.PUBLIC, n + "." + e)["catch"](function () {});
                }));
            }else{
                return Promise.resolve(void 0);
            }
        });
    };
    MetaDataManager.fetchFrameworkMetaData = function (t, i) {
        if(void 0 === i){
            i = true;
        }
        return MetaDataManager.fetch(FrameworkMetaData.getCategory(), FrameworkMetaData.getKeys(), t, i).then(function (e) {
            return Promise.resolve(e);
        });
    };
    MetaDataManager.fetchAdapterMetaData = function (t, n) {
        if(void 0 === n){
            n = true;
        }
        return MetaDataManager.fetch(AdapterMetaData.getCategory(), AdapterMetaData.getKeys(), t, n).then(function (e) {
            return Promise.resolve(e);
        });
    };
    MetaDataManager.fetchMediationMetaData = function (t, n) {
        if(void 0 === n){
            n = true;
        }
        return MetaDataManager.fetch(MediationMetaData.getCategory(), MediationMetaData.getKeys(), t, n).then(function (e) {
            return Promise.resolve(e);
        });
    };
    MetaDataManager.fetchPlayerMetaData = function (n) {
        return MetaDataManager.fetch(PlayerMetaData.getCategory(), PlayerMetaData.getKeys(), n, false).then(function (i) {
            if(null != i){
                MetaDataManager.caches.player = void 0;
                return n.Storage["delete"](StorageType.PUBLIC, PlayerMetaData.getCategory()).then(function () {
                    return i;
                });
            }else{
                return Promise.resolve(i);
            }
        });
    };
    MetaDataManager.fetch = function (t, n, i, r) {
        if(void 0 === r ){
            r = true;
        }
        if(r && MetaDataManager.caches[t]){
            return Promise.resolve(MetaDataManager.caches[t]);
        }else{
            return  MetaDataManager.getValues(t, n, i).then(function (n) {
                return MetaDataManager.createAndCache(t, n, r);
            });
        }
    };
    MetaDataManager.createAndCache = function (t, n, i) {
        if(void 0 === i){
            i = true
        }
        if(void 0 !== n){
            if(i && !MetaDataManager.caches[t] ){
                MetaDataManager.caches[t] = MetaDataManager.createByCategory(t, n);
            }
            return i ? MetaDataManager.caches[t] : MetaDataManager.createByCategory(t, n)
        }else{
            return void 0
        }
    };
    MetaDataManager.createByCategory = function (e, t) {
        switch (e) {
            case "framework":
                return new FrameworkMetaData(t);

            case "adapter":
                return new AdapterMetaData(t);

            case "mediation":
                return new MediationMetaData(t);

            case "player":
                return new PlayerMetaData(t);

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
    MetaDataManager.categoryExists = function (e, n) {
        return n.Storage.getKeys(StorageType.PUBLIC, e, false).then(function (e) {
            return e.length > 0;
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