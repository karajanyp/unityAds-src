/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.util.Template", function () {
    function Template(str) {
        var me = this,
            i = 0,
            body = "__p+='";

        str.replace(Template._matcher, function (matchText, subText, index, s) {
            body += str.slice(i, s).replace(Template._escapeRegExp, Template._escapeChar);
            i = s + matchText.length;
            if(subText){
                body += "'+\n((__t=(" + subText + "))==null?'':__t)+\n'"
            }else if(index){
                body += "';\n" + index + "\n__p+='";
            }
            return matchText;
        });
        body += "';\n";
        body = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + body + "return __p;\n";
        try {
            var fn = new Function("data", body);
            this._templateFunction = function (data) {
                return fn.call(me, data);
            };
        } catch (e) {
            e.source = body;
            throw e;
        }
    }
    Template.prototype.render = function (data) {
        return this._templateFunction(data);
    };
    Template._matcher = /<%=([\s\S]+?)%>|<%([\s\S]+?)%>|$/g;
    Template._escapes = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "\u2028": "u2028",
        "\u2029": "u2029"
    };
    Template._escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;
    Template._escapeChar = function (char) {
        return "\\" + Template._escapes[char];
    };

    return Template;
});
