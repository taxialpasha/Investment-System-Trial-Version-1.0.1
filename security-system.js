/**
 * security-system.js
 * نظام الأمان المتكامل لتطبيق نظام الاستثمار المتكامل
 * يوفر إدارة تسجيل الدخول، المستخدمين، الصلاحيات، والجلسات
 */

// كائن نظام الأمان الرئيسي
const SecuritySystem = (function() {
    // المتغيرات الخاصة
    let currentUser = null;
    let isAuthenticated = false;
    let sessionTimeout = null;
    let sessionTimeoutDuration = 30 * 60 * 1000; // 30 دقيقة افتراضياً
    let authCallback = null;
    
    // قائمة المستخدمين الافتراضية (ستُخزن في localStorage)
    const defaultUsers = [
        {
            id: 'admin',
            username: 'admin',
            password: 'e3274be5c857fb42ab72d786e281b4b8', // "admin123" بعد التشفير
            displayName: 'مدير النظام',
            role: 'admin',
            permissions: ['all'],
            isActive: true,
            lastLogin: null,
            failedLogins: 0,
            isLocked: false,
            passwordChanged: false
        }
    ];
    
    // قائمة الأدوار وصلاحياتها
    const roles = {
        admin: {
            name: 'مدير النظام',
            permissions: ['all']
        },
        manager: {
            name: 'مدير',
            permissions: ['view_investors', 'add_investor', 'edit_investor', 'view_transactions', 
                          'add_transaction', 'view_profits', 'pay_profits', 'view_reports']
        },
        user: {
            name: 'مستخدم',
            permissions: ['view_investors', 'view_transactions', 'view_profits', 'view_reports']
        },
        guest: {
            name: 'ضيف',
            permissions: ['view_reports']
        }
    };
    
    /**
     * دالة التهيئة - تُستدعى عند بدء التطبيق
     * @param {Object} config اعدادات التهيئة
     */
    function init(config = {}) {
        console.log('تهيئة نظام الأمان...');
        
        // تطبيق الإعدادات المخصصة
        if (config.sessionTimeoutDuration) {
            sessionTimeoutDuration = config.sessionTimeoutDuration;
        }
        
        // حفظ دالة استدعاء المصادقة
        if (typeof config.authCallback === 'function') {
            authCallback = config.authCallback;
        }
        
        // التحقق من وجود بيانات المستخدمين في التخزين المحلي
        if (!localStorage.getItem('securityUsers')) {
            // تهيئة بيانات المستخدمين الافتراضية
            localStorage.setItem('securityUsers', JSON.stringify(defaultUsers));
        }
        
        // استعادة الجلسة إذا كانت موجودة
        restoreSession();
        
        // إضافة مستمع للأحداث لتتبع نشاط المستخدم
        document.addEventListener('click', resetSessionTimeout);
        document.addEventListener('keypress', resetSessionTimeout);
        
        // إضافة مستمع الأحداث للصفحات المحمية
        setupProtectedPages();
        
        // إضافة واجهة تسجيل الدخول
        createLoginUI();
        
        // إضافة واجهة إدارة المستخدمين
        createUserManagementUI();
        
        // إضافة أيقونات الأمان إلى شريط الأدوات
        addSecurityToolbarIcons();
        
        // إذا لم يكن المستخدم مصادقاً، عرض شاشة تسجيل الدخول
        if (!isAuthenticated) {
            showLoginScreen();
        }
        
        console.log('تم تهيئة نظام الأمان بنجاح');
    }
    
    /**
     * إنشاء واجهة تسجيل الدخول
     */
    function createLoginUI() {
        // التحقق من وجود واجهة تسجيل الدخول مسبقاً
        if (document.getElementById('security-login-screen')) {
            return;
        }
        
        // إنشاء عنصر واجهة تسجيل الدخول
        const loginScreen = document.createElement('div');
        loginScreen.id = 'security-login-screen';
        loginScreen.className = 'security-screen';
        
        loginScreen.innerHTML = `
            <div class="security-login-container">
                <div class="security-login-header">
                    <div class="security-logo">
                        <i class="fas fa-shield-alt"></i>
                        <h2>نظام الاستثمار المتكامل</h2>
                    </div>
                </div>
                <div class="security-login-body">
                    <form id="security-login-form">
                        <div class="security-form-group">
                            <label for="security-username">اسم المستخدم</label>
                            <div class="security-input-container">
                                <i class="fas fa-user"></i>
                                <input type="text" id="security-username" placeholder="أدخل اسم المستخدم" autocomplete="username" required>
                            </div>
                        </div>
                        <div class="security-form-group">
                            <label for="security-password">كلمة المرور</label>
                            <div class="security-input-container">
                                <i class="fas fa-lock"></i>
                                <input type="password" id="security-password" placeholder="أدخل كلمة المرور" autocomplete="current-password" required>
                                <button type="button" class="security-toggle-password" tabindex="-1">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="security-form-group">
                            <div class="security-remember-me">
                                <input type="checkbox" id="security-remember-me">
                                <label for="security-remember-me">تذكرني</label>
                            </div>
                        </div>
                        <div id="security-login-error" class="security-error-message"></div>
                        <div class="security-form-actions">
                            <button type="submit" class="security-login-btn">تسجيل الدخول</button>
                        </div>
                    </form>
                </div>
                <div class="security-login-footer">
                    <p>جميع الحقوق محفوظة &copy; ${new Date().getFullYear()}</p>
                </div>
            </div>
        `;
        
        // إضافة واجهة تسجيل الدخول إلى الصفحة
        document.body.appendChild(loginScreen);
        
        // إضافة مستمعي الأحداث
        setupLoginEvents();
    }
    
    /**
     * إضافة مستمعي الأحداث لواجهة تسجيل الدخول
     */
    function setupLoginEvents() {
        // مستمع حدث تقديم نموذج تسجيل الدخول
        const loginForm = document.getElementById('security-login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.getElementById('security-username').value;
                const password = document.getElementById('security-password').value;
                const rememberMe = document.getElementById('security-remember-me').checked;
                
                // إخفاء رسالة الخطأ السابقة
                document.getElementById('security-login-error').textContent = '';
                
                // محاولة تسجيل الدخول
                login(username, password, rememberMe)
                    .then(() => {
                        // تم تسجيل الدخول بنجاح
                        hideLoginScreen();
                        
                        // استدعاء دالة التبليغ عن المصادقة إذا كانت موجودة
                        if (typeof authCallback === 'function') {
                            authCallback(true, currentUser);
                        }
                    })
                    .catch(error => {
                        // عرض رسالة الخطأ
                        document.getElementById('security-login-error').textContent = error.message;
                        
                        // هز حقل كلمة المرور للتنبيه
                        const passwordField = document.getElementById('security-password');
                        passwordField.classList.add('security-shake');
                        setTimeout(() => {
                            passwordField.classList.remove('security-shake');
                        }, 500);
                    });
            });
        }
        
        // مستمع حدث زر إظهار/إخفاء كلمة المرور
        const togglePasswordBtn = document.querySelector('.security-toggle-password');
        if (togglePasswordBtn) {
            togglePasswordBtn.addEventListener('click', function() {
                const passwordField = document.getElementById('security-password');
                const icon = this.querySelector('i');
                
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordField.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        }
    }
    
    /**
     * إنشاء واجهة إدارة المستخدمين
     */
    function createUserManagementUI() {
        // سيتم إنشاء واجهة إدارة المستخدمين عند طلبها
        const userManagement = document.createElement('div');
        userManagement.id = 'security-user-management';
        userManagement.className = 'security-modal';
        
        userManagement.innerHTML = `
            <div class="security-modal-content">
                <div class="security-modal-header">
                    <h3>إدارة المستخدمين</h3>
                    <button type="button" class="security-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="security-modal-body">
                    <div class="security-users-actions">
                        <button type="button" class="security-btn" id="security-add-user-btn">
                            <i class="fas fa-user-plus"></i> إضافة مستخدم
                        </button>
                        <div class="security-search">
                            <input type="text" id="security-search-users" placeholder="البحث عن مستخدم...">
                            <i class="fas fa-search"></i>
                        </div>
                    </div>
                    <div class="security-users-table-container">
                        <table class="security-users-table">
                            <thead>
                                <tr>
                                    <th>اسم المستخدم</th>
                                    <th>الاسم الظاهر</th>
                                    <th>الدور</th>
                                    <th>الحالة</th>
                                    <th>آخر تسجيل دخول</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody id="security-users-table-body">
                                <!-- سيتم ملؤها ديناميكياً -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        // إضافة واجهة إدارة المستخدمين إلى الصفحة
        document.body.appendChild(userManagement);
        
        // إضافة نموذج إضافة/تعديل المستخدم
        createUserFormUI();
        
        // إضافة مستمعي الأحداث
        setupUserManagementEvents();
    }
    
    /**
     * إنشاء نموذج إضافة/تعديل مستخدم
     */
    function createUserFormUI() {
        const userForm = document.createElement('div');
        userForm.id = 'security-user-form-modal';
        userForm.className = 'security-modal';
        
        userForm.innerHTML = `
            <div class="security-modal-content">
                <div class="security-modal-header">
                    <h3 id="security-user-form-title">إضافة مستخدم جديد</h3>
                    <button type="button" class="security-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="security-modal-body">
                    <form id="security-user-form">
                        <input type="hidden" id="security-user-id">
                        <div class="security-form-row">
                            <div class="security-form-group">
                                <label for="security-user-username">اسم المستخدم</label>
                                <input type="text" id="security-user-username" required>
                            </div>
                            <div class="security-form-group">
                                <label for="security-user-display-name">الاسم الظاهر</label>
                                <input type="text" id="security-user-display-name" required>
                            </div>
                        </div>
                        <div class="security-form-row">
                            <div class="security-form-group">
                                <label for="security-user-password">كلمة المرور</label>
                                <div class="security-input-container">
                                    <input type="password" id="security-user-password">
                                    <button type="button" class="security-toggle-password" tabindex="-1">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>
                                <small class="security-form-hint" id="security-password-hint">اترك هذا الحقل فارغاً للإبقاء على كلمة المرور الحالية</small>
                            </div>
                            <div class="security-form-group">
                                <label for="security-user-role">الدور</label>
                                <select id="security-user-role" required>
                                    <option value="admin">مدير النظام</option>
                                    <option value="manager">مدير</option>
                                    <option value="user">مستخدم</option>
                                    <option value="guest">ضيف</option>
                                </select>
                            </div>
                        </div>
                        <div class="security-form-row">
                            <div class="security-form-group">
                                <label class="security-checkbox-label">
                                    <input type="checkbox" id="security-user-active" checked>
                                    <span>حساب نشط</span>
                                </label>
                            </div>
                            <div class="security-form-group">
                                <label class="security-checkbox-label">
                                    <input type="checkbox" id="security-user-reset-password">
                                    <span>إجبار المستخدم على تغيير كلمة المرور</span>
                                </label>
                            </div>
                        </div>
                        <div id="security-user-form-error" class="security-error-message"></div>
                        <div class="security-form-actions">
                            <button type="button" class="security-btn security-btn-cancel" id="security-user-form-cancel">إلغاء</button>
                            <button type="submit" class="security-btn security-btn-primary" id="security-user-form-submit">حفظ</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // إضافة نموذج المستخدم إلى الصفحة
        document.body.appendChild(userForm);
        
        // إضافة مستمعي الأحداث
        setupUserFormEvents();
    }
    
    /**
     * إضافة مستمعي الأحداث لنموذج المستخدم
     */
    function setupUserFormEvents() {
        // مستمع حدث تقديم نموذج المستخدم
        const userForm = document.getElementById('security-user-form');
        if (userForm) {
            userForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // جمع بيانات النموذج
                const userData = {
                    id: document.getElementById('security-user-id').value,
                    username: document.getElementById('security-user-username').value,
                    displayName: document.getElementById('security-user-display-name').value,
                    password: document.getElementById('security-user-password').value,
                    role: document.getElementById('security-user-role').value,
                    isActive: document.getElementById('security-user-active').checked,
                    passwordChanged: !document.getElementById('security-user-reset-password').checked
                };
                
                // إخفاء رسالة الخطأ السابقة
                document.getElementById('security-user-form-error').textContent = '';
                
                try {
                    // التحقق من وجود المعرف (في حالة التعديل)
                    if (userData.id) {
                        // تعديل مستخدم موجود
                        updateUser(userData);
                    } else {
                        // إضافة مستخدم جديد
                        addUser(userData);
                    }
                    
                    // إغلاق النموذج
                    hideUserFormModal();
                    
                    // تحديث جدول المستخدمين
                    populateUsersTable();
                } catch (error) {
                    // عرض رسالة الخطأ
                    document.getElementById('security-user-form-error').textContent = error.message;
                }
            });
        }
        
        // مستمع حدث زر الإلغاء
        const cancelBtn = document.getElementById('security-user-form-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', hideUserFormModal);
        }
        
        // مستمع حدث زر إغلاق النموذج
        const closeBtn = document.querySelector('#security-user-form-modal .security-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideUserFormModal);
        }
        
        // مستمع حدث زر إظهار/إخفاء كلمة المرور
        const togglePasswordBtn = document.querySelector('#security-user-form-modal .security-toggle-password');
        if (togglePasswordBtn) {
            togglePasswordBtn.addEventListener('click', function() {
                const passwordField = document.getElementById('security-user-password');
                const icon = this.querySelector('i');
                
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordField.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        }
    }
    
    /**
     * إضافة مستمعي الأحداث لواجهة إدارة المستخدمين
     */
    function setupUserManagementEvents() {
        // مستمع حدث زر إغلاق النافذة
        const closeBtn = document.querySelector('#security-user-management .security-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideUserManagementModal);
        }
        
        // مستمع حدث زر إضافة مستخدم
        const addUserBtn = document.getElementById('security-add-user-btn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', function() {
                // عرض نموذج إضافة مستخدم جديد
                showUserFormModal();
            });
        }
        
        // مستمع حدث البحث عن مستخدمين
        const searchInput = document.getElementById('security-search-users');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.trim().toLowerCase();
                
                // الحصول على جميع صفوف الجدول
                const rows = document.querySelectorAll('#security-users-table-body tr');
                
                // البحث في الصفوف
                rows.forEach(row => {
                    const username = row.querySelector('td:nth-child(1)').textContent.toLowerCase();
                    const displayName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                    
                    // إظهار/إخفاء الصف بناءً على نتيجة البحث
                    if (username.includes(searchTerm) || displayName.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }
    }
    
    /**
     * إضافة أيقونات الأمان إلى شريط الأدوات
     */
    function addSecurityToolbarIcons() {
        // البحث عن شريط الأدوات
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) {
            console.error('لم يتم العثور على شريط الأدوات');
            return;
        }
        
        // إنشاء أيقونة الأمان
        const securityButton = document.createElement('button');
        securityButton.id = 'security-toolbar-button';
        securityButton.className = 'btn btn-outline';
        securityButton.title = 'إدارة الأمان';
        securityButton.innerHTML = '<i class="fas fa-shield-alt"></i>';
        
        // إضافة الأيقونة إلى شريط الأدوات (في بداية الشريط)
        if (headerActions.firstChild) {
            headerActions.insertBefore(securityButton, headerActions.firstChild);
        } else {
            headerActions.appendChild(securityButton);
        }
        
        // إضافة مستمع حدث النقر
        securityButton.addEventListener('click', function() {
            // عرض قائمة الأمان
            showSecurityMenu(this);
        });
    }
    
    /**
     * عرض قائمة الأمان
     * @param {HTMLElement} buttonElement عنصر الزر
     */
    function showSecurityMenu(buttonElement) {
        // إغلاق أي قائمة مفتوحة
        const existingMenu = document.getElementById('security-menu');
        if (existingMenu) {
            existingMenu.remove();
            return;
        }
        
        // الحصول على موقع الزر
        const buttonRect = buttonElement.getBoundingClientRect();
        
        // إنشاء قائمة الأمان
        const menu = document.createElement('div');
        menu.id = 'security-menu';
        menu.className = 'security-dropdown-menu';
        
        // إعداد محتوى القائمة بناءً على دور المستخدم الحالي
        let menuContent = '';
        
        if (currentUser && currentUser.role === 'admin') {
            // قائمة كاملة لمدير النظام
            menuContent = `
                <div class="security-menu-header">
                    <div class="security-menu-user">
                        <div class="security-avatar">${currentUser.displayName.charAt(0)}</div>
                        <div class="security-user-info">
                            <div class="security-username">${currentUser.displayName}</div>
                            <div class="security-role">${roles[currentUser.role].name}</div>
                        </div>
                    </div>
                </div>
                <div class="security-menu-items">
                    <div class="security-menu-item" id="security-manage-users">
                        <i class="fas fa-users-cog"></i>
                        <span>إدارة المستخدمين</span>
                    </div>
                    <div class="security-menu-item" id="security-change-password">
                        <i class="fas fa-key"></i>
                        <span>تغيير كلمة المرور</span>
                    </div>
                    <div class="security-menu-item" id="security-security-settings">
                        <i class="fas fa-cogs"></i>
                        <span>إعدادات الأمان</span>
                    </div>
                    <div class="security-divider"></div>
                    <div class="security-menu-item" id="security-show-audit-log">
                        <i class="fas fa-history"></i>
                        <span>سجل الأحداث</span>
                    </div>
                    <div class="security-divider"></div>
                    <div class="security-menu-item" id="security-logout">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>تسجيل الخروج</span>
                    </div>
                </div>
            `;
        } else {
            // قائمة مبسطة للمستخدمين العاديين
            menuContent = `
                <div class="security-menu-header">
                    <div class="security-menu-user">
                        <div class="security-avatar">${currentUser ? currentUser.displayName.charAt(0) : 'G'}</div>
                        <div class="security-user-info">
                            <div class="security-username">${currentUser ? currentUser.displayName : 'ضيف'}</div>
                            <div class="security-role">${currentUser ? roles[currentUser.role].name : 'غير مسجل'}</div>
                        </div>
                    </div>
                </div>
                <div class="security-menu-items">
                    <div class="security-menu-item" id="security-change-password">
                        <i class="fas fa-key"></i>
                        <span>تغيير كلمة المرور</span>
                    </div>
                    <div class="security-divider"></div>
                    <div class="security-menu-item" id="security-logout">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>تسجيل الخروج</span>
                    </div>
                </div>
            `;
        }
        
        // تعيين محتوى القائمة
        menu.innerHTML = menuContent;
        
        // تحديد موقع القائمة
        menu.style.position = 'absolute';
        menu.style.top = `${buttonRect.bottom + 10}px`;
        menu.style.left = `${buttonRect.left}px`;
        menu.style.zIndex = '1000';
        
        // إضافة القائمة إلى الصفحة
        document.body.appendChild(menu);
        
        // إضافة مستمعي الأحداث للقائمة
        setupSecurityMenuEvents(menu);
        
        // إغلاق القائمة عند النقر في أي مكان آخر
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && e.target !== buttonElement) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }
    
    /**
     * إضافة مستمعي الأحداث لقائمة الأمان
     * @param {HTMLElement} menu عنصر القائمة
     */
    function setupSecurityMenuEvents(menu) {
        // مستمع حدث إدارة المستخدمين
        const manageUsersItem = menu.querySelector('#security-manage-users');
        if (manageUsersItem) {
            manageUsersItem.addEventListener('click', function() {
                // إغلاق القائمة
                menu.remove();
                
                // عرض واجهة إدارة المستخدمين
                showUserManagementModal();
            });
        }
        
        // مستمع حدث تغيير كلمة المرور
        const changePasswordItem = menu.querySelector('#security-change-password');
        if (changePasswordItem) {
            changePasswordItem.addEventListener('click', function() {
                // إغلاق القائمة
                menu.remove();
                
                // عرض واجهة تغيير كلمة المرور
                showChangePasswordModal();
            });
        }
        
        // مستمع حدث إعدادات الأمان
        const securitySettingsItem = menu.querySelector('#security-security-settings');
        if (securitySettingsItem) {
            securitySettingsItem.addEventListener('click', function() {
                // إغلاق القائمة
                menu.remove();
                
                // عرض واجهة إعدادات الأمان
                showSecuritySettingsModal();
            });
        }
        
        // مستمع حدث سجل الأحداث
        const auditLogItem = menu.querySelector('#security-show-audit-log');
        if (auditLogItem) {
            auditLogItem.addEventListener('click', function() {
                // إغلاق القائمة
                menu.remove();
                
                // عرض واجهة سجل الأحداث
                showAuditLogModal();
            });
        }
        
        // مستمع حدث تسجيل الخروج
        const logoutItem = menu.querySelector('#security-logout');
        if (logoutItem) {
            logoutItem.addEventListener('click', function() {
                // إغلاق القائمة
                menu.remove();
                
                // تسجيل الخروج
                logout();
            });
        }
    }
    
    /**
     * إضافة مستمعي الأحداث للصفحات المحمية
     */
    function setupProtectedPages() {
        // قائمة الصفحات المحمية والصلاحيات المطلوبة
        const protectedPages = {
            'investors': 'view_investors',
            'transactions': 'view_transactions',
            'profits': 'view_profits',
            'reports': 'view_reports',
            'settings': 'all'
        };
        
        // مستمع حدث النقر على روابط التنقل
        document.addEventListener('click', function(e) {
            const navLink = e.target.closest('.nav-link');
            if (!navLink) return;
            
            const pageId = navLink.getAttribute('data-page');
            if (!pageId) return;
            
            // التحقق مما إذا كانت الصفحة محمية
            if (protectedPages[pageId]) {
                // التحقق من حالة المصادقة
                if (!isAuthenticated) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // عرض شاشة تسجيل الدخول
                    showLoginScreen();
                    
                    // عرض إشعار
                    showNotification('يرجى تسجيل الدخول للوصول إلى هذه الصفحة', 'error');
                    
                    return;
                }
                
                // التحقق من الصلاحيات
                const requiredPermission = protectedPages[pageId];
                if (!hasPermission(requiredPermission)) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // عرض إشعار
                    showNotification('لا تملك الصلاحيات الكافية للوصول إلى هذه الصفحة', 'error');
                    
                    return;
                }
            }
        });
    }
    
    /**
     * إظهار شاشة تسجيل الدخول
     */
    function showLoginScreen() {
        const loginScreen = document.getElementById('security-login-screen');
        if (!loginScreen) return;
        
        // إظهار الشاشة
        loginScreen.classList.add('active');
        
        // تركيز حقل اسم المستخدم
        setTimeout(() => {
            const usernameField = document.getElementById('security-username');
            if (usernameField) {
                usernameField.focus();
            }
        }, 100);
        
        // إخفاء رسالة الخطأ
        const errorMessage = document.getElementById('security-login-error');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    }
    
    /**
     * إخفاء شاشة تسجيل الدخول
     */
    function hideLoginScreen() {
        const loginScreen = document.getElementById('security-login-screen');
        if (!loginScreen) return;
        
        // إخفاء الشاشة
        loginScreen.classList.remove('active');
        
        // مسح حقول النموذج
        const form = document.getElementById('security-login-form');
        if (form) {
            form.reset();
        }
    }
    
    /**
     * إظهار واجهة إدارة المستخدمين
     */
    function showUserManagementModal() {
        const modal = document.getElementById('security-user-management');
        if (!modal) return;
        
        // تحميل بيانات المستخدمين
        populateUsersTable();
        
        // إظهار النافذة
        modal.classList.add('active');
    }
    
    /**
     * إخفاء واجهة إدارة المستخدمين
     */
    function hideUserManagementModal() {
        const modal = document.getElementById('security-user-management');
        if (!modal) return;
        
        // إخفاء النافذة
        modal.classList.remove('active');
    }
    
    /**
     * إظهار نموذج إضافة/تعديل مستخدم
     * @param {string} userId معرف المستخدم (للتعديل)
     */
    function showUserFormModal(userId = null) {
        const modal = document.getElementById('security-user-form-modal');
        if (!modal) return;
        
        // تهيئة النموذج
        document.getElementById('security-user-form-title').textContent = userId ? 'تعديل مستخدم' : 'إضافة مستخدم جديد';
        document.getElementById('security-user-form').reset();
        document.getElementById('security-user-id').value = '';
        document.getElementById('security-user-form-error').textContent = '';
        
        // إظهار/إخفاء تلميح كلمة المرور
        const passwordHint = document.getElementById('security-password-hint');
        if (passwordHint) {
            passwordHint.style.display = userId ? 'block' : 'none';
        }
        
        // تعبئة بيانات المستخدم للتعديل
        if (userId) {
            const user = getUserById(userId);
            if (user) {
                document.getElementById('security-user-id').value = user.id;
                document.getElementById('security-user-username').value = user.username;
                document.getElementById('security-user-display-name').value = user.displayName;
                document.getElementById('security-user-role').value = user.role;
                document.getElementById('security-user-active').checked = user.isActive;
                document.getElementById('security-user-reset-password').checked = !user.passwordChanged;
            }
        }
        
        // إظهار النافذة
        modal.classList.add('active');
        
        // تركيز الحقل الأول
        setTimeout(() => {
            const firstField = document.getElementById('security-user-username');
            if (firstField) {
                firstField.focus();
            }
        }, 100);
    }
    
    /**
     * إخفاء نموذج إضافة/تعديل مستخدم
     */
    function hideUserFormModal() {
        const modal = document.getElementById('security-user-form-modal');
        if (!modal) return;
        
        // إخفاء النافذة
        modal.classList.remove('active');
    }
    
    /**
     * عرض نافذة تغيير كلمة المرور
     */
    function showChangePasswordModal() {
        // التحقق من وجود النافذة
        if (!document.getElementById('security-change-password-modal')) {
            createChangePasswordUI();
        }
        
        const modal = document.getElementById('security-change-password-modal');
        if (!modal) return;
        
        // إعادة تعيين النموذج
        const form = document.getElementById('security-change-password-form');
        if (form) {
            form.reset();
        }
        
        // إخفاء رسالة الخطأ
        const errorMessage = document.getElementById('security-change-password-error');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
        
        // إظهار النافذة
        modal.classList.add('active');
        
        // تركيز الحقل الأول
        setTimeout(() => {
            const firstField = document.getElementById('security-current-password');
            if (firstField) {
                firstField.focus();
            }
        }, 100);
    }
    
    /**
     * إنشاء واجهة تغيير كلمة المرور
     */
    function createChangePasswordUI() {
        const modal = document.createElement('div');
        modal.id = 'security-change-password-modal';
        modal.className = 'security-modal';
        
        modal.innerHTML = `
            <div class="security-modal-content">
                <div class="security-modal-header">
                    <h3>تغيير كلمة المرور</h3>
                    <button type="button" class="security-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="security-modal-body">
                    <form id="security-change-password-form">
                        <div class="security-form-group">
                            <label for="security-current-password">كلمة المرور الحالية</label>
                            <div class="security-input-container">
                                <input type="password" id="security-current-password" required>
                                <button type="button" class="security-toggle-password" tabindex="-1">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="security-form-group">
                            <label for="security-new-password">كلمة المرور الجديدة</label>
                            <div class="security-input-container">
                                <input type="password" id="security-new-password" required>
                                <button type="button" class="security-toggle-password" tabindex="-1">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="security-form-group">
                            <label for="security-confirm-password">تأكيد كلمة المرور الجديدة</label>
                            <div class="security-input-container">
                                <input type="password" id="security-confirm-password" required>
                                <button type="button" class="security-toggle-password" tabindex="-1">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="security-password-strength">
                            <div class="security-strength-meter">
                                <div class="security-strength-fill" id="security-password-strength-meter"></div>
                            </div>
                            <div class="security-strength-text" id="security-password-strength-text">قوة كلمة المرور</div>
                        </div>
                        <div id="security-change-password-error" class="security-error-message"></div>
                        <div class="security-form-actions">
                            <button type="button" class="security-btn security-btn-cancel" id="security-change-password-cancel">إلغاء</button>
                            <button type="submit" class="security-btn security-btn-primary">تغيير كلمة المرور</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // إضافة النافذة إلى الصفحة
        document.body.appendChild(modal);
        
        // إضافة مستمعي الأحداث
        setupChangePasswordEvents();
    }
    
    /**
     * إضافة مستمعي الأحداث لنافذة تغيير كلمة المرور
     */
    function setupChangePasswordEvents() {
        // مستمع حدث تقديم النموذج
        const form = document.getElementById('security-change-password-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // جمع بيانات النموذج
                const currentPassword = document.getElementById('security-current-password').value;
                const newPassword = document.getElementById('security-new-password').value;
                const confirmPassword = document.getElementById('security-confirm-password').value;
                
                // إخفاء رسالة الخطأ السابقة
                document.getElementById('security-change-password-error').textContent = '';
                
                // التحقق من تطابق كلمة المرور الجديدة
                if (newPassword !== confirmPassword) {
                    document.getElementById('security-change-password-error').textContent = 'كلمة المرور الجديدة وتأكيدها غير متطابقين';
                    return;
                }
                
                // التحقق من قوة كلمة المرور
                if (getPasswordStrength(newPassword) < 2) {
                    document.getElementById('security-change-password-error').textContent = 'كلمة المرور ضعيفة جداً، يرجى اختيار كلمة مرور أقوى';
                    return;
                }
                
                try {
                    // تغيير كلمة المرور
                    changePassword(currentPassword, newPassword);
                    
                    // إغلاق النافذة
                    hideChangePasswordModal();
                    
                    // عرض إشعار النجاح
                    showNotification('تم تغيير كلمة المرور بنجاح', 'success');
                } catch (error) {
                    // عرض رسالة الخطأ
                    document.getElementById('security-change-password-error').textContent = error.message;
                }
            });
        }
        
        // مستمع حدث زر الإلغاء
        const cancelBtn = document.getElementById('security-change-password-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', hideChangePasswordModal);
        }
        
        // مستمع حدث زر الإغلاق
        const closeBtn = document.querySelector('#security-change-password-modal .security-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideChangePasswordModal);
        }
        
        // مستمعي أحداث أزرار إظهار/إخفاء كلمة المرور
        const toggleButtons = document.querySelectorAll('#security-change-password-modal .security-toggle-password');
        toggleButtons.forEach(button => {
            button.addEventListener('click', function() {
                const passwordField = this.parentElement.querySelector('input');
                const icon = this.querySelector('i');
                
                if (passwordField.type === 'password') {
                    passwordField.type = 'text';
                    icon.classList.remove('fa-eye');
                    icon.classList.add('fa-eye-slash');
                } else {
                    passwordField.type = 'password';
                    icon.classList.remove('fa-eye-slash');
                    icon.classList.add('fa-eye');
                }
            });
        });
        
        // مستمع حدث لقياس قوة كلمة المرور
        const newPasswordField = document.getElementById('security-new-password');
        if (newPasswordField) {
            newPasswordField.addEventListener('input', function() {
                const password = this.value;
                const strength = getPasswordStrength(password);
                
                // تحديث مؤشر قوة كلمة المرور
                updatePasswordStrengthMeter(strength);
            });
        }
    }
    
    /**
     * إخفاء نافذة تغيير كلمة المرور
     */
    function hideChangePasswordModal() {
        const modal = document.getElementById('security-change-password-modal');
        if (!modal) return;
        
        // إخفاء النافذة
        modal.classList.remove('active');
    }
    
    /**
     * قياس قوة كلمة المرور
     * @param {string} password كلمة المرور
     * @returns {number} درجة قوة كلمة المرور (0-4)
     */
    function getPasswordStrength(password) {
        if (!password) return 0;
        
        let strength = 0;
        
        // طول كلمة المرور
        if (password.length >= 8) {
            strength += 1;
        }
        
        // وجود أحرف صغيرة
        if (/[a-z]/.test(password)) {
            strength += 1;
        }
        
        // وجود أحرف كبيرة
        if (/[A-Z]/.test(password)) {
            strength += 1;
        }
        
        // وجود أرقام
        if (/[0-9]/.test(password)) {
            strength += 1;
        }
        
        // وجود رموز خاصة
        if (/[^a-zA-Z0-9]/.test(password)) {
            strength += 1;
        }
        
        return Math.min(strength, 4);
    }
    
    /**
     * تحديث مؤشر قوة كلمة المرور
     * @param {number} strength درجة قوة كلمة المرور (0-4)
     */
    function updatePasswordStrengthMeter(strength) {
        const meter = document.getElementById('security-password-strength-meter');
        const text = document.getElementById('security-password-strength-text');
        
        if (!meter || !text) return;
        
        // تحديد النسبة المئوية للقوة
        const percentage = (strength / 4) * 100;
        
        // تحديث عرض المؤشر
        meter.style.width = `${percentage}%`;
        
        // تحديد لون المؤشر ونص القوة
        let color, strengthText;
        
        switch (strength) {
            case 0:
                color = '#e74c3c';
                strengthText = 'ضعيفة جداً';
                break;
            case 1:
                color = '#e67e22';
                strengthText = 'ضعيفة';
                break;
            case 2:
                color = '#f1c40f';
                strengthText = 'متوسطة';
                break;
            case 3:
                color = '#2ecc71';
                strengthText = 'قوية';
                break;
            case 4:
                color = '#27ae60';
                strengthText = 'قوية جداً';
                break;
        }
        
        meter.style.backgroundColor = color;
        text.textContent = `قوة كلمة المرور: ${strengthText}`;
        text.style.color = color;
    }
    
    /**
     * عرض واجهة إعدادات الأمان
     */
    function showSecuritySettingsModal() {
        // التحقق من وجود النافذة
        if (!document.getElementById('security-settings-modal')) {
            createSecuritySettingsUI();
        }
        
        const modal = document.getElementById('security-settings-modal');
        if (!modal) return;
        
        // تحميل الإعدادات الحالية
        loadSecuritySettings();
        
        // إظهار النافذة
        modal.classList.add('active');
    }
    
    /**
     * إنشاء واجهة إعدادات الأمان
     */
    function createSecuritySettingsUI() {
        const modal = document.createElement('div');
        modal.id = 'security-settings-modal';
        modal.className = 'security-modal';
        
        modal.innerHTML = `
            <div class="security-modal-content">
                <div class="security-modal-header">
                    <h3>إعدادات الأمان</h3>
                    <button type="button" class="security-modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="security-modal-body">
                    <form id="security-settings-form">
                        <div class="security-form-group">
                            <label for="security-session-timeout">مدة الجلسة (بالدقائق)</label>
                            <input type="number" id="security-session-timeout" min="5" max="1440" required>
                            <small class="security-form-hint">بعد انتهاء هذه المدة من عدم النشاط، سيتم تسجيل الخروج تلقائياً</small>
                        </div>
                        <div class="security-form-group">
                            <label class="security-checkbox-label">
                                <input type="checkbox" id="security-enforce-password-change">
                                <span>إجبار المستخدمين على تغيير كلمة المرور عند أول تسجيل دخول</span>
                            </label>
                        </div>
                        <div class="security-form-group">
                            <label class="security-checkbox-label">
                                <input type="checkbox" id="security-audit-logging">
                                <span>تفعيل تسجيل الأحداث</span>
                            </label>
                        </div>
                        <div class="security-form-group">
                            <label for="security-max-failed-attempts">الحد الأقصى لمحاولات تسجيل الدخول الفاشلة</label>
                            <input type="number" id="security-max-failed-attempts" min="1" max="10" required>
                            <small class="security-form-hint">بعد تجاوز هذا العدد، سيتم قفل حساب المستخدم</small>
                        </div>
                        <div class="security-form-actions">
                            <button type="button" class="security-btn security-btn-cancel" id="security-settings-cancel">إلغاء</button>
                            <button type="submit" class="security-btn security-btn-primary">حفظ الإعدادات</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        // إضافة النافذة إلى الصفحة
        document.body.appendChild(modal);
        
        // إضافة مستمعي الأحداث
        setupSecuritySettingsEvents();
    }
    
    /**
     * إضافة مستمعي الأحداث لواجهة إعدادات الأمان
     */
    function setupSecuritySettingsEvents() {
        // مستمع حدث تقديم النموذج
        const form = document.getElementById('security-settings-form');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // جمع بيانات النموذج
                const settings = {
                    sessionTimeout: parseInt(document.getElementById('security-session-timeout').value) * 60 * 1000,
                    enforcePasswordChange: document.getElementById('security-enforce-password-change').checked,
                    auditLogging: document.getElementById('security-audit-logging').checked,
                    maxFailedAttempts: parseInt(document.getElementById('security-max-failed-attempts').value)
                };
                
                // حفظ الإعدادات
                saveSecuritySettings(settings);
                
                // تطبيق الإعدادات
                applySecuritySettings(settings);
                
                // إغلاق النافذة
                hideSecuritySettingsModal();
                
                // عرض إشعار النجاح
                showNotification('تم حفظ إعدادات الأمان بنجاح', 'success');
            });
        }
        
        // مستمع حدث زر الإلغاء
        const cancelBtn = document.getElementById('security-settings-cancel');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', hideSecuritySettingsModal);
        }
        
        // مستمع حدث زر الإغلاق
        const closeBtn = document.querySelector('#security-settings-modal .security-modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', hideSecuritySettingsModal);
        }
    }
    
    /**
     * تحميل إعدادات الأمان الحالية
     */
    function loadSecuritySettings() {
        // الحصول على الإعدادات من التخزين المحلي
        const settings = JSON.parse(localStorage.getItem('securitySettings')) || {
            sessionTimeout: sessionTimeoutDuration,
            enforcePasswordChange: true,
            auditLogging: true,
            maxFailedAttempts: 5
        };
        
        // تعبئة النموذج بالإعدادات
        document.getElementById('security-session-timeout').value = settings.sessionTimeout / (60 * 1000);
        document.getElementById('security-enforce-password-change').checked = settings.enforcePasswordChange;
        document.getElementById('security-audit-logging').checked = settings.auditLogging;
        document.getElementById('security-max-failed-attempts').value = settings.maxFailedAttempts;
    }
    
    /**
     * حفظ إعدادات الأمان
     * @param {Object} settings إعدادات الأمان
     */
    function saveSecuritySettings(settings) {
        // حفظ الإعدادات في التخزين المحلي
        localStorage.setItem('securitySettings', JSON.stringify(settings));
    }
    
    /**
     * تطبيق إعدادات الأمان
     * @param {Object} settings إعدادات الأمان
     */
    function applySecuritySettings(settings) {
        // تطبيق مدة الجلسة
        sessionTimeoutDuration = settings.sessionTimeout;
        
        // إعادة تعيين مؤقت الجلسة
        resetSessionTimeout();
    }
    
    /**
     * إخفاء واجهة إعدادات الأمان
     */
    function hideSecuritySettingsModal() {
        const modal = document.getElementById('security-settings-modal');
        if (!modal) return;
        
        // إخفاء النافذة
        modal.classList.remove('active');
    }
    
    /**
     * عرض واجهة سجل الأحداث
     */
    function showAuditLogModal() {
        // التحقق من وجود النافذة
        if (!document.getElementById('security-audit-log-modal')) {
            createAuditLogUI();
        }
        
        const modal = document.getElementById('security-audit-log-modal');
        if (!modal) return;
        
        // تحميل سجل الأحداث
        loadAuditLog();
        
        // إظهار النافذة
        modal.classList.add('active');
    }
    
    /**
     * إنشاء واجهة سجل الأحداث
     */
    function createAuditLogUI() {
    const modal = document.createElement('div');
    modal.id = 'security-audit-log-modal';
    modal.className = 'security-modal';
    
    modal.innerHTML = `
        <div class="security-modal-content security-modal-lg">
            <div class="security-modal-header">
                <h3>سجل الأحداث</h3>
                <button type="button" class="security-modal-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="security-modal-body">
                <div class="security-audit-log-filters">
                    <div class="security-form-row">
                        <div class="security-form-group">
                            <label for="security-audit-filter-user">المستخدم</label>
                            <select id="security-audit-filter-user">
                                <option value="">الكل</option>
                            </select>
                        </div>
                        <div class="security-form-group">
                            <label for="security-audit-filter-action">الحدث</label>
                            <select id="security-audit-filter-action">
                                <option value="">الكل</option>
                                <option value="login">تسجيل دخول</option>
                                <option value="logout">تسجيل خروج</option>
                                <option value="failed_login">محاولة تسجيل دخول فاشلة</option>
                                <option value="password_change">تغيير كلمة المرور</option>
                                <option value="user_add">إضافة مستخدم</option>
                                <option value="user_edit">تعديل مستخدم</option>
                                <option value="user_delete">حذف مستخدم</option>
                                <option value="settings_change">تغيير الإعدادات</option>
                            </select>
                        </div>
                        <div class="security-form-group">
                            <label for="security-audit-filter-date">التاريخ</label>
                            <input type="date" id="security-audit-filter-date">
                        </div>
                        <div class="security-form-group">
                            <button type="button" class="security-btn" id="security-audit-filter-clear">
                                <i class="fas fa-times"></i> مسح التصفية
                            </button>
                        </div>
                    </div>
                </div>
                <div class="security-audit-log-table-container">
                    <table class="security-audit-log-table">
                        <thead>
                            <tr>
                                <th>التاريخ والوقت</th>
                                <th>المستخدم</th>
                                <th>الحدث</th>
                                <th>التفاصيل</th>
                                <th>عنوان IP</th>
                            </tr>
                        </thead>
                        <tbody id="security-audit-log-table-body">
                            <!-- سيتم ملؤها ديناميكياً -->
                        </tbody>
                    </table>
                </div>
                <div class="security-audit-log-actions">
                    <button type="button" class="security-btn" id="security-audit-log-export">
                        <i class="fas fa-file-export"></i> تصدير السجل
                    </button>
                    <button type="button" class="security-btn security-btn-danger" id="security-audit-log-clear">
                        <i class="fas fa-trash"></i> مسح السجل
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // إضافة النافذة إلى الصفحة
    document.body.appendChild(modal);
    
    // إضافة مستمعي الأحداث
    setupAuditLogEvents();
}

/**
 * إضافة مستمعي الأحداث لواجهة سجل الأحداث
 */
function setupAuditLogEvents() {
    // مستمع حدث زر الإغلاق
    const closeBtn = document.querySelector('#security-audit-log-modal .security-modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', hideAuditLogModal);
    }
    
    // مستمع حدث مسح التصفية
    const clearFilterBtn = document.getElementById('security-audit-filter-clear');
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', function() {
            // إعادة تعيين حقول التصفية
            document.getElementById('security-audit-filter-user').value = '';
            document.getElementById('security-audit-filter-action').value = '';
            document.getElementById('security-audit-filter-date').value = '';
            
            // إعادة تحميل السجل
            loadAuditLog();
        });
    }
    
    // مستمع حدث تصفية المستخدم
    const userFilterSelect = document.getElementById('security-audit-filter-user');
    if (userFilterSelect) {
        userFilterSelect.addEventListener('change', filterAuditLog);
    }
    
    // مستمع حدث تصفية الحدث
    const actionFilterSelect = document.getElementById('security-audit-filter-action');
    if (actionFilterSelect) {
        actionFilterSelect.addEventListener('change', filterAuditLog);
    }
    
    // مستمع حدث تصفية التاريخ
    const dateFilterInput = document.getElementById('security-audit-filter-date');
    if (dateFilterInput) {
        dateFilterInput.addEventListener('change', filterAuditLog);
    }
    
    // مستمع حدث تصدير السجل
    const exportBtn = document.getElementById('security-audit-log-export');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportAuditLog);
    }
    
    // مستمع حدث مسح السجل
    const clearLogBtn = document.getElementById('security-audit-log-clear');
    if (clearLogBtn) {
        clearLogBtn.addEventListener('click', function() {
            // طلب تأكيد المسح
            if (confirm('هل أنت متأكد من رغبتك في مسح سجل الأحداث بالكامل؟ لا يمكن التراجع عن هذا الإجراء.')) {
                clearAuditLog();
            }
        });
    }
}

/**
 * تحميل سجل الأحداث
 */
function loadAuditLog() {
    // الحصول على سجل الأحداث من التخزين المحلي
    const auditLog = JSON.parse(localStorage.getItem('securityAuditLog')) || [];
    
    // تحميل قائمة المستخدمين في قائمة التصفية
    populateUserFilterSelect(auditLog);
    
    // عرض السجل في الجدول
    displayAuditLog(auditLog);
}

/**
 * تعبئة قائمة تصفية المستخدمين
 * @param {Array} auditLog سجل الأحداث
 */
function populateUserFilterSelect(auditLog) {
    const userSelect = document.getElementById('security-audit-filter-user');
    if (!userSelect) return;
    
    // حفظ القيمة المحددة حالياً
    const selectedValue = userSelect.value;
    
    // مسح القائمة باستثناء الخيار الأول
    while (userSelect.options.length > 1) {
        userSelect.remove(1);
    }
    
    // استخراج قائمة فريدة من المستخدمين
    const uniqueUsers = [...new Set(auditLog.map(log => log.username))].sort();
    
    // إضافة المستخدمين إلى القائمة
    uniqueUsers.forEach(username => {
        const option = document.createElement('option');
        option.value = username;
        option.textContent = username;
        userSelect.appendChild(option);
    });
    
    // استعادة القيمة المحددة
    if (selectedValue && userSelect.querySelector(`option[value="${selectedValue}"]`)) {
        userSelect.value = selectedValue;
    }
}

/**
 * عرض سجل الأحداث
 * @param {Array} auditLog سجل الأحداث
 */
function displayAuditLog(auditLog) {
    const tableBody = document.getElementById('security-audit-log-table-body');
    if (!tableBody) return;
    
    // مسح الجدول
    tableBody.innerHTML = '';
    
    // التحقق من وجود سجلات
    if (auditLog.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 5;
        emptyCell.textContent = 'لا توجد أحداث مسجلة';
        emptyCell.className = 'security-text-center';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
        return;
    }
    
    // ترتيب السجلات حسب التاريخ (الأحدث أولاً)
    const sortedLog = [...auditLog].sort((a, b) => b.timestamp - a.timestamp);
    
    // إنشاء صفوف الجدول
    sortedLog.forEach(log => {
        const row = document.createElement('tr');
        
        // تحديد فئة الصف حسب نوع الحدث
        if (log.action === 'failed_login') {
            row.className = 'security-log-warning';
        } else if (log.action === 'user_delete') {
            row.className = 'security-log-danger';
        }
        
        // تنسيق التاريخ والوقت
        const date = new Date(log.timestamp);
        const formattedDate = `${date.toLocaleDateString('ar-SA')} ${date.toLocaleTimeString('ar-SA')}`;
        
        // تنسيق عنوان IP
        const ipAddress = log.ipAddress || '-';
        
        // تنسيق نوع الحدث
        let actionText = log.action;
        switch (log.action) {
            case 'login': actionText = 'تسجيل دخول'; break;
            case 'logout': actionText = 'تسجيل خروج'; break;
            case 'failed_login': actionText = 'محاولة تسجيل دخول فاشلة'; break;
            case 'password_change': actionText = 'تغيير كلمة المرور'; break;
            case 'user_add': actionText = 'إضافة مستخدم'; break;
            case 'user_edit': actionText = 'تعديل مستخدم'; break;
            case 'user_delete': actionText = 'حذف مستخدم'; break;
            case 'settings_change': actionText = 'تغيير الإعدادات'; break;
        }
        
        // إنشاء خلايا الصف
        row.innerHTML = `
            <td>${formattedDate}</td>
            <td>${log.username}</td>
            <td>${actionText}</td>
            <td>${log.details || '-'}</td>
            <td>${ipAddress}</td>
        `;
        
        tableBody.appendChild(row);
    });
}

/**
 * تصفية سجل الأحداث
 */
function filterAuditLog() {
    // الحصول على قيم التصفية
    const userFilter = document.getElementById('security-audit-filter-user').value;
    const actionFilter = document.getElementById('security-audit-filter-action').value;
    const dateFilter = document.getElementById('security-audit-filter-date').value;
    
    // الحصول على سجل الأحداث الأصلي
    const auditLog = JSON.parse(localStorage.getItem('securityAuditLog')) || [];
    
    // تطبيق التصفية
    const filteredLog = auditLog.filter(log => {
        // تصفية المستخدم
        if (userFilter && log.username !== userFilter) {
            return false;
        }
        
        // تصفية الحدث
        if (actionFilter && log.action !== actionFilter) {
            return false;
        }
        
        // تصفية التاريخ
        if (dateFilter) {
            const logDate = new Date(log.timestamp).toISOString().split('T')[0];
            if (logDate !== dateFilter) {
                return false;
            }
        }
        
        return true;
    });
    
    // عرض السجل المصفى
    displayAuditLog(filteredLog);
}

/**
 * تصدير سجل الأحداث
 */
function exportAuditLog() {
    // الحصول على سجل الأحداث الحالي (بعد التصفية)
    const tableRows = document.querySelectorAll('#security-audit-log-table-body tr');
    
    // التحقق من وجود سجلات
    if (tableRows.length === 0 || (tableRows.length === 1 && tableRows[0].querySelector('td').colSpan === 5)) {
        showNotification('لا توجد بيانات للتصدير', 'warning');
        return;
    }
    
    // إنشاء محتوى ملف CSV
    let csvContent = 'التاريخ والوقت,المستخدم,الحدث,التفاصيل,عنوان IP\n';
    
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        
        // تجاوز صف "لا توجد أحداث مسجلة"
        if (cells.length === 1 && cells[0].colSpan === 5) {
            return;
        }
        
        // جمع قيم الخلايا
        const rowData = Array.from(cells).map(cell => {
            // ترميز النص ليتوافق مع تنسيق CSV
            let text = cell.textContent.trim();
            if (text.includes(',') || text.includes('"') || text.includes('\n')) {
                text = `"${text.replace(/"/g, '""')}"`;
            }
            return text;
        });
        
        // إضافة الصف إلى المحتوى
        csvContent += rowData.join(',') + '\n';
    });
    
    // إنشاء ملف Blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // إنشاء رابط التنزيل
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `سجل_الأحداث_${new Date().toISOString().split('T')[0]}.csv`;
    
    // إضافة الرابط إلى الصفحة والنقر عليه
    document.body.appendChild(link);
    link.click();
    
    // تنظيف
    document.body.removeChild(link);
    
    // عرض إشعار النجاح
    showNotification('تم تصدير سجل الأحداث بنجاح', 'success');
}

/**
 * مسح سجل الأحداث
 */
function clearAuditLog() {
    // مسح السجل من التخزين المحلي
    localStorage.removeItem('securityAuditLog');
    
    // إعادة تحميل السجل
    loadAuditLog();
    
    // عرض إشعار النجاح
    showNotification('تم مسح سجل الأحداث بنجاح', 'success');
    
    // تسجيل حدث المسح نفسه
    logAuditEvent('clear_log', currentUser.username, 'تم مسح سجل الأحداث');
}

/**
 * إخفاء واجهة سجل الأحداث
 */
function hideAuditLogModal() {
    const modal = document.getElementById('security-audit-log-modal');
    if (!modal) return;
    
    // إخفاء النافذة
    modal.classList.remove('active');
}

/**
 * تسجيل الدخول
 * @param {string} username اسم المستخدم
 * @param {string} password كلمة المرور
 * @param {boolean} rememberMe تذكر المستخدم
 * @returns {Promise} وعد بإتمام عملية تسجيل الدخول
 */
function login(username, password, rememberMe = false) {
    return new Promise((resolve, reject) => {
        // التحقق من وجود اسم المستخدم وكلمة المرور
        if (!username || !password) {
            reject(new Error('يرجى إدخال اسم المستخدم وكلمة المرور'));
            return;
        }
        
        // الحصول على قائمة المستخدمين
        const users = JSON.parse(localStorage.getItem('securityUsers')) || [];
        
        // البحث عن المستخدم
        const user = users.find(u => u.username === username);
        
        // التحقق من وجود المستخدم
        if (!user) {
            // تسجيل محاولة تسجيل دخول فاشلة
            logAuditEvent('failed_login', username, 'المستخدم غير موجود');
            
            reject(new Error('اسم المستخدم أو كلمة المرور غير صحيحة'));
            return;
        }
        
        // التحقق من حالة المستخدم
        if (!user.isActive) {
            // تسجيل محاولة تسجيل دخول فاشلة
            logAuditEvent('failed_login', username, 'الحساب معطل');
            
            reject(new Error('هذا الحساب معطل، يرجى التواصل مع مدير النظام'));
            return;
        }
        
        // التحقق من قفل الحساب
        if (user.isLocked) {
            // تسجيل محاولة تسجيل دخول فاشلة
            logAuditEvent('failed_login', username, 'الحساب مقفل');
            
            reject(new Error('تم قفل هذا الحساب بسبب محاولات متكررة لتسجيل الدخول، يرجى التواصل مع مدير النظام'));
            return;
        }
        
        // التحقق من كلمة المرور
        const hashedPassword = md5(password);
        if (user.password !== hashedPassword) {
            // زيادة عدد محاولات تسجيل الدخول الفاشلة
            user.failedLogins = (user.failedLogins || 0) + 1;
            
            // التحقق من تجاوز الحد الأقصى للمحاولات
            const settings = JSON.parse(localStorage.getItem('securitySettings')) || {};
            const maxFailedAttempts = settings.maxFailedAttempts || 5;
            
            if (user.failedLogins >= maxFailedAttempts) {
                // قفل الحساب
                user.isLocked = true;
                
                // تحديث بيانات المستخدم
                updateUserInStorage(user);
                
                // تسجيل محاولة تسجيل دخول فاشلة
                logAuditEvent('failed_login', username, 'تجاوز الحد الأقصى للمحاولات، تم قفل الحساب');
                
                reject(new Error('تم قفل هذا الحساب بسبب تجاوز الحد الأقصى لمحاولات تسجيل الدخول، يرجى التواصل مع مدير النظام'));
                return;
            }
            
            // تحديث بيانات المستخدم
            updateUserInStorage(user);
            
            // تسجيل محاولة تسجيل دخول فاشلة
            logAuditEvent('failed_login', username, 'كلمة المرور غير صحيحة');
            
            reject(new Error('اسم المستخدم أو كلمة المرور غير صحيحة'));
            return;
        }
        
        // إعادة تعيين عدد محاولات تسجيل الدخول الفاشلة
        user.failedLogins = 0;
        
        // تحديث تاريخ آخر تسجيل دخول
        user.lastLogin = new Date().toISOString();
        
        // تحديث بيانات المستخدم
        updateUserInStorage(user);
        
        // تعيين المستخدم الحالي
        currentUser = { ...user };
        
        // تعيين حالة المصادقة
        isAuthenticated = true;
        
        // تسجيل حدث تسجيل الدخول
        logAuditEvent('login', username, 'تسجيل دخول ناجح');
        
        // إنشاء جلسة المستخدم
        createSession(user, rememberMe);
        
        // بدء مؤقت انتهاء الجلسة
        resetSessionTimeout();
        
        // التحقق من الحاجة لتغيير كلمة المرور
        if (!user.passwordChanged) {
            // عرض نافذة تغيير كلمة المرور
            setTimeout(() => {
                showChangePasswordModal();
                
                // عرض إشعار
                showNotification('يجب تغيير كلمة المرور عند أول تسجيل دخول', 'warning');
            }, 500);
        }
        
        resolve(user);
    });
}

/**
 * تسجيل الخروج
 */
function logout() {
    // تسجيل حدث تسجيل الخروج
    if (currentUser) {
        logAuditEvent('logout', currentUser.username, 'تسجيل خروج');
    }
    
    // إعادة تعيين المتغيرات
    currentUser = null;
    isAuthenticated = false;
    
    // مسح مؤقت انتهاء الجلسة
    clearTimeout(sessionTimeout);
    
    // مسح جلسة المستخدم
    clearSession();
    
    // عرض شاشة تسجيل الدخول
    showLoginScreen();
    
    // استدعاء دالة التبليغ عن المصادقة إذا كانت موجودة
    if (typeof authCallback === 'function') {
        authCallback(false, null);
    }
    
    // عرض إشعار النجاح
    showNotification('تم تسجيل الخروج بنجاح', 'success');
}

/**
 * تغيير كلمة المرور
 * @param {string} currentPassword كلمة المرور الحالية
 * @param {string} newPassword كلمة المرور الجديدة
 */
function changePassword(currentPassword, newPassword) {
    // التحقق من وجود مستخدم حالي
    if (!currentUser) {
        throw new Error('يجب تسجيل الدخول لتغيير كلمة المرور');
    }
    
    // التحقق من كلمة المرور الحالية
    const hashedCurrentPassword = md5(currentPassword);
    if (currentUser.password !== hashedCurrentPassword) {
        throw new Error('كلمة المرور الحالية غير صحيحة');
    }
    
    // التحقق من قوة كلمة المرور الجديدة
    if (getPasswordStrength(newPassword) < 2) {
        throw new Error('كلمة المرور الجديدة ضعيفة جداً، يرجى اختيار كلمة مرور أقوى');
    }
    
    // تشفير كلمة المرور الجديدة
    const hashedNewPassword = md5(newPassword);
    
    // تحديث كلمة المرور
    currentUser.password = hashedNewPassword;
    currentUser.passwordChanged = true;
    
    // تحديث بيانات المستخدم
    updateUserInStorage(currentUser);
    
    // تسجيل حدث تغيير كلمة المرور
    logAuditEvent('password_change', currentUser.username, 'تم تغيير كلمة المرور');
}

/**
 * إضافة مستخدم جديد
 * @param {Object} userData بيانات المستخدم
 * @returns {Object} بيانات المستخدم الجديد
 */
function addUser(userData) {
    // التحقق من وجود اسم المستخدم
    if (!userData.username) {
        throw new Error('اسم المستخدم مطلوب');
    }
    
    // التحقق من وجود الاسم الظاهر
    if (!userData.displayName) {
        throw new Error('الاسم الظاهر مطلوب');
    }
    
    // التحقق من وجود كلمة المرور
    if (!userData.password) {
        throw new Error('كلمة المرور مطلوبة');
    }
    
    // التحقق من وجود الدور
    if (!userData.role) {
        throw new Error('الدور مطلوب');
    }
    
    // الحصول على قائمة المستخدمين
    const users = JSON.parse(localStorage.getItem('securityUsers')) || [];
    
    // التحقق من عدم وجود مستخدم بنفس اسم المستخدم
    if (users.some(u => u.username === userData.username)) {
        throw new Error('اسم المستخدم موجود بالفعل');
    }
    
    // إنشاء المستخدم الجديد
    const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        displayName: userData.displayName,
        password: md5(userData.password),
        role: userData.role,
        permissions: roles[userData.role].permissions,
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        lastLogin: null,
        failedLogins: 0,
        isLocked: false,
        passwordChanged: userData.passwordChanged !== undefined ? userData.passwordChanged : false
    };
    
    // إضافة المستخدم إلى القائمة
    users.push(newUser);
    
    // حفظ القائمة
    localStorage.setItem('securityUsers', JSON.stringify(users));
    
    // تسجيل حدث إضافة مستخدم
    logAuditEvent('user_add', currentUser ? currentUser.username : 'system', `تم إضافة المستخدم ${newUser.username}`);
    
    return newUser;
}

/**
 * تحديث بيانات مستخدم
 * @param {Object} userData بيانات المستخدم
 * @returns {Object} بيانات المستخدم المحدثة
 */
function updateUser(userData) {
    // التحقق من وجود معرف المستخدم
    if (!userData.id) {
        throw new Error('معرف المستخدم مطلوب');
    }
    
    // الحصول على قائمة المستخدمين
    const users = JSON.parse(localStorage.getItem('securityUsers')) || [];
    
    // البحث عن المستخدم
    const userIndex = users.findIndex(u => u.id === userData.id);
    if (userIndex === -1) {
        throw new Error('المستخدم غير موجود');
    }
    
    const user = users[userIndex];
    
    // التحقق من عدم وجود مستخدم آخر بنفس اسم المستخدم
    if (userData.username !== user.username && users.some(u => u.username === userData.username)) {
        throw new Error('اسم المستخدم موجود بالفعل');
    }
    
    // تحديث بيانات المستخدم
    user.username = userData.username || user.username;
    user.displayName = userData.displayName || user.displayName;
    
    // تحديث كلمة المرور إذا تم توفيرها
    if (userData.password) {
        user.password = md5(userData.password);
        user.passwordChanged = userData.passwordChanged !== undefined ? userData.passwordChanged : user.passwordChanged;
    }
    
    // تحديث الدور والصلاحيات
    if (userData.role && userData.role !== user.role) {
        user.role = userData.role;
        user.permissions = roles[userData.role].permissions;
    }
    
    // تحديث حالة النشاط
    user.isActive = userData.isActive !== undefined ? userData.isActive : user.isActive;
    
    // إذا كان المستخدم هو المستخدم الحالي، تحديث بياناته
    if (currentUser && currentUser.id === user.id) {
        currentUser = { ...user };
    }
    
    // حفظ القائمة
    users[userIndex] = user;
    localStorage.setItem('securityUsers', JSON.stringify(users));
    
    // تسجيل حدث تحديث مستخدم
    logAuditEvent('user_edit', currentUser ? currentUser.username : 'system', `تم تعديل المستخدم ${user.username}`);
    
    return user;
}

/**
 * تحديث بيانات مستخدم في التخزين المحلي
 * @param {Object} user بيانات المستخدم
 */
function updateUserInStorage(user) {
    // الحصول على قائمة المستخدمين
    const users = JSON.parse(localStorage.getItem('securityUsers')) || [];
    
    // البحث عن المستخدم
    const userIndex = users.findIndex(u => u.id === user.id);
    if (userIndex === -1) {
        return;
    }
    
    // تحديث المستخدم
    users[userIndex] = user;
    
    // حفظ القائمة
    localStorage.setItem('securityUsers', JSON.stringify(users));
}

/**
 * حذف مستخدم
 * @param {string} userId معرف المستخدم
 * @returns {boolean} نتيجة الحذف
 */
function deleteUser(userId) {
    // التحقق من وجود معرف المستخدم
    if (!userId) {
        throw new Error('معرف المستخدم مطلوب');
    }
    
    // الحصول على قائمة المستخدمين
    const users = JSON.parse(localStorage.getItem('securityUsers')) || [];
    
    // البحث عن المستخدم
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
        throw new Error('المستخدم غير موجود');
    }
    
    const user = users[userIndex];
    
    // التحقق من عدم حذف المستخدم الحالي
    if (currentUser && currentUser.id === userId) {
        throw new Error('لا يمكن حذف المستخدم الحالي');
    }
    
    // التحقق من عدم حذف المستخدم الوحيد بدور مدير النظام
    if (user.role === 'admin' && users.filter(u => u.role === 'admin').length === 1) {
        throw new Error('لا يمكن حذف مدير النظام الوحيد');
    }
    
    // حذف المستخدم
    users.splice(userIndex, 1);
    
    // حفظ القائمة
    localStorage.setItem('securityUsers', JSON.stringify(users));
    
    // تسجيل حدث حذف مستخدم
    logAuditEvent('user_delete', currentUser ? currentUser.username : 'system', `تم حذف المستخدم ${user.username}`);
    
    return true;
}

/**
 * الحصول على مستخدم بواسطة المعرف
 * @param {string} userId معرف المستخدم
 * @returns {Object|null} بيانات المستخدم
 */
function getUserById(userId) {
    // الحصول على قائمة المستخدمين
    const users = JSON.parse(localStorage.getItem('securityUsers')) || [];
    
    // البحث عن المستخدم
    return users.find(u => u.id === userId) || null;
}

/**
 * تعبئة جدول المستخدمين
 */
function populateUsersTable() {
    // الحصول على قائمة المستخدمين
    const users = JSON.parse(localStorage.getItem('securityUsers')) || [];
    
    // الحصول على عنصر جدول المستخدمين
    const tableBody = document.getElementById('security-users-table-body');
    if (!tableBody) return;
    
    // مسح الجدول
    tableBody.innerHTML = '';
    
    // التحقق من وجود مستخدمين
    if (users.length === 0) {
        const emptyRow = document.createElement('tr');
        const emptyCell = document.createElement('td');
        emptyCell.colSpan = 6;
        emptyCell.textContent = 'لا يوجد مستخدمين';
        emptyCell.className = 'security-text-center';
        emptyRow.appendChild(emptyCell);
        tableBody.appendChild(emptyRow);
        return;
    }
    
    // إنشاء صفوف الجدول
    users.forEach(user => {
        const row = document.createElement('tr');
        
        // تحديد فئة الصف حسب حالة المستخدم
        if (!user.isActive) {
            row.className = 'security-user-inactive';
        } else if (user.isLocked) {
            row.className = 'security-user-locked';
        }
        
        // تنسيق تاريخ آخر تسجيل دخول
        let lastLoginText = 'لم يسجل الدخول بعد';
        if (user.lastLogin) {
            const lastLogin = new Date(user.lastLogin);
            lastLoginText = lastLogin.toLocaleString('ar-SA');
        }
        
        // إنشاء خلايا الصف
        row.innerHTML = `
            <td>${user.username}</td>
            <td>${user.displayName}</td>
            <td>${roles[user.role].name}</td>
            <td>
                ${user.isLocked ? '<span class="security-badge security-badge-danger">مقفل</span>' : ''}
                ${!user.isActive ? '<span class="security-badge security-badge-warning">معطل</span>' : 
                  '<span class="security-badge security-badge-success">نشط</span>'}
            </td>
            <td>${lastLoginText}</td>
            <td>
                <div class="security-actions">
                    <button type="button" class="security-btn-icon security-edit-user" data-id="${user.id}" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.id !== currentUser.id ? `
                    <button type="button" class="security-btn-icon security-delete-user" data-id="${user.id}" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                    ${user.isLocked ? `
                    <button type="button" class="security-btn-icon security-unlock-user" data-id="${user.id}" title="فك القفل">
                        <i class="fas fa-unlock"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // إضافة مستمعي الأحداث للأزرار
    setupUserRowActions();
}

/**
 * إضافة مستمعي الأحداث لأزرار جدول المستخدمين
 */
function setupUserRowActions() {
    // مستمعي أحداث أزرار التعديل
    const editButtons = document.querySelectorAll('.security-edit-user');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            showUserFormModal(userId);
        });
    });
    
    // مستمعي أحداث أزرار الحذف
    const deleteButtons = document.querySelectorAll('.security-delete-user');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            
            // طلب تأكيد الحذف
            if (confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم؟')) {
                try {
                    // حذف المستخدم
                    deleteUser(userId);
                    
                    // تحديث الجدول
                    populateUsersTable();
                    
                    // عرض إشعار النجاح
                    showNotification('تم حذف المستخدم بنجاح', 'success');
                } catch (error) {
                    // عرض رسالة الخطأ
                    showNotification(error.message, 'error');
                }
            }
        });
    });
    
    // مستمعي أحداث أزرار فك القفل
    const unlockButtons = document.querySelectorAll('.security-unlock-user');
    unlockButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-id');
            
            try {
                // الحصول على المستخدم
                const user = getUserById(userId);
                if (!user) {
                    throw new Error('المستخدم غير موجود');
                }
                
                // فك قفل المستخدم
                user.isLocked = false;
                user.failedLogins = 0;
                
                // تحديث بيانات المستخدم
                updateUserInStorage(user);
                
                // تحديث الجدول
                populateUsersTable();
                
                // تسجيل حدث فك قفل مستخدم
                logAuditEvent('user_unlock', currentUser.username, `تم فك قفل المستخدم ${user.username}`);
                
                // عرض إشعار النجاح
                showNotification('تم فك قفل المستخدم بنجاح', 'success');
            } catch (error) {
                // عرض رسالة الخطأ
                showNotification(error.message, 'error');
            }
        });
    });
}

/**
 * إنشاء جلسة المستخدم
 * @param {Object} user بيانات المستخدم
 * @param {boolean} rememberMe تذكر المستخدم
 */
function createSession(user, rememberMe) {
    // إنشاء بيانات الجلسة
    const sessionData = {
        userId: user.id,
        username: user.username,
        role: user.role,
        timestamp: Date.now(),
        rememberMe: rememberMe
    };
    
    // حفظ الجلسة في التخزين المحلي
    sessionStorage.setItem('securitySession', JSON.stringify(sessionData));
    
    // إذا تم اختيار "تذكرني"، حفظ الجلسة في التخزين الدائم
    if (rememberMe) {
        localStorage.setItem('securitySession', JSON.stringify(sessionData));
    }
}

/**
 * استعادة جلسة المستخدم
 */
function restoreSession() {
    // محاولة استعادة الجلسة من التخزين المؤقت
    let sessionData = JSON.parse(sessionStorage.getItem('securitySession'));
    
    // إذا لم تكن موجودة، حاول استعادتها من التخزين الدائم
    if (!sessionData) {
        sessionData = JSON.parse(localStorage.getItem('securitySession'));
    }
    
    // التحقق من وجود بيانات الجلسة
    if (!sessionData) {
        return;
    }
    
    // التحقق من عدم انتهاء الجلسة
    const sessionAge = Date.now() - sessionData.timestamp;
    if (sessionAge > (24 * 60 * 60 * 1000) && !sessionData.rememberMe) { // 24 ساعة
        clearSession();
        return;
    }
    
    // الحصول على المستخدم
    const user = getUserById(sessionData.userId);
    if (!user) {
        clearSession();
        return;
    }
    
    // التحقق من حالة المستخدم
    if (!user.isActive || user.isLocked) {
        clearSession();
        return;
    }
    
    // تعيين المستخدم الحالي
    currentUser = { ...user };
    
    // تعيين حالة المصادقة
    isAuthenticated = true;
    
    // تحديث الجلسة
    createSession(user, sessionData.rememberMe);
    
    // بدء مؤقت انتهاء الجلسة
    resetSessionTimeout();
    
    // استدعاء دالة التبليغ عن المصادقة إذا كانت موجودة
    if (typeof authCallback === 'function') {
        authCallback(true, currentUser);
    }
}

/**
 * مسح جلسة المستخدم
 */
function clearSession() {
    // مسح الجلسة من التخزين المؤقت
    sessionStorage.removeItem('securitySession');
    
    // مسح الجلسة من التخزين الدائم
    localStorage.removeItem('securitySession');
}

/**
 * إعادة تعيين مؤقت انتهاء الجلسة
 */
function resetSessionTimeout() {
    // إلغاء المؤقت الحالي
    clearTimeout(sessionTimeout);
    
    // عدم بدء مؤقت جديد إذا لم يكن المستخدم مصادقاً
    if (!isAuthenticated) {
        return;
    }
    
    // بدء مؤقت جديد
    sessionTimeout = setTimeout(() => {
        // تسجيل الخروج تلقائياً
        logout();
        
        // عرض إشعار
        showNotification('تم تسجيل الخروج تلقائياً بسبب عدم النشاط', 'warning');
    }, sessionTimeoutDuration);
}

/**
 * فحص صلاحية المستخدم
 * @param {string} permission الصلاحية المطلوبة
 * @returns {boolean} نتيجة الفحص
 */
function hasPermission(permission) {
    // التحقق من وجود مستخدم حالي
    if (!currentUser) {
        return false;
    }
    
    // التحقق من امتلاك صلاحية "الكل"
    if (currentUser.permissions.includes('all')) {
        return true;
    }
    
    // التحقق من امتلاك الصلاحية المطلوبة
    return currentUser.permissions.includes(permission);
}

/**
 * تسجيل حدث في سجل الأحداث
 * @param {string} action نوع الحدث
 * @param {string} username اسم المستخدم
 * @param {string} details تفاصيل الحدث
 */
function logAuditEvent(action, username, details) {
    // الحصول على إعدادات الأمان
    const settings = JSON.parse(localStorage.getItem('securitySettings')) || {};
    
    // التحقق من تفعيل تسجيل الأحداث
    if (settings.auditLogging === false) {
        return;
    }
    
    // الحصول على سجل الأحداث
    const auditLog = JSON.parse(localStorage.getItem('securityAuditLog')) || [];
    
    // إضافة الحدث الجديد
    auditLog.push({
        timestamp: Date.now(),
        username: username,
        action: action,
        details: details,
        ipAddress: '127.0.0.1' // عنوان IP افتراضي
    });
    
    // اقتصاص السجل إذا تجاوز 1000 حدث
    if (auditLog.length > 1000) {
        auditLog.sort((a, b) => b.timestamp - a.timestamp);
        auditLog.length = 1000;
    }
    
    // حفظ السجل
    localStorage.setItem('securityAuditLog', JSON.stringify(auditLog));
}

/**
 * عرض إشعار للمستخدم
 * @param {string} message نص الإشعار
 * @param {string} type نوع الإشعار (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // استخدام دالة عرض الإشعارات الموجودة في التطبيق إذا كانت متاحة
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // التحقق من وجود عنصر الإشعارات
    let notification = document.getElementById('security-notification');
    
    // إنشاء عنصر الإشعارات إذا لم يكن موجوداً
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'security-notification';
        notification.className = 'security-notification';
        document.body.appendChild(notification);
    }
    
    // تحديد فئة الإشعار
    let notificationClass = 'security-notification-info';
    let icon = 'fa-info-circle';
    
    switch (type) {
        case 'success':
            notificationClass = 'security-notification-success';
            icon = 'fa-check-circle';
            break;
        case 'error':
            notificationClass = 'security-notification-error';
            icon = 'fa-times-circle';
            break;
        case 'warning':
            notificationClass = 'security-notification-warning';
            icon = 'fa-exclamation-triangle';
            break;
    }
    
    // تعيين محتوى الإشعار
    notification.className = `security-notification ${notificationClass}`;
    notification.innerHTML = `
        <div class="security-notification-icon">
            <i class="fas ${icon}"></i>
        </div>
        <div class="security-notification-message">${message}</div>
        <button type="button" class="security-notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // إظهار الإشعار
    notification.classList.add('security-show');
    
    // إضافة مستمع حدث زر الإغلاق
    const closeBtn = notification.querySelector('.security-notification-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            notification.classList.remove('security-show');
        });
    }
    
    // إخفاء الإشعار تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        notification.classList.remove('security-show');
    }, 5000);
}

/**
 * دالة تشفير MD5 (للاستخدام في تشفير كلمات المرور)
 * @param {string} string النص المراد تشفيره
 * @returns {string} النص المشفر
 */
function md5(string) {
    // نسخة مبسطة من خوارزمية MD5 للاستخدام في هذا المثال
    function rotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    
    function addUnsigned(lX, lY) {
        const lX8 = lX & 0x80000000;
        const lY8 = lY & 0x80000000;
        const lX4 = lX & 0x40000000;
        const lY4 = lY & 0x40000000;
        const lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        
        if (lX4 & lY4) {
            return lResult ^ 0x80000000 ^ lX8 ^ lY8;
        }
        
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return lResult ^ 0xC0000000 ^ lX8 ^ lY8;
            } else {
                return lResult ^ 0x40000000 ^ lX8 ^ lY8;
            }
        } else {
            return lResult ^ lX8 ^ lY8;
        }
    }
    
    function F(x, y, z) {
        return (x & y) | ((~x) & z);
    }
    
    function G(x, y, z) {
        return (x & z) | (y & (~z));
    }
    
    function H(x, y, z) {
        return x ^ y ^ z;
    }
    
    function I(x, y, z) {
        return y ^ (x | (~z));
    }
    
    function FF(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    
    function GG(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    
    function HH(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    
    function II(a, b, c, d, x, s, ac) {
        a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
        return addUnsigned(rotateLeft(a, s), b);
    }
    
    function convertToWordArray(string) {
        let lWordCount;
        const lMessageLength = string.length;
        const lNumberOfWords_temp1 = lMessageLength + 8;
        const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        const lWordArray = Array(lNumberOfWords - 1);
        let lBytePosition = 0;
        let lByteCount = 0;
        
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        
        return lWordArray;
    }
    
    function wordToHex(lValue) {
        let WordToHexValue = '';
        let WordToHexValue_temp = '';
        let lByte;
        let lCount;
        
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = `0${lByte.toString(16)}`;
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        
        return WordToHexValue;
    }
    
    function utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        let utfText = '';
        
        for (let n = 0; n < string.length; n++) {
            const c = string.charCodeAt(n);
            
            if (c < 128) {
                utfText += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utfText += String.fromCharCode((c >> 6) | 192);
                utfText += String.fromCharCode((c & 63) | 128);
            } else {
                utfText += String.fromCharCode((c >> 12) | 224);
                utfText += String.fromCharCode(((c >> 6) & 63) | 128);
                utfText += String.fromCharCode((c & 63) | 128);
            }
        }
        
        return utfText;
    }
    
    let k;
    let AA;
    let BB;
    let CC;
    let DD;
    let a;
    let b;
    let c;
    let d;
    const S11 = 7;
    const S12 = 12;
    const S13 = 17;
    const S14 = 22;
    const S21 = 5;
    const S22 = 9;
    const S23 = 14;
    const S24 = 20;
    const S31 = 4;
    const S32 = 11;
    const S33 = 16;
    const S34 = 23;
    const S41 = 6;
    const S42 = 10;
    const S43 = 15;
    const S44 = 21;
    
    string = utf8Encode(string);
    const x = convertToWordArray(string);
    
    a = 0x67452301;
    b = 0xEFCDAB89;
    c = 0x98BADCFE;
    d = 0x10325476;
    
    for (k = 0; k < x.length; k += 16) {
        AA = a;
        BB = b;
        CC = c;
        DD = d;
        
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        
        a = addUnsigned(a, AA);
        b = addUnsigned(b, BB);
        c = addUnsigned(c, CC);
        d = addUnsigned(d, DD);
    }
    
    const result = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
    return result.toLowerCase();
}

/**
 * إصدار أمر بإعادة تحميل البيانات في التطبيق بعد تغيير حالة المصادقة
 */
function reloadAppData() {
    // استدعاء وظائف تحميل البيانات في التطبيق إذا كانت متاحة
    if (typeof window.loadData === 'function') {
        window.loadData();
    }
    
    // تحديث واجهة المستخدم
    if (typeof window.updateDashboard === 'function') {
        window.updateDashboard();
    }
    
    // تحديث جداول البيانات
    if (typeof window.renderInvestorsTable === 'function') {
        window.renderInvestorsTable();
    }
    
    if (typeof window.renderTransactionsTable === 'function') {
        window.renderTransactionsTable();
    }
    
    if (typeof window.renderProfitsTable === 'function') {
        window.renderProfitsTable();
    }
}

// تصدير الواجهة العامة للنظام
return {
    // وظائف التهيئة
    init,
    
    // وظائف المصادقة
    login,
    logout,
    changePassword,
    
    // وظائف إدارة المستخدمين
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    
    // وظائف واجهة المستخدم
    showLoginScreen,
    hideLoginScreen,
    showUserManagementModal,
    hideUserManagementModal,
    showUserFormModal,
    hideUserFormModal,
    showChangePasswordModal,
    hideChangePasswordModal,
    showSecuritySettingsModal,
    hideSecuritySettingsModal,
    showAuditLogModal,
    hideAuditLogModal,
    showNotification,
    
    // وظائف إعدادات الأمان
    saveSecuritySettings,
    applySecuritySettings,
    
    // وظائف الجلسة
    resetSessionTimeout,
    
    // وظائف الصلاحيات
    hasPermission,
    
    // وظائف الحصول على البيانات
    getCurrentUser: () => currentUser,
    isAuthenticated: () => isAuthenticated
};
})();

/**
 * دمج النظام الأمني مع التطبيق الرئيسي
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('تهيئة نظام الأمان...');
    
    // تهيئة نظام الأمان
    SecuritySystem.init({
        // مدة الجلسة (30 دقيقة)
        sessionTimeoutDuration: 30 * 60 * 1000,
        
        // دالة الاستدعاء عند تغيير حالة المصادقة
        authCallback: function(isAuthenticated, user) {
            console.log('تغيير حالة المصادقة:', isAuthenticated);
            
            // تحديث واجهة المستخدم
            document.body.classList.toggle('authenticated', isAuthenticated);
            document.body.classList.toggle('guest', !isAuthenticated);
            
            // تحديث البيانات
            if (isAuthenticated) {
                // إعادة تحميل البيانات
                reloadAppData();
            }
        }
    });
    
    // إضافة مستمع أحداث النقر للروابط المحمية
    document.addEventListener('click', function(e) {
        // البحث عن رابط تنقل
        const navLink = e.target.closest('a[data-page]');
        if (!navLink) return;
        
        const pageId = navLink.getAttribute('data-page');
        
        // قائمة الصفحات المحمية
        const protectedPages = ['investors', 'transactions', 'profits', 'settings'];
        
        // التحقق مما إذا كانت الصفحة محمية
        if (protectedPages.includes(pageId)) {
            // التحقق من حالة المصادقة
            if (!SecuritySystem.isAuthenticated()) {
                e.preventDefault();
                
                // عرض شاشة تسجيل الدخول
                SecuritySystem.showLoginScreen();
                
                // عرض إشعار
                SecuritySystem.showNotification('يرجى تسجيل الدخول للوصول إلى هذه الصفحة', 'warning');
            }
        }
    });
});

/**
 * وظيفة إعادة تحميل البيانات
 */
function reloadAppData() {
    // إعادة تحميل البيانات من التخزين المحلي
    if (typeof window.loadData === 'function') {
        window.loadData();
    }
    
    // تحديث لوحة التحكم
    if (typeof window.updateDashboard === 'function') {
        window.updateDashboard();
    }
}