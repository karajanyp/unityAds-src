/**
 * Created by duo on 2016/9/1.
 */
CMD.register("session.Session", function () {
    function Session(id) {
        this.showSent = false;
        this.startSent = false;
        this.firstQuartileSent = false;
        this.midpointSent = false;
        this.thirdQuartileSent = false;
        this.viewSent = false;
        this.skipSent = false;
        this.impressionSent = false;
        this._id = id;
    }
    Session.prototype.getId = function () {
        return this._id;
    };

    return Session;
});
