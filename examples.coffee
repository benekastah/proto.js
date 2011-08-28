try
  Proto = require "./prototypal"
catch e
  Proto = window.Proto

# CREATE OBJECT TEMPLATES

@SArray = Proto.template( [] ).include
  initialize: (items...) ->
    @push.apply this, items
    items
  get: (i) -> @[if i < 0 then i + @length else i]
  last: -> @get -1

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



# CREATE OBJECT INSTANCES

@arr = @SArray.create 1, 2, 3, 4, 5
@range = @SRange.create null, 10
@fib =  @SRange.create (x) -> x + @get(-2) or 1
