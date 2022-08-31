/*
 * @Author: janejsong
 * @Date: 2022-08-31 10:59:40
 * @desc: 并发请求控制
 */

// 批量请求数据，所有url地址在urls参数中，通过max参数控制并发数，所有请求结束后，执行callback中
// 回调函数
const sendRequest = function(urls, max, callback) {
    const len = urls.length;
    let idx = 0;
    let counter = 0; // 计数器
    function _request() {
        // 有请求，有通道
        while(idx < len && max > 0) {
            max--; // 占用通道
            fetch(urls[idx++]).finally(() => {
                max++; // 释放通道
                counter++; 
                if(counter === len) {
                    callback();
                }else {
                    _request();
                }
            })
        }
    }
    _request();
}

var urls = new Array(24).fill(true).map((x, i) => `https://github.com/hstarorg/HstarDoc/issues/${i + 1}`);

sendRequest(urls, 5, function() {
  console.log('done');
});

// 实现并发请求控制队列,最多同时执行的任务数为10，添加到任务队列后，自动开始执行
function createTask(i) {
    return () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(i);
            }, 2000);
        });
    }
}
class TaskQueue {
    constructor() {
        this.max = 10;
        this.taskList = [];
        setTimeout(()=>{
            this.run();
        });
    }
    addTask(task) {
        this.taskList.push(task);
    }
    run() {
        if(!this.taskList.length){
            return;
        }
        const min = Math.min(this.taskList.length, this.max);
        for(let i = 0;i < min;i++) {
            this.max--;
            const task = this.taskList.shift();
            task().then((res) => {
                console.log('===res==',res);
            }).catch((err) => {
                console.log('====err===',err);
            }).finally(() => {
                this.max++;
                this.run();
            })
        }
    }
}
const taskQueue = new TaskQueue();
for(let i = 0;i < 32;i++) {
    const task = createTask(i);
    taskQueue.addTask(task);
}