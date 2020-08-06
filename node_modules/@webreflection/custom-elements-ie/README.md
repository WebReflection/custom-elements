# Custom Elements + Builtin for IE11+

<sup>**Social Media Photo by [Joanna Kosinska](https://unsplash.com/@joannakosinska) on [Unsplash](https://unsplash.com/)**</sup>

A better custom-elements-builtin polyfill, targeting IE11+, but working in every other browser too.


### Warning

This module goal is to replace [the current legacy polyfill](https://github.com/WebReflection/document-register-element) which has been around for a while but it has its own caveats.


## Current Status

The purpose of this module is to bring Custom Elements + builtin extends [without constructors caveats](https://github.com/ungap/custom-elements-builtin#constructor-caveat), with better performance, and with better control through the [qsa-observer](https://github.com/WebReflection/qsa-observer#readme) module.

This module is currently under heavy tests, but it seems to work seamlessly OK in both IE11 and other older browsers.

**Please help** me out testing this module as much as you can so that I can create an `@ungap` entry with this polyfill, and finally provide a caveats-free polyfill for this amazing part of the Web specs.



## How To Test

Please use features detection to avoid including this polyfill in every browser, considering that this replaces native `customElements`, if present, so that it would add unnecessary code to parse and execute in every browser that supports Custom Elements builtin natively already.

```html
<script>
if(self.customElements)
  try{customElements.define('built-in',document.createElement('p').constructor,{'extends':'p'})}
  catch(s){document.write('<script src="//unpkg.com/@webreflection/custom-elements-builtin"><\x2fscript>')}
else
  document.write('<script src="//unpkg.com/@webreflection/custom-elements-ie"><\x2fscript>');
</script>
```

<sup>**P.S.** the `\x2f` is not a typo, it's exactly how you should write it or your page layout will break!</sup>

- - -

There is also a **[live test page](https://webreflection.github.io/custom-elements-ie/test/)** which should show a regular Custom Element and a builtin extend for a second, and then disappear.

Logs in console are related to the `attributeChangedCallback` method, which should show 2 logs with the `test` attribute value.


## To Keep In Mind

This is **not** a _ShadowDOM_ polyfill, exactly the same as [document-register-element](https://github.com/WebReflection/document-register-element) was never about _ShadowDOM_, simply because that's a different part of the Web Components umbrella, and because _ShadowDOM_ is not mandatory at all for custom elements.

This is just the current [Custom Elements V1 as specified by standard bodies](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-api), finally free from constructor caveats, and rewritten from scratch to target the real-world browsers everyone uses these days.
