var STOMP;!function(n){var t="CONNECT",i="CONNECTED",s="SEND",h="STOMP",o="SUBSCRIBE",c="UNSUBSCRIBE",e="ABORT",a="ACK",u="DISCONNECT",d="BEGIN",f="COMMIT",m="MESSAGE",E="RECEIPT",r="ERROR";(function(){function n(){}})(),function(){function n(n){this._host=n.host,this._login=n.login,this._passcode=n.passcode}n.prototype.setHeaders=function(n){n.headers.push({HEADER_ACCEPT_VERSION:"1.1"}),n.headers.push({HEADER_HOST:this._host}),n.headers.push({HEADER_LOGIN:this._login}),n.headers.push({HEADER_PASSCODE:this._passcode})}}(),function(){function n(){this.command=s,this.headers=[]}}(),function(){function n(n){this.command=t,this.headers=[]}}(),function(){function n(n){this.command=t,this.headers=[]}}(),function(){function n(){this.command=h,this.headers=[]}}(),function(){function n(n){this.command=o,this.headers=[]}}(),function(){function n(n){this.command=c,this.headers=[]}}(),function(){function n(n){this.command=a,this.headers=[]}}(),function(){function n(n){this.command=u,this.headers=[]}}(),function(){function n(n){this.command=d,this.headers=[]}}(),function(){function n(n){this.command=f,this.headers=[]}}(),function(){function n(n){this.command=e,this.headers=[]}}(),function(){function n(){this.command=i,this.headers=[]}}(),function(){function n(){this.command=m,this.headers=[]}}(),function(){function n(){this.command=r,this.headers=[]}}(),function(){function n(){this.command=E,this.headers=[]}}()}(STOMP||(STOMP={}));