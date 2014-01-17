
/*
* Extendify JavaScript Mini-Framework 2.0
* https://github.com/jameswestgate/ExtendJS
* 
* Copyright (c) James Westgate 2014
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/


(function(context) {

	//-- Extend the Object prototype 

	//Fix javascript's broken typeof operator
	Object.prototype['typeof'] = function() {
		
		//return the actual type
		if (!arguments.length) return nativeType(this);

		//Return a boolean comparison
		return nativeType(this) === arguments[0].toLowerCase();
	}

	//Provide all objects with the extend function
	Object.prototype.extend = function() {

		var self = this;

		process(arguments);

		function process(args) {

			if (!args) return;

			var t = nativeType(args);

			//Call the function setting invoker as context
			if (t === 'function') {
				args.apply(self);
			}

			//Shallow copy members into the invoker
			else if (t === 'object') {
				for(var key in args) if (args.hasOwnProperty(key)) self[key] = args[key];
			}

			//Arrays or array-like structures
			else if (t === 'array' || t === 'arguments') {
				for (var i=0, len=args.length; i<len; i++) process(args[i]);
			}
		}
	}
	
	//--- Add utility functions to the context supplied

	//Returns a constructor function given a prototype
	//Uses extend as a constructor
	context.type = function(o) {
		
		if (o) F.prototype = new o();
		return F;

		function F(){
			this.extend(arguments);
		}
	}

	//Returns an object containing an existing and/or new sub objects representing a name hierarchy
	context.namespace = function(path) {
		
		var base = window;

		//Only parse string paths 
		if (typeof path === 'string') {

			var spaces = path.split('.');

			//Set up the namespace objects
			for (var i=0, len=spaces.length; i<len; i++) {
				base = base[spaces[i]] = base[spaces[i]] || {};
			}
		}
		else {
			base = path;
		}

		return base;
	};


	//Returns a string representation of the type of the value provided
	//http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	function nativeType(obj) {
		return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
	}

})(this);














