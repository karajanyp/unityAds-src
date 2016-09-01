/**
 * Created by duo on 2016/9/1.
 */
CMD.register("util.Diagnostics", function () {
    function Diagnostics() {
    }
    Diagnostics.trigger = function (t, n, i, r) {
        var o = [];
        o.push({
            type: "ads.sdk2.diagnostics",
            msg: n
        });
        return Diagnostics.createCommonObject(i, r).then(function (n) {
            o.unshift(n);
            var i = o.map(function (e) {
                return JSON.stringify(e);
            }).join("\n");
            return t.diagnosticEvent(Diagnostics.DiagnosticsBaseUrl, i);
        });
    };
    Diagnostics.setTestBaseUrl = function (t) {
        Diagnostics.DiagnosticsBaseUrl = t + "/v1/events";
    };
    Diagnostics.createCommonObject = function (e, t) {
        var n = {
            common: {
                client: e ? e.getDTO() : null,
                device: null
            }
        };
        return t ? t.getDTO().then(function (e) {
            return n.device = e, n;
        })["catch"](function (e) {
            return n;
        }) : Promise.resolve(n);
    };
    Diagnostics.DiagnosticsBaseUrl = "https://httpkafka.unityads.unity3d.com/v1/events";
    return Diagnostics;
});
