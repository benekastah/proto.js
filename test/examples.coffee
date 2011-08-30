try
  Proto = require "../src/proto"
catch e
  Proto = window.Proto

root = this

# ##Create Object Templates

# This object is a small enhancement of the native array object.
# This will have `Proto` as a mix in rather than have it referenced directly, meaning that 
# any changes to `Proto` after this template is created will not affect this template.
# With this, we can see why it would be a bad practice to add items directly to `Proto`.
@SArray = Proto.template( [] ).include
  initialize: (items...) ->
    @push.apply this, items
    items
  get: (i) -> @[if i < 0 then i + @length else i]
  last: -> @get -1
# Here is a more in-depth extension of SArray. Use it to make ranges in javascript!
@SRange = Proto.template( @SArray ).include
  initialize: (@start, @limit, increment) ->
    argsLen = arguments.length
    if argsLen == 2 and typeof @limit != "number"
      [@start, @limit, increment] = [@start, null, @limit]
    else if argsLen == 1 and typeof @start == "function"
      [increment, @limit, @start] = [@start, null, null]
    
    @start or= 0
    @limit or= Infinity
    increment or= @increment
    if increment != @increment
      @increment = increment
    @push @start
    @DONE
    
  next: (n=1) ->
    for [0...n]
      ret = @increment @last()
      if ret > @limit
        throw { name: "OutOfRangeError", message: "You have reached this range's limit." }
      @push ret
    ret
    
  safeNext: ->
    try
      ret = @next arguments...
    ret
    
  snext: -> @snext = @safeNext; @snext arguments...
    
  get: (i) ->
    i = if i < 0 then i + @length else i
    last = @length - 1
    if i > last
      try
        @next i - last
    @[i]
    
  increment: (x) -> x+1 
# Here is one that descends directly from `Proto`, so it will reflect any changes made to `Proto`
@defer = Proto.create().include ->
  getArgs = (args) =>
    args = root.SArray.create.apply root.SArray, args
    callback = args.last()
    ms = args[0] if args.length > 1
    return [callback, ms || @defaultDelay]
  
  @defaultDelay = 50
  
  @once = ->
    id = setTimeout (getArgs arguments)...
    -> clearTimeout id

  @continuously = ->
    id = setInterval (getArgs arguments)...
    -> clearInterval id

# An example of what you could do if you want to extend `Proto` for all the objects you make.
# This is definitely preferred to hacking on the object yourself. Adding things directly to
# `Proto` could have some unexpected
# and buggy side-effects if you are using `include` to mixin objects (or extending native
# types, which does the same thing under the hood).
@Base = Proto.template().include ->
  # Doing all this stuff in a function allows us to mandate the order of what goes on.
  # It also allows us to add template to our object, whereas otherwise it wouldn't let us
  # (because `Proto`'s `dontProvide` array has the item `"template"` in it).
  
  # Add template here so that we can use it from Base as well as Proto (if we want).
  @template = (base=@Base) -> Proto.template base
  @someMethod = ->
    console.log "I'm a method!"

# Now use it to make other objects.
someObj = @Base.template().include
  someItem: true

# ##Create Object Instances

@arr = @SArray.create 1, 2, 3, 4, 5
@range = @SRange.create null, 10
@fib =  @SRange.create (x) -> x + @get(-2) or 1
