module("namespace tests");

test("namespace", function() {

	ok(typeof window.namespace != 'undefined', 'namespace function created');

	ok(typeof namespace != 'undefined', 'global namespace function created')

	var space1 = namespace('alpha');
	ok(window.alpha != null, 'alpha namespace created');
	ok(window.alpha === space1, 'alpha namespace returned');

	var space2 = namespace('alpha.beta');
	ok(window.alpha.beta != null, 'beta namespace created');
	ok(window.alpha.beta === space2, 'beta namespace returned');

	var space3 = namespace('alpha.beta.charlie');
	ok(window.alpha.beta.charlie != null, 'charlie namespace created');
	ok(window.alpha.beta.charlie === space3, 'charlie namespace returned');

	var space4 = namespace('delta.echo');
	ok(window.delta != null, 'delta namespace created');
	ok(window.delta.echo != null, 'echo namespace created');
	ok(window.delta.echo === space4, 'echo namespace returned');

	var space5 = namespace(window.alpha);
	ok(window.alpha === space5, 'alpha object namespace returned');
});

test("namespace extend", function() {
	
	var space1 = namespace('system.data');

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
	
	var space1 = namespace('system.data'.split('.'));

	ok(system.data, 'array parameter is correct');
})


module("type tests");

test("type", function() {

	//Test definitions
	var Person = type();
	var Employee = type(Person);

	Employee.prototype.extend(function(){
		this.getBonus = function() {
			return 500;
		}
	});

	var Director = type(Employee);

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
	var Car = type(function() {
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
	var Static = type(function() {
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

	var Cat = type('animals.felines.Cat');
	var Tiger = type(Cat, 'animals.felines.Tiger');

	var mowgli = new Tiger({growl: true});

	ok(animals.felines, 'animal and felines namespace created');
	ok(typeof animals.felines.Cat === 'function', 'Cat function created');
	ok(typeof animals.felines.Tiger === 'function', 'Tiger function created');

	ok(mowgli instanceof animals.felines.Cat, 'Mowgli is a Cat instance');
	ok(mowgli instanceof animals.felines.Tiger, 'Mowgli is a Tiger instance');
	ok(mowgli.growl, 'Mowgli can growl')

	var Sex = type('Panther');
	ok(window.Panther && Sex === Panther , 'Sex panther. 60% of the time, it works every time.')
});


module("typeof tests");

test("typeof", function() {
	
	ok({a: 4}.typeof("object"), '{a: 4}.typeof("object")');
	ok([1, 2, 3].typeof("array"), '[1, 2, 3].typeof("array")');
	ok(new ReferenceError().typeof("error"), 'new ReferenceError().typeof("error")');
	ok(new Date().typeof("date"), 'new Date().typeof("date")');
	ok(/a-z/.typeof("regexp"), '/a-z/.typeof("regexp")');
	ok(Math.typeof("math"));
	ok(JSON.typeof("json"));
	ok(new Number(4).typeof("number"));
	ok(new String("abc").typeof("string"))
	ok(new Boolean(true).typeof("boolean"))
	ok(arguments.typeof("arguments"), 'arguments.typeof("arguments")')
});

module("documentation tests");

test("example 1", function() {

	expect(0);
	
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
});

test("example 2", function() {
	
	expect(0);

	//Create a namespace
	namespace('acme.corp');
	acme.corp.Director = type();

	var person = new acme.corp.Director({salary: 5000});

	//Outputs: Your salary is now $5000.
	if (person instanceof acme.corp.Director) console.log('Your salary is now $' + person.salary);
});

test("example 3", function() {

	expect(0);
	
	type('acme.corp.Director');

	var person = new acme.corp.Director({salary: 5000});

	//Outputs: Your salary is still $5000.
	if (person instanceof acme.corp.Director) console.log('Your salary is still $' + person.salary);
});

test("example 4", function() {

	expect(0);
	
	var Employee = type('acme.corp.Employee');
	type(Employee, 'acme.corp.Director');

	var person = new acme.corp.Director({salary: 8000});

	//Outputs: You deserve it!
	if (person instanceof acme.corp.Employee && person instanceof acme.corp.Director) console.log('You deserve it!');
});
