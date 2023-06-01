import EsLint from "vite-plugin-linter";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import packageJson from "./package.json";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import tsConfigPaths from "vite-tsconfig-paths";

const { EsLinter, linterPlugin } = EsLint;

// https://vitejs.dev/config/
export default defineConfig((configEnv) => ({
  plugins: [
    react(),
    tsConfigPaths(),
    linterPlugin({
      include: ["./src/**/*.ts", "./src/**/*.tsx"],
      linters: [new EsLinter({ configEnv })]
    }),
    dts({
      include: ["src"],
      // generate one d.ts for commonjs and one for esm
      outputDir: "dist"
    })
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: packageJson.name,
      fileName: (format) => `${packageJson.name}.${format}.js`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies || {}), "react"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
}));
