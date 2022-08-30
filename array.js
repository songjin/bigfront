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
// 实现Array.prototype.map 生成新的map
Array.prototype.myMap = function(cb, thisArgs) {
    const result = [];
    this.forEach((...args) => {
        const index = args[1];
        result[index] = cb.apply(thisArgs, args);
    });
    return result;
}

// 实现Array.prototype.filter
Array.prototype.myFilter = function (cb, thisArgs) {
    const result = [];
    this.forEach((...args) => {
        const item = args[0];
        if(cb.apply(thisArgs, args)) {
            result.push(item);
        }
    });
    return result;
}

// 实现Array.prototype.reduce  将array转换成value
Array.prototype.myReduce = function (callback, initialValue ) {
   // 判断当前传入的参数 如果不合法 throw new error
   const argumentsLen = arguments.length;
   if(argumentsLen === 1 && !this.length) {
        throw new Error();
   }
   // 根据是否传initialValue设置初始值和index
   let accumulator = argumentsLen === 1 ? this[0] : initialValue;
   let index = argumentsLen === 1 ? 1 : 0;
   // 执行回调返回值
   for(let i = index;i < this.length;i++) {
       accumulator = callback(accumulator, this[i], i ,this);
   }
   return accumulator;
}
  