# 问题

以下记录平时使用 git 遇到的问题。

## 本地分支和远程没有建立关联

**报警信息**

```zsh
There is no tracking information for the current brach.
Please specify which branch you want to.
```

**解决方法**：

```zsh
git branch --set-upstream-to=origin/<branch> <local-branch>
```

**即**：

```zsh
git branch --set-upstream-to=origin/dev dev
```

最后，再通过 `git branch -vv` 查看是否关联成功。
