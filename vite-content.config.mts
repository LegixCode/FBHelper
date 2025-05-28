import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    build: {
        emptyOutDir: false,
        target: "node16",
        rollupOptions: {
            input: {
                content: path.resolve(__dirname, "src/entries/content/content.ts"),
            },
            output: {
                entryFileNames: "js/[name].js",
            },
        },
    },
});
