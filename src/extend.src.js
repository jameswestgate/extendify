
/*
* Extendify JavaScript Mini-Framework 2.0
* https://github.com/jameswestgate/extendify
* 
* Copyright (c) James Westgate 2014
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/


(function() {

	//Fix javascript's broken typeof operator
	//http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
	Object.prototype.getType = function() {
		
		//Get string representation of the type
		var t = ({}).toString.call(this).match(/\s([a-zA-Z]+)/)[1].toLowerCase();

		if (!arguments.length) return t;

		//Return a boolean comparison
		return t === arguments[0].toLowerCase();
	}

	//Provide all objects with the extend function
	Object.prototype.extend = function() {

		var self = this;

		process(arguments);

		function process(args) {

			if (!args) return;

			var t = args.getType();

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
	
	//Returns a constructor function given an optional prototype function
	//Uses extend as a constructor
	Object.type = function(o, s) {
		
		if (typeof o === 'string') s = o, o = null;
		if (o) F.prototype = new o();
		
		if (s) {	
			var arr = s.split('.');

			if (arr.length > 1) {
				var name = arr.pop();
				Object.parse(arr)[name] = F;
			} 
			else {
				window[arr[0]] = F;
			}
		}

		return F;

		function F(){
			this.extend(arguments);
		}
	}

	//Returns an object containing an existing and/or new sub objects representing a named hierarchy
	Object.parse = function(path) {
		
		var base = window;
		var t = path.getType();

		//Only parse string paths 
		if (t === 'string' || t === 'array') {

			var spaces = (t === 'string') ? path.split('.') : path;

			//Set up the namespace objects
			for (var i=0, len=spaces.length; i<len; i++) {
				base = base[spaces[i]] = base[spaces[i]] || {};
			}
		}
		else {
			base = path;
		}

		return base;
	}

})();














