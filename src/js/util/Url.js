/**
 * Created by duo on 2016/8/31.
 */

CMD.register("util.Url", function (){
    function Url() {}
    Url.addParameters = function (baseUrl, params) {
        var url = baseUrl.toString();
        url += -1 !== url.indexOf("?") ? "&" : "?";
        var paramArr = [];
        for (var key in params) {
            if (params.hasOwnProperty(key)) {
                var val = params[key];
                if(void 0 !== val){
                    paramArr.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
                }
            }
        }
        return url + paramArr.join("&");
    };
    Url.getQueryParameter = function (url, paramName) {
        var params = url.split("?")[1].split("&");
        for (var i = 0; i < params.length; i++) {
            var r = params[i].split("=");
            if (r[0] === paramName){
                return r[1];
            }
        }
        return null;
    };
    return Url;
});
