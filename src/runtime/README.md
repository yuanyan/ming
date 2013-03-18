## Create object

```javascript
var Person = Object.extend({
    initialize: function(name) {
        this.name = name;
    },
    name: '',
    age: 40
});

var person = new Person('pony');
``


## Clone object

```javascript
var foo = person.clone()
foo.name
```

## Observe the changes of object attribute

```javascript
person.watch('age', function(newValue){
    console.log('Our person new age is', newValue)
})

person.age = 41;

person.unwatch('age')

person.age = 42;

// outputs: 'Our person new age is 41'
```


## Subscribe and emit events.


```javascript
var Person = Object.extend({
    greet: function() {
      // ...
      this.emit('greet');
    }
});

var person = new Person;

person.on('greet', function() {
    console.log('Our person has greeted');
});

person.greet();

// outputs: 'Our person has greeted'
```

Adds a **one time** listener for the event. The listener is invoked only the first time the event is fired, after which it is removed.

```javascript
person.once('greet', function (value) {
    console.log('Ah, Our person first greet!');
});
```

Adds a listener that will execute **n times** for the event before being removed. The listener is invoked only the first time the event is fired, after which it is removed.

```javascript
person.many('greet', 5, function (value) {
    console.log('Ah, Our person greet 5!');
});
```


##

You don't need to define a class all at once. You can reopen a class and define new properties using the reopen method.
