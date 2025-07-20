// 番茄鐘應用核心功能
const PomodoroApp = {
    // 數據存儲
    data: {
        // 計時器設置
        timerSettings: {
            focus: 25 * 60, // 專注時間（秒）
            shortBreak: 5 * 60, // 短休息時間（秒）
            longBreak: 15 * 60, // 長休息時間（秒）
            autoStartBreaks: true, // 自動開始休息
            autoStartPomodoros: false, // 自動開始番茄鐘
            longBreakInterval: 4, // 長休息間隔（番茄鐘數）
            alarmSound: 'default', // 鬧鐘聲音
            alarmVolume: 0.8, // 鬧鐘音量
            tickingSound: 'none', // 滴答聲
            tickingVolume: 0.5 // 滴答聲音量
        },
        
        // 當前計時器狀態
        timer: {
            duration: 25 * 60, // 當前計時器持續時間（秒）
            remaining: 25 * 60, // 剩餘時間（秒）
            isRunning: false, // 是否正在運行
            mode: 'focus', // 當前模式：focus, shortBreak, longBreak
            completedPomodoros: 0, // 已完成的番茄鐘數量
            pomodoroGoal: 8, // 每日目標番茄鐘數量
            currentTask: null, // 當前任務ID
            lastUpdated: Date.now() // 最後更新時間
        },
        
        // 任務列表
        tasks: [],
        
        // 統計數據
        stats: {
            dailyPomodoros: {}, // 每日番茄鐘數量，格式：{ "2023-07-10": 5 }
            weeklyPomodoros: {}, // 每週番茄鐘數量
            monthlyPomodoros: {}, // 每月番茄鐘數量
            totalPomodoros: 0, // 總番茄鐘數量
            totalFocusTime: 0, // 總專注時間（秒）
            streaks: 0 // 連續使用天數
        },
        
        // 使用者資料
        user: null,
        
        // 所有使用者
        users: []
    },
    
    // 預設使用者
    defaultUsers: [
        {
            id: '1',
            name: '測試使用者',
            email: 'test@example.com',
            password: 'password123',
            avatar: '#4285F4'
        },
        {
            id: '2',
            name: '管理員',
            email: 'admin@example.com',
            password: 'admin123',
            avatar: '#EA4335'
        }
    ],
    
    // 初始化應用
    init() {
        this.loadData();
        this.setupEventListeners();
        this.checkLoginStatus();
        this.applyThemeColor(); // 應用主題顏色
    },
    
    // 檢查登入狀態
    checkLoginStatus() {
        // 檢查是否需要登入
        const currentPath = window.location.pathname;
        const loginRequired = !currentPath.includes('login.html') && !currentPath.includes('register.html');
        
        // 如果已登入，則載入使用者資料
        const savedUser = localStorage.getItem('pomodoroUser');
        if (savedUser) {
            this.data.user = JSON.parse(savedUser);
        }
        
        // 如果需要登入但未登入，則跳轉到登入頁面
        if (loginRequired && !this.data.user) {
            window.location.href = 'login.html';
        }
    },
    
    // 根據用戶名生成頭像顏色
    getUserColor(name) {
        // 預設顏色列表
        const colors = [
            '#4285F4', // Google 藍
            '#EA4335', // Google 紅
            '#FBBC05', // Google 黃
            '#34A853', // Google 綠
            '#5F6368', // Google 灰
            '#8ab4f8', // 淺藍
            '#F6AE2D', // 橙黃
            '#F26419', // 橙紅
            '#55DDE0', // 淺綠藍
            '#33658A', // 深藍
            '#2F4858', // 深灰藍
            '#F06543', // 珊瑚紅
            '#3BCEAC', // 薄荷綠
            '#EE6352', // 淺紅
            '#59CD90', // 翠綠
            '#3FA7D6', // 天藍
            '#FAC05E', // 金黃
            '#F79256', // 橙色
            '#7DCFB6', // 薄荷色
            '#00B2CA'  // 藍綠
        ];

        // 如果用戶已有設置的顏色，則返回該顏色
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.avatar && currentUser.avatar.startsWith('#')) {
            return currentUser.avatar;
        }
        
        // 根據用戶名生成一個數字，用於選擇顏色
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // 使用這個數字選擇一個顏色
        const index = Math.abs(hash) % colors.length;
        return colors[index];
    },
    
    // 註冊功能
    register(name, email, password, avatarColor) {
        // 加載所有使用者
        this.loadUsers();
        
        // 檢查郵箱是否已被使用
        if (this.data.users.some(u => u.email === email) || this.defaultUsers.some(u => u.email === email)) {
            return false;
        }
        
        // 生成唯一ID
        const userId = 'user_' + Date.now();
        
        // 創建新使用者
        const newUser = {
            id: userId,
            name: name,
            email: email,
            password: password,
            avatar: avatarColor || '#4285F4',
            createdAt: new Date().toISOString()
        };
        
        // 添加到使用者列表
        this.data.users.push(newUser);
        
        // 保存使用者列表
        this.saveUsers();
        
        // 自動登入
        const userData = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar
        };
        
        // 保存使用者資料
        this.data.user = userData;
        localStorage.setItem('pomodoroUser', JSON.stringify(userData));
        
        return true;
    },
    
    // 加載所有使用者
    loadUsers() {
        const savedUsers = localStorage.getItem('pomodoroUsers');
        if (savedUsers) {
            this.data.users = JSON.parse(savedUsers);
        } else {
            this.data.users = [];
        }
    },
    
    // 保存所有使用者
    saveUsers() {
        localStorage.setItem('pomodoroUsers', JSON.stringify(this.data.users));
    },
    
    // 登入功能
    login(email, password, rememberMe = false) {
        // 加載所有使用者
        this.loadUsers();
        
        // 在預設使用者和註冊使用者中查找匹配的使用者
        let user = this.defaultUsers.find(u => u.email === email && u.password === password);
        
        if (!user) {
            user = this.data.users.find(u => u.email === email && u.password === password);
        }
        
        if (user) {
            // 創建使用者資料（不包含密碼）
            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            };
            
            // 保存使用者資料
            this.data.user = userData;
            localStorage.setItem('pomodoroUser', JSON.stringify(userData));
            
            // 如果選擇記住我，則設置長期 cookie
            if (rememberMe) {
                // 設置 cookie，有效期 30 天
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30);
                document.cookie = `pomodoroUser=${JSON.stringify(userData)}; expires=${expiryDate.toUTCString()}; path=/`;
            }
            
            return true;
        }
        
        return false;
    },
    
    // 社群登入功能
    socialLogin(provider, userData) {
        if (!userData || !userData.email) {
            return false;
        }
        
        // 加載所有使用者
        this.loadUsers();
        
        // 檢查用戶是否已存在
        let user = this.data.users.find(u => u.email === userData.email);
        
        // 如果用戶不存在，則創建新用戶
        if (!user) {
            // 生成唯一ID
            const userId = 'user_' + Date.now();
            
            // 創建新使用者
            user = {
                id: userId,
                name: userData.name || userData.email.split('@')[0],
                email: userData.email,
                avatar: userData.avatar || this.getRandomAvatarColor(),
                socialProvider: provider,
                socialId: userData.id || '',
                createdAt: new Date().toISOString()
            };
            
            // 添加到使用者列表
            this.data.users.push(user);
            
            // 保存使用者列表
            this.saveUsers();
        } else {
            // 更新社群登入資訊
            user.socialProvider = provider;
            user.socialId = userData.id || user.socialId || '';
            
            // 如果沒有頭像，則使用社群頭像
            if (userData.avatar && (!user.avatar || user.avatar === this.getRandomAvatarColor())) {
                user.avatar = userData.avatar;
            }
            
            // 保存使用者列表
            this.saveUsers();
        }
        
        // 創建使用者資料（不包含密碼）
        const userDataToSave = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            socialProvider: provider
        };
        
        // 保存使用者資料
        this.data.user = userDataToSave;
        localStorage.setItem('pomodoroUser', JSON.stringify(userDataToSave));
        
        // 設置長期 cookie（社群登入默認記住我）
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        document.cookie = `pomodoroUser=${JSON.stringify(userDataToSave)}; expires=${expiryDate.toUTCString()}; path=/`;
        
        return true;
    },
    
    // 獲取隨機頭像顏色
    getRandomAvatarColor() {
        const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#9C27B0'];
        return colors[Math.floor(Math.random() * colors.length)];
    },
    
    // 登出功能
    logout() {
        // 清除使用者資料
        this.data.user = null;
        localStorage.removeItem('pomodoroUser');
        
        // 清除 cookie
        document.cookie = 'pomodoroUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // 跳轉到登入頁面
        window.location.href = 'login.html';
    },
    
    // 管理員登入功能
    adminLogin(username, password) {
        // 管理員帳號
        const adminCredentials = {
            username: 'admin',
            password: 'admin123'
        };
        
        // 驗證管理員憑證
        if (username === adminCredentials.username && password === adminCredentials.password) {
            // 保存管理員登入狀態
            localStorage.setItem('adminLoggedIn', 'true');
            return true;
        }
        
        return false;
    },
    
    // 檢查是否為管理員
    isAdmin() {
        return localStorage.getItem('adminLoggedIn') === 'true';
    },
    
    // 管理員登出
    adminLogout() {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    },
    
    // 註銷（刪除）帳號功能
    deleteAccount() {
        if (!this.data.user) {
            return false;
        }
        
        // 獲取當前用戶ID
        const userId = this.data.user.id;
        
        // 加載所有使用者
        this.loadUsers();
        
        // 查找使用者在列表中的索引
        const userIndex = this.data.users.findIndex(u => u.id === userId);
        
        // 如果找到使用者，則從列表中刪除
        if (userIndex !== -1) {
            this.data.users.splice(userIndex, 1);
            this.saveUsers();
            
            // 清除該使用者的所有任務數據
            this.data.tasks = this.data.tasks.filter(task => task.userId !== userId);
            this.saveData('tasks');
            
            // 清除該使用者的統計數據
            // 如果統計數據是按使用者分開存儲的，則刪除相應的統計數據
            
            // 登出使用者
            this.logout();
            
            return true;
        }
        
        return false;
    },
    
    // 檢查是否已登入
    isLoggedIn() {
        return this.data.user !== null;
    },
    
    // 獲取當前使用者資料
    getCurrentUser() {
        return this.data.user;
    },
    
    // 更新使用者資料
    updateUserProfile(userData) {
        if (!this.data.user) {
            return false;
        }
        
        // 更新使用者資料
        this.data.user = { ...this.data.user, ...userData };
        localStorage.setItem('pomodoroUser', JSON.stringify(this.data.user));
        
        // 如果是註冊使用者，同時更新使用者列表
        this.loadUsers();
        const userIndex = this.data.users.findIndex(u => u.id === this.data.user.id);
        if (userIndex !== -1) {
            // 更新除密碼外的資料
            const { password, ...userDataWithoutPassword } = userData;
            this.data.users[userIndex] = { 
                ...this.data.users[userIndex], 
                ...userDataWithoutPassword 
            };
            this.saveUsers();
        }
        
        // 觸發使用者資料更新事件
        const event = new CustomEvent('userProfileUpdated', {
            detail: { user: this.data.user }
        });
        document.dispatchEvent(event);
        
        return true;
    },
    
    // 從本地存儲加載數據
    loadData() {
        // 加載計時器設置
        const savedSettings = localStorage.getItem('pomodoroSettings');
        if (savedSettings) {
            this.data.timerSettings = JSON.parse(savedSettings);
        }
        
        // 加載計時器狀態
        const savedTimer = localStorage.getItem('pomodoroTimer');
        if (savedTimer) {
            const timerData = JSON.parse(savedTimer);
            
            // 檢查是否是今天的數據
            const lastUpdated = new Date(timerData.lastUpdated);
            const today = new Date();
            
            if (lastUpdated.getDate() === today.getDate() && 
                lastUpdated.getMonth() === today.getMonth() && 
                lastUpdated.getFullYear() === today.getFullYear()) {
                
                // 如果是今天的數據，則加載
                this.data.timer = timerData;
                
                // 如果計時器正在運行，則更新剩餘時間
                if (timerData.isRunning) {
                    const elapsedTime = Math.floor((Date.now() - timerData.lastUpdated) / 1000);
                    this.data.timer.remaining = Math.max(0, timerData.remaining - elapsedTime);
                    this.data.timer.isRunning = false; // 重新加載時暫停計時器
                }
            } else {
                // 如果不是今天的數據，則重置計時器，但保留設置和統計數據
                this.data.timer.remaining = this.data.timerSettings.focus;
                this.data.timer.duration = this.data.timerSettings.focus;
                this.data.timer.isRunning = false;
                this.data.timer.mode = 'focus';
                this.data.timer.completedPomodoros = 0;
                this.data.timer.lastUpdated = Date.now();
            }
        }
        
        // 加載任務列表
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            this.data.tasks = JSON.parse(savedTasks);
        } else {
            // 默認任務
            this.data.tasks = [
                {
                    id: 'task1',
                    name: '完成網頁設計項目',
                    category: 'work',
                    pomodoros: 4,
                    completedPomodoros: 2,
                    date: new Date().toISOString().split('T')[0],
                    priority: 'important',
                    completed: false
                },
                {
                    id: 'task2',
                    name: '學習JavaScript基礎',
                    category: 'study',
                    pomodoros: 3,
                    completedPomodoros: 1,
                    date: new Date().toISOString().split('T')[0],
                    priority: 'normal',
                    completed: false
                }
            ];
            this.saveData('tasks');
        }
        
        // 加載統計數據
        const savedStats = localStorage.getItem('pomodoroStats');
        if (savedStats) {
            this.data.stats = JSON.parse(savedStats);
        }
        
        // 加載使用者資料
        const savedUser = localStorage.getItem('pomodoroUser');
        if (savedUser) {
            this.data.user = JSON.parse(savedUser);
        }
        
        // 加載所有使用者
        this.loadUsers();
    },
    
    // 保存數據到本地存儲
    saveData(dataType = 'all') {
        if (dataType === 'all' || dataType === 'settings') {
            localStorage.setItem('pomodoroSettings', JSON.stringify(this.data.timerSettings));
        }
        
        if (dataType === 'all' || dataType === 'timer') {
            // 更新最後更新時間
            this.data.timer.lastUpdated = Date.now();
            localStorage.setItem('pomodoroTimer', JSON.stringify(this.data.timer));
        }
        
        if (dataType === 'all' || dataType === 'tasks') {
            localStorage.setItem('tasks', JSON.stringify(this.data.tasks));
        }
        
        if (dataType === 'all' || dataType === 'stats') {
            localStorage.setItem('pomodoroStats', JSON.stringify(this.data.stats));
        }
    },
    
    // 設置事件監聽器
    setupEventListeners() {
        // 在這裡可以添加全局事件監聽器
        window.addEventListener('beforeunload', () => {
            // 頁面關閉前保存數據
            this.saveData();
        });
        
        // 自定義事件：計時器完成
        document.addEventListener('pomodoroCompleted', (e) => {
            this.handlePomodoroCompleted(e.detail);
        });
        
        // 自定義事件：任務更新
        document.addEventListener('taskUpdated', (e) => {
            this.handleTaskUpdated(e.detail);
        });
    },
    
    // 格式化時間（秒 -> MM:SS）
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    },
    
    // 獲取今天的日期字符串（YYYY-MM-DD）
    getTodayString() {
        return new Date().toISOString().split('T')[0];
    },
    
    // 獲取當前週的字符串（YYYY-WW）
    getCurrentWeekString() {
        const now = new Date();
        const onejan = new Date(now.getFullYear(), 0, 1);
        const weekNum = Math.ceil((((now - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        return `${now.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
    },
    
    // 獲取當前月的字符串（YYYY-MM）
    getCurrentMonthString() {
        const now = new Date();
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    },
    
    // 處理番茄鐘完成事件
    handlePomodoroCompleted(data) {
        // 更新統計數據
        const today = this.getTodayString();
        const week = this.getCurrentWeekString();
        const month = this.getCurrentMonthString();
        
        // 更新每日番茄鐘數量
        if (!this.data.stats.dailyPomodoros[today]) {
            this.data.stats.dailyPomodoros[today] = 0;
        }
        this.data.stats.dailyPomodoros[today]++;
        
        // 更新每週番茄鐘數量
        if (!this.data.stats.weeklyPomodoros[week]) {
            this.data.stats.weeklyPomodoros[week] = 0;
        }
        this.data.stats.weeklyPomodoros[week]++;
        
        // 更新每月番茄鐘數量
        if (!this.data.stats.monthlyPomodoros[month]) {
            this.data.stats.monthlyPomodoros[month] = 0;
        }
        this.data.stats.monthlyPomodoros[month]++;
        
        // 更新總番茄鐘數量和總專注時間
        this.data.stats.totalPomodoros++;
        this.data.stats.totalFocusTime += this.data.timerSettings.focus;
        
        // 更新連續使用天數
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        if (this.data.stats.dailyPomodoros[yesterdayString]) {
            this.data.stats.streaks++;
        } else if (!this.data.stats.streaks) {
            this.data.stats.streaks = 1;
        }
        
        // 如果有關聯的任務，則更新任務的已完成番茄鐘數
        if (data.taskId) {
            const taskIndex = this.data.tasks.findIndex(task => task.id === data.taskId);
            if (taskIndex !== -1) {
                this.data.tasks[taskIndex].completedPomodoros++;
                
                // 如果已完成番茄鐘數等於總番茄鐘數，則標記任務為已完成
                if (this.data.tasks[taskIndex].completedPomodoros >= this.data.tasks[taskIndex].pomodoros) {
                    this.data.tasks[taskIndex].completed = true;
                }
                
                this.saveData('tasks');
            }
        }
        
        this.saveData('stats');
    },
    
    // 處理任務更新事件
    handleTaskUpdated(data) {
        // 根據更新類型處理任務更新
        switch (data.type) {
            case 'add':
                this.data.tasks.push(data.task);
                break;
                
            case 'update':
                const taskIndex = this.data.tasks.findIndex(task => task.id === data.task.id);
                if (taskIndex !== -1) {
                    this.data.tasks[taskIndex] = data.task;
                }
                break;
                
            case 'delete':
                const deleteIndex = this.data.tasks.findIndex(task => task.id === data.taskId);
                if (deleteIndex !== -1) {
                    this.data.tasks.splice(deleteIndex, 1);
                }
                break;
                
            case 'complete':
                const completeIndex = this.data.tasks.findIndex(task => task.id === data.taskId);
                if (completeIndex !== -1) {
                    this.data.tasks[completeIndex].completed = true;
                    this.data.tasks[completeIndex].completedPomodoros = this.data.tasks[completeIndex].pomodoros;
                }
                break;
        }
        
        this.saveData('tasks');
    },
    
    // 獲取任務列表
    getTasks(filter = {}) {
        let filteredTasks = [...this.data.tasks];
        
        // 根據過濾條件過濾任務
        if (filter.category) {
            if (filter.category === 'today') {
                const today = this.getTodayString();
                filteredTasks = filteredTasks.filter(task => task.date === today);
            } else if (filter.category === 'important') {
                filteredTasks = filteredTasks.filter(task => task.priority === 'important');
            } else {
                filteredTasks = filteredTasks.filter(task => task.category === filter.category);
            }
        }
        
        if (filter.completed !== undefined) {
            filteredTasks = filteredTasks.filter(task => task.completed === filter.completed);
        }
        
        // 排序
        if (filter.sort === 'priority') {
            filteredTasks.sort((a, b) => {
                if (a.priority === 'important' && b.priority !== 'important') return -1;
                if (a.priority !== 'important' && b.priority === 'important') return 1;
                return 0;
            });
        } else if (filter.sort === 'date') {
            filteredTasks.sort((a, b) => {
                if (!a.date) return 1;
                if (!b.date) return -1;
                return new Date(a.date) - new Date(b.date);
            });
        }
        
        return filteredTasks;
    },
    
    // 獲取當前任務
    getCurrentTask() {
        if (this.data.timer.currentTask) {
            return this.data.tasks.find(task => task.id === this.data.timer.currentTask);
        }
        
        // 如果沒有設置當前任務，則返回第一個未完成的任務
        return this.data.tasks.find(task => !task.completed);
    },
    
    // 設置當前任務
    setCurrentTask(taskId) {
        this.data.timer.currentTask = taskId;
        this.saveData('timer');
        
        // 觸發任務更改事件
        const event = new CustomEvent('currentTaskChanged', {
            detail: { taskId }
        });
        document.dispatchEvent(event);
    },
    
    // 獲取統計數據
    getStats(period = 'all') {
        switch (period) {
            case 'today':
                const today = this.getTodayString();
                return {
                    pomodoros: this.data.stats.dailyPomodoros[today] || 0,
                    focusTime: (this.data.stats.dailyPomodoros[today] || 0) * this.data.timerSettings.focus
                };
                
            case 'week':
                const week = this.getCurrentWeekString();
                return {
                    pomodoros: this.data.stats.weeklyPomodoros[week] || 0,
                    focusTime: (this.data.stats.weeklyPomodoros[week] || 0) * this.data.timerSettings.focus
                };
                
            case 'month':
                const month = this.getCurrentMonthString();
                return {
                    pomodoros: this.data.stats.monthlyPomodoros[month] || 0,
                    focusTime: (this.data.stats.monthlyPomodoros[month] || 0) * this.data.timerSettings.focus
                };
                
            case 'all':
            default:
                return {
                    pomodoros: this.data.stats.totalPomodoros,
                    focusTime: this.data.stats.totalFocusTime,
                    streaks: this.data.stats.streaks
                };
        }
    },
    
    // 獲取每日番茄鐘數據（用於圖表）
    getDailyStats(days = 7) {
        const result = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const count = this.data.stats.dailyPomodoros[dateString] || 0;
            
            result.push({
                date: dateString,
                count: count,
                label: i === 0 ? '今天' : 
                       i === 1 ? '昨天' : 
                       `${date.getMonth() + 1}/${date.getDate()}`
            });
        }
        
        return result;
    },
    
    // 更新設置
    updateSettings(newSettings) {
        this.data.timerSettings = { ...this.data.timerSettings, ...newSettings };
        this.saveData('settings');
        
        // 如果當前模式的時間設置被更改，則更新計時器持續時間
        if (this.data.timer.mode === 'focus' && newSettings.focus !== undefined) {
            this.data.timer.duration = newSettings.focus;
            if (!this.data.timer.isRunning) {
                this.data.timer.remaining = newSettings.focus;
            }
        } else if (this.data.timer.mode === 'shortBreak' && newSettings.shortBreak !== undefined) {
            this.data.timer.duration = newSettings.shortBreak;
            if (!this.data.timer.isRunning) {
                this.data.timer.remaining = newSettings.shortBreak;
            }
        } else if (this.data.timer.mode === 'longBreak' && newSettings.longBreak !== undefined) {
            this.data.timer.duration = newSettings.longBreak;
            if (!this.data.timer.isRunning) {
                this.data.timer.remaining = newSettings.longBreak;
            }
        }
        
        this.saveData('timer');
        
        // 觸發設置更改事件
        const event = new CustomEvent('settingsChanged', {
            detail: { settings: this.data.timerSettings }
        });
        document.dispatchEvent(event);
    },
    
    // 應用主題顏色
    applyThemeColor() {
        // 從本地存儲獲取主題顏色
        const themeColor = localStorage.getItem('themeColor') || '#4285F4';
        
        // 更新 CSS 變量
        document.documentElement.style.setProperty('--primary-color', themeColor);
        
        // 根據主題顏色自動計算衍生顏色
        const primaryDark = this.adjustColor(themeColor, -20); // 暗一點的主題顏色
        const primaryLight = this.adjustColor(themeColor, 40); // 亮一點的主題顏色
        
        document.documentElement.style.setProperty('--primary-dark', primaryDark);
        document.documentElement.style.setProperty('--primary-light', primaryLight);
    },
    
    // 輔助函數：調整顏色亮度
    adjustColor(color, amount) {
        // 將十六進制顏色轉換為 RGB
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);
        
        // 調整亮度
        r = Math.max(0, Math.min(255, r + amount));
        g = Math.max(0, Math.min(255, g + amount));
        b = Math.max(0, Math.min(255, b + amount));
        
        // 轉回十六進制
        return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    
    // 重置統計數據
    resetStats() {
        this.data.stats = {
            dailyPomodoros: {},
            weeklyPomodoros: {},
            monthlyPomodoros: {},
            totalPomodoros: 0,
            totalFocusTime: 0,
            streaks: 0
        };
        
        this.saveData('stats');
        
        // 觸發統計重置事件
        const event = new CustomEvent('statsReset');
        document.dispatchEvent(event);
    }
};

// 初始化應用
document.addEventListener('DOMContentLoaded', function() {
    PomodoroApp.init();
}); 