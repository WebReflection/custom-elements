const {nodeResolve} = require('@rollup/plugin-node-resolve');
const {terser} = require('rollup-plugin-terser');
const includePaths = require('rollup-plugin-includepaths');

module.exports = {
  input: './bundle/index.js',
  plugins: [
    includePaths({
      include: {
        '@webreflection/lie': 'template/promise.js'
      },
    }),
    nodeResolve(),
    terser()
  ],
  output: {
    file: './es.js',
    format: 'iife'
  }
};
