/*
 * @Author: songjin
 * @Date: 2022-08-11 12:06:03
 * @desc: 实现函数柯里化
 */

function curry(fn) {
    return function curriedFunc(...args) {
        if(args.length >= fn.length) {
            return fn(...args);
        }else {
            return (...args2) => curriedFunc(...args, ...args2);
        }
    }
}

const join = (a, b, c) => {
    return `${a}_${b}_${c}`;
}
const curriedJoin = curry(join);
console.log(curriedJoin(1,2,3));
console.log(curriedJoin(1)(2,3));
console.log(curriedJoin(1,2)(3));