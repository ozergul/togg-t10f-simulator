import {defineConfig} from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/togg-t10f-simulator/' : '/',
});
