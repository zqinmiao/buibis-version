#!/usr/bin/env node

import { program } from "commander";

import { publishNpm, publishNpmGit, changelog } from "./commands/publish";

const packageJson = require("../package.json");

program.version(packageJson.version);

program
  .option("-p, --publish [target]", "自动化发布npm包")
  .option("-pp, --pp [target]", "自动化发布npm包并提交git")
  .option("-ch, --changelog [target]", "自动更新版本并生CHANGELOG.md")
  .action(p => {
    if (p.publish) {
      const target = typeof p.publish === "boolean" ? "/" : `/${p.publish}/`;
      publishNpm(target);
    } else if (p.pp) {
      const target = typeof p.pp === "boolean" ? "/" : `/${p.pp}/`;
      publishNpmGit(target);
    } else if (p.changelog) {
      const target = typeof p.changelog === "boolean" ? "/" : `/${p.changelog}/`;
      changelog(target);
    }
  });

program.on("--help", () => {
  console.log("");
  console.log("Basic configuration:");
  console.log("  --publish [target]       自动化发布npm包");
  console.log("            [target]       目标目录");
  console.log("  --pp [target]            自动化发布npm包并提交git");
  console.log("       [target]            目标目录");
  console.log("  --changelog [target]     自动更新版本并生CHANGELOG.md");
  console.log("              [target]     目标目录");
});

program.parse(process.argv);
