/*! (c) Andrea Giammarchi @webreflection ISC */
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

  var legacy = !self.customElements;

  if (legacy) {
    var HTMLBuiltIn = function HTMLBuiltIn() {
      var constructor = this.constructor;
      if (!classes.has(constructor)) throw new TypeError('Illegal constructor');
      var is = classes.get(constructor);
      if (override) return augment(override, is);
      var element = createElement.call(document, is);
      return augment(setPrototypeOf(element, constructor.prototype), is);
    };

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
  } else {
    try {
      customElements.define('built-in', document.createElement('p').constructor, {
        'extends': 'p'
      });
    } catch (o_O) {
      legacy = true;
    }
  }

  if (legacy) {
    var parseShadow = function parseShadow(element) {
      var _shadowRoots$get = shadowRoots.get(element),
          parse = _shadowRoots$get.parse,
          root = _shadowRoots$get.root;

      parse(root.querySelectorAll(this), element.isConnected);
    };

    var attachShadow = Element.prototype.attachShadow;
    var _defineProperty = Object.defineProperty,
        getOwnPropertyNames = Object.getOwnPropertyNames,
        _setPrototypeOf = Object.setPrototypeOf;
    var _customElements = customElements,
        define = _customElements.define,
        get = _customElements.get;
    var _document = document,
        _createElement = _document.createElement;
    var shadowRoots = new WeakMap();

    var _classes = new Map();

    var _defined = new Map();

    var _prototypes = new Map();

    var _registry = new Map();

    var shadows = new Set();
    var shadowed = [];
    var _query = [];

    var _attributeChanged = function _attributeChanged(records) {
      for (var i = 0, length = records.length; i < length; i++) {
        var _records$i2 = records[i],
            target = _records$i2.target,
            attributeName = _records$i2.attributeName,
            oldValue = _records$i2.oldValue;
        var newValue = target.getAttribute(attributeName);
        target.attributeChangedCallback(attributeName, oldValue, newValue);
      }
    };

    var _augment = function _augment(element, is) {
      var attributeFilter = element.constructor.observedAttributes;

      if (attributeFilter) {
        _whenDefined(is).then(function () {
          new MutationObserver(_attributeChanged).observe(element, {
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
      return _registry.get(name) || get.call(customElements, name);
    };

    var _handle = function _handle(element, connected, selector) {
      var proto = _prototypes.get(selector);

      if (connected && !proto.isPrototypeOf(element)) {
        _override = _setPrototypeOf(element, proto);

        try {
          new proto.constructor();
        } finally {
          _override = null;
        }
      }

      var method = "".concat(connected ? '' : 'dis', "connectedCallback");
      if (method in proto) element[method]();
    };

    var _qsaObserver2 = qsaObserver({
      query: _query,
      handle: _handle
    }),
        _parse = _qsaObserver2.parse;

    var _qsaObserver3 = qsaObserver({
      query: shadowed,
      handle: function handle(element, connected) {
        if (shadowRoots.has(element)) {
          if (connected) shadows.add(element);else shadows["delete"](element);
          parseShadow.call(_query, element);
        }
      }
    }),
        parseShadowed = _qsaObserver3.parse;

    var _whenDefined = function _whenDefined(name) {
      if (!_defined.has(name)) {
        var _,
            $ = new Lie(function ($) {
          _ = $;
        });

        _defined.set(name, {
          $: $,
          _: _
        });
      }

      return _defined.get(name).$;
    };

    var _override = null;
    getOwnPropertyNames(self).filter(function (k) {
      return /^HTML(?!Element)/.test(k);
    }).forEach(function (k) {
      function HTMLBuiltIn() {
        var constructor = this.constructor;
        if (!_classes.has(constructor)) throw new TypeError('Illegal constructor');

        var _classes$get = _classes.get(constructor),
            is = _classes$get.is,
            tag = _classes$get.tag;

        if (_override) return _augment(_override, is);

        var element = _createElement.call(document, tag);

        element.setAttribute('is', is);
        return _augment(_setPrototypeOf(element, constructor.prototype), is);
      }



      (HTMLBuiltIn.prototype = self[k].prototype).constructor = HTMLBuiltIn;

      _defineProperty(self, k, {
        value: HTMLBuiltIn
      });
    });

    _defineProperty(Element.prototype, 'attachShadow', {
      value: function value() {
        var root = attachShadow.apply(this, arguments);

        var _qsaObserver4 = qsaObserver({
          query: _query,
          root: root,
          handle: _handle
        }),
            parse = _qsaObserver4.parse;

        shadowRoots.set(this, {
          root: root,
          parse: parse
        });
        return root;
      }
    });

    _defineProperty(customElements, 'define', {
      value: function value(is, Class, options) {
        var selector;
        var tag = options && options["extends"];

        if (tag) {
          if (getCE(is)) throw new Error("the name \"".concat(is, "\" has already been used with this registry"));
          selector = "".concat(tag, "[is=\"").concat(is, "\"]");

          _classes.set(Class, {
            is: is,
            tag: tag
          });

          _prototypes.set(selector, Class.prototype);

          _registry.set(is, Class);

          _query.push(selector);
        } else {
          define.apply(customElements, arguments);
          shadowed.push(selector = is);
        }

        _whenDefined(is).then(function () {
          if (tag) {
            _parse(document.querySelectorAll(selector));

            shadows.forEach(parseShadow, [selector]);
          } else parseShadowed(document.querySelectorAll(selector));
        });

        _defined.get(is)._();
      }
    });

    _defineProperty(customElements, 'get', {
      value: getCE
    });

    _defineProperty(customElements, 'whenDefined', {
      value: _whenDefined
    });

    _defineProperty(document, 'createElement', {
      value: function value(name, options) {
        var is = options && options.is;
        return is ? new (_registry.get(is))() : _createElement.call(document, name);
      }
    });
  }

}());
