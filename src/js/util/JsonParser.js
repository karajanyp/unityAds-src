/**
 * Created by duo on 2016/9/1.
 */
CMD.register("util.JsonParser", function () {
    var JsonSyntaxError = function (SyntaxError) {
        function JsonSyntaxError() {
            SyntaxError.apply(this, arguments);
        }
        extend(JsonSyntaxError, SyntaxError);
        return JsonSyntaxError;
    }(SyntaxError);

    function JsonParser() {}

    /**
     * 将JSON格式的字符串解释为JSON对象
     * @param text      {String}    JSON字符串
     * @param reviver   {Function}  optional, 对象值处理函数
     * @returns {Object}
     */
    JsonParser.parse = function (text, reviver) {
        try {
            return JSON.parse(text, reviver);
        } catch (e) {
            e.failingContent = text;
            e.name = "JsonSyntaxError";
            throw e;
        }
    };

    return JsonParser;
});
