import esbuild from "esbuild";

import process from "process";
import { builtinModules } from 'node:module';

const prod = (process.argv[2] === "production");
const context = await esbuild.context({
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "es2018",
    logLevel: "info",
    sourcemap: prod ? false : "inline",
    treeShaking: true,
    minify: prod,

    entryPoints: ["src/main.ts"],
    outfile: "dist/main.js",
    external: [
        "obsidian",
        ...builtinModules],
});

if (prod) {
    await context.rebuild();
    process.exit(0);
} else {
    await context.watch();
}
