
document.addEventListener('DOMContentLoaded', function () {//}, false);

/**
 * Created by duo on 2016/8/24.
 */

/**
 * ¿©’π∂‘œÛ
 * @grammer __extends(dest, src);
 * @type {Function}
 * @param Object dest
 * @param Object src
 */
var __extends = (this && this.__extends) || function (dest, src) {
    for (var key in src){
        if (src.hasOwnProperty(key)){
            dest[key] = src[key];
        }
    }
    function __() {
        this.constructor = dest;
    }

    if(src === null){
        dest.prototype = Object.create(src);
    }else{
        __.prototype = src.prototype;
        dest.prototype = new __();
    }
};

//document.addEventListener('DOMContentLoaded', function () {
}, false);
