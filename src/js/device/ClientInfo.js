/**
 * Created by duo on 2016/9/1.
 */
CMD.register("device.ClientInfo", function (require) {
    var Model = require("model.Model");
    var AdsError = require("AdsError");
    var Platform = require("platform.Platform");

    /**
     * SDK Environment info
     * @param platform
     * @param nativeClientInfo {Array} from native
     * @constructor
     */
    function ClientInfo(platform, nativeClientInfo) {
        Model.call(this);
        this._platform = platform;
        var gameId = nativeClientInfo.shift();
        if ("string" != typeof gameId || !/^\d+$/.test(gameId)){
            throw new Error(AdsError[AdsError.INVALID_ARGUMENT]);
        }
        this._gameId = gameId;
        this._testMode = nativeClientInfo.shift();
        this._applicationName = nativeClientInfo.shift();
        this._applicationVersion = nativeClientInfo.shift();
        this._sdkVersion = nativeClientInfo.shift();
        this._sdkVersionName = nativeClientInfo.shift();
        this._debuggable = nativeClientInfo.shift();
        this._configUrl = nativeClientInfo.shift();
        this._webviewUrl = nativeClientInfo.shift();
        this._webviewHash = nativeClientInfo.shift();
        this._webviewVersion = nativeClientInfo.shift();
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
