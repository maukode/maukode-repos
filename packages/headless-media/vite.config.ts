// vite.config.ts
import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    // Plugin to generate TypeScript declaration files
    dts({
      insertTypesEntry: true, // Include a types entry in package.json
    })
  ],
  build: {
    // Enable library mode
    lib: {
      // The entry point for your library's core logic
      entry: resolve(__dirname, 'src/lib/index.ts'),
      name: 'HeadlessWebcam', // A global variable name for UMD builds
      // The output file name formats (e.g., headless-webcam.es.js)
      fileName: (format) => `headless-webcam.${format}.js` 
    },
    // You can add rollup options here if needed later
    rollupOptions: {
      // Externalize dependencies that you don't want bundled
      // For a vanilla library, you might not have any initially
    }
  }
});