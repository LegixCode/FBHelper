import { defineConfig } from "vite";

export default defineConfig({
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
