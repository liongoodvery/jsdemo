var max = function () {
    var ret = Number.NEGATIVE_INFINITY;
    var len = arguments.length;
    for (var i = 0; i < len; ++i) {
        var v = arguments[i];
        ret = v > ret ? v : ret;
    }
    return ret
}

var f = function (x) {
    log(x);
    arguments[0] = "1";
    log(x);

}

var g = function (x) {
    log(arguments.callee)
    log(arguments.caller)
}

var factorial = function (x) {
    if (x <= 1) {
        return x;
    }

    return x * arguments.callee(x - 1)
}
var log = function (msg) {
    console.log(msg)
}