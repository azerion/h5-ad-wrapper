import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import json from 'rollup-plugin-json';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

const pkg = require('./package.json');

const libraryName = 'ad-wrapper';

const isWatching = process.argv.findIndex((element) => element === '-w') !== -1;

let basePlugins = [];
if (isWatching) {
    basePlugins = [
        serve({
            contentBase: ['./', './example'],
            port: 8080
        }),
        livereload({
            watch: 'dist'
        }),
    ];
}
export default {
    input: `src/${libraryName}.ts`,
    output: [
        {file: pkg.main, name: 'azsdk', format: 'umd', sourcemap: true, extend: true},
        {file: pkg.module, format: 'es', sourcemap: true},
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
        include: 'src/**',
    },
    plugins: basePlugins.concat([
        // Allow json resolution
        json(),
        // Compile TypeScript files
        typescript({useTsconfigDeclarationDir: true}),
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        commonjs(),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        resolve(),

        // Resolve source maps to the original source
        sourceMaps(),
    ])
};
