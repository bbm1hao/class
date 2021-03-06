# node-class [![Build Status](https://secure.travis-ci.org/llafuente/class.png?branch=master)](http://travis-ci.org/llafuente/class) [![Coverage Status](https://coveralls.io/repos/llafuente/class/badge.png)](https://coveralls.io/r/llafuente/class)


## Introduction


Object Oriented for Javascript based on prototypes and new shiny features in ES5.

* Do not provide private/protected properties (do not want to use eval).
* Proxy resilient (mostly...)
* Proper Typeof and Instanceof.
* Many Object enhancements without messing propotypes
* Function enhancements but this time, in the prototypes for easy to use.
* 'Real time inheritance'™. Create a class, extends from Father. Add new methods/properties to Father, no problem, the Son will have it!


## Objective


Force coders to code in a clean way, don't allow messy code if possible... very clean class constructor.
This library throw a lot. So becarefull, it will throw only for fatal errors or common pitfalls (those I got everyday!).

The debug code is "tagged" like:

``` js
// <debug>
assert_arg(...)
// </debug>
```

There is no production library atm, it just a regex do it yourself :D (don't forget the pull request)

### Class (constructor)

```js
new Class(String name[, Object properties = null[, Object methods = null]])
```

* .Implements(Object {function_name:Function})
* .Extends(Class cls[, Boolean override_properties = true[, Boolean extend_static = true]])
* .Abstract(Object method_list {function_name: array_with_parameter or Function})
* .Final(Object {function_name:Function})
* .alias(String src_method_name, String dst_method_name)
* .properties (Object {property_name: value})
* .property (String name, Function get, Function set, Boolean enumerable)
* .hide(Array properties)
* .disable_autoset() // once
* .get_methods()
* .get_abstract_methods()
* .get_static_methods()
* .get_final_methods()
* .get_properties()
* .get_properties_descriptors()
* .seal()

Note: rename is removed because is evil

### Instances

* serialize([Boolean include_private])
* unserialize([Boolean include_private])

Examples below!!

## Sugar

Function type is modified by: [function-enhacements](http://travis-ci.org/llafuente/js-function-enhacements)
Array type is modified by: [array-enhacements](http://travis-ci.org/llafuente/js-array-enhacements)
Object type is modified by: [object-enhacements](http://travis-ci.org/llafuente/js-object-enhacements)

You should take a look to those collections.

### Events Class

```js
new Events()
```

* .on_unhandled_event(Function)
* .on(String event, Function fn, Boolean internal= false, Number times = 0)
* .once(String event, Function fn)
* .has_listener(String event) {
* .listeners(String event) {
* .emit(String event, Function args, Number delay_ms) support wildcards "*"
* .off(String event, Function fn)
* .remove_listeners(String event)
* .pipe_events(Class cls)
* Events.when(event, object_list, callback)

Notes
* Events throws if you dont call this.parent() in __construct
* emit("error", ...) will throw if no "error" event listener or "unhandled event" listener


### Animate & EventMachine Classes

See the webexamples :)


## Install

With [npm](http://npmjs.org) do:

```

npm install node-class

```

## test (travis-ci ready!)


```

npm test
// or
cd /test
node test.js

```

## license


MIT.


## Basic Example


``` js

var Class = require('node-class').Class;

var Dog = Class("Dog", { // new is not required here.
    // public property
    animal: true,
    // "private" property, repeat: "private"
    // it wont be setted in the constructor because is prepend with two underscores
    __bite_power: 10
});

// implements some functions
Dog.Implements({
    __construct: function(obj) { // I know PHP-ish
        //if (Typeof obj == "object") ->
            // it will automatically merge obj into this but only the defined public properties
    },
    bite: function(where) {
        return "Dog bites!";
    },
    speak: function() {
        return "bark";
    },
});

// Note: you can call implements as many times as you need
// and goes to the prototype so every instance is updated. BUT! properties() doesn't.
Dog.Implements({
    toString: function() {
        return "I'm a Dog";
    }
});

// Use new here, because sound more error resilient, it throws otherwise
var d = new Dog({animal: false, __bite_power: 500});

console.log(d.bite()); // console: Dog bites!
console.log(d.animal); // console: false
console.log(d.__bite_power); // console: 10
console.log("" + d); // console: I'm a Dog

```

## Example: Extends
====================

``` js
// using previous code... continue

var Kitty = Class("Kitty", {
    __bite_power: 5
});

// note: allways extends before implements

Kitty.Extends(Dog, false); // Do not override properties => __bite_power will be 5

Kitty.Implements({
    bite: function() {
        return "Kitty bites!";
    },
    speak: function() {
        // use of parent to call a function that "father" has
        return "I cant " + this.parent() + ", I meow";
    }
});

var k = new Kitty();

console.log(k.bite()); // console: Dog bites!
console.log(d.bite()); // console: Kitty bites!
console.log(k.speak()); // console: "I cant bark, I meow"

```

## Example: Abstract
=========================

``` js

var Animal = Class("Animal", {
    animal: true,
    __bite_power: null
});

Animal.Abstract({
    bite: function() {}
});

//you could try this... but...
try {
    new Animal(); // throws -> because its abstract!
} catch(e) {
    console.log(e); // check the error
}

var Whale = Class("Whale", {
    __bite_power: /*it's over*/ 9000 /*!!!!!!!*/
});

Whale.Extends(Animal, false); // again remember the 2nd arguments...

//you could try this... but...
try {
    new Whale(); // throws -> because bite is not implemented
} catch(e) {
    console.log(e); // check the error
}

Whale.Implements({
    bite: function() {
        return "kill me!";
    }
});

var w = new Whale(); // ok now :)

console.log(w.bite()); // console: kill me!

```


## Example: Alias
==================

``` js

Whale.alias("destroy", "bite");
console.log(w.destroy()); // console: kill me!

```

## Example: Final
=================

* Class.Final(Object {function_name:Function});

``` js

// imagine you have this before the extends
Animal.Final({
    die: function() {
        return "an animal died";
    }
});

// you should extend always when the class is finished
Whale.Extends(Animal, false);

try {
    Whale.Implements({
        die: function() {
            return "dont mind the text, it throws!";
        }
    });
} catch(e) {
    console.log(e);
}

```

## Example: Hide (no enumerable)
===============================

``` js

var Mole = Class("Mole", {
    __bite_power: -1
});

Mole.Implements({
    bite: function() {
        return "you can see a mole when bite you!";
    }
});

Mole.hide(["bite"]);

var m = new Mole();

// This way you can hide all methods an have a clean console.log without .serialize()
// I know you are lazy
console.log(m); // console: { __bite_power: -1 }

// also hided from the "Class"
console.log(Mole);


// @tip: hide all methods ?
// Mole.hide( Mole.get_methods() )

```

## Example: Serialization
=========================================

``` js

var Vector = Class("Vector", {
    x: 0,
    y: 0,
    __private: true
});

var v = new Vector({x: 10, y:10});
console.log(v.serialize()); // {x: 10, y:10}
console.log(v.serialize(true)); // {x: 10, y:10, __private: true}

// unserialize do the oposite, also has the first parameter to import "private" properties

```

## Instanceof & Typeof
======================

A proper implementation of Instanceof and Typeof is provided in good harmony with the Class system :)

``` js
// Instanceof on Class
var $ = require('node-class');

console.log($.Instanceof(Dog, "Dog"));  // console: "true"
console.log($.Instanceof(Kitty, "Kitty"));  // console: "true"
console.log($.Instanceof(Whale, "Whale"));  // console: "true"

// Instanceof on Class instances
console.log($.Instanceof(d, "Dog"));    // console: "true"
console.log($.Instanceof(d, "Class"));  // console: "true"
console.log($.Instanceof(k, "Kitty"));  // console: "true"
console.log($.Instanceof(k, "Class"));  // console: "true"
console.log($.Instanceof(w, "Whale"));  // console: "true"
console.log($.Instanceof(w, "Animal")); // console: "true"
console.log($.Instanceof(w, "Class"));  // console: "true"

// Typeof on Class instances
console.log($.Typeof(d))          // console: "Dog"
console.log($.Typeof(k))          // console: "Kitty"
console.log($.Typeof(w))          // console: "Whale"

// Typeof on js types
console.log($.Typeof("string"))    // console: "string"

console.log($.Typeof([]))          // console: "array"
console.log($.Typeof(new Array(1)) // console: "array"

console.log($.Typeof(1))           // console: "number"
console.log($.Typeof(1.0))         // console: "number"
console.log($.Typeof(Infinity))    // console: "number"

console.log($.Typeof(NaN))         // console: "null"
console.log($.Typeof(null))        // console: "null"
console.log($.Typeof(undefined))   // console: "null", maybe change...

console.log($.Typeof(true))        // console: "boolean"
console.log($.Typeof(false))       // console: "boolean"

console.log($.Typeof({}))          // console: "object"

console.log($.Typeof(/^a$/))       // console: "regexp"

console.log($.Typeof(new Date()))  // console: "date"

(function() {
    console.log($.Typeof(arguments)) // console: "arguments"
}());

```