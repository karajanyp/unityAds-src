/**
 * Created by duo on 2016/9/5.
 */
CMD.register("Properties", function(require, exports){
    exports.adUnit = {};
    exports.adUnit.ANDROID_INTEGRATION_TEST_CLASS = "com.unity3d.ads.test.integration.IntegrationTest";
    exports.adUnit.IOS_INTEGRATION_TEST_CLASS = "UADSIntegrationTest";

    exports.campaign = {};
    exports.campaign.CAMPAIGN_BASE_URL = "https://adserver.unityads.unity3d.com/games";

    exports.configuration = {};
    exports.configuration.CONFIG_BASE_URL = "https://adserver.unityads.unity3d.com/games";

    exports.session = {};
    exports.session.VIDEO_EVENT_BASE_URL = "https://adserver.unityads.unity3d.com/mobile/gamers";
    exports.session.CLICK_EVENT_BASE_URL = "https://adserver.unityads.unity3d.com/mobile/campaigns";

    exports.diagnostics = {};
    exports.diagnostics.DIAGNOSTICS_BASE_URL = "https://httpkafka.unityads.unity3d.com/v1/events";

    exports.webViewBridge = {};
    exports.webViewBridge.IOS_NATIVE_URL = "https://webviewbridge.unityads.unity3d.com";
});