/*! (c) Andrea Giammarchi @webreflection ISC */

import Lie from '@webreflection/lie';
import attributesObserver from '@webreflection/custom-elements-attributes';
import qsaObserver from 'qsa-observer';
const {
  document,
  Map, MutationObserver, Object, Set, WeakMap,
  Element, HTMLElement, Node,
  Error, TypeError
} = self;
const Promise = self.Promise || Lie;
export default self => {
  let legacy = !self.customElements;
  
if (legacy) {
  
  
  const {createElement} = document;
  const {defineProperty, setPrototypeOf} = Object;
  const classes = new Map;
  const defined = new Map;
  const prototypes = new Map;
  const registry = new Map;
  const query = [];
  const handle = (element, connected, selector) => {
    const proto = prototypes.get(selector);
    if (connected && !proto.isPrototypeOf(element)) {
      override = setPrototypeOf(element, proto);
      try { new proto.constructor; }
      finally { override = null; }
    }
    const method = `${connected ? '' : 'dis'}connectedCallback`;
    if (method in proto)
      element[method]();
  };
  const {parse} = qsaObserver({query, handle});
  let override = null;
  const whenDefined = name => {
    if (!defined.has(name)) {
      let _, $ = new Lie($ => { _ = $; });
      defined.set(name, {$, _});
    }
    return defined.get(name).$;
  };
  const augment = attributesObserver(whenDefined, MutationObserver);
  defineProperty(self, 'customElements', {
    configurable: true,
    value: {
      define: (is, Class) => {
        if (registry.has(is))
          throw new Error(`the name "${is}" has already been used with this registry`);
        classes.set(Class, is);
        prototypes.set(is, Class.prototype);
        registry.set(is, Class);
        query.push(is);
        whenDefined(is).then(() => {
          parse(document.querySelectorAll(is));
        });
        defined.get(is)._();
      },
      get: selector => registry.get(selector),
      whenDefined
    }
  });
  (HTMLBuiltIn.prototype = HTMLElement.prototype).constructor = HTMLBuiltIn;
  defineProperty(self, 'HTMLElement', {
    configurable: true,
    value: HTMLBuiltIn
  });
  defineProperty(document, 'createElement', {
    configurable: true,
    value(name, options) {
      const is = options && options.is;
      return is ? new (registry.get(is)) : createElement.call(document, name);
    }
  });
  // in case ShadowDOM is used through a polyfill, to avoid issues
  // with builtin extends within shadow roots
  if (!('isConnected' in Node.prototype))
    defineProperty(Node.prototype, 'isConnected', {
      configurable: true,
      get() {
        return !(
          this.ownerDocument.compareDocumentPosition(this) &
          this.DOCUMENT_POSITION_DISCONNECTED
        );
      }
    });
  function HTMLBuiltIn() {
    const {constructor} = this;
    if (!classes.has(constructor))
      throw new TypeError('Illegal constructor');
    const is = classes.get(constructor);
    if (override)
      return augment(override, is);
    const element = createElement.call(document, is);
    return augment(setPrototypeOf(element, constructor.prototype), is);
  }
}
  else {
    try {
      function LI() { return self.Reflect.construct(HTMLLIElement, [], LI); }
      LI.prototype = HTMLLIElement.prototype;
      const is = 'extends-li';
      self.customElements.define('extends-li', LI, {'extends': 'li'});
      legacy = document.createElement('li', {is}).outerHTML.indexOf(is) < 0;
    }
    catch (o_O) {
      legacy = !legacy;
    }
  }
  if (legacy) {
    const customElements = self.customElements;
    
const {attachShadow} = Element.prototype;
const {createElement} = document;
const {define, get} = customElements;
const {defineProperty, getOwnPropertyNames, setPrototypeOf} = Object;
const shadowRoots = new WeakMap;
const shadows = new Set;
const classes = new Map;
const defined = new Map;
const prototypes = new Map;
const registry = new Map;
const shadowed = [];
const query = [];
const getCE = name => registry.get(name) || get.call(customElements, name);
const handle = (element, connected, selector) => {
  const proto = prototypes.get(selector);
  if (connected && !proto.isPrototypeOf(element)) {
    override = setPrototypeOf(element, proto);
    try { new proto.constructor; }
    finally { override = null; }
  }
  const method = `${connected ? '' : 'dis'}connectedCallback`;
  if (method in proto)
    element[method]();
};
const {parse} = qsaObserver({query, handle});
const {parse: parseShadowed} = qsaObserver({
  query: shadowed,
  handle(element, connected) {
    if (shadowRoots.has(element)) {
      if (connected)
        shadows.add(element);
      else
        shadows.delete(element);
      parseShadow.call(query, element);
    }
  }
});
const whenDefined = name => {
  if (!defined.has(name)) {
    let _, $ = new Promise($ => { _ = $; });
    defined.set(name, {$, _});
  }
  return defined.get(name).$;
};
const augment = attributesObserver(whenDefined, MutationObserver);
let override = null;
getOwnPropertyNames(self)
  .filter(k => /^HTML(?!Element)/.test(k))
  .forEach(k => {
    function HTMLBuiltIn() {
      const {constructor} = this;
      if (!classes.has(constructor))
        throw new TypeError('Illegal constructor');
      const {is, tag} = classes.get(constructor);
      if (override)
        return augment(override, is);
      const element = createElement.call(document, tag);
      element.setAttribute('is', is);
      return augment(setPrototypeOf(element, constructor.prototype), is);
    }

    (HTMLBuiltIn.prototype = self[k].prototype).constructor = HTMLBuiltIn;
    defineProperty(self, k, {value: HTMLBuiltIn});
  });
defineProperty(Element.prototype, 'attachShadow', {
  value() {
    const root = attachShadow.apply(this, arguments);
    const {parse} = qsaObserver({query, root, handle});
    shadowRoots.set(this, {root, parse});
    return root;
  }
});
defineProperty(customElements, 'define', {
  value(is, Class, options) {
    let selector;
    const tag = options && options.extends;
    if (tag) {
      if (getCE(is))
        throw new Error(`the name "${is}" has already been used with this registry`);
      selector = `${tag}[is="${is}"]`;
      classes.set(Class, {is, tag});
      prototypes.set(selector, Class.prototype);
      registry.set(is, Class);
      query.push(selector);
    }
    else {
      define.apply(customElements, arguments);
      shadowed.push(selector = is);
    }
    whenDefined(is).then(() => {
      if (tag) {
        parse(document.querySelectorAll(selector));
        shadows.forEach(parseShadow, [selector]);
      }
      else
        parseShadowed(document.querySelectorAll(selector));
    });
    defined.get(is)._();
  }
});
defineProperty(customElements, 'get', {value: getCE});
defineProperty(customElements, 'whenDefined', {value: whenDefined});
defineProperty(document, 'createElement', {
  value(name, options) {
    const is = options && options.is;
    return is ? new (registry.get(is)) : createElement.call(document, name);
  }
});
function parseShadow(element) {
  const {parse, root} = shadowRoots.get(element);
  parse(root.querySelectorAll(this), element.isConnected);
}
  }
};