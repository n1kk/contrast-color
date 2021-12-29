import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { minifyHtml } from "vite-plugin-html";
import path from "path";
import reactRefresh from "@vitejs/plugin-react-refresh";

export default defineConfig({
    plugins: [reactRefresh(), viteSingleFile(), minifyHtml()],
    root: "src/demo",
    build: {
        outDir: path.resolve("dist/demo"),
        target: "esnext",
        cssCodeSplit: false,
        brotliSize: false,
        emptyOutDir: true,
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 100000000,
        rollupOptions: {
            inlineDynamicImports: true,
            input: path.resolve("src/demo/index.html"),
            output: {
                manualChunks: () => "everything.js",
            },
        },
    },
});
