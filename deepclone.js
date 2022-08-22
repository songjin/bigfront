/*
 * @Author: songjin
 * @Date: 2022-08-09 17:02:30
 * @desc: 深拷贝
 */
const deepCopy = (obj, hash = new WeakMap()) => {
    if (obj instanceof Date) {
      return new Date(obj);
    }
    if (obj instanceof RegExp) {
      return new RegExp(obj);
    }
    if (hash.has(obj)) {
      return hash.get(obj);
    }
    let allDesc = Object.getOwnPropertyDescriptors(obj);
    let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);
    hash.set(obj, cloneObj);
    for (let key of Reflect.ownKeys(obj)) {
      if (obj[key] && typeof obj[key] === "object") {
        cloneObj[key] = deepCopy(obj[key], hash);
      } else {
        cloneObj[key] = obj[key];
      }
    }
    return cloneObj;
  };