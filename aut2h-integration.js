/**
 * ملف دمج نظام المصادقة المحسن مع التطبيق الرئيسي
 * نظام الاستثمار المتكامل
 * 
 * يقوم هذا الملف بربط نظام المصادقة au2th-system.js مع واجهة التطبيق الرئيسي
 */

// اتصال عام بنظام المصادقة
let authSystem;

// استدعاء الملفات الأساسية لنظام المصادقة
document.addEventListener('DOMContentLoaded', function() {
    console.log('بدء تحميل نظام المصادقة المحسن...');

    // التأكد من وجود ملف نظام المصادقة
    if (typeof AuthSystem !== 'undefined') {
        console.log('نظام المصادقة موجود بالفعل، جاري التكامل معه...');
        authSystem = AuthSystem;
        setupAppWithAuth();
    } else {
        // تحميل نظام المصادقة إذا لم يكن موجوداً
        loadAuthSystem();
    }
});

/**
 * تحميل ملف نظام المصادقة
 */
function loadAuthSystem() {
    console.log('جاري تحميل ملف نظام المصادقة...');
    
    // إضافة ملف JavaScript
    const script = document.createElement('script');
    script.src = 'au2th-system.js';
    script.onload = function() {
        console.log('تم تحميل نظام المصادقة بنجاح');
        
        // استدعاء وظيفة الإعداد بعد التحميل
        if (typeof AuthSystem !== 'undefined') {
            authSystem = AuthSystem;
            setupAppWithAuth();
        } else {
            console.error('لم يتم العثور على كائن AuthSystem بعد تحميل الملف');
        }
    };
    script.onerror = function() {
        console.error('فشل في تحميل ملف نظام المصادقة (au2th-system.js)');
        fallbackToBasicAuth();
    };
    
    document.body.appendChild(script);
}

/**
 * استخدام نظام مصادقة بسيط في حال فشل تحميل النظام المحسن
 */
function fallbackToBasicAuth() {
    console.warn('استخدام نظام المصادقة البسيط كبديل...');
    
    // إنشاء نموذج تسجيل دخول بسيط
    showBasicLoginForm();
}

/**
 * إعداد التطبيق للعمل مع نظام المصادقة
 */
function setupAppWithAuth() {
    console.log('إعداد التطبيق للعمل مع نظام المصادقة...');
    
    // تهيئة نظام المصادقة
    authSystem.initialize()
        .then(initialized => {
            if (initialized) {
                console.log('تم تهيئة نظام المصادقة بنجاح');
                
                // التحقق من وجود مستخدم حالي
                const currentUser = authSystem.getCurrentUser();
                
                if (currentUser) {
                    console.log(`المستخدم الحالي: ${currentUser.displayName || currentUser.email}`);
                    
                    // تحميل البيانات وتحديث الواجهة
                    loadUserData(currentUser);
                    
                    // ربط أحداث نظام المصادقة مع التطبيق
                    setupAuthListeners();
                } else {
                    console.log('لم يتم العثور على مستخدم مسجل الدخول');
                    
                    // عرض شاشة تسجيل الدخول
                    authSystem.showLoginScreen();
                }
            } else {
                console.error('فشل في تهيئة نظام المصادقة');
                fallbackToBasicAuth();
            }
        })
        .catch(error => {
            console.error('خطأ في تهيئة نظام المصادقة:', error);
            fallbackToBasicAuth();
        });
}

/**
 * ربط مستمعي الأحداث مع نظام المصادقة
 */
function setupAuthListeners() {
    // إضافة مستمع لتغييرات حالة المصادقة
    authSystem.addAuthStateListener(function(user) {
        if (user) {
            // تم تسجيل الدخول
            console.log(`تم تسجيل الدخول: ${user.displayName || user.email}`);
            loadUserData(user);
        } else {
            // تم تسجيل الخروج
            console.log('تم تسجيل الخروج');
            
            // عرض شاشة تسجيل الدخول
            authSystem.showLoginScreen();
        }
    });
    
    // ربط أحداث النقر على زر تسجيل الخروج في القائمة
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        // إزالة أي مستمعي أحداث سابقة
        const newLogoutBtn = logoutBtn.cloneNode(true);
        logoutBtn.parentNode.replaceChild(newLogoutBtn, logoutBtn);
        
        // إضافة مستمع جديد
        newLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // تأكيد تسجيل الخروج
            if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
                authSystem.logout()
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
    
    // ربط نظام المصادقة مع وظائف التطبيق
    integrateWithAppFunctions();
}

/**
 * تحميل بيانات المستخدم وتحديث واجهة المستخدم
 * @param {Object} user - معلومات المستخدم
 */
function loadUserData(user) {
    // تحديث واجهة المستخدم بمعلومات المستخدم
    updateUserInterface(user);
    
    // تحميل البيانات من التخزين المحلي
    if (typeof window.loadData === 'function') {
        window.loadData();
    }
    
    // التحقق من وجود نظام FirebaseSync وتفعيله إذا كان متاحاً
    if (typeof FirebaseSync !== 'undefined' && FirebaseSync.getCurrentUser()) {
        FirebaseSync.syncFromFirebase()
            .then(() => {
                console.log('تم مزامنة البيانات من Firebase بنجاح');
                
                // تحديث الواجهة
                if (typeof window.updateDashboard === 'function') {
                    window.updateDashboard();
                }
            })
            .catch(error => {
                console.error('خطأ في مزامنة البيانات من Firebase:', error);
            });
    }
}

/**
 * تحديث واجهة المستخدم بمعلومات المستخدم
 * @param {Object} user - معلومات المستخدم
 */
function updateUserInterface(user) {
    console.log('تحديث واجهة المستخدم بمعلومات المستخدم:', user);
    
    // إخفاء شاشة تسجيل الدخول
    authSystem.hideLoginScreen();
    
    // البحث عن عنصر معلومات المستخدم أو إنشاؤه إذا لم يكن موجوداً
    let userInfoElement = document.querySelector('.user-info');
    
    if (!userInfoElement) {
        // إنشاء عنصر معلومات المستخدم وإضافته إلى الشريط العلوي
        addUserInfoToHeader(user);
    } else {
        // تحديث معلومات المستخدم الموجودة
        updateExistingUserInfo(userInfoElement, user);
    }
    
    // تحديث وصول العناصر حسب صلاحيات المستخدم
    updateElementsBasedOnPermissions(user);
}

/**
 * إضافة معلومات المستخدم إلى الشريط العلوي
 * @param {Object} user - معلومات المستخدم
 */
function addUserInfoToHeader(user) {
    // البحث عن عنصر شريط العنوان
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;
    
    // إنشاء عنصر معلومات المستخدم
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info dropdown';
    
    const userTypeLabel = getUserTypeLabel(user.type);
    const userLetter = (user.displayName || user.email).charAt(0).toUpperCase();
    
    userInfo.innerHTML = `
        <button class="dropdown-toggle">
            <div class="user-avatar">${userLetter}</div>
            <div>
                <div class="user-name">${user.displayName || user.email}</div>
                <div class="user-type">${userTypeLabel}</div>
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
    
    // إضافة عنصر معلومات المستخدم إلى الشريط العلوي
    headerActions.appendChild(userInfo);
    
    // إضافة مستمعي الأحداث
    setupUserMenuListeners();
}

/**
 * تحديث عنصر معلومات المستخدم الموجود
 * @param {HTMLElement} userInfoElement - عنصر معلومات المستخدم
 * @param {Object} user - معلومات المستخدم
 */
function updateExistingUserInfo(userInfoElement, user) {
    // التحقق من وجود العناصر المطلوبة
    const userNameElement = userInfoElement.querySelector('.user-name');
    const userTypeElement = userInfoElement.querySelector('.user-type');
    const userAvatarElement = userInfoElement.querySelector('.user-avatar');
    
    // تحديث اسم المستخدم
    if (userNameElement) {
        userNameElement.textContent = user.displayName || user.email;
    }
    
    // تحديث نوع المستخدم
    if (userTypeElement) {
        userTypeElement.textContent = getUserTypeLabel(user.type);
    }
    
    // تحديث صورة المستخدم
    if (userAvatarElement) {
        if (user.photoURL) {
            userAvatarElement.innerHTML = `<img src="${user.photoURL}" alt="${user.displayName || 'المستخدم'}" />`;
        } else {
            userAvatarElement.textContent = (user.displayName || user.email).charAt(0).toUpperCase();
        }
    }
}

/**
 * إضافة مستمعي الأحداث لقائمة المستخدم
 */
function setupUserMenuListeners() {
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
            authSystem.showProfileModal();
        });
    }
    
    // تغيير كلمة المرور
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            authSystem.showChangePasswordModal();
        });
    }
    
    // تسجيل الخروج
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // تأكيد تسجيل الخروج
            if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
                authSystem.logout()
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
 * تحديث وصول العناصر حسب صلاحيات المستخدم
 * @param {Object} user - معلومات المستخدم
 */
function updateElementsBasedOnPermissions(user) {
    // إضافة فئة نوع المستخدم للجسم
    document.body.setAttribute('data-user-type', user.type);
    
    // تطبيق الصلاحيات على عناصر الواجهة
    const permissions = user.permissions || authSystem.PERMISSIONS[user.type];
    
    // عناصر حذف المستثمرين
    const deleteInvestorsElements = document.querySelectorAll('.delete-investor, [data-permission="canDeleteInvestors"]');
    deleteInvestorsElements.forEach(element => {
        if (permissions.canDeleteInvestors) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
    
    // عناصر إدارة الإعدادات
    const settingsManagementElements = document.querySelectorAll('.settings-management, [data-permission="canManageSettings"]');
    settingsManagementElements.forEach(element => {
        if (permissions.canManageSettings) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });

    // عناصر تصدير البيانات
    const exportDataElements = document.querySelectorAll('.export-data, [data-permission="canExportData"]');
    exportDataElements.forEach(element => {
        if (permissions.canExportData) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });

    // عناصر استيراد البيانات
    const importDataElements = document.querySelectorAll('.import-data, [data-permission="canImportData"]');
    importDataElements.forEach(element => {
        if (permissions.canImportData) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });

    // تحديث القائمة الجانبية
    updateSidebarMenu(user);
}

/**
 * تحديث القائمة الجانبية حسب صلاحيات المستخدم
 * @param {Object} user - معلومات المستخدم
 */
function updateSidebarMenu(user) {
    // التحقق من وجود القائمة الجانبية
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;
    
    // الحصول على صلاحيات المستخدم
    const permissions = user.permissions || authSystem.PERMISSIONS[user.type];
    
    // تطبيق الصلاحيات على عناصر القائمة
    const navItems = sidebar.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        // التحقق من العناصر التي تتطلب صلاحيات محددة
        if (item.classList.contains('admin-only') && user.type !== 'admin') {
            item.style.display = 'none';
        } else if (item.classList.contains('manager-only') && 
                 user.type !== 'admin' && 
                 user.type !== 'manager') {
            item.style.display = 'none';
        } else {
            item.style.display = '';
        }
        
        // التحقق من صلاحيات محددة
        const permissionAttr = item.getAttribute('data-permission');
        if (permissionAttr && permissions) {
            item.style.display = permissions[permissionAttr] ? '' : 'none';
        }
    });
    
    // إضافة صفحات إدارية إذا كان المستخدم مسؤولاً
    if (user.type === 'admin') {
        addAdminLinks(sidebar);
    }
}

/**
 * إضافة روابط إدارية للقائمة الجانبية
 * @param {HTMLElement} sidebar - عنصر القائمة الجانبية
 */
function addAdminLinks(sidebar) {
    // التحقق من وجود روابط الإدارة
    const existingAdminLink = sidebar.querySelector('.nav-item[data-page="admin"]');
    if (existingAdminLink) return;
    
    // الحصول على قائمة الروابط
    const navList = sidebar.querySelector('.nav-list');
    if (!navList) return;
    
    // إنشاء رابط إدارة المستخدمين
    const userManagementItem = document.createElement('li');
    userManagementItem.className = 'nav-item admin-only';
    userManagementItem.setAttribute('data-page', 'user-management');
    
    userManagementItem.innerHTML = `
        <a class="nav-link" data-page="user-management" href="#">
            <div class="nav-icon">
                <i class="fas fa-users-cog"></i>
            </div>
            <span>إدارة المستخدمين</span>
        </a>
    `;
    
    // إضافة رابط إدارة المستخدمين بعد رابط الإعدادات
    const settingsItem = sidebar.querySelector('.nav-item[data-page="settings"]');
    if (settingsItem) {
        settingsItem.parentNode.insertBefore(userManagementItem, settingsItem.nextSibling);
    } else {
        navList.appendChild(userManagementItem);
    }
    
    // إضافة مستمع حدث النقر
    userManagementItem.querySelector('.nav-link').addEventListener('click', function(e) {
        e.preventDefault();
        
        // تبديل الصفحة النشطة
        switchToPage('user-management');
        
        // عرض صفحة إدارة المستخدمين
        showUserManagementPage();
    });
}

/**
 * التبديل إلى صفحة معينة
 * @param {string} pageName - اسم الصفحة
 */
function switchToPage(pageName) {
    // إزالة الفئة النشطة من جميع روابط التنقل
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // إضافة الفئة النشطة للرابط المحدد
    const selectedLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
    if (selectedLink) {
        selectedLink.classList.add('active');
    }
    
    // إخفاء جميع الصفحات
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // إظهار الصفحة المحددة
    const selectedPage = document.getElementById(`${pageName}-page`);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }
    
    // إنشاء حدث تغيير الصفحة
    const event = new CustomEvent('page:change', {
        detail: { page: pageName }
    });
    document.dispatchEvent(event);
}

/**
 * عرض صفحة إدارة المستخدمين
 */
function showUserManagementPage() {
    // التحقق من وجود صفحة إدارة المستخدمين
    let userManagementPage = document.getElementById('user-management-page');
    
    if (!userManagementPage) {
        // إنشاء صفحة إدارة المستخدمين
        userManagementPage = document.createElement('div');
        userManagementPage.className = 'page';
        userManagementPage.id = 'user-management-page';
        
        // إضافة محتوى الصفحة
        userManagementPage.innerHTML = `
            <div class="header">
                <button class="toggle-sidebar">
                    <i class="fas fa-bars"></i>
                </button>
                <h1 class="page-title">إدارة المستخدمين</h1>
                <div class="header-actions">
                    <div class="search-box">
                        <input class="search-input" placeholder="بحث عن مستخدم..." type="text" />
                        <i class="fas fa-search search-icon"></i>
                    </div>
                    <button class="btn btn-primary" id="add-user-btn">
                        <i class="fas fa-user-plus"></i>
                        <span>إضافة مستخدم</span>
                    </button>
                </div>
            </div>
            <div class="section">
                <div class="section-header">
                    <h2 class="section-title">قائمة المستخدمين</h2>
                    <div class="section-actions">
                        <button class="btn btn-outline btn-sm" id="refresh-users-btn">
                            <i class="fas fa-sync-alt"></i>
                            <span>تحديث</span>
                        </button>
                    </div>
                </div>
                <div class="table-container">
                    <table id="users-table">
                        <thead>
                            <tr>
                                <th>المعرف</th>
                                <th>المستخدم</th>
                                <th>البريد الإلكتروني</th>
                                <th>نوع المستخدم</th>
                                <th>تاريخ الإنشاء</th>
                                <th>آخر دخول</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colspan="7" class="text-center">جاري تحميل المستخدمين...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // إضافة الصفحة إلى العنصر الرئيسي
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.appendChild(userManagementPage);
        }
        
        // إضافة مستمعي الأحداث
        setupUserManagementListeners(userManagementPage);
    }
    
    // تحميل قائمة المستخدمين
    loadUsersList();
}

/**
 * إضافة مستمعي الأحداث لصفحة إدارة المستخدمين
 * @param {HTMLElement} page - عنصر الصفحة
 */
function setupUserManagementListeners(page) {
    // زر إضافة مستخدم
    const addUserBtn = page.querySelector('#add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', function() {
            showAddUserModal();
        });
    }
    
    // زر تحديث قائمة المستخدمين
    const refreshUsersBtn = page.querySelector('#refresh-users-btn');
    if (refreshUsersBtn) {
        refreshUsersBtn.addEventListener('click', function() {
            loadUsersList();
        });
    }
    
    // حقل البحث
    const searchInput = page.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterUsersList(this.value);
        });
    }
}

/**
 * تحميل قائمة المستخدمين
 */
function loadUsersList() {
    // التحقق من وجود جدول المستخدمين
    const usersTable = document.getElementById('users-table');
    if (!usersTable) return;
    
    // تغيير محتوى الجدول إلى رسالة التحميل
    const tbody = usersTable.querySelector('tbody');
    if (tbody) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">جاري تحميل المستخدمين...</td></tr>';
    }
    
    // الحصول على قائمة المستخدمين من نظام المصادقة
    authSystem.getUsers()
        .then(users => {
            if (!tbody) return;
            
            if (!users || users.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">لا يوجد مستخدمين</td></tr>';
                return;
            }
            
            // عرض المستخدمين
            tbody.innerHTML = users.map(user => {
                // تحديد فئة الصف حسب نوع المستخدم
                const rowClass = user.type === 'admin' ? 'admin-row' : (user.type === 'manager' ? 'manager-row' : '');
                
                // تنسيق التواريخ
                const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleString() : '-';
                const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-';
                
                return `
                    <tr class="${rowClass}">
                        <td>${user.uid.substring(0, 8)}...</td>
                        <td>
                            <div class="user-info-cell">
                                <div class="user-avatar small">${(user.fullName || user.email).charAt(0).toUpperCase()}</div>
                                <span>${user.fullName || '-'}</span>
                            </div>
                        </td>
                        <td>${user.email}</td>
                        <td>
                            <span class="badge badge-${getUserTypeBadgeClass(user.type)}">${getUserTypeLabel(user.type)}</span>
                        </td>
                        <td>${createdAt}</td>
                        <td>${lastLogin}</td>
                        <td>
                            <div class="actions-cell">
                                <button class="btn btn-sm btn-primary edit-user-btn" data-user-id="${user.uid}" title="تعديل">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-info reset-password-btn" data-user-id="${user.uid}" title="إعادة تعيين كلمة المرور">
                                    <i class="fas fa-key"></i>
                                </button>
                                ${user.type !== 'admin' || (currentUser.type === 'admin' && user.uid !== currentUser.uid) ? 
                                `<button class="btn btn-sm btn-danger delete-user-btn" data-user-id="${user.uid}" title="حذف">
                                    <i class="fas fa-trash"></i>
                                </button>` : ''}
                            </div>
                        </td>
                    </tr>
                `;
            }).join('');
            
            // إضافة مستمعي الأحداث للأزرار
            setupUserRowActions();
        })
        .catch(error => {
            console.error('خطأ في تحميل قائمة المستخدمين:', error);
            
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">حدث خطأ أثناء تحميل المستخدمين</td></tr>';
            }
        });
}

/**
 * إضافة مستمعي الأحداث لأزرار إجراءات المستخدمين
 */
function setupUserRowActions() {
    // أزرار تعديل المستخدم
    const editButtons = document.querySelectorAll('.edit-user-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            showEditUserModal(userId);
        });
    });
    
    // أزرار إعادة تعيين كلمة المرور
    const resetButtons = document.querySelectorAll('.reset-password-btn');
    resetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            resetUserPassword(userId);
        });
    });
    
    // أزرار حذف المستخدم
    const deleteButtons = document.querySelectorAll('.delete-user-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            deleteUser(userId);
        });
    });
}

/**
 * تصفية قائمة المستخدمين
 * @param {string} keyword - كلمة البحث
 */
function filterUsersList(keyword) {
    // التحقق من وجود جدول المستخدمين
    const usersTable = document.getElementById('users-table');
    if (!usersTable) return;
    
    // التحقق من صحة الكلمة المفتاحية
    if (!keyword) {
        // إظهار جميع الصفوف
        const rows = usersTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.display = '';
        });
        return;
    }
    
    // تحويل الكلمة المفتاحية إلى حروف صغيرة للمقارنة
    const searchText = keyword.toLowerCase();
    
    // تصفية الصفوف
    const rows = usersTable.querySelectorAll('tbody tr');
    rows.forEach(row => {
        // البحث في محتوى الخلايا
        const cells = row.querySelectorAll('td');
        let found = false;
        
        cells.forEach(cell => {
            if (cell.textContent.toLowerCase().includes(searchText)) {
                found = true;
            }
        });
        
        // إظهار أو إخفاء الصف
        row.style.display = found ? '' : 'none';
    });
}

/**
 * عرض نافذة إضافة مستخدم جديد
 */
function showAddUserModal() {
    // إنشاء نافذة إضافة مستخدم
    showModal('إضافة مستخدم جديد', `
        <form id="add-user-form">
            <div class="form-group">
                <label class="form-label">الاسم الكامل</label>
                <div class="input-with-icon">
                    <i class="fas fa-user"></i>
                    <input type="text" class="form-input" id="user-fullname" required>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">البريد الإلكتروني</label>
                <div class="input-with-icon">
                    <i class="fas fa-envelope"></i>
                    <input type="email" class="form-input" id="user-email" required>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">كلمة المرور</label>
                <div class="input-with-icon password-input-container">
                    <i class="fas fa-lock"></i>
                    <input type="password" class="form-input" id="user-password" required>
                    <button type="button" class="toggle-password" tabindex="-1">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">تأكيد كلمة المرور</label>
                <div class="input-with-icon password-input-container">
                    <i class="fas fa-lock"></i>
                    <input type="password" class="form-input" id="user-confirm-password" required>
                    <button type="button" class="toggle-password" tabindex="-1">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">نوع المستخدم</label>
                <div class="input-with-icon">
                    <i class="fas fa-users-cog"></i>
                    <select class="form-select" id="user-type">
                        <option value="user">مستخدم عادي</option>
                        <option value="manager">مدير</option>
                        <option value="admin">مسؤول</option>
                    </select>
                </div>
            </div>
            <div class="form-group admin-code-group">
                <label class="form-label">رمز المسؤول <small>(مطلوب للمستخدم الأول أو للمسؤول)</small></label>
                <div class="input-with-icon password-input-container">
                    <i class="fas fa-key"></i>
                    <input type="password" class="form-input" id="user-admin-code">
                    <button type="button" class="toggle-password" tabindex="-1">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </form>
    `, function(modal) {
        // مستمعي الأحداث لإظهار/إخفاء كلمة المرور
        setupPasswordToggles(modal);
        
        // مستمع حدث تغيير نوع المستخدم
        const userTypeSelect = modal.querySelector('#user-type');
        const adminCodeGroup = modal.querySelector('.admin-code-group');
        
        if (userTypeSelect && adminCodeGroup) {
            userTypeSelect.addEventListener('change', function() {
                adminCodeGroup.style.display = this.value === 'admin' ? 'block' : 'none';
            });
        }
        
        // مستمع حدث إضافة المستخدم
        const footerElement = modal.querySelector('.modal-footer');
        
        if (footerElement) {
            // إضافة زر الحفظ في التذييل
            const saveButton = document.createElement('button');
            saveButton.className = 'btn btn-primary';
            saveButton.textContent = 'إضافة';
            
            // إضافة الزر إلى التذييل
            footerElement.appendChild(saveButton);
            
            // مستمع حدث النقر على زر الحفظ
            saveButton.addEventListener('click', function() {
                // التحقق من صحة النموذج
                const fullName = document.getElementById('user-fullname').value;
                const email = document.getElementById('user-email').value;
                const password = document.getElementById('user-password').value;
                const confirmPassword = document.getElementById('user-confirm-password').value;
                const userType = document.getElementById('user-type').value;
                const adminCode = document.getElementById('user-admin-code').value;
                
                if (!fullName || !email || !password || !confirmPassword) {
                    showNotification('يرجى إدخال جميع البيانات المطلوبة', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showNotification('كلمة المرور وتأكيدها غير متطابقين', 'error');
                    return;
                }
                
                if (password.length < 6) {
                    showNotification('يجب أن تكون كلمة المرور 6 أحرف على الأقل', 'error');
                    return;
                }
                
                // تغيير حالة الزر
                const originalText = this.textContent;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإضافة...';
                this.disabled = true;
                
                // إضافة المستخدم
                authSystem.signup(email, password, fullName, adminCode, userType)
                    .then(() => {
                        showNotification('تم إضافة المستخدم بنجاح', 'success');
                        
                        // إغلاق النافذة
                        closeModal(modal);
                        
                        // تحديث قائمة المستخدمين
                        loadUsersList();
                    })
                    .catch(error => {
                        console.error('خطأ في إضافة المستخدم:', error);
                        showNotification(error.message || 'حدث خطأ أثناء إضافة المستخدم', 'error');
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
 * عرض نافذة تعديل مستخدم
 * @param {string} userId - معرف المستخدم
 */
function showEditUserModal(userId) {
    // الحصول على بيانات المستخدم
    authSystem.getUserData(userId)
        .then(userData => {
            // إنشاء نافذة تعديل المستخدم
            showModal('تعديل المستخدم', `
                <form id="edit-user-form">
                    <input type="hidden" id="edit-user-id" value="${userId}">
                    <div class="form-group">
                        <label class="form-label">الاسم الكامل</label>
                        <div class="input-with-icon">
                            <i class="fas fa-user"></i>
                            <input type="text" class="form-input" id="edit-user-fullname" value="${userData.fullName || ''}" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">البريد الإلكتروني</label>
                        <div class="input-with-icon">
                            <i class="fas fa-envelope"></i>
                            <input type="email" class="form-input" id="edit-user-email" value="${userData.email || ''}" readonly>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">نوع المستخدم</label>
                        <div class="input-with-icon">
                            <i class="fas fa-users-cog"></i>
                            <select class="form-select" id="edit-user-type">
                                <option value="user" ${userData.type === 'user' ? 'selected' : ''}>مستخدم عادي</option>
                                <option value="manager" ${userData.type === 'manager' ? 'selected' : ''}>مدير</option>
                                <option value="admin" ${userData.type === 'admin' ? 'selected' : ''}>مسؤول</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group edit-admin-code-group" ${userData.type !== 'admin' ? 'style="display: none;"' : ''}>
                        <label class="form-label">رمز المسؤول <small>(مطلوب لتغيير نوع المستخدم إلى مسؤول)</small></label>
                        <div class="input-with-icon password-input-container">
                            <i class="fas fa-key"></i>
                            <input type="password" class="form-input" id="edit-user-admin-code">
                            <button type="button" class="toggle-password" tabindex="-1">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                </form>
            `, function(modal) {
                // مستمعي الأحداث لإظهار/إخفاء كلمة المرور
                setupPasswordToggles(modal);
                
                // مستمع حدث تغيير نوع المستخدم
                const userTypeSelect = modal.querySelector('#edit-user-type');
                const adminCodeGroup = modal.querySelector('.edit-admin-code-group');
                
                if (userTypeSelect && adminCodeGroup) {
                    userTypeSelect.addEventListener('change', function() {
                        adminCodeGroup.style.display = this.value === 'admin' ? 'block' : 'none';
                    });
                }
                
                // مستمع حدث تعديل المستخدم
                const footerElement = modal.querySelector('.modal-footer');
                
                if (footerElement) {
                    // إضافة زر الحفظ في التذييل
                    const saveButton = document.createElement('button');
                    saveButton.className = 'btn btn-primary';
                    saveButton.textContent = 'حفظ التغييرات';
                    
                    // إضافة الزر إلى التذييل
                    footerElement.appendChild(saveButton);
                    
                    // مستمع حدث النقر على زر الحفظ
                    saveButton.addEventListener('click', function() {
                        // التحقق من صحة النموذج
                        const fullName = document.getElementById('edit-user-fullname').value;
                        const userType = document.getElementById('edit-user-type').value;
                        const adminCode = document.getElementById('edit-user-admin-code').value;
                        
                        if (!fullName) {
                            showNotification('يرجى إدخال الاسم الكامل', 'error');
                            return;
                        }
                        
                        // تغيير حالة الزر
                        const originalText = this.textContent;
                        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
                        this.disabled = true;
                        
                        // تحديث بيانات المستخدم
                        const currentUser = authSystem.getCurrentUser();
                        
                        // إعداد البيانات المراد تحديثها
                        const updateData = {
                            fullName: fullName,
                            type: userType
                        };
                        
                        // تحديث بيانات المستخدم
                        authSystem.updateUserData(userId, updateData, adminCode)
                            .then(() => {
                                showNotification('تم تحديث بيانات المستخدم بنجاح', 'success');
                                
                                // إغلاق النافذة
                                closeModal(modal);
                                
                                // تحديث قائمة المستخدمين
                                loadUsersList();
                            })
                            .catch(error => {
                                console.error('خطأ في تحديث بيانات المستخدم:', error);
                                showNotification(error.message || 'حدث خطأ أثناء تحديث بيانات المستخدم', 'error');
                            })
                            .finally(() => {
                                // إعادة حالة الزر
                                this.textContent = originalText;
                                this.disabled = false;
                            });
                    });
                }
            });
        })
        .catch(error => {
            console.error('خطأ في الحصول على بيانات المستخدم:', error);
            showNotification('حدث خطأ أثناء تحميل بيانات المستخدم', 'error');
        });
}

/**
 * إعادة تعيين كلمة مرور المستخدم
 * @param {string} userId - معرف المستخدم
 */
function resetUserPassword(userId) {
    // الحصول على بيانات المستخدم
    authSystem.getUserData(userId)
        .then(userData => {
            // تأكيد إعادة تعيين كلمة المرور
            if (confirm(`هل أنت متأكد من رغبتك في إعادة تعيين كلمة المرور للمستخدم ${userData.fullName || userData.email}؟`)) {
                // إعادة تعيين كلمة المرور
                authSystem.resetPassword(userData.email)
                    .then(() => {
                        showNotification('تم إرسال رابط إعادة تعيين كلمة المرور بنجاح', 'success');
                    })
                    .catch(error => {
                        console.error('خطأ في إعادة تعيين كلمة المرور:', error);
                        showNotification(error.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور', 'error');
                    });
            }
        })
        .catch(error => {
            console.error('خطأ في الحصول على بيانات المستخدم:', error);
            showNotification('حدث خطأ أثناء تحميل بيانات المستخدم', 'error');
        });
}

/**
 * حذف المستخدم
 * @param {string} userId - معرف المستخدم
 */
function deleteUser(userId) {
    // الحصول على بيانات المستخدم
    authSystem.getUserData(userId)
        .then(userData => {
            // تأكيد حذف المستخدم
            if (confirm(`هل أنت متأكد من رغبتك في حذف المستخدم ${userData.fullName || userData.email}؟ لا يمكن التراجع عن هذا الإجراء.`)) {
                // حذف المستخدم
                authSystem.deleteUser(userId)
                    .then(() => {
                        showNotification('تم حذف المستخدم بنجاح', 'success');
                        
                        // تحديث قائمة المستخدمين
                        loadUsersList();
                    })
                    .catch(error => {
                        console.error('خطأ في حذف المستخدم:', error);
                        showNotification(error.message || 'حدث خطأ أثناء حذف المستخدم', 'error');
                    });
            }
        })
        .catch(error => {
            console.error('خطأ في الحصول على بيانات المستخدم:', error);
            showNotification('حدث خطأ أثناء تحميل بيانات المستخدم', 'error');
        });
}

/**
 * إعداد مستمعي الأحداث لأزرار إظهار/إخفاء كلمة المرور
 * @param {HTMLElement} container - العنصر الحاوي
 */
function setupPasswordToggles(container) {
    const toggleButtons = container.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
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
}

/**
 * عرض نافذة منبثقة
 * @param {string} title - عنوان النافذة
 * @param {string} content - محتوى النافذة
 * @param {Function} onRendered - دالة تنفذ بعد إنشاء النافذة
 * @returns {HTMLElement} - عنصر النافذة
 */
function showModal(title, content, onRendered) {
    // إنشاء عنصر النافذة
    const modalId = 'modal-' + Date.now();
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.id = modalId;
    
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
                <button class="btn btn-outline modal-close-btn">إلغاء</button>
            </div>
        </div>
    `;
    
    // إضافة النافذة للصفحة
    document.body.appendChild(modalOverlay);
    
    // إظهار النافذة
    setTimeout(() => {
        modalOverlay.classList.add('active');
    }, 10);
    
    // مستمعي أحداث أزرار الإغلاق
    const closeButtons = modalOverlay.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            closeModal(modalOverlay);
        });
    });
    
    // تنفيذ الدالة بعد إنشاء النافذة
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
    // التحقق من نوع المدخل
    if (typeof modal === 'string') {
        modal = document.getElementById(modal);
    }
    
    if (modal && modal.classList.contains('modal-overlay')) {
        // إخفاء النافذة
        modal.classList.remove('active');
        
        // إزالة النافذة بعد فترة
        setTimeout(() => {
            modal.parentNode.removeChild(modal);
        }, 300);
    }
}

/**
 * عرض إشعار للمستخدم
 * @param {string} message - نص الإشعار
 * @param {string} type - نوع الإشعار (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // استخدام دالة عرض الإشعارات في نظام المصادقة
    if (typeof authSystem !== 'undefined' && typeof authSystem.showNotification === 'function') {
        authSystem.showNotification(message, type);
        return;
    }
    
    // التحقق من وجود نظام الإشعارات في التطبيق
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
        return;
    }
    
    // إنشاء إشعار بسيط
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="notification-icon fas ${getNotificationIcon(type)}"></i>
            <span class="notification-message">${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // إضافة الإشعار للصفحة
    document.body.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // إخفاء الإشعار بعد فترة
    setTimeout(() => {
        notification.classList.remove('show');
        
        // إزالة الإشعار بعد انتهاء التأثير
        setTimeout(() => {
            notification.parentNode.removeChild(notification);
        }, 300);
    }, 5000);
    
    // زر إغلاق الإشعار
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            notification.classList.remove('show');
            
            setTimeout(() => {
                notification.parentNode.removeChild(notification);
            }, 300);
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
 * الحصول على تسمية نوع المستخدم
 * @param {string} userType - نوع المستخدم
 * @returns {string} - التسمية
 */
function getUserTypeLabel(userType) {
    switch (userType) {
        case 'admin':
            return 'مسؤول النظام';
        case 'manager':
            return 'مدير';
        case 'user':
            return 'مستخدم';
        default:
            return 'غير معروف';
    }
}

/**
 * الحصول على فئة شارة نوع المستخدم
 * @param {string} userType - نوع المستخدم
 * @returns {string} - فئة الشارة
 */
function getUserTypeBadgeClass(userType) {
    switch (userType) {
        case 'admin':
            return 'danger';
        case 'manager':
            return 'warning';
        case 'user':
            return 'info';
        default:
            return 'secondary';
    }
}

/**
 * دمج نظام المصادقة مع وظائف التطبيق
 */
function integrateWithAppFunctions() {
    // استبدال الوظائف الأصلية بوظائف تتحقق من تسجيل الدخول
    integrateWithInvestorsFunctions();
    integrateWithTransactionsFunctions();
    integrateWithSettingsFunctions();
    
    // تفعيل الحماية على مستوى الكائن window
    addSecurityChecks();
}

/**
 * دمج نظام المصادقة مع وظائف المستثمرين
 */
function integrateWithInvestorsFunctions() {
    // الاحتفاظ بالوظائف الأصلية
    if (typeof window.addNewInvestor === 'function' && !window._originalAddNewInvestor) {
        window._originalAddNewInvestor = window.addNewInvestor;
        
        // استبدال الوظيفة
        window.addNewInvestor = function() {
            // التحقق من تسجيل الدخول
            if (!authSystem.getCurrentUser()) {
                showNotification('يجب تسجيل الدخول أولاً', 'error');
                authSystem.showLoginScreen();
                return false;
            }
            
            // استدعاء الوظيفة الأصلية
            return window._originalAddNewInvestor.apply(this, arguments);
        };
    }