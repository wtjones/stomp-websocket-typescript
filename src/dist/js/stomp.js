var STOMP;
(function (STOMP) {
    var BYTE_NULL = 0x00;
    var BYTE_LINE_FEED = 0x0A;
    var COMMAND_CONNECT = "CONNECT";
    var COMMAND_SEND = "SEND";
    var COMMAND_STOMP = "STOMP";
    var COMMAND_SUBSCRIBE = "SUBSCRIBE";
    var COMMAND_UNSUBSCRIBE = "UNSUBSCRIBE";
    var COMMAND_ABORT = "ABORT";
    var COMMAND_ACK = "ACK";
    var COMMAND_NACK = "DISCONNECT";
    var COMMAND_BEGIN = "BEGIN";
    var COMMAND_COMMIT = "COMMIT";
    var COMMAND_CONNECTED = "CONNECTED";
    var COMMAND_MESSAGE = "MESSAGE";
    var COMMAND_RECEIPT = "RECEIPT";
    var COMMAND_ERROR = "ERROR";
    var HEADER_ACCEPT_VERSION = "accept-version";
    var HEADER_HOST = "host";
    var HEADER_LOGIN = "login";
    var HEADER_PASSCODE = "passcode";
    var HEADER_CONTENT_LENGTH = "content-length";
    var HEADER_SEPERATOR = ":";
    function sizeOfUTF8(s) {
        var m = encodeURIComponent(s).match(/%[89ABab]/g);
        return s.length + (m ? m.length : 0);
    }
    function parseBody(data, start, content_length) {
        var result = "";
        if (content_length) {
            result = ('' + data).substring(start, start + content_length);
        }
        else {
            var chr = null;
            for (var i = start; i < data.length; i += 1) {
                chr = data.charAt(i);
                if (chr == "" + BYTE_NULL) {
                    break;
                }
                result += chr;
            }
        }
        return result;
    }
    function validateHeaders(command, headers) {
        return true;
    }
    function parseHeaderLines(headerLines) {
        var result = {};
        for (var line in headerLines) {
            var index = line.indexOf(HEADER_SEPERATOR);
            if (!(line.substring(0, index).trim() in result)) {
                result[line.substring(0, index).trim()] = [];
            }
            result[line.substring(0, index).trim()].push(line.substring(index + 1).trim());
        }
        return result;
    }
    function frameFactory(command, headers, body) {
        var result;
        switch (command) {
            case COMMAND_CONNECTED:
                result = new ConnectedFrame();
                break;
            case COMMAND_ERROR:
                result = new ErrorFrame();
                break;
            case COMMAND_RECEIPT:
                result = new ReceiptFrame();
                break;
            case COMMAND_MESSAGE:
                result = new MessageFrame();
                break;
        }
        result.command = command;
        result.headers = headers;
        validateHeaders(command, headers);
        return result;
    }
    function parseSocketMessage(data) {
        var seperator = data.search("" + BYTE_LINE_FEED + BYTE_LINE_FEED), headerRecords = data.substring(0, seperator).split("" + BYTE_LINE_FEED), command = headerRecords.shift(), headers = parseHeaderLines(headerRecords);
        var content_length;
        if (HEADER_CONTENT_LENGTH in headers) {
            content_length = parseInt(headers[HEADER_CONTENT_LENGTH][0], 10);
        }
        return frameFactory(command, headers, parseBody(data, seperator + 2, content_length));
    }
    function parseSocketMessages(data) {
        var pieces = data.split("" + BYTE_NULL + BYTE_LINE_FEED), result = [];
        for (var i = 0; i < pieces.length; i += 1) {
            if (data.length > 0)
                result.push(parseSocketMessage(pieces[i]));
        }
        return result;
    }
    var Client = (function () {
        function Client() {
        }
        return Client;
    }());
    var Stomp1Dot1HeaderSetter = (function () {
        function Stomp1Dot1HeaderSetter(options) {
            this._host = options.host;
            this._login = options.login;
            this._passcode = options.passcode;
        }
        Stomp1Dot1HeaderSetter.prototype.setHeaders = function (hc) {
            hc.headers[HEADER_ACCEPT_VERSION] = ["1.1"];
            hc.headers[HEADER_HOST] = [this._host];
            hc.headers[HEADER_LOGIN] = [this._login];
            hc.headers[HEADER_PASSCODE] = [this._passcode];
        };
        return Stomp1Dot1HeaderSetter;
    }());
    var UnsupportedFrame = (function () {
        function UnsupportedFrame() {
            this.headers = {};
        }
        return UnsupportedFrame;
    }());
    var SendFrame = (function () {
        function SendFrame() {
            this.command = COMMAND_SEND;
            this.headers = {};
        }
        return SendFrame;
    }());
    var ConnectFrame = (function () {
        function ConnectFrame(options) {
            this.command = COMMAND_CONNECT;
            this.headers = {};
        }
        return ConnectFrame;
    }());
    var DisconnectFrame = (function () {
        function DisconnectFrame(options) {
            this.command = COMMAND_CONNECT;
            this.headers = {};
        }
        return DisconnectFrame;
    }());
    var StompFrame = (function () {
        function StompFrame() {
            this.command = COMMAND_STOMP;
            this.headers = {};
        }
        return StompFrame;
    }());
    var SubscribeFrame = (function () {
        function SubscribeFrame(options) {
            this.command = COMMAND_SUBSCRIBE;
            this.headers = {};
        }
        return SubscribeFrame;
    }());
    var UnsubscribeFrame = (function () {
        function UnsubscribeFrame(options) {
            this.command = COMMAND_UNSUBSCRIBE;
            this.headers = {};
        }
        return UnsubscribeFrame;
    }());
    var AckFrame = (function () {
        function AckFrame(options) {
            this.command = COMMAND_ACK;
            this.headers = {};
        }
        return AckFrame;
    }());
    var NackFrame = (function () {
        function NackFrame(options) {
            this.command = COMMAND_NACK;
            this.headers = {};
        }
        return NackFrame;
    }());
    var BeginFrame = (function () {
        function BeginFrame(options) {
            this.command = COMMAND_BEGIN;
            this.headers = {};
        }
        return BeginFrame;
    }());
    var CommitFrame = (function () {
        function CommitFrame(options) {
            this.command = COMMAND_COMMIT;
            this.headers = {};
        }
        return CommitFrame;
    }());
    var AbortFrame = (function () {
        function AbortFrame(options) {
            this.command = COMMAND_ABORT;
            this.headers = {};
        }
        return AbortFrame;
    }());
    var ConnectedFrame = (function () {
        function ConnectedFrame() {
            this.command = COMMAND_CONNECTED;
            this.headers = {};
        }
        return ConnectedFrame;
    }());
    var MessageFrame = (function () {
        function MessageFrame() {
            this.command = COMMAND_MESSAGE;
            this.headers = {};
        }
        return MessageFrame;
    }());
    var ErrorFrame = (function () {
        function ErrorFrame() {
            this.command = COMMAND_ERROR;
            this.headers = {};
        }
        return ErrorFrame;
    }());
    var ReceiptFrame = (function () {
        function ReceiptFrame() {
            this.command = COMMAND_RECEIPT;
            this.headers = {};
        }
        return ReceiptFrame;
    }());
})(STOMP || (STOMP = {}));
