/**
 * Created by duo on 2016/9/1.
 */
CMD.register("configuration.ConfigManager", function (require) {
    var MetaDataManager = require("metadata.MetaDataManager");
    var Configuration = require("configuration.Configuration");
    var Url = require("util.Url");
    var JsonParser = require("util.JsonParser");

    function ConfigManager() {}

    ConfigManager.fetch = function (nativeBridge, request, clientInfo, deviceInfo) {
        return MetaDataManager.fetchAdapterMetaData(nativeBridge).then(function (i) {
            var configUrl = ConfigManager.createConfigUrl(clientInfo, deviceInfo, i);
            nativeBridge.Sdk.logInfo("Requesting configuration from " + configUrl);
            return request.get(configUrl, [], {
                retries: 5,
                retryDelay: 5e3,
                followRedirects: false,
                retryWithConnectionEvents: true
            }).then(function (e) {
                try {
                    var i = JsonParser.parse(e.response),
                        o = new Configuration(i);
                    nativeBridge.Sdk.logInfo("Received configuration with " + o.getPlacementCount() + " placements");
                    return o;
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
    ConfigManager.createConfigUrl = function (n, i, r) {
        var configUrl = [ConfigManager.ConfigBaseUrl, n.getGameId(), "configuration"].join("/");
        configUrl = Url.addParameters(configUrl, {
            bundleId: n.getApplicationName(),
            encrypted: !n.isDebuggable(),
            rooted: i.isRooted()
        });
        if(r){
            configUrl = Url.addParameters(configUrl, r.getDTO());
        }
        return configUrl;
    };
    ConfigManager.ConfigBaseUrl = "https://adserver.unityads.unity3d.com/games";

    return ConfigManager;
});

