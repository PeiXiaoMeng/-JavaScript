// vite.config.js  
import { defineConfig } from 'vite'    
  
// https://vitejs.dev/config/  
export default defineConfig({ 
  build: {  
    lib: {  
      entry: 'src/main.ts', // 明确指定入口文件为 main.ts  
      name: 'MyLibrary',  
      formats: ['es', 'cjs', 'umd'] // 根据需要选择输出格式  
    }, 
  },  
  resolve: {  
    alias: {  
      // 设置别名，例如 '@/' 指向 'src/'  
      '@/': '/src/'  
    }  
  },  
  // 其他 Vite 配置...  
})