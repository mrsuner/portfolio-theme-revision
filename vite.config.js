import { defineConfig } from 'vite';

/**
 * Kanboard loads stable plugin asset paths from PHP templates. Keep Vite's
 * output names stable instead of emitting hashed files that PHP cannot find.
 */
export default defineConfig(({ mode }) => ({
    build: {
        outDir: 'Asset',
        emptyOutDir: false,
        minify: mode === 'development' ? false : 'esbuild',
        sourcemap: mode === 'development',
        lib: {
            entry: 'Asset/dev/js/main.js',
          formats: ['iife'],
          name: 'ThemeRevision',
          // A function prevents Vite from appending the output format
          // (otherwise it emits main.min.iife.js, while Kanboard loads
          // the stable main.min.js path).
          fileName: () => 'main.min.js',
            cssFileName: 'main.min',
        },
    },
}));
