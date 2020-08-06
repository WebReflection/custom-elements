let legacy = !self.customElements;

// @webreflection/custom-elements-no-builtin/esm/index.js

else {
  try {
    const is = 'extends-li';
    customElements.define(is, HTMLLIElement, {'extends': 'li'});
    if (document.createElement('li', {is}).outerHTML.indexOf(is) < 0)
      legacy = !legacy;
  }
  catch (o_O) {
    legacy = !legacy;
  }
}

if (legacy) {
  // @webreflection/custom-elements-builtin/esm/index.js
}
