import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'ReactHeadlessMedia',
      fileName: (format) => `react-headless-media.${format}.js`,
    },
    rollupOptions: {
      // Pastikan untuk menjadikan dependensi yang tidak ingin Anda bundel sebagai eksternal.
      // Ini adalah bagian dari kontrak `peerDependencies`.
      external: ['react', 'react-dom'],
      output: {
        // Sediakan variabel global untuk digunakan dalam build UMD
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});