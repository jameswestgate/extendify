Super lightweight namespacing, object creation, script loading and groovy templating solution. Extendify is named after a function which adds the _extend_ method to all namespaces, class functions and prototypes created with the library.

Extendify will always be a minimal library, lean and mean. We pledge never to exceed 2k minified and gzipped.

###API Documentation

**Getting Started**

No functions are available until added to the namespace object of your choice. By default all functions are added to the
window object and can be used without prefix:

```javascript
//Add methods to the window object
extend(); //Equivalent to extend(window);

load('myLibrary.js', 'another.js', function() {
  alert('scripts loaded!')
})
```
If you prefer, extendify can be added to an object of your choice (e.g. jQuery):

```javascript
extend(jQuery);

alert($.compose({p:'Hello world'})); //alerts 'Hello world'
```

**Functions**

<table>
<tbody>
<tr><td><a href="../../wiki/namespace/">namespace</a></td><td>Create and extend a namespace hierarchy.</td></tr>
<tr><td><a href="../../wiki/type/">type</a></td><td>Define a function constructor with an optional prototype.</td></tr>
<tr><td><a href="../../wiki/load/">load</a></td><td>Loads one or more script files asynchronously.</td></tr>
<tr><td><a href="../../wiki/compose/">compose</a></td><td>Markup creation and population using javascript object notation.</td></tr>
<tr><td><a href="../../wiki/is/">is</a></td><td>Check for undefined, null and object type references.</td></tr>
<tr><td><a href="../../wiki/extendify/">extendify</a></td><td>Create a function that will extend the context provided.</td></tr>
<tr><td><a href="../../wiki/events/">Events</a></td><td>Creates an object that facilitates full multicast event support.</td></tr>
</tbody>
</table>

**Unit Tests**

Click <a href="http://jameswestgate.github.com/extendify/test/" target="_blank">here</a> to execute the latest unit tests.
