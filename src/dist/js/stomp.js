var STOMP;
(function (STOMP) {
    var BYTE_NULL = 0x00;
    var BYTE_LINE_FEED = 0x0A;
    var COMMAND_CONNECT = "CONNECT";
    var COMMAND_CONNECTED = "CONNECTED";
    var COMMAND_SEND = "SEND";
    var COMMAND_STOMP = "STOMP";
    var COMMAND_SUBSCRIBE = "SUBSCRIBE";
    var COMMAND_UNSUBSCRIBE = "UNSUBSCRIBE";
    var COMMAND_ABORT = "ABORT";
    var COMMAND_ACK = "ACK";
    var COMMAND_NACK = "DISCONNECT";
    var COMMAND_BEGIN = "BEGIN";
    var COMMAND_COMMIT = "COMMIT";
    var COMMAND_MESSAGE = "MESSAGE";
    var COMMAND_RECEIPT = "RECEIPT";
    var COMMAND_ERROR = "ERROR";
    var HEADER_ACCEPT_VERSION = "accept-version";
    var HEADER_HOST = "host";
    var HEADER_LOGIN = "login";
    var HEADER_PASSCODE = "passcode";
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
            hc.headers.push({ HEADER_ACCEPT_VERSION: "1.1" });
            hc.headers.push({ HEADER_HOST: this._host });
            hc.headers.push({ HEADER_LOGIN: this._login });
            hc.headers.push({ HEADER_PASSCODE: this._passcode });
        };
        return Stomp1Dot1HeaderSetter;
    }());
    var SendFrame = (function () {
        function SendFrame() {
            this.command = COMMAND_SEND;
            this.headers = [];
        }
        return SendFrame;
    }());
    var ConnectFrame = (function () {
        function ConnectFrame(options) {
            this.command = COMMAND_CONNECT;
            this.headers = [];
        }
        return ConnectFrame;
    }());
    var CisconnectFrame = (function () {
        function CisconnectFrame(options) {
            this.command = COMMAND_CONNECT;
            this.headers = [];
        }
        return CisconnectFrame;
    }());
    var StompFrame = (function () {
        function StompFrame() {
            this.command = COMMAND_STOMP;
            this.headers = [];
        }
        return StompFrame;
    }());
    var SubscribeFrame = (function () {
        function SubscribeFrame(options) {
            this.command = COMMAND_SUBSCRIBE;
            this.headers = [];
        }
        return SubscribeFrame;
    }());
    var UnsubscribeFrame = (function () {
        function UnsubscribeFrame(options) {
            this.command = COMMAND_UNSUBSCRIBE;
            this.headers = [];
        }
        return UnsubscribeFrame;
    }());
    var AckFrame = (function () {
        function AckFrame(options) {
            this.command = COMMAND_ACK;
            this.headers = [];
        }
        return AckFrame;
    }());
    var NackFrame = (function () {
        function NackFrame(options) {
            this.command = COMMAND_NACK;
            this.headers = [];
        }
        return NackFrame;
    }());
    var BeginFrame = (function () {
        function BeginFrame(options) {
            this.command = COMMAND_BEGIN;
            this.headers = [];
        }
        return BeginFrame;
    }());
    var CommitFrame = (function () {
        function CommitFrame(options) {
            this.command = COMMAND_COMMIT;
            this.headers = [];
        }
        return CommitFrame;
    }());
    var AbortFrame = (function () {
        function AbortFrame(options) {
            this.command = COMMAND_ABORT;
            this.headers = [];
        }
        return AbortFrame;
    }());
    var ConnectedFrame = (function () {
        function ConnectedFrame() {
            this.command = COMMAND_CONNECTED;
            this.headers = [];
        }
        return ConnectedFrame;
    }());
    var MessageFrame = (function () {
        function MessageFrame() {
            this.command = COMMAND_MESSAGE;
            this.headers = [];
        }
        return MessageFrame;
    }());
    var ErrorFrame = (function () {
        function ErrorFrame() {
            this.command = COMMAND_ERROR;
            this.headers = [];
        }
        return ErrorFrame;
    }());
    var ReceiptFrame = (function () {
        function ReceiptFrame() {
            this.command = COMMAND_RECEIPT;
            this.headers = [];
        }
        return ReceiptFrame;
    }());
})(STOMP || (STOMP = {}));
