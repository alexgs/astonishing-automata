import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,            // Generate .d.ts types
  sourcemap: true,      // Optional, useful for debugging
  clean: true,          // Clear `dist/` before building
  outDir: 'dist',       // Output directory
});
