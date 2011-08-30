(function() {
  var Proto, ex;
  var __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  Proto = require("../src/proto");
  ex = require("./examples");
  describe("Proto", function() {
    it("can create a new object from any other object", function() {
      var p;
      p = Proto.create();
      return expect(p.create).toEqual(Proto.create);
    });
    it("can create objects that initialize when created", function() {
      var arr;
      arr = ex.SArray.create(1, 2, 3, 4, 5);
      return expect(arr.last()).toEqual(5);
    });
    it("can create object templates that don't initialize automatically", function() {
      var T, t;
      T = Proto.template().include({
        initialize: function() {
          return this.AWESOME = "AWESOME!";
        }
      });
      expect(T.AWESOME).toEqual(void 0);
      t = T.create();
      return expect(t.AWESOME).toEqual("AWESOME!");
    });
    it("can mixin items to objects through the use of `include`", function() {
      var A;
      A = Proto.template();
      A.include({
        a: 'a'
      });
      A.include(function() {
        return this.b = 'b';
      });
      expect(A.a).toEqual('a');
      return expect(A.b).toEqual('b');
    });
    it("can define properties not to propogate to its children", function() {
      var A, a;
      A = Proto.template().include(function() {
        this.dontProvide.push("thing");
        return this.thing = "thing!";
      });
      expect(A.thing).toEqual("thing!");
      a = A.create();
      return expect(a.thing).toEqual(void 0);
    });
    it("can iterate through its own properties and define non-iterable properties", function() {
      var A, t;
      A = Proto.template().include({
        a: 'a',
        b: 'b',
        c: 'c'
      });
      A.dontIterate.push("a");
      t = {};
      A.each(function(name) {
        return t[name] = true;
      });
      expect(t.b).toEqual(true);
      return expect(t.a).toEqual(void 0);
    });
    it("can list its methods", function() {
      var m;
      m = Proto.create().include({
        a: function() {
          return 'a';
        }
      }).methods();
      expect(__indexOf.call(m, "bind") >= 0 ? true : void 0).toEqual(true);
      expect(__indexOf.call(m, 'a') >= 0 ? true : void 0).toEqual(true);
      return expect(__indexOf.call(m, 'bogus') >= 0 ? true : void 0).toEqual(void 0);
    });
    return it("can determine what objects it uses, even if they were mixed in", function() {
      expect(ex.SRange.uses(Proto)).toEqual(true);
      expect(ex.SRange.uses(ex.SArray)).toEqual(true);
      return expect(ex.SRange.uses(global)).toEqual(false);
    });
  });
}).call(this);
