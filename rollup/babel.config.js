import {nodeResolve} from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: './bundle/index.js',
  plugins: [
    nodeResolve(),
    babel({
      presets: ['@babel/preset-env'],
      babelHelpers: 'bundled'
    })
  ],
  output: {
    esModule: false,
    file: './tmp.js',
    format: 'iife'
  }
};
