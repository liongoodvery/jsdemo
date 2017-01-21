// ==UserScript==
// @name        lion
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  utils of javascript
// @author       lion.good.very.first@gmail.com
// @include       http://*
// @include     https://*
// @include     file://*
// @grant        none
// ==/UserScript==

var lion = lion || {};
lion.urlArgs = function () {
    var args = {};                             // Start with an empty object
    var query = location.search.substring(1);  // Get query string, minus '?'
    var pairs = query.split("&");              // Split at ampersands
    for (var i = 0; i < pairs.length; i++) {    // For each fragment
        var pos = pairs[i].indexOf('=');       // Look for "name=value"
        if (pos == -1) continue;               // If not found, skip it
        var name = pairs[i].substring(0, pos);  // Extract the name
        var value = pairs[i].substring(pos + 1); // Extract the value
        value = decodeURIComponent(value);     // Decode the value
        args[name] = value;                    // Store as a property
    }
    return args;                               // Return the parsed arguments
};

// inherit() returns a newly created object that inherits properties from the
// prototype object p.  It uses the ECMAScript 5 function Object.create() if
// it is defined, and otherwise falls back to an older technique.
lion.inherit = function (p) {
    if (p == null) throw TypeError(); // p must be a non-null object
    if (Object.create)                // If Object.create() is defined...
        return Object.create(p);      //    then just use it.
    var t = typeof p;                 // Otherwise do some more type checking
    if (t !== "object" && t !== "function") throw TypeError();
    function f() {
    };                  // Define a dummy constructor function.
    f.prototype = p;                  // Set its prototype property to p.
    return new f();                   // Use f() to create an "heir" of p.
}

// Reverse the order of the children of Node n
lion.reverse = function (node) {
    var f = document.createDocumentFragment();
    while (node.lastChild) {
        f.appendChild(node.lastChild)
    }
    node.appendChild(f)
}
