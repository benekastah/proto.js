
Proto = require "../src/proto"
ex = require "./examples"

describe "Proto", ->
  it "can create a new object from any other object", ->
    p = Proto.create()
    expect(p.create).toEqual(Proto.create)
    
  it "can create objects that initialize when created", ->
    arr = ex.SArray.create(1, 2, 3, 4, 5)
    expect(arr.last()).toEqual 5
    
  it "can create object templates that don't initialize automatically", ->
    T = Proto.template().include
      initialize: ->
        @AWESOME = "AWESOME!"
    expect(T.AWESOME).toEqual undefined
    t = T.create()
    expect(t.AWESOME).toEqual "AWESOME!"
    
  it "can mixin items to objects through the use of `include`", ->
    A = Proto.template()
    A.include
      a: 'a'
    A.include ->
      @b = 'b'
    expect(A.a).toEqual 'a'
    expect(A.b).toEqual 'b'
    
  it "can define properties not to propogate to its children", ->
    A = Proto.template().include ->
      @dontProvide.push "thing"
      @thing = "thing!"
    expect(A.thing).toEqual "thing!"
    a = A.create()
    expect(a.thing).toEqual undefined
    
  it "can iterate through its own properties and define non-iterable properties", ->
    A = Proto.template().include
      a: 'a'
      b: 'b'
      c: 'c'
    A.dontIterate.push "a"
    t = {}
    A.each (name) ->
      t[name] = true
    expect(t.b).toEqual true
    expect(t.a).toEqual undefined
    
  it "can list its methods", ->
    m = Proto.create().include(a: -> 'a').methods()
    expect(if "bind" in m then true).toEqual true
    expect(if 'a' in m then true).toEqual true
    expect(if 'bogus' in m then true).toEqual undefined
    
  it "can determine what objects it uses, even if they were mixed in", ->
    expect(ex.SRange.uses Proto).toEqual true
    expect(ex.SRange.uses ex.SArray).toEqual true
    expect(ex.SRange.uses global).toEqual false