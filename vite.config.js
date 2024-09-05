import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    plugins: [vue()],
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
