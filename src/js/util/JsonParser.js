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
