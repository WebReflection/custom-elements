'use strict';
module.exports = typeof Promise === 'function' ? Promise : function (fn) {
  let queue = [], resolved = 0, value;
  fn($ => {
    value = $;
    resolved = 1;
    queue.splice(0).forEach(then);
  });
  return {then};
  function then(fn) {
    return (resolved ? setTimeout(fn, 0, value) : queue.push(fn)), this;
  }
};
