import {join, relative} from 'path';
import {cleanPlugin} from '@alorel/rollup-plugin-clean';
import nodeResolve from '@rollup/plugin-node-resolve';
import replacePlugin from '@rollup/plugin-replace';
import alias from '@rollup/plugin-alias';
import {sassPlugin} from "@alorel/rollup-plugin-scss";
import {modularCssExporterPlugin, modularCssProcessorPlugin} from '@alorel/rollup-plugin-modular-css';
import {IifeIndexRendererRuntime as IndexRendererRuntime} from '@alorel/rollup-plugin-index-renderer-iife';
import typescript from 'rollup-plugin-typescript2';
import {copyPlugin} from '@alorel/rollup-plugin-copy';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import url from '@rollup/plugin-url';

const publicPath = '/';
const srcDir = join(__dirname, 'src');
const distDir = join(__dirname, 'dist');
const isProd = process.env.NODE_ENV === 'production';

const indexRenderer = new IndexRendererRuntime({
  base: publicPath,
  input: join(srcDir, 'index.pug'),
  outputFileName: 'index.html',
  pugOptions: {
    self: true
  }
});

const regAllStyles = /\.s?css$/;
const resolveExt = ['.mjs', '.js', '.jsx', '.ts', '.tsx', '.json', '.json5', '.node'];
const assetFileNames = `[name]${isProd ? '.[hash]' : ''}[extname]`;

export default {
  input: join(srcDir, 'index.tsx'),
  output: {
    assetFileNames,
    dir: distDir,
    format: 'iife',
    entryFileNames: `[name]${isProd ? '.[hash]' : ''}.js`,
    chunkFileNames: `[name]${isProd ? '.[hash]' : ''}.js`,
    sourcemap: !isProd
  },
  plugins: [
    alias({
      entries: [
        {find: /^preact\/(compat|hooks|debug)$/, replacement: 'preact/$1/dist/$1.module.js'},
        {find: /^rxjs\/(operators|ajax)$/, replacement: 'rxjs/_esm5/$1'}
      ]
    }),
    nodeResolve({
      extensions: resolveExt,
      mainFields: ['fesm5', 'esm5', 'module', 'jsnext:main', 'main', 'browser']
    }),
    cleanPlugin(),
    sassPlugin({
      baseUrl: publicPath,
      include: /\.scss$/,
      sassOpts: {
        sourceMap: false
      }
    }),
    modularCssProcessorPlugin({
      include: regAllStyles,
      sourceMap: false,
      ...(() => {
        let fileCounter = 0;
        const fileIds = {};
        const selectorIds = {};

        return {
          processorConfig: {
            before: [
              require('autoprefixer')(),
              require('cssnano')()
            ],
            namer(absoluteFile, selector) {
              const file = relative(__dirname, absoluteFile);
              if (!(file in selectorIds)) {
                selectorIds[file] = {
                  counter: 0,
                  ids: {}
                };
                fileIds[file] = fileCounter.toString(36);
                fileCounter++;
              }

              const selectors = selectorIds[file];
              if (!selectors.ids[selector]) {
                selectors.ids[selector] = selectors.counter.toString(36);
                selectors.counter++;
              }

              const fileId = `f${fileIds[file]}`;
              const selectorId = `s${selectors.ids[selector]}`;

              return fileId + selectorId;
            }
          }
        }
      })()
    }),
    modularCssExporterPlugin({
      pureLoadStyle: false,
      styleImportName: 'loadStyle',
      include: regAllStyles,
      sourceMap: false
    }),
    typescript(),
    replacePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    commonjs({
      include: /node_modules[\\/]moment-timezone/,
      sourceMap: !isProd,
      transformMixedEsModules: true
    }),
    json({
      include: /\.json$/,
      namedExports: true,
      preferConst: false
    }),
    url({
      include: /\.mp3$/,
      limit: 0,
      publicPath,
      fileName: assetFileNames
    }),
    copyPlugin({
      defaultOpts: {
        glob: {
          cwd: srcDir
        },
        emitNameKind: 'fileName'
      },
      copy: [
        'favicon.ico'
      ]
    }),
    indexRenderer.createPlugin(),
    indexRenderer.createOutputPlugin(),
    ...(() => {
      if (!isProd) {
        return [];
      }

      const ecma = 5;
      const ie8 = false;
      const safari10 = true;

      return [
        require('@alorel/rollup-plugin-iife-wrap').iifeWrapPlugin(),
        require('@alorel/rollup-plugin-threaded-terser').threadedTerserPlugin({
          terserOpts: {
            compress: {
              drop_console: true,
              keep_infinity: true,
              typeofs: false,
              ecma
            },
            ecma,
            ie8,
            mangle: {
              safari10
            },
            output: {
              comments: false,
              ie8,
              safari10
            },
            safari10,
            sourceMap: false
          }
        })
      ]
    })(),
  ]
};
