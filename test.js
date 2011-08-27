(function() {
  var __slice = Array.prototype.slice;
  Proto.template("Person");
  Person.include({
    initialize: function(config) {
      if (config == null) {
        config = {};
      }
      return this.name = config.name, this.age = config.age, this.gender = config.gender, config;
    },
    walk: function(dest) {
      return console.log(this.name, "walks to", dest);
    }
  });
  this.jim = Person.create({
    name: "Jim Horrowitz",
    age: 27,
    gender: "M"
  });
  Proto.template("Super", Person);
  Super.include({
    initialize: function(config) {
      this.power.p = config.power;
      this.superName = config.superName;
      config.age = Infinity;
      return config;
    },
    power: function() {
      return console.log(this.superName, "excersizes his power of", this.power.p);
    }
  });
  this.superman = Super.create({
    name: "Clark Kent",
    superName: "Superman",
    gender: "M",
    power: "flight"
  });
  (Proto.template("GreekGod", Super)).include(function() {
    var cool1;
    this.home = "Mount Olympus";
    cool1 = this.bind(function() {
      return this.home;
    });
    return this.cool = function() {
      return cool1();
    };
  });
  this.zeuss = GreekGod.create({
    name: "Zeuss",
    superName: "Zeuss",
    gender: "M",
    power: "Thunderbolts"
  });
  Proto.template("SArray", []);
  SArray.include({
    initialize: function() {
      var items;
      items = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      this.push.apply(this, items);
      return items;
    },
    get: function(i) {
      if (i < 0) {
        i += this.length;
      }
      return this[i];
    },
    last: function() {
      return this.get(-1);
    }
  });
  this.arr = SArray.create(1, 2, 3, 4, 5);
}).call(this);
