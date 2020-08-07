# Custom Elements V1 Polyfill

<sup>**Social Media Photo by [Joanna Kosinska](https://unsplash.com/@joannakosinska) on [Unsplash](https://unsplash.com/)**</sup>

An unobtrusive customElements V1 polyfill.


## Compatibility

The polyfill gracefully enhances the following minimum versions of at least these browsers, up to their latest version:

  * Chrome 38
  * Firefox 14
  * Opera 25
  * Internet Explorer 11 and Edge 12
  * Safari 8 and WebKit based
  * Samsung Internet 3


## How To Polyfill

This polyfill provides both global fixes and ESM or CJS modules.


### As global polyfill

The [index.js](./index.js) and its [min.js](./min.js) versions are dedicated for usage within _HTML_ pages.

```html
<!-- simply include this script on top of your HTML files -->
<script src="//unpkg.com/@webreflection/custom-elements"></script>
```

Patches are applied after feature detections to bring `customElements` V1 to legacy browsers, as well as modern browsers that are not fully specs compliant (i.e. Safari / WebKit).


### As ESM

The [esm/index.js](./esm/index.js) is the default export. The module does not patch anything until explicitly invoked.

```js
import cePolyfill from '@webreflection/custom-elements';
const customElements = cePolyfill(self || window || global);
const {define, get, whenDefined} = customElements;
```


### As CJS

Everything said for _ESM_, except the file is in [cjs/index.js](./cjs/index.js).

```js
const cePolyfill = require('@webreflection/custom-elements');
const customElements = cePolyfill(self || window || global);
const {define, get, whenDefined} = customElements;
```


#### Extra note about ESM/CJS modules

If you'd like to *not* pollute the global object with all the patches, you need to pass an object that contains all needed globals.

However, this is strongly discouraged unless you are doing this to test/cover something via node.js only, not browsers.

**Example**
```js
const customElements = cePolyfill({
  // pass a bound version of customElements if available
  customElements: self.customElements && {
    // only define and get are needed
    define: customElements.define.bind(customElements),
    get: customElements.get.bind(customElements)
  },

  // needed globals through this `self` namespace
  Map, MutationObserver, Object, Set, WeakMap,
  HTMLElement, Error, TypeError,

  // the `document.createElement` might be patched regardless
  document,
  // the `Element.prototype.attachShadow` might be patched regardless
  Element,
  // the `Node.prototype.isConnected` might be patched regardless
  Node,

  // one or more globals you'd like to ake available for builtin extends
  HTMLButtonElement,
  HTMLDivElement,
});
```


## To Keep In Mind

This is *not* a _ShadowDOM_ polyfill, this is just the current [Custom Elements V1 as specified by standard bodies](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-api).

If you are looking for a reasonable attempt to polyfill _ShadowDOM_ too, [ShadyDOM](https://github.com/webcomponents/polyfills/tree/master/packages/shadydom#readme) would be my recommendation.

Please note, once this polyfill has been tested enough it will be moved to under [@ungap](https://github.com/ungap/).

Please also note that:

  * to polyfill _customElements_ without builtin extends use [custom-elements-no-builtin](https://github.com/WebReflection/custom-elements-no-builtin#readme) instead
  * for even more legacy browsers, ditch this module and use [document-register-element](https://github.com/WebReflection/document-register-element#readme) instead, but bear in mind this older version has its own legacy caveats
