import { build, emptyDir } from "https://deno.land/x/dnt@0.37.0/mod.ts";
import pkg from "./deno.json" assert { type: "json" };

await emptyDir("./npm");

await build({
  entryPoints: ["./src/index.ts"],
  outDir: "./.npm",
  shims: {
    deno: false,
  },
  scriptModule: 'cjs',
  typeCheck: false,
  test: false,
  package: {
    name: "@orama/crawly",
    version: pkg.version,
    description: "General purpose crawler for web pages",
    license: "Apache 2.0",
    repository: {
      type: "git",
      url: "git+https://github.com/askorama/crawly",
    },
    bugs: {
      url: "https://github.com/askorama/crawly/issues",
    },
    author: {
      name: "Michele Riva",
      url: "https://github.com/MicheleRiva"
    }
  },
  postBuild() {
    Deno.copyFileSync("LICENSE.md", ".npm/LICENSE.md");
    Deno.copyFileSync("README.md", ".npm/README.md");
  },
});