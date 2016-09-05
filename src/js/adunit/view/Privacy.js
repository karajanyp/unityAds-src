/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.Privacy", function (require) {
    var View = require("adunit.view.View");
    var Observable = require("util.Observable");
    var Template = require("adunit.view.util.Template");

    var tpl = '' +
        '<div class="pop-up">\n' +
        '<% if(!data.isCoppaCompliant) { %>\n' +
        '<div class="privacy-text">\n' +
        'This advertisement has been served by OneWay SDK.\n' +
        'OneWay SDK collects and uses information gathered through your use of your apps in order to create an individualized and more relevant user experience, to predict your preferences, and to show you ads that are more likely to interest you (��personalized ads��).\n' +
        'Please read our <a href="https://unity3d.com/legal/privacy-policy">Privacy Policy</a> for a full description of our data practices.\n' +
        'You may be able to opt-out of OneWay SDK�� collection and use of your mobile app data for personalized ads through your device settings.\n' +
        '</div>\n' +
        '<% } else { %>\n' +
        '<div class="privacy-simple-text">\n' +
        'This advertisement has been served by OneWay SDK. Please read our <a href="https://unity3d.com/legal/privacy-policy">Privacy Policy</a> for a full description of our data practices.\n' +
        '</div>\n' +
        '<% } %>\n' +
        '<div class="ok-button">Ok</div>\n' +
        '</div>\n';

    function Privacy(coppaCompliant) {
        var me = this;
        View.call(this, "privacy");
        this.onPrivacy = new Observable();
        this.onClose = new Observable();
        this._template = new Template(tpl);
        this._templateData = {
            isCoppaCompliant: coppaCompliant
        };
        this._bindings = [{
            event: "click",
            listener: function (e) {
                return me.onOkEvent(e);
            },
            selector: ".ok-button"
        }, {
            event: "click",
            listener: function (e) {
                return me.onPrivacyEvent(e);
            },
            selector: "a"
        }];
    }
    extend(Privacy, View);
    Privacy.prototype.onPrivacyEvent = function (e) {
        e.preventDefault();
        this.onPrivacy.trigger(e.target.href);
    };
    Privacy.prototype.onOkEvent = function (e) {
        e.preventDefault();
        this.onClose.trigger();
    };
    return Privacy;
});