
Proto = require "../prototypal"
ex = require "../examples"

describe "Proto", ->
  it "can create a new object from any other object", ->
    p = Proto.create()
    expect(p.create).toEqual(Proto.create)