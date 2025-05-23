import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: {
            "@popup": path.resolve(__dirname, "src/popup"),
        },
    },
    build: {
        emptyOutDir: false,
        rollupOptions: {
            input: {
                background: "./src/background/background.ts",
            },
            output: {
                entryFileNames: "js/[name].js",
            },
        },
    },
});
