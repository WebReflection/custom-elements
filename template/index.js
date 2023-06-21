let legacy = !self.customElements;
// @webreflection/custom-elements-upgrade/esm/index.js
// @webreflection/custom-elements-no-builtin/esm/index.js
else {
  legacy = !self.customElements.get('extends-br');
  if (legacy) {
    try {
      function BR() { return self.Reflect.construct(HTMLBRElement, [], BR); }
      BR.prototype = HTMLLIElement.prototype;
      const is = 'extends-br';
      self.customElements.define('extends-br', BR, {'extends': 'br'});
      legacy = document.createElement('br', {is}).outerHTML.indexOf(is) < 0;
      // @webreflection/custom-elements-when-defined/esm/index.js
    }
    catch (o_O) {}
  }
}

if (legacy) {
  const customElements = self.customElements;
  // @webreflection/custom-elements-builtin/esm/index.js
}
