module("namespace tests");

test("namespace", function() {

	ok(typeof Object.parse != 'undefined', 'namespace function created');


	var space1 = Object.parse('alpha');
	ok(window.alpha != null, 'alpha namespace created');
	ok(window.alpha === space1, 'alpha namespace returned');

	var space2 = Object.parse('alpha.beta');
	ok(window.alpha.beta != null, 'beta namespace created');
	ok(window.alpha.beta === space2, 'beta namespace returned');

	var space3 = Object.parse('alpha.beta.charlie');
	ok(window.alpha.beta.charlie != null, 'charlie namespace created');
	ok(window.alpha.beta.charlie === space3, 'charlie namespace returned');

	var space4 = Object.parse('delta.echo');
	ok(window.delta != null, 'delta namespace created');
	ok(window.delta.echo != null, 'echo namespace created');
	ok(window.delta.echo === space4, 'echo namespace returned');

	var space5 = Object.parse(window.alpha);
	ok(window.alpha === space5, 'alpha object namespace returned');
});

test("namespace extend", function() {
	
	var space1 = Object.parse('system.data');

	space1.extend(function() {
        this.customer = {age:37};
    });

	space1.extend(function() {
		this.parent = true;
	});

	ok(system.data.customer.age === 37, 'customer age is correct');
	ok(system.data.parent, 'parent object value set');
})

test("namespace edge", function() {
	
	var space1 = Object.parse('system.data'.split('.'));

	ok(system.data, 'array parameter is correct');
})


module("type tests");

test("type", function() {

	//Test definitions
	var Person = Object.type();
	var Employee = Object.type(Person);

	Employee.prototype.extend(function(){
		this.getBonus = function() {
			return 500;
		}
	});

	var Director = Object.type(Employee);

	Director.prototype.extend(function() {
		this.getBonus = function() {
			return Employee.prototype.getBonus() * 10;
		}
	});	

	//Create test objects
	var person = new Person({name: 'John'});
	var employee = new Employee({name: 'Jack', salary: 123});
	var director = new Director({name: 'James', salary: 123, options: 1000});

	//Test types
	ok(person instanceof Person, 'person is Person');
	ok(employee instanceof Person, 'employee is Person');
	ok(employee instanceof Employee, 'employee is Employee');

	//Test constructors and properties
	ok(person.name == 'John', 'person is called John');
	ok(employee.name == 'Jack', 'employee is called Jack');
	ok(employee.salary == 123, 'employee salary is 123');
	ok(person.salary == null, 'person has no salary');

	//Test inheritance
	ok(director instanceof Person, 'director is Person');
	ok(director instanceof Employee, 'director is Employee');
	ok(director instanceof Director, 'director is Director');
	ok(director.options == 1000, 'director has share options');
	ok(director.salary == 123, 'director salary is 123');
	ok(director.name == 'James', 'director is called James');

	//Test overrides
	ok(typeof person.getBonus == 'undefined', 'person bonus is undefined');
	ok(employee.getBonus() == 500, 'employee bonus is 500.00');
	ok(director.getBonus() == 5000, 'director bonus is 5000.00');
	ok(Employee.prototype.getBonus.call(director) == 500, 'director original bonus is 500.00');

})

test("type extend", function() {

	//Anonymous prototype
	var Car = Object.type(function() {
		this.wheels = 4;
	});

	Car.prototype.extend(function() {
		this.start = function() {
			this.parked = false;
		}
	})

	var car = new Car({parked: true});
	ok(car.wheels = 4, 'Car wheels 4');
	ok(car.parked, 'Car is parked.');

	car.start();

	ok(!car.parked, 'Car has started.')
})

test("type (edge)", function() {

	//Create a type with an object literal prototype
	var Static = Object.type(function() {
		this.one = true;
	});

	//Extend the prototype with a 'four' function
	Static.prototype.extend(function() {
		this.four = function() {
			return true;
		};
	})

	var stat = new Static({two: true});

	ok (stat.one, "one is true");
	ok (stat.two, "two is true");
	ok (typeof stat.three === "undefined");
	ok (stat.four(), "four is true")
	ok (typeof stat.five === "undefined");

	Static.prototype.extend(function() {
		this.five = function() {
			return true;
		};
	})

	stat = new Static({two:true, three: true});
	ok (stat.one, "one is still true");
	ok (stat.two, "two is still true");
	ok (stat.three, "three is true");
	ok (stat.four(), "four is true");
	ok (stat.five(), "five is true");
})

test("type (namespace)", function() {

	var Cat = Object.type('animals.felines.Cat');
	var Tiger = Object.type(Cat, 'animals.felines.Tiger');

	var mowgli = new Tiger({growl: true});

	ok(animals.felines, 'animal and felines namespace created');
	ok(typeof animals.felines.Cat === 'function', 'Cat function created');
	ok(typeof animals.felines.Tiger === 'function', 'Tiger function created');

	ok(mowgli instanceof animals.felines.Cat, 'Mowgli is a Cat instance');
	ok(mowgli instanceof animals.felines.Tiger, 'Mowgli is a Tiger instance');
	ok(mowgli.growl, 'Mowgli can growl')

	var Sex = Object.type('Panther');
	ok(window.Panther && Sex === Panther , 'Sex panther. 60% of the time, it works every time.')
});


module("typeof tests");

test("typeof", function() {

	ok({a: 4}.getType("object"), '{a: 4}.getType("object")');
	ok([1, 2, 3].getType("array"), '[1, 2, 3].getType("array")');
	ok(new ReferenceError().getType("error"), 'new ReferenceError().getType("error")');
	ok(new Date().getType("date"), 'new Date().getType("date")');
	ok(/a-z/.getType("regexp"), '/a-z/.getType("regexp")');
	ok(Math.getType("math"));
	ok(JSON.getType("json"));
	ok(new Number(4).getType("number"));
	ok(new String("abc").getType("string"))
	ok(new Boolean(true).getType("boolean"))
	ok(arguments.getType("arguments"), 'arguments.getType("arguments")')
});

module("documentation tests");

test("example 1", function() {

	expect(0);
	
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

	//Create a mixin. Bob joins the secret club
	person.extend({handshake: true, car: 'fast'});

	//Outputs: Bob is in the secret club.
	if (person instanceof Manager && person.handshake && person.car === 'fast') console.log(person.name + ' is in the secret club.');
});

test("example 2", function() {
	
	expect(0);

	//Create a namespace
	Object.parse('acme.corp');
	acme.corp.Director = Object.type();

	var person = new acme.corp.Director({salary: 5000});

	//Outputs: Your salary is now $5000.
	if (person instanceof acme.corp.Director) console.log('Your salary is now $' + person.salary);
});

test("example 3", function() {

	expect(0);
	
	Object.type('acme.corp.Director');

	var person = new acme.corp.Director({salary: 5000});

	//Outputs: Your salary is still $5000.
	if (person instanceof acme.corp.Director) console.log('Your salary is still $' + person.salary);
});

test("example 4", function() {

	expect(0);
	
	var Employee = Object.type('acme.corp.Employee');
	Object.type(Employee, 'acme.corp.Director');

	var person = new acme.corp.Director({salary: 8000});

	//Outputs: You deserve it!
	if (person instanceof acme.corp.Employee && person instanceof acme.corp.Director) console.log('You deserve it!');
});

test("example 5", function() {

	expect(0);

	Object.parse('acme.corp').extend(function() {

		this.Employee = Object.type();
		this.Director = Object.type(this.Employee);

		var person = new this.Director({salary: 10000});

		//Outputs: You should buy some Sex Panther!
		if (person instanceof acme.corp.Employee && person instanceof acme.corp.Director) console.log('You should buy some Sex Panther!');
	})
})
