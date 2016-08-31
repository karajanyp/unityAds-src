/**
 * Created by duo on 2016/8/31.
 */
CMD.register("device.StreamType", function () {
    var StreamType = {};

    StreamType[StreamType.STREAM_ALARM = 4] = "STREAM_ALARM";
    StreamType[StreamType.STREAM_DTMF = 8] = "STREAM_DTMF";
    StreamType[StreamType.STREAM_MUSIC = 3] = "STREAM_MUSIC";
    StreamType[StreamType.STREAM_NOTIFICATION = 5] = "STREAM_NOTIFICATION";
    StreamType[StreamType.STREAM_RING = 2] = "STREAM_RING";
    StreamType[StreamType.STREAM_SYSTEM = 1] = "STREAM_SYSTEM";
    StreamType[StreamType.STREAM_VOICE_CALL = 0] = "STREAM_VOICE_CALL";

    return StreamType;
});