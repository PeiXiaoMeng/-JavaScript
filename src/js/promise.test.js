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
// new MyPromise((resolve, reject) => {
//     setTimeout(() => {
//         resolve('success2');
//     }, 2000)
// }).then(res => {
//     console.log(res);
//     return new MyPromise((resolve, reject) => {
//         setTimeout(() => {
//           resolve('success3');
//         }, 2000)
//     })
// }).then(res => {
//   console.log(res);
// })


// promise.all
let p1 = new MyPromise((resolve, reject) => {
  resolve('success')
})
let p2 = new MyPromise((resolve, reject) => {
  resolve('成功')
})
MyPromise.all([p1, p2]).then(res => {
  const [res1, res2] = res;
  console.log(res1 + '==>' + res2);
})
