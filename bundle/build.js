#!/usr/bin/env node

const {readFileSync, writeFileSync} = require('fs');
const {join} = require('path');

build('index.js');
build('pony.js');

function build(file) {

  const template = readFileSync(join(__dirname, '..', 'template', file));

  writeFileSync(
    join(__dirname, file),
  `
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
${''.replace.call(
  template,
  /\/\/ (@webreflection\/.+)/g,
  (_, path) => readFileSync(join(__dirname, '..', 'node_modules', path))
)
  .replace('export const expando =', 'const expando =')
  .replace(/import .*/g, '')
  .replace('if (!self.customElements) {', 'if (legacy) {')
  .replace(/const \{[^}]+\} = self;/g, '')
  .replace(/const \{[^}]+\} = Object;/g, '')
  .replace(/[\r\n]{2,}/g, '\n')
  .trim()
}
`
  );

}
