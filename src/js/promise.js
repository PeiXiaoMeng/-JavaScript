

/** 实现一个promise */


const STATUS = {
	/** 等待 */
	PENDING: 'pending',
	/** 已拒绝 */
	REJECTD: 'rejected',
	/** 已成功 */
	FULFILLED: 'fulfilled',
};



const resolvePromise = (processPromise, x, resolve, reject) => {
    if (processPromise === x) {
    	return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }

    if ((typeof x === 'object' && x !== null) || typeof x === 'function')  { // object | function
    	let called = false; // 设置开关，仅执行一次即可
    	try {
    		const then = x.then;
    		if (typeof then === 'function') { // .then是function ==> Promise
    			then.call(x, (y) => {
    				if(called) return;
                    called = true;
    				resolvePromise(processPromise, y, resolve, reject)
    			}, (e) => {
    				reject(e)
    			})
    		} else {
    			resolve(x)
    		}
    	} catch (e) {
    		if(called) return;
            called = true;
            reject(e)
    	}
    } else { // number | string | undefined | boolean
    	resolve(x)
    }
}


class MyPromise {

	constructor(exector) {
		this.status = STATUS.PENDING;
		this.result = undefined;
		this.reason = undefined;
		this.onFulfilledLists = []; // 存储异步任务成功后的回掉事件
		this.onRejectLists = []; // 存储异步任务失败后的回掉事件

		const resolve = (res) => {
			if (this.status === STATUS.PENDING) {
				this.status = STATUS.FULFILLED;
				this.result = res;
				this.onFulfilledLists.forEach(fn => fn());
			}
		}

		const reject = (err) => {
			if (this.status === STATUS.PENDING) {
				this.status = STATUS.REJECTD;
				this.reason = err;
				this.onRejectLists.forEach(fn => fn());
			}
		} 

		try {
			exector(resolve, reject);
		} catch (err) {
			reject(err);
		}
	}

	then(onFulfilled, onReject) {
		const processPromise = new MyPromise((resolve, reject) => { // 保证.then的链式调用
			if (this.status === STATUS.FULFILLED) {
				setTimeout(() => {
					try {
						const strem$ = onFulfilled(this.result);
						resolvePromise(processPromise, strem$, resolve, reject);
					} catch (e) {
						reject(e);
					}
				}, 0)
			}

			if (this.status === STATUS.REJECTD) {
				setTimeout(() => {
					try {
						const strem$ = onReject(this.reason);
						resolvePromise(processPromise, strem$, resolve, reject);
					} catch (e) {
						reject(e);
					}
				}, 0)
			}

			if (this.status === STATUS.PENDING) {
				this.onFulfilledLists.push(() => {
					setTimeout(() => {
						try {
							const strem$ = onFulfilled(this.result);
							resolvePromise(processPromise, strem$, resolve, reject);
						} catch (e) {
							reject(e)
						}
					}, 0)
				})
				this.onRejectLists.push(() => {
					setTimeout(() => {
						try {
							const strem$ = onReject(this.reason);
							resolvePromise(processPromise, strem$, resolve, reject);
						} catch (e) {
							reject(e);
						}
					}, 0)
				})
			}
		})

		return processPromise;
	}

    static all(promises) {  
        return new MyPromise((resolve, reject) => {  
            let results = []; // 用于保存所有Promise的解析结果  
            let count = 0; // 计数器，用于跟踪已完成解析的Promise数量  
  
            promises.forEach((promise, index) => {  
                promise.then(  
                    value => {  
                        results[index] = value;  
                        count++;  
                        if (count === promises.length) {  
                            resolve(results); // 所有Promise都成功解析，返回结果数组  
                        }  
                    },  
                    reason => {  
                        reject(reason); // 如果有任何一个Promise被拒绝，则立即拒绝新Promise  
                    }  
                );  
            });  
        });  
    }
    
}

module.exports = MyPromise;


