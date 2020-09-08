let legacy = !self.customElements;
// @webreflection/custom-elements-no-builtin/esm/index.js
else {
  try {
    function LI() { return self.Reflect.construct(HTMLLIElement, [], LI); }
    LI.prototype = HTMLLIElement.prototype;
    const is = 'extends-li';
    self.customElements.define('extends-li', LI, {'extends': 'li'});
    legacy = document.createElement('li', {is}).outerHTML.indexOf(is) < 0;
    const {get, whenDefined} = self.customElements;
    defineProperty(self.customElements, 'whenDefined', {
      configurable: true,
      value(is) {
        return whenDefined.call(this, is).then(value => value || get.call(this, is))
      }
    });
  }
  catch (o_O) {
    legacy = !legacy;
  }
}

if (legacy) {
  const customElements = self.customElements;
  // @webreflection/custom-elements-builtin/esm/index.js
}
