/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.util.Tap", function () {
    function Tap(elem) {
        var me = this;
        this._element = elem;
        this._moved = false;
        this._startX = 0;
        this._startY = 0;
        this._element.addEventListener("touchstart", function (e) {
            return me.onTouchStart(e);
        }, false);
    }
    Tap.prototype.onTouchStart = function (e) {
        var me = this;
        this._onTouchMoveListener = function (e) {
            return me.onTouchMove(e);
        };
        this._onTouchEndListener = function (e) {
            return me.onTouchEnd(e);
        };
        this._onTouchCancelListener = function (e) {
            return me.onTouchCancel(e);
        };
        this._element.addEventListener("touchmove", this._onTouchMoveListener, false);
        this._element.addEventListener("touchend", this._onTouchEndListener, false);
        this._element.addEventListener("touchcancel", this._onTouchCancelListener, false);
        this._moved = false;
        this._startX = e.touches[0].clientX;
        this._startY = e.touches[0].clientY;
    };
    Tap.prototype.onTouchMove = function (e) {
        var x = e.touches[0].clientX,
            y = e.touches[0].clientY;
        if(Math.abs(x - this._startX) > Tap._moveTolerance || Math.abs(y - this._startY) > Tap._moveTolerance){
            this._moved = true;
        }
    };
    Tap.prototype.onTouchEnd = function (e) {
        this._element.removeEventListener("touchmove", this._onTouchMoveListener, false);
        this._element.removeEventListener("touchend", this._onTouchEndListener, false);
        this._element.removeEventListener("touchcancel", this._onTouchCancelListener, false);
        this._onTouchMoveListener = void 0;
        this._onTouchEndListener = void 0;
        this._onTouchCancelListener = void 0;

        if (!this._moved) {
            var t = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            e.stopPropagation();
            if(!e.target.dispatchEvent(t)){
                e.preventDefault();
            }
        }
    };
    Tap.prototype.onTouchCancel = function (e) {
        this._moved = false;
        this._startX = 0;
        this._startY = 0;
    };
    Tap._moveTolerance = 10;

    return Tap;
});