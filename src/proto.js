(function() {
  var BREAK, DONE, Proto, bind, create, g, hasProp, initializeAll, isFn, noInit;
  var __slice = Array.prototype.slice, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  }, __hasProp = Object.prototype.hasOwnProperty;
  g = typeof global !== "undefined" && global !== null ? global : window;
  noInit = {
    noInit: true
  };
  BREAK = {
    break_loop: true
  };
  DONE = {
    finished_initializing: true
  };
  isFn = function(fn) {
    return typeof fn === "function";
  };
  hasProp = Object.prototype.hasOwnProperty;
  create = (function() {
    if (Object.create) {
      return function(p) {
        return Object.create(p);
      };
    } else {
      return function(p) {
        var O;
        O = function() {};
        O.prototype = p;
        return new O;
      };
    }
  })();
  initializeAll = function() {
    var args, p, t, tmp, _ref;
    p = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    t = this === g ? p : this;
    if (p.hasOwnProperty("initialize")) {
      _ref = [t.DONE, DONE], tmp = _ref[0], t.DONE = _ref[1];
      args = p.initialize.apply(t, args) || args;
      if (tmp != null) {
        t.DONE = tmp;
      } else {
        delete t.DONE;
      }
      if (args === DONE) {
        return;
      }
    }
    if (p.base) {
      try {
        args.unshift(p.base);
      } catch (e) {
        args = [p.base, args];
      }
      return initializeAll.apply(t, args);
    }
  };
  bind = (function() {
    if (Function.prototype.bind) {
      return function(fn, scope) {
        return fn.bind(scope);
      };
    } else {
      return function() {
        var Noop, args, bound, fn, scope;
        fn = arguments[0], scope = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
        if (!isFn(fn)) {
          throw new TypeError("Cannot call a non-function in `bind`");
        }
        Noop = function() {};
        bound = function() {
          var bArgs;
          bArgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          return fn.apply((this instanceof Noop ? this : scope || window), args.concat(bArgs));
        };
        Noop.prototype = this.prototype;
        bound.prototype = new Noop;
        return bound;
      };
    }
  })();
  Proto = {
    dontProvide: ["template"],
    dontIterate: ["base", "self", "BREAK"],
    bind: function(fn) {
      return bind(fn, this);
    },
    initialize: function() {},
    create: function(init) {
      var item, p, _i, _len, _ref;
      p = create(this);
      p.base = this;
      p.self = p;
      _ref = this.dontProvide || [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (hasProp.call(p, item)) {
          continue;
        }
        if (__indexOf.call(p.dontIterate, item) < 0) {
          p.dontIterate.push(item);
        }
        p[item] = void 0;
      }
      if (init !== noInit && isFn(p.initialize)) {
        initializeAll.apply(null, [p].concat(__slice.call(arguments)));
      }
      return p;
    },
    template: function(base) {
      if (base == null) {
        base = Proto;
      }
      if (!Proto.uses.call(base, Proto)) {
        base = Proto.create.call(base);
        Proto.include.call(base, Proto, false);
      }
      return base.create(noInit);
    },
    include: function() {
      var configs, dontProvide, item, name, safe, value;
      item = arguments[0], configs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (isFn(item)) {
        item.apply(this, configs);
      } else {
        safe = arguments[1];
        safe = !(safe != null) ? true : safe;
        dontProvide = item.dontProvide || [];
        for (name in item) {
          if (!__hasProp.call(item, name)) continue;
          value = item[name];
          if (__indexOf.call(dontProvide, name) < 0) {
            if (!safe || !this.hasOwnProperty(name)) {
              this[name] = value;
            }
          }
        }
      }
      return this;
    },
    each: function() {
      var callback, iterateAll, prop, result, ret, tmp, value, _ref;
      callback = arguments[arguments.length - 1];
      if (arguments.length > 1) {
        iterateAll = arguments[0];
      }
      _ref = [this.BREAK, BREAK], tmp = _ref[0], this.BREAK = _ref[1];
      ret = (function() {
        var _results;
        _results = [];
        for (prop in this) {
          value = this[prop];
          if (!iterateAll && !hasProp.call(this, prop)) {
            continue;
          }
          if (__indexOf.call(this.dontIterate || [], prop) < 0) {
            result = callback.call(this, prop, value);
            if (result === BREAK) {
              break;
            }
            result;
          }
        }
        return _results;
      }).call(this);
      if (tmp === void 0) {
        delete this.BREAK;
      } else {
        this.BREAK = tmp;
      }
      return ret;
    },
    methods: function(getAll) {
      var name, value, _results;
      if (getAll == null) {
        getAll = true;
      }
      _results = [];
      for (name in this) {
        value = this[name];
        if (!getAll && !hasProp.call(this, name)) {
          continue;
        }
        if (!isFn(value)) {
          continue;
        }
        _results.push(name);
      }
      return _results;
    },
    uses: function(obj) {
      var ret, _ref;
      if (this === obj || this.self === obj || this.base === obj || ((_ref = this.base) != null ? _ref.self : void 0) === obj) {
        ret = true;
      } else if (this.base && isFn(this.base.uses)) {
        ret = this.base.uses(obj);
      } else {
        ret = false;
      }
      return ret;
    }
  };
  Proto.self = Proto;
  if ((typeof process !== "undefined" && process !== null ? process.title : void 0) === "node") {
    module.exports = Proto;
  } else {
    this.Proto = Proto;
  }
}).call(this);
