Super lightweight namespacing, object creation and type handling. Extendify's goal is to be lean and mean but surprisingly functional. Supports IE8+ and all modern browsers.

**Getting Started**

Extendify was created to make constructor functions, prototypes, constructors and mixins simple. Every object can use the _Object.extend_ method and each object created via _Object.type_ uses _Object.extend_ internally as a constructor:

```javascript

	//Create a new constructor function named Badge
	var Badge = Object.type();

	Badge.prototype.getBonus = function() {
		return this.salary * 2;
	};

	//Create a Badge instance with two properties
	var person = new Badge({name: 'John', salary: 500});
	
	//Outputs: John earns a bonus of $1000
	console.log(person.name + ' earns a bonus of $' + person.getBonus());

	//Create a new constructor function with a Badge as a prototype
	var Manager = Object.type(Badge);
	person = new Manager({name: 'Bob', salary: 750});

	//Outputs: Bob earns a bonus of $1500
	console.log(person.name + ' earns a bonus of $' + person.getBonus());

	//Create a mixin at anytime. Bob joins the secret club
	person.extend({handshake: true, car: 'fast'});

	//Outputs: Bob is in the secret club.
	if (person instanceof Manager && person.handshake && person.car === 'fast')
		console.log(person.name + ' is in the secret club.');

```

Extendify adds a namespacing function _Object.parse_ to create structures that organise complex code:

```javascript

	//Create a namespace
	Object.parse('acme.corp');
	acme.corp.Director = Object.type();

	var person = new acme.corp.Director({salary: 5000});

	//Outputs: Your salary is now $5000.
	if (person instanceof acme.corp.Director) 
		console.log('Your salary is now $' + person.salary);

```

You can simplify the code above by creating a namespace when you define a type:

```javascript

	Object.type('acme.corp.Director');

	var person = new acme.corp.Director({salary: 5000});

	//Outputs: Your salary is still $5000.
	if (person instanceof acme.corp.Director)
		console.log('Your salary is still $' + person.salary);
	
```

You can combine the prototype and the namespace parameters:

```javascript

	var Employee = Object.type('acme.corp.Employee');
	Object.type(Employee, 'acme.corp.Director');

	var person = new acme.corp.Director({salary: 8000});

	//Outputs: You deserve it!
	if (person instanceof acme.corp.Employee && person instanceof acme.corp.Director) 
		console.log('You deserve it!');

```

You can also extend the namespace with a function to achieve a similar result. 
The extend method accepts a function as well as objects and arrays:

```javascript

	Object.parse('acme.corp').extend(function() {

		this.Employee = Object.type();
		this.Director = Object.type(this.Employee);

		var person = new this.Director({salary: 10000});

		//Outputs: You should buy some Sex Panther!
		if (person instanceof acme.corp.Employee && person instanceof acme.corp.Director) 
			console.log('You should buy some Sex Panther!');
	})

```

**Functions**

<table>
<tbody>

<tr><td><a href="../../wiki/Object.type/">Object.type</a></td><td>Define a function constructor with an optional prototype.</td></tr>
<tr><td><a href="../../wiki/Object.parse/">Object.parse</a></td><td>Create a namespace hierarchy from a string representation.</td></tr>
<tr><td><a href="../../wiki/Object.extend/">Object.extend</a></td><td>Copy members to the current object by providing an object, function or array</td></tr>
<tr><td><a href="../../wiki/Object.typeof/">Object.typeof</a></td><td>Check for arrays, functions and other types.</td></tr>
</tbody>
</table>


**Unit Tests**

Click <a href="http://jameswestgate.github.io/extendify/test/" target="_blank">here</a> to execute the latest unit tests.
