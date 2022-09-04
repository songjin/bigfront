/*
 * @Author: janejsong
 * @Date: 2022-09-04 20:07:14
 * @desc: 数组去重
 */
let arr = [1, 1, "1", "1", true, true, "true", {}, {}, "{}", null, null, undefined, undefined];
// 利用set
function uniqueArray1(arr) {
    return Array.from(new Set(arr));
}
// 利用map
function uniqueArray2(arr) {
    const result = [];
    const map = new Map();
    for(let i = 0;i < arr.length; i++){
        if(!map.has(arr[i])) {
            map.set(arr[i], true);
            result.push(arr[i]);
        }
    }
    return result;
}

// 判断在新数组下标是否为-1
function uniqueArray3(arr) {
    const result = [];
    for(let i = 0;i < arr.length; i++){
        if(!result.includes(arr[i])){
            result.push(arr[i]);
        }
    }
    return result;
}