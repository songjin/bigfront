/*
 * @Author: songjin
 * @Date: 2022-08-05 11:41:43
 * @desc: 防抖节流
 */
// 防抖debouce: 事件在规定时间内回调函数只能执行一次，如果在规定时间内触发了该事件，则会重新开始算规定事件,将多次执行变为最后一次执行
// 节流throttle: 多次执行在规定时间内执行一次，在规定时间内触发该事件，则什么也不做，也不重置定时器，有节奏的执行

function throttle(func, wait) {
  let timer = null;
  let lastArgs = [];
  return function (...args) {
    if(!timer) {
        func.apply(this, args);
        timer = setTimeout(() => {
            if(lastArgs.length > 0) {
                func.apply(this, lastArgs);
            }
            timer = null;
            lastArgs = [];
        }, wait);
    } else {
        lastArgs = args;
    }
  }
}

function debounce(func, wait) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), wait);
    }
}