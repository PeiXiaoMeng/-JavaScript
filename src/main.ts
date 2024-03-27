

/**
 * promise ts 实现
 */


enum STATUS {
  /** 等待 */
  PENDING = 'pending',
  /** 已成功 */
  FULFILLED = 'fulfilled',
  /** 已拒绝 */
  REJECTED = 'rejected'
}

type Resolve<T> = (value?: T | PromiseLike<T>) => void;
type Reject = (reason?: any) => void;
type Executor<T> = (resolve?: Resolve<T>, reject?: Reject) => void;
type onFulfilled<T, TResult1> = ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null;
type onRejected<TResult2> = ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null;

const isFunction = (value: any): value is Function => typeof value === 'function';

/**
 * @param {promise} promise2 上一个promise.then返回新的 promise 对像
 * @param {[type]} x promise中的onFulfilled ｜ onRejected的返回值
 * @param {[type]} resolve resolve
 * @param {[type]} reject reject
 */
const resolvePromise = (
  promise2: MyPromise<T>,
  x: T | PromiseLike<T>,
  resolve?: Resolve<T>,
  reject?: Reject
): void => {
  if (promise2 === x) {
    return reject?.(new TypeError('Chaining cycle detected for promise'));
  }
  
  if (x instanceof MyPromise) {
    if (x.PromiseState === STATUS.PENDING) {
      x.then(y => {
        resolvePromise(promise2, y, resolve, reject)
      }, reject)
    }

    if (x.PromiseState === STATUS.FULFILLED) {
      resolve?.(x.PromiseResult);
    }

    if (x.PromiseState === STATUS.REJECTED) {
      reject?.(x.PromiseResult);
    }
  } else if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
    let then: PromiseLike<T>['then'];

    try {
      then = (x as PromiseLike<T>).then;
    } catch(e) {
      return reject?.(e);
    }

    if (typeof then === 'function') {
      let called: boolean = false;

      try {
        then.call(x, y => {
          if (called) {
            return;
          }

          called = true;
          resolvePromise(promise2, y, resolve, reject);
        }, r => {
          if (called) {
            return;
          }

          called = true;
          reject?.(r);
        })
      } catch(e) {
        if (called) {
          return;
        }

        called = true;
        reject?.(e);
      }
    } else {
      resolve?.(x);
    }
  } else {
    resolve?.(x);
  }
}


class MyPromise<T> {

  public PromiseResult!: T;
  public PromiseState!: STATUS;
  private onFulfilledCallbacks: Resolve<T>[] = [];
  private onRejectedCallbacks: Reject[] = [];

  constructor(executor: Executor<T>) {

    this.PromiseState = STATUS.PENDING;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject(e)
    }

  }

  private resolve: Resolve<T> = result => {
    if (this.PromiseState === STATUS.PENDING) {
      setTimeout(() => {
        this.PromiseState = STATUS.FULFILLED;
        this.PromiseResult = result as T;
        this.onFulfilledCallbacks.forEach(callback => callback(result));
      });
    }
  }

  private reject: Reject = reason => {
    if (this.PromiseState === STATUS.PENDING) {
      setTimeout(() => {
        this.PromiseState = STATUS.REJECTED;
        this.PromiseResult = reason;
        this.onRejectedCallbacks.forEach(callback => callback(reason));
      })
    }
  }

  public then = <TResult1 = T, TResult2 = never>(
    onFulfilled?: onFulfilled<T, TResult1>,
    onRejected?: onRejected<TResult2>
  ): MyPromise<TResult1 | TResult2> => {

    onFulfilled = isFunction(onFulfilled) ?
      onFulfilled :
      value => {
        return value as any;
      };
    
    onRejected = isFunction(onRejected) ?
      onRejected :
      reason => {
        throw reason;
      };

    const promise2 = new MyPromise<TResult1 | TResult2>((resolve, reject) => {
      if (this.PromiseState === STATUS.FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled?.(this.PromiseResult)!;
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject?.(e);
          }
        })
      }

      if (this.PromiseState === STATUS.REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected?.(this.PromiseResult)!;
            resolvePromise(promise2, x, resolve, reject);
          } catch(e) {
            reject?.(e);
          }
        })
      }

      if (this.PromiseState === STATUS.PENDING) {
        this.onFulfilledCallbacks.push(() => {
          try {
            const x = onFulfilled?.(this.PromiseResult)!;
            resolvePromise(promise2, x, resolve, reject);
          } catch(e) {
            reject?.(e)
          }
        })

        this.onRejectedCallbacks.push(() => {
          try {
            const x = onRejected?.(this.PromiseResult)!;
            resolvePromise(promise2, x, resolve, reject);
          } catch(e) {
            reject?.(e)
          }
        })
      }
    })

    return promise2;
  }

  static all() {
    
  }

}