/**
 * Created by duo on 2016/9/1.
 */
CMD.register("util.VastParser", function (require) {
    var DOMParser = require("util.DOMParser");
    var VastMediaFile = require("adunit.vast.VastMediaFile");
    var VastCreativeLinear = require("adunit.vast.VastCreativeLinear");
    var VastAd = require("adunit.vast.VastAd");
    var Vast = require("adunit.vast.Vast");

    function VastParser(domParser, maxWrapperDepth) {
        if(void 0 === maxWrapperDepth ){
            maxWrapperDepth = VastParser.DEFAULT_MAX_WRAPPER_DEPTH;
        }
        this._domParser = domParser || VastParser.createDOMParser();
        this._maxWrapperDepth = maxWrapperDepth;
    }
    VastParser.createDOMParser = function () {
        return new DOMParser();
    };
    VastParser.prototype.setMaxWrapperDepth = function (maxWrapperDepth) {
        this._maxWrapperDepth = maxWrapperDepth;
    };
    VastParser.prototype.parseVast = function (vastData) {
        if (!vastData){
            throw new Error("VAST data is missing");
        }
        var vastXml = this._domParser.parseFromString(decodeURIComponent(vastData.data).trim(), "text/xml"),
            adTags = [],
            errorTags = [];
        if (null == vastXml){
            throw new Error("VAST xml data is missing");
        }
        if (null == vastXml.documentElement){
            throw new Error("VAST xml data is missing");
        }
        if ("VAST" !== vastXml.documentElement.nodeName) {
            throw new Error("VAST xml is invalid - document element must be VAST but was " + vastXml.documentElement.nodeName);
        }
        var nodes = vastXml.documentElement.childNodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if("Error" === node.nodeName ){
                errorTags.push(this.parseNodeText(node));
            }
        }
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (0 === adTags.length && "Ad" === node.nodeName) {
                var adTag = this.parseAdElement(node);
                if(null != adTag){
                    adTags.push(adTag);
                }
            }
        }
        if (0 === adTags.length){
            throw new Error("VAST Ad tag is missing");
        }
        return new Vast(adTags, errorTags, vastData.tracking);
    };
    VastParser.prototype.retrieveVast = function (vastData, nativeBridge, request, i, r) {
        var me = this;
        if(void 0 === r ){
            r = 0;
        }
        var vast = this.parseVast(vastData);
        this.applyParentURLs(vast, i);
        var url = vast.getWrapperURL();
        if (!url){
            return Promise.resolve(vast);
        }
        if (r >= this._maxWrapperDepth){
            throw new Error("VAST wrapper depth exceeded");
        }
        nativeBridge.Sdk.logInfo("Unity Ads is requesting VAST ad unit from " + url);
        return request.get(url, [], {
            retries: 5,
            retryDelay: 5e3,
            followRedirects: !0,
            retryWithConnectionEvents: !1
        }).then(function (e) {
            return me.retrieveVast({
                data: e.response,
                tracking: {}
            }, nativeBridge, request, vast, r + 1);
        });
    };
    VastParser.prototype.applyParentURLs = function (e, vast) {
        if (vast) {
            var urlTemplates = vast.getAd().getErrorURLTemplates();
            for (var n = 0; n < urlTemplates.length; n++) {
                var tpl = urlTemplates[n];
                e.getAd().addErrorURLTemplate(tpl);
            }

            var a = vast.getAd().getImpressionURLTemplates();
            for (var o = 0; o < a.length; o++) {
                var s = a[o];
                e.getAd().addImpressionURLTemplate(s);
            }

            var u = vast.getAd().getVideoClickTrackingURLTemplates();
            for (var c = 0; c < u.length; c++) {
                var l = u[c];
                e.getAd().addVideoClickTrackingURLTemplate(l);
            }

            var p = ["creativeView", "start", "firstQuartile", "midpoint", "thirdQuartile", "complete", "mute", "unmute"];
            for (var h = 0; h < p.length; h++) for (var d = p[h], f = 0, v = vast.getTrackingEventUrls(d); f < v.length; f++) {
                var g = v[f];
                e.addTrackingEventUrl(d, g);
            }
        }
    };
    VastParser.prototype.parseNodeText = function (node) {
        return node && (node.textContent || node.text);
    };
    VastParser.prototype.parseAdElement = function (e) {
        for (var el, nodes = e.childNodes, i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if ("Wrapper" === node.nodeName) {
                el = this.parseWrapperElement(node);
                break;
            }
            if ("InLine" === node.nodeName) {
                el = this.parseInLineElement(node);
                break;
            }
        }
        el && el.setId(e.getAttribute("id"));
        return el;
    };
    VastParser.prototype.parseWrapperElement = function (e) {
        return this.parseInLineElement(e);
    };
    VastParser.prototype.parseInLineElement = function (e) {
        var ad = new VastAd();
        for (var nodes = e.childNodes, i = 0; i < nodes.length; i++) {
            var node = nodes[i],
                txt = this.parseNodeText(node);
            switch (node.nodeName) {
                case "Error":
                    txt && ad.addErrorURLTemplate(txt);
                    break;

                case "Impression":
                    txt && ad.addImpressionURLTemplate(txt);
                    break;

                case "Creatives":
                    var s = this.childsByName(node, "Creative");
                    for (var c = 0; c < s.length; c++) {
                        for (var u = s[c], l = u.childNodes, h = 0; h < l.length; h++) {
                            var p = l[h], d = void 0;
                            switch (p.nodeName) {
                                case "Linear":
                                    if(0 === ad.getCreatives().length){
                                        d = this.parseCreativeLinearElement(p);
                                        d && ad.addCreative(d);
                                    }
                            }
                        }
                    }
                    break;

                case "VASTAdTagURI":
                    txt && ad.addWrapperURL(txt.trim());
            }
        }
        return ad;
    };
    VastParser.prototype.parseCreativeLinearElement = function (e) {
        var linear = new VastCreativeLinear();
        linear.setDuration(this.parseDuration(this.parseNodeText(this.childByName(e, "Duration"))));
        if (-1 === linear.getDuration() && "Wrapper" !== e.parentNode.parentNode.parentNode.nodeName) {
            return null;
        }
        var n = e.getAttribute("skipoffset");
        if (null == n) {
            linear.setSkipDelay(null);
        } else if ("%" === n.charAt(n.length - 1)) {
            var o = parseInt(n, 10);
            linear.setSkipDelay(linear.getDuration() * (o / 100));
        } else {
            linear.setSkipDelay(this.parseDuration(n));
        }
        var a = this.childByName(e, "VideoClicks");
        if (null != a) {
            linear.setVideoClickThroughURLTemplate(this.parseNodeText(this.childByName(a, "ClickThrough")));
            for (var s = this.childsByName(a, "ClickTracking"), c = 0; c < s.length; c++) {
                var u = s[c], l = this.parseNodeText(u);
                null != l && linear.addVideoClickTrackingURLTemplate(l);
            }
        }
        for (var h = this.childsByName(e, "TrackingEvents"), c = 0; c < h.length; c++) {
            for (var p = h[c], d = this.childsByName(p, "Tracking"), f = 0; f < d.length; f++) {
                var v = d[f], g = v.getAttribute("event"), _ = this.parseNodeText(v);
                null != g && null != _ && linear.addTrackingEvent(g, _);
            }
        }
        var m = this.childsByName(e, "MediaFiles");
        if (m.length > 0){
            for (var y = m[0], E = this.childsByName(y, "MediaFile"), c = 0; c < E.length; c++) {
                var S = E[c],
                    I = new VastMediaFile(
                        this.parseNodeText(S).trim(),
                        S.getAttribute("delivery"),
                        S.getAttribute("codec"),
                        S.getAttribute("type"),
                        parseInt(S.getAttribute("bitrate") || 0, 10),
                        parseInt(S.getAttribute("minBitrate") || 0, 10),
                        parseInt(S.getAttribute("maxBitrate") || 0, 10),
                        parseInt(S.getAttribute("width") || 0, 10),
                        parseInt(S.getAttribute("height") || 0, 10)
                    );
                linear.addMediaFile(I);
            }
        }
        return linear;
    };
    VastParser.prototype.parseDuration = function (e) {
        if (null == e) return -1;
        var t = e.split(":");
        if (3 !== t.length) return -1;
        var n = t[2].split("."), i = parseInt(n[0], 10);
        2 === n.length && (i += parseFloat("0." + n[1]));
        var r = 60 * parseInt(t[1], 10), o = 60 * parseInt(t[0], 10) * 60;
        return isNaN(o) || isNaN(r) || isNaN(i) || r > 3600 || i > 60 ? -1 : o + r + i;
    };
    VastParser.prototype.childByName = function (e, t) {
        for (var n = e.childNodes, i = 0; i < n.length; i++) {
            var r = n[i];
            if (r.nodeName === t) return r;
        }
    };
    VastParser.prototype.childsByName = function (e, t) {
        for (var n = [], i = e.childNodes, r = 0; r < i.length; r++) {
            var o = i[r];
            o.nodeName === t && n.push(o);
        }
        return n;
    };
    VastParser.DEFAULT_MAX_WRAPPER_DEPTH = 8;
    return VastParser;

});