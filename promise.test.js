const MyPromise = require('./promise');


// test
// new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//       resolve('success');
//     }, 2000)
// }).then(res => {
//     console.log(res);
// })


// promise .then 返回promise
new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve('success2');
    }, 2000)
}).then(res => {
    console.log(res);
    return new MyPromise((resolve, reject) => {
        setTimeout(() => {
          resolve('success3');
        }, 2000)
    })
}).then(res => {
  console.log(res);
})