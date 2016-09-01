/**
 * Created by duo on 2016/9/1.
 */
CMD.register("adunit.vast.VastMediaFile", function () {
    function VastMediaFile(fileURL, deliveryType, codec, mimeType, bitrate, minBitrate, maxBitrate, width, height) {
        this._fileURL = fileURL || null;
        this._deliveryType = deliveryType || "progressive";
        this._mimeType = mimeType || null;
        this._codec = codec || null;
        this._bitrate = bitrate || 0;
        this._minBitrate = minBitrate || 0;
        this._maxBitrate = maxBitrate || 0;
        this._width = width || 0;
        this._height = height || 0;
        this._apiFramework = null;
        this._scalable = null;
        this._maintainAspectRatio = null;
    }
    VastMediaFile.prototype.getFileURL = function () {
        return this._fileURL;
    };
    VastMediaFile.prototype.getMIMEType = function () {
        return this._mimeType;
    };
    return VastMediaFile;
});
