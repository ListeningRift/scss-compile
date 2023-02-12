const resolve = require('@rollup/plugin-node-resolve')
const typescript = require('@rollup/plugin-typescript')
const commonjs = require('@rollup/plugin-commonjs')

module.exports = {
  input: './packages/index.ts',
  output: {
    file: './dist/index.js',
    format: 'cjs'
  },
  plugins: [
    resolve({
      preferredBuiltins: false
    }),
    typescript({
      module: 'ESNext',
      include: ['packages/**/*.ts'],
      exclude: ['./node_modules/**'],
      tsconfig: './tsconfig.json'
    }),
    commonjs()
  ]
}
