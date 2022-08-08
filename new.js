/*
 * @Author: songjin
 * @Date: 2022-08-05 11:41:43
 * @desc: 实现JS中new操作符
 */
const myNew = (constructor, ...args) => {
    // 1. Create new object
    // 2. That new object will need prototype of constructor so we can use setPrototypeOf for that
    // 3. Call constructor function with specified arguments and with 'this' bound to newsly created object to set up 'this' in constructor
    // 4. It's unusual but sometimes function constructor may return another object, so we check if it returns an object and if it is
    // then we want to return it, null is an object so we check for that
    const obj = {};
    Object.setPrototypeOf(obj, constructor.prototype);
    const returned = constructor.apply(obj, args);
    if(returned && typeof returned === 'object'){
        return returned;
    }
    return obj;
}
// 实现call
// 实现apply