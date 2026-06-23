import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        contact: resolve(__dirname, 'contact.html'),
        methodology: resolve(__dirname, 'methodology.html'),
        thankYou: resolve(__dirname, 'thank-you.html'),
        arcade: resolve(__dirname, 'arcade.html')
      }
    }
  }
});
