module("namespace tests");

//Initialise Extendify Js
window.extend();

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


module("type tests");


test("type", function() {

	//Test definitions
	var Person = type(function(name) {
		this.name = name;
	})

	var Employee = type(Person, function(name) {
		this.base.call(this, name);
		this.salary = 123;
	});

	Employee.prototype.extend(function(){
		this.getBonus = function() {
			return 500;
		}
	});

	var Director = type(Employee, function(name) {

		this.base.call(this, name);
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

test("type extend", function() {

	var Car = type(function() {
		this.wheels = 4;
	});

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

test("type (edge)", function() {

	var Static = type(function() {
		this.one = true;
	});

	Static.extend(function(){
		this.two = true;
	});

	Static.prototype.extend(function() {
		this.four = function() {
			return true;
		};
	})

	var stat = new Static();

	ok (stat.one, "one is true");
	ok (stat.two, "two is true");
	ok (typeof stat.three === "undefined");
	ok (stat.four(), "four is true")
	ok (typeof stat.five === "undefined");

	Static.extend(function() {
		this.three = true;
	})

	Static.prototype.extend(function() {
		this.five = function() {
			return true;
		};
	})

	stat = new Static();
	ok (stat.one, "one is still true");
	ok (stat.two, "two is still true");
	ok (stat.three, "three is true");
	ok (stat.four(), "four is true");
	ok (stat.five(), "five is true");
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

    il = {table: function() {
	  for (var i=1; i<4; i++) this.push({tr:{td:i}});
	}};

	out = compose(il);
	ok(out == '<table><tr><td>1</td></tr><tr><td>2</td></tr><tr><td>3</td></tr></table>', out);
});

test('compose (edge)', function() {
 	//Simple tag
    var il = {div: function() {
    	return 'hello world';
    }};

    var out = compose(il);
    ok(out == '<div>hello world</div>', out);

    il = {div: function() {
    	this.push('hello world');
    }};

    out = compose(il);
    ok(out == '<div>hello world</div>', out);

    il = {div: function() {
    	this.push({p:'goodbye world'});
    }};

    out = compose(il);
    ok(out == '<div><p>goodbye world</p></div>', out);

    il = {div: function() {
    	this.push({p:'hello'});
    	return {p:'goodbye'};
    }};

    out = compose(il);
    ok(out == '<div><p>hello</p><p>goodbye</p></div>', out);

})

test('Events', function() {

	//Simple test
	var events = new Events();
	var click = false;

	events.on('click', function() {
		click = true;
	})

	//fir eclick event
	events.fire('click');
	ok(click, 'Simple click');

	//Fire non listed event
	click = false;
	events.fire('other');
	ok(!click, 'No click');

	//Remove event
	events.off('click');

	events.fire('click');
	ok(!click, 'Click removed')
})

test('multiple events', function() {

	//Simple test
	var events = new Events();
	var one = false, two = false, three = false;

	events.on('click', function() {
		one = true;
	})

	events.on('click', function() {
		two = true;
	})

	//fire click event
	events.fire('click');
	ok(one && two, 'multiple click');

	one = false, two = false, three = false;

	events.on('doubleclick', function() {
		three = true;
	})

	//Fire all events
	events.fire();

	ok(one && two && three, 'seperate multiple events');

	one = false, two = false, three = false;

	events.off();
	events.fire();

	ok(!one && !two && !three, 'no seperate multiple evemnts');
})

