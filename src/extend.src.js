// ==ClosureCompiler==
// @output_file_name parallex.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

/*
* Parallex JavaScript Framework 0.9
* https://github.com/jameswestgate/parallex
* 
* Copyright (c) James Westgate 2013
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/

//-- Define Classes -- 
(function() {

	function Sync() {
		this.props = {};
	}

	Sync.prototype.element = function() {

		if (arguments.length) {
			this.props.element = arguments[0];
			return this;
		}
		return this.props.element;
	}
})

//-- Define public functi0ons
(function() {
	
	var syncs = []; //{element, absolute, chain} // element is a

	window._ = function(selector, root) {

		var element = (root) document.querySelector(root) : document.body;

		if (!element) {
			
			//Not ofudn in the dom .. yet ... will keep trying though
			//A root will always be resolved, a selector may have zero length
		}

		var sync = getSync(element);

		push

	}

	function getSync(element) {

		var sync;

		//Check for any existing syncs that contain this element
		for (var i=0, len=syncs.length; i<len; i++) {
			
			sync = syncs[i];
			if (sync === element || sync.absolute.contains(element)) return sync;
		}

		//Check if this element contains a sync and promote absolute if required


		//Else create new sync
		sync = new Sync();
		sync.element(element);
		sync.absolute(element);

		return sync;
	}

})();













