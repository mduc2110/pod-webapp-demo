import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { existsSync } from 'fs';

// Check if local SDK source exists (for development convenience)
const localSDKPath = path.resolve(__dirname, '../pod-sdk-react/src');
const useLocalSDK = existsSync(localSDKPath);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: useLocalSDK
      ? {
          // Use local source for development if available
          '@pod/sdk': localSDKPath,
        }
      : {
          // Otherwise use the installed package from node_modules
          '@pod/sdk': path.resolve(__dirname, 'node_modules/@pod/sdk'),
        },
  },
});

