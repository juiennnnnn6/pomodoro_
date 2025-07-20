# Git 操作指南

## 基本操作

### 檢查狀態
```bash
git status
```

### 添加文件
```bash
# 添加單個文件
git add 文件名

# 添加所有更改
git add .
```

### 提交更改
```bash
git commit -m "提交信息"
```

### 推送到遠程倉庫
```bash
git push origin master
```

### 從遠程倉庫拉取更新
```bash
git pull origin master
```

## 分支操作

### 查看所有分支
```bash
git branch
```

### 創建新分支
```bash
git branch 分支名
```

### 切換分支
```bash
git checkout 分支名
```

### 創建並切換到新分支
```bash
git checkout -b 分支名
```

### 合併分支
```bash
# 先切換到目標分支
git checkout master
# 然後合併其他分支
git merge 分支名
```

### 刪除分支
```bash
# 刪除本地分支
git branch -d 分支名

# 刪除遠程分支
git push origin --delete 分支名
```

## 其他常用操作

### 查看提交歷史
```bash
git log
```

### 查看特定文件的變更
```bash
git diff 文件名
```

### 撤銷工作區的修改
```bash
git checkout -- 文件名
```

### 撤銷已暫存的修改
```bash
git reset HEAD 文件名
```

### 為倉庫添加遠程地址
```bash
git remote add origin 倉庫URL
```

### 查看遠程倉庫
```bash
git remote -v
```

## Git 配置

### 設置用戶信息
```bash
git config --global user.name "您的名字"
git config --global user.email "您的郵箱"
```

### 查看配置
```bash
git config --list
```

## 提示

1. 使用 `git status` 查看當前狀態是一個好習慣
2. 提交前先 `git pull` 以避免衝突
3. 提交信息應該簡潔明了，描述清楚本次更改的內容
4. 定期推送到遠程倉庫以備份您的工作 