// ==ClosureCompiler==
// @output_file_name extend.min.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// ==/ClosureCompiler==

/*
* Extend JavaScript Framework
* https://github.com/jameswestgate/ExtendJS
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
			for (var i=0, len=spaces.length; i<len; i++) root = root[spaces[i]] = root[spaces[i]] || {extend: function(fn) {if (typeof fn === 'function') fn.apply(this)}};
		}
		else {
			root = path;
		}

		if (typeof fn === 'function') root.extend(fn);

		return root;
	};

	//-- Returns an empty object that can be extended
	root.define = function(o, c) {
		
		var ctors = [];

		if (arguments.length === 1) c = o, o = null;
		if (o) F.prototype = new o();
		
		F.prototype.extend = function(fn) {if (typeof fn === 'function') fn.apply(this)};
		F.extend = function(fn) {if (typeof fn === 'function') ctors.push(fn)};

<<<<<<< HEAD
		F.constructor.extend = F.prototype.extend  = function(fn) {
			if (typeof fn === 'function') fn.apply(this);
		}

=======
		F.extend(c);
>>>>>>> Add extend functionality to constructors.
		return F;

		function F(){
			for(var i=0, len=ctors.length; i<len; i++) ctors[i].apply(this, arguments);
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
		var regext = /.js$/;

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

	//Type checking
	function type(e) {
		if (typeof e === 'undefined') return 'undefined';
		if (e === null) return 'null';
		return Object.prototype.toString.call(e).toLowerCase().replace('[object ','').replace(']','');
	}

    //Parse each element in the template IL recursively
    function parseIl(il, parent) {
        
        var t = type(il);

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
    
})(window);












