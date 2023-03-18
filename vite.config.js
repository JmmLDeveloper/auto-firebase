import { defineConfig } from 'vite'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')
// https://vitejs.dev/config/
export default defineConfig({
  server: {
      port: 5171,
      host: 'localhost',
  },
})