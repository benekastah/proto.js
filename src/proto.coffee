# _[Fork me on Github!](https://github.com/benekastah/proto.js)_

# **`proto.coffee`** provides a small and simple, yet complete and powerful, toolkit for prototypal
# inheritance in javascript. It was intended to minimize the number of steps it takes to build a successful
# and organized object structure for your application. It is every bit as powerful as the typical class-based
# structure, and a bit simpler and easier to wrap the head around as well (at least in the context of javascript).
# So enjoy a break from the confusion that is javascript inheritance and embrace the true nature of its design!


g = if global? then global else window

# Used internally to ensure objects created through `Proto.template` won't be initialized right away.
noInit = noInit: true
# Used to break a loop in `Proto.each`.
BREAK = break_loop: true
# Used to stop initializing a new object.
DONE = finished_initializing: true

isFn = (fn) -> typeof fn is "function"
hasProp = Object::hasOwnProperty

# `create` allows us to use the prototypal inheritance style, even when Object.create is not supported.
# This function itself is private, but the `Proto` object proxies the work of object creation to it.
create = do ->
  if Object.create
    (p) -> Object.create p
  else
    (p) ->
      O = ->
      O:: = p
      new O

# You can provide an `initialize` function that will be run automatically when an object is `create()`ed.
# This function will eventually be handled here. By default, all the `initialize` functions of all the `base`
# objects will be called with whatever is `return`ed from your base function. If you want to stop initializing
# the base objects at a certain point, then `return this.DONE`. `this.DONE` acts as a "magic cookie" so we know
# for sure when it's time to quit.
initializeAll = (p, args...) ->
  t = if this == g then p else this
  if p.hasOwnProperty "initialize"
    [tmp, t.DONE] = [t.DONE, DONE]
    args = p.initialize.apply(t, args) || args
    if tmp? then t.DONE = tmp else delete t.DONE
    return if args == DONE
  if p.base
    try
      args.unshift p.base
    catch e
      args = [p.base, args]
    initializeAll.apply t, args

# `bind` is private, but the `Proto` object proxies here. General purpose function binding can be achieved by
# calling `Proto.bind.call(thisObj, fn)`.
bind = do ->
  if Function::bind
    (fn, scope) -> fn.bind(scope)
  else
    # CoffeeScript version of the shim function found [here](https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind).
    (fn, scope, args...) ->
      if not isFn fn
        throw new TypeError "Cannot call a non-function in `bind`"
      Noop = ->
      bound = (bArgs...) ->
        fn.apply (if this instanceof Noop then this 
        else scope or window), args.concat bArgs
      Noop:: = this::
      bound:: = new Noop
      bound

# ##Proto
# Here is our main object, and the one that will be exported (either through `module.exports`
# or the global object, depending upon the environment).
Proto =
  # ###API
  
  # **`dontProvide`**: Any property names listed here will not be available for child objects
  # to use. These properties will still be
  # accessible from every object they existed on before they were added to the `dontProvide` array.
  dontProvide: ["template"]
  # **`dontIterate`**: Any property names listed here will not be iterated through the `Proto.each` function.
  dontIterate: ["base", "self", "BREAK"]
  # **`bind`**: This is a convenience method for painlessly executing private functions within the context
  # of this object. For example, if `this` refers to a context that descends from `Proto`:
  #
  #     var privateFn = this.bind(function () {
  #       return this.number * 5
  #     });
  #
  bind: (fn) -> bind fn, this
  # **`initialize`**: Our base initialize function does nothing, but because it exists, all objects that inherit from `Proto`
  # have the built-in capability to initialize themselves. Simply add an initialize function to customize your object
  # at the time of creation. For more information on how initialization
  # works, see the notes above at `initializeAll`
  initialize: -> # this function intentionally left blank
  # **`create`**: Makes a new, empty object using `this` as the prototype. Also will initiate the initialization
  # process, and make sure that items in the @dontProvide array aren't directly accessible through the child
  # object that is created.
  create: (init) ->
    p = create this
    # The `base` object is added to every new object created, and will point to the direct parent object.
    p.base = this
    p.self = p
    for item in (@dontProvide or [])
      if hasProp.call p, item then continue
      p.dontIterate.push item if item not in p.dontIterate
      p[item] = undefined
    if init isnt noInit and isFn p.initialize
      initializeAll p, arguments...
    p
  # **`Proto.template`**: This function will not be available to child objects, and so must be called from
  # `Proto`. It does much the same thing as create, with two differences:
  #
  #   1. Objects created this way will not be initialized (until an object is created from them with `create`)
  #   2. You can specify the prototype as the first argument (default is `Proto`)
  #
  # As the name indicates, it is useful for creating objects that will be used primarily to create other objects.
  template: (base=Proto) ->
    if not Proto.uses.call base, Proto
      base = Proto.create.call base
      Proto.include.call base, Proto, false
    base.create noInit
  # **`include`**: This function allows us to easily add items to our objects, either at the time of creation
  # or any time during the objects existence. The required argument is the first (`item`). It can be an object
  # or a function. If it is an object, all the direct properties of the it will be mixed in to `this`. If it is
  # a function, then the function will be called in the context of `this`, and therefore any properties added or
  # modified on `this` in the body of that function will be affected appropriately. Therefore:
  #
  #     var Apple = Proto.template().include(function (config) {
  #       this.hasSeeds = config.hasSeeds;
  #       this.isAFruit = true;
  #     }, {hasSeeds: true});
  #
  # will add the properties "hasSeeds" and "isAFruit" to Apple, and both will equal `true`.
  #
  # **Note**: if the 
  # `item` in the first argument is a function, then anything you pass in after that will be given to your function
  # as arguments, allowing for more advanced configurations.
  #
  # if the `item` is an object, then you can optionally pass in a second parameter (boolean) telling whether
  # or not this should operate in _safe mode_. _Safe mode_ means that only properties that don't yet exist directly
  # on the object will be populated. Defaults to `false`.
  include: (item, configs...) ->
    if isFn item
      item.apply this, configs
    else
      safe = arguments[1]
      safe = if not safe? then false else safe
      dontProvide = item.dontProvide or []
      for own name, value of item
        unless name in dontProvide
          this[name] = value if !safe or not this.hasOwnProperty name
    this
  # **`each`**: Provides a generic iterator for objects. This function will not iterate over items
  # in the `dontIterate` array. Pass in a function as a single argument, or as the second argument to
  # a boolean. The boolean first argument (if it exists) describes whether or not to iterate over the properties of
  # this object's prototype's (`false` by default).
  each: () ->
    callback = arguments[arguments.length-1]
    if arguments.length > 1
      iterateAll = arguments[0]
    
    [tmp, @BREAK] = [@BREAK, BREAK]
    ret = (for prop, value of this
      if not iterateAll and not hasProp.call this, prop then continue
      unless prop in (@dontIterate or [])
        result = callback.call this, prop, value
        break if result == BREAK
        result)
    if tmp == undefined
      delete @BREAK
    else
      @BREAK = tmp
    ret
  # **`methods`**: Returns an array of all methods available from this object. Will find all methods,
  # including the ones belonging to prototype objects, unless the first argument to this function is falsey,
  # in which case it will only get direct methods of the object.
  methods: (getAll=true) ->
    for name, value of this
      if not getAll and not hasProp.call this, name then continue
      if not isFn value then continue
      name
  # **`uses`**: Allows us to determine, in much the same way as `instanceof`, if the current object descends from
  # the given object in the first argument. Uses clever methods to be able to detect (for the most part) the use 
  # of an object even if it was mixed in instead of referenced directly.
  uses: (obj) ->
    if this is obj || this.self is obj || @base is obj || @base?.self is obj
      ret = true
    else if @base and isFn @base.uses
      ret = @base.uses obj
    else
      ret = false
    ret

# This is a property that Proto needs to have for it to be detected successfully as a mixed in object.
Proto.self = Proto

# Export the thing.
if process?.title == "node" then module.exports = Proto
else @Proto = Proto