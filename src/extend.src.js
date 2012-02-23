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
		
		if (arguments.length === 1) c = o, o = null;

		if (o) F.prototype = new o();
		F.prototype.extend = function(fn) {
			if (typeof fn === 'function') fn.apply(this);
		}

		return F;

		function F(){
			if (typeof c === 'function') c.apply(this, arguments);
		}
	}


	//--Loads one or more script files and executes an optional function when loaded

	//Steve Souders - http://www.stevesouders.com/blog/2010/12/06/evolution-of-script-loading/
	//Dustin Diaz - http://www.dustindiaz.com/scriptjs/
	root.load = function() {

		if (!arguments.length) return;

		var callback = null;			
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
					if (callback != null && count === scripts) callback();

				};
				script.async = true;

				//Set source. Add preconfigured extension if required
				script.src = [scriptFolder, '/',  arg, scriptExt].join('');
				document.head.appendChild(script);
			}
		}
	};


	//-- JSON-based Microtemplating 

	var elements = 'a,abbr,address,area,article,aside,audio,b,base,bb,bdo,blockquote,body,br,button,canvas,caption,cite,\
	code,col,colgroup,command,datagrid,datalist,dd,del,details,dialog,dfn,div,dl,dt,em,embed,eventsource,fieldset,\
	figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,ins,kbd,label,legend,li,\
    link,mark,map,menu,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,ruby,\
    rp,rt,samp,script,section,select,small,source,span,strong,sub,sup,table,tbody,td,textarea,tfoot,th,\
    thead,time,title,tr,ul,var,video'.split(',');

    var elementTable = {};
    var output = [];

    //Create an associative array from the valid html elements
    for (var i = elements.length - 1; i >= 0; i--) elementTable[elements[i]] = {open: 0, closed: 0};

    elements = null;

    //Main parsing function
    root.templ = function (il) {
        
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

        if (typeof il === 'array') {
            
			for (var i = 0, length = il.length; i < length; i++) {
                parseIl(il[i], parent);
            }
        } 
		else if (typeof il === 'function') {
            parseIl(il(), parent);

        } 
		else if (typeof il === 'object') {
            
			for (var key in il) {

				if (il.hasOwnProperty(key)) {

					var el = il[key];

					//Tag 
					if (elementTable[key]) {

						//If we have an open tag close it
						checkClose(parent);

						output.push('<');
						output.push(key);

						elementTable[key].open++;

						parseIl(el, key);

						checkClose(key);
						output.push('</');
						output.push(key);
						output.push('>');

						result = true;
					}
					//Attr
					else {
						if (key === 'text') {
							parseIl(el, parent);
						}
						else {
							output.push(' ');
							output.push(key);
							output.push('="');

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












