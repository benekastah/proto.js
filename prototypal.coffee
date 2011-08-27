global = this

isFn = (fn) -> typeof fn is "function"

create = do ->
  if Object.create
    (p) -> Object.create p
  else
    (p) ->
      O = ->
      O:: = p
      new O
      
initializeAll = (p, args...) ->
  t = if this == global then p else this
  if p.hasOwnProperty "initialize"
    args = p.initialize.apply(t, args) || args
  if p.parent
    try
      args.unshift p.parent
    catch e
      args = [p.parent, args]
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
@Proto = Proto =
  bind: (fn) -> bind fn, this
  initialize: ->
  
  create: (init) ->
    p = create this
    p.parent = this
    if init isnt noInit && isFn p.initialize
      initializeAll p, arguments...
    p
    
  template: (scope, name, parent) ->
    # Sort out arguments
    if arguments.length < 3
      [scope, name, parent] = [null, scope, name]
    
    if this isnt Proto
      throw { 
        name: "IncorrectScopeError"
        message: "Scope for Proto.template must be set to Proto"
      }
    if not name
      throw {
        name: "NoNameError"
        message: "Proto.template must be called with a name in the first or second argument."
      }
    
    scope or= global
    parent or= this
    if not Proto.uses.call parent, Proto
      Proto.include.call parent, Proto
    
    scope[name] = p = parent.create noInit
    
  include: (item, configs...) ->
    if isFn item
      item.apply this, configs
    else
      (this[name] = value if not this.hasOwnProperty name) for own name, value of item
    
  uses: (obj) ->
    if @parent is obj
      true
    else if @parent
      @parent.uses obj
    else
      false
