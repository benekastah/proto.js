#[proto.js](http://benekastah.github.com/proto.js/)

A fully prototypal inheritance system. This means no more calling pseudo-class functions with `new` (at least
if you don't want to). It's wonderfully simple and oh-so-javascripty!

_When you want to start playing with it, all you need is `src/proto.js`._

##Have a gander!

Make some template objects

```javascript
var Animal = Proto.template().include({
  initialize: function (config) {
    this.type = config.type
    this.name = config.name
  },
  eat: function (food) {
    return this.name + " eats " + food + ".";
  }
});

var Mammal = Proto.template(Animal).include({
  hasHair: true
  , producesMilk: true
});

var Whale = Proto.template(Mammal).include(function () {
  this.livesDeepInTheSea = true;
  this.type = "whale";
  this.dive = function () {
    return "The " + this.type + " dives deep into the ocean.";
  };
})
```

Make objects based off the templates

```javascript
  var timmy = Mammal.create({
    type: "wolverine",
    name: "timmy"
  });
  
  var james = Whale.create({
    name: "james"
  });
  
  james.dive();             // => "The whale dives deep into the ocean."
  james.eat("kelp");        // => "james eats kelp."
  timmy.eat("human flesh"); // => "timmy eats human flesh."
  
  // Test to see how the object is composed
  james.uses(Whale);        // => true
  james.uses(Mammal);       // => true
  james.uses(Animal);       // => true
  james.uses(Proto);        // => true
```

Objects created through `template` and `create` aren't really that much different. The main thing is that 
`template` objects will not be automatically initialized. This means that any object can be used as a template
and any template can be used like a normal object.

```javascript
  Whale.dive();             // => "The whale dives deep into the ocean."
  var jimmothy = james.create().include({
    name: "jimmothy"
    , talk: function () {
      return "I am " + this.name + ", the son of " + this.base.name + ".";
    }
  });
  jimmothy.talk();          // => "I am jimmothy, the son of james."
```

See the [docs](http://benekastah.github.com/proto.js/) for more details on the API. There are some more example
there, as well.

##How to hack on proto.js

  1. Tests can be run with [jasmine-node](https://github.com/mhevery/jasmine-node)
  
     ```
     $ jasmine-node test
     ```
  
  2. Generate documentation with [docco](http://jashkenas.github.com/docco/)
  
     ```
     $ docco ./**/*.coffee
     ```

As time goes on, I'll do some build automation for automatic tests and documentation generation when committing.
For now, this should be ok. It's not a huge project.