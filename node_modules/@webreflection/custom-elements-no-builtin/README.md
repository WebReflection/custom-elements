# Custom Elements w/out Builtin for IE11+ and legacy.

<sup>**Social Media Photo by [Joanna Kosinska](https://unsplash.com/@joannakosinska) on [Unsplash](https://unsplash.com/)**</sup>

A customElements polyfill, without builtin extends, targeting IE11+ and other legacy browsers.

  * to add builtin extends, add [custom-elements-builtin](https://github.com/WebReflection/custom-elements-builtin#readme) on demand
  * for full V1 API compliance, ditch this module and use [custom-elements](https://github.com/WebReflection/custom-elements#readme) instead
  * for even more legacy browsers, ditch this module and use [document-register-element](https://github.com/WebReflection/document-register-element#readme) instead

## How To Test

Please use features detection to avoid including this polyfill in every browser, considering that this replaces native `customElements`, if present, so that it would add unnecessary code to parse and execute in every browser that supports Custom Elements builtin natively already.

```html
<script>
if(!self.customElements)
  document.write('<script src="//unpkg.com/@webreflection/custom-elements-builtin"><\x2fscript>')
</script>
```

<sup>**P.S.** the `\x2f` is not a typo, it's exactly how you should write it or your page layout will break!</sup>

- - -

## To Keep In Mind

This is *not* a _ShadowDOM_ polyfill, this is just the current [Custom Elements V1 as specified by standard bodies](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-api) *without* builtin extends.
