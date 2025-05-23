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
        target: "node16",
        rollupOptions: {
            input: {
                content: "./src/content/content.ts",
            },
            output: {
                entryFileNames: "js/[name].js",
            },
        },
    },
});
