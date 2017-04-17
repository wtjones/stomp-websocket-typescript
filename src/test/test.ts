/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../clientApp/ts/stomp.ts" />

describe('STOMP Client', function() {
  describe('#ctor()', function() {
    it('should create the object', function() {
      let sut = new STOMP.Client();

      if (typeof sut === undefined) {
        throw new Error("client is null");
      }
    });
  });
});