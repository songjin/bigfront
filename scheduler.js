/*
 * @Author: songjin
 * @Date: 2022-08-05 20:16:27
 * @desc: JS 实现一个带并发限制的异度调度器 Scheduler，保证同时运行的任务最多有两个。完善下面代码中的 Scheduler 类，使得以下程序能正确输出。
 */
class Scheduler {
    add(promiseMaker) {}
}
  
const timeout = (time) => new Promise((resolve) => {
    setTimeout(resolve, time);
});
  
const scheduler = new Scheduler();
const addTask = (time, order) => {
    scheduler.add(() => timeout(time).then(() => console.log(order)));
};
  
addTask(1000, "1");
addTask(500, "2");
addTask(300, "3");
addTask(400, "4");
  // output：2 3 1 4
  // 一开始，1，2两个任务进入队列。
  // 500ms 时，2完成，输出2，任务3入队。
  // 800ms 时，3完成，输出3，任务4入队。
  // 1000ms 时，1完成，输出1。

// 实现如下
class Scheduler {
    constructor() {
        this.maxCount = 2;
        this.waitQueue = [];
        this.excutingQueue = [];
    }
    add(promiseMaker) {
        if(this.excutingQueue.length < this.maxCount) {
            this.run(promiseMaker);
        } else {
            this.waitQueue.push(promiseMaker);
        }
    }
    run(promiseMaker) {
        this.excutingQueue.push(promiseMaker);
        const index = this.excutingQueue.length - 1;
        promiseMaker().then(() => {
            this.excutingQueue.splice(index, 1);
            if(this.waitQueue.length > 0) {
                this.run(this.waitQueue.shift());
            }
        })
    }
}