function createEnhancedLoginScreen() {
        console.log('إنشاء شاشة تسجيل الدخول المحسنة...');
        
        // إنشاء عنصر الشاشة
        const loginScreen = document.createElement('div');
        loginScreen.id = 'auth-login-screen';
        loginScreen.className = 'auth-screen';
        
        // إضافة محتوى الشاشة
        loginScreen.innerHTML = `
            <div class="auth-container">
                <div class="auth-content">
                    <div class="auth-header">
                        <div class="auth-logo">
                            <i class="fas fa-chart-line"></i>
                            <span>نظام الاستثمار المتكامل</span>
                        </div>
                        <p class="auth-welcome">مرحباً بك في نظام الاستثمار المتكامل</p>
                    </div>
                    
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">تسجيل الدخول</button>
                        <button class="auth-tab" data-tab="register">إنشاء حساب</button>
                    </div>
                    
                    <div class="auth-tab-content active" id="login-tab-content">
                        <form id="login-form">
                            <div class="form-group">
                                <label class="form-label">البريد الإلكتروني</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-envelope"></i>
                                    <input type="email" class="form-input" id="login-email" required autocomplete="email">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">كلمة المرور</label>
                                <div class="input-with-icon password-input-container">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" class="form-input" id="login-password" required autocomplete="current-password">
                                    <button type="button" class="toggle-password" tabindex="-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="form-options">
                                <label class="checkbox-container">
                                    <input type="checkbox" id="remember-me">
                                    <span class="checkmark"></span>
                                    <span>تذكرني</span>
                                </label>
                                <button type="button" class="btn-link" id="forgot-password-btn">نسيت كلمة المرور؟</button>
                            </div>
                            
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary btn-block btn-animated">
                                    <span>تسجيل الدخول</span>
                                    <i class="fas fa-sign-in-alt"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div class="auth-tab-content" id="register-tab-content">
                        <form id="register-form">
                            <div class="form-group">
                                <label class="form-label">الاسم الكامل</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-user"></i>
                                    <input type="text" class="form-input" id="register-name" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">البريد الإلكتروني</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-envelope"></i>
                                    <input type="email" class="form-input" id="register-email" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">كلمة المرور</label>
                                <div class="input-with-icon password-input-container">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" class="form-input" id="register-password" required>
                                    <button type="button" class="toggle-password" tabindex="-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">تأكيد كلمة المرور</label>
                                <div class="input-with-icon password-input-container">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" class="form-input" id="register-confirm-password" required>
                                    <button type="button" class="toggle-password" tabindex="-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">رمز المسؤول <small>(مطلوب للمستخدم الأول أو للمسؤول)</small></label>
                                <div class="input-with-icon password-input-container">
                                    <i class="fas fa-key"></i>
                                    <input type="password" class="form-input" id="register-admin-code">
                                    <button type="button" class="toggle-password" tabindex="-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">نوع المستخدم</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-users-cog"></i>
                                    <select class="form-select" id="register-user-type">
                                        <option value="user">مستخدم عادي</option>
                                        <option value="manager">مدير</option>
                                        <option value="admin">مسؤول</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary btn-block btn-animated">
                                    <span>إنشاء حساب</span>
                                    <i class="fas fa-user-plus"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div class="auth-footer">
                    <p>نظام الاستثمار المتكامل &copy; ${new Date().getFullYear()} | <span class="version-info">الإصدار ${AUTH_SYSTEM_VERSION}</span></p>
                </div>
            </div>
            
            <div class="auth-notification">
                <div class="auth-notification-content">
                    <i class="auth-notification-icon"></i>
                    <span class="auth-notification-message"></span>
                </div>
                <button class="auth-notification-close">&times;</button>
            </div>
        `;
        
        // إضافة عنصر الشاشة إلى الصفحة
        document.body.appendChild(loginScreen);
        
        // إضافة مستمعي الأحداث لشاشة تسجيل الدخول
        setupLoginScreenListeners(loginScreen);
        
        // إظهار الشاشة بتأثير حركي
        setTimeout(() => {
            loginScreen.classList.add('active');
        }, 10);
    }
    
    /**
     * تحديث شاشة تسجيل الدخول الموجودة
     * @param {HTMLElement} loginScreen - عنصر شاشة تسجيل الدخول
     */
    function updateLoginScreen(loginScreen) {
        // التحقق مما إذا كانت الشاشة تحتاج إلى تحديث (مقارنة بالإصدار القديم)
        if (!loginScreen.querySelector('.auth-welcome')) {
            // إذا كانت الشاشة قديمة، نقوم بإزالتها وإنشاء واحدة جديدة
            loginScreen.parentNode.removeChild(loginScreen);
            createEnhancedLoginScreen();
        }
    }

    /**
     * إضافة مستمعي الأحداث لشاشة تسجيل الدخول
     * @param {HTMLElement} loginScreen - عنصر شاشة تسجيل الدخول
     */
    function setupLoginScreenListeners(loginScreen) {
        // التبديل بين تبويبات تسجيل الدخول والتسجيل
        const authTabs = loginScreen.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع التبويبات
                authTabs.forEach(t => t.classList.remove('active'));
                
                // إضافة الفئة النشطة للتبويب المحدد
                this.classList.add('active');
                
                // إخفاء جميع محتويات التبويبات
                const tabContents = loginScreen.querySelectorAll('.auth-tab-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                // إظهار محتوى التبويب المحدد
                const tabName = this.getAttribute('data-tab');
                const selectedTabContent = loginScreen.querySelector(`#${tabName}-tab-content`);
                if (selectedTabContent) {
                    selectedTabContent.classList.add('active');
                    
                    // التركيز التلقائي على أول حقل في التبويب
                    const firstInput = selectedTabContent.querySelector('input:not([type="hidden"])');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }
            });
        });
        
        // إظهار/إخفاء كلمة المرور
        const togglePasswordButtons = loginScreen.querySelectorAll('.toggle-password');
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function() {
                const passwordInput = this.parentElement.querySelector('input');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.querySelector('i').classList.remove('fa-eye');
                    this.querySelector('i').classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    this.querySelector('i').classList.remove('fa-eye-slash');
                    this.querySelector('i').classList.add('fa-eye');
                }
            });
        });
        
        // نموذج تسجيل الدخول
        const loginForm = loginScreen.querySelector('#login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = loginScreen.querySelector('#login-email');
                const passwordInput = loginScreen.querySelector('#login-password');
                const rememberMeCheckbox = loginScreen.querySelector('#remember-me');
                
                if (!emailInput || !passwordInput) {
                    showAuthNotification('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'error');
                    return;
                }
                
                const email = emailInput.value/**
 * enhanced-auth-system.js
 * نظام المصادقة والأمان المحسن لتطبيق نظام الاستثمار المتكامل
 * يوفر وظائف إدارة المستخدمين، تسجيل الدخول، والتحكم بالصلاحيات
 * مع واجهة مستخدم مُحسنة وتجربة استخدام أفضل
 */

// ثوابت النظام
const AUTH_SYSTEM_VERSION = "2.0.0";
const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 دقيقة بالمللي ثانية

// ثوابت لأنواع المستخدمين وصلاحياتهم
const USER_TYPES = {
    ADMIN: 'admin',    // مسؤول كامل الصلاحيات
    MANAGER: 'manager', // مدير بصلاحيات محدودة
    USER: 'user'       // مستخدم عادي
};

// الصلاحيات لكل نوع مستخدم
const PERMISSIONS = {
    [USER_TYPES.ADMIN]: {
        canCreateUsers: true,
        canDeleteUsers: true,
        canManageSettings: true,
        canDeleteInvestors: true,
        canViewAllData: true,
        canExportData: true,
        canImportData: true,
        canCreateBackup: true,
        canRestoreBackup: true
    },
    [USER_TYPES.MANAGER]: {
        canCreateUsers: false,
        canDeleteUsers: false,
        canManageSettings: true,
        canDeleteInvestors: true,
        canViewAllData: true,
        canExportData: true,
        canImportData: true,
        canCreateBackup: true,
        canRestoreBackup: false
    },
    [USER_TYPES.USER]: {
        canCreateUsers: false,
        canDeleteUsers: false,
        canManageSettings: false,
        canDeleteInvestors: false,
        canViewAllData: true,
        canExportData: true,
        canImportData: false,
        canCreateBackup: false,
        canRestoreBackup: false
    }
};

// رمز المسؤول الافتراضي - يمكن تغييره لاحقاً
let ADMIN_CODE = "admin1234";

// كائن نظام المصادقة والأمان
const AuthSystem = (function() {
    // المتغيرات الخاصة
    let currentUser = null;
    let isInitialized = false;
    let authStateListeners = [];
    let databaseRef = null;
    let storageRef = null;
    let sessionTimeoutId = null;
    let lastActivity = Date.now();
    
    /**
     * تحميل بيانات المستخدم من التخزين المحلي عند التهيئة
     */
    function loadUserFromLocalStorage() {
        try {
            const storedUser = localStorage.getItem(AUTH_USER_KEY);
            const authToken = localStorage.getItem(AUTH_TOKEN_KEY);
            
            if (storedUser && authToken) {
                const userData = JSON.parse(storedUser);
                
                // التحقق من انتهاء صلاحية الجلسة
                if (userData.sessionExpiry && new Date(userData.sessionExpiry) > new Date()) {
                    console.log("تم استعادة جلسة المستخدم من التخزين المحلي");
                    currentUser = userData;
                    
                    // تمديد مدة الجلسة
                    refreshUserSession();
                    return true;
                } else {
                    console.log("انتهت صلاحية الجلسة، يرجى إعادة تسجيل الدخول");
                    clearUserSession();
                    return false;
                }
            }
            
            return false;
        } catch (error) {
            console.error("خطأ في تحميل بيانات المستخدم من التخزين المحلي:", error);
            clearUserSession();
            return false;
        }
    }
    
    /**
     * حفظ بيانات المستخدم في التخزين المحلي
     * @param {Object} user - بيانات المستخدم
     * @param {string} token - رمز المصادقة
     */
    function saveUserToLocalStorage(user, token) {
        try {
            // إضافة وقت انتهاء الجلسة
            const sessionExpiry = new Date();
            sessionExpiry.setTime(sessionExpiry.getTime() + SESSION_TIMEOUT);
            user.sessionExpiry = sessionExpiry.toISOString();
            
            localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
            localStorage.setItem(AUTH_TOKEN_KEY, token);
        } catch (error) {
            console.error("خطأ في حفظ بيانات المستخدم في التخزين المحلي:", error);
        }
    }
    
    /**
     * مسح بيانات المستخدم من التخزين المحلي
     */
    function clearUserSession() {
        localStorage.removeItem(AUTH_USER_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        
        if (sessionTimeoutId) {
            clearTimeout(sessionTimeoutId);
            sessionTimeoutId = null;
        }
    }
    
    /**
     * تحديث جلسة المستخدم
     */
    function refreshUserSession() {
        if (!currentUser) return;
        
        // تحديث وقت النشاط الأخير
        lastActivity = Date.now();
        
        // إعادة ضبط مؤقت انتهاء الجلسة
        if (sessionTimeoutId) {
            clearTimeout(sessionTimeoutId);
        }
        
        // تحديث وقت انتهاء الجلسة في التخزين المحلي
        const sessionExpiry = new Date();
        sessionExpiry.setTime(sessionExpiry.getTime() + SESSION_TIMEOUT);
        currentUser.sessionExpiry = sessionExpiry.toISOString();
        
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
        
        // إعداد مؤقت جديد للجلسة
        sessionTimeoutId = setTimeout(() => {
            const timeElapsed = Date.now() - lastActivity;
            
            if (timeElapsed >= SESSION_TIMEOUT) {
                console.log("انتهت مدة الجلسة بسبب عدم النشاط");
                
                // بدلاً من تسجيل الخروج مباشرة، نقوم بعرض شاشة القفل للتحقق
                showLockScreen();
            }
        }, SESSION_TIMEOUT);
    }
    
    /**
     * تهيئة نظام المصادقة
     * @returns {Promise} وعد يشير إلى نجاح أو فشل التهيئة
     */
    function initialize() {
        console.log(`تهيئة نظام المصادقة والأمان (الإصدار ${AUTH_SYSTEM_VERSION})...`);
        
        return new Promise((resolve, reject) => {
            if (isInitialized) {
                resolve(true);
                return;
            }

            try {
                // إضافة مستمع النشاط لتتبع نشاط المستخدم
                addActivityListener();
                
                // محاولة استرجاع بيانات المستخدم من التخزين المحلي
                const userLoaded = loadUserFromLocalStorage();
                
                // التحقق من تهيئة Firebase مسبقاً
                if (!firebase.apps.length) {
                    // التكوين يجب أن يكون موجوداً بالفعل في الصفحة
                    if (typeof firebaseConfig === 'undefined') {
                        console.warn("لم يتم العثور على تكوين Firebase. سيتم استخدام وضع التخزين المحلي فقط.");
                        
                        // إذا كان المستخدم متوفر في التخزين المحلي، نستمر
                        if (userLoaded) {
                            isInitialized = true;
                            updateUIForUser();
                            notifyAuthStateListeners(currentUser);
                            resolve(true);
                            return;
                        } else {
                            // عرض شاشة تسجيل الدخول في حالة عدم وجود مستخدم مخزن
                            showLoginScreen();
                            isInitialized = true;
                            resolve(true);
                            return;
                        }
                    }
                    
                    // تهيئة Firebase
                    firebase.initializeApp(firebaseConfig);
                }
                
                // إنشاء الإشارة إلى قاعدة البيانات
                databaseRef = firebase.database();
                storageRef = firebase.storage();
                
                // التحقق من حالة المصادقة الحالية في Firebase
                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        // الحصول على بيانات المستخدم من قاعدة البيانات
                        getUserData(user.uid)
                            .then(userData => {
                                currentUser = {
                                    uid: user.uid,
                                    email: user.email,
                                    displayName: user.displayName || userData.fullName,
                                    photoURL: user.photoURL,
                                    type: userData.type || USER_TYPES.USER,
                                    permissions: PERMISSIONS[userData.type || USER_TYPES.USER],
                                    metadata: userData
                                };
                                
                                // حفظ بيانات المستخدم في التخزين المحلي
                                saveUserToLocalStorage(currentUser, user.refreshToken);
                                
                                // تحديث واجهة المستخدم
                                updateUIForUser();
                                
                                // إخطار المستمعين بتغيير حالة المصادقة
                                notifyAuthStateListeners(currentUser);
                                
                                console.log(`تم تسجيل الدخول كـ ${currentUser.displayName || currentUser.email}`);
                                showNotification(`مرحباً بك ${currentUser.displayName || currentUser.email}!`, 'success');
                            })
                            .catch(error => {
                                console.error('خطأ في الحصول على بيانات المستخدم:', error);
                                
                                // تعيين معلومات المستخدم الأساسية
                                currentUser = {
                                    uid: user.uid,
                                    email: user.email,
                                    displayName: user.displayName || user.email,
                                    photoURL: user.photoURL,
                                    type: USER_TYPES.USER,
                                    permissions: PERMISSIONS[USER_TYPES.USER]
                                };
                                
                                // حفظ بيانات المستخدم في التخزين المحلي
                                saveUserToLocalStorage(currentUser, user.refreshToken);
                                
                                // تحديث واجهة المستخدم
                                updateUIForUser();
                                
                                // إخطار المستمعين بتغيير حالة المصادقة
                                notifyAuthStateListeners(currentUser);
                            });
                    } else {
                        currentUser = null;
                        
                        // مسح بيانات المستخدم من التخزين المحلي
                        clearUserSession();
                        
                        // تحديث واجهة المستخدم
                        updateUIForUser();
                        
                        // إخطار المستمعين بتغيير حالة المصادقة
                        notifyAuthStateListeners(null);
                        
                        console.log('لم يتم تسجيل الدخول');
                    }
                });
                
                isInitialized = true;
                resolve(true);
            } catch (error) {
                console.error('خطأ في تهيئة نظام المصادقة:', error);
                
                // في حالة الفشل، نعود إلى وضع التخزين المحلي إذا كان المستخدم موجوداً
                if (userLoaded) {
                    isInitialized = true;
                    updateUIForUser();
                    notifyAuthStateListeners(currentUser);
                    resolve(true);
                } else {
                    showLoginScreen();
                    reject(error);
                }
            }
        });
    }

    /**
     * إضافة مستمع للنشاط لتجديد الجلسة
     */
    function addActivityListener() {
        const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
        
        events.forEach(event => {
            document.addEventListener(event, refreshUserSession, { passive: true });
        });
    }

    /**
     * إنشاء حساب جديد
     * @param {string} email - البريد الإلكتروني
     * @param {string} password - كلمة المرور
     * @param {string} fullName - الاسم الكامل
     * @param {string} adminCode - رمز المسؤول (مطلوب للإنشاء الأولي أو حسابات المسؤولين)
     * @param {string} userType - نوع المستخدم (مسؤول، مدير، مستخدم)
     * @returns {Promise} وعد يشير إلى نجاح أو فشل العملية
     */
    function signup(email, password, fullName, adminCode, userType = USER_TYPES.USER) {
        return new Promise((resolve, reject) => {
            // التحقق من وجود مستخدمين
            checkIfFirstUser()
                .then(isFirstUser => {
                    // التحقق من رمز المسؤول إذا لم يكن المستخدم الأول أو إذا طلب صلاحيات مسؤول
                    if ((!isFirstUser || userType === USER_TYPES.ADMIN) && adminCode !== ADMIN_CODE) {
                        reject(new Error('رمز المسؤول غير صحيح'));
                        return;
                    }
                    
                    // إذا كان المستخدم الأول، فسيكون مسؤولاً بغض النظر عن النوع المطلوب
                    if (isFirstUser) {
                        userType = USER_TYPES.ADMIN;
                    }
                    
                    // التحقق من صلاحية إنشاء المستخدم إذا لم يكن المستخدم الأول
                    if (!isFirstUser && currentUser) {
                        // التحقق من صلاحية إنشاء المستخدمين
                        if (!currentUser.permissions.canCreateUsers) {
                            reject(new Error('ليس لديك صلاحية إنشاء مستخدمين جدد'));
                            return;
                        }
                        
                        // التحقق من صلاحية إنشاء مسؤولين
                        if (userType === USER_TYPES.ADMIN && currentUser.type !== USER_TYPES.ADMIN) {
                            reject(new Error('ليس لديك صلاحية إنشاء مستخدمين بصلاحيات مسؤول'));
                            return;
                        }
                    }
                    
                    // الاستمرار في العملية حسب وضع التشغيل
                    if (firebase.apps.length > 0) {
                        // إنشاء المستخدم في Firebase
                        firebase.auth().createUserWithEmailAndPassword(email, password)
                            .then(userCredential => {
                                const user = userCredential.user;
                                
                                // تحديث اسم المستخدم
                                return user.updateProfile({
                                    displayName: fullName
                                }).then(() => user);
                            })
                            .then(user => {
                                // حفظ بيانات المستخدم في قاعدة البيانات
                                const userData = {
                                    uid: user.uid,
                                    email: email,
                                    fullName: fullName,
                                    type: userType,
                                    createdAt: new Date().toISOString(),
                                    lastLogin: new Date().toISOString()
                                };
                                
                                return databaseRef.ref(`users/${user.uid}/profile`).set(userData)
                                    .then(() => {
                                        // إنشاء سجل بإنشاء المستخدم
                                        const logEntry = {
                                            action: 'user_created',
                                            timestamp: new Date().toISOString(),
                                            userId: user.uid,
                                            userEmail: email,
                                            userType: userType,
                                            createdBy: currentUser ? currentUser.uid : 'self_registration'
                                        };
                                        
                                        // إضافة السجل إلى تاريخ الأحداث
                                        return databaseRef.ref('system_logs/users').push(logEntry)
                                            .then(() => {
                                                resolve({
                                                    user: user,
                                                    userData: userData
                                                });
                                            });
                                    });
                            })
                            .catch(error => {
                                console.error('خطأ في إنشاء المستخدم:', error);
                                reject(error);
                            });
                    } else {
                        // وضع التخزين المحلي (بدون Firebase)
                        // إنشاء معرف فريد للمستخدم
                        const userId = 'local_' + Date.now().toString();
                        
                        // إنشاء بيانات المستخدم
                        const userData = {
                            uid: userId,
                            email: email,
                            displayName: fullName,
                            fullName: fullName,
                            type: userType,
                            permissions: PERMISSIONS[userType],
                            createdAt: new Date().toISOString(),
                            lastLogin: new Date().toISOString(),
                            password: hashPassword(password) // تخزين كلمة المرور بشكل آمن
                        };
                        
                        // حفظ المستخدم في التخزين المحلي
                        const localUsers = JSON.parse(localStorage.getItem('local_users') || '{}');
                        localUsers[email] = userData;
                        localStorage.setItem('local_users', JSON.stringify(localUsers));
                        
                        // تسجيل الدخول مباشرة بعد إنشاء الحساب
                        currentUser = userData;
                        saveUserToLocalStorage(userData, 'local_token_' + Date.now());
                        updateUIForUser();
                        notifyAuthStateListeners(currentUser);
                        
                        resolve({
                            user: {
                                uid: userId,
                                email: email,
                                displayName: fullName
                            },
                            userData: userData
                        });
                    }
                })
                .catch(error => {
                    console.error('خطأ في التحقق من وجود مستخدمين:', error);
                    reject(error);
                });
        });
    }

    /**
     * تسجيل الدخول إلى الحساب
     * @param {string} email - البريد الإلكتروني
     * @param {string} password - كلمة المرور
     * @returns {Promise} وعد يشير إلى نجاح أو فشل العملية
     */
    function login(email, password) {
        return new Promise((resolve, reject) => {
            // محاولة تسجيل الدخول بناءً على وضع التشغيل
            if (firebase.apps.length > 0) {
                // تسجيل الدخول باستخدام Firebase
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(userCredential => {
                        const user = userCredential.user;
                        
                        // تحديث وقت آخر تسجيل دخول
                        databaseRef.ref(`users/${user.uid}/profile/lastLogin`).set(new Date().toISOString());
                        
                        // إنشاء سجل بتسجيل الدخول
                        const logEntry = {
                            action: 'user_login',
                            timestamp: new Date().toISOString(),
                            userId: user.uid,
                            userEmail: email,
                            ip: window.userIP || 'unknown',
                            userAgent: navigator.userAgent
                        };
                        
                        // إضافة السجل إلى تاريخ الأحداث
                        return databaseRef.ref('system_logs/authentication').push(logEntry)
                            .then(() => {
                                // الحصول على بيانات المستخدم من قاعدة البيانات
                                return getUserData(user.uid)
                                    .then(userData => {
                                        const userObj = {
                                            uid: user.uid,
                                            email: user.email,
                                            displayName: user.displayName || userData.fullName,
                                            photoURL: user.photoURL,
                                            type: userData.type || USER_TYPES.USER,
                                            permissions: PERMISSIONS[userData.type || USER_TYPES.USER],
                                            metadata: userData
                                        };
                                        
                                        // حفظ بيانات المستخدم في التخزين المحلي
                                        saveUserToLocalStorage(userObj, user.refreshToken);
                                        
                                        // تعيين المستخدم الحالي
                                        currentUser = userObj;
                                        
                                        // تحديث واجهة المستخدم
                                        updateUIForUser();
                                        
                                        // إخطار المستمعين بتغيير حالة المصادقة
                                        notifyAuthStateListeners(currentUser);
                                        
                                        resolve(userObj);
                                    });
                            });
                    })
                    .catch(error => {
                        console.error('خطأ في تسجيل الدخول:', error);
                        reject(error);
                    });
            } else {
                // وضع التخزين المحلي (بدون Firebase)
                const localUsers = JSON.parse(localStorage.getItem('local_users') || '{}');
                const user = localUsers[email];
                
                if (!user) {
                    reject(new Error('البريد الإلكتروني غير مسجل'));
                    return;
                }
                
                // التحقق من كلمة المرور
                if (!verifyPassword(password, user.password)) {
                    reject(new Error('كلمة المرور غير صحيحة'));
                    return;
                }
                
                // تحديث وقت آخر تسجيل دخول
                user.lastLogin = new Date().toISOString();
                localUsers[email] = user;
                localStorage.setItem('local_users', JSON.stringify(localUsers));
                
                // تعيين المستخدم الحالي
                currentUser = user;
                
                // حفظ بيانات المستخدم في التخزين المحلي
                saveUserToLocalStorage(user, 'local_token_' + Date.now());
                
                // تحديث واجهة المستخدم
                updateUIForUser();
                
                // إخطار المستمعين بتغيير حالة المصادقة
                notifyAuthStateListeners(currentUser);
                
                resolve(user);
            }
        });
    }

    /**
     * تبسيط لتشفير كلمة المرور (للوضع المحلي فقط)
     * ملاحظة: هذه ليست طريقة آمنة للغاية في بيئة الإنتاج
     * @param {string} password - كلمة المرور المراد تشفيرها
     * @returns {string} - كلمة المرور المشفرة
     */
    function hashPassword(password) {
        // في الإنتاج، يجب استخدام خوارزميات أقوى
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // تحويل إلى 32 بت
        }
        return hash.toString(16);
    }

    /**
     * التحقق من كلمة المرور (للوضع المحلي فقط)
     * @param {string} password - كلمة المرور المدخلة
     * @param {string} hashedPassword - كلمة المرور المشفرة
     * @returns {boolean} - هل كلمة المرور صحيحة
     */
    function verifyPassword(password, hashedPassword) {
        return hashPassword(password) === hashedPassword;
    }

    /**
     * تسجيل الخروج من الحساب
     * @returns {Promise} وعد يشير إلى نجاح أو فشل العملية
     */
    function logout() {
        return new Promise((resolve, reject) => {
            try {
                // تسجيل حدث تسجيل الخروج
                if (currentUser) {
                    const logEntry = {
                        action: 'user_logout',
                        timestamp: new Date().toISOString(),
                        userId: currentUser.uid,
                        userEmail: currentUser.email
                    };
                    
                    // تخزين السجل حسب وضع التشغيل
                    if (firebase.apps.length > 0 && databaseRef) {
                        databaseRef.ref('system_logs/authentication').push(logEntry);
                    }
                }
                
                // مسح بيانات المستخدم من التخزين المحلي
                clearUserSession();
                
                // تعيين المستخدم الحالي إلى null
                currentUser = null;
                
                // تحديث واجهة المستخدم
                updateUIForUser();
                
                // إخطار المستمعين بتغيير حالة المصادقة
                notifyAuthStateListeners(null);
                
                // تسجيل الخروج من Firebase إذا كان متاحاً
                if (firebase.apps.length > 0) {
                    firebase.auth().signOut()
                        .then(() => {
                            console.log('تم تسجيل الخروج بنجاح');
                            resolve();
                        })
                        .catch(error => {
                            console.error('خطأ في تسجيل الخروج من Firebase:', error);
                            // نستمر بالرغم من الخطأ لأننا قمنا بالفعل بمسح البيانات المحلية
                            resolve();
                        });
                } else {
                    console.log('تم تسجيل الخروج بنجاح');
                    resolve();
                }
            } catch (error) {
                console.error('خطأ في تسجيل الخروج:', error);
                // نستمر بالرغم من الخطأ لتجنب بقاء المستخدم في حالة غير متسقة
                currentUser = null;
                updateUIForUser();
                notifyAuthStateListeners(null);
                resolve();
            }
        });
    }

    /**
     * التحقق من وجود مستخدمين في النظام
     * @returns {Promise<boolean>} وعد يحتوي على قيمة بولية تشير إلى ما إذا كان هذا هو المستخدم الأول
     */
    function checkIfFirstUser() {
        return new Promise((resolve) => {
            // التحقق حسب وضع التشغيل
            if (firebase.apps.length > 0 && databaseRef) {
                databaseRef.ref('users').once('value')
                    .then(snapshot => {
                        resolve(!snapshot.exists());
                    })
                    .catch(error => {
                        console.error('خطأ في التحقق من وجود مستخدمين:', error);
                        resolve(false);
                    });
            } else {
                // التحقق في وضع التخزين المحلي
                const localUsers = JSON.parse(localStorage.getItem('local_users') || '{}');
                resolve(Object.keys(localUsers).length === 0);
            }
        });
    }

    /**
     * الحصول على بيانات المستخدم من قاعدة البيانات
     * @param {string} userId - معرف المستخدم
     * @returns {Promise<Object>} وعد يحتوي على بيانات المستخدم
     */
    function getUserData(userId) {
        return new Promise((resolve, reject) => {
            if (firebase.apps.length > 0 && databaseRef) {
                databaseRef.ref(`users/${userId}/profile`).once('value')
                    .then(snapshot => {
                        const userData = snapshot.val();
                        if (!userData) {
                            reject(new Error('لم يتم العثور على بيانات المستخدم'));
                            return;
                        }
                        resolve(userData);
                    })
                    .catch(error => {
                        console.error('خطأ في الحصول على بيانات المستخدم:', error);
                        reject(error);
                    });
            } else {
                // التحقق في وضع التخزين المحلي
                const localUsers = JSON.parse(localStorage.getItem('local_users') || '{}');
                
                // البحث عن المستخدم بواسطة المعرف
                let userData = null;
                Object.values(localUsers).forEach(user => {
                    if (user.uid === userId) {
                        userData = user;
                    }
                });
                
                if (userData) {
                    resolve(userData);
                } else {
                    reject(new Error('لم يتم العثور على بيانات المستخدم'));
                }
            }
        });
    }

    /**
     * تحديث معلومات المستخدم
     * @param {string} userId - معرف المستخدم
     * @param {Object} userData - البيانات المراد تحديثها
     * @returns {Promise} وعد يشير إلى نجاح أو فشل العملية
     */
    function updateUserData(userId, userData) {
        return new Promise((resolve, reject) => {
            // التحقق من الصلاحيات
            if (currentUser.uid !== userId && !currentUser.permissions.canCreateUsers) {
                reject(new Error('ليس لديك صلاحية تعديل بيانات المستخدمين'));
                return;
            }
            
            // منع المستخدم من تغيير نوعه إلى مسؤول إلا إذا كان مسؤولاً بالفعل
            if (userData.type === USER_TYPES.ADMIN && currentUser.type !== USER_TYPES.ADMIN) {
                reject(new Error('ليس لديك صلاحية تعيين المستخدمين كمسؤولين'));
                return;
            }
            
            if (firebase.apps.length > 0 && databaseRef) {
                databaseRef.ref(`users/${userId}/profile`).update(userData)
                    .then(() => {
                        // إنشاء سجل بتحديث بيانات المستخدم
                        const logEntry = {
                            action: 'user_updated',
                            timestamp: new Date().toISOString(),
                            userId: userId,
                            updatedBy: currentUser.uid,
                            updatedFields: Object.keys(userData)
                        };
                        
                        // إضافة السجل إلى تاريخ الأحداث
                        return databaseRef.ref('system_logs/users').push(logEntry)
                            .then(() => {
                                // إذا كان المستخدم المحدث هو المستخدم الحالي، نقوم بتحديث البيانات المحلية
                                if (userId === currentUser.uid) {
                                    // تحديث بيانات المستخدم الحالي
                                    Object.assign(currentUser, userData);
                                    
                                    // تحديث المستخدم في التخزين المحلي
                                    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
                                    
                                    // تحديث واجهة المستخدم
                                    updateUIForUser();
                                }
                                
                                resolve();
                            });
                    })
                    .catch(error => {
                        console.error('خطأ في تحديث بيانات المستخدم:', error);
                        reject(error);
                    });
            } else {
                // وضع التخزين المحلي
                const localUsers = JSON.parse(localStorage.getItem('local_users') || '{}');
                
                // البحث عن المستخدم بواسطة المعرف
                let userEmail = null;
                Object.entries(localUsers).forEach(([email, user]) => {
                    if (user.uid === userId) {
                        userEmail = email;
                    }
                });
                
                if (userEmail) {
                    // تحديث بيانات المستخدم
                    const updatedUser = { ...localUsers[userEmail], ...userData };
                    localUsers[userEmail] = updatedUser;
                    
                    // حفظ التغييرات
                    localStorage.setItem('local_users', JSON.stringify(localUsers));
                    
                    // إذا كان المستخدم المحدث هو المستخدم الحالي، نقوم بتحديث البيانات المحلية
                    if (userId === currentUser.uid) {
                        // تحديث بيانات المستخدم الحالي
                        Object.assign(currentUser, userData);
                        
                        // تحديث المستخدم في التخزين المحلي
                        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(currentUser));
                        
                        // تحديث واجهة المستخدم
                        updateUIForUser();
                    }
                    
                    resolve();
                } else {
                    reject(new Error('لم يتم العثور على المستخدم'));
                }
            }
        });
    }

    /**
     * حذف مستخدم
     * @param {string} userId - معرف المستخدم
     * @returns {Promise} وعد يشير إلى نجاح أو فشل العملية
     */
    function deleteUser(userId) {
        return new Promise((resolve, reject) => {
            // التحقق من الصلاحيات
            if (!currentUser.permissions.canDeleteUsers) {
                reject(new Error('ليس لديك صلاحية حذف المستخدمين'));
                return;
            }
            
            // الحصول على بيانات المستخدم قبل الحذف
            getUserData(userId)
                .then(userData => {
                    // منع حذف المستخدمين المسؤولين إلا من قبل مسؤول آخر
                    if (userData.type === USER_TYPES.ADMIN && currentUser.type !== USER_TYPES.ADMIN) {
                        reject(new Error('ليس لديك صلاحية حذف المستخدمين المسؤولين'));
                        return;
                    }
                    
                    if (firebase.apps.length > 0 && databaseRef) {
                        // حذف المستخدم من قاعدة البيانات
                        databaseRef.ref(`users/${userId}`).remove()
                            .then(() => {
                                // إنشاء سجل بحذف المستخدم
                                const logEntry = {
                                    action: 'user_deleted',
                                    timestamp: new Date().toISOString(),
                                    deletedUserId: userId,
                                    deletedUserEmail: userData.email,
                                    deletedUserType: userData.type,
                                    deletedBy: currentUser.uid
                                };
                                
                                // إضافة السجل إلى تاريخ الأحداث
                                return databaseRef.ref('system_logs/users').push(logEntry)
                                    .then(() => {
                                        resolve();
                                    });
                            })
                            .catch(error => {
                                console.error('خطأ في حذف المستخدم:', error);
                                reject(error);
                            });
                    } else {
                        // وضع التخزين المحلي
                        const localUsers = JSON.parse(localStorage.getItem('local_users') || '{}');
                        
                        // البحث عن المستخدم بواسطة المعرف
                        let userEmail = null;
                        Object.entries(localUsers).forEach(([email, user]) => {
                            if (user.uid === userId) {
                                userEmail = email;
                            }
                        });
                        
                        if (userEmail) {
                            // حذف المستخدم
                            delete localUsers[userEmail];
                            
                            // حفظ التغييرات
                            localStorage.setItem('local_users', JSON.stringify(localUsers));
                            
                            resolve();
                        } else {
                            reject(new Error('لم يتم العثور على المستخدم'));
                        }
                    }
                })
                .catch(error => {
                    console.error('خطأ في الحصول على بيانات المستخدم قبل الحذف:', error);
                    reject(error);
                });
        });
    }

    /**
     * الحصول على قائمة المستخدمين
     * @returns {Promise<Array>} وعد يحتوي على قائمة المستخدمين
     */
    function getUsers() {
        return new Promise((resolve, reject) => {
            // التحقق من الصلاحيات
            if (!currentUser.permissions.canCreateUsers && !currentUser.permissions.canDeleteUsers && currentUser.type !== USER_TYPES.ADMIN) {
                reject(new Error('ليس لديك صلاحية عرض قائمة المستخدمين'));
                return;
            }
            
            if (firebase.apps.length > 0 && databaseRef) {
                databaseRef.ref('users').once('value')
                    .then(snapshot => {
                        const usersData = snapshot.val();
                        if (!usersData) {
                            resolve([]);
                            return;
                        }
                        
                        const usersList = [];
                        Object.keys(usersData).forEach(userId => {
                            const user = usersData[userId].profile;
                            if (user) {
                                usersList.push({
                                    uid: userId,
                                    ...user
                                });
                            }
                        });
                        
                        resolve(usersList);
                    })
                    .catch(error => {
                        console.error('خطأ في الحصول على قائمة المستخدمين:', error);
                        reject(error);
                    });
            } else {
                // وضع التخزين المحلي
                const localUsers = JSON.parse(localStorage.getItem('local_users') || '{}');
                
                const usersList = Object.values(localUsers);
                resolve(usersList);
            }
        });
    }

    /**
     * تغيير كلمة المرور
     * @param {string} currentPassword - كلمة المرور الحالية
     * @param {string} newPassword - كلمة المرور الجديدة
     * @returns {Promise} وعد يشير إلى نجاح أو فشل العملية
     */
    function changePassword(currentPassword, newPassword) {
        return new Promise((resolve, reject) => {
            if (!currentUser) {
                reject(new Error('لم يتم تسجيل الدخول'));
                return;
            }
            
            if (firebase.apps.length > 0) {
                const user = firebase.auth().currentUser;
                if (!user) {
                    reject(new Error('لم يتم تسجيل الدخول'));
                    return;
                }
                
                // إعادة المصادقة قبل تغيير كلمة المرور
                const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
                user.reauthenticateWithCredential(credential)
                    .then(() => {
                        return user.updatePassword(newPassword);
                    })
                    .then(() => {
                        // إنشاء سجل بتغيير كلمة المرور
                        const logEntry = {
                            action: 'password_changed',
                            timestamp: new Date().toISOString(),
                            userId: user.uid,
                            userEmail: user.email
                        };
                        
                        // إضافة السجل إلى تاريخ الأحداث
                        if (databaseRef) {
                            return databaseRef.ref('system_logs/authentication').push(logEntry)
                                .then(() => {
                                    resolve();
                                });
                        } else {
                            resolve();
                        }
                    })
                    .catch(error => {
                        console.error('خطأ في تغيير كلمة المرور:', error);
                        reject(error);
                    });
            } else {
                // وضع التخزين المحلي
                const localUsers = JSON.parse(localStorage.getItem('local_users') || '{}');
                
                // البحث عن المستخدم بواسطة البريد الإلكتروني
                const userEmail = currentUser.email;
                
                if (localUsers[userEmail]) {
                    // التحقق من كلمة المرور الحالية
                    if (!verifyPassword(currentPassword, localUsers[userEmail].password)) {
                        reject(new Error('كلمة المرور الحالية غير صحيحة'));
                        return;
                    }
                    
                    // تحديث كلمة المرور
                    localUsers[userEmail].password = hashPassword(newPassword);
                    
                    // حفظ التغييرات
                    localStorage.setItem('local_users', JSON.stringify(localUsers));
                    
                    resolve();
                } else {
                    reject(new Error('لم يتم العثور على المستخدم'));
                }
            }
        });
    }

    /**
     * إرسال رسالة إعادة تعيين كلمة المرور
     * @param {string} email - البريد الإلكتروني
     * @returns {Promise} وعد يشير إلى نجاح أو فشل العملية
     */
    function resetPassword(email) {
        return new Promise((resolve, reject) => {
            if (firebase.apps.length > 0) {
                firebase.auth().sendPasswordResetEmail(email)
                    .then(() => {
                        // إنشاء سجل بطلب إعادة تعيين كلمة المرور
                        const logEntry = {
                            action: 'password_reset_requested',
                            timestamp: new Date().toISOString(),
                            userEmail: email,
                            requestedBy: currentUser ? currentUser.uid : 'self'
                        };
                        
                        // إضافة السجل إلى تاريخ الأحداث
                        if (databaseRef) {
                            return databaseRef.ref('system_logs/authentication').push(logEntry)
                                .then(() => {
                                    resolve();
                                });
                        } else {
                            resolve();
                        }
                    })
                    .catch(error => {
                        console.error('خطأ في إرسال رسالة إعادة تعيين كلمة المرور:', error);
                        reject(error);
                    });
            } else {
                // وضع التخزين المحلي - نقوم بإعادة تعيين كلمة المرور مباشرة إلى قيمة افتراضية
                const localUsers = JSON.parse(localStorage.getItem('local_users') || '{}');
                
                if (localUsers[email]) {
                    // إعادة تعيين كلمة المرور إلى قيمة افتراضية (123456)
                    localUsers[email].password = hashPassword('123456');
                    
                    // حفظ التغييرات
                    localStorage.setItem('local_users', JSON.stringify(localUsers));
                    
                    showNotification('تم إعادة تعيين كلمة المرور إلى: 123456', 'info');
                    resolve();
                } else {
                    reject(new Error('البريد الإلكتروني غير مسجل'));
                }
            }
        });
    }

    /**
     * تغيير رمز المسؤول
     * @param {string} currentAdminCode - رمز المسؤول الحالي
     * @param {string} newAdminCode - رمز المسؤول الجديد
     * @returns {Promise} وعد يشير إلى نجاح أو فشل العملية
     */
    function changeAdminCode(currentAdminCode, newAdminCode) {
        return new Promise((resolve, reject) => {
            // التحقق من الصلاحيات
            if (currentUser.type !== USER_TYPES.ADMIN) {
                reject(new Error('ليس لديك صلاحية تغيير رمز المسؤول'));
                return;
            }
            
            // التحقق من صحة رمز المسؤول الحالي
            if (currentAdminCode !== ADMIN_CODE) {
                reject(new Error('رمز المسؤول الحالي غير صحيح'));
                return;
            }
            
            if (firebase.apps.length > 0 && databaseRef) {
                // تحديث رمز المسؤول في الإعدادات
                databaseRef.ref('system_settings/admin_code').set({
                    code: newAdminCode,
                    updatedAt: new Date().toISOString(),
                    updatedBy: currentUser.uid
                })
                .then(() => {
                    // تحديث المتغير المحلي
                    ADMIN_CODE = newAdminCode;
                    
                    // إنشاء سجل بتغيير رمز المسؤول
                    const logEntry = {
                        action: 'admin_code_changed',
                        timestamp: new Date().toISOString(),
                        updatedBy: currentUser.uid,
                        userEmail: currentUser.email
                    };
                    
                    // إضافة السجل إلى تاريخ الأحداث
                    return databaseRef.ref('system_logs/system').push(logEntry)
                        .then(() => {
                            resolve();
                        });
                })
                .catch(error => {
                    console.error('خطأ في تغيير رمز المسؤول:', error);
                    reject(error);
                });
            } else {
                // وضع التخزين المحلي
                ADMIN_CODE = newAdminCode;
                
                // حفظ الرمز الجديد في التخزين المحلي
                localStorage.setItem('admin_code', newAdminCode);
                
                showNotification('تم تغيير رمز المسؤول بنجاح', 'success');
                resolve();
            }
        });
    }

    /**
     * إضافة مستمع لحالة المصادقة
     * @param {Function} listener - دالة الاستماع
     */
    function addAuthStateListener(listener) {
        if (typeof listener === 'function' && !authStateListeners.includes(listener)) {
            authStateListeners.push(listener);
        }
    }

    /**
     * إزالة مستمع لحالة المصادقة
     * @param {Function} listener - دالة الاستماع
     */
    function removeAuthStateListener(listener) {
        const index = authStateListeners.indexOf(listener);
        if (index !== -1) {
            authStateListeners.splice(index, 1);
        }
    }

    /**
     * إخطار جميع مستمعي حالة المصادقة
     * @param {Object|null} user - معلومات المستخدم
     */
    function notifyAuthStateListeners(user) {
        authStateListeners.forEach(listener => {
            try {
                listener(user);
            } catch (error) {
                console.error('خطأ في مستمع حالة المصادقة:', error);
            }
        });
    }

    /**
     * تحديث واجهة المستخدم بناءً على حالة المصادقة
     */
    function updateUIForUser() {
        if (currentUser) {
            // إخفاء شاشة تسجيل الدخول
            hideLoginScreen();
            
            // عرض اسم المستخدم ونوعه في الواجهة
            updateUserInfo();
            
            // تحديث وصول العناصر بناءً على الصلاحيات
            updateElementsAccess();
            
            // تفعيل النشاط التلقائي
            setupAutoLock();
        } else {
            // عرض شاشة تسجيل الدخول
            showLoginScreen();
        }
    }

    /**
     * عرض شاشة تسجيل الدخول المحسنة
     */
    function showLoginScreen() {
        console.log('عرض شاشة تسجيل الدخول...');
        
        const loginScreen = document.getElementById('auth-login-screen');
        
        if (!loginScreen) {
            // إنشاء شاشة تسجيل الدخول المحسنة إذا لم تكن موجودة
            createEnhancedLoginScreen();
        } else {
            // تحديث شاشة تسجيل الدخول الموجودة
            updateLoginScreen(loginScreen);
            
            // إظهار الشاشة
            loginScreen.style.display = 'flex';
            
            // إضافة تأثير حركي
            setTimeout(() => {
                loginScreen.classList.add('active');
            }, 10);
        }
        
        // إخفاء المحتوى الرئيسي
        const appContent = document.querySelector('.layout');
        if (appContent) {
            appContent.style.display = 'none';
        }
    }

    /**
     * إخفاء شاشة تسجيل الدخول
     */
    function hideLoginScreen() {
        const loginScreen = document.getElementById('auth-login-screen');
        
        if (loginScreen) {
            // إضافة تأثير حركي للإخفاء
            loginScreen.classList.remove('active');
            
            // انتظار انتهاء التأثير الحركي
            setTimeout(() => {
                loginScreen.style.display = 'none';
            }, 300);
        }
        
        // إظهار المحتوى الرئيسي
        const appContent = document.querySelector('.layout');
        if (appContent) {
            appContent.style.display = 'flex';
        }
    }

    /**
     * إنشاء شاشة تسجيل الدخول المحسنة
     */
    function createEnhancedLoginScreen() {
        console.log('إنشاء شاشة تسجيل الدخول المحسنة...');
        
        // إنشاء عنصر الشاشة
        const loginScreen = document.createElement('div');
        loginScreen.id = 'auth-login-screen';
        loginScreen.className = 'auth-screen';
        
        // إضافة محتوى الشاشة
        loginScreen.innerHTML = `
            <div class="auth-container">
                <div class="auth-content">
                    <div class="auth-header">
                        <div class="auth-logo">
                            <i class="fas fa-chart-line"></i>
                            <span>نظام الاستثمار المتكامل</span>
                        </div>
                        <p class="auth-welcome">مرحباً بك في نظام الاستثمار المتكامل</p>
                    </div>
                    
                    <div class="auth-tabs">
                        <button class="auth-tab active" data-tab="login">تسجيل الدخول</button>
                        <button class="auth-tab" data-tab="register">إنشاء حساب</button>
                    </div>
                    
                    <div class="auth-tab-content active" id="login-tab-content">
                        <form id="login-form">
                            <div class="form-group">
                                <label class="form-label">البريد الإلكتروني</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-envelope"></i>
                                    <input type="email" class="form-input" id="login-email" required autocomplete="email">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">كلمة المرور</label>
                                <div class="input-with-icon password-input-container">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" class="form-input" id="login-password" required autocomplete="current-password">
                                    <button type="button" class="toggle-password" tabindex="-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="form-options">
                                <label class="checkbox-container">
                                    <input type="checkbox" id="remember-me">
                                    <span class="checkmark"></span>
                                    <span>تذكرني</span>
                                </label>
                                <button type="button" class="btn-link" id="forgot-password-btn">نسيت كلمة المرور؟</button>
                            </div>
                            
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary btn-block btn-animated">
                                    <span>تسجيل الدخول</span>
                                    <i class="fas fa-sign-in-alt"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    <div class="auth-tab-content" id="register-tab-content">
                        <form id="register-form">
                            <div class="form-group">
                                <label class="form-label">الاسم الكامل</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-user"></i>
                                    <input type="text" class="form-input" id="register-name" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">البريد الإلكتروني</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-envelope"></i>
                                    <input type="email" class="form-input" id="register-email" required>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">كلمة المرور</label>
                                <div class="input-with-icon password-input-container">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" class="form-input" id="register-password" required>
                                    <button type="button" class="toggle-password" tabindex="-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">تأكيد كلمة المرور</label>
                                <div class="input-with-icon password-input-container">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" class="form-input" id="register-confirm-password" required>
                                    <button type="button" class="toggle-password" tabindex="-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">رمز المسؤول <small>(مطلوب للمستخدم الأول أو للمسؤول)</small></label>
                                <div class="input-with-icon password-input-container">
                                    <i class="fas fa-key"></i>
                                    <input type="password" class="form-input" id="register-admin-code">
                                    <button type="button" class="toggle-password" tabindex="-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">نوع المستخدم</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-users-cog"></i>
                                    <select class="form-select" id="register-user-type">
                                        <option value="user">مستخدم عادي</option>
                                        <option value="manager">مدير</option>
                                        <option value="admin">مسؤول</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary btn-block btn-animated">
                                    <span>إنشاء حساب</span>
                                    <i class="fas fa-user-plus"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                
                <div class="auth-footer">
                    <p>نظام الاستثمار المتكامل &copy; ${new Date().getFullYear()} | <span class="version-info">الإصدار ${AUTH_SYSTEM_VERSION}</span></p>
                </div>
            </div>
            
            <div class="auth-notification">
                <div class="auth-notification-content">
                    <i class="auth-notification-icon"></i>
                    <span class="auth-notification-message"></span>
                </div>
                <button class="auth-notification-close">&times;</button>
            </div>
        `;
        
        // إضافة عنصر الشاشة إلى الصفحة
        document.body.appendChild(loginScreen);
        
        // إضافة مستمعي الأحداث لشاشة تسجيل الدخول
        setupLoginScreenListeners(loginScreen);
        
        // إظهار الشاشة بتأثير حركي
        setTimeout(() => {
            loginScreen.classList.add('active');
        }, 10);
    }
    
    /**
     * إضافة مستمعي الأحداث لشاشة تسجيل الدخول
     * @param {HTMLElement} loginScreen - عنصر شاشة تسجيل الدخول
     */
    function setupLoginScreenListeners(loginScreen) {
        // التبديل بين تبويبات تسجيل الدخول والتسجيل
        const authTabs = loginScreen.querySelectorAll('.auth-tab');
        authTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع التبويبات
                authTabs.forEach(t => t.classList.remove('active'));
                
                // إضافة الفئة النشطة للتبويب المحدد
                this.classList.add('active');
                
                // إخفاء جميع محتويات التبويبات
                const tabContents = loginScreen.querySelectorAll('.auth-tab-content');
                tabContents.forEach(content => content.classList.remove('active'));
                
                // إظهار محتوى التبويب المحدد
                const tabName = this.getAttribute('data-tab');
                const selectedTabContent = loginScreen.querySelector(`#${tabName}-tab-content`);
                if (selectedTabContent) {
                    selectedTabContent.classList.add('active');
                    
                    // التركيز التلقائي على أول حقل في التبويب
                    const firstInput = selectedTabContent.querySelector('input:not([type="hidden"])');
                    if (firstInput) {
                        firstInput.focus();
                    }
                }
            });
        });
        
        // إظهار/إخفاء كلمة المرور
        const togglePasswordButtons = loginScreen.querySelectorAll('.toggle-password');
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function() {
                const passwordInput = this.parentElement.querySelector('input');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.querySelector('i').classList.remove('fa-eye');
                    this.querySelector('i').classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    this.querySelector('i').classList.remove('fa-eye-slash');
                    this.querySelector('i').classList.add('fa-eye');
                }
            });
        });
        
        // نموذج تسجيل الدخول
        const loginForm = loginScreen.querySelector('#login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = loginScreen.querySelector('#login-email');
                const passwordInput = loginScreen.querySelector('#login-password');
                const rememberMeCheckbox = loginScreen.querySelector('#remember-me');
                
                if (!emailInput || !passwordInput) {
                    showAuthNotification('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'error');
                    return;
                }
                
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                const rememberMe = rememberMeCheckbox && rememberMeCheckbox.checked;
                
                if (!email || !password) {
                    showAuthNotification('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'error');
                    return;
                }
                
                // تغيير حالة الزر
                const submitButton = this.querySelector('button[type="submit"]');
                const originalHTML = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
                submitButton.disabled = true;
                
                // تعطيل النموذج أثناء المعالجة
                loginForm.classList.add('loading');
                
                // تسجيل الدخول
                login(email, password)
                    .then(user => {
                        showAuthNotification('تم تسجيل الدخول بنجاح', 'success');
                        
                        // تعيين وضع "تذكرني" حسب اختيار المستخدم
                        if (rememberMe) {
                            localStorage.setItem('auth_remember', 'true');
                        } else {
                            localStorage.removeItem('auth_remember');
                        }
                        
                        // تأخير قصير قبل إخفاء شاشة تسجيل الدخول لضمان رؤية رسالة النجاح
                        setTimeout(() => {
                            updateUIForUser();
                        }, 1000);
                    })
                    .catch(error => {
                        console.error('خطأ في تسجيل الدخول:', error);
                        
                        let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
                        
                        if (error.code === 'auth/wrong-password') {
                            errorMessage = 'كلمة المرور غير صحيحة';
                        } else if (error.code === 'auth/user-not-found') {
                            errorMessage = 'البريد الإلكتروني غير مسجل';
                        } else if (error.code === 'auth/invalid-email') {
                            errorMessage = 'البريد الإلكتروني غير صالح';
                        } else if (error.code === 'auth/too-many-requests') {
                            errorMessage = 'تم تجاوز عدد المحاولات، يرجى المحاولة لاحقاً';
                        } else if (error.message) {
                            errorMessage = error.message;
                        }
                        
                        showAuthNotification(errorMessage, 'error');
                        
                        // هز نموذج تسجيل الدخول للإشارة إلى الخطأ
                        loginForm.classList.add('shake');
                        setTimeout(() => {
                            loginForm.classList.remove('shake');
                        }, 500);
                    })
                    .finally(() => {
                        // إعادة حالة الزر
                        submitButton.innerHTML = originalHTML;
                        submitButton.disabled = false;
                        
                        // إلغاء تعطيل النموذج
                        loginForm.classList.remove('loading');
                    });
            });
        }
        
        // نموذج إنشاء حساب
        const registerForm = loginScreen.querySelector('#register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const nameInput = loginScreen.querySelector('#register-name');
                const emailInput = loginScreen.querySelector('#register-email');
                const passwordInput = loginScreen.querySelector('#register-password');
                const confirmPasswordInput = loginScreen.querySelector('#register-confirm-password');
                const adminCodeInput = loginScreen.querySelector('#register-admin-code');
                const userTypeSelect = loginScreen.querySelector('#register-user-type');
                
                if (!nameInput || !emailInput || !passwordInput || !confirmPasswordInput || !userTypeSelect) {
                    showAuthNotification('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'error');
                    return;
                }
                
                const fullName = nameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                const confirmPassword = confirmPasswordInput.value;
                const adminCode = adminCodeInput ? adminCodeInput.value : '';
                const userType = userTypeSelect.value;
                
                if (!fullName || !email || !password || !confirmPassword) {
                    showAuthNotification('يرجى إدخال جميع البيانات المطلوبة', 'error');
                    return;
                }
                
                if (password.length < 6) {
                    showAuthNotification('يجب أن تكون كلمة المرور 6 أحرف على الأقل', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showAuthNotification('كلمة المرور وتأكيدها غير متطابقين', 'error');
                    return;
                }
                
                // تغيير حالة الزر
                const submitButton = this.querySelector('button[type="submit"]');
                const originalHTML = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
                submitButton.disabled = true;
                
                // تعطيل النموذج أثناء المعالجة
                registerForm.classList.add('loading');
                
                // إنشاء الحساب
                signup(email, password, fullName, adminCode, userType)
                    .then(result => {
                        showAuthNotification('تم إنشاء الحساب بنجاح', 'success');
                        
                        // مسح النموذج
                        registerForm.reset();
                        
                        // التبديل إلى تبويب تسجيل الدخول بعد بضع ثوان
                        setTimeout(() => {
                            const loginTab = loginScreen.querySelector('.auth-tab[data-tab="login"]');
                            if (loginTab) {
                                loginTab.click();
                            }
                            
                            // ملء البريد الإلكتروني تلقائياً في نموذج تسجيل الدخول
                            const loginEmailInput = loginScreen.querySelector('#login-email');
                            if (loginEmailInput) {
                                loginEmailInput.value = email;
                                
                                // التركيز على حقل كلمة المرور
                                const loginPasswordInput = loginScreen.querySelector('#login-password');
                                if (loginPasswordInput) {
                                    loginPasswordInput.focus();
                                }
                            }
                        }, 1500);
                    })
                    .catch(error => {
                        console.error('خطأ في إنشاء الحساب:', error);
                        
                        let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
                        
                        if (error.code === 'auth/email-already-in-use') {
                            errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
                        } else if (error.code === 'auth/invalid-email') {
                            errorMessage = 'البريد الإلكتروني غير صالح';
                        } else if (error.code === 'auth/weak-password') {
                            errorMessage = 'كلمة المرور ضعيفة جداً';
                        } else if (error.message) {
                            errorMessage = error.message;
                        }
                        
                        showAuthNotification(errorMessage, 'error');
                        
                        // هز نموذج التسجيل للإشارة إلى الخطأ
                        registerForm.classList.add('shake');
                        setTimeout(() => {
                            registerForm.classList.remove('shake');
                        }, 500);
                    })
                    .finally(() => {
                        // إعادة حالة الزر
                        submitButton.innerHTML = originalHTML;
                        submitButton.disabled = false;
                        
                        // إلغاء تعطيل النموذج
                        registerForm.classList.remove('loading');
                    });
            });
        }
        
        // نسيت كلمة المرور
        const forgotPasswordBtn = loginScreen.querySelector('#forgot-password-btn');
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', function() {
                showForgotPasswordDialog();
            });
        }
    }

    /**
     * عرض مربع حوار "نسيت كلمة المرور"
     */
    function showForgotPasswordDialog() {
        // إنشاء العنصر إذا لم يكن موجوداً
        let dialogOverlay = document.getElementById('forgot-password-dialog');
        
        if (!dialogOverlay) {
            dialogOverlay = document.createElement('div');
            dialogOverlay.id = 'forgot-password-dialog';
            dialogOverlay.className = 'dialog-overlay';
            
            // إضافة مربع الحوار
            dialogOverlay.innerHTML = `
                <div class="dialog">
                    <div class="dialog-header">
                        <h3 class="dialog-title">استعادة كلمة المرور</h3>
                        <button class="dialog-close">&times;</button>
                    </div>
                    <div class="dialog-body">
                        <p>أدخل بريدك الإلكتروني لإرسال رابط إعادة تعيين كلمة المرور.</p>
                        <form id="forgot-password-form">
                            <div class="form-group">
                                <label class="form-label">البريد الإلكتروني</label>
                                <div class="input-with-icon">
                                    <i class="fas fa-envelope"></i>
                                    <input type="email" class="form-input" id="reset-email" required>
                                </div>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn btn-outline dialog-cancel">إلغاء</button>
                                <button type="submit" class="btn btn-primary">إرسال رابط الاستعادة</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            // إضافة العنصر للصفحة
            document.body.appendChild(dialogOverlay);
            
            // إضافة مستمعي الأحداث
            const closeBtn = dialogOverlay.querySelector('.dialog-close');
            const cancelBtn = dialogOverlay.querySelector('.dialog-cancel');
            const form = dialogOverlay.querySelector('#forgot-password-form');
            
            // إغلاق مربع الحوار
            closeBtn.addEventListener('click', () => {
                dialogOverlay.classList.remove('active');
                setTimeout(() => {
                    dialogOverlay.style.display = 'none';
                }, 300);
            });
            
            // إلغاء العملية
            cancelBtn.addEventListener('click', () => {
                dialogOverlay.classList.remove('active');
                setTimeout(() => {
                    dialogOverlay.style.display = 'none';
                }, 300);
            });
            
            // نموذج استعادة كلمة المرور
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const emailInput = dialogOverlay.querySelector('#reset-email');
                if (!emailInput) return;
                
                const email = emailInput.value.trim();
                
                if (!email) {
                    showAuthNotification('يرجى إدخال البريد الإلكتروني', 'error');
                    return;
                }
                
                // تغيير حالة الزر
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.textContent;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
                submitButton.disabled = true;
                
                // إرسال طلب استعادة كلمة المرور
                resetPassword(email)
                    .then(() => {
                        showAuthNotification('تم إرسال رابط استعادة كلمة المرور. يرجى التحقق من بريدك الإلكتروني.', 'success');
                        
                        // إغلاق مربع الحوار
                        dialogOverlay.classList.remove('active');
                        setTimeout(() => {
                            dialogOverlay.style.display = 'none';
                            form.reset();
                        }, 300);
                    })
                    .catch(error => {
                        console.error('خطأ في إرسال رابط استعادة كلمة المرور:', error);
                        
                        let errorMessage = 'حدث خطأ أثناء إرسال رابط استعادة كلمة المرور';
                        
                        if (error.code === 'auth/user-not-found') {
                            errorMessage = 'البريد الإلكتروني غير مسجل';
                        } else if (error.code === 'auth/invalid-email') {
                            errorMessage = 'البريد الإلكتروني غير صالح';
                        } else if (error.message) {
                            errorMessage = error.message;
                        }
                        
                        showAuthNotification(errorMessage, 'error');
                    })
                    .finally(() => {
                        // إعادة حالة الزر
                        submitButton.textContent = originalText;
                        submitButton.disabled = false;
                    });
            });
        }
        
        // إظهار مربع الحوار
        dialogOverlay.style.display = 'flex';
        setTimeout(() => {
            dialogOverlay.classList.add('active');
            
            // التركيز على حقل البريد الإلكتروني
            const emailInput = dialogOverlay.querySelector('#reset-email');
            if (emailInput) {
                emailInput.focus();
            }
        }, 10);
    }

    /**
     * عرض شاشة قفل للمستخدم المسجل
     */
    function showLockScreen() {
        if (!currentUser) return;
        
        // إنشاء العنصر إذا لم يكن موجوداً
        let lockScreen = document.getElementById('auth-lock-screen');
        
        if (!lockScreen) {
            lockScreen = document.createElement('div');
            lockScreen.id = 'auth-lock-screen';
            lockScreen.className = 'auth-screen lock-screen';
            
            // إضافة محتوى الشاشة
            lockScreen.innerHTML = `
                <div class="auth-container">
                    <div class="auth-content">
                        <div class="lock-screen-user">
                            <div class="user-avatar large">${currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}</div>
                            <h2>${currentUser.displayName || currentUser.email}</h2>
                            <p>${getUserTypeLabel(currentUser.type)}</p>
                        </div>
                        
                        <div class="auth-message">
                            <i class="fas fa-lock"></i>
                            <p>تم قفل الشاشة للحفاظ على أمان المعلومات</p>
                        </div>
                        
                        <form id="unlock-form">
                            <div class="form-group">
                                <label class="form-label">كلمة المرور</label>
                                <div class="input-with-icon password-input-container">
                                    <i class="fas fa-lock"></i>
                                    <input type="password" class="form-input" id="unlock-password" required>
                                    <button type="button" class="toggle-password" tabindex="-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary btn-block btn-animated">
                                    <span>إلغاء القفل</span>
                                    <i class="fas fa-unlock"></i>
                                </button>
                            </div>
                            
                            <div class="form-group text-center">
                                <button type="button" class="btn-link" id="logout-from-lock">
                                    <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            
            // إضافة العنصر للصفحة
            document.body.appendChild(lockScreen);
            
            // إضافة مستمعي الأحداث
            setupLockScreenListeners(lockScreen);
        }
        
        // إخفاء المحتوى الرئيسي
        const appContent = document.querySelector('.layout');
        if (appContent) {
            appContent.style.display = 'none';
        }
        
        // إظهار شاشة القفل
        lockScreen.style.display = 'flex';
        setTimeout(() => {
            lockScreen.classList.add('active');
            
            // التركيز على حقل كلمة المرور
            const passwordInput = lockScreen.querySelector('#unlock-password');
            if (passwordInput) {
                passwordInput.focus();
            }
        }, 10);
    }

    /**
     * إضافة مستمعي الأحداث لشاشة القفل
     * @param {HTMLElement} lockScreen - عنصر شاشة القفل
     */
    function setupLockScreenListeners(lockScreen) {
        // إظهار/إخفاء كلمة المرور
        const togglePasswordButton = lockScreen.querySelector('.toggle-password');
        if (togglePasswordButton) {
            togglePasswordButton.addEventListener('click', function() {
                const passwordInput = this.parentElement.querySelector('input');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.querySelector('i').classList.remove('fa-eye');
                    this.querySelector('i').classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    this.querySelector('i').classList.remove('fa-eye-slash');
                    this.querySelector('i').classList.add('fa-eye');
                }
            });
        }
        
        // نموذج إلغاء القفل
        const unlockForm = lockScreen.querySelector('#unlock-form');
        if (unlockForm) {
            unlockForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const passwordInput = lockScreen.querySelector('#unlock-password');
                
                if (!passwordInput) {
                    showAuthNotification('خطأ في النموذج: حقل كلمة المرور غير موجود', 'error');
                    return;
                }
                
                const password = passwordInput.value;
                
                if (!password) {
                    showAuthNotification('يرجى إدخال كلمة المرور', 'error');
                    return;
                }
                
                // تغيير حالة الزر
                const submitButton = this.querySelector('button[type="submit"]');
                const originalHTML = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحقق...';
                submitButton.disabled = true;
                
                // تعطيل النموذج أثناء المعالجة
                unlockForm.classList.add('loading');
                
                // إعادة التحقق من كلمة المرور
                if (firebase.apps.length > 0) {
                    // التحقق باستخدام Firebase
                    const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, password);
                    firebase.auth().currentUser.reauthenticateWithCredential(credential)
                        .then(() => {
                            // إلغاء قفل النظام
                            hideLockScreen();
                            
                            // تحديث وقت الجلسة
                            refreshUserSession();
                            
                            // مسح حقل كلمة المرور
                            passwordInput.value = '';
                        })
                        .catch(error => {
                            console.error('خطأ في إلغاء القفل:', error);
                            
                            let errorMessage = 'كلمة المرور غير صحيحة';
                            
                            if (error.code === 'auth/wrong-password') {
                                errorMessage = 'كلمة المرور غير صحيحة';
                            } else if (error.code === 'auth/too-many-requests') {
                                errorMessage = 'تم تجاوز عدد المحاولات، يرجى المحاولة لاحقاً';
                            } else if (error.message) {
                                errorMessage = error.message;
                            }
                            
                            showAuthNotification(errorMessage, 'error');
                            
                            // هز النموذج للإشارة إلى الخطأ
                            unlockForm.classList.add('shake');
                            setTimeout(() => {
                                unlockForm.classList.remove('shake');
                            }, 500);
                        })
                        .finally(() => {
                            // إعادة حالة الزر
                            submitButton.innerHTML = originalHTML;
                            submitButton.disabled = false;
                            
                            // إلغاء تعطيل النموذج
                            unlockForm.classList.remove('loading');
                        });
                } else {
                    // التحقق في وضع التخزين المحلي
                    const localUsers = JSON.parse(localStorage.getItem('local_users') || '{}');
                    const user = localUsers[currentUser.email];
                    
                    if (user && verifyPassword(password, user.password)) {
                        // إلغاء قفل النظام
                        hideLockScreen();
                        
                        // تحديث وقت الجلسة
                        refreshUserSession();
                        
                        // مسح حقل كلمة المرور
                        passwordInput.value = '';
                    } else {
                        showAuthNotification('كلمة المرور غير صحيحة', 'error');
                        
                        // هز النموذج للإشارة إلى الخطأ
                        unlockForm.classList.add('shake');
                        setTimeout(() => {
                            unlockForm.classList.remove('shake');
                        }, 500);
                    }
                    
                    // إعادة حالة الزر
                    submitButton.innerHTML = originalHTML;
                    submitButton.disabled = false;
                    
                    // إلغاء تعطيل النموذج
                    unlockForm.classList.remove('loading');
                }
            });
        }
        
        // زر تسجيل الخروج
        const logoutBtn = lockScreen.querySelector('#logout-from-lock');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                // تسجيل الخروج
                logout()
                    .then(() => {
                        // إخفاء شاشة القفل
                        hideLockScreen();
                        
                        showAuthNotification('تم تسجيل الخروج بنجاح', 'success');
                    })
                    .catch(error => {
                        console.error('خطأ في تسجيل الخروج:', error);
                        showAuthNotification('حدث خطأ أثناء تسجيل الخروج', 'error');
                    });
            });
        }
    }

    /**
     * إخفاء شاشة القفل
     */
    function hideLockScreen() {
        const lockScreen = document.getElementById('auth-lock-screen');
        
        if (lockScreen) {
            // إخفاء شاشة القفل بتأثير حركي
            lockScreen.classList.remove('active');
            
            // انتظار انتهاء التأثير الحركي
            setTimeout(() => {
                lockScreen.style.display = 'none';
            }, 300);
        }
        
        // إظهار المحتوى الرئيسي
        const appContent = document.querySelector('.layout');
        if (appContent) {
            appContent.style.display = 'flex';
        }
    }

    /**
     * عرض إشعار في شاشة المصادقة
     * @param {string} message - نص الإشعار
     * @param {string} type - نوع الإشعار (success, error, warning, info)
     */
    /**
 * عرض إشعار في شاشة المصادقة
 * @param {string} message - نص الإشعار
 * @param {string} type - نوع الإشعار (success, error, warning, info)
 */
function showAuthNotification(message, type = 'info') {
    // البحث عن عنصر الإشعار
    let notificationElement = document.querySelector('.auth-notification');
    
    if (!notificationElement) {
        // إنشاء عنصر الإشعار إذا لم يكن موجوداً
        notificationElement = document.createElement('div');
        notificationElement.className = 'auth-notification';
        notificationElement.innerHTML = `
            <div class="auth-notification-content">
                <i class="auth-notification-icon"></i>
                <span class="auth-notification-message"></span>
            </div>
            <button class="auth-notification-close">&times;</button>
        `;
        
        document.body.appendChild(notificationElement);
        
        // إضافة مستمع حدث لزر الإغلاق
        const closeButton = notificationElement.querySelector('.auth-notification-close');
        if (closeButton) {
            closeButton.addEventListener('click', function() {
                notificationElement.classList.remove('show');
            });
        }
    }
    
    // تحديث محتوى الإشعار
    const iconElement = notificationElement.querySelector('.auth-notification-icon');
    const messageElement = notificationElement.querySelector('.auth-notification-message');
    
    if (iconElement && messageElement) {
        // تحديد الأيقونة حسب النوع
        let iconClass = 'fas ';
        switch(type) {
            case 'success':
                iconClass += 'fa-check-circle';
                break;
            case 'error':
                iconClass += 'fa-times-circle';
                break;
            case 'warning':
                iconClass += 'fa-exclamation-triangle';
                break;
            case 'info':
            default:
                iconClass += 'fa-info-circle';
                break;
        }
        
        // تحديث الأيقونة والنص
        iconElement.className = iconClass;
        messageElement.textContent = message;
        
        // تحديث نوع الإشعار
        notificationElement.className = `auth-notification ${type}`;
        
        // إظهار الإشعار
        notificationElement.classList.add('show');
        
        // إخفاء الإشعار تلقائياً بعد فترة
        const timeout = setTimeout(() => {
            notificationElement.classList.remove('show');
        }, 5000);
        
        // إلغاء المؤقت عند النقر على زر الإغلاق
        const closeButton = notificationElement.querySelector('.auth-notification-close');
        if (closeButton) {
            closeButton.onclick = function() {
                clearTimeout(timeout);
                notificationElement.classList.remove('show');
            };
        }
    }
}

/**
 * عرض إشعار عام في التطبيق
 * @param {string} message - نص الإشعار
 * @param {string} type - نوع الإشعار (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // منع الاستدعاء المتكرر
    if (window._isShowingNotification) return;
    window._isShowingNotification = true;

    // استخدام دالة عرض الإشعارات الموجودة في التطبيق إذا كانت متاحة
    if (typeof window.showNotification === 'function' && window.showNotification !== showNotification) {
        window.showNotification(message, type);
        window._isShowingNotification = false;
        return;
    }

    // التحقق من وجود عنصر الإشعار
    let notificationElement = document.getElementById('notification');

    // إنشاء عنصر الإشعار إذا لم يكن موجوداً
    if (!notificationElement) {
        notificationElement = document.createElement('div');
        notificationElement.id = 'notification';
        notificationElement.className = 'notification';
        document.body.appendChild(notificationElement);
    }

    // تحديد الفئة حسب نوع الإشعار
    notificationElement.className = `notification ${type}`;

    // إضافة المحتوى
    notificationElement.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${getNotificationTitle(type)}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">&times;</button>
    `;

    // إظهار الإشعار
    notificationElement.classList.add('show');

    // إغلاق الإشعار بعد فترة
    const timeout = setTimeout(() => {
        notificationElement.classList.remove('show');
        window._isShowingNotification = false;
    }, 5000);

    // إضافة مستمع حدث زر الإغلاق
    const closeButton = notificationElement.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            clearTimeout(timeout);
            notificationElement.classList.remove('show');
            window._isShowingNotification = false;
        });
    }
}

/**
 * الحصول على أيقونة الإشعار
 * @param {string} type - نوع الإشعار
 * @returns {string} - فئة الأيقونة
 */
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-times-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        case 'info':
        default:
            return 'fa-info-circle';
    }
}

/**
 * الحصول على عنوان الإشعار
 * @param {string} type - نوع الإشعار
 * @returns {string} - عنوان الإشعار
 */
function getNotificationTitle(type) {
    switch (type) {
        case 'success':
            return 'تمت العملية بنجاح';
        case 'error':
            return 'خطأ';
        case 'warning':
            return 'تنبيه';
        case 'info':
        default:
            return 'معلومات';
    }
}

/**
 * تحديث معلومات المستخدم في الواجهة
 */
function updateUserInfo() {
    if (!currentUser) return;
    
    console.log('تحديث معلومات المستخدم في الواجهة...');
    
    // تحديث معلومات المستخدم في الشريط العلوي
    const userInfoElement = document.querySelector('.user-info');
    
    if (userInfoElement) {
        // تحديث معلومات المستخدم في العنصر الموجود
        updateExistingUserInfo(userInfoElement);
    } else {
        // إنشاء عنصر معلومات المستخدم إذا لم يكن موجوداً
        createUserInfoElement();
    }
}

/**
 * تحديث عنصر معلومات المستخدم الموجود
 * @param {HTMLElement} userInfoElement - عنصر معلومات المستخدم
 */
function updateExistingUserInfo(userInfoElement) {
    // التحقق من وجود العناصر المطلوبة
    const userNameElement = userInfoElement.querySelector('.user-name');
    const userTypeElement = userInfoElement.querySelector('.user-type');
    const userAvatarElement = userInfoElement.querySelector('.user-avatar');
    
    // تحديث اسم المستخدم
    if (userNameElement) {
        userNameElement.textContent = currentUser.displayName || currentUser.email;
    }
    
    // تحديث نوع المستخدم
    if (userTypeElement) {
        userTypeElement.textContent = getUserTypeLabel(currentUser.type);
    }
    
    // تحديث صورة المستخدم
    if (userAvatarElement) {
        if (currentUser.photoURL) {
            userAvatarElement.innerHTML = `<img src="${currentUser.photoURL}" alt="${currentUser.displayName || 'المستخدم'}" />`;
        } else {
            userAvatarElement.textContent = (currentUser.displayName || currentUser.email).charAt(0).toUpperCase();
        }
    }
}

/**
 * إنشاء عنصر معلومات المستخدم
 */
function createUserInfoElement() {
    console.log('إنشاء عنصر معلومات المستخدم...');
    
    // البحث عن العنصر المناسب لإضافة معلومات المستخدم
    const headerActions = document.querySelector('.header-actions');
    
    if (!headerActions) {
        console.warn('لم يتم العثور على عنصر header-actions لإضافة معلومات المستخدم');
        return;
    }
    
    // إنشاء عنصر معلومات المستخدم
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info dropdown';
    
    // تحديد محتوى العنصر
    userInfo.innerHTML = `
        <button class="dropdown-toggle">
            <div class="user-avatar">${(currentUser.displayName || currentUser.email).charAt(0).toUpperCase()}</div>
            <div>
                <div class="user-name">${currentUser.displayName || currentUser.email}</div>
                <div class="user-type">${getUserTypeLabel(currentUser.type)}</div>
            </div>
            <i class="fas fa-chevron-down"></i>
        </button>
        <div class="dropdown-menu">
            <a href="#" class="dropdown-item" id="profile-btn">
                <i class="fas fa-user"></i>
                <span>الملف الشخصي</span>
            </a>
            <a href="#" class="dropdown-item" id="change-password-btn">
                <i class="fas fa-key"></i>
                <span>تغيير كلمة المرور</span>
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item" id="logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                <span>تسجيل الخروج</span>
            </a>
        </div>
    `;
    
    // إضافة العنصر إلى الشريط العلوي
    headerActions.appendChild(userInfo);
    
    // إضافة مستمعي الأحداث
    setupUserMenuListeners();
}

/**
 * إضافة مستمعي الأحداث لقائمة المستخدم
 */
function setupUserMenuListeners() {
    console.log('إعداد مستمعي أحداث قائمة المستخدم...');
    
    // تبديل القائمة المنسدلة
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const dropdown = this.closest('.dropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        });
    }
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            const activeDropdowns = document.querySelectorAll('.dropdown.active');
            activeDropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // الملف الشخصي
    const profileBtn = document.getElementById('profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showProfileModal();
        });
    }
    
    // تغيير كلمة المرور
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showChangePasswordModal();
        });
    }
    
    // تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // تأكيد تسجيل الخروج
            if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
                logout()
                    .then(() => {
                        showNotification('تم تسجيل الخروج بنجاح', 'success');
                    })
                    .catch(error => {
                        console.error('خطأ في تسجيل الخروج:', error);
                        showNotification('حدث خطأ أثناء تسجيل الخروج', 'error');
                    });
            }
        });
    }
}

/**
 * عرض نافذة الملف الشخصي
 */
function showProfileModal() {
    if (!currentUser) return;
    
    console.log('عرض نافذة الملف الشخصي...');
    
    // إنشاء محتوى النافذة
    const content = `
        <div class="profile-container">
            <div class="profile-avatar">
                <div class="avatar-circle">
                    ${currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div class="profile-info">
                    <h3>${currentUser.displayName || 'المستخدم'}</h3>
                    <span class="user-type-badge ${currentUser.type}">${getUserTypeLabel(currentUser.type)}</span>
                </div>
            </div>
            
            <form id="profile-form">
                <div class="form-group">
                    <label class="form-label">البريد الإلكتروني</label>
                    <div class="input-with-icon">
                        <i class="fas fa-envelope"></i>
                        <input type="email" class="form-input" value="${currentUser.email}" readonly>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">الاسم الكامل</label>
                    <div class="input-with-icon">
                        <i class="fas fa-user"></i>
                        <input type="text" class="form-input" id="profile-fullname" value="${currentUser.displayName || ''}">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">آخر تسجيل دخول</label>
                    <div class="input-with-icon">
                        <i class="fas fa-clock"></i>
                        <input type="text" class="form-input" value="${new Date(currentUser.metadata?.lastLogin || Date.now()).toLocaleString()}" readonly>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">تاريخ إنشاء الحساب</label>
                    <div class="input-with-icon">
                        <i class="fas fa-calendar-alt"></i>
                        <input type="text" class="form-input" value="${new Date(currentUser.metadata?.createdAt || Date.now()).toLocaleString()}" readonly>
                    </div>
                </div>
            </form>
        </div>
    `;
    
    // عرض النافذة المنبثقة
    showModal('الملف الشخصي', content, function(modal) {
        // مستمع حدث حفظ الملف الشخصي
        const profileForm = modal.querySelector('#profile-form');
        const footerElement = modal.querySelector('.modal-footer');
        
        if (profileForm && footerElement) {
            // إضافة زر الحفظ في التذييل
            const saveButton = document.createElement('button');
            saveButton.className = 'btn btn-primary';
            saveButton.id = 'save-profile-btn';
            saveButton.textContent = 'حفظ التغييرات';
            
            // إضافة الزر إلى التذييل
            footerElement.appendChild(saveButton);
            
            // مستمع حدث النقر على زر الحفظ
            saveButton.addEventListener('click', function() {
                // الحصول على قيمة الاسم
                const fullNameInput = profileForm.querySelector('#profile-fullname');
                
                if (!fullNameInput) {
                    showNotification('خطأ في النموذج: حقل الاسم غير موجود', 'error');
                    return;
                }
                
                const fullName = fullNameInput.value.trim();
                
                if (!fullName) {
                    showNotification('يرجى إدخال الاسم الكامل', 'error');
                    return;
                }
                
                // تغيير حالة الزر
                const originalText = this.textContent;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
                this.disabled = true;
                
                // تحديث بيانات المستخدم
                updateUserData(currentUser.uid, { fullName })
                    .then(() => {
                        // تحديث اسم العرض
                        if (firebase.apps.length > 0) {
                            return firebase.auth().currentUser.updateProfile({
                                displayName: fullName
                            });
                        } else {
                            return Promise.resolve();
                        }
                    })
                    .then(() => {
                        // تحديث المتغير المحلي
                        currentUser.displayName = fullName;
                        
                        // تحديث واجهة المستخدم
                        updateUserInfo();
                        
                        showNotification('تم تحديث الملف الشخصي بنجاح', 'success');
                        
                        // إغلاق النافذة
                        closeModal(modal);
                    })
                    .catch(error => {
                        console.error('خطأ في تحديث الملف الشخصي:', error);
                        showNotification('حدث خطأ أثناء تحديث الملف الشخصي', 'error');
                    })
                    .finally(() => {
                        // إعادة حالة الزر
                        this.textContent = originalText;
                        this.disabled = false;
                    });
            });
        }
    });
}

/**
 * عرض نافذة تغيير كلمة المرور
 */
function showChangePasswordModal() {
    if (!currentUser) return;
    
    console.log('عرض نافذة تغيير كلمة المرور...');
    
    // إنشاء محتوى النافذة
    const content = `
        <div class="change-password-container">
            <div class="auth-message">
                <i class="fas fa-key"></i>
                <p>قم بإدخال كلمة المرور الحالية وكلمة المرور الجديدة</p>
            </div>
            
            <form id="change-password-form">
                <div class="form-group">
                    <label class="form-label">كلمة المرور الحالية</label>
                    <div class="input-with-icon password-input-container">
                        <i class="fas fa-lock"></i>
                        <input type="password" class="form-input" id="current-password" required>
                        <button type="button" class="toggle-password" tabindex="-1">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">كلمة المرور الجديدة</label>
                    <div class="input-with-icon password-input-container">
                        <i class="fas fa-lock"></i>
                        <input type="password" class="form-input" id="new-password" required>
                        <button type="button" class="toggle-password" tabindex="-1">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">تأكيد كلمة المرور الجديدة</label>
                    <div class="input-with-icon password-input-container">
                        <i class="fas fa-lock"></i>
                        <input type="password" class="form-input" id="confirm-new-password" required>
                        <button type="button" class="toggle-password" tabindex="-1">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="password-strength" id="password-strength">
                    <div class="strength-meter">
                        <div class="strength-meter-fill"></div>
                    </div>
                    <div class="strength-text"></div>
                </div>
            </form>
        </div>
    `;
    
    // عرض النافذة المنبثقة
    showModal('تغيير كلمة المرور', content, function(modal) {
        // مستمعي أحداث لأزرار إظهار/إخفاء كلمة المرور
        const togglePasswordButtons = modal.querySelectorAll('.toggle-password');
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function() {
                const passwordInput = this.parentElement.querySelector('input');
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.querySelector('i').classList.remove('fa-eye');
                    this.querySelector('i').classList.add('fa-eye-slash');
                } else {
                    passwordInput.type = 'password';
                    this.querySelector('i').classList.remove('fa-eye-slash');
                    this.querySelector('i').classList.add('fa-eye');
                }
            });
        });
        
        // قياس قوة كلمة المرور
        const newPasswordInput = modal.querySelector('#new-password');
        if (newPasswordInput) {
            newPasswordInput.addEventListener('input', function() {
                updatePasswordStrength(this.value);
            });
        }
        
        // مستمع حدث حفظ كلمة المرور
        const changePasswordForm = modal.querySelector('#change-password-form');
        const footerElement = modal.querySelector('.modal-footer');
        
        if (changePasswordForm && footerElement) {
            // إضافة زر الحفظ في التذييل
            const saveButton = document.createElement('button');
            saveButton.className = 'btn btn-primary';
            saveButton.id = 'save-password-btn';
            saveButton.textContent = 'تغيير كلمة المرور';
            
            // إضافة الزر إلى التذييل
            footerElement.appendChild(saveButton);
            
            // مستمع حدث النقر على زر الحفظ
            saveButton.addEventListener('click', function() {
                const currentPasswordInput = modal.querySelector('#current-password');
                const newPasswordInput = modal.querySelector('#new-password');
                const confirmNewPasswordInput = modal.querySelector('#confirm-new-password');
                
                if (!currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) {
                    showNotification('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'error');
                    return;
                }
                
                const currentPassword = currentPasswordInput.value;
                const newPassword = newPasswordInput.value;
                const confirmNewPassword = confirmNewPasswordInput.value;
                
                if (!currentPassword || !newPassword || !confirmNewPassword) {
                    showNotification('يرجى إدخال جميع البيانات المطلوبة', 'error');
                    return;
                }
                
                if (newPassword.length < 6) {
                    showNotification('يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل', 'error');
                    return;
                }
                
                if (newPassword !== confirmNewPassword) {
                    showNotification('كلمة المرور الجديدة وتأكيدها غير متطابقين', 'error');
                    return;
                }
                
                // تغيير حالة الزر
                const originalText = this.textContent;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تغيير كلمة المرور...';
                this.disabled = true;
                
                // تغيير كلمة المرور
                changePassword(currentPassword, newPassword)
                    .then(() => {
                        showNotification('تم تغيير كلمة المرور بنجاح', 'success');
                        
                        // إغلاق النافذة
                        closeModal(modal);
                    })
                    .catch(error => {
                        console.error('خطأ في تغيير كلمة المرور:', error);
                        
                        let errorMessage = 'حدث خطأ أثناء تغيير كلمة المرور';
                        
                        if (error.code === 'auth/wrong-password') {
                            errorMessage = 'كلمة المرور الحالية غير صحيحة';
                        } else if (error.code === 'auth/weak-password') {
                            errorMessage = 'كلمة المرور الجديدة ضعيفة جداً';
                        } else if (error.message) {
                            errorMessage = error.message;
                        }
                        
                        showNotification(errorMessage, 'error');
                    })
                    .finally(() => {
                        // إعادة حالة الزر
                        this.textContent = originalText;
                        this.disabled = false;
                    });
            });
        }
    });
}

/**
 * تحديث مؤشر قوة كلمة المرور
 * @param {string} password - كلمة المرور
 */
function updatePasswordStrength(password) {
    const strengthMeter = document.querySelector('.strength-meter-fill');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthMeter || !strengthText) return;
    
    // حساب قوة كلمة المرور
    let strength = 0;
    
    // طول كلمة المرور
    if (password.length >= 6) strength += 20;
    if (password.length >= 10) strength += 10;
    
    // تنوع الأحرف
    if (/[a-z]/.test(password)) strength += 15;
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;
    
    // تحديد عرض مؤشر القوة
    strengthMeter.style.width = `${strength}%`;
    
    // تحديد لون ونص مؤشر القوة
    if (strength < 30) {
        strengthMeter.style.backgroundColor = '#f44336';
        strengthText.textContent = 'ضعيفة جداً';
        strengthText.style.color = '#f44336';
    } else if (strength < 60) {
        strengthMeter.style.backgroundColor = '#ff9800';
        strengthText.textContent = 'متوسطة';
        strengthText.style.color = '#ff9800';
    } else if (strength < 80) {
        strengthMeter.style.backgroundColor = '#4caf50';
        strengthText.textContent = 'قوية';
        strengthText.style.color = '#4caf50';
    } else {
        strengthMeter.style.backgroundColor = '#2e7d32';
        strengthText.textContent = 'قوية جداً';
        strengthText.style.color = '#2e7d32';
    }
}

/**
 * تحديث وصول العناصر حسب صلاحيات المستخدم
 */
function updateElementsAccess() {
    if (!currentUser) return;
    
    console.log('تحديث وصول العناصر حسب صلاحيات المستخدم...');
    
    // إضافة فئة نوع المستخدم للجسم
    document.body.setAttribute('data-user-type', currentUser.type);
    
    // عناصر حذف المستثمرين
    const deleteInvestorsElements = document.querySelectorAll('.delete-investor, [data-permission="canDeleteInvestors"]');
    toggleElementsVisibility(deleteInvestorsElements, currentUser.permissions.canDeleteInvestors);
    
    // عناصر إدارة الإعدادات
    const settingsManagementElements = document.querySelectorAll('.settings-management, [data-permission="canManageSettings"]');
    toggleElementsVisibility(settingsManagementElements, currentUser.permissions.canManageSettings);
    
    // عناصر تصدير البيانات
    const exportDataElements = document.querySelectorAll('.export-data, [data-permission="canExportData"]');
    toggleElementsVisibility(exportDataElements, currentUser.permissions.canExportData);

    // عناصر استيراد البيانات
    const importDataElements = document.querySelectorAll('.import-data, [data-permission="canImportData"]');
    toggleElementsVisibility(importDataElements, currentUser.permissions.canImportData);

    // عناصر إنشاء النسخ الاحتياطية
    const createBackupElements = document.querySelectorAll('.create-backup, [data-permission="canCreateBackup"]');
    toggleElementsVisibility(createBackupElements, currentUser.permissions.canCreateBackup);

    // عناصر استعادة النسخ الاحتياطية
    const restoreBackupElements = document.querySelectorAll('.restore-backup, [data-permission="canRestoreBackup"]');
    toggleElementsVisibility(restoreBackupElements, currentUser.permissions.canRestoreBackup);
    
    // عناصر إدارة المستخدمين
    const userManagementElements = document.querySelectorAll('.user-management, [data-permission="canCreateUsers"]');
    toggleElementsVisibility(userManagementElements, currentUser.permissions.canCreateUsers);
    
    // التحقق من القائمة الجانبية وتحديث العناصر فيها
    updateSidebarMenu();
    
    // تطبيق الأنماط CSS الديناميكية
    applyDynamicStyles();
}

/**
 * تبديل مرئية العناصر حسب الصلاحية
 * @param {NodeList} elements - قائمة العناصر
 * @param {boolean} isVisible - هل يجب إظهار العناصر
 */
function toggleElementsVisibility(elements, isVisible) {
    elements.forEach(element => {
        if (isVisible) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
}

/**
 * تحديث عناصر القائمة الجانبية حسب صلاحيات المستخدم
 */
function updateSidebarMenu() {
    const sidebarMenu = document.querySelector('.sidebar .nav-list');
    if (!sidebarMenu) return;
    
    // عرض/إخفاء عناصر القائمة حسب الصلاحيات
    const menuItems = sidebarMenu.querySelectorAll('.nav-item');
    menuItems.forEach(item => {
        // التحقق من العناصر التي تتطلب صلاحيات محددة
        if (item.classList.contains('admin-only') && currentUser.type !== USER_TYPES.ADMIN) {
            item.classList.add('hidden');
        } else if (item.classList.contains('manager-only') && 
                  currentUser.type !== USER_TYPES.ADMIN && 
                  currentUser.type !== USER_TYPES.MANAGER) {
            item.classList.add('hidden');
        } else {
            item.classList.remove('hidden');
        }
        
        // التحقق من العناصر التي تحتاج إلى صلاحيات محددة
        const permissionAttr = item.getAttribute('data-permission');
        if (permissionAttr && currentUser.permissions) {
            if (currentUser.permissions[permissionAttr]) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        }
    });
}

/**
 * تطبيق الأنماط CSS الديناميكية
 */
function applyDynamicStyles() {
    // التحقق من وجود عنصر النمط
    let styleElement = document.getElementById('auth-dynamic-styles');
    
    // إنشاء عنصر النمط إذا لم يكن موجوداً
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'auth-dynamic-styles';
        document.head.appendChild(styleElement);
    }
    
    // تحديد الأنماط بناءً على نوع المستخدم
    styleElement.textContent = `
        /* إخفاء العناصر للمستخدمين غير المصرح لهم */
        .hidden {
            display: none !important;
        }
        
        /* أنماط خاصة بنوع المستخدم */
        body[data-user-type="${USER_TYPES.USER}"] .admin-only,
        body[data-user-type="${USER_TYPES.USER}"] .manager-only {
            display: none !important;
        }
        
        body[data-user-type="${USER_TYPES.MANAGER}"] .admin-only {
            display: none !important;
        }
        
        /* أيقونة المستخدم بلون مختلف حسب نوع المستخدم */
        .user-avatar {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-color-dark));
            color: white;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }
        
        body[data-user-type="${USER_TYPES.ADMIN}"] .user-avatar {
            background: linear-gradient(135deg, var(--danger-color), #c53030);
        }
        
        body[data-user-type="${USER_TYPES.MANAGER}"] .user-avatar {
            background: linear-gradient(135deg, var(--warning-color), #d69e2e);
        }
        
        body[data-user-type="${USER_TYPES.USER}"] .user-avatar {
            background: linear-gradient(135deg, var(--primary-color), #2563eb);
        }
        
        /* تأثير حركي عند التحرك فوق أيقونة المستخدم */
        .user-avatar:hover {
            transform: scale(1.05);
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
        }
        
        /* تطبيق فلاتر لتقييد الوصول */
        body:not([data-user-type="${USER_TYPES.ADMIN}"]) .admin-access-table tr td:last-child .delete-action {
            opacity: 0.5;
            pointer-events: none;
            cursor: not-allowed;
        }
        
        body:not([data-user-type="${USER_TYPES.ADMIN}"]):not([data-user-type="${USER_TYPES.MANAGER}"]) .manager-access-table tr td:last-child .edit-action {
            opacity: 0.5;
            pointer-events: none;
            cursor: not-allowed;
        }
        
        /* الشريط العلوي مختلف حسب نوع المستخدم */
        header:before {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: var(--primary-color);
        }
        
        body[data-user-type="${USER_TYPES.ADMIN}"] header:before {
            background: var(--danger-color);
        }
        
        body[data-user-type="${USER_TYPES.MANAGER}"] header:before {
            background: var(--warning-color);
        }
    `;
}

/**
 * الحصول على تسمية نوع المستخدم
 * @param {string} userType - نوع المستخدم
 * @returns {string} - تسمية نوع المستخدم
 */
function getUserTypeLabel(userType) {
    switch (userType) {
        case USER_TYPES.ADMIN:
            return 'مسؤول النظام';
        case USER_TYPES.MANAGER:
            return 'مدير';
        case USER_TYPES.USER:
            return 'مستخدم';
        default:
            return 'غير معروف';
    }
}

/**
 * تفعيل القفل التلقائي
 */
function setupAutoLock() {
    console.log('تفعيل نظام القفل التلقائي...');
    
    // تخزين الوقت الحالي كآخر نشاط
    lastActivity = Date.now();
    
    // تعيين مؤقت جديد للجلسة
    if (sessionTimeoutId) {
        clearTimeout(sessionTimeoutId);
    }
    
    sessionTimeoutId = setTimeout(() => {
        // التحقق من وقت آخر نشاط
        const timeElapsed = Date.now() - lastActivity;
        
        // إذا تجاوز الوقت المنقضي منذ آخر نشاط مدة الجلسة، نقوم بعرض شاشة القفل
        if (timeElapsed >= SESSION_TIMEOUT) {
            console.log('انتهت مدة الجلسة بسبب عدم النشاط');
            
            // عرض شاشة القفل
            showLockScreen();
        }
    }, SESSION_TIMEOUT);
    
    // إضافة مستمعي الأحداث لتتبع نشاط المستخدم
    const events = ['mousedown', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
        document.addEventListener(event, refreshUserSession, { passive: true });
    });
}

/**
 * عرض نافذة منبثقة مخصصة
 * @param {string} title - عنوان النافذة
 * @param {string} content - محتوى النافذة
 * @param {Function} onRendered - دالة تنفذ بعد إضافة النافذة للصفحة
 * @returns {HTMLElement} - عنصر النافذة
 */
function showModal(title, content, onRendered) {
    console.log(`عرض نافذة: ${title}`);
    
    // إنشاء عناصر النافذة المنبثقة
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = 'custom-modal-' + Date.now();
    
    modalOverlay.innerHTML = `
        <div class="modal animate__animated animate__fadeInUp">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline modal-close-btn">إغلاق</button>
            </div>
        </div>
    `;
    
    // إضافة النافذة للصفحة
    document.body.appendChild(modalOverlay);
    
    // إظهار النافذة
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 50);
    
    // إضافة مستمعي الأحداث
    const closeButtons = modalOverlay.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(modalOverlay);
        });
    });
    
    // إغلاق النافذة عند النقر خارجها
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal(modalOverlay);
        }
    });
    
    // تنفيذ الدالة بعد إضافة النافذة
    if (typeof onRendered === 'function') {
        onRendered(modalOverlay);
    }
    
    return modalOverlay;
}

/**
 * إغلاق نافذة منبثقة
 * @param {HTMLElement|string} modal - عنصر النافذة أو معرفها
 */
function closeModal(modal) {
    // إذا كان المعلمة عبارة عن نص، نفترض أنه معرف النافذة
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    
    if (modal) {
        // إخفاء النافذة بتأثير حركي
        modal.classList.remove('active');
        
        // انتظار انتهاء التأثير الحركي
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
        }, 300);
    }
}

/**
 * ملف CSS لنظام المصادقة المحسن
 * يضيف الأنماط الجمالية والتأثيرات الحركية
 */
function addEnhancedAuthStyles() {
    console.log('إضافة أنماط CSS المحسنة لنظام المصادقة...');
    
    // التحقق من وجود الأنماط مسبقاً
    if (document.getElementById('enhanced-auth-styles')) {
        return;
    }
    
    // إنشاء عنصر النمط
    const styleElement = document.createElement('style');
    styleElement.id = 'enhanced-auth-styles';
    
    // إضافة أنماط CSS
    styleElement.textContent = `
        /* ===== المتغيرات والألوان الرئيسية ===== */
        :root {
            --primary-color: #3b82f6;
            --primary-color-dark: #2563eb;
            --primary-color-light: #60a5fa;
            --secondary-color: #6b7280;
            --success-color: #10b981;
            --danger-color: #ef4444;
            --warning-color: #f59e0b;
            --info-color: #06b6d4;
            --bg-color: #f8fafc;
            --text-color: #1e293b;
            --text-color-light: #64748b;
            --border-color: #e2e8f0;
            --input-bg: #fff;
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            --radius-sm: 0.25rem;
            --radius-md: 0.5rem;
            --radius-lg: 1rem;
            --font-main: 'Tajawal', sans-serif;
        }

        /* ===== شاشة تسجيل الدخول ===== */
        .auth-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            direction: rtl;
            background: linear-gradient(135deg, #f8fafc, #3b82f6);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .auth-screen.active {
            opacity: 1;
        }

        .auth-container {
            width: 100%;
            max-width: 450px;
            background-color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            position: relative;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }

        .auth-screen.active .auth-container {
            transform: translateY(0);
        }

        .auth-content {
            padding: 2rem;
        }

        .auth-header {
            text-align: center;
            margin-bottom: 2rem;
        }

        .auth-logo {
            color: var(--primary-color);
            margin-bottom: 1rem;
        }

        .auth-logo i {
            font-size: 3rem;
            margin-bottom: 0.5rem;
            display: block;
        }

        .auth-logo span {
            display: block;
            font-size: 1.5rem;
            font-weight: 700;
        }

        .auth-welcome {
            color: var(--text-color-light);
            margin: 0;
            font-size: 1rem;
        }

        .auth-tabs {
            display: flex;
            margin-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-color);
        }

        .auth-tab {
            flex: 1;
            padding: 0.75rem;
            text-align: center;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            color: var(--text-color-light);
            transition: all 0.3s ease;
            position: relative;
        }

        .auth-tab.active {
            color: var(--primary-color);
        }

        .auth-tab.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: var(--primary-color);
            border-radius: 2px 2px 0 0;
        }

        .auth-tab-content {
            display: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        }

        .auth-tab-content.active {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }

        .auth-footer {
            text-align: center;
            padding: 1rem;
            border-top: 1px solid var(--border-color);
            color: var(--text-color-light);
            font-size: 0.9rem;
        }

        .version-info {
            opacity: 0.7;
            font-size: 0.8rem;
        }

        /* ===== نماذج المصادقة ===== */
        .form-group {
            margin-bottom: 1.25rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: var(--text-color);
        }

        .input-with-icon {
            position: relative;
        }

        .input-with-icon i {
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-color-light);
            font-size: 1rem;
        }

        .input-with-icon input,
        .input-with-icon select {
            padding-right: 2.5rem;
        }

        .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            background-color: var(--input-bg);
            color: var(--text-color);
            font-family: var(--font-main);
            transition: all 0.3s ease;
        }

        .form-input:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .form-input.error {
            border-color: var(--danger-color);
        }

        .form-select {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            background-color: var(--input-bg);
            color: var(--text-color);
            font-family: var(--font-main);
            appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: left 0.75rem center;
            background-size: 1rem;
            padding-left: 2.5rem;
            transition: all 0.3s ease;
        }

        .form-select:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        }

        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .checkbox-container {
            display: flex;
            align-items: center;
            cursor: pointer;
            font-size: 0.9rem;
            color: var(--text-color-light);
        }

        .checkbox-container input {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }

        .checkmark {
            position: relative;
            display: inline-block;
            height: 18px;
            width: 18px;
            background-color: #f1f5f9;
            border: 1px solid var(--border-color);
            border-radius: 3px;
            margin-left: 0.5rem;
            transition: all 0.3s ease;
        }

        .checkbox-container:hover input ~ .checkmark {
            background-color: #e2e8f0;
        }

        .checkbox-container input:checked ~ .checkmark {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
        }

        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }

        .checkbox-container input:checked ~ .checkmark:after {
            display: block;
        }

        .checkbox-container .checkmark:after {
            left: 6px;
            top: 2px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }

        .btn-link {
            background: none;
            border: none;
            padding: 0;
            color: var(--primary-color);
            font-size: 0.9rem;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-link:hover {
            color: var(--primary-color-dark);
            text-decoration: underline;
        }

        /* ===== حقل كلمة المرور ===== */
        .password-input-container {
            position: relative;
        }

        .toggle-password {
            position: absolute;
            top: 50%;
            left: 0.75rem;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: var(--text-color-light);
            cursor: pointer;
            padding: 0.25rem;
            font-size: 0.9rem;
        }

        .toggle-password:hover {
            color: var(--text-color);
        }

        /* ===== الأزرار ===== */
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.625rem 1.25rem;
            border-radius: var(--radius-md);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            border: 1px solid transparent;
            text-align: center;
        }

        .btn i {
            margin-left: 0.5rem;
        }

        .btn-primary {
            background-color: var(--primary-color);
            color: white;
        }

        .btn-primary:hover {
            background-color: var(--primary-color-dark);
            transform: translateY(-1px);
        }

        .btn-primary:active {
            transform: translateY(0);
        }

        .btn-outline {
            background-color: transparent;
            border-color: var(--border-color);
            color: var(--text-color);
        }

        .btn-outline:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .btn-block {
            display: flex;
            width: 100%;
        }

        .btn-animated {
            position: relative;
            overflow: hidden;
        }

        .btn-animated::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 100%;
            height: 100%;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            transition: transform 0.5s ease-out;
        }

        .btn-animated:active::after {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
        }

        /* ===== إشعارات المصادقة ===== */
        .auth-notification {
            position: fixed;
            top: -100px;
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 400px;
            padding: 0.75rem 1rem;
            border-radius: var(--radius-md);
            background-color: white;
            box-shadow: var(--shadow-md);
            transition: top 0.5s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1050;
        }

        .auth-notification.show {
            top: 1.5rem;
        }

        .auth-notification.success {
            background-color: #d4edda;
            color: #155724;
            border-right: 4px solid var(--success-color);
        }

        .auth-notification.error {
            background-color: #f8d7da;
            color: #721c24;
            border-right: 4px solid var(--danger-color);
        }

        .auth-notification.warning {
            background-color: #fff3cd;
            color: #856404;
            border-right: 4px solid var(--warning-color);
        }

        .auth-notification.info {
            background-color: #d1ecf1;
            color: #0c5460;
            border-right: 4px solid var(--info-color);
        }

        .auth-notification-content {
            display: flex;
            align-items: center;
        }

        .auth-notification-icon {
            margin-left: 0.75rem;
            font-size: 1.25rem;
        }

        .auth-notification-close {
            background: none;
            border: none;
            font-size: 1.25rem;
            cursor: pointer;
            color: inherit;
            opacity: 0.7;
        }

        .auth-notification-close:hover {
            opacity: 1;
        }

        /* ===== مربع حوار استعادة كلمة المرور ===== */
        .dialog-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            direction: rtl;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .dialog-overlay.active {
            opacity: 1;
        }

        .dialog {
            width: 90%;
            max-width: 400px;
            background-color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }

        .dialog-overlay.active .dialog {
            transform: translateY(0);
        }

        .dialog-header {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .dialog-title {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-color);
        }

        .dialog-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-color-light);
            transition: color 0.3s ease;
        }

        .dialog-close:hover {
            color: var(--danger-color);
        }

        .dialog-body {
            padding: 1.5rem;
        }

        .dialog-body p {
            margin-top: 0;
            color: var(--text-color-light);
        }

        .form-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
            margin-top: 1.5rem;
        }

        /* ===== شاشة القفل ===== */
        .lock-screen {
            background: linear-gradient(135deg, #1e293b, #3b82f6);
        }

        .lock-screen-user {
            text-align: center;
            margin-bottom: 2rem;
        }

        .lock-screen-user .user-avatar {
            width: 80px;
            height: 80px;
            font-size: 2rem;
            margin: 0 auto 1rem;
        }

        .lock-screen-user h2 {
            margin: 0.5rem 0 0.25rem 0;
            color: var(--text-color);
            font-size: 1.5rem;
        }

        .lock-screen-user p {
            margin: 0;
            color: var(--text-color-light);
            font-size: 0.875rem;
            opacity: 0.8;
        }

        .auth-message {
            text-align: center;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background-color: rgba(255, 255, 255, 0.05);
            border-radius: var(--radius-md);
        }

        .auth-message i {
            font-size: 2rem;
            color: var(--warning-color);
            margin-bottom: 0.5rem;
        }

        .auth-message p {
            margin: 0;
            color: var(--text-color-light);
        }

        /* ===== النافذة المنبثقة ===== */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            direction: rtl;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .modal-overlay.active {
            display: flex;
            opacity: 1;
        }

        .modal {
            width: 90%;
            max-width: 500px;
            background-color: white;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            overflow: hidden;
            transform: translateY(20px);
            transition: transform 0.3s ease;
        }

        .modal-overlay.active .modal {
            transform: translateY(0);
        }

        .modal-header {
            padding: 1rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            margin: 0;
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--text-color);
        }

        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--text-color-light);
            transition: color 0.3s ease;
        }

        .modal-close:hover {
            color: var(--danger-color);
        }

        .modal-body {
            padding: 1.5rem;
            max-height: 70vh;
            overflow-y: auto;
        }

        .modal-footer {
            padding: 1rem 1.5rem;
            border-top: 1px solid var(--border-color);
            display: flex;
            justify-content: flex-end;
            gap: 0.75rem;
        }

        /* ===== قائمة المستخدم ===== */
        .user-info {
            position: relative;
            z-index: 100;
        }

        .dropdown {
            position: relative;
        }

        .dropdown-toggle {
            display: flex;
            align-items: center;
            background: none;
            border: none;
            cursor: pointer;
            color: inherit;
            padding: 0.25rem 0.5rem;
            border-radius: var(--radius-sm);
            transition: background-color 0.3s ease;
        }

        .dropdown-toggle:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .user-avatar {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 1rem;
            margin-left: 0.75rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .user-avatar.small {
            width: 2rem;
            height: 2rem;
            font-size: 0.875rem;
        }

        .user-avatar.medium {
            width: 3rem;
            height: 3rem;
            font-size: 1.25rem;
        }

        .user-avatar.large {
            width: 4rem;
            height: 4rem;
            font-size: 1.5rem;
        }

        .user-name {
            font-weight: 500;
            color: var(--text-color);
        }

        .user-type {
            color: var(--text-color-light);
            font-size: 0.75rem;
        }

        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            width: 220px;
            background-color: white;
            border-radius: var(--radius-md);
            box-shadow: var(--shadow-md);
            padding: 0.5rem 0;
            display: none;
            z-index: 100;
            margin-top: 0.5rem;
            transform: translateY(10px);
            opacity: 0;
            transition: all 0.3s ease;
        }

        .dropdown.active .dropdown-menu {
            display: block;
            transform: translateY(0);
            opacity: 1;
        }

        .dropdown-item {
            display: flex;
            align-items: center;
            padding: 0.625rem 1rem;
            color: var(--text-color);
            text-decoration: none;
            transition: background-color 0.3s ease;
        }

        .dropdown-item:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .dropdown-item i {
            margin-left: 0.75rem;
            width: 1.25rem;
            text-align: center;
            color: var(--text-color-light);
        }

        .dropdown-divider {
            height: 1px;
            background-color: var(--border-color);
            margin: 0.5rem 0;
        }

        /* ===== الملف الشخصي ===== */
        .profile-container {
            padding: 1rem 0;
        }

        .profile-avatar {
            display: flex;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .avatar-circle {
            width: 4.5rem;
            height: 4.5rem;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.75rem;
            font-weight: 600;
            margin-left: 1.25rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .profile-info {
            flex: 1;
        }

        .profile-info h3 {
            margin: 0 0 0.5rem 0;
            color: var(--text-color);
        }

        .user-type-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            border-radius: 1rem;
            font-size: 0.75rem;
            font-weight: 600;
        }

        .user-type-badge.admin {
            background-color: #f8d7da;
            color: #721c24;
        }

        .user-type-badge.manager {
            background-color: #fff3cd;
            color: #856404;
        }

        .user-type-badge.user {
            background-color: #d1ecf1;
            color: #0c5460;
        }

        /* ===== مؤشر قوة كلمة المرور ===== */
        .password-strength {
            margin-top: 1rem;
        }

        .strength-meter {
            height: 4px;
            background-color: #e2e8f0;
            border-radius: 2px;
            margin-bottom: 0.5rem;
            overflow: hidden;
        }

        .strength-meter-fill {
            height: 100%;
            width: 0;
            background-color: #ef4444;
            transition: all 0.3s ease;
        }

        .strength-text {
            font-size: 0.75rem;
            color: #6b7280;
            text-align: left;
        }

        /* ===== حالات التحميل والتأثيرات ===== */
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }

        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
            10%, 90% {
                transform: translate3d(-1px, 0, 0);
            }
            20%, 80% {
                transform: translate3d(2px, 0, 0);
            }
            30%, 50%, 70% {
                transform: translate3d(-4px, 0, 0);
            }
            40%, 60% {
                transform: translate3d(4px, 0, 0);
            }
        }

        /* ===== المخطط التفاعلي ===== */
        @media (prefers-reduced-motion: reduce) {
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        }

        /* ===== التوافق مع الهواتف المحمولة ===== */
        @media (max-width: 768px) {
            .auth-container {
                max-width: 90%;
                padding-bottom: 0;
            }
            
            .profile-avatar {
                flex-direction: column;
                text-align: center;
            }
            
            .avatar-circle {
                margin: 0 auto 1rem;
            }
            
            .form-actions {
                flex-direction: column;
            }
            
            .form-actions button {
                width: 100%;
                margin-bottom: 0.5rem;
            }
            
            .dropdown-menu {
                width: 100%;
                left: 0;
                right: 0;
            }
        }
    `;
    
    // إضافة عنصر النمط إلى رأس الصفحة
    document.head.appendChild(styleElement);
    console.log('تم إضافة أنماط CSS لنظام المصادقة المحسن');
}

/**
 * تسجيل الأحداث في قاعدة البيانات
 * @param {string} action - نوع العملية
 * @param {string} entityType - نوع الكيان (مستثمر، عملية، إلخ)
 * @param {string} entityId - معرف الكيان
 * @param {Object} details - تفاصيل العملية
 * @returns {Promise} وعد يشير إلى نجاح أو فشل العملية
 */
function logAction(action, entityType, entityId, details = {}) {
    if (!currentUser || (!databaseRef && firebase.apps.length > 0)) {
        return Promise.reject(new Error('غير مصرح بتسجيل العمليات'));
    }
    
    const logEntry = {
        action,
        entityType,
        entityId,
        timestamp: new Date().toISOString(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userName: currentUser.displayName,
        userType: currentUser.type,
        details
    };
    
    if (firebase.apps.length > 0 && databaseRef) {
        return databaseRef.ref(`system_logs/${entityType}`).push(logEntry);
    } else {
        // حفظ السجل في التخزين المحلي
        const localLogs = JSON.parse(localStorage.getItem('local_logs') || '{}');
        
        if (!localLogs[entityType]) {
            localLogs[entityType] = [];
        }
        
        localLogs[entityType].push(logEntry);
        localStorage.setItem('local_logs', JSON.stringify(localLogs));
        
        return Promise.resolve();
    }
}

/**
 * الربط بين العمليات والمستخدم الحالي
 * يتم استدعاء هذه الدالة عند إضافة/تعديل/حذف المستثمرين أو العمليات
 * @param {Object} data - البيانات المراد ربطها بالمستخدم
 * @returns {Object} - البيانات بعد إضافة معلومات المستخدم
 */
function attachUserInfo(data) {
    if (!currentUser) {
        return data;
    }
    
    // إضافة معلومات المستخدم إلى البيانات
    return {
        ...data,
        createdBy: {
            uid: currentUser.uid,
            name: currentUser.displayName || currentUser.email,
            type: currentUser.type,
            timestamp: new Date().toISOString()
        }
    };
}

/**
 * تعديل دوال النظام الأساسية لتكامل نظام المصادقة
 */
function modifySystemFunctions() {
    console.log('تعديل دوال النظام الأساسية...');
    
    // حفظ الدوال الأصلية
    if (!window._originalAddNewInvestor && window.addNewInvestor) {
        window._originalAddNewInvestor = window.addNewInvestor;
    }
    
    if (!window._originalAddTransaction && window.addTransaction) {
        window._originalAddTransaction = window.addTransaction;
    }
    
    if (!window._originalAddDeposit && window.addDeposit) {
        window._originalAddDeposit = window.addDeposit;
    }
    
    if (!window._originalWithdrawAmount && window.withdrawAmount) {
        window._originalWithdrawAmount = window.withdrawAmount;
    }
    
    if (!window._originalDeleteInvestor && window.deleteInvestor) {
        window._originalDeleteInvestor = window.deleteInvestor;
    }
    
    if (!window._originalSaveData && window.saveData) {
        window._originalSaveData = window.saveData;
    }
    
    if (!window._originalLoadData && window.loadData) {
        window._originalLoadData = window.loadData;
    }
    
    // تعديل دالة إضافة مستثمر جديد
    if (window._originalAddNewInvestor) {
        window.addNewInvestor = function() {
            // التحقق من تسجيل الدخول
            if (!currentUser) {
                showNotification('يجب تسجيل الدخول أولاً', 'error');
                showLoginScreen();
                return;
            }
            
            // استدعاء الدالة الأصلية
            const result = window._originalAddNewInvestor.apply(this, arguments);
            
            // إذا تمت العملية بنجاح
            if (result && investors && investors.length > 0) {
                // البحث عن المستثمر الجديد
                const newInvestor = investors[investors.length - 1];
                
                // إضافة معلومات المستخدم
                newInvestor.createdBy = {
                    uid: currentUser.uid,
                    name: currentUser.displayName || currentUser.email,
                    type: currentUser.type,
                    timestamp: new Date().toISOString()
                };
                
                // تسجيل العملية
                logAction('investor_created', 'investors', newInvestor.id, {
                    investorName: newInvestor.name,
                    amount: newInvestor.amount
                });
                
                // تحديث البيانات في Firebase
                if (databaseRef) {
                    const investorData = {...newInvestor};
                    
                    databaseRef.ref(`data/${currentUser.uid}/investors/${newInvestor.id}`).set(investorData)
                        .catch(error => {
                            console.error('خطأ في حفظ بيانات المستثمر في Firebase:', error);
                        });
                }
                
                // تحديث البيانات المحلية
                saveData();
                
                // تحديث الواجهة
                document.dispatchEvent(new CustomEvent('investor:update'));
            }
            
            return result;
        };
    }

    // تعديل دالة حفظ البيانات
    if (window._originalSaveData) {
        window.saveData = function() {
            // التحقق من تسجيل الدخول
            if (!currentUser) {
                console.warn('محاولة حفظ البيانات دون تسجيل الدخول');
                return window._originalSaveData.apply(this, arguments);
            }
            
            // استدعاء الدالة الأصلية
            const result = window._originalSaveData.apply(this, arguments);
            
            // مزامنة البيانات مع Firebase
            if (result && databaseRef) {
                const data = {
                    investors: investors || [],
                    transactions: transactions || [],
                    settings: settings || {},
                    lastUpdated: new Date().toISOString(),
                    updatedBy: {
                        uid: currentUser.uid,
                        name: currentUser.displayName || currentUser.email
                    }
                };
                
                databaseRef.ref(`data/${currentUser.uid}`).update(data)
                    .catch(error => {
                        console.error('خطأ في مزامنة البيانات مع Firebase:', error);
                    });
            }
            
            return result;
        };
    }
    
    // تعديل دالة تحميل البيانات
    if (window._originalLoadData) {
        window.loadData = function() {
            // التحقق من تسجيل الدخول
            if (!currentUser) {
                console.warn('محاولة تحميل البيانات دون تسجيل الدخول');
                return window._originalLoadData.apply(this, arguments);
            }
            
            // محاولة تحميل البيانات من Firebase أولاً
            if (databaseRef) {
                return databaseRef.ref(`data/${currentUser.uid}`).once('value')
                    .then(snapshot => {
                        const firebaseData = snapshot.val();
                        
                        if (firebaseData) {
                            // تحميل البيانات من Firebase
                            if (firebaseData.investors) {
                                window.investors = firebaseData.investors;
                                localStorage.setItem('investors', JSON.stringify(firebaseData.investors));
                            }
                            
                            if (firebaseData.transactions) {
                                window.transactions = firebaseData.transactions;
                                localStorage.setItem('transactions', JSON.stringify(firebaseData.transactions));
                            }
                            
                            if (firebaseData.settings) {
                                window.settings = firebaseData.settings;
                                localStorage.setItem('settings', JSON.stringify(firebaseData.settings));
                            }
                            
                            console.log('تم تحميل البيانات من Firebase');
                            
                            // تحديث الواجهة بعد تحميل البيانات
                            updateUI();
                            
                            return true;
                        } else {
                            // إذا لم تكن هناك بيانات في Firebase، نستخدم البيانات المحلية
                            return window._originalLoadData.apply(this, arguments);
                        }
                    })
                    .catch(error => {
                        console.error('خطأ في تحميل البيانات من Firebase:', error);
                        
                        // استخدام البيانات المحلية في حالة الخطأ
                        return window._originalLoadData.apply(this, arguments);
                    });
            } else {
                // استخدام البيانات المحلية إذا لم يكن هناك اتصال بـ Firebase
                return window._originalLoadData.apply(this, arguments);
            }
        };
    }
}

/**
 * تحديث واجهة المستخدم بعد تحميل البيانات
 */
function updateUI() {
    // تحديث الجداول
    if (window.renderInvestorsTable) {
        window.renderInvestorsTable();
    }
    
    if (window.renderTransactionsTable) {
        window.renderTransactionsTable();
    }
    
    if (window.updateDashboard) {
        window.updateDashboard();
    }
    
    if (window.renderProfitsTable) {
        window.renderProfitsTable();
    }
    
    if (window.renderRecentTransactions) {
        window.renderRecentTransactions();
    }
}

/**
 * إضافة طبقة أمان للتحقق من تسجيل الدخول على مستوى الصفحة
 */
function addSecurityLayer() {
    console.log('إضافة طبقة أمان...');
    
    // التحقق من تسجيل الدخول عند تحميل الصفحة
    window.addEventListener('load', function() {
        initialize().then(() => {
            // التحقق من وجود مستخدم حالي
            if (!currentUser) {
                // عرض شاشة تسجيل الدخول
                showLoginScreen();
            }
        });
    });
    
    // إضافة مستمع حدث لإعادة التحقق من تسجيل الدخول عند استعادة نشاط الصفحة
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // إعادة التحقق من تسجيل الدخول
            if (firebase.apps.length > 0 && firebase.auth().currentUser) {
                // المستخدم مازال مسجل الدخول
                refreshUserSession();
            } else if (currentUser) {
                // التحقق من صلاحية الجلسة
                const user = JSON.parse(localStorage.getItem(AUTH_USER_KEY) || 'null');
                
                if (user && user.sessionExpiry) {
                    const sessionExpiry = new Date(user.sessionExpiry);
                    
                    if (sessionExpiry < new Date()) {
                        // انتهت صلاحية الجلسة
                        showLockScreen();
                    } else {
                        // تمديد الجلسة
                        refreshUserSession();
                    }
                } else {
                    // لا توجد معلومات جلسة، عرض شاشة تسجيل الدخول
                    showLoginScreen();
                }
            } else {
                // المستخدم غير مسجل الدخول، نعرض شاشة تسجيل الدخول
                showLoginScreen();
            }
        }
    });
    
    // إضافة مستمع حدث للتحقق من تسجيل الدخول قبل تنفيذ أي عملية
    document.addEventListener('click', function(e) {
        // إذا كان المستخدم مسجل الدخول، نسمح بالعملية
        if (currentUser) return;
        
        // التحقق مما إذا كان النقر على عنصر فعال
        const actionElement = e.target.closest('button:not(.auth-related), a:not(.auth-related), .clickable:not(.auth-related)');
        
        if (!actionElement) return;
        
        // التحقق مما إذا كان العنصر داخل شاشة تسجيل الدخول
        if (e.target.closest('#auth-login-screen, #auth-lock-screen, .auth-notification, .dialog-overlay, .modal-overlay')) return;
        
        // منع السلوك الافتراضي
        e.preventDefault();
        e.stopPropagation();
        
        // عرض رسالة تنبيه
        showNotification('يجب تسجيل الدخول أولاً', 'warning');
        
        // عرض شاشة تسجيل الدخول
        showLoginScreen();
    }, true);
}

/**
 * إعداد نظام المصادقة والأمان
 */
function setupSecuritySystem() {
    console.log(`تهيئة نظام المصادقة والأمان المحسن (الإصدار ${AUTH_SYSTEM_VERSION})...`);
    
    // إضافة أنماط CSS المحسنة
    addEnhancedAuthStyles();
    
    // تهيئة نظام المصادقة
    initialize()
        .then(initialized => {
            console.log('تهيئة نظام المصادقة:', initialized ? 'تمت بنجاح' : 'لم تكتمل');
            
            if (initialized) {
                // تعديل دوال النظام الأساسية
                modifySystemFunctions();
                
                // إضافة طبقة أمان
                addSecurityLayer();
                
                // تفعيل القفل التلقائي
                setupAutoLock();
                
                // إنشاء صفحة إدارة المستخدمين إذا كان المستخدم لديه صلاحية
                if (currentUser && currentUser.permissions.canCreateUsers) {
                    createUserManagementPage();
                }
                
                // إنشاء صفحة سجل الأحداث إذا كان المستخدم مسؤولاً
                if (currentUser && currentUser.type === USER_TYPES.ADMIN) {
                    createActivityLogPage();
                }
                
                console.log('تم إعداد نظام الأمان بنجاح');
            }
        })
        .catch(error => {
            console.error('خطأ في إعداد نظام الأمان:', error);
        });
}

// بدء تشغيل نظام المصادقة والأمان
document.addEventListener('DOMContentLoaded', function() {
    // تحميل رمز المسؤول من التخزين المحلي إذا كان موجوداً
    const savedAdminCode = localStorage.getItem('admin_code');
    if (savedAdminCode) {
        ADMIN_CODE = savedAdminCode;
    }
    
    // إعداد نظام المصادقة والأمان
    setupSecuritySystem();
});

// تصدير واجهة برمجة التطبيق
return {
    initialize,
    login,
    signup,
    logout,
    getUserData,
    updateUserData,
    deleteUser,
    getUsers,
    changePassword,
    resetPassword,
    checkIfFirstUser,
    logAction,
    attachUserInfo,
    getCurrentUser: () => currentUser,
    getPermissions: () => currentUser ? currentUser.permissions : null,
    isAdmin: () => currentUser && currentUser.type === USER_TYPES.ADMIN,isManager: () => currentUser && (currentUser.type === USER_TYPES.ADMIN || currentUser.type === USER_TYPES.MANAGER),
    isUser: () => currentUser && currentUser.type === USER_TYPES.USER,
    hasPermission: (permission) => currentUser && currentUser.permissions && currentUser.permissions[permission],
    addAuthStateListener,
    removeAuthStateListener,
    showLoginScreen,
    hideLoginScreen,
    showLockScreen,
    hideLockScreen,
    refreshUserSession,
    showProfileModal,
    showChangePasswordModal,
    changeAdminCode,
    showNotification,
    USER_TYPES,
    PERMISSIONS,
    VERSION: AUTH_SYSTEM_VERSION
};