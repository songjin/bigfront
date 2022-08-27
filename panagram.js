/*
 * @Author: janejsong
 * @Date: 2022-08-27 21:43:59
 * @desc: 检查一个字符串是否为Panagram 全字母字符串
 */

function checkPanagram(params) {
    const arr = new Array(26).fill(false);
    for(let i = 0;i<str.length;i++) {
        const tmp = str[i];
        let index;
        if(tmp >= 'A' && tmp <= 'Z') {
            index = tmp.charCodeAt(0) - 'A'.charCodeAt(0);
        } else if(tmp >= 'a' && tmp <= 'z') {
            index = tmp.charCodeAt(0) - 'a'.charCodeAt(0);
        } else continue;
        arr[index] = true;
    }
    return arr.every(item => item === true);
}
// const str = "The quick brown fox jumps over a lazy dog";
const str = 'The over a lazy dog';
console.log(checkPanagram(str));