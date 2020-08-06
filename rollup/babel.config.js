const {nodeResolve} = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel').default;

module.exports = {
  input: './bundle/index.js',
  plugins: [
    nodeResolve(),
    babel({
      presets: ['@babel/preset-env'],
      babelHelpers: 'bundled'
    })
  ],
  output: {
    file: './tmp.js',
    format: 'iife'
  }
};
