import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import VitePlugin from 'laravel-vite-plugin';

export default defineConfig({
  plugins: [
    vue(),
    VitePlugin({
     input: ['resources/css/app.css', 'resources/js/app.js'],
    }),
  ],
});

