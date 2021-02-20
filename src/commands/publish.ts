const shell = require("shelljs");
const colors = require("colors");
const semver = require("semver");
import { prompt } from "inquirer";

let packageJson = require("../../package.json");

// 当前版本号
let currentVersion = `${packageJson.version}`;

/**
 * 将当前版本作为一个新标签提交至远程仓库
 */
async function pushGit() {
  console.log(colors.green("\n开始提交至 Git"));
  shell.exec(`git push origin v${currentVersion}`);
  shell.exec(`git push`);
}

/**
 * 更新版本号
 */
async function updateVersion(): Promise<void> {
  const { version } = await prompt([
    {
      type: "input",
      name: "version",
      message: `当前版本「${colors.green(packageJson.version)}」\n请输入新的版本号，语义化版本号请参考：${colors.blue(
        "https://semver.org/lang/zh-CN/",
      )}\n版本号(跳过按回车)：`,
    },
  ]);

  // 跳过版本号输入
  if (!version) {
    currentVersion = `${packageJson.version}`;
    return Promise.resolve();
  }

  // 校验版本号格式
  if (!semver.valid(version)) {
    console.log(colors.red("版本号格式错误，请重新输入"));
    return await updateVersion();
  }

  if (packageJson.version === version) {
    console.log(colors.red("版本号已存在，请重新输入"));
    return await updateVersion();
  }

  currentVersion = `${version}`;

  // 更改版本号
  const child = shell.exec(`npm --no-git-tag-version --no-git-commit-version version ${currentVersion}`);
  if (child.code >= 1) {
    process.exit(1);
  }
  return Promise.resolve();
}

async function generateChangelog(tag?: boolean) {
  console.log(colors.green("开始生成 CHANGELOG.md"));
  // 生成changelog，并与上次的git commit合并
  shell.exec(`npx conventional-changelog -p angular -i CHANGELOG.md -s -r`);

  // 需要打tag
  if (tag) {
    shell.exec(`git add .`);
    shell.exec(`git commit -m "chore(release): ${currentVersion}"`);
    shell.exec(`git tag -a v${currentVersion} -m "release: ${currentVersion}"`);
  }
}

// 当前的registry
let currentRegistry = "";

/**
 * 更改npm registry
 * @param reset 重置回之前的registry
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function changeNpmRegistry(reset?: boolean) {
  if (reset) {
    return shell.exec(`npm config set registry=${currentRegistry}`);
  }
  const child = shell.exec("npm config get registry");
  currentRegistry = child.stdout.trim();
  if (currentRegistry !== "https://registry.npmjs.org/") {
    shell.exec(`npm config set registry=https://registry.npmjs.org`);
  }
  return;
}

// 发布到npm
async function publish(target: string) {
  console.log(colors.green("\n开始发布至 npm"));
  // shell.exec(`npm pack .${target}`);
  const child = shell.exec(`npm publish .${target}`);

  if (child.code >= 1) {
    process.exit(1);
  }
}

export const publishNpm = async (target: string): Promise<void> => {
  packageJson = require(`${process.cwd()}${target}package.json`);
  return updateVersion()
    .then(() => generateChangelog(true))
    .then(() => publish(target))
    .then(() => {
      process.exit(0);
    });
};

export const publishNpmGit = async (target: string): Promise<void> => {
  packageJson = require(`${process.cwd()}${target}package.json`);
  return updateVersion()
    .then(() => generateChangelog(true))
    .then(() => publish(target))
    .then(() => pushGit())
    .then(() => {
      process.exit(0);
    });
};

export const changelog = async (target: string, options?: { tag: boolean }): Promise<void> => {
  packageJson = require(`${process.cwd()}${target}package.json`);
  return updateVersion()
    .then(() => generateChangelog(options?.tag))
    .then(() => {
      process.exit(0);
    });
};
