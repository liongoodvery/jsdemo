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

// This module defines Element.insertAdjacentHTML for browsers that don't
// support it, and also defines portable HTML insertion functions that have
// more logical names than insertAdjacentHTML:
//     Insert.before(), Insert.after(), Insert.atStart(), Insert.atEnd()
lion.insert = (function () {
    // If elements have a native insertAdjacentHTML, use it in four HTML
    // insertion functions with more sensible names.
    if (document.createElement("div").insertAdjacentHTML) {
        return {
            before: function (e, h) {
                e.insertAdjacentHTML("beforebegin", h);
            },
            after: function (e, h) {
                e.insertAdjacentHTML("afterend", h);
            },
            atStart: function (e, h) {
                e.insertAdjacentHTML("afterbegin", h);
            },
            atEnd: function (e, h) {
                e.insertAdjacentHTML("beforeend", h);
            }
        };
    }

    // Otherwise, we have no native insertAdjacentHTML. Implement the same
    // four insertion functions and then use them to define insertAdjacentHTML.

    // First, define a utility method that takes a string of HTML and returns
    // a DocumentFragment containing the parsed representation of that HTML.
    function fragment(html) {
        var elt = document.createElement("div");      // Create empty element
        var frag = document.createDocumentFragment(); // Create empty fragment
        elt.innerHTML = html;                         // Set element content
        while (elt.firstChild)                         // Move all nodes
            frag.appendChild(elt.firstChild);         //    from elt to frag
        return frag;                                  // And return the frag
    }

    var Insert = {
        before: function (elt, html) {
            elt.parentNode.insertBefore(fragment(html), elt);
        },
        after: function (elt, html) {
            elt.parentNode.insertBefore(fragment(html), elt.nextSibling);
        },
        atStart: function (elt, html) {
            elt.insertBefore(fragment(html), elt.firstChild);
        },
        atEnd: function (elt, html) {
            elt.appendChild(fragment(html));
        }
    };

    // Now implement insertAdjacentHTML based on the functions above
    Element.prototype.insertAdjacentHTML = function (pos, html) {
        switch (pos.toLowerCase()) {
            case "beforebegin":
                return Insert.before(this, html);
            case "afterend":
                return Insert.after(this, html);
            case "afterbegin":
                return Insert.atStart(this, html);
            case "beforeend":
                return Insert.atEnd(this, html);
        }
    };
    return Insert;  // Finally return the four insertion function
}());

// Return the current scrollbar offsets as the x and y properties of an object
lion.getScrollOffsets = function (w) {
    // Use the specified window or the current window if no argument
    w = w || window;

    // This works for all browsers except IE versions 8 and before
    if (w.pageXOffset != null) return {x: w.pageXOffset, y: w.pageYOffset};

    // For IE (or any browser) in Standards mode
    var d = w.document;
    if (document.compatMode == "CSS1Compat")
        return {x: d.documentElement.scrollLeft, y: d.documentElement.scrollTop};

    // For browsers in Quirks mode
    return {x: d.body.scrollLeft, y: d.body.scrollTop};
}


// Return the viewport size as w and h properties of an object
lion.getViewportSize = function (w) {
    // Use the specified window or the current window if no argument
    w = w || window;

    // This works for all browsers except IE8 and before
    if (w.innerWidth != null) return {w: w.innerWidth, h: w.innerHeight};

    // For IE (or any browser) in Standards mode
    var d = w.document;
    if (document.compatMode == "CSS1Compat")        return {
        w: d.documentElement.clientWidth,
        h: d.documentElement.clientHeight
    };

    // For browsers in Quirks mode
    return {w: d.body.clientWidth, h: d.body.clientWidth};
}




