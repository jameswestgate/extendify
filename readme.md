Super lightweight namespacing, constructor functions and object creation, and type handling. Extendify your javascript. 

Extendify will always be a minimal library - surprisingly functional - but lean and mean. We pledge never to exceed 1k minified and gzipped. Supports IE6+.

###API Documentation Version 2.0

**Getting Started**

Extendify makes constructor functions, prototypes, constructors and mixins a doddle.

```javascript

	//Create a new constructor function named Badge
	var Badge = type();

	Badge.prototype.getBonus = function() {
		return this.salary * 2;
	};

	//Create a Badge instance with two properties
	var person = new Badge({name: 'John', salary: 500});
	
	//Outputs: John earns a bonus of $1000
	console.log(person.name + ' earns a bonus of $' + person.getBonus());

	//Create a new constructor function with a Badge as a prototype
	var Manager = type(Badge);
	person = new Manager({name: 'Bob', salary: 750});

	//Outputs: Bob earns a bonus of $1500
	console.log(person.name + ' earns a bonus of $' + person.getBonus());

	//Create a mixin. Bob joins the secret club
	person.extend({handshake: true, car: 'fast'});

	//Outputs: Bob is in the secret club.
	if (person instanceof Manager && person.handshake && person.car === 'fast') console.log(person.name + ' is in the secret club.');

```


**Functions**

<table>
<tbody>
<tr><td><a href="../../wiki/namespace/">namespace</a></td><td>Create a namespace hierarchy with ease.</td></tr>
<tr><td><a href="../../wiki/type/">type</a></td><td>Define a function constructor with an optional prototype.</td></tr>
<tr><td><a href="../../wiki/extend/">extend</a></td><td>Copy members to the current object by providing an object, function or array</td></tr>
<tr><td><a href="../../wiki/typeof/">typeof</a></td><td>Check for arrays, functions and other types.</td></tr>
</tbody>
</table>


**Unit Tests**

Click <a href="http://jameswestgate.github.io/extendify/test/" target="_blank">here</a> to execute the latest unit tests.
