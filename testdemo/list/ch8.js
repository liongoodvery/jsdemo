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

//将原始数组的length元素复制至目标数组
//开始复制原始数组的from_start元素
//并且将其复制至目标数组的to_start中
//要记住实参的顺序并不容易
function arraycopy(/*array*/from, /*index*/from_start, /*array*/to, /*index*/to_start,
                   /*integer*/length) {
//逻辑代码
}
//这个版本的实现效率稍微有些低，但你不必再去记住实参的顺序
//并且from_start和to_start都默认为0
function easycopy(args) {
    arraycopy(args.from,
        args.from_start || 0,//注意这里设置了默认值
        args.to,
        args.to_start || 0, args.length);
}
//来看如何调用easycopy()
// var a = [1, 2, 3, 4], b = [];
// easycopy({from: a, to: b, length: 4});


// We define some simple functions here
function add(x, y) {
    return x + y;
}
function subtract(x, y) {
    return x - y;
}
function multiply(x, y) {
    return x * y;
}
function divide(x, y) {
    return x / y;
}

// Here's a function that takes one of the above functions
// as an argument and invokes it on two operands
function operate(operator, operand1, operand2) {
    return operator(operand1, operand2);
}

// We could invoke this function like this to compute the value (2+3) + (4*5):
var i = operate(add, operate(add, 2, 3), operate(multiply, 4, 5));

// For the sake of the example, we implement the simple functions again,
// this time using function literals within an object literal;
var operators = {
    add: function (x, y) {
        return x + y;
    },
    subtract: function (x, y) {
        return x - y;
    },
    multiply: function (x, y) {
        return x * y;
    },
    divide: function (x, y) {
        return x / y;
    },
    pow: Math.pow  // Works for predefined functions too
};

// This function takes the name of an operator, looks up that operator
// in the object, and then invokes it on the supplied operands. Note
// the syntax used to invoke the operator function.
function operate2(operation, operand1, operand2) {
    if (typeof operators[operation] === "function")
        return operators[operation](operand1, operand2);
    else throw "unknown operator";
}

// Compute the value ("hello" + " " + "world") like this:
// var j = operate2("add", "hello", operate2("add", " ", "world"));
// Using the predefined Math.pow() function:
// var k = operate2("pow", 10, 2);
