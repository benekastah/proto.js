(function() {
  var Proto, ex;
  Proto = require("../prototypal");
  ex = require("../examples");
  describe("Proto", function() {
    return it("can create a new object from any other object", function() {
      var p;
      p = Proto.create();
      return expect(p.create).toEqual(Proto.create);
    });
  });
}).call(this);
