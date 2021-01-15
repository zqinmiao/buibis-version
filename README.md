# buibis-version

自动化版本控制 CLI，自动化生成版本号、CHANGELOG.md、发布 npm 包、生成标签、提交至远程 Git

## 安装

### 安装

```sh
npm i --save-dev @buibis/buibis-version
```

### 在 package.json 中增加 script

```javascript
{
  "scripts": {
    "release": "buibis-version -p"
  }
}
```

## CLI 使用

```bash
# 自动化发布npm包
buibis-version -p
# 自动化发布npm包并提交git
buibis-version -pp
# 自动更新版本并生CHANGELOG.md
buibis-version -ch
```

### 配置

```bash
--publish [target]       自动化发布npm包
          [target]       目标目录
--pp [target]            自动化发布npm包并提交git
     [target]            目标目录
--changelog [target]     自动更新版本并生CHANGELOG.md
            [target]     目标目录
```

```bash
# changelog支持的commit类型：
"types": [
    {"type": "feat", "section": "Features"},
    {"type": "fix", "section": "Bug Fixes"},
    {"type": "chore", "hidden": true},
    {"type": "docs", "hidden": true},
    {"type": "style", "hidden": true},
    {"type": "refactor", "hidden": true},
    {"type": "perf", "hidden": true},
    {"type": "test", "hidden": true}
]
```

## 社区相关的工具

虽然社区的工具已经很强大。但是这些工具个人感觉用起来稍微不习惯。学习了它们的思路后，就抽时间写了这个简单的工具，算是学以致用吧。

- [staard-version](https://github.com/conventional-changelog/standard-version)：自动化版本控制和变更日志生成

* [conventional-changelog（生成 changelog）](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog)

* [conventional-changelog-cli](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-cli)：仅仅生成 changelog 的 CLI
