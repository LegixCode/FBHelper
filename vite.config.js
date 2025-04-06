import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        vue(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src/popup", import.meta.url)),
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
