// ==ClosureCompiler==
// @output_file_name extend.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

/*
* Extend JavaScript Framework
* https://github.com/jameswestgate/xtendjs
* 
* Copyright (c) James Westgate 2012
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/

(function(root) {

	//-- Returns an object containing an existing and/or new sub objects representing a name hierarchy
	root.namespace = function(path, fn) {
		
		var root = window;

		//Only parse string paths 
		if (typeof path === 'string') {

			var spaces = path.split('.');

			//Set up the namespace objects
			for (var i=0, len=spaces.length; i<len; i++) root = root[spaces[i]] || {extend: function(fn) {if (typeof fn === 'function') fn.call(this)}};
		}
		else {
			root = path;
		}

		if (typeof fn === 'function') fn.call(root);

		return root;
	};

	//-- Returns an empty object that can be extended
	root.define = function(fn) {
		
		F.prototype.extend = function(fn) {
			if (typeof fn === 'function') fn.apply(this, arguments);
		}

		if (typeof fn === 'function') fn.call(F);

		return F;

		function F(){};
	}

})(window);












