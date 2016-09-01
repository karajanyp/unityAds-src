/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.View", function (require) {
    var Tap = require("adunit.view.util.Tap");

    function View(id) {
        this._id = id;
    }
    View.prototype.render = function () {
        var me = this;
        this._container = document.createElement("div");
        this._container.id = this._id;
        this._container.innerHTML = this._template.render(this._templateData);
        this._bindings.forEach(function (interaction) {
            var els = me._container.querySelectorAll(interaction.selector);
            for (var r = 0; r < els.length; ++r) {
                var el = els[r];
                if("click" === interaction.event ){
                    interaction.tap = new Tap(el);
                }
                el.addEventListener(interaction.event, interaction.listener, false);
            }
        });
    };
    View.prototype.container = function () {
        return this._container;
    };
    View.prototype.show = function () {
        this._container.style.visibility = "visible";
    };
    View.prototype.hide = function () {
        this._container.style.visibility = "hidden";
    };
    return View;
});
