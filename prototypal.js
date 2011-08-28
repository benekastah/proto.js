(function() {
  var DONE, Proto, bind, create, createClass, g, initializeAll, isFn, noInit;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (this[i] === item) return i;
    }
    return -1;
  };
  try {
    g = global;
    if (!(g != null)) {
      throw "";
    }
  } catch (e) {
    g = window;
  }
  isFn = function(fn) {
    return typeof fn === "function";
  };
  createClass = function(p) {
    var O;
    O = function() {};
    O.prototype = p;
    return new O;
  };
  create = (function() {
    if (Object.create) {
      return function(p) {
        return Object.create(p);
      };
    } else {
      return createClass;
    }
  })();
  DONE = {
    finished_initializing: true
  };
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
  noInit = {
    noInit: true
  };
  Proto = {
    dontProvide: ["template"],
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
        if (p.hasOwnProperty(item)) {
          delete p[item];
        }
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
  try {
    module.exports = Proto;
  } catch (e) {
    this.Proto = Proto;
  }
}).call(this);
