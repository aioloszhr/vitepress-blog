# Git

记录`Git`的一些相关知识

## 常用命令

- 初始化一个仓库：`git init`
- 查看分支：`git branch`
- 修改分支名称: `git branch -m <name>`
- 将已修改或未跟踪的文件添加到暂存区: `git add[file]` 或 `git add .`
- 提交至本地仓库: `git commit -m "提交记录xxx"`
- 本地分支推送到远程分支: `git push`
- 查看当前工作目录和暂存区的状态: `git status`
- 查看提交的日志记录: `git log`
- 从远程分支拉取代码: `git pull`
- 合并某分支（xxx）到当前分支: `git merge xxx`
- 切换到分支xxx: `git checkout xxx`
- 创建分支xxx并切换到该分支: `git checkout -b xxx`
- 删除分支xxx: `git branch -d xxx`
- 将当前分支改动保存到堆栈中: `git stash`
- 恢复堆栈中缓存的改动内容：`git stash pop`
- 删除全局配置项：`git config --global --unset <配置项名称>`
- 添加全局配置：`git config --global <配置项名称> <配置项的值>`

## git merge 和git rebase的区别

相同点：

`git merge` 和 `git rebase` 两个命令都用于从一个分支获取内容并合并到当前分支

不同点：

1. git merge会⾃动创建⼀个新的commit，如果合并时遇到冲突的话，只需要修改后重新commit。

- 优点：能记录真实的commit情况，包括每个分⽀的详情
- 缺点：由于每次merge会⾃动产⽣⼀个commit，因此在使用⼀些可视化的git工具时会看到这些自动产生的commit，这些commit对于程序员来说没有什么特别的意义，多了反而会影响阅读。

2. git rebase会合并之前的commit历史。

- 优点：可以得到更简洁的提交历史，去掉了merge 产生的commit
- 缺点：因为合并而产生的代码问题，就不容易定位，因为会重写提交历史信息

场景：

- 当需要保留详细的合并信息，建议使⽤git merge, 尤其是要合并到master上
- 当发现⾃⼰修改某个功能时提交比较频繁，并觉得过多的合并记录信息对自己来说没有必要，那么可尝试使用git rebase

## 下载项目代码（以 github 为例）

- --depth=1 是下载单个 commit。
- --single-branch 是下载单个分支。

```bash
git clone --depth=1 --single-branch git@github.com:ant-design/ant-design.git
```

## 本地初始化 `git` 项目并和远程分支关联

```bash
# 初始化 Git 仓库
git init

# 添加所有文件到仓库
git add .

# 提交更改
git commit -m "Initial commit"

# 关联到远程仓库
git remote add origin <remote>

# 推送到远程仓库
git push -u origin main
```
