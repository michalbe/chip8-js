
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'

export default {
  entry: 'src/main.js',
  format: 'umd',
  moduleName: 'chip8',
  plugins: [
    commonjs({
      include: 'node_modules/**',
    }),
    resolve({
      customResolveOptions: {
        moduleDirectory: 'node_modules'
      }
    }),
    serve({
      contentBase: ['dist']
    }),
    livereload({
      watch: ['dist']
    })
  ],
  dest: 'dist/index.js'
}
