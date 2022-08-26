/*
 * @Author: janejsong
 * @Date: 2022-08-26 11:28:47
 * @desc: vue事件总线
 */
class Bus {
    constructor() {
        this.callbacks = [];
    }
    $on(name, fn) {
        this.callbacks[name] = this.callbacks[name] || [];
        this.callbacks[name].push(fn);
    }
    $emit(name, args) {
        if(this.callbacks[name]) {
            this.callbacks[name].forEach(cb => cb(args))
        }
    }
}

// main.js
Vue.prototype.$bus = new Bus()
// 组件1
this.$bus.$on('add', handle)
// 组件2
this.$bus.$emit('add')