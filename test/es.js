customElements.define('custom-element', class extends HTMLElement {
  static get observedAttributes() { return ['test']; }
  constructor() {
    super();
    console.log(this.tagName, 'constructed');
  }
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(this.tagName, name, oldValue, newValue);
  }
  connectedCallback() {
    this.style.color = 'green';
    this.textContent = 'Connected';
  }
  disconnectedCallback() {
    document.body.appendChild(document.createElement('div')).textContent = 'OK';
  }
  hello() {
    this.innerHTML = 'Hello';
  }
});

customElements.define(
  'built-in',
  class extends HTMLDivElement {
    static get observedAttributes() { return ['test']; }
    constructor() {
      super();
      this.setAttribute('is', 'built-in');
      console.log(this.tagName, 'constructed');
    }
    attributeChangedCallback(name, oldValue, newValue) {
      console.log(this.tagName, this.getAttribute('is'), name, oldValue, newValue);
    }
    connectedCallback() {
      this.style.color = 'green';
      this.textContent = 'Connected';
    }
    disconnectedCallback() {
      document.body.appendChild(document.createElement('div')).textContent = 'OK';
    }
  },
  {extends: 'div'}
);

customElements.whenDefined('custom-element').then(Class => {
  console.assert(typeof Class === 'function', 'Class not passed once defined');
});
