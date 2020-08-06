import {nodeResolve} from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

export default {
  input: './test/es.js',
  plugins: [
    nodeResolve(),
    babel({
      presets: ['@babel/preset-env'],
      babelHelpers: 'bundled'
    })
  ],
  
  output: {
    exports: 'named',
    file: './test/index.js',
    format: 'iife'
  }
};
