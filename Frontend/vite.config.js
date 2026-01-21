import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000,
    // added because frontend and backend are running on different ports
    proxy:{
      "/api":{
        target:"http://localhost:9000",  // backend server
        changeOrigin:true,
      }
    }
  }
})
    //     // rewrite:path=>path.replace(/^\/api/,'')
    //     rewrite: (path) => {
    //       console.log('Rewriting path:', path);
    //       // return path.replace(/^\/api/, '');
    //     }
    //   }
    // }
//   }
// })
