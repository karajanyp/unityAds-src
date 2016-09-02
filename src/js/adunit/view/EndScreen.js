/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.EndScreen", function (require) {
    var View = require("adunit.view.View");
    var Privacy = require("adunit.view.Privacy");
    var Template = require("adunit.view.util.Template");
    var Observable = require("util.Observable");

    var tpl = '<div class="btn-close-region">' +
        '   <a class="btn-close">' +
        '       <span class="icon-close"></span>' +
        '   </a>' +
        '</div>\n' +
        '<div class="campaign-container">\n' +
        '   <div class="game-background game-background-landscape" style="background-image: url(<%= data.endScreenLandscape %>)"></div>' +
        '   <div class="game-background game-background-portrait" style="background-image: url(<%= data.endScreenPortrait %>)"></div>\n' +
        '   <div class="end-screen-info-background">\n' +
        '       <div class="end-screen-stripe"></div>\n' +
        '       <div class="end-screen-info">\n' +
        '           <div class="game-info">\n' +
        '               <div class="game-icon" style="background-image: url(<%= data.gameIcon %>)"></div>\n' +
        '               <div class="name-container"><%= data.gameName %></div>\n' +
        '           </div>\n' +
        '       <div class="store-container">\n' +
        '           <a class="store-button"></a>\n' +
        '           <div class="game-store-info">\n' +
        '               <span class="game-rating">\n' +
        '                   <span class="game-rating-mask" style="width: <%= data.rating %>%">\n' +
        '                   <% for (var i = 0; i < 5; i++) { %><span class="icon-star"></span><% } %>\n' +
        '                   </span>\n' +
        '                   <% for (var i = 0; i < 5; i++) { %>' +
        '                   <span class="icon-star"></span>' +
        '                   <% } %>\n' +
        '               </span>\n' +
        '               <br class="game-rating-br">\n' +
        '               <span class="game-rating-count">\n' +
        '                   (<span class="game-rating-count-number"><%= data.ratingCount %></span>' +
        '                   <span class="game-rating-postfix"> Ratings</span>)\n' +
        '               </span>\n' +
        '           </div>\n' +
        '       </div>\n' +
        '       <div class="download-container">\n' +
        '           <a class="btn-download">\n' +
        '               <span class="download-text">Download For Free</span>\n' +
        '           </a>\n' +
        '       </div>\n' +
        '       <div class="store-badge-container">\n' +
        '           <a class="btn-store-badge"></a>\n' +
        '       </div>\n' +
        '       <div class="unityads-logo"></div>\n' +
        '   </div>\n' +
        '   <div class="privacy-button">' +
        '       <span class="icon-info"></span>' +
        '   </div>\n' +
        '</div>\n' +
        '</div>\n';

    function EndScreen(n, o) {
        var a = this;
        View.call(this, "end-screen");
        this.onDownload = new Observable();
        this.onPrivacy = new Observable();
        this.onClose = new Observable();
        this._coppaCompliant = o;
        this._gameName = n.getGameName();
        this._template = new Template(tpl);
        if (n) {
            var s = 20 * n.getRating();
            this._templateData = {
                gameName: n.getGameName(),
                gameIcon: n.getGameIcon(),
                endScreenLandscape: n.getLandscapeUrl(),
                endScreenPortrait: n.getPortraitUrl(),
                rating: s.toString(),
                ratingCount: n.getRatingCount().toString()
            };
        }
        this._bindings = [{
            event: "click",
            listener: function (e) {
                return a.onDownloadEvent(e);
            },
            selector: ".game-background, .btn-download, .store-button, .game-icon, .store-badge-container"
        }, {
            event: "click",
            listener: function (e) {
                return a.onCloseEvent(e);
            },
            selector: ".btn-close-region"
        }, {
            event: "click",
            listener: function (e) {
                return a.onPrivacyEvent(e);
            },
            selector: ".privacy-button"
        }];
    }
    extend(EndScreen, View);

    EndScreen.prototype.show = function () {
        View.prototype.show.call(this);
        var t = this._container.querySelector(".name-container");
        t.innerHTML = this._gameName + " ";
    };
    EndScreen.prototype.onDownloadEvent = function (e) {
        e.preventDefault();
        this.onDownload.trigger();
    };
    EndScreen.prototype.onCloseEvent = function (e) {
        e.preventDefault();
        this.onClose.trigger();
    };
    EndScreen.prototype.onPrivacyEvent = function (e) {
        var me = this;
        e.preventDefault();
        var privacy = new Privacy(this._coppaCompliant);
        privacy.render();
        document.body.appendChild(privacy.container());
        privacy.onPrivacy.subscribe(function (e) {
            me.onPrivacy.trigger(e);
        });
        privacy.onClose.subscribe(function () {
            privacy.hide();
            privacy.container().parentElement.removeChild(privacy.container());
        });
    };

    return EndScreen;
});
