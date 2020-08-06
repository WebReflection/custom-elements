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

}());
