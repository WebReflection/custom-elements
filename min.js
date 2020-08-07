/*! (c) Andrea Giammarchi @webreflection ISC */
!function(){"use strict";var e="function"==typeof Promise?Promise:function(e){var t,n=[],r=0;return e((function(e){t=e,r=1,n.splice(0).forEach(o)})),{then:o};function o(e){return r?setTimeout(e,0,t):n.push(e),this}},t=function(e,t){var n=function(e){for(var t=0,n=e.length;t<n;t++)r(e[t])},r=function(e){var t=e.target,n=e.attributeName,r=e.oldValue;t.attributeChangedCallback(n,r,t.getAttribute(n))};return function(o,a){var l=o.constructor.observedAttributes;return l&&e(a).then((function(){new t(n).observe(o,{attributes:!0,attributeOldValue:!0,attributeFilter:l});for(var e=0,a=l.length;e<a;e++)o.hasAttribute(l[e])&&r({target:o,attributeName:l[e],oldValue:null})})),o}},n=self,r=n.document,o=n.MutationObserver,a=n.Set,l=n.WeakMap,u=function(e){return"querySelectorAll"in e},i=[].filter,c=function(e){var t=new l,n=function(t){var n=e.query;if(n.length)for(var r=0,o=t.length;r<o;r++)c(i.call(t[r].addedNodes,u),!0,n),c(i.call(t[r].removedNodes,u),!1,n)},c=function n(r,o,l){for(var u,i,c=arguments.length>3&&void 0!==arguments[3]?arguments[3]:new a,f=function(f,h,d,p){if(!c.has(h=r[d])){if(c.add(h),o)for(var v,y=s(h),g=0,w=l.length;g<w;g++)y.call(h,v=l[g])&&(t.has(h)||t.set(h,new a),(f=t.get(h)).has(v)||(f.add(v),e.handle(h,o,v)));else t.has(h)&&(f=t.get(h),t.delete(h),f.forEach((function(t){e.handle(h,o,t)})));n(h.querySelectorAll(l),o,l,c)}u=f,i=h},h=0,d=r.length;h<d;h++)f(u,i,h)},s=function(e){return e.matches||e.webkitMatchesSelector||e.msMatchesSelector},f=function(t){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];c(t,n,e.query)},h=new o(n),d=e.root||r,p=e.query;return h.observe(d,{childList:!0,subtree:!0}),p.length&&f(d.querySelectorAll(p)),{drop:function(e){for(var n=0,r=e.length;n<r;n++)t.delete(e[n])},flush:function(){n(h.takeRecords())},observer:h,parse:f}},s=self,f=s.document,h=s.Map,d=s.MutationObserver,p=s.Object,v=s.Set,y=s.WeakMap,g=s.Element,w=s.HTMLElement,m=s.Node,b=s.Error,E=s.TypeError,S=self.Promise||e,q=!self.customElements;if(q){var M=function(){var e=this.constructor;if(!T.has(e))throw new E("Illegal constructor");var t=T.get(e);if(I)return _(I,t);var n=O.call(f,t);return _(A(n,e.prototype),t)},O=f.createElement,P=p.defineProperty,A=p.setPrototypeOf,T=new h,C=new h,N=new h,L=new h,k=[],D=c({query:k,handle:function(e,t,n){var r=N.get(n);if(t&&!r.isPrototypeOf(e)){I=A(e,r);try{new r.constructor}finally{I=null}}var o="".concat(t?"":"dis","connectedCallback");o in r&&e[o]()}}).parse,I=null,H=function(t){if(!C.has(t)){var n,r=new e((function(e){n=e}));C.set(t,{$:r,_:n})}return C.get(t).$},_=t(H,d);P(self,"customElements",{configurable:!0,value:{define:function(e,t){if(L.has(e))throw new b('the name "'.concat(e,'" has already been used with this registry'));T.set(t,e),N.set(e,t.prototype),L.set(e,t),k.push(e),H(e).then((function(){D(f.querySelectorAll(e))})),C.get(e)._()},get:function(e){return L.get(e)},whenDefined:H}}),(M.prototype=w.prototype).constructor=M,P(self,"HTMLElement",{configurable:!0,value:M}),P(f,"createElement",{configurable:!0,value:function(e,t){var n=t&&t.is;return n?new(L.get(n)):O.call(f,e)}}),"isConnected"in m.prototype||P(m.prototype,"isConnected",{configurable:!0,get:function(){return!(this.ownerDocument.compareDocumentPosition(this)&this.DOCUMENT_POSITION_DISCONNECTED)}})}else try{var x=function e(){return self.Reflect.construct(HTMLLIElement,[],e)};x.prototype=HTMLLIElement.prototype;var $="extends-li";self.customElements.define("extends-li",x,{extends:"li"}),q=f.createElement("li",{is:$}).outerHTML.indexOf($)<0}catch(e){q=!q}if(q){var V=function(e){var t=J.get(e);(0,t.parse)(t.root.querySelectorAll(this),e.isConnected)},R=self.customElements,W=g.prototype.attachShadow,j=f.createElement,F=R.define,U=R.get,z=p.defineProperty,B=p.getOwnPropertyNames,G=p.setPrototypeOf,J=new y,K=new v,Q=new h,X=new h,Y=new h,Z=new h,ee=[],te=[],ne=function(e){return Z.get(e)||U.call(R,e)},re=function(e,t,n){var r=Y.get(n);if(t&&!r.isPrototypeOf(e)){ie=G(e,r);try{new r.constructor}finally{ie=null}}var o="".concat(t?"":"dis","connectedCallback");o in r&&e[o]()},oe=c({query:te,handle:re}).parse,ae=c({query:ee,handle:function(e,t){J.has(e)&&(t?K.add(e):K.delete(e),V.call(te,e))}}).parse,le=function(e){if(!X.has(e)){var t,n=new S((function(e){t=e}));X.set(e,{$:n,_:t})}return X.get(e).$},ue=t(le,d),ie=null;B(self).filter((function(e){return/^HTML(?!Element)/.test(e)})).forEach((function(e){function t(){var e=this.constructor;if(!Q.has(e))throw new E("Illegal constructor");var t=Q.get(e),n=t.is,r=t.tag;if(ie)return ue(ie,n);var o=j.call(f,r);return o.setAttribute("is",n),ue(G(o,e.prototype),n)}(t.prototype=self[e].prototype).constructor=t,z(self,e,{value:t})})),z(g.prototype,"attachShadow",{value:function(){var e=W.apply(this,arguments),t=c({query:te,root:e,handle:re}),n=t.parse;return J.set(this,{root:e,parse:n}),e}}),z(R,"define",{value:function(e,t,n){var r,o=n&&n.extends;if(o){if(ne(e))throw new b('the name "'.concat(e,'" has already been used with this registry'));r="".concat(o,'[is="').concat(e,'"]'),Q.set(t,{is:e,tag:o}),Y.set(r,t.prototype),Z.set(e,t),te.push(r)}else F.apply(R,arguments),ee.push(r=e);le(e).then((function(){o?(oe(f.querySelectorAll(r)),K.forEach(V,[r])):ae(f.querySelectorAll(r))})),X.get(e)._()}}),z(R,"get",{value:ne}),z(R,"whenDefined",{value:le}),z(f,"createElement",{value:function(e,t){var n=t&&t.is;return n?new(Z.get(n)):j.call(f,e)}})}}();