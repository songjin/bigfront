/*
 * @Author: songjin
 * @Date: 2022-08-05 11:41:43
 * @desc: 实现JS中array相关的操作
 */

// 实现Array.prototype.flat
function flat(arr, depth = 1) {
    const result = [];
    for(let i = 0;i < arr.length;i++) {
        if(Array.isArray(arr[i]) && depth > 0) {
            result.push(...flat(arr[i], depth-1));
        }else {
            result.push(arr[i])
        }
    }
    return result;
}
// 实现Array.prototype.map
Array.prototype.myMap = function(cb, thisArgs) {
    const result = [];
    this.forEach((...args) => {
        const index = args[1];
        result[index] = cb.apply(thisArgs, args);
    });
    return result;
}