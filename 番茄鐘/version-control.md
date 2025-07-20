# 番茄鐘應用版本控制記錄

由於未安裝Git，此文件用於手動記錄項目的版本變更。

## 版本歷史

### v1.0.0 - 初始版本 (當前日期)

**新增功能:**
- 創建基本番茄鐘應用原型
- 實現四個主要頁面：計時器、任務管理、統計分析、設置
- 使用純HTML和CSS實現進度條
- 添加JavaScript功能使計時器可以實際運作
- 響應式設計，適配不同屏幕尺寸

**技術細節:**
- HTML5 + CSS3
- 使用FontAwesome圖標
- Google Fonts (Roboto, Noto Sans TC)
- 使用SVG實現圓形進度條

## 如何安裝Git

要在您的系統上安裝Git，請按照以下步驟操作：

### Windows

1. 訪問 [git-scm.com](https://git-scm.com/download/win)
2. 下載Windows版Git安裝程序
3. 運行安裝程序，按照指示完成安裝
4. 安裝完成後，打開命令提示符或PowerShell，輸入 `git --version` 確認安裝成功

### macOS

1. 使用Homebrew安裝：`brew install git`
2. 或訪問 [git-scm.com](https://git-scm.com/download/mac) 下載安裝程序
3. 安裝完成後，打開終端，輸入 `git --version` 確認安裝成功

### Linux

使用包管理器安裝：
- Debian/Ubuntu: `sudo apt-get install git`
- Fedora: `sudo dnf install git`
- CentOS/RHEL: `sudo yum install git`

## 安裝Git後的初始設置

安裝Git後，請執行以下命令進行初始設置：

```bash
# 設置用戶名和電子郵件
git config --global user.name "您的名字"
git config --global user.email "您的電子郵件"

# 初始化Git倉庫
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "初始提交"
```

如需連接到遠程倉庫（如GitHub），請執行：

```bash
git remote add origin <倉庫URL>
git push -u origin main
``` 