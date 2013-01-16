// ==ClosureCompiler==
// @output_file_name extend.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

/*
* Extendify JavaScript Framework 1.0
* https://github.com/jameswestgate/ExtendJS
* 
* Copyright (c) James Westgate 2013
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/

window.extend = function(root) {

	delete window.extend;
	root = root || window;

	//-- Define a utility function to check undefined and object types
	root.type = nativeType;
	
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
	root.define = function(o, c) {
		
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
				if (count === scripts) callback(scriptFolder, scriptExt);
				break;
			}

			//If loaded increment counter, else load with callback
			if (loaded[arg]) {
				count++;
			}
			else {

				var script = document.createElement('script');
				script.type = 'text/javascript';

				script.onload = script.onreadystatechange = function () {
					if (script.readyState && script.readyState !== 'complete' && script.readyState !== 'loaded') return false;

					script.onload = script.onreadystatechange = null;
					count++;
					if (callback && count === scripts) callback();

				};
				script.async = true;

				//Set source. Add preconfigured extension if required
				script.src = arg;
				document.head.appendChild(script);
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

	//Create markup out of the il 
	root.compose = function (il) {
		output = [];
		parseIl(il, null);
		return output.join('');
	};


	//--Private functions
	function nativeType(t) {
		if (t === null) return 'null';
		if (typeof t === 'undefined') return 'undefined';
		return Object.prototype.toString.call(t).toLowerCase().replace('[object ','').replace(']','');
	}

	function checkClose(key) {

		if (key == null) return;

		if (elementTable[key].open > elementTable[key].closed) {
			output.push('>');
			elementTable[key].closed ++;
		}
	}

	//Parse each element in the template IL recursively
	function parseIl(il, parent) {
		  
		var t = nativeType(il);

		if (t === 'array') {
			
			il.forEach(function(e) {
				parseIl(e, parent);
			});
		}
		else if (t === 'function') {
			parseIl(il(), parent);
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

						result = true;
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














