(function () {
  'use strict';

  var Lie = typeof Promise === 'function' ? Promise : function (fn) {
    var queue = [],
        resolved = 0,
        value;
    fn(function ($) {
      value = $;
      resolved = 1;
      queue.splice(0).forEach(then);
    });
    return {
      then: then
    };

    function then(fn) {
      return resolved ? setTimeout(fn, 0, value) : queue.push(fn), this;
    }
  };

  var elements = function elements(element) {
    return 'querySelectorAll' in element;
  };

  var filter = [].filter;
  var qsaObserver = (function (options) {
    var live = new WeakMap();

    var callback = function callback(records) {
      var query = options.query;

      if (query.length) {
        for (var i = 0, length = records.length; i < length; i++) {
          loop(filter.call(records[i].addedNodes, elements), true, query);
          loop(filter.call(records[i].removedNodes, elements), false, query);
        }
      }
    };

    var drop = function drop(elements) {
      for (var i = 0, length = elements.length; i < length; i++) {
        live["delete"](elements[i]);
      }
    };

    var flush = function flush() {
      callback(observer.takeRecords());
    };

    var loop = function loop(elements, connected, query) {
      var set = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Set();

      var _loop = function _loop(_selectors, _element, i, length) {
        // guard against repeated elements within nested querySelectorAll results
        if (!set.has(_element = elements[i])) {
          set.add(_element);

          if (connected) {
            for (var q, m = matches(_element), _i = 0, _length = query.length; _i < _length; _i++) {
              if (m.call(_element, q = query[_i])) {
                if (!live.has(_element)) live.set(_element, new Set());
                _selectors = live.get(_element); // guard against selectors that were handled already

                if (!_selectors.has(q)) {
                  _selectors.add(q);

                  options.handle(_element, connected, q);
                }
              }
            }
          } // guard against elements that never became live
          else if (live.has(_element)) {
              _selectors = live.get(_element);
              live["delete"](_element);

              _selectors.forEach(function (q) {
                options.handle(_element, connected, q);
              });
            }

          loop(_element.querySelectorAll(query), connected, query, set);
        }

        selectors = _selectors;
        element = _element;
      };

      for (var selectors, element, i = 0, length = elements.length; i < length; i++) {
        _loop(selectors, element, i);
      }
    };

    var matches = function matches(element) {
      return element.matches || element.webkitMatchesSelector || element.msMatchesSelector;
    };

    var parse = function parse(elements) {
      var connected = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      loop(elements, connected, options.query);
    };

    var observer = new MutationObserver(callback);
    var root = options.root || document;
    var query = options.query;
    observer.observe(root, {
      childList: true,
      subtree: true
    });
    if (query.length) parse(root.querySelectorAll(query));
    return {
      drop: drop,
      flush: flush,
      observer: observer,
      parse: parse
    };
  });

  var defineProperty = Object.defineProperty,
      setPrototypeOf = Object.setPrototypeOf;
  var classes = new Map();
  var defined = new Map();
  var prototypes = new Map();
  var registry = new Map();
  var query = [];

  var attributeChanged = function attributeChanged(records) {
    for (var i = 0, length = records.length; i < length; i++) {
      var _records$i = records[i],
          target = _records$i.target,
          attributeName = _records$i.attributeName,
          oldValue = _records$i.oldValue;
      var newValue = target.getAttribute(attributeName);
      target.attributeChangedCallback(attributeName, oldValue, newValue);
    }
  };

  var augment = function augment(element, is) {
    var attributeFilter = element.constructor.observedAttributes;

    if (attributeFilter) {
      whenDefined(is).then(function () {
        new MutationObserver(attributeChanged).observe(element, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: attributeFilter
        });
        attributeFilter.forEach(function (attributeName) {
          if (element.hasAttribute(attributeName)) element.attributeChangedCallback(attributeName, null, element.getAttribute(attributeName));
        });
      });
    }

    return element;
  };

  var handle = function handle(element, connected, selector) {
    var proto = prototypes.get(selector);

    if (connected && !proto.isPrototypeOf(element)) {
      override = setPrototypeOf(element, proto);

      try {
        new proto.constructor();
      } finally {
        override = null;
      }
    }

    var method = "".concat(connected ? '' : 'dis', "connectedCallback");
    if (method in proto) element[method]();
  };

  var _qsaObserver = qsaObserver({
    query: query,
    handle: handle
  }),
      parse = _qsaObserver.parse;

  var override = null;

  var whenDefined = function whenDefined(name) {
    if (!defined.has(name)) {
      var _,
          $ = new Lie(function ($) {
        _ = $;
      });

      defined.set(name, {
        $: $,
        _: _
      });
    }

    return defined.get(name).$;
  };

  defineProperty(self, 'customElements', {
    configurable: true,
    writable: true,
    value: {
      define: function define(is, Class) {
        if (registry.has(is)) throw new Error("the name \"".concat(is, "\" has already been used with this registry"));
        classes.set(Class, is);
        prototypes.set(is, Class.prototype);
        registry.set(is, Class);
        query.push(is);
        whenDefined(is).then(function () {
          parse(document.querySelectorAll(is));
        });

        defined.get(is)._();
      },
      get: function get(selector) {
        return registry.get(selector);
      },
      whenDefined: whenDefined
    }
  });
  (HTMLBuiltIn.prototype = HTMLElement.prototype).constructor = HTMLBuiltIn;
  defineProperty(self, 'HTMLElement', {
    value: HTMLBuiltIn
  }); // in case ShadowDOM is used through a polyfill, to avoid issues
  // with builtin extends within shadow roots

  if (!('isConnected' in Node.prototype)) defineProperty(Node.prototype, 'isConnected', {
    get: function get() {
      return !(this.ownerDocument.compareDocumentPosition(this) & this.DOCUMENT_POSITION_DISCONNECTED);
    }
  });

  function HTMLBuiltIn() {
    var constructor = this.constructor;
    if (!classes.has(constructor)) throw new TypeError('Illegal constructor');
    var is = classes.get(constructor);
    if (override) return augment(override, is);
    var element = createElement.call(document, is);
    return augment(setPrototypeOf(element, constructor.prototype), is);
  }

  var attachShadow = Element.prototype.attachShadow;
  var defineProperty$1 = Object.defineProperty,
      getOwnPropertyNames = Object.getOwnPropertyNames,
      setPrototypeOf$1 = Object.setPrototypeOf;
  var _customElements = customElements,
      define = _customElements.define,
      get = _customElements.get;
  var _document = document,
      createElement$1 = _document.createElement;
  var shadowRoots = new WeakMap();
  var classes$1 = new Map();
  var defined$1 = new Map();
  var prototypes$1 = new Map();
  var registry$1 = new Map();
  var shadows = new Set();
  var shadowed = [];
  var query$1 = [];

  var attributeChanged$1 = function attributeChanged(records) {
    for (var i = 0, length = records.length; i < length; i++) {
      var _records$i = records[i],
          target = _records$i.target,
          attributeName = _records$i.attributeName,
          oldValue = _records$i.oldValue;
      var newValue = target.getAttribute(attributeName);
      target.attributeChangedCallback(attributeName, oldValue, newValue);
    }
  };

  var augment$1 = function augment(element, is) {
    var attributeFilter = element.constructor.observedAttributes;

    if (attributeFilter) {
      whenDefined$1(is).then(function () {
        new MutationObserver(attributeChanged$1).observe(element, {
          attributes: true,
          attributeOldValue: true,
          attributeFilter: attributeFilter
        });
        attributeFilter.forEach(function (attributeName) {
          if (element.hasAttribute(attributeName)) element.attributeChangedCallback(attributeName, null, element.getAttribute(attributeName));
        });
      });
    }

    return element;
  };

  var getCE = function getCE(name) {
    return registry$1.get(name) || get.call(customElements, name);
  };

  var handle$1 = function handle(element, connected, selector) {
    var proto = prototypes$1.get(selector);

    if (connected && !proto.isPrototypeOf(element)) {
      override$1 = setPrototypeOf$1(element, proto);

      try {
        new proto.constructor();
      } finally {
        override$1 = null;
      }
    }

    var method = "".concat(connected ? '' : 'dis', "connectedCallback");
    if (method in proto) element[method]();
  };

  var _qsaObserver$1 = qsaObserver({
    query: query$1,
    handle: handle$1
  }),
      parse$1 = _qsaObserver$1.parse;

  var _qsaObserver2 = qsaObserver({
    query: shadowed,
    handle: function handle(element, connected) {
      if (shadowRoots.has(element)) {
        if (connected) shadows.add(element);else shadows["delete"](element);
        parseShadow.call(query$1, element);
      }
    }
  }),
      parseShadowed = _qsaObserver2.parse;

  var whenDefined$1 = function whenDefined(name) {
    if (!defined$1.has(name)) {
      var _,
          $ = new Lie(function ($) {
        _ = $;
      });

      defined$1.set(name, {
        $: $,
        _: _
      });
    }

    return defined$1.get(name).$;
  };

  var override$1 = null;
  getOwnPropertyNames(self).filter(function (k) {
    return /^HTML(?!Element)/.test(k);
  }).forEach(function (k) {
    function HTMLBuiltIn() {
      var constructor = this.constructor;
      if (!classes$1.has(constructor)) throw new TypeError('Illegal constructor');

      var _classes$get = classes$1.get(constructor),
          is = _classes$get.is,
          tag = _classes$get.tag;

      if (override$1) return augment$1(override$1, is);
      var element = createElement$1.call(document, tag);
      element.setAttribute('is', is);
      return augment$1(setPrototypeOf$1(element, constructor.prototype), is);
    }


    (HTMLBuiltIn.prototype = self[k].prototype).constructor = HTMLBuiltIn;
    defineProperty$1(self, k, {
      value: HTMLBuiltIn
    });
  });
  defineProperty$1(Element.prototype, 'attachShadow', {
    value: function value() {
      var root = attachShadow.apply(this, arguments);

      var _qsaObserver3 = qsaObserver({
        query: query$1,
        root: root,
        handle: handle$1
      }),
          parse = _qsaObserver3.parse;

      shadowRoots.set(this, {
        root: root,
        parse: parse
      });
      return root;
    }
  });
  defineProperty$1(customElements, 'define', {
    value: function value(is, Class, options) {
      var selector;
      var tag = options && options["extends"];

      if (tag) {
        if (getCE(is)) throw new Error("the name \"".concat(is, "\" has already been used with this registry"));
        selector = "".concat(tag, "[is=\"").concat(is, "\"]");
        classes$1.set(Class, {
          is: is,
          tag: tag
        });
        prototypes$1.set(selector, Class.prototype);
        registry$1.set(is, Class);
        query$1.push(selector);
      } else {
        define.apply(customElements, arguments);
        shadowed.push(selector = is);
      }

      whenDefined$1(is).then(function () {
        if (tag) {
          parse$1(document.querySelectorAll(selector));
          shadows.forEach(parseShadow, [selector]);
        } else parseShadowed(document.querySelectorAll(selector));
      });

      defined$1.get(is)._();
    }
  });
  defineProperty$1(customElements, 'get', {
    value: getCE
  });
  defineProperty$1(customElements, 'whenDefined', {
    value: whenDefined$1
  });
  defineProperty$1(document, 'createElement', {
    value: function value(name, options) {
      var is = options && options.is;
      return is ? new (registry$1.get(is))() : createElement$1.call(document, name);
    }
  });

  function parseShadow(element) {
    var _shadowRoots$get = shadowRoots.get(element),
        parse = _shadowRoots$get.parse,
        root = _shadowRoots$get.root;

    parse(root.querySelectorAll(this), element.isConnected);
  }

}());
