import { defineConfig } from 'vite'
import dns from 'dns'
import { resolve } from 'path'

dns.setDefaultResultOrder('verbatim')
// https://vitejs.dev/config/
export default defineConfig({
  server: {
      port: 5171,
      host: 'localhost',
  },
  build:{
    rollupOptions:{
      input:{
        login: resolve(__dirname,'index.html'),
        principal: resolve(__dirname,'Paginas','Inicio.html'),
        ter1: resolve(__dirname,'Paginas','Termostato1.html'),
        ter2: resolve(__dirname,'Paginas','Termostato2.html'),
        ter3: resolve(__dirname,'Paginas','Termostato3.html'),
        usuarios: resolve(__dirname,'Paginas','Usuarios.html'),

      }
    }
  }
})