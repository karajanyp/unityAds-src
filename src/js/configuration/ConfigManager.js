/**
 * Created by duo on 2016/9/1.
 */
CMD.register("configuration.ConfigManager", function (require) {
    var MetaDataManager = require("metadata.MetaDataManager");
    var Configuration = require("configuration.Configuration");
    var configurationProperties = require("Properties").configuration;
    var Url = require("util.Url");
    var JsonParser = require("util.JsonParser");

    function ConfigManager() {}

    ConfigManager.fetch = function (nativeBridge, request, clientInfo, deviceInfo) {
        return MetaDataManager.fetchAdapterMetaData(nativeBridge).then(function (metaData) {
            var configUrl = ConfigManager.createConfigUrl(clientInfo, deviceInfo, metaData);
            nativeBridge.Sdk.logInfo("Requesting configuration from " + configUrl);
            return request.get(configUrl, [], {
                retries: 5,
                retryDelay: 5e3,
                followRedirects: false,
                retryWithConnectionEvents: true
            }).then(function (res) {
                try {
                    var configData = JsonParser.parse(res.response),
                        configuration = new Configuration(configData);
                    nativeBridge.Sdk.logInfo("Received configuration with " + configuration.getPlacementCount() + " placements");
                    return configuration;
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
    ConfigManager.createConfigUrl = function (clientInfo, deviceInfo, metaData) {
        var configUrl = [ConfigManager.ConfigBaseUrl, clientInfo.getGameId(), "configuration"].join("/");
        configUrl = Url.addParameters(configUrl, {
            bundleId: clientInfo.getApplicationName(),
            encrypted: !clientInfo.isDebuggable(),
            rooted: deviceInfo.isRooted()
        });
        if(metaData){
            configUrl = Url.addParameters(configUrl, metaData.getDTO());
        }
        return configUrl;
    };
    ConfigManager.ConfigBaseUrl = configurationProperties.CONFIG_BASE_URL;

    return ConfigManager;
});

