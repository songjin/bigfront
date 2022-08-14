/*
 * @Author: songjin
 * @Date: 2022-08-14 23:32:40
 * @desc: 实现instanceof 
 */
// instanceof 检测对象之间的关联性，左侧必须是引用类型，右侧是函数类型，返回true/false
function myInstanceOf(obj, target) {
    if(!obj || typeof obj !== 'object') {
        return false;
    }
    if(!target.prototype) {
        throw new Error;
    }
    if(Object.getPrototypeOf(obj) === target.prototype) {
        return true;
    }else {
        return myInstanceOf(Object.getPrototypeOf(obj), target);
    }
}
class A {}
class B extends A {}

const b = new B()
myInstanceOf(b, B) // true
myInstanceOf(b, A) // true
myInstanceOf(b, Object) // true

function C() {}
myInstanceOf(b, C) // false
C.prototype = B.prototype
myInstanceOf(b, C) // true
C.prototype = {}
myInstanceOf(b, C) // false