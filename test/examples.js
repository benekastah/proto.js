(function() {
  var Proto, root, someObj;
  var __slice = Array.prototype.slice, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  try {
    Proto = require("../src/proto");
  } catch (e) {
    Proto = window.Proto;
  }
  root = this;
  this.SArray = Proto.template([]).include({
    initialize: function() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.push.apply(this, items);
      return items;
    },
    get: function(i) {
      return this[i < 0 ? i + this.length : i];
    },
    last: function() {
      return this.get(-1);
    }
  });
  this.SRange = Proto.template(this.SArray).include({
    initialize: function(start, limit, increment) {
      var argsLen, _ref, _ref2;
      this.start = start;
      this.limit = limit;
      argsLen = arguments.length;
      if (argsLen === 2 && typeof this.limit !== "number") {
        _ref = [this.start, null, this.limit], this.start = _ref[0], this.limit = _ref[1], increment = _ref[2];
      } else if (argsLen === 1 && typeof this.start === "function") {
        _ref2 = [this.start, null, null], increment = _ref2[0], this.limit = _ref2[1], this.start = _ref2[2];
      }
      this.start || (this.start = 0);
      this.limit || (this.limit = Infinity);
      increment || (increment = this.increment);
      if (increment !== this.increment) {
        this.increment = increment;
      }
      this.push(this.start);
      return this.DONE;
    },
    next: function(n) {
      var ret, _i;
      if (n == null) {
        n = 1;
      }
      for (_i = 0; 0 <= n ? _i < n : _i > n; 0 <= n ? _i++ : _i--) {
        ret = this.increment(this.last());
        if (ret > this.limit) {
          throw {
            name: "OutOfRangeError",
            message: "You have reached this range's limit."
          };
        }
        this.push(ret);
      }
      return ret;
    },
    safeNext: function() {
      var ret;
      try {
        ret = this.next.apply(this, arguments);
      } catch (_e) {}
      return ret;
    },
    snext: function() {
      this.snext = this.safeNext;
      return this.snext.apply(this, arguments);
    },
    get: function(i) {
      var last;
      i = i < 0 ? i + this.length : i;
      last = this.length - 1;
      if (i > last) {
        try {
          this.next(i - last);
        } catch (_e) {}
      }
      return this[i];
    },
    increment: function(x) {
      return x + 1;
    }
  });
  this.defer = Proto.create().include(function() {
    var getArgs;
    getArgs = __bind(function(args) {
      var callback, ms;
      args = root.SArray.create.apply(root.SArray, args);
      callback = args.last();
      if (args.length > 1) {
        ms = args[0];
      }
      return [callback, ms || this.defaultDelay];
    }, this);
    this.defaultDelay = 50;
    this.once = function() {
      var id;
      id = setTimeout.apply(null, getArgs(arguments));
      return function() {
        return clearTimeout(id);
      };
    };
    return this.continuously = function() {
      var id;
      id = setInterval.apply(null, getArgs(arguments));
      return function() {
        return clearInterval(id);
      };
    };
  });
  this.Base = Proto.template().include(function() {
    this.template = function(base) {
      if (base == null) {
        base = this.Base;
      }
      return Proto.template(base);
    };
    return this.someMethod = function() {
      return console.log("I'm a method!");
    };
  });
  someObj = this.Base.template().include({
    someItem: true
  });
  this.arr = this.SArray.create(1, 2, 3, 4, 5);
  this.range = this.SRange.create(null, 10);
  this.fib = this.SRange.create(function(x) {
    return x + this.get(-2) || 1;
  });
}).call(this);
