import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
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
