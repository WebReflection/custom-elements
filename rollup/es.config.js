const {nodeResolve} = require('@rollup/plugin-node-resolve');
const {terser} = require('rollup-plugin-terser');

module.exports = {
  input: './bundle/index.js',
  plugins: [
    nodeResolve(),
    terser()
  ],
  output: {
    esModule: false,
    file: './es.js',
    format: 'iife'
  }
};
