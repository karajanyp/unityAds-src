/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.eventhandlers.EndScreenEventHandlers", function (require) {
    var Request = require("request.Request");
    var Platform = require("platform.Platform");

    function EndScreenEventHandlers() {
    }
    EndScreenEventHandlers.onDownload = function (nativeBridge, sessionManager, adUnit) {
        var platform = nativeBridge.getPlatform(),
            campaign = adUnit.getCampaign();
        if(campaign.getClickAttributionUrlFollowsRedirects()){
            sessionManager.sendClick(adUnit).then(function (e) {
                var url = Request.getHeader(e.headers, "location");
                if (!url){ throw new Error("No location found");}
                if(platform === Platform.IOS){
                    nativeBridge.UrlScheme.open(url)
                } else{
                    nativeBridge.Intent.launch({
                        action: "android.intent.action.VIEW",
                        uri: url
                    });
                }
            })
        }else{
            sessionManager.sendClick(adUnit);
            if(platform === Platform.IOS){
                nativeBridge.AppSheet.canOpen().then(function (t) {
                    if(t && !campaign.getBypassAppSheet()){
                        EndScreenEventHandlers.openAppSheet(nativeBridge, {
                            id: parseInt(campaign.getAppStoreId(), 10)
                        })
                    }else{
                        nativeBridge.UrlScheme.open(EndScreenEventHandlers.getAppStoreUrl(platform, campaign));
                    }
                })
            }else{
                nativeBridge.Intent.launch({
                    action: "android.intent.action.VIEW",
                    uri: EndScreenEventHandlers.getAppStoreUrl(platform, campaign)
                });
            }
        }
    };
    EndScreenEventHandlers.onPrivacy = function (nativeBridge, url) {
        if(nativeBridge.getPlatform() === Platform.IOS ){
            nativeBridge.UrlScheme.open(url)
        }else if(nativeBridge.getPlatform() === Platform.ANDROID){
            nativeBridge.Intent.launch({
                action: "android.intent.action.VIEW",
                uri: url
            });
        }
    };
    EndScreenEventHandlers.onClose = function (nativeBridge, adUnit) {
        nativeBridge.getPlatform() !== Platform.IOS || adUnit.getCampaign().getBypassAppSheet() || nativeBridge.AppSheet.destroy({
            id: parseInt(adUnit.getCampaign().getAppStoreId(), 10)
        });
        adUnit.hide();
    };
    EndScreenEventHandlers.getAppStoreUrl = function (platform, campaign) {
        if(platform === Platform.IOS){
            return "https://itunes.apple.com/" + campaign.getAppStoreCountry() + "/app/id" + campaign.getAppStoreId();
        }else{
            return "market://details?id=" + campaign.getAppStoreId();
        }
    };
    EndScreenEventHandlers.openAppSheet = function (nativeBridge, t) {
        nativeBridge.AppSheet.present(t).then(function () {
            return nativeBridge.AppSheet.destroy(t);
        })["catch"](function (t) {
            var n = t[0], i = t[1];
            if ("APPSHEET_NOT_FOUND" === n) {
                return nativeBridge.AppSheet.prepare(i).then(function () {
                    var t = nativeBridge.AppSheet.onPrepared.subscribe(function () {
                        nativeBridge.AppSheet.present(i).then(function () {
                            nativeBridge.AppSheet.destroy(i);
                        }), nativeBridge.AppSheet.onPrepared.unsubscribe(t);
                    });
                });
            }
            throw [n, i];
        });
    };
    return EndScreenEventHandlers;
});
