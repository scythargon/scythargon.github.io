HTML5 Sortable jQuery Plugin
============================

This is a fork of the original html5sortable project with [various patches added from the community](#differences-from-the-original-version).

#Features
--------
* Less than 1KB (minified and gzipped).
* Built using native HTML5 drag and drop API.
* Supports both list and grid style layouts.
* Similar API and behaviour to jquery-ui sortable plugin.
* Works in IE 5.5+, Firefox 3.5+, Chrome 3+, Safari 3+ and, Opera 12+.
* Comes with an AngularJS directive.

#Installation
---

* The recommended way, using [Bower](http://bower.io):

``` 
bower install html.sortable 
```
* The non-Bower way: include ```html.sortable.x.y.z.js``` or the minified version, ```html.sortable.min.x.y.z.js```.


#Examples
---

* [Examples](http://htmlpreview.github.io/?https://github.com/voidberg/html5sortable/blob/master/examples/examples.html)
* [AngularJS with a single list](http://htmlpreview.github.io/?https://github.com/voidberg/html5sortable/blob/master/examples/angular-single.html)
* [AngularJS with connected lists](http://htmlpreview.github.io/?https://github.com/voidberg/html5sortable/blob/master/examples/angular-connected.html)


#Build it / Hack it
---

```
npm install -g grunt
npm install -g grunt-cli
git clone https://github.com/voidberg/html5sortable
cd html5sortable
npm install
grunt
```

#Usage
---

Use `sortable` method to create a sortable list:

``` javascript
$('.sortable').sortable();
```
Use `.sortable-dragging` and `.sortable-placeholder` CSS selectors to change the styles of a dragging item and its placeholder respectively.

Use `sortupdate` event if you want to do something when the order changes (e.g. storing the new order):

``` javascript
$('.sortable').sortable().bind('sortupdate', function(e, ui) {
    /*

    This event is triggered when the user stopped sorting and the DOM position has changed.

    ui.item contains the current dragged element.
    ui.item.index() contains the new index of the dragged element
    ui.oldindex contains the old index of the dragged element
    ui.startparent contains the element that the dragged item comes from
    ui.endparent contains the element that the dragged item was added to

    */
});
```

Use `items` option to specifiy which items inside the element should be sortable:

``` javascript
$('.sortable').sortable({
    items: ':not(.disabled)'
});
```
Use `handle` option to restrict drag start to the specified element:

``` javascript
$('.sortable').sortable({
    handle: 'h2'
});
```
Setting `forcePlaceholderSize` option to true, forces the placeholder to have a height:

``` javascript
$('.sortable').sortable({
    forcePlaceholderSize: true
});
```

Use `connectWith` option to create connected lists:

``` javascript
$('#sortable1, #sortable2').sortable({
    connectWith: '.connected'
});
```

Use `placeholder` option to specify the markup of the placeholder:

``` javascript
$('.sortable').sortable({
	items: 'tr' ,
	placeholder : '<tr><td colspan="7">&nbsp;</td></tr>'
});
```

To remove the sortable functionality completely:

``` javascript
$('.sortable').sortable('destroy');
```

To disable the sortable temporarily:

``` javascript
$('.sortable').sortable('disable');
```

To enable a disabled sortable:

``` javascript
$('.sortable').sortable('enable');
```

To reload a sortable:

``` javascript
$('.sortable').sortable('reload');
```

The API is compatible with jquery-ui. So you can use jquery-ui as a polyfill in older browsers:

``` javascript
yepnope({
    test: Modernizr.draganddrop,
    yep: 'jquery.sortable.js',
    nope: 'jquery-ui.min.js',
    complete: function() {
        $('.sortable').sortable().bind('sortupdate', function(e, ui) {
            //Store the new order.
        }
    }
});
```

#Differences from the original version
---

* [Add reload method](https://github.com/farhadi/html5sortable/pull/61)
* [Custom markup for placeholder](https://github.com/farhadi/html5sortable/pull/33)
* [Add oldindex property to sortupdate event data](https://github.com/farhadi/html5sortable/pull/27)
* [Support list items of variable height](https://github.com/farhadi/html5sortable/pull/56)
* [Improved handling of handles such that sub elements can be interacted with](https://github.com/farhadi/html5sortable/pull/67)
* [Fix false negative bug when dropping onto same index in new container.](https://github.com/farhadi/html5sortable/pull/66)
* AngularJS directive.
* Fix for reload method causing options to be reset to defaults.


#Authors
---

Original code by Ali Farhadi. This version is mantained by [Alexandru Badiu](http://ctrlz.ro).

#Contributors
---

See AUTHORS file.

#License
---
Released under the MIT license.
