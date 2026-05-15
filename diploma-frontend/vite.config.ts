import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // <--- Ajoutez cet import


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: 'http://Diploma-backend-env.eba-ewvbvubi.eu-west-3.elasticbeanstalk.com',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      // Ces deux lignes forcent l'utilisation d'une seule version de React
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
})
