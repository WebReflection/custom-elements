let legacy = !self.customElements;

if (legacy) {
  // @webreflection/custom-elements-no-builtin/esm/index.js
}
else {
  try {
    customElements.define('p-constructor', document.createElement('p').constructor, {'extends': 'p'});
  }
  catch (o_O) {
    legacy = true;
  }
}

if (legacy) {
  // @webreflection/custom-elements-builtin/esm/index.js
}
