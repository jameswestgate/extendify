// ==ClosureCompiler==
// @output_file_name extend.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

/*
* Extendify JavaScript Framework
* https://github.com/jameswestgate/ExtendJS
* 
* Copyright (c) James Westgate 2012
*
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*/

window.extend = function(root, proto) {

	delete window.extend;
	root = root || window;

	//Returns a function that takes a function parameter to be applied with the context provided
	root.extendify = function(c) {
		
		c.extend = function(arg) {
			
			if (arguments.length) {
				var t = nativeType(arg)
				
				//Call the function setting invoker as this
				if (t === 'function') {
					arg.apply(c);
					return;
				}

				//Copy members of t into the invoker
				if (t === 'object') {
					for (var key in t) c[key] = t[key];
					return;
				}

				if (t === 'array') {
					for (var i=0, len=t.length; i<len; i++) arguments.callee(t[i]);
					return;
				}
			}
		}


		//-- events on/off
		c.on = function(e, f) {
			if (!this._events) this._events = [];
			
			var arr = this._events;

			if (f) {	
				arr.push([e, f]);
			}
			else {
				var idx = arr.indexOf(e);
				while (idx !== -1) {
					arr[idx]();
					idx = arr.indexOf(e, idx);
				}
			}	
		}

		c.off = function(e) {
			var idx = arr.indexOf(e);
			while (idx !== -1) {
				delete arr[idx]();
				idx = arr.indexOf(e, idx);
			}
		}

		//-- Prop is a chainable key pair system
		c.prop = function(name, value) {
			if (typeof value === "undefined") return c[name];
			c[name] = value;
			return this;
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
				if (!base.extend) root.extendify(base);
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
		
		root.extendify(F.prototype);
		F.extend = function(fn) {if (typeof fn === 'function') ctors.push(fn)};

		F.extend(c);
		return F;

		function F(){
			for(var i=0, len=ctors.length; i<len; i++) this.base = o, ctors[i].apply(this, arguments);
		}
	}

	//-- Deferreds 

	root.Deferred = function() {

	}

	root.Deferred.prototype = {
		resolve: null,
		reject: null,
		when: function() {
			return this.defer();
		},
		then: function() {
			return this.defer();
		},
		defer: function() {
			var def = new Deferred();
			var count = 0;
			
			for (var i=0, len<arguments.length; i<len; i+) {
				var f = arguments[i];
				f.resolve = function() {
					count++;
					if (count == arguments.length) def.resolve();
				}
				f.reject = function() {
					def.reject();
				}
			}

			return def;
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


	//-- JSON-based Microtemplating 

	var elementTable = {}, output;

    var tags = 'abipq,bbbrdddldtemh1h2h3h4h5h6hrliolrprttdthtrul,bdocoldeldfndivimginskbdmapnavpresubsupvar,abbrareabasebodycitecodeformheadhtmllinkmarkmenumetarubysampspantime,asideaudioembedinputlabelmeterparamsmalltabletbodytfoottheadtitlevideo,buttoncanvasdialogfigurefooterheaderiframelegendobjectoptionoutputscriptselectsourcestrong,addressarticlecaptioncommanddetailssection,colgroupdatagriddatalistfieldsetnoscriptoptgroupprogresstextarea,,blockquote,eventsource'.split(',');
    for(var i=1,len=tags.length; i<=len; i++) {
        var tag=tags[i-1];

        for(var j=0,len2=tag.length; j<len2; j+=i) {
            elementTable[tag.substring(j, j+i)] = {open:0, closed:0};
        }
    }

    root.compose = function (il) {
        
		output = [];
        parseIl(il, null);
        return output.join('');
    };

	//Private functions
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
            
			for (var i = 0, length = il.length; i < length; i++) {
                parseIl(il[i], parent);
            }
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

    function nativeType(t) {
    	if (t === null) return 'null';
    	if (typeof t === 'undefined') return 'undefined';
    	return Object.prototype.toString.call(t).toLowerCase().replace('[object ','').replace(']','')
    }
};














