/*
 * @Author: songjin
 * @Date: 2022-08-14 22:33:20
 * @desc: 遍历dom节点,返回唯一的数组
 */
function getTags(tree) {
    const arr = new Set();
    const visited = [tree];
    while(visited.length) {
        const tmp = visited.shift();
        arr.add(tmp.tagName.toLowerCase());
        visited.push(...tmp.children);
    }
    return [...arr];
}

