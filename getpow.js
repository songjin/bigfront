/*
 * @Author: songjin
 * @Date: 2022-08-17 12:27:43
 * @desc: 求一个数的立方根，不使用库函数,结果保留一位小数
 */

// 采用二分查找
function  getPow(num) {
    let sig = 1;// 符号位
    let l = 0;
    let r = Math.abs(num);
    let mid;
    if(num < 0) {
        sig = -1;
    }
    num = Math.abs(num);
    while(l < r) {
        mid = l + (r -l)/2;
        if(Math.abs(mid ** 3 - num) <= Number.EPSILON) {
            break;
        }
        if (mid ** 3 > num) {
            r = mid;
        }else {
            l = mid;
        }
    }
    return (sig * mid).toFixed(1);
}