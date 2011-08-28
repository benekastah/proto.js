try
  g = global
  throw "" if not g?
catch e
  g = window

isFn = (fn) -> typeof fn is "function"

createClass = (p) ->
  O = ->
  O:: = p
  new O
  
create = do ->
  if Object.create
    (p) -> Object.create p
  else
    createClass
      
DONE = finished_initializing: true
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
      
bind = do ->
  if Function::bind
    (fn, scope) -> fn.bind(scope)
  else
    (fn, scope, args...) ->
      throw new TypeError "Cannot call a non-function in `bind`" if not isFn fn
      Noop = ->
      bound = (bArgs...) ->
        fn.apply (if this instanceof Noop then this else scope or window), args.concat bArgs
      Noop:: = this::
      bound:: = new Noop
      bound

noInit = noInit: true
Proto =
  dontProvide: ["template"]
  bind: (fn) -> bind fn, this
  initialize: ->
  
  create: (init) ->
    p = create this
    p.base = this
    p.self = p
    (delete p[item] if p.hasOwnProperty item) for item in @dontProvide or []
    if init isnt noInit and isFn p.initialize
      initializeAll p, arguments...
    p
    
  template: (base=Proto) ->
    if not Proto.uses.call base, Proto
      base = Proto.create.call base
      Proto.include.call base, Proto, false
    base.create noInit
    
  include: (item, configs...) ->
    if isFn item
      item.apply this, configs
    else
      safe = arguments[1]
      safe = if not safe? then true else safe
      dontProvide = item.dontProvide or []
      for own name, value of item
        unless name in dontProvide
          this[name] = value if !safe or not this.hasOwnProperty name
    this
    
  uses: (obj) ->
    if this is obj || this.self is obj || @base is obj || @base?.self is obj
      ret = true
    else if @base and isFn @base.uses
      ret = @base.uses obj
    else
      ret = false
    
    ret

# Do some initializing for Proto
Proto.self = Proto

try
  module.exports = Proto
catch e
  @Proto = Proto