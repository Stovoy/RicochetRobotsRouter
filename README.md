# A web-based solver for Ricochet Robots!

## Board format

Two dimensional JSON array of the grid, from top left to bottom right. (row x column).

Each grid position is represented by an array of properties.

Valid properties are:

  `"west"`- Has a west wall
    
  `"north"` - Has a north wall
    
  `"east"` - Has a east wall
    
  `"south"` - Has a south wall

  `"solid"` - Has all four walls

  `<target>` - A target object
  
The target object has two properties:

  `"<shape>"` - One of `"star"`, `"moon"`, `"saturn"`, `"gear"`, `"portal"`, `"\"`, `"/"`
  
  `"<color>"` - One of `"blue"`, `"red"`, `"green"`, `"yellow"`,  `"any"`


