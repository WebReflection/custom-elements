#!/usr/bin/env node

const {readFileSync, writeFileSync} = require('fs');
const {join} = require('path');

const template = readFileSync(join(__dirname, '..', 'template', 'index.js'));

writeFileSync(
  join(__dirname, 'index.js'),
  `
import Lie from '@webreflection/lie';
import qsaObserver from 'qsa-observer';
${''.replace.call(
  template,
  /\/\/ (@webreflection\/.+)/g,
  (_, path) => readFileSync(join(__dirname, '..', 'node_modules', path))
)
  .replace(/import .*/g, '')
  .replace('if (!self.customElements) {', 'if (legacy) {')
}
`
);
