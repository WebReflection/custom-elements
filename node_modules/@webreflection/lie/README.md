# Lie

A badly implemented Promise

```js
import Lie from '@webreflection/lie';

const lie = new Lie(resolve => {
  // resolve only ...
}).then(() => {
  // ... and no catch method
});
```
