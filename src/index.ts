#!/usr/bin/env node

import { program } from "commander";
const shell = require("shelljs");

import { publishNpm, publishNpmGit, changelog } from "./commands/publish";

const packageJson = require("../package.json");

export let registry = "https://registry.npmjs.org/";

program.version(packageJson.version);

program
  .option("-r, --release [target]", "自动化发布npm包")
  .option("-p, --publish [target]", "自动化发布npm包并提交git")
  .option("-log, --changelog [target]", "自动更新版本并生CHANGELOG.md")
  .option("-lt, --changelogTag [target]", "自动更新版本并生CHANGELOG.md、打Git标签")
  .option("-reg, --registry [registry]", "设置registry")
  .option("-sync, --sync [origin]", "同步镜像源")
  .action(async p => {
    // 如果存在registry，则需更改registry
    if (p.registry && typeof p.registry === "string") {
      registry = p.registry;
    }

    if (p.release) {
      const target = typeof p.release === "boolean" ? "/" : `/${p.release}/`;
      await publishNpm(target);
    } else if (p.publish) {
      const target = typeof p.publish === "boolean" ? "/" : `/${p.publish}/`;
      await publishNpmGit(target);
    } else if (p.changelog) {
      const target = typeof p.changelog === "boolean" ? "/" : `/${p.changelog}/`;
      await changelog(target);
    } else if (p.changelogTag) {
      const target = typeof p.changelogTag === "boolean" ? "/" : `/${p.changelogTag}/`;
      await changelog(target, { tag: true });
    }

    // 如果存在镜像源，同步镜像源
    if (p.sync) {
      const origin =
        typeof p.sync === "boolean"
          ? `https://npm.taobao.org/sync/${packageJson.name}`
          : `${p.sync}${packageJson.name}`;
      shell.exec(`curl -X PUT ${origin}`);
    }
  });

// program.on("--help", () => {
//   console.log("");
//   console.log("Basic configuration:");
//   console.log("  --release [target]       自动化发布npm包");
//   console.log("            [target]       目标目录");
//   console.log("  --publish [target]       自动化发布npm包并提交git");
//   console.log("  --changelog [target]     自动更新版本并生CHANGELOG.md");
//   console.log("  --changelogTag [target]  自动更新版本并生CHANGELOG.md、打Git标签");
// });

program.parse(process.argv);
