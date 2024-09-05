import { defineConfig } from "vite";

export default defineConfig({
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
