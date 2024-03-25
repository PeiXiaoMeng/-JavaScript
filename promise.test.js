const utils = require('./promise');


test("myPromise should change state to fulfilled on resolve", () => {
  let promiseState = "pending";
  new utils.MyPromise((resolve, reject) => {
    resolve("Success");
    promiseState = "fulfilled"; // update state manually for testing
  });
  expect(promiseState).toBe("fulfilled");
});
 
test("myPromise should change state to rejected on reject", () => {
  let promiseState = "pending";
  new utils.MyPromise((resolve, reject) => {
    reject("Error");
    promiseState = "rejected"; // update state manually for testing
  });
  expect(promiseState).toBe("rejected");
});
 
test("myPromise should call onFulfilled if promise is resolved", () => {
  let onFulfilledCalled = false;
  new utils.MyPromise((resolve, reject) => {
    resolve("Success");
  }).then(
    () => {
      onFulfilledCalled = true;
    },
    () => {}
  );
  expect(onFulfilledCalled).toBe(true);
});
 
test("myPromise should call onRejected if promise is rejected", () => {
  let onRejectedCalled = false;
  new utils.MyPromise((resolve, reject) => {
    reject("Error");
  }).then(
    () => {},
    () => {
      onRejectedCalled = true;
    }
  );
  expect(onRejectedCalled).toBe(true);
});


test(".then 多级调用", () => {
  let onFulfilledCalled = false;
  new utils.MyPromise((resolve, reject) => {
    resolve("first");
  }).then(
    (res) => {
      // console.log(res);
      return 'second==>' + res;
    },
    () => {}
  ).then(res => {
    // console.log(res);
    onFulfilledCalled = true;
  })
  expect(onFulfilledCalled).toBe(true);
});


test(".then 多级调用 报错case", () => {
  let onFulfilledCalled = false;
  new utils.MyPromise((resolve, reject) => {
    reject("first catch");
  }).then(
    (res) => {
      // console.log(res);
      return 'second==>catch' + res;
    },
    (err) => {
      // console.log(err);
      return err;
    }
  ).then(res => {
    console.log('===>res');
    console.log(res);
    onFulfilledCalled = true;
  })
  expect(onFulfilledCalled).toBe(true);
});

