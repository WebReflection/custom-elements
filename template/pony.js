export default self => {
  let legacy = !self.customElements;
  // @webreflection/custom-elements-upgrade/esm/index.js
  // @webreflection/custom-elements-no-builtin/esm/index.js
  else {
    try {
      function LI() { return self.Reflect.construct(HTMLLIElement, [], LI); }
      LI.prototype = HTMLLIElement.prototype;
      const is = 'extends-li';
      self.customElements.define('extends-li', LI, {'extends': 'li'});
      legacy = document.createElement('li', {is}).outerHTML.indexOf(is) < 0;
      // @webreflection/custom-elements-when-defined/esm/index.js
    }
    catch (o_O) {
      legacy = !legacy;
    }
  }

  if (legacy) {
    const customElements = self.customElements;
    // @webreflection/custom-elements-builtin/esm/index.js
  }
};
