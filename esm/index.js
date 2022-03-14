/*! (c) Andrea Giammarchi @webreflection ISC */

import Lie from '@webreflection/lie';
import attributesObserver from '@webreflection/custom-elements-attributes';
import qsaObserver from 'qsa-observer';
const {
  document,
  Map, MutationObserver, Object, Set, WeakMap,
  Element, HTMLElement, Node,
  Error, TypeError, Reflect
} = self;
const Promise = self.Promise || Lie;
const {defineProperty, keys, getOwnPropertyNames, setPrototypeOf} = Object;
export default self => {
  let legacy = !self.customElements;
  
const expando = element => {
  const key = keys(element);
  const value = [];
  const {length} = key;
  for (let i = 0; i < length; i++) {
    value[i] = element[key[i]];
    delete element[key[i]];
  }
  return () => {
    for (let i = 0; i < length; i++)
      element[key[i]] = value[i];
  };
};
  
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
      const redefine = expando(element);
      override = setPrototypeOf(element, proto);
      try { new proto.constructor; }
      finally {
        override = null;
        redefine();
      }
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
        defined.get(is)._(Class);
      },
      get: is => registry.get(is),
      whenDefined
    }
  });
  defineProperty(
    HTMLBuiltIn.prototype = HTMLElement.prototype,
    'constructor',
    {value: HTMLBuiltIn}
  );
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
const {define, get, upgrade} = customElements;
const {construct} = Reflect || {construct(HTMLElement) {
  return HTMLElement.call(this);
}};
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
    const redefine = expando(element);
    override = setPrototypeOf(element, proto);
    try { new proto.constructor; }
    finally {
      override = null;
      redefine();
    }
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
      if (query.length)
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
  .filter(k => /^HTML.*Element$/.test(k))
  .forEach(k => {
    const HTMLElement = self[k];
    function HTMLBuiltIn() {
      const {constructor} = this;
      if (!classes.has(constructor))
        throw new TypeError('Illegal constructor');
      const {is, tag} = classes.get(constructor);
      if (is) {
        if (override)
          return augment(override, is);
        const element = createElement.call(document, tag);
        element.setAttribute('is', is);
        return augment(setPrototypeOf(element, constructor.prototype), is);
      }
      else
        return construct.call(this, HTMLElement, [], constructor);
    }

    defineProperty(
      HTMLBuiltIn.prototype = HTMLElement.prototype,
      'constructor',
      {value: HTMLBuiltIn}
    );
    defineProperty(self, k, {value: HTMLBuiltIn});
  });
defineProperty(document, 'createElement', {
  configurable: true,
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
if (attachShadow)
  Element.prototype.attachShadow = function (init) {
    const root = attachShadow.call(this, init);
    shadowRoots.set(this, root);
    return root;
  };
defineProperty(customElements, 'get', {
  configurable: true,
  value: getCE
});
defineProperty(customElements, 'whenDefined', {
  configurable: true,
  value: whenDefined
});
defineProperty(customElements, 'upgrade', {
  configurable: true,
  value(element) {
    const is = element.getAttribute('is');
    if (is) {
      const constructor = registry.get(is);
      if (constructor) {
        augment(setPrototypeOf(element, constructor.prototype), is);
        // apparently unnecessary because this is handled by qsa observer
        // if (element.isConnected && element.connectedCallback)
        //   element.connectedCallback();
        return;
      }
    }
    upgrade.call(customElements, element);
  }
});
defineProperty(customElements, 'define', {
  configurable: true,
  value(is, Class, options) {
    if (getCE(is))
      throw new Error(`'${is}' has already been defined as a custom element`);
    let selector;
    const tag = options && options.extends;
    classes.set(Class, tag ? {is, tag} : {is: '', tag: is});
    if (tag) {
      selector = `${tag}[is="${is}"]`;
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
  const root = shadowRoots.get(element);
  parse(root.querySelectorAll(this), element.isConnected);
}
  }
};
