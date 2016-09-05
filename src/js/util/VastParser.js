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
        var nodes = vastXml.documentElement.childNodes, i, node;
        for (i = 0; i < nodes.length; i++) {
            node = nodes[i];
            if("Error" === node.nodeName ){
                errorTags.push(this.parseNodeText(node));
            }
        }
        for (i = 0; i < nodes.length; i++) {
            node = nodes[i];
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
    VastParser.prototype.retrieveVast = function (vastData, nativeBridge, request, parentVast, level) {
        var me = this;
        if(void 0 === level ){
            level = 0;
        }
        var vast = this.parseVast(vastData);
        this.applyParentURLs(vast, parentVast);
        var url = vast.getWrapperURL();
        if (!url){
            return Promise.resolve(vast);
        }
        if (level >= this._maxWrapperDepth){
            throw new Error("VAST wrapper depth exceeded");
        }
        nativeBridge.Sdk.logInfo("OneWay SDK is requesting VAST ad unit from " + url);
        return request.get(url, [], {
            retries: 5,
            retryDelay: 5e3,
            followRedirects: true,
            retryWithConnectionEvents: false
        }).then(function (e) {
            return me.retrieveVast({
                data: e.response,
                tracking: {}
            }, nativeBridge, request, vast, level + 1);
        });
    };
    VastParser.prototype.applyParentURLs = function (vast, parentVast) {
        if (parentVast) {
            var errorURLTemplates = parentVast.getAd().getErrorURLTemplates(), i, tpl;
            for (i = 0; i < errorURLTemplates.length; i++) {
                tpl = errorURLTemplates[i];
                vast.getAd().addErrorURLTemplate(tpl);
            }

            var impressionURLTemplates = parentVast.getAd().getImpressionURLTemplates();
            for (i = 0; i < impressionURLTemplates.length; i++) {
                tpl = impressionURLTemplates[i];
                vast.getAd().addImpressionURLTemplate(tpl);
            }

            var videoClickTrackingURLTemplates = parentVast.getAd().getVideoClickTrackingURLTemplates();
            for (i = 0; i < videoClickTrackingURLTemplates.length; i++) {
                tpl = videoClickTrackingURLTemplates[i];
                vast.getAd().addVideoClickTrackingURLTemplate(tpl);
            }

            var trackingEvents = ["creativeView", "start", "firstQuartile", "midpoint", "thirdQuartile", "complete", "mute", "unmute"];
            for (i = 0; i < trackingEvents.length; i++) {
                var trackingEvent = trackingEvents[i],
                    trackingEventUrl = parentVast.getTrackingEventUrls(trackingEvent);
                for (var j = 0; j < trackingEventUrl.length; j++) {
                    var url = trackingEventUrl[j];
                    vast.addTrackingEventUrl(trackingEvent, url);
                }
            }
        }
    };
    VastParser.prototype.parseNodeText = function (node) {
        return node && (node.textContent || node.text);
    };
    VastParser.prototype.parseAdElement = function (adElement) {
        for (var el, nodes = adElement.childNodes, i = 0; i < nodes.length; i++) {
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
        el && el.setId(adElement.getAttribute("id"));
        return el;
    };
    VastParser.prototype.parseWrapperElement = function (wrapperElement) {
        return this.parseInLineElement(wrapperElement);
    };
    VastParser.prototype.parseInLineElement = function (inlineElement) {
        var ad = new VastAd();
        for (var nodes = inlineElement.childNodes, i = 0; i < nodes.length; i++) {
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
                    var creativeNodes = this.childsByName(node, "Creative");
                    for (var j = 0; j < creativeNodes.length; j++) {
                        var creativeNode = creativeNodes[j],
                            childNodes = creativeNode.childNodes;
                        for (var k = 0; k < childNodes.length; k++) {
                            var childNode = childNodes[k], linear = void 0;
                            switch (childNode.nodeName) {
                                case "Linear":
                                    if(0 === ad.getCreatives().length){
                                        linear = this.parseCreativeLinearElement(childNode);
                                        if(linear){
                                            ad.addCreative(linear);
                                        }
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
    VastParser.prototype.parseCreativeLinearElement = function (linearElement) {
        var linear = new VastCreativeLinear();
        linear.setDuration(this.parseDuration(this.parseNodeText(this.childByName(linearElement, "Duration"))));
        if (-1 === linear.getDuration() && "Wrapper" !== linearElement.parentNode.parentNode.parentNode.nodeName) {
            return null;
        }
        var skipOffset = linearElement.getAttribute("skipoffset");
        if (null == skipOffset) {
            linear.setSkipDelay(null);
        } else if ("%" === skipOffset.charAt(skipOffset.length - 1)) {
            var offset = parseInt(skipOffset, 10);
            linear.setSkipDelay(linear.getDuration() * (offset / 100));
        } else {
            linear.setSkipDelay(this.parseDuration(skipOffset));
        }
        var videoClicksElement = this.childByName(linearElement, "VideoClicks"), i;
        if (null != videoClicksElement) {
            linear.setVideoClickThroughURLTemplate(this.parseNodeText(this.childByName(videoClicksElement, "ClickThrough")));
            var clickTrackingElements = this.childsByName(videoClicksElement, "ClickTracking");
            for (i = 0; i < clickTrackingElements.length; i++) {
                var clickTrackingElement = clickTrackingElements[i],
                    tpl = this.parseNodeText(clickTrackingElement);
                if(null != tpl){
                    linear.addVideoClickTrackingURLTemplate(tpl);
                }
            }
        }
        var trackingEventsElements = this.childsByName(linearElement, "TrackingEvents");
        for (i = 0; i < trackingEventsElements.length; i++) {
            var trackingEventsElement = trackingEventsElements[i],
                trackingElements = this.childsByName(trackingEventsElement, "Tracking");
            for (var j = 0; j < trackingElements.length; j++) {
                var trackingElement = trackingElements[j],
                    event = trackingElement.getAttribute("event"),
                    handler = this.parseNodeText(trackingElement);
                if(null != event && null != handler){
                    linear.addTrackingEvent(event, handler);
                }
            }
        }
        var mediaFilesElements = this.childsByName(linearElement, "MediaFiles");
        if (mediaFilesElements.length > 0){
            var mediaFilesElement = mediaFilesElements[0],
                mediaFileElements = this.childsByName(mediaFilesElement, "MediaFile");
            for (i = 0; i < mediaFileElements.length; i++) {
                var mediaFileElement = mediaFileElements[i],
                    mediaFile = new VastMediaFile(
                        this.parseNodeText(mediaFileElement).trim(),
                        mediaFileElement.getAttribute("delivery"),
                        mediaFileElement.getAttribute("codec"),
                        mediaFileElement.getAttribute("type"),
                        parseInt(mediaFileElement.getAttribute("bitrate") || 0, 10),
                        parseInt(mediaFileElement.getAttribute("minBitrate") || 0, 10),
                        parseInt(mediaFileElement.getAttribute("maxBitrate") || 0, 10),
                        parseInt(mediaFileElement.getAttribute("width") || 0, 10),
                        parseInt(mediaFileElement.getAttribute("height") || 0, 10)
                    );
                linear.addMediaFile(mediaFile);
            }
        }
        return linear;
    };
    VastParser.prototype.parseDuration = function (durationText) {
        if (null == durationText){
            return -1;
        }
        var t = durationText.split(":");
        if (3 !== t.length){
            return -1;
        }
        var n = t[2].split("."),
            i = parseInt(n[0], 10);
        if(2 === n.length){
            i += parseFloat("0." + n[1]);
        }
        var r = 60 * parseInt(t[1], 10),
            o = 60 * parseInt(t[0], 10) * 60;
        if(isNaN(o) || isNaN(r) || isNaN(i) || r > 3600 || i > 60){
            return -1
        }else{
            return o + r + i;
        }
    };
    VastParser.prototype.childByName = function (parentNode, name) {
        for (var nodes = parentNode.childNodes, i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (node.nodeName === name){
                return node;
            }
        }
    };
    VastParser.prototype.childsByName = function (parentNode, name) {
        for (var childs = [], nodes = parentNode.childNodes, i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            node.nodeName === name && childs.push(node);
        }
        return childs;
    };
    VastParser.DEFAULT_MAX_WRAPPER_DEPTH = 8;
    return VastParser;

});