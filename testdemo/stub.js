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
    function F() {
    }                 // Define a dummy constructor function.
    F.prototype = p;                  // Set its prototype property to p.
    return new f();                   // Use f() to create an "heir" of p.
};

// Reverse the order of the children of Node n
lion.reverse = function (node) {
    var f = document.createDocumentFragment();
    while (node.lastChild) {
        f.appendChild(node.lastChild)
    }
    node.appendChild(f)
};

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
};


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
};


// Convert element e to relative positioning and "shake" it left and right.
// The first argument can be an element object or the id of an element.
// If a function is passed as the second argument, it will be invoked
// with e as an argument when the animation is complete.
// The 3rd argument specifies how far to shake e. The default is 5 pixels.
// The 4th argument specifies how long to shake for. The default is 500 ms.
lion.shake = function (e, oncomplete, distance, time) {
    // Handle arguments
    if (typeof e === "string") e = document.getElementById(e);
    if (!time) time = 500;
    if (!distance) distance = 5;

    var originalStyle = e.style.cssText;      // Save the original style of e
    e.style.position = "relative";            // Make e relatively positioned
    var start = (new Date()).getTime();       // Note the animation start time
    animate();                                // Start the animation

    // This function checks the elapsed time and updates the position of e.
    // If the animation is complete, it restores e to its original state.
    // Otherwise, it updates e's position and schedules itself to run again.
    function animate() {
        var now = (new Date()).getTime();     // Get current time
        var elapsed = now - start;              // How long since we started
        var fraction = elapsed / time;          // What fraction of total time?

        if (fraction < 1) {     // If the animation is not yet complete
            // Compute the x position of e as a function of animation
            // completion fraction. We use a sinusoidal function, and multiply
            // the completion fraction by 4pi, so that it shakes back and
            // forth twice.
            var x = distance * Math.sin(fraction * 4 * Math.PI);
            e.style.left = x + "px";

            // Try to run again in 25ms or at the end of the total time.
            // We're aiming for a smooth 40 frames/second animation.
            setTimeout(animate, Math.min(25, time - elapsed));
        }
        else {                  // Otherwise, the animation is complete
            e.style.cssText = originalStyle;  // Restore the original style
            if (oncomplete) oncomplete(e);   // Invoke completion callback
        }
    }
};

// Fade e from fully opaque to fully transparent over time milliseconds.
// Assume that e is fully opaque when this function is invoked.
// oncomplete is an optional function that will be invoked with e as its
// argument when the animation is done. If time is omitted, use 500ms.
// This function does not work in IE, but could be modified to animate
// IE's nonstandard filter property in addition to opacity.
lion.fadeOut = function (e, oncomplete, time) {
    if (typeof e === "string") e = document.getElementById(e);
    if (!time) time = 500;

    // We use Math.sqrt as a simple "easing function" to make the animation
    // subtly nonlinear: it fades quickly at first and then slows down some.
    var ease = Math.sqrt;

    var start = (new Date()).getTime();    // Note the animation start time
    animate();                             // And start animating

    function animate() {
        var elapsed = (new Date()).getTime() - start; // elapsed time
        var fraction = elapsed / time;                // As a fraction of total
        if (fraction < 1) {     // If the animation is not yet complete
            var opacity = 1 - ease(fraction);  // Compute element opacity
            e.style.opacity = String(opacity); // Set it on e
            setTimeout(animate,                // Schedule another frame
                Math.min(25, time - elapsed));
        }
        else {                  // Otherwise, we're done
            e.style.opacity = "0";          // Make e fully transparent
            if (oncomplete) oncomplete(e);  // Invoke completion callback
        }
    }
};


// Scale the text size of element e by the specified factor
lion.scale = function (e, factor) {
    // Use the computed style to query the current size of the text
    var size = parseInt(window.getComputedStyle(e, "").fontSize);
    // And use the inline style to enlarge that size
    e.style.fontSize = factor * size + "px";
};

lion.scaleAll = function (factor) {
    factor = factor || 1;
    var list = document.querySelectorAll("*");
    var len=list.length;

    for (var i = 0; i < len; ++i) {
        lion.scale(list.item(i), factor);
    }
};

// Alter the background color of element e by the specified amount.
// Factors > 1 lighten the color and factors < 1 darken it.
lion.scaleColor = function (e, factor) {
    var color = window.getComputedStyle(e, "").backgroundColor;  // Query
    var components = color.match(/[\d\.]+/g);   // Parse r,g,b, and a components
    for (var i = 0; i < 3; i++) {                // Loop through r, g and b
        var x = Number(components[i]) * factor;         // Scale each one
        x = Math.round(Math.min(Math.max(x, 0), 255));  // Round and set bounds
        components[i] = String(x);
    }
    if (components.length == 3)  // A rgb() color
        e.style.backgroundColor = "rgb(" + components.join() + ")";
    else                         // A rgba() color
        e.style.backgroundColor = "rgba(" + components.join() + ")";
};





