# 常用命令

## 修改分支名称

```bash
git branch -m <name>
```

## 创建并切换到新分支

```bash
 git checkout -b <new-branch-name>
```

## 切换到指定分支

```bash
 git checkout <branch-name>
```

## 下载项目代码（以 github 为例）

- --depth=1 是下载单个 commit。
- --single-branch 是下载单个分支。

```bash
git clone --depth=1 --single-branch git@github.com:ant-design/ant-design.git
```
