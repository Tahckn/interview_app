import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            src: "/src",
            components: "/src/components",
            pages: "/src/pages",
            services: "/src/services",
            store: "/src/store",
            hooks: "/src/hooks",
            types: "/src/types",
        }
    },
    build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', '@mui/material', '@mui/x-data-grid']
                }
            }
        }
    }
})
