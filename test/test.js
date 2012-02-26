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

	var space1 = namespace('system.data',function() {
		this.customer = {age:37};
	})
	
	space1.extend(function() {
		this.customer.type = 'full';
	});

	space1.extend(function() {
		this.parent = true;
	});

	ok(system.data.customer.age === 37, 'customer age 37');
	ok(system.data.customer.type === 'full', 'customer is full type');
	ok(system.data.parent, 'parent object value set');
})


module("define tests");


test("define", function() {

	//Test definitions
	var Person = define(function(name) {
		this.name = name;
	})

	var Employee = define(Person, function(name) {
		Person.call(this, name);

		this.salary = 123;
	});

	Employee.prototype.extend(function(){
		this.getBonus = function() {
			return 500;
		}
	});

	var Director = define(Employee, function(name) {

		Employee.call(this, name);
		this.options = 1000;
	});

	Director.prototype.extend(function() {
		this.getBonus = function() {
			return Employee.prototype.getBonus() * 10;
		}
	});	

	//Create test objects
	var person = new Person('John');
	var employee = new Employee('Jack');
	var director = new Director('James');

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
	ok(person.name == 'John', 'director is called James');

	//Test overrides
	ok(typeof person.getBonus == 'undefined', 'person bonus is undefined');
	ok(employee.getBonus() == 500, 'employee bonus is 500.00');
	ok(director.getBonus() == 5000, 'director bonus is 5000.00');
	ok(Employee.prototype.getBonus.call(director) == 500, 'director original bonus is 500.00');

})

test("define extend", function() {

	var Car = define(function() {
		this.wheels = 4;
	});
	
	// Car.constructor.parked = true;

	Car.extend(function() {
		this.parked = true;
	})

	Car.prototype.extend(function() {
		this.start = function() {
			this.parked = false;
		}
	})

	var car = new Car();
	ok(car.wheels = 4, 'Car wheels 4');
	ok(car.parked, 'Car is parked.');

	car.start();

	ok(!car.parked, 'Car has started.')
})


module('compose tests');


test('compose', function () {

    //Simple tag
    var il = { div: '' };
    var out = compose(il);
    ok(out == '<div></div>', 'Simple Tag: ' + out);

    //Simple tag with attribute
    il = { div: { style: 'z-order: 0'} };
    out = compose(il);
    ok(out == '<div style="z-order: 0"></div>', 'Simple tag with attribute: ' + out);

    //Simple tag with class attribute
    il = { div: { 'class': 'bacon'} };
    out = compose(il);
    ok(out == '<div class="bacon"></div>', 'Simple tag with class attribute: ' + out);

    //Simple nested tag
    il = { div: { p: 'Hello world'} };
    out = compose(il);
    ok(out == '<div><p>Hello world</p></div>', 'Simple nested tag: ' + out);

    //Simple nested tag with style
    il = { div: { p: { style: 'color: red', text: 'Hello world'}}};
    out = compose(il);
    ok(out == '<div><p style="color: red">Hello world</p></div>', 'Simple nested tag with style: ' + out);

    //Complex nested Tag
    il = { div: { style: 'z-order: 1', p: 'Hello world'} };
    out = compose(il);
    ok(out == '<div style="z-order: 1"><p>Hello world</p></div>', 'Complex nested Tag: ' + out);

	il = {
		html: {
			head: {
				title: 'Test Page'
			},
			body: [
				{p: 'Test1'},
				{p: 'Test2'}
			]
		}
	};

	out = compose(il);
    ok(out == '<html><head><title>Test Page</title></head><body><p>Test1</p><p>Test2</p></body></html>', out);
});

