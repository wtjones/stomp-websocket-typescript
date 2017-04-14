/* Specification */
//http://stomp.github.io/stomp-specification-1.1.html#SEND

/* Comments of this file are mostly taken from http://stomp.github.io/stomp-specification-1.1.html licensed under.
This specification is licensed under the Creative Commons Attribution v2.5 license.
*/

/* Typescript code not related to comments is under the the project license */

//BNF Backus-Naur Form


/* 
LF                  = <US-ASCII new line (line feed) (octet 10)>
OCTET               = <any 8-bit sequence of data>
NULL                = <octet 0>

frame-stream        = 1*frame

frame               = command LF
                      *( header LF )
                      LF
                      *OCTET
                      NULL
                      *( LF )

command             = client-command | server-command

client-command      = "SEND"
                      | "SUBSCRIBE"
                      | "UNSUBSCRIBE"
                      | "BEGIN"
                      | "COMMIT"
                      | "ABORT"
                      | "ACK"
                      | "NACK"
                      | "DISCONNECT"
                      | "CONNECT"
                      | "STOMP"

server-command      = "CONNECTED"
                      | "MESSAGE"
                      | "RECEIPT"
                      | "ERROR"

header              = header-name ":" header-value
header-name         = 1*<any OCTET except LF or ":">
header-value        = *<any OCTET except LF or ":">
*/

namespace STOMP {


    const BYTE_NULL = 0x00;
    const BYTE_LINE_FEED = 0x0A;

    //client
    const COMMAND_CONNECT = "CONNECT";
    const COMMAND_SEND = "SEND";
    const COMMAND_STOMP = "STOMP";
    const COMMAND_SUBSCRIBE = "SUBSCRIBE";
    const COMMAND_UNSUBSCRIBE = "UNSUBSCRIBE";
    const COMMAND_ABORT = "ABORT";
    const COMMAND_ACK = "ACK";
    const COMMAND_NACK = "DISCONNECT";
    const COMMAND_BEGIN = "BEGIN";
    const COMMAND_COMMIT = "COMMIT";

    //Server
    const COMMAND_CONNECTED = "CONNECTED";
    const COMMAND_MESSAGE = "MESSAGE";
    const COMMAND_RECEIPT = "RECEIPT";
    const COMMAND_ERROR = "ERROR";

    const HEADER_ACCEPT_VERSION = "accept-version";
    const HEADER_HOST = "host"; 
    const HEADER_LOGIN = "login";
    const HEADER_PASSCODE = "passcode";
    const HEADER_CONTENT_LENGTH = "content-length";
    
    const HEADER_SEPERATOR = ":";

    /*

    <START of frame (not actually included)>
    FRAME command
    header1
    header2

    Body^@
    <END of frame (not actually included)>

        Escapes

        \n (octet 92 and 110) translates to newline (octet 10)
        \c (octet 92 and 99) translates to : (octet 58)
        \\ (octet 92 and 92) translates to \ (octet 92)


        Undefined escape sequences such as \r (octet 92 and 114) MUST be treated as a fatal protocol error.

    */

    interface headerContainer {
        headers:{[key:string]:string[]}
    }

    interface frame extends headerContainer {
        command: string
        headers:{[key:string]:string[]}/*The intermediate server MAY 'update' header values by either prepending headers to the message or modifying a header in-place in the message.*/
    }

    //Only the SEND, MESSAGE, and ERROR frames can have a body. All other frames MUST NOT have a body.

    interface bodyContainer {
        body: any
        /*
        The SEND, MESSAGE and ERROR frames SHOULD include a content-length header if a frame body is present. 
        If a frame's body contains NULL octets, the frame MUST include a content-length header. T
        he header is a byte count for the length of the message body. If a content-length header is included, 
        this number of bytes MUST be read, regardless of whether or not there are null characters in the body. 
        The frame still needs to be terminated with a null byte.
        */
    }
    interface headerSetter {
        setHeaders(hc: headerContainer): void;
    }
    interface stompHeader1Dot1HeaderOptions {
        login: string;
        passcode: string;
        host: string;
    }
    interface receiptOption {
        receipt: string;
    }
    interface destinationOption {
        destination: string;
    }

    interface idOption {
        id: string;
    }

    interface transactionOption {
        transaction: string;
    }
    interface maybeTransactionOption {
        transaction?: string; /* can't extend transactionOptions because it is optional */
    }
    interface sendFrameOptions extends destinationOption, maybeTransactionOption, receiptOption {
        content_type: string;
        content_length: number;
        content: any;
    }
    interface heartbeat_options {
        outgoing: number;
        incomming: number;
    }
    interface connectFrameOptions {
        heartbeat_options?: heartbeat_options;
    }
    interface disconnectFrameOptions extends receiptOption {
    }
    interface subscribeFrameOptions extends destinationOption, idOption, receiptOption {
        ack: string; /* auto, client, client-individual */
        /*
        When the the ack mode is auto, then the client does not need to send the server ACK frames for the messages it receives. 
        The server will assume the client has received the message as soon as it sends it to the the client. T
        his acknowledgment mode can cause messages being transmitted to the client to get dropped.
        */ // FRAME DROPPING MODE
        
        /*
        When the the ack mode is client, then the client MUST send the server ACK frames for the messages it processes. 
        If the connection fails before a client sends an ACK for the message the server will assume the message has not 
        been processed and MAY redeliver the message to another client. The ACK frames sent by the client will be treated 
        as a cumulative ACK. This means the ACK operates on the message specified in the ACK frame and all messages sent 
        to the subscription before the ACK-ed message. 
        */ // POSSIBLE FRAME DROPPING MODE

        /*
        When the the ack mode is client-individual, the ack mode operates just like the client ack mode except that the ACK or 
        NACK frames sent by the client are not cumulative. This means that an ACK or NACK for a subsequent message MUST NOT 
        cause a previous message to get acknowledged.
        */ // NO LOST DATA

    }
    interface unsubscribeFrameOptions extends idOption, receiptOption {
    }
    interface ackFrameOptions extends maybeTransactionOption, receiptOption {
        message_id: string;
        subscription: string;
    }


    function sizeOfUTF8(s:string){
        // Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
        var m = encodeURIComponent(s).match(/%[89ABab]/g);
        return s.length + (m ? m.length : 0);
    }

    function parseBody(data: string, start: number, content_length?: number):string{
        var result = "";
        if(content_length){
            result = ('' + data).substring(start, start + content_length)
        }
        else{
           // Length is unknown read until end or seperator 
           var chr = null
            for(var i = start; i<data.length; i+=1){
                chr = data.charAt(i)
                if(chr == ""+BYTE_NULL){
                    break;
                }
                result += chr
            }
        }
        return result;       
    }
    function validateHeaders(command: string, headers:{[key:string]:string[]}){
        //TODO:
        return true;
    }
    function parseHeaderLines(headerLines: string[]){
           var result:{[key:string]:string[]}={};
           for(var line in headerLines){
               var index = line.indexOf(HEADER_SEPERATOR);
               if(!(line.substring(0,index).trim() in result)){
                result[line.substring(0,index).trim()] = []
               }
               result[line.substring(0,index).trim()].push(line.substring(index+1).trim()); 
           }
           return result;
    }

    function frameFactory(command:string, headers:{[key:string]:string[]}, body?:string):frame{
        var result: frame;
        switch(command){
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
        result.headers =  headers;
        validateHeaders(command,headers);
        return result;
    }
    function parseSocketMessage(data:string){
       var seperator = data.search(""+BYTE_LINE_FEED+BYTE_LINE_FEED),
           headerRecords = data.substring(0, seperator).split(""+BYTE_LINE_FEED),
           command = headerRecords.shift(),
           headers = parseHeaderLines(headerRecords);
          var content_length;
          if(HEADER_CONTENT_LENGTH in headers){
              content_length = parseInt(headers[HEADER_CONTENT_LENGTH][0],10);
          }
          return frameFactory(command, headers, parseBody(data, seperator+2, content_length));
    }
    function parseSocketMessages(data:string){
        var pieces:string[] = data.split(""+BYTE_NULL+BYTE_LINE_FEED),
        result: frame[] = [];
        for(var i = 0; i<pieces.length; i+=1){
            if(data.length>0)
            result.push(parseSocketMessage(pieces[i]));
        }
        return result;
    }

    class Client {
        constructor (){

            
        }  
    }

    class Stomp1Dot1HeaderSetter implements headerSetter{
        _login: string;
        _passcode: string;
        _host: string;
        constructor(options: stompHeader1Dot1HeaderOptions){
            this._host = options.host;
            this._login = options.login;
            this._passcode = options.passcode;
        }
        setHeaders(hc: headerContainer){
            hc.headers[HEADER_ACCEPT_VERSION]=["1.1"];
            hc.headers[HEADER_HOST]=[this._host];
            hc.headers[HEADER_LOGIN]=[this._login];
            hc.headers[HEADER_PASSCODE]=[this._passcode];
        }
    }
    /* Client Frames */

    class UnsupportedFrame implements frame {
        command: string;
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
    }

    class SendFrame  implements frame, bodyContainer  {
        command = COMMAND_SEND;
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        body: any;

        /* 
        Header content-type

        The SEND, MESSAGE and ERROR frames SHOULD include a content-type header if a frame body is present. 
        It SHOULD be set to a mime type which describes the format of the body to help the receiver of the frame interpret it's contents. 
        If the content-type header is not set, the receiver SHOULD consider the body to be a binary blob.

        The implied text encoding for mime types starting with text/ is UTF-8. If you are using a text based mime type with a different 
        encoding then you SHOULD append ;charset=<encoding> to the mime type. For example, text/html;charset=utf-16 SHOULD be used if your
        sending an html body in UTF-16 encoding. The ;charset=<encoding> SHOULD also get appended to any non text/ mime types which can 
        be interpreted as text. A good example of this would be a UTF-8 encoded XML. It's content-type SHOULD get set to application/xml;charset=utf-8

        All STOMP clients and servers MUST support UTF-8 encoding and decoding. Therefore, for maximum interoperability in a heterogeneous 
        computing environment, it is RECOMMENDED that text based content be encoded with UTF-8.
        */
    }

    class ConnectFrame implements frame {
        command = COMMAND_CONNECT
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        constructor(options: connectFrameOptions){
            //TODO:
        }
        // The server SHOULD respond back with an ERROR frame listing why the connection was rejected and then close the connection.
        // STOMP servers MUST support clients which rapidly connect and disconnect.
        // This means that a client may not receive the ERROR frame before the socket is reset.
    }

    class DisconnectFrame implements frame {
        command = COMMAND_CONNECT
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        constructor(options: disconnectFrameOptions){
            //TODO:
        }
        /* last message sent */
        /* SHOULD wait for receiptFRAME 

    Example:

    RECEIPT
    receipt-id:77
    ^@

        */

    }

    class StompFrame implements frame {
        command = COMMAND_STOMP
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        // The server SHOULD respond back with an ERROR frame listing why the connection was rejected and then close the connection.
        // STOMP servers MUST support clients which rapidly connect and disconnect.
        // This means that a client may not receive the ERROR frame before the socket is reset.
    }



    class SubscribeFrame implements frame {
        command = COMMAND_SUBSCRIBE
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        constructor(options: subscribeFrameOptions){
            //TODO:
        }
    }


    class UnsubscribeFrame implements frame {
        command = COMMAND_UNSUBSCRIBE
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        constructor(options: unsubscribeFrameOptions){
            //TODO:
        }
    }


    class AckFrame implements frame {
        command = COMMAND_ACK
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        constructor(options: ackFrameOptions){
            //TODO:
        }
    }

    class NackFrame implements frame {
        command = COMMAND_NACK
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        constructor(options: ackFrameOptions){
            //TODO:
        }
    }

    class BeginFrame implements frame {
        command = COMMAND_BEGIN
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        constructor(options: transactionOption & receiptOption){
            //TODO:
        }
    }

    class CommitFrame implements frame {
        command = COMMAND_COMMIT
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        constructor(options: transactionOption & receiptOption){
            //TODO:
        }
    }

    class AbortFrame implements frame {
        command = COMMAND_ABORT
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        constructor(options: transactionOption & receiptOption){
            //TODO:
        }
    }


    /* Server Frames */
    class ConnectedFrame implements frame {
        command = COMMAND_CONNECTED;
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
    /*


    STOMP 1.1 servers MUST set the following headers:

        version : The version of the STOMP protocol the session will be using. See Protocol Negotiation for more details.

    STOMP 1.1 servers MAY set the following headers:

        session : A session id that uniquely identifies the session.

        server : A field that contains information about the STOMP server. The field MUST contain a server-name field and MAY be followed by optional comment feilds delimited by a space character.

        The server-name field consists of a name token followed by an optional version number token.

        server = name ["/" version] *(comment)
    */
    }

    class MessageFrame implements frame {
        command = COMMAND_MESSAGE;
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        /* MESSAGE frames are used to convey messages from subscriptions to the client. 
        The MESSAGE frame will include a destination header indicating the destination 
        the message was sent to. It will also contain a message-id header with a unique 
        identifier for that message. The subscription header will be set to match the id 
        header of the subscription that is receiving the message. The frame body contains 
        the contents of the message:
        
    MESSAGE
    subscription:0
    message-id:007
    destination:/queue/a
    content-type:text/plain

    hello queue a^@

    MESSAGE frames SHOULD include a content-length header and a content-type header if a body is present.

        MESSAGE frames will also include all user defined headers that were present when the message
        was sent to the destination in addition to the server specific headers that MAY get added to 
        the frame. Consult your server's documentation to find out the server specific headers that 
        it adds to messages.
        */
    }

    class ErrorFrame implements frame {
        command = COMMAND_ERROR;
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        /*The server MAY send ERROR frames if something goes wrong. The error frame SHOULD contain a message header 
        with a short description of the error, and the body MAY contain more detailed information (or MAY be empty).
        If the error is related to specific frame sent from the client, the server SHOULD add additional headers to 
        help identify the original frame that caused the error. For example, if the frame included a receipt header, 
        the ERROR frame SHOULD set the receipt-id header to match the value of the receipt header of the frame which the error is related to.

        ERROR frames SHOULD include a content-length header and a content-type header if a body is present.
        */

    }

    class ReceiptFrame implements frame {
        command = COMMAND_RECEIPT;
        headers:{[key:string]:string[]} = <{[key:string]:string[]}>{};    
        /*A RECEIPT frame is sent from the server to the client once a server has successfully 
        processed a client frame that requests a receipt. A RECEIPT frame will include the header
        receipt-id, where the value is the value of the receipt header in the frame which this is a receipt for.*/

    }



/*
TODO: Timing library instead of unreliable javascript timers

*/

    
}