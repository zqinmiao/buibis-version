#!/usr/bin/env node

import { program } from "commander";

import { publishNpm, publishNpmGit, changelog } from "./commands/publish";

const packageJson = require("../package.json");

program.version(packageJson.version);

program
  .option("-r, --release [target]", "自动化发布npm包")
  .option("-p, --publish [target]", "自动化发布npm包并提交git")
  .option("-log, --changelog [target]", "自动更新版本并生CHANGELOG.md")
  .option("-lt, --changelogTag [target]", "自动更新版本并生CHANGELOG.md、打Git标签")
  .action(p => {
    if (p.release) {
      const target = typeof p.release === "boolean" ? "/" : `/${p.release}/`;
      publishNpm(target);
    } else if (p.publish) {
      const target = typeof p.publish === "boolean" ? "/" : `/${p.publish}/`;
      publishNpmGit(target);
    } else if (p.changelog) {
      const target = typeof p.changelog === "boolean" ? "/" : `/${p.changelog}/`;
      changelog(target);
    } else if (p.changelogTag) {
      const target = typeof p.changelogTag === "boolean" ? "/" : `/${p.changelogTag}/`;
      changelog(target, { tag: true });
    }
  });

program.on("--help", () => {
  console.log("");
  console.log("Basic configuration:");
  console.log("  --release [target]       自动化发布npm包");
  console.log("            [target]       目标目录");
  console.log("  --publish [target]       自动化发布npm包并提交git");
  console.log("  --changelog [target]     自动更新版本并生CHANGELOG.md");
  console.log("  --changelogTag [target]  自动更新版本并生CHANGELOG.md、打Git标签");
});

program.parse(process.argv);
