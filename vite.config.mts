import path from "path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src/popup"),
        },
    },
    build: {
        emptyOutDir: false,
        rollupOptions: {
            output: {
                chunkFileNames: "js/[name].js",
                entryFileNames: "js/[name].js",
                assetFileNames: "css/[name].css",
            },
        },
    },
});
