/**
 * ملف تنفيذ تكامل نظام ملف المستخدم المحسّن الجديد
 * يقوم بإضافة التكامل بين نظام الاستثمار ونظام ملف المستخدم المحسن مع الصلاحيات الجديدة
 */

// تنفيذ التكامل
document.addEventListener('DOMContentLoaded', function() {
    console.log('بدء تنفيذ تكامل نظام ملف المستخدم المحسن الجديد...');
    
    // إضافة الأنماط
    addEnhancedProfileStyles();
    
    // إضافة الوظائف إلى الشريط الجانبي
    enhanceSidebar();
    
    // تعديل مصادقة النظام لدعم الصلاحيات
    enhanceAuthSystem();
    
    // تهيئة نظام ملف المستخدم المحسن إذا كان موجوداً
    if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.init === 'function') {
        window.EnhancedUserProfile.init();
    } else {
        console.warn('نظام ملف المستخدم المحسن غير موجود. يرجى التأكد من تضمين ملف user-profile-enhanced.js');
        
        // مؤقتاً، نقوم بإنشاء عناصر واجهة المستخدم الأساسية
        createBasicUserProfileElements();
    }
    
    console.log('تم تنفيذ تكامل نظام ملف المستخدم المحسن الجديد بنجاح');
});

/**
 * إضافة أنماط CSS لنظام ملف المستخدم المحسن
 */
function addEnhancedProfileStyles() {
    // التحقق من وجود الأنماط مسبقاً
    if (document.getElementById('enhanced-profile-styles-inline')) {
        return;
    }
    
    // إنشاء عنصر النمط
    const styleElement = document.createElement('style');
    styleElement.id = 'enhanced-profile-styles-inline';
    
    // إضافة متغيرات CSS الأساسية
    styleElement.textContent = `
    :root {
        --primary-color: #3b82f6;
        --primary-color-dark: #2563eb;
        --primary-color-light: #93c5fd;
        --success-color: #10b981;
        --danger-color: #ef4444;
        --warning-color: #f59e0b;
        --info-color: #64748b;
        --bg-color: #f9fafb;
        --text-color: #1f2937;
        --text-color-light: #6b7280;
        --border-color: #e5e7eb;
    }
    
    /* أنماط أساسية لواجهة المستخدم المحسنة */
    .user-menu-container {
        position: relative;
        display: flex;
        align-items: center;
        margin-right: 1rem;
    }
    
    .user-info {
        display: flex;
        align-items: center;
        position: relative;
    }
    
    .dropdown {
        position: relative;
        display: inline-block;
    }
    
    .dropdown-toggle {
        display: flex;
        align-items: center;
        background: none;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        cursor: pointer;
        color: var(--text-color);
        transition: background-color 0.3s ease;
    }
    
    .dropdown-toggle:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
    
    .user-avatar {
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        background-color: var(--primary-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        margin-left: 0.5rem;
        font-size: 1rem;
    }
    `;
    
    // إضافة عنصر النمط إلى الصفحة
    document.head.appendChild(styleElement);
    
    // إضافة ملف CSS الخارجي إذا لم يكن موجوداً
    if (!document.querySelector('link[href="user-profile-enhanced-styles.css"]')) {
        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'user-profile-enhanced-styles.css';
        document.head.appendChild(linkElement);
    }
    
    console.log('تم إضافة أنماط CSS لنظام ملف المستخدم المحسن');
}

/**
 * تحسين الشريط الجانبي بإضافة عناصر إدارة المستخدمين
 */
function enhanceSidebar() {
    const sidebarNav = document.querySelector('.sidebar .nav-list');
    if (!sidebarNav) {
        console.warn('لم يتم العثور على قائمة الشريط الجانبي');
        return;
    }
    
    // إضافة عنصر إدارة المستخدمين قبل الإعدادات
    const settingsItem = sidebarNav.querySelector('.nav-item [data-page="settings"]').closest('.nav-item');
    
    // إنشاء عنصر إدارة المستخدمين
    const userManagementItem = document.createElement('li');
    userManagementItem.className = 'nav-item user-management admin-only';
    userManagementItem.setAttribute('data-permission', 'canCreateUsers');
    userManagementItem.innerHTML = `
        <a class="nav-link" data-page="user-management" href="#">
            <div class="nav-icon">
                <i class="fas fa-user-shield"></i>
            </div>
            <span>إدارة المستخدمين</span>
        </a>
    `;
    
    // إضافة العنصر قبل الإعدادات
    if (settingsItem) {
        sidebarNav.insertBefore(userManagementItem, settingsItem);
    } else {
        sidebarNav.appendChild(userManagementItem);
    }
    
    // إضافة مستمع حدث للتنقل
    userManagementItem.querySelector('.nav-link').addEventListener('click', function(e) {
        e.preventDefault();
        navigateToPage('user-management');
    });
    
    console.log('تم تحسين الشريط الجانبي بإضافة عناصر إدارة المستخدمين');
}

/**
 * تعديل نظام المصادقة لدعم الصلاحيات
 */
function enhanceAuthSystem() {
    // إضافة خاصية الصلاحيات إلى كائن المستخدم الحالي
    if (window.AuthSystem && typeof window.AuthSystem.getUserInfo === 'function') {
        const originalGetUserInfo = window.AuthSystem.getUserInfo;
        
        // استبدال الدالة بنسخة محسنة
        window.AuthSystem.getUserInfo = function() {
            const userInfo = originalGetUserInfo.call(window.AuthSystem);
            
            // إضافة نوع المستخدم والصلاحيات إذا لم تكن موجودة
            if (userInfo) {
                if (!userInfo.type) {
                    // تحديد نوع افتراضي حسب البريد الإلكتروني
                    if (userInfo.email && userInfo.email.includes('admin')) {
                        userInfo.type = 'admin';
                    } else if (userInfo.email && userInfo.email.includes('manager')) {
                        userInfo.type = 'manager';
                    } else {
                        userInfo.type = 'user';
                    }
                }
                
                // إضافة الصلاحيات الافتراضية إذا لم تكن موجودة
                if (!userInfo.permissions) {
                    userInfo.permissions = getDefaultPermissions(userInfo.type);
                }
            }
            
            return userInfo;
        };
        
        console.log('تم تحسين نظام المصادقة لدعم الصلاحيات');
    } else {
        console.warn('نظام المصادقة غير موجود أو لا يوفر وظيفة الحصول على معلومات المستخدم');
    }
}

/**
 * الحصول على الصلاحيات الافتراضية حسب نوع المستخدم
 * @param {string} userType - نوع المستخدم
 * @returns {Object} - كائن الصلاحيات
 */
function getDefaultPermissions(userType) {
    switch (userType) {
        case 'admin':
            return {
                canCreateUsers: true,
                canDeleteUsers: true,
                canManageSettings: true,
                canDeleteInvestors: true,
                canExportData: true,
                canImportData: true,
                canCreateBackup: true,
                canRestoreBackup: true
            };
        case 'manager':
            return {
                canCreateUsers: true,
                canDeleteUsers: false,
                canManageSettings: true,
                canDeleteInvestors: true,
                canExportData: true,
                canImportData: true,
                canCreateBackup: false,
                canRestoreBackup: false
            };
        case 'user':
        default:
            return {
                canCreateUsers: false,
                canDeleteUsers: false,
                canManageSettings: false,
                canDeleteInvestors: false,
                canExportData: true,
                canImportData: false,
                canCreateBackup: false,
                canRestoreBackup: false
            };
    }
}

/**
 * إنشاء عناصر واجهة المستخدم الأساسية
 * (يستخدم مؤقتاً إذا لم يكن نظام ملف المستخدم المحسن موجوداً)
 */
function createBasicUserProfileElements() {
    // البحث عن حاوية قائمة المستخدم
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) {
        console.warn('لم يتم العثور على حاوية عناصر الرأس');
        return;
    }
    
    // إنشاء عنصر معلومات المستخدم
    const userInfo = document.createElement('div');
    userInfo.className = 'user-info dropdown';
    
    // الحصول على معلومات المستخدم الحالي
    let currentUser = null;
    if (window.AuthSystem && typeof window.AuthSystem.getUserInfo === 'function') {
        currentUser = window.AuthSystem.getUserInfo();
    }
    
    // تحديد محتوى العنصر
    if (currentUser) {
        // المستخدم مسجل الدخول
        userInfo.innerHTML = `
            <button class="dropdown-toggle">
                <span class="user-avatar">${(currentUser.displayName || currentUser.email).charAt(0)}</span>
                <span class="user-name">${currentUser.displayName || currentUser.email}</span>
                <span class="user-type">${getUserTypeLabel(currentUser.type)}</span>
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
    } else {
        // المستخدم غير مسجل الدخول
        userInfo.innerHTML = `
            <button class="btn btn-primary" id="login-header-btn">
                <i class="fas fa-sign-in-alt"></i>
                <span>تسجيل الدخول</span>
            </button>
        `;
    }
    
    // إضافة العنصر إلى الصفحة
    headerActions.appendChild(userInfo);
    
    // إضافة مستمعي الأحداث
    setupBasicUserMenuListeners(userInfo, currentUser);
    
    console.log('تم إنشاء عناصر واجهة المستخدم الأساسية');
}

/**
 * إضافة مستمعي الأحداث لعناصر قائمة المستخدم
 * @param {HTMLElement} userInfo - عنصر معلومات المستخدم
 * @param {Object} currentUser - كائن المستخدم الحالي
 */
function setupBasicUserMenuListeners(userInfo, currentUser) {
    if (!userInfo) return;
    
    // تبديل القائمة المنسدلة
    const dropdownToggle = userInfo.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            userInfo.classList.toggle('active');
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!userInfo.contains(e.target)) {
                userInfo.classList.remove('active');
            }
        });
    }
    
    // زر تسجيل الدخول
    const loginBtn = userInfo.querySelector('#login-header-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // فتح نافذة تسجيل الدخول
            if (window.AuthSystem && typeof window.AuthSystem.showAuthModal === 'function') {
                window.AuthSystem.showAuthModal();
            }
        });
    }
    
    // الملف الشخصي
    const profileBtn = userInfo.querySelector('#profile-btn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showBasicProfileModal(currentUser);
            userInfo.classList.remove('active');
        });
    }
    
    // تغيير كلمة المرور
    const changePasswordBtn = userInfo.querySelector('#change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showBasicChangePasswordModal();
            userInfo.classList.remove('active');
        });
    }
    
    // تسجيل الخروج
    const logoutBtn = userInfo.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // تأكيد تسجيل الخروج
            if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
                // تسجيل الخروج
                if (window.AuthSystem && typeof window.AuthSystem.logout === 'function') {
                    window.AuthSystem.logout()
                        .then(() => {
                            console.log('تم تسجيل الخروج بنجاح');
                            // إعادة تحميل الصفحة
                            window.location.reload();
                        })
                        .catch(error => {
                            console.error('خطأ في تسجيل الخروج:', error);
                            alert('حدث خطأ أثناء تسجيل الخروج');
                        });
                }
            }
            
            userInfo.classList.remove('active');
        });
    }
}

/**
 * عرض نافذة الملف الشخصي الأساسية
 * @param {Object} currentUser - كائن المستخدم الحالي
 */
function showBasicProfileModal(currentUser) {
    if (!currentUser) return;
    
    // التحقق من وجود النافذة
    let profileModal = document.getElementById('basic-profile-modal');
    
    if (!profileModal) {
        // إنشاء عنصر النافذة
        profileModal = document.createElement('div');
        profileModal.id = 'basic-profile-modal';
        profileModal.className = 'modal-overlay';
        
        profileModal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">الملف الشخصي</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                
                <div class="profile-avatar">
                        <div class="avatar-circle">
                            ${currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div class="profile-info">
                            <h3>${currentUser.displayName || 'المستخدم'}</h3>
                            <p class="user-type-badge ${currentUser.type}">${getUserTypeLabel(currentUser.type)}</p>
                        </div>
                    </div>
                    
                    <form id="profile-form">
                        <div class="form-group">
                            <label class="form-label">البريد الإلكتروني</label>
                            <input type="email" class="form-input" value="${currentUser.email}" readonly>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">الاسم الكامل</label>
                            <input type="text" class="form-input" id="profile-fullname" value="${currentUser.displayName || ''}">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-close-btn">إلغاء</button>
                    <button class="btn btn-primary" id="save-profile-btn">حفظ التغييرات</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(profileModal);
        
        // إضافة مستمعي الأحداث
        setupBasicModalListeners(profileModal);
        
        // مستمع حدث لزر حفظ الملف الشخصي
        const saveProfileBtn = profileModal.querySelector('#save-profile-btn');
        if (saveProfileBtn) {
            saveProfileBtn.addEventListener('click', function() {
                const fullNameInput = document.getElementById('profile-fullname');
                
                if (!fullNameInput) {
                    alert('خطأ: حقل الاسم غير موجود');
                    return;
                }
                
                const fullName = fullNameInput.value.trim();
                
                if (!fullName) {
                    alert('يرجى إدخال الاسم الكامل');
                    return;
                }
                
                // تحديث اسم العرض
                if (window.firebase && firebase.auth().currentUser) {
                    firebase.auth().currentUser.updateProfile({
                        displayName: fullName
                    })
                    .then(() => {
                        alert('تم تحديث الملف الشخصي بنجاح');
                        profileModal.classList.remove('active');
                        
                        // تحديث واجهة المستخدم
                        if (currentUser) {
                            currentUser.displayName = fullName;
                            updateUserInfo();
                        }
                    })
                    .catch(error => {
                        console.error('خطأ في تحديث الملف الشخصي:', error);
                        alert('حدث خطأ أثناء تحديث الملف الشخصي');
                    });
                }
            });
        }
    }
    
    // إظهار النافذة
    profileModal.classList.add('active');
}

/**
 * عرض نافذة تغيير كلمة المرور الأساسية
 */
function showBasicChangePasswordModal() {
    // التحقق من وجود النافذة
    let passwordModal = document.getElementById('basic-change-password-modal');
    
    if (!passwordModal) {
        // إنشاء عنصر النافذة
        passwordModal = document.createElement('div');
        passwordModal.id = 'basic-change-password-modal';
        passwordModal.className = 'modal-overlay';
        
        passwordModal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">تغيير كلمة المرور</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="change-password-form">
                        <div class="form-group">
                            <label class="form-label">كلمة المرور الحالية</label>
                            <div class="password-input-container">
                                <input type="password" class="form-input" id="current-password" required>
                                <button type="button" class="toggle-password">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">كلمة المرور الجديدة</label>
                            <div class="password-input-container">
                                <input type="password" class="form-input" id="new-password" required>
                                <button type="button" class="toggle-password">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">تأكيد كلمة المرور الجديدة</label>
                            <div class="password-input-container">
                                <input type="password" class="form-input" id="confirm-new-password" required>
                                <button type="button" class="toggle-password">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-close-btn">إلغاء</button>
                    <button class="btn btn-primary" id="save-password-btn">تغيير كلمة المرور</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(passwordModal);
        
        // إضافة مستمعي الأحداث
        setupBasicModalListeners(passwordModal);
        
        // مستمعي أحداث لأزرار إظهار/إخفاء كلمة المرور
        const togglePasswordButtons = passwordModal.querySelectorAll('.toggle-password');
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
        
        // مستمع حدث لزر حفظ كلمة المرور
        const savePasswordBtn = passwordModal.querySelector('#save-password-btn');
        if (savePasswordBtn) {
            savePasswordBtn.addEventListener('click', function() {
                const currentPasswordInput = document.getElementById('current-password');
                const newPasswordInput = document.getElementById('new-password');
                const confirmNewPasswordInput = document.getElementById('confirm-new-password');
                
                if (!currentPasswordInput || !newPasswordInput || !confirmNewPasswordInput) {
                    alert('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة');
                    return;
                }
                
                const currentPassword = currentPasswordInput.value;
                const newPassword = newPasswordInput.value;
                const confirmNewPassword = confirmNewPasswordInput.value;
                
                if (!currentPassword || !newPassword || !confirmNewPassword) {
                    alert('يرجى إدخال جميع البيانات المطلوبة');
                    return;
                }
                
                if (newPassword.length < 6) {
                    alert('يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل');
                    return;
                }
                
                if (newPassword !== confirmNewPassword) {
                    alert('كلمة المرور الجديدة وتأكيدها غير متطابقين');
                    return;
                }
                
                // تغيير كلمة المرور
                if (window.firebase && firebase.auth().currentUser) {
                    // الحصول على بيانات إعادة المصادقة
                    const credential = firebase.auth.EmailAuthProvider.credential(
                        firebase.auth().currentUser.email,
                        currentPassword
                    );
                    
                    // إعادة المصادقة
                    firebase.auth().currentUser.reauthenticateWithCredential(credential)
                        .then(() => {
                            // تغيير كلمة المرور
                            return firebase.auth().currentUser.updatePassword(newPassword);
                        })
                        .then(() => {
                            alert('تم تغيير كلمة المرور بنجاح');
                            passwordModal.classList.remove('active');
                        })
                        .catch(error => {
                            console.error('خطأ في تغيير كلمة المرور:', error);
                            
                            let errorMessage = 'حدث خطأ أثناء تغيير كلمة المرور';
                            
                            if (error.code === 'auth/wrong-password') {
                                errorMessage = 'كلمة المرور الحالية غير صحيحة';
                            } else if (error.code === 'auth/weak-password') {
                                errorMessage = 'كلمة المرور الجديدة ضعيفة جداً';
                            }
                            
                            alert(errorMessage);
                        });
                }
            });
        }
    }
    
    // إظهار النافذة
    passwordModal.classList.add('active');
}

/**
 * إضافة مستمعي الأحداث للنافذة المنبثقة
 * @param {HTMLElement} modal - عنصر النافذة
 */
function setupBasicModalListeners(modal) {
    if (!modal) return;
    
    // إغلاق النافذة عند النقر على زر الإغلاق
    const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    });
    
    // إغلاق النافذة عند النقر خارجها
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

/**
 * الحصول على تسمية نوع المستخدم
 * @param {string} userType - نوع المستخدم
 * @returns {string} - تسمية نوع المستخدم
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
 * تحديث معلومات المستخدم في واجهة المستخدم
 */
function updateUserInfo() {
    // الحصول على معلومات المستخدم الحالي
    let currentUser = null;
    if (window.AuthSystem && typeof window.AuthSystem.getUserInfo === 'function') {
        currentUser = window.AuthSystem.getUserInfo();
    }
    
    if (!currentUser) return;
    
    // تحديث اسم المستخدم في القائمة المنسدلة
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(element => {
        element.textContent = currentUser.displayName || currentUser.email;
    });
    
    // تحديث أيقونة المستخدم
    const userAvatars = document.querySelectorAll('.user-avatar:not(.large)');
    userAvatars.forEach(avatar => {
        avatar.textContent = (currentUser.displayName || currentUser.email).charAt(0).toUpperCase();
    });
    
    // تحديث نوع المستخدم
    const userTypeElements = document.querySelectorAll('.user-type');
    userTypeElements.forEach(element => {
        element.textContent = getUserTypeLabel(currentUser.type);
    });
    
    // إضافة فئة المستخدم لعنصر الجسم
    document.body.setAttribute('data-user-type', currentUser.type);
}

/**
 * الانتقال إلى صفحة في التطبيق
 * @param {string} pageName - اسم الصفحة
 */
function navigateToPage(pageName) {
    // إخفاء جميع الصفحات
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // إزالة التنشيط من جميع روابط التنقل
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // عرض الصفحة المطلوبة وتنشيط الرابط المناظر
    const targetPage = document.getElementById(`${pageName}-page`);
    const targetLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
    
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        // إنشاء صفحة جديدة إذا لم تكن موجودة
        createPage(pageName);
    }
    
    if (targetLink) {
        targetLink.classList.add('active');
    }
}

/**
 * إنشاء صفحة جديدة
 * @param {string} pageName - اسم الصفحة
 */
function createPage(pageName) {
    if (pageName === 'user-management') {
        createUserManagementPage();
    }
}

/**
 * إنشاء صفحة إدارة المستخدمين
 */
function createUserManagementPage() {
    // التحقق مما إذا كانت الصفحة موجودة مسبقاً
    if (document.getElementById('user-management-page')) {
        return;
    }
    
    // إنشاء عنصر الصفحة
    const page = document.createElement('div');
    page.id = 'user-management-page';
    page.className = 'page user-management-page';
    
    // محتوى الصفحة
    page.innerHTML = `
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
                    <i class="fas fa-plus"></i>
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
                <table id="users-table" class="data-table">
                    <thead>
                        <tr>
                            <th>المعرف</th>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>نوع المستخدم</th>
                            <th>تاريخ الإنشاء</th>
                            <th>الحالة</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colspan="7" class="text-center">جارٍ تحميل بيانات المستخدمين...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // إضافة الصفحة إلى المحتوى الرئيسي
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.appendChild(page);
        
        // إضافة مستمعي الأحداث
        setupUserManagementListeners(page);
        
        // تحميل بيانات المستخدمين
        loadUsers();
    }
    
    // عرض الصفحة
    page.classList.add('active');
}

/**
 * إعداد مستمعي أحداث صفحة إدارة المستخدمين
 * @param {HTMLElement} page - عنصر الصفحة
 */
function setupUserManagementListeners(page) {
    if (!page) return;
    
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
            loadUsers();
        });
    }
    
    // مربع البحث
    const searchInput = page.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterUsers(this.value);
        });
    }
    
    // زر تبديل الشريط الجانبي
    const toggleSidebarBtn = page.querySelector('.toggle-sidebar');
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            document.body.classList.toggle('sidebar-collapsed');
        });
    }
}

/**
 * تحميل بيانات المستخدمين
 */
function loadUsers() {
    const usersTableBody = document.querySelector('#users-table tbody');
    if (!usersTableBody) return;
    
    // عرض رسالة التحميل
    usersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">جارٍ تحميل بيانات المستخدمين...</td></tr>';
    
    // الحصول على بيانات المستخدمين من قاعدة البيانات
    if (window.firebase && window.firebase.database) {
        firebase.database().ref('users').once('value')
            .then(snapshot => {
                const users = [];
                
                // جمع المستخدمين
                snapshot.forEach(childSnapshot => {
                    const userId = childSnapshot.key;
                    const userData = childSnapshot.val();
                    
                    if (userData && userData.profile) {
                        users.push({
                            id: userId,
                            ...userData.profile
                        });
                    }
                });
                
                // عرض المستخدمين في الجدول
                renderUsersTable(users);
            })
            .catch(error => {
                console.error('خطأ في تحميل المستخدمين:', error);
                usersTableBody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">خطأ في تحميل بيانات المستخدمين</td></tr>';
            });
    } else {
        // عرض بيانات تجريبية للعرض
        const demoUsers = [
            {
                id: 'admin1',
                email: 'admin@example.com',
                displayName: 'مدير النظام',
                type: 'admin',
                createdAt: '2023-01-01T00:00:00.000Z',
                emailVerified: true
            },
            {
                id: 'manager1',
                email: 'manager@example.com',
                displayName: 'مدير',
                type: 'manager',
                createdAt: '2023-02-15T00:00:00.000Z',
                emailVerified: true
            },
            {
                id: 'user1',
                email: 'user@example.com',
                displayName: 'مستخدم عادي',
                type: 'user',
                createdAt: '2023-03-20T00:00:00.000Z',
                emailVerified: false
            }
        ];
        
        renderUsersTable(demoUsers);
    }
}

/**
 * عرض المستخدمين في الجدول
 * @param {Array} users - مصفوفة المستخدمين
 */
function renderUsersTable(users) {
    const usersTableBody = document.querySelector('#users-table tbody');
    if (!usersTableBody) return;
    
    if (!users || users.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">لا يوجد مستخدمين</td></tr>';
        return;
    }
    
    // تفريغ الجدول
    usersTableBody.innerHTML = '';
    
    // إضافة المستخدمين
    users.forEach(user => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', user.id);
        row.setAttribute('data-email', user.email);
        row.setAttribute('data-type', user.type || 'user');
        
        // تنسيق التاريخ
        const createdDate = user.createdAt ? new Date(user.createdAt) : new Date();
        const formattedDate = createdDate.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // إنشاء محتوى الصف
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.displayName || 'غير محدد'}</td>
            <td>${user.email}</td>
            <td><span class="badge ${user.type || 'user'}">${getUserTypeLabel(user.type || 'user')}</span></td>
            <td>${formattedDate}</td>
            <td>${user.emailVerified ? '<span class="badge success">موثق</span>' : '<span class="badge warning">غير موثق</span>'}</td>
            <td class="action-buttons">
                <button class="btn btn-icon-sm edit-user-btn" title="تعديل">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-icon-sm permissions-user-btn" title="الصلاحيات">
                    <i class="fas fa-key"></i>
                </button>
                <button class="btn btn-icon-sm delete-user-btn" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        // إضافة مستمعي الأحداث للأزرار
        const editBtn = row.querySelector('.edit-user-btn');
        if (editBtn) {
            editBtn.addEventListener('click', function() {
                showEditUserModal(user);
            });
        }
        
        const permissionsBtn = row.querySelector('.permissions-user-btn');
        if (permissionsBtn) {
            permissionsBtn.addEventListener('click', function() {
                showUserPermissionsModal(user);
            });
        }
        
        const deleteBtn = row.querySelector('.delete-user-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function() {
                confirmDeleteUser(user);
            });
        }
        
        usersTableBody.appendChild(row);
    });
}

/**
 * تصفية المستخدمين حسب نص البحث
 * @param {string} searchText - نص البحث
 */
function filterUsers(searchText) {
    const rows = document.querySelectorAll('#users-table tbody tr');
    const searchLower = searchText.toLowerCase();
    
    rows.forEach(row => {
        const email = row.getAttribute('data-email') || '';
        const name = row.querySelector('td:nth-child(2)').textContent || '';
        
        if (email.toLowerCase().includes(searchLower) || name.toLowerCase().includes(searchLower)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * عرض نافذة إضافة مستخدم جديد
 */
function showAddUserModal() {
    // التحقق من وجود النافذة
    let addUserModal = document.getElementById('add-user-modal');
    
    if (!addUserModal) {
        // إنشاء عنصر النافذة
        addUserModal = document.createElement('div');
        addUserModal.id = 'add-user-modal';
        addUserModal.className = 'modal-overlay';
        
        addUserModal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">إضافة مستخدم جديد</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="add-user-form">
                        <div class="form-group">
                            <label class="form-label">البريد الإلكتروني</label>
                            <input type="email" class="form-input" id="new-user-email" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">الاسم الكامل</label>
                            <input type="text" class="form-input" id="new-user-name" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">كلمة المرور</label>
                            <div class="password-input-container">
                                <input type="password" class="form-input" id="new-user-password" required>
                                <button type="button" class="toggle-password">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">نوع المستخدم</label>
                            <select class="form-select" id="new-user-type">
                                <option value="user">مستخدم عادي</option>
                                <option value="manager">مدير</option>
                                <option value="admin">مسؤول النظام</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-close-btn">إلغاء</button>
                    <button class="btn btn-primary" id="save-new-user-btn">إضافة المستخدم</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(addUserModal);
        
        // إضافة مستمعي الأحداث
        setupBasicModalListeners(addUserModal);
        
        // مستمع حدث لزر حفظ المستخدم الجديد
        const saveNewUserBtn = addUserModal.querySelector('#save-new-user-btn');
        if (saveNewUserBtn) {
            saveNewUserBtn.addEventListener('click', function() {
                // الحصول على قيم الحقول
                const email = document.getElementById('new-user-email').value;
                const name = document.getElementById('new-user-name').value;
                const password = document.getElementById('new-user-password').value;
                const type = document.getElementById('new-user-type').value;
                
                // التحقق من البيانات
                if (!email || !name || !password) {
                    alert('يرجى إدخال جميع البيانات المطلوبة');
                    return;
                }
                
                if (password.length < 6) {
                    alert('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
                    return;
                }
                
                // إضافة المستخدم
                createNewUser(email, password, name, type)
                    .then(() => {
                        alert('تم إضافة المستخدم بنجاح');
                        addUserModal.classList.remove('active');
                        
                        // تحديث قائمة المستخدمين
                        loadUsers();
                    })
                    .catch(error => {
                        console.error('خطأ في إضافة المستخدم:', error);
                        
                        let errorMessage = 'حدث خطأ أثناء إضافة المستخدم';
                        
                        if (error.code === 'auth/email-already-in-use') {
                            errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
                        } else if (error.code === 'auth/invalid-email') {
                            errorMessage = 'البريد الإلكتروني غير صحيح';
                       } else if (error.code === 'auth/weak-password') {
                           errorMessage = 'كلمة المرور ضعيفة جداً';
                       }
                       
                       alert(errorMessage);
                   });
           });
       }
       
       // مستمع حدث لزر إظهار/إخفاء كلمة المرور
       const togglePasswordBtn = addUserModal.querySelector('.toggle-password');
       if (togglePasswordBtn) {
           togglePasswordBtn.addEventListener('click', function() {
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
   }
   
   // إظهار النافذة
   addUserModal.classList.add('active');
}

/**
* إنشاء مستخدم جديد
* @param {string} email - البريد الإلكتروني
* @param {string} password - كلمة المرور
* @param {string} name - الاسم الكامل
* @param {string} type - نوع المستخدم
* @returns {Promise} - وعد بإنشاء المستخدم
*/
function createNewUser(email, password, name, type) {
   return new Promise((resolve, reject) => {
       // التحقق من وجود firebase
       if (!window.firebase || !firebase.auth) {
           reject(new Error('نظام المصادقة غير موجود'));
           return;
       }
       
       // إنشاء المستخدم باستخدام Firebase Admin SDK (هذا مجرد مثال)
       // في الواقع، يجب أن يتم ذلك من خلال خادم backend لأسباب أمنية
       // هنا نستخدم طريقة بديلة للعرض فقط
       firebase.auth().createUserWithEmailAndPassword(email, password)
           .then(userCredential => {
               const user = userCredential.user;
               
               // تحديث الملف الشخصي
               return user.updateProfile({
                   displayName: name
               }).then(() => user);
           })
           .then(user => {
               // إضافة معلومات المستخدم في قاعدة البيانات
               return firebase.database().ref(`users/${user.uid}/profile`).set({
                   email: email,
                   displayName: name,
                   type: type,
                   createdAt: new Date().toISOString(),
                   emailVerified: false,
                   permissions: getDefaultPermissions(type)
               }).then(() => resolve(user));
           })
           .catch(error => {
               console.error('خطأ في إنشاء المستخدم:', error);
               reject(error);
           });
   });
}

/**
* عرض نافذة تعديل مستخدم
* @param {Object} user - كائن المستخدم
*/
function showEditUserModal(user) {
   if (!user) return;
   
   // التحقق من وجود النافذة
   let editUserModal = document.getElementById('edit-user-modal');
   
   if (!editUserModal) {
       // إنشاء عنصر النافذة
       editUserModal = document.createElement('div');
       editUserModal.id = 'edit-user-modal';
       editUserModal.className = 'modal-overlay';
       
       editUserModal.innerHTML = `
           <div class="modal">
               <div class="modal-header">
                   <h3 class="modal-title">تعديل بيانات المستخدم</h3>
                   <button class="modal-close">&times;</button>
               </div>
               <div class="modal-body">
                   <form id="edit-user-form">
                       <input type="hidden" id="edit-user-id">
                       
                       <div class="form-group">
                           <label class="form-label">البريد الإلكتروني</label>
                           <input type="email" class="form-input" id="edit-user-email" readonly>
                       </div>
                       
                       <div class="form-group">
                           <label class="form-label">الاسم الكامل</label>
                           <input type="text" class="form-input" id="edit-user-name" required>
                       </div>
                       
                       <div class="form-group">
                           <label class="form-label">نوع المستخدم</label>
                           <select class="form-select" id="edit-user-type">
                               <option value="user">مستخدم عادي</option>
                               <option value="manager">مدير</option>
                               <option value="admin">مسؤول النظام</option>
                           </select>
                       </div>
                       
                       <div class="form-group">
                           <div class="form-check">
                               <input type="checkbox" class="form-check-input" id="edit-user-verified">
                               <label for="edit-user-verified">حساب موثق</label>
                           </div>
                       </div>
                   </form>
               </div>
               <div class="modal-footer">
                   <button class="btn btn-outline modal-close-btn">إلغاء</button>
                   <button class="btn btn-primary" id="update-user-btn">حفظ التغييرات</button>
               </div>
           </div>
       `;
       
       document.body.appendChild(editUserModal);
       
       // إضافة مستمعي الأحداث
       setupBasicModalListeners(editUserModal);
       
       // مستمع حدث لزر تحديث المستخدم
       const updateUserBtn = editUserModal.querySelector('#update-user-btn');
       if (updateUserBtn) {
           updateUserBtn.addEventListener('click', function() {
               // الحصول على قيم الحقول
               const userId = document.getElementById('edit-user-id').value;
               const name = document.getElementById('edit-user-name').value;
               const type = document.getElementById('edit-user-type').value;
               const verified = document.getElementById('edit-user-verified').checked;
               
               // التحقق من البيانات
               if (!userId || !name) {
                   alert('يرجى إدخال جميع البيانات المطلوبة');
                   return;
               }
               
               // تحديث بيانات المستخدم
               updateUser(userId, name, type, verified)
                   .then(() => {
                       alert('تم تحديث بيانات المستخدم بنجاح');
                       editUserModal.classList.remove('active');
                       
                       // تحديث قائمة المستخدمين
                       loadUsers();
                   })
                   .catch(error => {
                       console.error('خطأ في تحديث بيانات المستخدم:', error);
                       alert('حدث خطأ أثناء تحديث بيانات المستخدم');
                   });
           });
       }
   }
   
   // ملء البيانات
   document.getElementById('edit-user-id').value = user.id;
   document.getElementById('edit-user-email').value = user.email;
   document.getElementById('edit-user-name').value = user.displayName || '';
   document.getElementById('edit-user-type').value = user.type || 'user';
   document.getElementById('edit-user-verified').checked = user.emailVerified || false;
   
   // إظهار النافذة
   editUserModal.classList.add('active');
}

/**
* تحديث بيانات المستخدم
* @param {string} userId - معرف المستخدم
* @param {string} name - الاسم الكامل
* @param {string} type - نوع المستخدم
* @param {boolean} verified - حالة التوثيق
* @returns {Promise} - وعد بتحديث بيانات المستخدم
*/
function updateUser(userId, name, type, verified) {
   return new Promise((resolve, reject) => {
       // التحقق من وجود firebase
       if (!window.firebase || !firebase.database) {
           reject(new Error('قاعدة البيانات غير موجودة'));
           return;
       }
       
       // تحديث بيانات المستخدم
       firebase.database().ref(`users/${userId}/profile`).update({
           displayName: name,
           type: type,
           emailVerified: verified,
           updatedAt: new Date().toISOString()
       })
       .then(() => {
           // تحديث الصلاحيات إذا تغير نوع المستخدم
           return firebase.database().ref(`users/${userId}/profile/permissions`).set(
               getDefaultPermissions(type)
           );
       })
       .then(() => {
           resolve(userId);
       })
       .catch(error => {
           console.error('خطأ في تحديث بيانات المستخدم:', error);
           reject(error);
       });
   });
}

/**
* عرض نافذة صلاحيات المستخدم
* @param {Object} user - كائن المستخدم
*/
function showUserPermissionsModal(user) {
   if (!user) return;
   
   // الحصول على صلاحيات المستخدم
   getUserPermissions(user.id)
       .then(permissions => {
           // التحقق من وجود النافذة
           let permissionsModal = document.getElementById('user-permissions-modal');
           
           if (!permissionsModal) {
               // إنشاء عنصر النافذة
               permissionsModal = document.createElement('div');
               permissionsModal.id = 'user-permissions-modal';
               permissionsModal.className = 'modal-overlay';
               
               permissionsModal.innerHTML = `
                   <div class="modal">
                       <div class="modal-header">
                           <h3 class="modal-title">صلاحيات المستخدم</h3>
                           <button class="modal-close">&times;</button>
                       </div>
                       <div class="modal-body">
                           <div class="user-info-header">
                               <h4>${user.displayName || 'المستخدم'}</h4>
                               <p>${user.email}</p>
                               <p><span class="badge ${user.type || 'user'}">${getUserTypeLabel(user.type || 'user')}</span></p>
                           </div>
                           
                           <form id="user-permissions-form">
                               <input type="hidden" id="permissions-user-id" value="${user.id}">
                               
                               <div class="permission-group">
                                   <h5 class="permission-group-title">إدارة المستخدمين</h5>
                                   <div class="permission-item">
                                       <label for="perm-create-users">إنشاء مستخدمين</label>
                                       <label class="toggle-switch">
                                           <input type="checkbox" id="perm-create-users" ${permissions.canCreateUsers ? 'checked' : ''}>
                                           <span class="toggle-slider"></span>
                                       </label>
                                   </div>
                                   <div class="permission-item">
                                       <label for="perm-delete-users">حذف مستخدمين</label>
                                       <label class="toggle-switch">
                                           <input type="checkbox" id="perm-delete-users" ${permissions.canDeleteUsers ? 'checked' : ''}>
                                           <span class="toggle-slider"></span>
                                       </label>
                                   </div>
                               </div>
                               
                               <div class="permission-group">
                                   <h5 class="permission-group-title">إدارة المستثمرين</h5>
                                   <div class="permission-item">
                                       <label for="perm-delete-investors">حذف مستثمرين</label>
                                       <label class="toggle-switch">
                                           <input type="checkbox" id="perm-delete-investors" ${permissions.canDeleteInvestors ? 'checked' : ''}>
                                           <span class="toggle-slider"></span>
                                       </label>
                                   </div>
                               </div>
                               
                               <div class="permission-group">
                                   <h5 class="permission-group-title">إدارة النظام</h5>
                                   <div class="permission-item">
                                       <label for="perm-manage-settings">إدارة الإعدادات</label>
                                       <label class="toggle-switch">
                                           <input type="checkbox" id="perm-manage-settings" ${permissions.canManageSettings ? 'checked' : ''}>
                                           <span class="toggle-slider"></span>
                                       </label>
                                   </div>
                                   <div class="permission-item">
                                       <label for="perm-export-data">تصدير البيانات</label>
                                       <label class="toggle-switch">
                                           <input type="checkbox" id="perm-export-data" ${permissions.canExportData ? 'checked' : ''}>
                                           <span class="toggle-slider"></span>
                                       </label>
                                   </div>
                                   <div class="permission-item">
                                       <label for="perm-import-data">استيراد البيانات</label>
                                       <label class="toggle-switch">
                                           <input type="checkbox" id="perm-import-data" ${permissions.canImportData ? 'checked' : ''}>
                                           <span class="toggle-slider"></span>
                                       </label>
                                   </div>
                                   <div class="permission-item">
                                       <label for="perm-create-backup">إنشاء نسخة احتياطية</label>
                                       <label class="toggle-switch">
                                           <input type="checkbox" id="perm-create-backup" ${permissions.canCreateBackup ? 'checked' : ''}>
                                           <span class="toggle-slider"></span>
                                       </label>
                                   </div>
                                   <div class="permission-item">
                                       <label for="perm-restore-backup">استعادة نسخة احتياطية</label>
                                       <label class="toggle-switch">
                                           <input type="checkbox" id="perm-restore-backup" ${permissions.canRestoreBackup ? 'checked' : ''}>
                                           <span class="toggle-slider"></span>
                                       </label>
                                   </div>
                               </div>
                           </form>
                       </div>
                       <div class="modal-footer">
                           <button class="btn btn-outline modal-close-btn">إلغاء</button>
                           <button class="btn btn-primary" id="save-permissions-btn">حفظ الصلاحيات</button>
                       </div>
                   </div>
               `;
               
               document.body.appendChild(permissionsModal);
               
               // إضافة مستمعي الأحداث
               setupBasicModalListeners(permissionsModal);
               
               // مستمع حدث لزر حفظ الصلاحيات
               const savePermissionsBtn = permissionsModal.querySelector('#save-permissions-btn');
               if (savePermissionsBtn) {
                   savePermissionsBtn.addEventListener('click', function() {
                       // الحصول على قيم الصلاحيات
                       const userId = document.getElementById('permissions-user-id').value;
                       const updatedPermissions = {
                           canCreateUsers: document.getElementById('perm-create-users').checked,
                           canDeleteUsers: document.getElementById('perm-delete-users').checked,
                           canDeleteInvestors: document.getElementById('perm-delete-investors').checked,
                           canManageSettings: document.getElementById('perm-manage-settings').checked,
                           canExportData: document.getElementById('perm-export-data').checked,
                           canImportData: document.getElementById('perm-import-data').checked,
                           canCreateBackup: document.getElementById('perm-create-backup').checked,
                           canRestoreBackup: document.getElementById('perm-restore-backup').checked
                       };
                       
                       // تحديث صلاحيات المستخدم
                       updateUserPermissions(userId, updatedPermissions)
                           .then(() => {
                               alert('تم تحديث صلاحيات المستخدم بنجاح');
                               permissionsModal.classList.remove('active');
                           })
                           .catch(error => {
                               console.error('خطأ في تحديث صلاحيات المستخدم:', error);
                               alert('حدث خطأ أثناء تحديث صلاحيات المستخدم');
                           });
                   });
               }
           } else {
               // تحديث قيم الصلاحيات
               document.getElementById('permissions-user-id').value = user.id;
               document.getElementById('perm-create-users').checked = permissions.canCreateUsers || false;
               document.getElementById('perm-delete-users').checked = permissions.canDeleteUsers || false;
               document.getElementById('perm-delete-investors').checked = permissions.canDeleteInvestors || false;
               document.getElementById('perm-manage-settings').checked = permissions.canManageSettings || false;
               document.getElementById('perm-export-data').checked = permissions.canExportData || false;
               document.getElementById('perm-import-data').checked = permissions.canImportData || false;
               document.getElementById('perm-create-backup').checked = permissions.canCreateBackup || false;
               document.getElementById('perm-restore-backup').checked = permissions.canRestoreBackup || false;
           }
           
           // تحديث المعلومات
           const userInfoHeader = permissionsModal.querySelector('.user-info-header');
           if (userInfoHeader) {
               userInfoHeader.innerHTML = `
                   <h4>${user.displayName || 'المستخدم'}</h4>
                   <p>${user.email}</p>
                   <p><span class="badge ${user.type || 'user'}">${getUserTypeLabel(user.type || 'user')}</span></p>
               `;
           }
           
           // إظهار النافذة
           permissionsModal.classList.add('active');
       })
       .catch(error => {
           console.error('خطأ في الحصول على صلاحيات المستخدم:', error);
           alert('حدث خطأ أثناء تحميل صلاحيات المستخدم');
       });
}

/**
* الحصول على صلاحيات المستخدم
* @param {string} userId - معرف المستخدم
* @returns {Promise} - وعد بصلاحيات المستخدم
*/
function getUserPermissions(userId) {
   return new Promise((resolve, reject) => {
       // التحقق من وجود firebase
       if (!window.firebase || !firebase.database) {
           // إرجاع صلاحيات افتراضية للعرض
           resolve(getDefaultPermissions('user'));
           return;
       }
       
       // الحصول على بيانات المستخدم
       firebase.database().ref(`users/${userId}/profile`).once('value')
           .then(snapshot => {
               const userData = snapshot.val();
               
               if (userData && userData.permissions) {
                   resolve(userData.permissions);
               } else if (userData && userData.type) {
                   // إذا لم تكن الصلاحيات موجودة، نستخدم الصلاحيات الافتراضية حسب نوع المستخدم
                   resolve(getDefaultPermissions(userData.type));
               } else {
                   // إذا لم تكن البيانات موجودة، نستخدم الصلاحيات الافتراضية للمستخدم العادي
                   resolve(getDefaultPermissions('user'));
               }
           })
           .catch(error => {
               console.error('خطأ في الحصول على صلاحيات المستخدم:', error);
               reject(error);
           });
   });
}

/**
* تحديث صلاحيات المستخدم
* @param {string} userId - معرف المستخدم
* @param {Object} permissions - كائن الصلاحيات
* @returns {Promise} - وعد بتحديث صلاحيات المستخدم
*/
function updateUserPermissions(userId, permissions) {
   return new Promise((resolve, reject) => {
       // التحقق من وجود firebase
       if (!window.firebase || !firebase.database) {
           reject(new Error('قاعدة البيانات غير موجودة'));
           return;
       }
       
       // تحديث صلاحيات المستخدم
       firebase.database().ref(`users/${userId}/profile/permissions`).set(permissions)
           .then(() => {
               resolve(userId);
           })
           .catch(error => {
               console.error('خطأ في تحديث صلاحيات المستخدم:', error);
               reject(error);
           });
   });
}

/**
* تأكيد حذف المستخدم
* @param {Object} user - كائن المستخدم
*/
function confirmDeleteUser(user) {
   if (!user) return;
   
   if (confirm(`هل أنت متأكد من رغبتك في حذف المستخدم "${user.displayName || user.email}"؟ لا يمكن التراجع عن هذا الإجراء.`)) {
       deleteUser(user.id)
           .then(() => {
               alert('تم حذف المستخدم بنجاح');
               
               // تحديث قائمة المستخدمين
               loadUsers();
           })
           .catch(error => {
               console.error('خطأ في حذف المستخدم:', error);
               alert('حدث خطأ أثناء حذف المستخدم');
           });
   }
}

/**
* حذف المستخدم
* @param {string} userId - معرف المستخدم
* @returns {Promise} - وعد بحذف المستخدم
*/
function deleteUser(userId) {
   return new Promise((resolve, reject) => {
       // التحقق من وجود firebase
       if (!window.firebase || !firebase.database) {
           reject(new Error('قاعدة البيانات غير موجودة'));
           return;
       }
       
       // حذف بيانات المستخدم من قاعدة البيانات
       firebase.database().ref(`users/${userId}`).remove()
           .then(() => {
               resolve(userId);
           })
           .catch(error => {
               console.error('خطأ في حذف المستخدم:', error);
               reject(error);
           });
   });
}