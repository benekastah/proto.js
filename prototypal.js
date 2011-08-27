(function() {
  var Proto, bind, create, global, initializeAll, isFn, noInit;
  var __slice = Array.prototype.slice, __hasProp = Object.prototype.hasOwnProperty;
  global = this;
  isFn = function(fn) {
    return typeof fn === "function";
  };
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
    var args, p, t;
    p = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    t = this === global ? p : this;
    if (p.hasOwnProperty("initialize")) {
      args = p.initialize.apply(t, args) || args;
    }
    if (p.parent) {
      try {
        args.unshift(p.parent);
      } catch (e) {
        args = [p.parent, args];
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
  this.Proto = Proto = {
    bind: function(fn) {
      return bind(fn, this);
    },
    initialize: function() {},
    create: function(init) {
      var p;
      p = create(this);
      p.parent = this;
      if (init !== noInit && isFn(p.initialize)) {
        initializeAll.apply(null, [p].concat(__slice.call(arguments)));
      }
      return p;
    },
    template: function(scope, name, parent) {
      var p, _ref;
      if (arguments.length < 3) {
        _ref = [null, scope, name], scope = _ref[0], name = _ref[1], parent = _ref[2];
      }
      if (this !== Proto) {
        throw {
          name: "IncorrectScopeError",
          message: "Scope for Proto.template must be set to Proto"
        };
      }
      if (!name) {
        throw {
          name: "NoNameError",
          message: "Proto.template must be called with a name in the first or second argument."
        };
      }
      scope || (scope = global);
      parent || (parent = this);
      if (!Proto.uses.call(parent, Proto)) {
        Proto.include.call(parent, Proto);
      }
      return scope[name] = p = parent.create(noInit);
    },
    include: function() {
      var configs, item, name, value, _results;
      item = arguments[0], configs = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (isFn(item)) {
        return item.apply(this, configs);
      } else {
        _results = [];
        for (name in item) {
          if (!__hasProp.call(item, name)) continue;
          value = item[name];
          _results.push((!this.hasOwnProperty(name) ? this[name] = value : void 0));
        }
        return _results;
      }
    },
    uses: function(obj) {
      if (this.parent === obj) {
        return true;
      } else if (this.parent) {
        return this.parent.uses(obj);
      } else {
        return false;
      }
    }
  };
}).call(this);
