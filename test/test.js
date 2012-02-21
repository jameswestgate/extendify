module("name tests");


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
