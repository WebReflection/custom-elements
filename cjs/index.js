'use strict';
/*! (c) Andrea Giammarchi @webreflection ISC */

const Lie = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@webreflection/lie'));
const attributesObserver = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('@webreflection/custom-elements-attributes'));
const qsaObserver = (m => m.__esModule ? /* istanbul ignore next */ m.default : /* istanbul ignore next */ m)(require('qsa-observer'));
const {
  document,
  Map, MutationObserver, Object, Set, WeakMap,
  Element, HTMLElement, Node,
  Error, TypeError
} = self;
const Promise = self.Promise || Lie;
const {defineProperty, getOwnPropertyNames, setPrototypeOf} = Object;
module.exports = self => {
  let legacy = !self.customElements;
  
if (legacy) {
  
  
  const {createElement} = document;
  
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
      _: {classes},
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
        defined.get(is)._(Class);
      },
      get: is => registry.get(is),
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
      const Class = is ? registry.get(is) : registry.get(name);
      return Class ? new Class :  createElement.call(document, name);
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
      
const {get, whenDefined} = self.customElements;
defineProperty(self.customElements, 'whenDefined', {
  configurable: true,
  value(is) {
    return whenDefined.call(this, is).then(Class => Class || get.call(this, is));
  }
});
    }
    catch (o_O) {
      legacy = !legacy;
    }
  }
  if (legacy) {
    const customElements = self.customElements;
    
const {attachShadow} = Element.prototype;
const {createElement} = document;
const {_, define, get} = customElements;
const shadowRoots = new WeakMap;
const shadows = new Set;
const classes = new Map;
const defined = new Map;
const prototypes = new Map;
const registry = new Map;
const shadowed = [];
const query = [];
const getCE = is => registry.get(is) || get.call(customElements, is);
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
      if (!classes.has(constructor)) {
        if (_ && _.classes.has(constructor))
          return;
        throw new TypeError('Illegal constructor');
      }
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
defineProperty(document, 'createElement', {
  value(name, options) {
    const is = options && options.is;
    if (is) {
      const Class = registry.get(is);
      if (Class && classes.get(Class).tag === name)
        return new Class;
    }
    const element = createElement.call(document, name);
    if (is)
      element.setAttribute('is', is);
    return element;
  }
});
defineProperty(Element.prototype, 'attachShadow', {
  value() {
    const root = attachShadow.apply(this, arguments);
    const {parse} = qsaObserver({query, root, handle});
    shadowRoots.set(this, {root, parse});
    return root;
  }
});
defineProperty(customElements, 'get', {
  configurable: true,
  value: getCE
});
defineProperty(customElements, 'whenDefined', {
  configurable: true,
  value: whenDefined
});
defineProperty(customElements, 'define', {
  configurable: true,
  value(is, Class, options) {
    let selector;
    const tag = options && options.extends;
    if (tag) {
      if (getCE(is))
        throw new Error(`'${is}' has already been defined as a custom element`);
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
    defined.get(is)._(Class);
  }
});
function parseShadow(element) {
  const {parse, root} = shadowRoots.get(element);
  parse(root.querySelectorAll(this), element.isConnected);
}
  }
};
