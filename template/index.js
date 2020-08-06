let {customElements} = self;

if (!customElements) {
  // @webreflection/custom-elements-no-builtin/esm/index.js
}
else {
  try {
    customElements.define('built-in', document.createElement('p').constructor, {'extends': 'p'});
  }
  catch (o_O) {
    customElements = null;
  }
}

if (!customElements) {
  // @webreflection/custom-elements-builtin/esm/index.js
}
