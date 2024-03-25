

/** 实现一个promise */


const STATUS = {
	/** 等待 */
	PENDING: 'pending',
	/** 已拒绝 */
	REJECTD: 'rejectd',
	/** 已成功 */
	FULFILLED: 'fulfilled',
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
		if (this.status === STATUS.FULFILLED) {
			onFulfilled(this.result);
		}

		if (this.status === STATUS.REJECTD) {
			onReject(this.reason);
		}

		if (this.status === STATUS.PENDING) {
			this.onFulfilledLists.push(() => {
				onFulfilled(this.result);
			})
			this.onRejectLists.push(() => {
				onReject(this.reason);
			})
		}
	}

}

module.exports = {
	MyPromise
};