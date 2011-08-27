Proto.template "Person" 
Person.include
  initialize: (config={}) ->
    {@name, @age, @gender} = config
  
  walk: (dest) ->
    console.log @name, "walks to", dest

@jim = Person.create
  name: "Jim Horrowitz"
  age: 27
  gender: "M"


Proto.template "Super", Person
Super.include
  initialize: (config) -> 
    @power.p = config.power
    @superName = config.superName
    config.age = Infinity
    config
  power: ->
    console.log @superName, "excersizes his power of", @power.p

@superman = Super.create
  name: "Clark Kent"
  superName: "Superman"
  gender: "M"
  power: "flight"
  
(Proto.template "GreekGod", Super).include ->
  @home = "Mount Olympus"
  cool1 = @bind ->
    @home
  @cool = -> cool1()

@zeuss = GreekGod.create
  name: "Zeuss"
  superName: "Zeuss"
  gender: "M"
  power: "Thunderbolts"

Proto.template "SArray", []
SArray.include
  initialize: (items...) -> @push.apply this, items; items
  get: (i) -> 
    if i < 0
      i += @length
    @[i]
  last: -> @get -1

@arr = SArray.create 1, 2, 3, 4, 5
    