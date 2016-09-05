/**
 * Created by duo on 2016/8/31.
 */

CMD.register("util.Url", function (){
    function Url() {}

    /**
     *
     * @param baseUrl   {String}    url
     * @param params    {Object}    query string object
     * @returns {string}
     */
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
    /**
     * 在给定的url中查询参数值
     * @param url       {String}    url
     * @param paramName {String}    要查询的参数名
     * @returns {*}     {Unknown} or {null}
     */
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
