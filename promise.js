/*
 * @Author: songjin
 * @Date: 2022-08-05 20:40:40
 * @desc: promise 相关实现
 */
// make your own promise
class Promise {
    // excutor
    constructor(executor) {
        this.state = "pending";

        this.handlers = []; // {resolver:, rejector:, chainedPromise:}
        this.finallyFuncs = [];

        const resolve = (value) => {
            if (this.state !== "pending") return;
            this.finallyFuncs.forEach(func => func());
            // call handlers that are already set at time of resolve (i.e. asynchronous)
            this.callResolvers(value);
        }
        const reject = (error) => {
            if (this.state !== "pending") return;
            this.finallyFuncs.forEach(func => func());
            this.callRejecters(error);
        }
        // run executor 
        if (executor) {
            try {
                executor(resolve, reject);
            } catch (err) {
                reject(err);
            }
        }
    }
    //
    callResolvers(value) {
        this.state = "fulfilled";
        this.result = value;
        this.handlers
            .forEach(({resolver, chainedPromise}) => {
                // each resolve callback executed in a separate turn of the event loop
                setTimeout(() => {
                    if (resolver) {
                        this.callbackExecutor(resolver, value, 
                                chainedPromise.callResolvers.bind(chainedPromise), chainedPromise.callRejecters.bind(chainedPromise));
                    } else {
                        chainedPromise.callResolvers(value); // pass thru to chain
                    }
                },0);
            });
    }
    //
    callRejecters(error) {
        this.state = "rejected";
        this.result = error;
        this.handlers
            .forEach(({rejecter, chainedPromise}) => {
                // each reject callback executed in a separate turn of the event loop
                setTimeout(() => {
                    if (rejecter) {
                        this.callbackExecutor(rejecter, error, 
                                chainedPromise.callResolvers.bind(chainedPromise), chainedPromise.callRejecters.bind(chainedPromise));
                    } else {
                        chainedPromise.callRejecters(error); // pass thru to chain
                    }
                },0);
            });
    }
    /**
     * Will create a new promise (for the microtask queue) and...
     *  - if this is pending it attaches handlers to this
     *  - if this is settled the new promise executes handler or passes thru
     */
    then(resolveFunc, rejectFunc) {
        if (this.state === "fulfilled") {
            // already settled (i.e. synchronous), just execute handler
            // in separate turn of event loop
            return new Promise((resolve,reject) => {
                if (resolveFunc) {
                    this.callbackExecutor(resolveFunc, this.result, resolve, reject);
                } else {
                    resolve(this.result); // pass thru
                }
            });
        } else if (this.state === "rejected") {
            return new Promise((resolve,reject) => {
                if (rejectFunc) {
                    this.callbackExecutor(rejectFunc, this.result, resolve, reject);
                } else {
                    reject(this.result); // pass thru
                }
            });
        } else if (this.state === "pending") {
            // else not yet settled (resolve/reject will invoke later)
            const handlerEntry = {
                resolver: resolveFunc,
                rejecter: rejectFunc,
                // chained promise with empty executor; will be resolved/rejected by parent promise
                chainedPromise: new Promise()
            };
            this.handlers.push(handlerEntry);
            return handlerEntry.chainedPromise;
        }
    }
    //
    catch(rejectFunc) {
        return this.then(null, rejectFunc);
    }
    //
    finally(finallyFunc) {
        if (this.state === "pending") {
            if (finallyFunc) this.finallyFuncs.push(finallyFunc);
        } else { // else already settled
            // TODO: handle try/catch and promise return
            if (finallyFunc) finallyFunc();
        }
        return this; // pass through
    }
    //
    callbackExecutor(callback, value, resolver, rejecter) {
        try {
            const result = callback(value); // chaining resolves/rejecters; use result for next call
            if (result && result.then) { // thenable
                // not clear if this a promise or just a thenable, so wrap in a promise
                result.then(resolver,rejecter);
            } else {
                resolver(result); // normal chaining of basic result (for both resolvers & rejecters)
            }
        } catch (err) {
            rejecter(err); // error is only passed to next level (not peer) (for both resolvers & rejecters)
        }
    }
}

// create your own promise
class MyPromise {
    constructor(executor) {
      this.state = 'pending';
      this.handlers = []
      try {
        executor(this._resolve.bind(this), this._reject.bind(this));
      } catch (err) {
        this._reject(err);
      }
    }
    
    then(onFulfilled, onRejected) {
      return new MyPromise((resolve, reject) => {
        this.handlers.push({
          fulfilled: (value) => {
            if (typeof onFulfilled !== 'function') {
              resolve(value);
              return;
            }
            try {
              resolve(onFulfilled(value));
            } catch (err) {
              reject(err);
            }
          },
          rejected: (error) => {
             if (typeof onRejected !== 'function') {
               reject(error);
               return;
             }
  
             try {
               resolve(onRejected(error));
             } catch (err) {
               reject(err);
             }
  
          } 
        });
  
        this._executeHandlers();
      });
    }
    
    _executeHandlers() {
      if (this.state === 'pending') return;
      for (const handler of this.handlers) {
        queueMicrotask(() => {
          handler[this.state](this.result);
        });
      }
      
      this.handlers = [];
    }
  
    _resolve(value) {
      if (this.state !== 'pending') return;
      if(value instanceof MyPromise) {
        
        value.then(this._resolve.bind(this), this._reject.bind(this));
        return;
      }
  
      this.state = 'fulfilled';
      this.result = value;
      this._executeHandlers();
    }
    
    _reject(error) {
      if (this.state !== 'pending') return;
      this.state = 'rejected';
      this.result = error;
      this._executeHandlers();
    }
  
    catch(onRejected) {
      return this.then(undefined, onRejected);
    }
    
    static resolve(value) {
      return new MyPromise((resolve) => {
        resolve(value);
      })
    }
    
    static reject(value) {
      return new MyPromise((resolve, reject) => {
        reject(value);
      })
    }
}

class MyPromise {
  constructor(fn){
    // 存储 reslove 回调函数列表
    this.callbacks = []
    const resolve = (value) => {
      this.data = value // 返回值给后面的 .then
      while(this.callbacks.length) {
        let cb = this.callbacks.shift()
        cb(value)
      }
    }
    fn(resolve)
  }
  then(onResolvedCallback) {
    return new MyPromise((resolve) => {
      this.callbacks.push(() => {
        const res = onResolvedCallback(this.data)
        if (res instanceof MyPromise) {
          res.then(resolve)
        } else {
          resolve(res)
        }
      })
    })
  }
}
// 这是测试案例
new MyPromise((resolve) => {
  setTimeout(() => {
    resolve(1)
  }, 1000)
}).then((res) => {
    console.log(res)
    return new MyPromise((resolve) => {
      setTimeout(() => {
        resolve(2)
      }, 1000)
    })
}).then(res =>{console.log(res)})

// 实现promise.all
function all(promises) {
    return new Promise((resolve, reject) => {
      const result = [];
      let pendingCount = promises.length;
      if(promises.length === 0) {
        resolve(result);
        return;
      }
      for(let i = 0;i < promises.length;i++) {
        Promise.resolve(promises[i]).then(res => {
          result[i] = res;
          pendingCount--;
          if(pendingCount === 0) {
            resolve(result);
          }
        }, err=> reject(err));
   
      }
    });
}

// 实现promise.allSettled
function allSettled(promises) {
    return new Promise((resolve) => {
      const result = [];
      let waitFor = promises.length;
      if (waitFor === 0) {
        resolve(result);
      }
      promises.forEach((promise, index) => {
        Promise.resolve(promise)
          .then((value) => result[index] = { status: "fulfilled", value })
          .catch((reason) => result[index] = { status: "rejected", reason })
          .finally(() => {
            waitFor--;
            if (waitFor === 0) {
              resolve(result);
            }
          });
      });
    });
}

// 实现promise.any

// 实现promise.race 
function race(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            Promise.resolve(promise).then(data => resolve(data),
            err => reject(err))
        })
    })
}