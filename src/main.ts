

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

  then() {

  }

  static all() {
    
  }

}