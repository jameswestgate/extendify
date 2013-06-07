// ==ClosureCompiler==
// @output_file_name extend.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

/*
* Extendify JavaScript Framework 1.1
* https://github.com/jameswestgate/ExtendJS
* 
* Copyright (c) James Westgate 2013
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/


window.extend = function(root) {

	"use strict";

	window.extend = null; //delete throws error on < IE9

	root = root || window;

	//-- Define a utility function to check undefined and object types
	root.is = function(t, c) {
		return nativeType(t) === c;
	}
	
	//-- Returns a function that takes a function parameter to be applied with the context provided
	root.extendify = function(c) {
		
		return function(arg) {

			if (arguments.length) {
				var t = nativeType(arg)

				//Call the function setting invoker as this
				if (t === 'function') {
					arg.apply(c);
					return;
				}

				//Copy members of t into the invoker
				if (t === 'object') {
					for(var key in t) c[key] = t[key];
					return;
				}
			}
		}
	}

	//-- Returns an object containing an existing and/or new sub objects representing a name hierarchy
	root.namespace = function(path, fn) {
		var base = window;

		//Only parse string paths 
		if (typeof path === 'string') {

			var spaces = path.split('.');

			//Set up the namespace objects
			for (var i=0, len=spaces.length; i<len; i++) {
				base = base[spaces[i]] = base[spaces[i]] || {};
				if (!base.extend) base.extend = root.extendify(base);
			}
		}
		else {
			base = path;
		}

		base.extend(fn);

		return base;
	};

	//-- Returns an empty object that can be extended
	root.type = function(o, c) {
		
		var ctors = [];

		if (arguments.length === 1) c = o, o = null;
		if (o) F.prototype = new o();

		F.prototype.extend = root.extendify(F.prototype);
		F.extend = function(fn) {if (typeof fn === 'function') ctors.push(fn)};

		F.extend(c);
		return F;

		function F(){
			for(var i=0, len=ctors.length; i<len; i++) this.base = o, ctors[i].apply(this, arguments);
		}
	}

	
	//--Loads one or more script files and executes an optional function when loaded

	//Steve Souders - http://www.stevesouders.com/blog/2010/12/06/evolution-of-script-loading/
	//Dustin Diaz - http://www.dustindiaz.com/scriptjs/
	var loaded = []; //previously loaded scripts

	root.load = function() {

		if (!arguments.length) return;

		var callback;			
		var scripts = 0;
		var count = 0;
		
		//Loop through arguments
		for (var i=0, len=arguments.length; i<len; i++) {

			var arg = arguments[i];

			//Load args up to the callback, rest ignored
			if (typeof arg === 'function') {
				callback = arg;
				scripts = i;

				//Check callback ie if using loaded mods
				if (count === scripts) callback();
				break;
			}

			arg = arg.toString();

			//If loaded increment counter, else load with callback
			if (loaded[arg]) {
				count++;
				if (callback && count === scripts) callback();
			}
			else {

				var script = document.createElement('script');
				script.type = 'text/javascript';

				script.onload = script.onreadystatechange = function () {
					if (script.readyState && script.readyState !== 'complete' && script.readyState !== 'loaded') return false;

					script.onload = script.onreadystatechange = null;
					count++;
					loaded[arg] = true;

					if (callback && count === scripts) callback();

				};
				script.async = true;

				//Set source. Add preconfigured extension if required
				script.src = arg;
				document.getElementsByTagName('head')[0].appendChild(script);
			}
		}
	};


	//-- Object Literal Microtemplating 
	var elementTable = {}, output;
	var tags = 'abipq,bbbrdddldtemh1h2h3h4h5h6hrliolrprttdthtrul,bdocoldeldfndivimginskbdmapnavpresubsupvar,abbrareabasebodycitecodeformheadhtmllinkmarkmenumetarubysampspantime,asideaudioembedinputlabelmeterparamsmalltabletbodytfoottheadtitlevideo,buttoncanvasdialogfigurefooterheaderiframelegendobjectoptionoutputscriptselectsourcestrong,addressarticlecaptioncommanddetailssection,colgroupdatagriddatalistfieldsetnoscriptoptgroupprogresstextarea,,blockquote,eventsource'.split(',');
	
	for(var i=1,len=tags.length; i<=len; i++) {
		var tag=tags[i-1];

		for(var j=0,len2=tag.length; j<len2; j+=i) {
			elementTable[tag.substring(j, j+i)] = {open:0, closed:0};
		}
	}

	// Create markup out of the il 
	root.compose = function (il) {
		output = [];
		parseIl(il, null);
		return output.join('');
	};


	//-- Multicast event callbacks
	root.Events = type(function() {

		var delegates = [];
		var self = this;

		//Store 
		this.context = null;

		//Add an event handler
		this.on = function() {
			if (arguments.length > 1 && nativeType(arguments[1]) === 'function') delegates.push([arguments[0], arguments[1]]);
		}

		//Remove an event handler, by event name, or by function and name
		this.off = function() {

			//Clear if no arguments
			if (!arguments.length) {
				delegates.length = 0;
				return
			}

			var i = delegates.length;
			while (i--) {
				if (!arguments[0] || arguments[0] === delegates[i][0]) {
					if (!arguments[1] || arguments[1] === delegates[i][1]) delegates.splice(i,1);
				}
			}
		}

		//Fires the named evet, or all events if not passed in
		this.fire = function() {
			var parms = [];
			
			//Move arguments to proper array
			if (arguments.length > 1) {
				for (var i=1, len=arguments.length; i<len; i++) prms.push(arguments[i]);
			}
			
			for (var i=0, len=delegates.length; i<len; i++) {
				if (!arguments[0] || arguments[0] === delegates[i][0]) {
					self.context = arguments[0];
					delegates[i][1].apply(this, parms);
					self.context = null;
				}
			}
		}
	});

	//--Private functions
	function nativeType(t) {
		if (t === null) return 'null';
		if (typeof t === 'undefined') return 'undefined';
		return Object.prototype.toString.call(t).toLowerCase().replace('[object ','').replace(']','');
	}

	function checkClose(key) {

		if (key === null) return;

		if (elementTable[key].open > elementTable[key].closed) {
			output.push('>');
			elementTable[key].closed ++;
		}
	}

	//Parse each element in the template IL recursively
	function parseIl(il, parent) {
		  
		var t = nativeType(il);

		if (t === 'array') {
			
			for (var i=0, len=t.length; i<len; i++) {
				parseIl(il[i], parent);
			};
		}
		else if (t === 'function') {
			
			var temp = [], result = il.apply(temp); //an array to push to and/or result to append
			
			if (result) temp.push(result);
			
			parseIl(temp, parent);
		} 
		else if (t === 'object') {
			
			for (var key in il) {

				if (il.hasOwnProperty(key)) {

					var el = il[key];

					//Tag 
					if (elementTable[key]) {

						//If we have an open tag close it
						checkClose(parent);

						output.push('<' + key);

						elementTable[key].open++;

						parseIl(el, key);

						checkClose(key);
						output.push('</' + key + '>');
					}
					//Attr
					else {
						if (key === 'text') {
							parseIl(el, parent);
						}
						else {
							output.push(' ' + key + '="');

							parseIl(el, null);

							output.push('"');
						}
					}
				}
			};
		} 
		else {
			checkClose(parent);

			//Render text inside tag or attribute
			output.push(il);
		}
	}
};














