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
        rollupOptions: {
            input: {
                background: path.resolve(__dirname, "src/entries/background/background.ts"),
            },
            output: {
                entryFileNames: "js/[name].js",
            },
        },
    },
});
