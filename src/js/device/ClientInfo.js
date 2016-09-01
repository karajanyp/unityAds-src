/**
 * Created by duo on 2016/9/1.
 */
CMD.register("device.ClientInfo", function (require, t, n) {
    var Model = require("model.Model");
    var AdsError = require("AdsError");
    var Platform = require("platform.Platform");

    function ClientInfo(platform, n) {
        Model.call(this);
        this._platform = platform;
        var r = n.shift();
        if ("string" != typeof r || !/^\d+$/.test(r)){
            throw new Error(AdsError[AdsError.INVALID_ARGUMENT]);
        }
        this._gameId = r;
        this._testMode = n.shift();
        this._applicationName = n.shift();
        this._applicationVersion = n.shift();
        this._sdkVersion = n.shift();
        this._sdkVersionName = n.shift();
        this._debuggable = n.shift();
        this._configUrl = n.shift();
        this._webviewUrl = n.shift();
        this._webviewHash = n.shift();
        this._webviewVersion = n.shift();
    }
    extend(ClientInfo, Model);

    ClientInfo.prototype.getGameId = function () {
        return this._gameId;
    };
    ClientInfo.prototype.getTestMode = function () {
        return this._testMode;
    };
    ClientInfo.prototype.getApplicationVersion = function () {
        return this._applicationVersion;
    };
    ClientInfo.prototype.getApplicationName = function () {
        return this._applicationName;
    };
    ClientInfo.prototype.getSdkVersion = function () {
        return this._sdkVersion;
    };
    ClientInfo.prototype.getSdkVersionName = function () {
        return this._sdkVersionName;
    };
    ClientInfo.prototype.getPlatform = function () {
        return this._platform;
    };
    ClientInfo.prototype.isDebuggable = function () {
        return this._debuggable;
    };
    ClientInfo.prototype.getConfigUrl = function () {
        return this._configUrl;
    };
    ClientInfo.prototype.getWebviewUrl = function () {
        return this._webviewUrl;
    };
    ClientInfo.prototype.getWebviewHash = function () {
        return this._webviewHash;
    };
    ClientInfo.prototype.getWebviewVersion = function () {
        return this._webviewVersion;
    };
    ClientInfo.prototype.getDTO = function () {
        return {
            gameId: this._gameId,
            testMode: this._testMode,
            bundleId: this._applicationName,
            bundleVersion: this._applicationVersion,
            sdkVersion: this._sdkVersion,
            sdkVersionName: this._sdkVersionName,
            platform: Platform[this._platform].toLowerCase(),
            encrypted: !this._debuggable,
            configUrl: this._configUrl,
            webviewUrl: this._webviewUrl,
            webviewHash: this._webviewHash,
            webviewVersion: this._webviewVersion
        };
    };

    return ClientInfo;
});
