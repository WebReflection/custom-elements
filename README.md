# Custom Elements V1 Polyfill

<sup>**Social Media Photo by [Joanna Kosinska](https://unsplash.com/@joannakosinska) on [Unsplash](https://unsplash.com/)**</sup>

A customElements V1 polyfill in about *~2K* all inclusive.

  * to polyfill _customElements_ without builtin extends use [custom-elements-no-builtin](https://github.com/WebReflection/custom-elements-no-builtin#readme) 
  * for even more legacy browsers, ditch this module and use [document-register-element](https://github.com/WebReflection/document-register-element#readme) instead

## How To Test

```html
<!-- simply include this script on top of your HTML files -->
<script src="//unpkg.com/@webreflection/custom-elements"></script>
```

Please note, once this polyfill has been tested enough it will be moved to under [@ungap](https://github.com/ungap/).


## To Keep In Mind

This is *not* a _ShadowDOM_ polyfill, this is just the current [Custom Elements V1 as specified by standard bodies](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-api).
