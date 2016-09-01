/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.view.Overlay", function (require) {
    var View = require("adunit.view.View");
    var Template = require("adunit.view.util.Template");
    var Observable = require("util.observable");

    var tpl = '<div class="skip-button">You can skip this video in <span class="skip-duration">0</span> seconds</div>\n' +
        '<div class="buffering-spinner">\n' +
        '   <div class="spinner-animation"></div>\n' +
        '   <div class="spinner-text">Buffering</div>\n' +
        '</div>\n' +
        '<div class="mute-button <%= data.muted ? \'muted\' : \'\' %>">\n' +
        '   <div class="mute-icon"><span class="icon-volume"></span></div>\n' +
        '   <div class="unmute-icon"><span class="icon-volume-mute"></span></div>\n' +
        '</div>\n' +
        '<div class="video-duration-text">This video ends in <span class="video-duration">0</span> seconds</div>\n' +
        '<div class="call-button">Learn More</div>\n' +
        '<div class="debug-message-text"></div>';

    function Overlay(muted) {
        var me = this;
        View.call(this, "overlay");
        this.onSkip = new Observable.Observable1();
        this.onMute = new Observable.Observable1();
        this.onCallButton = new Observable.Observable1();
        this._spinnerEnabled = false;
        this._skipVisible = false;
        this._videoDurationEnabled = false;
        this._muteEnabled = false;
        this._debugMessageVisible = false;
        this._callButtonVisible = false;
        this._template = new Template(tpl);
        this._muted = muted;
        this._templateData = {
            muted: this._muted
        };
        this._bindings = [{
            event: "click",
            listener: function (e) {
                return me.onSkipEvent(e);
            },
            selector: ".skip-button"
        }, {
            event: "click",
            listener: function (e) {
                return me.onMuteEvent(e);
            },
            selector: ".mute-button"
        }, {
            event: "click",
            listener: function (e) {
                return me.onCallButtonEvent(e);
            },
            selector: ".call-button"
        }];
    }
    extend(Overlay, View);
    Overlay.prototype.render = function () {
        View.prototype.render.call(this);
        this._skipElement = this._container.querySelector(".skip-button");
        this._spinnerElement = this._container.querySelector(".buffering-spinner");
        this._skipDurationElement = this._container.querySelector(".skip-duration");
        this._videoDurationElement = this._container.querySelector(".video-duration-text");
        this._videoDurationCounterElement = this._container.querySelector(".video-duration");
        this._muteButtonElement = this._container.querySelector(".mute-button");
        this._debugMessageElement = this._container.querySelector(".debug-message-text");
        this._callButtonElement = this._container.querySelector(".call-button");
    };
    Overlay.prototype.setSpinnerEnabled = function (spinnerEnabled) {
        if(this._spinnerEnabled !== spinnerEnabled){
            this._spinnerEnabled = spinnerEnabled;
            this._spinnerElement.style.display = spinnerEnabled ? "block" : "none";
        }
    };
    Overlay.prototype.setSkipVisible = function (skipVisible) {
        if(this._skipVisible !== skipVisible){
            this._skipElement.style.display = skipVisible ? "block" : "none";
        }
    };
    Overlay.prototype.setSkipEnabled = function (skipEnabled) {
        if(this._skipEnabled !== skipEnabled ){
            this._skipEnabled = skipEnabled;
        }
    };
    Overlay.prototype.setSkipDuration = function (duration) {
        this._skipDuration = this._skipRemaining = 1000 * duration;
        this.setSkipText(duration);
    };
    Overlay.prototype.setVideoDurationEnabled = function (durationEnabled) {
        if(this._videoDurationEnabled !== durationEnabled ){
            this._videoDurationEnabled = durationEnabled;
            this._videoDurationElement.style.display = durationEnabled ? "block" : "none";
        }
    };
    Overlay.prototype.setVideoDuration = function (millisconds) {
        this._videoDuration = millisconds;
        this._videoDurationCounterElement.innerHTML = Math.round(millisconds / 1000).toString();
    };
    Overlay.prototype.setVideoProgress = function (playedMillisconds) {
        this._videoProgress = playedMillisconds;
        if(this._skipEnabled && this._skipRemaining > 0 ){
            this._skipRemaining = Math.round((this._skipDuration - playedMillisconds) / 1000);
            this.setSkipText(this._skipRemaining);
        }
        if(this._videoDuration > playedMillisconds ){
            this._videoDurationCounterElement.innerHTML = Math.round((this._videoDuration - playedMillisconds) / 1000).toString();
        }else{
            this._videoDurationCounterElement.innerHTML = "0";
        }
    };
    Overlay.prototype.setMuteEnabled = function (muteEnabled) {
        if(this._muteEnabled !== muteEnabled ){
            this._muteEnabled = muteEnabled;
            this._muteButtonElement.style.display = muteEnabled ? "block" : "none";
        }
    };
    Overlay.prototype.setDebugMessage = function (msg) {
        this._debugMessageElement.innerHTML = msg;
    };
    Overlay.prototype.setDebugMessageVisible = function (isVisible) {
        if(this._debugMessageVisible !== isVisible ){
            this._debugMessageElement.style.display = isVisible ? "block" : "none";
        }
    };
    Overlay.prototype.setCallButtonVisible = function (isVisible) {
        if(this._callButtonVisible !== isVisible ){
            this._callButtonElement.style.display = isVisible ? "block" : "none";
        }
    };
    Overlay.prototype.isMuted = function () {
        return this._muted;
    };
    Overlay.prototype.setSkipText = function (e) {
        if(0 >= e ){
            this._skipElement.innerHTML = "Skip Video"
        }else{
            this._skipDurationElement.innerHTML = e.toString();
        }
    };
    Overlay.prototype.onSkipEvent = function (e) {
        e.preventDefault();
        if(this._skipEnabled && this._videoProgress > this._skipDuration ){
            this.onSkip.trigger(this._videoProgress);
        }
    };
    Overlay.prototype.onMuteEvent = function (e) {
        e.preventDefault();
        if(this._muted){
            this._muteButtonElement.classList.remove("muted");
            this._muted = false;
        }else{
            this._muteButtonElement.classList.add("muted");
            this._muted = true;
        }
        this.onMute.trigger(this._muted);
    };
    Overlay.prototype.onCallButtonEvent = function (e) {
        e.preventDefault();
        this.onCallButton.trigger(true);
    };

    return Overlay;
});