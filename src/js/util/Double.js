/**
 * Created by duo on 2016/9/1.
 */
CMD.register("util.Double", function () {
    function Double(num) {
        this._value = num;
    }
    Double.prototype.toJSON = function () {
        return this._value.toFixed(20) + "=double";
    };
    return Double;
});
