/*
// First rule of Functional programming,
//  "LET THE FUNCTIONS DO THE WORK! NERD"
// Same applies to Objects
*/


function log(arg) {
    document.writeln(arg);
}

function identity(x) {
    return x;
}

//log(identity(5));

function add(first, second) {
    return first + second;
}
function sub(first, second) {
    return first - second;
}
function mul(first, second) {
    return first * second;
}

//log(add(3, 4));
//log(sub(3, 4));
//log(mul(3, 4));

function identityf(x) {
    return function () {
        return x;
    };
}
//let three = identityf(3);
//log(three());

function addf(x) {
    return function (y) {
        return x + y;
    };
}
//log(addf(3)(4));

function liftf(binary) {
    return function (x) {
        return function (y) {
            return binary(x, y);
        };
    };
}

// let jumla = liftf(add);
// log(jumla(3)(4));
// log(liftf(mul)(5)(6));

function curry(binary, x) {
    return function (y) {
        return binary(x, y); 
    };
}

// Alternative to first curry
// function curry(binary, x) {
//     return liftf(binary)(x);
// }

// let add3 = curry(add, 3);
// log(add3(4));
//log(curry(mul, 5)(6));

// let inc = addf(1);
// Alternative
// let inc = liftf(add)(1);
// Another Alternative
let inc = curry(add, 1);

// inc(5);
// log(inc(inc(5)));

function twice(binary) {
    return function (a) {
        return binary(a, a);
    };
}

// log(add(11, 11));
let doubo = twice(add);
// log(doubo(11));
let square = twice(mul);
// log(square(11));

function reverse(binary) {
    return function (a, b) {
        return binary (b, a);
    };
} 

let bus = reverse(sub);
// log(bus(3, 2));

function composeu(firstf, secondf) {
    return function (a) {
        return secondf(firstf(a));
    };
}

// log(composeu(doubo, square)(5));

function composeb(firstf, secondf) {
    return function (a, b, c) {
        return secondf(firstf(a, b), c);
    };
}

// log(composeb(add, mul)(2, 3, 7));

// A call limiter
function limit(binary, count) {
    return function (a, b) {
        if(count >= 1) {
            count -= 1;
            return binary(a, b);
        }
        return undefined;
    };
}

// let add_ltd = limit(add, 3);
// log(add_ltd(3, 4));
// log(add_ltd(3, 5));
// log(add_ltd(3, 6));
// log(add_ltd(3, 3));

// A number generator
function from(start) {
    return function () {
        let next = start;
        start += 1;
        return next;
    };
}

// let index = from(0);
// log(index());
// log(index());
// log(index());

// A limited number generator
function to(gen, end) {
    return function () {
        let value = gen();
        if(value < end){
            return value;
        }
        return undefined;
    };
}

// let index = to(from(0), 3);
// log(index());
// log(index());
// log(index());
// log(index());
// log(index());

function fromTo(start, end) {
    return function () {
        if(start < end) {
            let next = start;
            start += 1;
            return next;
        }
        return undefined;
    };
}

// Alternative of fromTo function
// function fromTo(start, end) {
//     return to( from(start), end );
// }

// let index = fromTo(0, 3);
// log(index());
// log(index());
// log(index());
// log(index());

// function element(list, gen) {
//     return function () {
//         let index = gen();
//         if(index !== undefined) {
//             return list[index];
//         }
//     };
// }

// A better version of 'element' that works without a generator
function element(array, gen) {
    if(gen === undefined) {
        gen = fromTo(0, array.length);
    }
    return function () {
        let index = gen();
        if(index !== undefined) {
            return array[index];
        }
    };
}

// let ele = element(['a', 'b', 'c', 'd']);
// log(ele());
// log(ele());
// log(ele());
// log(ele());
// log(ele());

// A number generator function that also stores the colletion the number
function collect(gen, array) {
    return function () {
        let value = gen();
        if(value !== undefined) {
            array.push(value);
        }
        return value;
    };
}

// let array = [],
//     col = collect(fromTo(0, 2), array);
// log(col());
// log(col());
// log(col());
// log(array);

// A generator that also filters and stores items
function filter(gen, predicate) {
    return function () {
        let value;
        do {
            value = gen();
        } while (
            value !== undefined && !predicate(value)
        );
        return value;
    };
}

// Alternative (Best solution)
// function filter(gen, predicate) {
//     return function recur() {
//         let value = gen();
//         if(
//             value === undefined || predicate(value)
//         ) { return value; }
//         return recur();
//     };
// }

// let fil = filter(fromTo(0, 5), function third(value) {
//     return (value % 3) === 0;
// });
// log(fil());
// log(fil());
// log(fil());

// A concatnator of two generators
function concat(gen1, gen2) {
    let gen = gen1;
    return function () {
        let value = gen();
        if(value !== undefined) {
            return value;
        }
        gen = gen2;
        return gen();
    };
}

// Advanced alternative to the concat
// function concat(...gens) {
//     let next = element(gens),
//         gen = next();
//     return function recur() {
//         let value = gen();
//         if(value === undefined) {
//             gen = next();
//             if(gen !== undefined) {
//                 return recur();
//             }
//         }
//         return value;
//     };
// }

// let con = concat(fromTo(0, 3), fromTo(0, 2));
// log(con());
// log(con());
// log(con());
// log(con());
// log(con());
// log(con());

// Generate unique symbols
// function gensymf(prefix) {
//     let number = 0;
//     return function () {
//         number += 1;
//         return prefix + number;
//     };
// }

// let geng = gensymf("G"),
//     genh = gensymf("H");
// log(geng());
// log(genh());
// log(geng());
// log(genh());

// Advanced alternative for gensymf
function gensymff(unary, seed) {
    return function (prefix) {
        let number = seed;
        return function () {
            number = unary(number);
            return prefix + number;
        };
    };
}

// let gensymf = gensymff(inc, 0),
//     geng = gensymf("G"),
//     genh = gensymf("H");
// log(geng());
// log(genh());
// log(geng());
// log(genh());

// Fibonacci seq.. generator that returns the next number
// function fibonaccif(x, y) {
//     let i = 0;
//     return function () {
//         let next;
//         switch(i) {
//             case 0:
//                 i = 1;
//                 return x;
//             case 1:
//                 i = 2;
//                 return y;
//             default:
//                 next = x + y;
//                 x = y;
//                 y = next;
//                 return next;
//         }
//     };
// }

// Alternative approach
// function fibonaccif(x, y) {
//     return function () {
//         let next = x;
//         x = y;
//         y += next;
//         return next;
//     };
// }

// Another alternative approach
// function fibonaccif(x, y) {
//     return concat(
//         concat(limit(identityf(x), 1), limit(identityf(y), 1)),
//         function fibonacci() {
//             let next = x + y;
//             x = y;
//             y = next;
//             return next;
//         }
//     );
// }

// Other alternative way
function fibonaccif(x, y) {
    return concat(
        element([x, y]),
        function fibonacci() {
            let next = x + y;
            x = y;
            y = next;
            return next;
        }
    );
}

// let fib = fibonaccif(0, 1);
// log(fib());
// log(fib());
// log(fib());
// log(fib());
// log(fib());
// log(fib());
// log(fib());

// add when up and subtract when down is called
function counter(value) {
    return {
        up: function () {
            value += 1;
            return value;
        },
        down: function () {
            value -= 1;
            return value;
        }
    };
}

// let object = counter(10),
//     up = object.up,
//     down = object.down;
// log(up());
// log(down());
// log(down());
// log(up());

// Allows and prevent function calls 
function revocable(binary) {
    return {
        invoke: function (first, second) {
            if(binary !== undefined) {
                return binary(first, second);
            }
        },
        revoke: function () {
            binary = undefined;
        }
    };
}

// let rev = revocable(add),
//     add_rev = rev.invoke;
// log(add_rev(3, 4));
// log(rev.revoke());
// log(add_rev(5, 7));

//
function m(value, source) {
    return {
        value: value,
        source: (typeof source === 'string')
            ? source
            : String(value)
    };
}

// log(JSON.stringify(m(1)));
// log(JSON.stringify(m(Math.PI, "pi")));

//
function addm(a, b) {
    return m(
        a.value + b.value,
        "(" + a.source + "+" +
              b.source + ")"
    );
}

// log(JSON.stringify(addm(m(3), m(4))));
// log(JSON.stringify(addm(m(1), m(Math.PI, "pi"))));

//
// function liftm(binary, op) {
//     return function (a, b) {
//         return m(
//             binary(a.value, b.value),
//             "(" + a.source + op
//                 + b.source + ")"
//         );
//     };
// }

// let addm = liftm(add, "+");
// log(JSON.stringify(addm(m(3), m(4))));
// log(JSON.stringify(liftm(mul, "*") (m(3), m(4))));

//
function liftm(binary, op) {
    return function (a, b) {
        if(typeof a === 'number') {
            a = m(a);
        }
        if(typeof b === 'number') {
            b = m(b);
        }
        return m(
            binary(a.value, b.value),
            "(" + a.source + op
                + b.source + ")"
        );
    };
}

// let addm = liftm(add, "+");
// log(JSON.stringify(addm(3, 4)));

//
// function exp(value) {
//     return (Array.isArray(value))
//         ? value[0] (
//             value[1],
//             value[2]
//         )
//         : value;
// }

// let sae = [mul, 5, 11];
// log(exp(sae));
// log(exp(42));

// Modification of exp function
function exp(value) {
    return (Array.isArray(value))
    ? value[0] (
        exp(value[1]),
        exp(value[2])
    )
    : value;
}
// recursion: a function calls itself

// let nae = [
//     Math.sqrt,
//     [
//         add,
//         [square, 3],
//         [square, 4]
//     ]
// ];
// log(exp(nae));

//
function addg(first) {
    function more(next) {
        if (next === undefined) {
            return first;
        }
        first += next;
        return more;
    }
    if (first !== undefined) {
        return more;
    }
}
// retursion: a function returns itself

// log(addg());
// log(addg(2)());
// log(addg(2)(7)());
// log(addg(3)(0)(4)());
// log(addg(1)(2)(4)(8)());

//
function liftg(binary) {
    return function (first) {
        if (first === undefined) {
            return first;
        }
        return function more(next) {
            if (next === undefined) {
                return first;
            }
            first = binary(first, next);
            return more;
        };
    };
}

// log(liftg(mul)());
// log(liftg(mul)(3)());
// log(liftg(mul)(3)(0)(4)());
// log(liftg(mul)(1)(2)(4)(8)());

//
// function arrayg(first) {
//     let array = [];
//     function more(next) {
//         if (next === undefined) {
//             return array;
//         }
//         array.push(next);
//         return more;
//     }
//     return more(first);
// }

// Alternative
function arrayg(first) {
    if (first === undefined) {
        return [];
    }
    return liftg(
        function (array, value) {
            array.push(value);
            return array;
        }
    )([first]);
}

// log(arrayg());
// log(arrayg(3)());
// log(arrayg(3)(4)(5)());

//
// function continuize(unary) {
//     return function (callback, arg) {
//         return callback(unary(arg));
//     };
// }

function continuize(any) {
    return function (callback, ...x) {
        return callback(any(...x));
    };
}

// sqrtc = continuize(Math.sqrt);
// log(sqrtc(alert, 81));

//
function constructor(init) {
    var that = other_constructor(init),
        member,
        method = function () {
            // init, member, method
        };
    that.method = method;
    return that;
}

// Revised version
// function constructor(spec) {
//     let {member} = spec;
//     const {other} = other_constructor(spec);
//     const method = function () {
//         // spec, member, other, method
//     };
//     return Object.freeze({
//         method,
//         other
//     });
// }

// Secured private array
// function vector() {
//     var array = []

//     return {
//         get: function get(i) {
//             return array[i];
//         },
//         store: function store(i, v) {
//             array[i] = v;
//         },
//         append: function append(v) {
//             array.push(v);
//         }
//     };
// }

// A more secured private array
function vector() {
    var array = []

    return {
        get: function (i) {
            return array[+i];
        },
        store: function store(i, v) {
            array[+i] = v;
        },
        append: function (v) {
            array[array.length] = v;
        }
    };
}

// Exploit for the vector function above
// var stash;
// myvector.store('push', function () {
//     stash = this;
// });
// myvector.append();

myvector = vector();
myvector.append(7);
myvector.store(1, 8);
// log(myvector.get(0));
// log(myvector.get(1));

// Send publication to subscribers
// function pubsub() {
//     var subscribers = [];
//     return {
//         subscribe: function (subscriber) {
//             subscribers.push(subscriber);
//         },
//         publish: function (publication) {
//             var i, length = subscribers.length;
//             for (i = 0; i < length; i += 1) {
//                 subscribers[i](publication);
//             }
//         }
//     };
// }

// A better and secured version
function pubsub() {
    var subscribers = [];
    return Object.freeze({
        subscribe: function (subscriber) {
            subscribers.push(subscriber);
        },
        publish: function (publication) {
            subscribers.forEach(function (s) {
                try {
                    s(publication);
                } catch (ignore) {}
            });
        }
    });
}

// Called immediately
// function pubsub() {
//     var subscribers = [];
//     return Object.freeze({
//         subscribe: function (subscriber) {
//             subscribers.push(subscriber);
//         },
//         publish: function (publication) {
//             subscribers.forEach(function (s) {
//                 setTimeout(function () {
//                     s(publication);
//                 }, 0);
//             });
//         }
//     });
// }

// Exploit for the pubsub function
// my_pubsub.subscribe();
// my_pubsub.subscribe(function () {
//     this.length = 0;
// });
// my_pubsub.subscribe(limit(function () {
//     my_pubsub.publish("Out of order");
// }, 1));

my_pubsub = pubsub();
my_pubsub.subscribe(log);
my_pubsub.publish("It works!");