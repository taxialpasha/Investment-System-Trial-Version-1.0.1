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
 * عرض نافذة إضافة مستخدم
 */
function showAddUserModal() {
    const modalContent = `
        <div class="modal-header">
            <h3 class="modal-title">إضافة مستخدم جديد</h3>
            <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
            <form id="add-user-form">
                <div class="form-group">
                    <label class="form-label">الاسم الكامل</label>
                    <input type="text" class="form-input" id="user-fullname" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">البريد الإلكتروني</label>
                    <input type="email" class="form-input" id="user-email" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">كلمة المرور</label>
                    <div class="password-input-container">
                        <input type="password" class="form-input" id="user-password" required>
                        <button type="button" class="toggle-password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">تأكيد كلمة المرور</label>
                    <div class="password-input-container">
                        <input type="password" class="form-input" id="user-confirm-password" required>
                        <button type="button" class="toggle-password">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">نوع المستخدم</label>
                    <select class="form-select" id="user-type">
                        <option value="user">مستخدم عادي</option>
                        <option value="manager">مدير</option>
                        <option value="admin">مسؤول</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button class="btn btn-outline modal-close-btn">إلغاء</button>
            <button class="btn btn-primary" id="save-user-btn">إضافة</button>
        </div>
    `;
    
    showModal('add-user-modal', modalContent, function(modal) {
        // إضافة مستمعي أحداث لأزرار إظهار/إخفاء كلمة المرور
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
        
        // مستمع حدث حفظ المستخدم
        const saveUserBtn = modal.querySelector('#save-user-btn');
        if (saveUserBtn) {
            saveUserBtn.addEventListener('click', function() {
                const fullnameInput = document.getElementById('user-fullname');
                const emailInput = document.getElementById('user-email');
                const passwordInput = document.getElementById('user-password');
                const confirmPasswordInput = document.getElementById('user-confirm-password');
                const userTypeSelect = document.getElementById('user-type');
                
                if (!fullnameInput || !emailInput || !passwordInput || !confirmPasswordInput || !userTypeSelect) {
                    showNotification('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'error');
                    return;
                }
                
                const fullName = fullnameInput.value.trim();
                const email = emailInput.value.trim();
                const password = passwordInput.value;
                const confirmPassword = confirmPasswordInput.value;
                const userType = userTypeSelect.value;
                
                if (!fullName || !email || !password || !confirmPassword) {
                    showNotification('يرجى إدخال جميع البيانات المطلوبة', 'error');
                    return;
                }
                
                if (password.length < 6) {
                    showNotification('يجب أن تكون كلمة المرور 6 أحرف على الأقل', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showNotification('كلمة المرور وتأكيدها غير متطابقين', 'error');
                    return;
                }
                
                // التحقق من صلاحية إنشاء مسؤول
                if (userType === USER_TYPES.ADMIN && currentUser.type !== USER_TYPES.ADMIN) {
                    showNotification('ليس لديك صلاحية إنشاء مستخدمين بصلاحيات مسؤول', 'error');
                    return;
                }
                
                // تغيير حالة الزر
                const originalText = this.textContent;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإضافة...';
                this.disabled = true;
                
                // إنشاء المستخدم
                signup(email, password, fullName, ADMIN_CODE, userType)
                    .then(result => {
                        showNotification(`تم إضافة المستخدم ${fullName} بنجاح`, 'success');
                        
                        // تحديث قائمة المستخدمين
                        refreshUsersList();
                        
                        // إغلاق النافذة
                        closeModal('add-user-modal');
                    })
                    .catch(error => {
                        console.error('خطأ في إضافة المستخدم:', error);
                        
                        let errorMessage = 'حدث خطأ أثناء إضافة المستخدم';
                        
                        if (error.code === 'auth/email-already-in-use') {
                            errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
                        } else if (error.code === 'auth/invalid-email') {
                            errorMessage = 'البريد الإلكتروني غير صالح';
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
 * تحديث قائمة المستخدمين
 */
function refreshUsersList() {
    // الحصول على قائمة المستخدمين
    getUsers()
        .then(users => {
            // تحديث جدول المستخدمين
            renderUsersTable(users);
        })
        .catch(error => {
            console.error('خطأ في تحديث قائمة المستخدمين:', error);
            showNotification('حدث خطأ أثناء تحديث قائمة المستخدمين', 'error');
        });
}

/**
 * عرض جدول المستخدمين
 * @param {Array} users - قائمة المستخدمين
 */
function renderUsersTable(users) {
    const tableBody = document.querySelector('#users-table tbody');
    if (!tableBody) return;
    
    // مسح محتوى الجدول
    tableBody.innerHTML = '';
    
    if (!users || users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">لا يوجد مستخدمين</td></tr>';
        return;
    }
    
    // ترتيب المستخدمين حسب تاريخ الإنشاء (الأحدث أولاً)
    const sortedUsers = [...users].sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
    
    // إنشاء صفوف الجدول
    sortedUsers.forEach(user => {
        const row = document.createElement('tr');
        
        // تحديد لون الخلفية حسب نوع المستخدم
        if (user.type === USER_TYPES.ADMIN) {
            row.classList.add('admin-row');
        } else if (user.type === USER_TYPES.MANAGER) {
            row.classList.add('manager-row');
        }
        
      
 // تنسيق التواريخ
 const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleString() : '-';
 const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-';
 
 row.innerHTML = `
     <td>${user.uid.substring(0, this.username)}: 10}</td>
     <td>
         <div class="user-info-cell">
             <div class="user-avatar small">${user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}</div>
             <div>
                 <div class="user-name">${user.fullName || 'مستخدم'}</div>
                 <div class="user-role">${getUserTypeLabel(user.type)}</div>
             </div>
         </div>
     </td>
     <td>${user.email}</td>
     <td><span class="badge badge-${getUserTypeBadgeClass(user.type)}">${getUserTypeLabel(user.type)}</span></td>
     <td>${createdAt}</td>
     <td>${lastLogin}</td>
     <td>
         <div class="actions-cell">
             <button class="btn btn-sm btn-outline edit-user-btn" data-id="${user.uid}" title="تعديل">
                 <i class="fas fa-edit"></i>
             </button>
             <button class="btn btn-sm btn-outline reset-password-btn" data-id="${user.uid}" data-email="${user.email}" title="إعادة تعيين كلمة المرور">
                 <i class="fas fa-key"></i>
             </button>
             ${user.uid !== currentUser.uid ? `
                 <button class="btn btn-sm btn-outline danger delete-user-btn" data-id="${user.uid}" title="حذف">
                     <i class="fas fa-trash"></i>
                 </button>
             ` : ''}
         </div>
     </td>
 `;
 
 tableBody.appendChild(row);
});

// إضافة مستمعي الأحداث للأزرار
setupUserTableActions();
}

/**
* إضافة مستمعي الأحداث لأزرار جدول المستخدمين
*/
function setupUserTableActions() {
// أزرار تعديل المستخدم
const editButtons = document.querySelectorAll('.edit-user-btn');
editButtons.forEach(button => {
 button.addEventListener('click', function() {
     const userId = this.getAttribute('data-id');
     showEditUserModal(userId);
 });
});

// أزرار إعادة تعيين كلمة المرور
const resetPasswordButtons = document.querySelectorAll('.reset-password-btn');
resetPasswordButtons.forEach(button => {
 button.addEventListener('click', function() {
     const userId = this.getAttribute('data-id');
     const userEmail = this.getAttribute('data-email');
     
     if (confirm(`هل أنت متأكد من رغبتك في إعادة تعيين كلمة المرور للمستخدم ${userEmail}؟\nسيتم إرسال رابط إعادة تعيين كلمة المرور إلى البريد الإلكتروني.`)) {
         resetPassword(userEmail)
             .then(() => {
                 showNotification(`تم إرسال رابط إعادة تعيين كلمة المرور إلى ${userEmail}`, 'success');
             })
             .catch(error => {
                 console.error('خطأ في إعادة تعيين كلمة المرور:', error);
                 
                 let errorMessage = 'حدث خطأ أثناء إعادة تعيين كلمة المرور';
                 
                 if (error.code === 'auth/user-not-found') {
                     errorMessage = 'البريد الإلكتروني غير مسجل';
                 } else if (error.code === 'auth/invalid-email') {
                     errorMessage = 'البريد الإلكتروني غير صالح';
                 }
                 
                 showNotification(errorMessage, 'error');
             });
     }
 });
});

// أزرار حذف المستخدم
const deleteButtons = document.querySelectorAll('.delete-user-btn');
deleteButtons.forEach(button => {
 button.addEventListener('click', function() {
     const userId = this.getAttribute('data-id');
     
     if (confirm('هل أنت متأكد من رغبتك في حذف هذا المستخدم؟')) {
         deleteUser(userId)
             .then(() => {
                 showNotification('تم حذف المستخدم بنجاح', 'success');
                 
                 // تحديث قائمة المستخدمين
                 refreshUsersList();
             })
             .catch(error => {
                 console.error('خطأ في حذف المستخدم:', error);
                 
                 let errorMessage = 'حدث خطأ أثناء حذف المستخدم';
                 
                 if (error.message) {
                     errorMessage = error.message;
                 }
                 
                 showNotification(errorMessage, 'error');
             });
     }
 });
});
}

/**
* عرض نافذة تعديل المستخدم
* @param {string} userId - معرف المستخدم
*/
function showEditUserModal(userId) {
// الحصول على بيانات المستخدم
getUserData(userId)
 .then(userData => {
     const modalContent = `
         <div class="modal-header">
             <h3 class="modal-title">تعديل المستخدم</h3>
             <button class="modal-close">&times;</button>
         </div>
         <div class="modal-body">
             <form id="edit-user-form">
                 <input type="hidden" id="edit-user-id" value="${userId}">
                 
                 <div class="form-group">
                     <label class="form-label">الاسم الكامل</label>
                     <input type="text" class="form-input" id="edit-user-fullname" value="${userData.fullName || ''}" required>
                 </div>
                 
                 <div class="form-group">
                     <label class="form-label">البريد الإلكتروني</label>
                     <input type="email" class="form-input" value="${userData.email}" readonly>
                 </div>
                 
                 <div class="form-group">
                     <label class="form-label">نوع المستخدم</label>
                     <select class="form-select" id="edit-user-type" ${currentUser.type !== USER_TYPES.ADMIN && userData.type === USER_TYPES.ADMIN ? 'disabled' : ''}>
                         <option value="user" ${userData.type === USER_TYPES.USER ? 'selected' : ''}>مستخدم عادي</option>
                         <option value="manager" ${userData.type === USER_TYPES.MANAGER ? 'selected' : ''}>مدير</option>
                         <option value="admin" ${userData.type === USER_TYPES.ADMIN ? 'selected' : ''}>مسؤول</option>
                     </select>
                     ${currentUser.type !== USER_TYPES.ADMIN && userData.type === USER_TYPES.ADMIN ? '<small class="text-danger">لا يمكنك تغيير نوع المستخدم المسؤول</small>' : ''}
                 </div>
             </form>
         </div>
         <div class="modal-footer">
             <button class="btn btn-outline modal-close-btn">إلغاء</button>
             <button class="btn btn-primary" id="update-user-btn">حفظ التغييرات</button>
         </div>
     `;
     
     showModal('edit-user-modal', modalContent, function(modal) {
         // مستمع حدث تحديث المستخدم
         const updateUserBtn = modal.querySelector('#update-user-btn');
         if (updateUserBtn) {
             updateUserBtn.addEventListener('click', function() {
                 const fullnameInput = document.getElementById('edit-user-fullname');
                 const userTypeSelect = document.getElementById('edit-user-type');
                 
                 if (!fullnameInput || !userTypeSelect) {
                     showNotification('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'error');
                     return;
                 }
                 
                 const fullName = fullnameInput.value.trim();
                 const userType = userTypeSelect.value;
                 
                 if (!fullName) {
                     showNotification('يرجى إدخال الاسم الكامل', 'error');
                     return;
                 }
                 
                 // تغيير حالة الزر
                 const originalText = this.textContent;
                 this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
                 this.disabled = true;
                 
                 // تحديث بيانات المستخدم
                 const updatedData = {
                     fullName: fullName,
                     type: userType
                 };
                 
                 updateUserData(userId, updatedData)
                     .then(() => {
                         showNotification('تم تحديث بيانات المستخدم بنجاح', 'success');
                         
                         // تحديث قائمة المستخدمين
                         refreshUsersList();
                         
                         // إغلاق النافذة
                         closeModal('edit-user-modal');
                     })
                     .catch(error => {
                         console.error('خطأ في تحديث بيانات المستخدم:', error);
                         
                         let errorMessage = 'حدث خطأ أثناء تحديث بيانات المستخدم';
                         
                         if (error.message) {
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
 })
 .catch(error => {
     console.error('خطأ في الحصول على بيانات المستخدم:', error);
     showNotification('حدث خطأ أثناء الحصول على بيانات المستخدم', 'error');
 });
}

/**
* تصفية المستخدمين حسب النوع
* @param {string} filterType - نوع التصفية
*/
function filterUsers(filterType) {
const tableRows = document.querySelectorAll('#users-table tbody tr');

tableRows.forEach(row => {
 const userTypeCell = row.querySelector('td:nth-child(4) .badge');
 
 if (!userTypeCell) return;
 
 if (filterType === 'all') {
     row.style.display = '';
 } else {
     const userType = userTypeCell.textContent.trim();
     
     if (filterType === 'admin' && getUserTypeLabel(USER_TYPES.ADMIN) === userType) {
         row.style.display = '';
     } else if (filterType === 'manager' && getUserTypeLabel(USER_TYPES.MANAGER) === userType) {
         row.style.display = '';
     } else if (filterType === 'user' && getUserTypeLabel(USER_TYPES.USER) === userType) {
         row.style.display = '';
     } else {
         row.style.display = 'none';
     }
 }
});
}

/**
* البحث في المستخدمين
* @param {string} query - نص البحث
*/
function searchUsers(query) {
query = query.trim().toLowerCase();

if (!query) {
 // إذا كان البحث فارغًا، نعيد تحديث التصفية
 const activeFilter = document.querySelector('#users-page .btn-group .btn.active');
 if (activeFilter) {
     const filterType = activeFilter.getAttribute('data-filter');
     filterUsers(filterType);
 } else {
     filterUsers('all');
 }
 return;
}

const tableRows = document.querySelectorAll('#users-table tbody tr');

tableRows.forEach(row => {
 const fullNameCell = row.querySelector('td:nth-child(2) .user-name');
 const emailCell = row.querySelector('td:nth-child(3)');
 
 if (!fullNameCell || !emailCell) return;
 
 const fullName = fullNameCell.textContent.trim().toLowerCase();
 const email = emailCell.textContent.trim().toLowerCase();
 
 if (fullName.includes(query) || email.includes(query)) {
     row.style.display = '';
 } else {
     row.style.display = 'none';
 }
});
}

/**
* الحصول على فئة شارة نوع المستخدم
* @param {string} userType - نوع المستخدم
* @returns {string} - فئة الشارة
*/
function getUserTypeBadgeClass(userType) {
switch (userType) {
 case USER_TYPES.ADMIN:
     return 'danger';
 case USER_TYPES.MANAGER:
     return 'warning';
 case USER_TYPES.USER:
     return 'info';
 default:
     return 'secondary';
}
}

/**
* إضافة مستمع حدث للتحقق من تسجيل الدخول قبل تنفيذ أي عملية
*/
function setupAuthCheckInterceptor() {
// إضافة مستمع حدث لكل النقرات
document.addEventListener('click', function(e) {
 // إذا كان المستخدم مسجل الدخول، نسمح بالعملية
 if (currentUser) return;
 
 // التحقق مما إذا كان النقر على عنصر فعال
 const actionElement = e.target.closest('button:not(.auth-related), a:not(.auth-related), .clickable:not(.auth-related)');
 
 if (!actionElement) return;
 
 // التحقق مما إذا كان العنصر داخل شاشة تسجيل الدخول
 if (e.target.closest('#auth-login-screen')) return;
 
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
* إضافة طبقة أمان للتحقق من تسجيل الدخول على مستوى الصفحة
*/
function addSecurityLayer() {
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
     if (firebase.auth().currentUser) {
         // المستخدم مازال مسجل الدخول
     } else {
         // المستخدم غير مسجل الدخول، نعرض شاشة تسجيل الدخول
         showLoginScreen();
     }
 }
});
}

/**
* تفعيل القفل التلقائي بعد فترة خمول
* @param {number} idleTime - فترة الخمول بالدقائق
*/
function setupAutoLock(idleTime = 30) {
let idleTimer;
const idleTimeoutMs = idleTime * 60 * 1000; // تحويل الدقائق إلى مللي ثانية

// إعادة تعيين عداد الخمول
function resetIdleTimer() {
 clearTimeout(idleTimer);
 idleTimer = setTimeout(lockScreen, idleTimeoutMs);
}

// قفل الشاشة
function lockScreen() {
 // التحقق من تسجيل الدخول
 if (currentUser) {
     // عرض شاشة قفل الشاشة
     showLockScreen();
 }
}

// إضافة مستمعي الأحداث لإعادة تعيين عداد الخمول
['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
 document.addEventListener(event, resetIdleTimer);
});

// تشغيل عداد الخمول
resetIdleTimer();
}


/**
* إضافة مستمعي الأحداث لشاشة القفل
* @param {HTMLElement} lockScreen - عنصر شاشة القفل
*/
function setupLockScreenListeners(lockScreen) {
// مستمع حدث إلغاء القفل
const unlockForm = lockScreen.querySelector('#unlock-form');
if (unlockForm) {
 unlockForm.addEventListener('submit', function(e) {
     e.preventDefault();
     
     const passwordInput = document.getElementById('unlock-password');
     
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
     const originalText = submitButton.textContent;
     submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحقق...';
     submitButton.disabled = true;
     
     // إعادة المصادقة
     const credential = firebase.auth.EmailAuthProvider.credential(currentUser.email, password);
     firebase.auth().currentUser.reauthenticateWithCredential(credential)
         .then(() => {
             // إخفاء شاشة القفل
             lockScreen.style.display = 'none';
             
             // إظهار المحتوى الرئيسي
             const appContent = document.querySelector('.layout');
             if (appContent) {
                 appContent.style.display = 'flex';
             }
             
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

// مستمع حدث تسجيل الخروج
const logoutBtn = lockScreen.querySelector('#logout-from-lock');
if (logoutBtn) {
 logoutBtn.addEventListener('click', function() {
     logout()
         .then(() => {
             showNotification('تم تسجيل الخروج بنجاح', 'success');
         })
         .catch(error => {
             console.error('خطأ في تسجيل الخروج:', error);
             showNotification('حدث خطأ أثناء تسجيل الخروج', 'error');
         });
 });
}

// مستمع حدث لزر إظهار/إخفاء كلمة المرور
const togglePasswordBtn = lockScreen.querySelector('.toggle-password');
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

/**
* إنشاء صفحة سجل الأحداث
*/
function createActivityLogPage() {
// التحقق من وجود صفحة سجل الأحداث
if (document.getElementById('logs-page')) {
 return;
}

// إنشاء صفحة سجل الأحداث
const logsPage = document.createElement('div');
logsPage.id = 'logs-page';
logsPage.className = 'page admin-only';

logsPage.innerHTML = `
 <div class="header">
     <button class="toggle-sidebar">
         <i class="fas fa-bars"></i>
     </button>
     <h1 class="page-title">سجل الأحداث</h1>
     <div class="header-actions">
         <div class="search-box">
             <input class="search-input" placeholder="بحث في السجل..." type="text" />
             <i class="fas fa-search search-icon"></i>
         </div>
         <div class="btn-group">
             <button class="btn btn-outline active" data-filter="all">الكل</button>
             <button class="btn btn-outline" data-filter="auth">المصادقة</button>
             <button class="btn btn-outline" data-filter="investors">المستثمرين</button>
             <button class="btn btn-outline" data-filter="transactions">العمليات</button>
             <button class="btn btn-outline" data-filter="users">المستخدمين</button>
         </div>
     </div>
 </div>
 <div class="section">
     <div class="table-container">
         <table id="logs-table">
             <thead>
                 <tr>
                     <th>التاريخ والوقت</th>
                     <th>المستخدم</th>
                     <th>الحدث</th>
                     <th>النوع</th>
                     <th>التفاصيل</th>
                 </tr>
             </thead>
             <tbody>
                 <!-- سيتم ملؤها ديناميكيًا -->
             </tbody>
         </table>
     </div>
     <div class="pagination">
         <button class="btn btn-sm btn-outline prev-page-btn" disabled>
             <i class="fas fa-chevron-right"></i>
             <span>السابق</span>
         </button>
         <div class="page-info">
             الصفحة <span id="current-page">1</span> من <span id="total-pages">1</span>
         </div>
         <button class="btn btn-sm btn-outline next-page-btn" disabled>
             <span>التالي</span>
             <i class="fas fa-chevron-left"></i>
         </button>
     </div>
 </div>
`;

// إضافة الصفحة للمحتوى الرئيسي
const mainContent = document.querySelector('.main-content');
if (mainContent) {
 mainContent.appendChild(logsPage);
}

// إضافة مستمعي الأحداث للصفحة
setupActivityLogListeners();

// إضافة رابط الصفحة إلى القائمة الجانبية
addActivityLogNavLink();
}

/**
* إضافة رابط سجل الأحداث إلى القائمة الجانبية
*/
function addActivityLogNavLink() {
// التحقق من وجود رابط سجل الأحداث
if (document.querySelector('a[data-page="logs"]')) {
 return;
}

// البحث عن قائمة الروابط
const navList = document.querySelector('.nav-list');
if (!navList) {
 return;
}

// إنشاء عنصر الرابط
const navItem = document.createElement('li');
navItem.className = 'nav-item admin-only';

navItem.innerHTML = `
 <a class="nav-link" data-page="logs" href="#">
     <div class="nav-icon">
         <i class="fas fa-history"></i>
     </div>
     <span>سجل الأحداث</span>
 </a>
`;

// إضافة الرابط قبل رابط الإعدادات
const settingsNavItem = document.querySelector('a[data-page="settings"]').parentNode;
if (settingsNavItem) {
 navList.insertBefore(navItem, settingsNavItem);
} else {
 navList.appendChild(navItem);
}


// إضافة مستمع حدث للرابط
const navLink = navItem.querySelector('.nav-link');
if (navLink) {
    navLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // إزالة الكلاس النشط من جميع الروابط
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        
        // إضافة الكلاس النشط للرابط المحدد
        this.classList.add('active');
        
        // إظهار صفحة سجل الأحداث
        showPage('logs');
        
        // تحميل سجل الأحداث
        loadActivityLogs();
    });
}
}

/**
 * إضافة مستمعي الأحداث لصفحة سجل الأحداث
 */
function setupActivityLogListeners() {
    // أزرار التصفية
    const filterButtons = document.querySelectorAll('#logs-page .btn-group .btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // تحديث الزر النشط
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // تصفية السجلات
                const filterType = this.getAttribute('data-filter');
                filterLogs(filterType);
            });
        });
    }
    
    // البحث في السجلات
    const searchInput = document.querySelector('#logs-page .search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchLogs(this.value);
        });
    }
    
    // أزرار الصفحات
    const prevPageBtn = document.querySelector('#logs-page .prev-page-btn');
    const nextPageBtn = document.querySelector('#logs-page .next-page-btn');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (this.disabled) return;
            currentLogsPage--;
            loadActivityLogs(currentLogsPage);
        });
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            if (this.disabled) return;
            currentLogsPage++;
            loadActivityLogs(currentLogsPage);
        });
    }
}

// متغيرات صفحات سجل الأحداث
let currentLogsPage = 1;
let logsPerPage = 20;
let totalLogsPages = 1;
let logsCache = {};

/**
 * تحميل سجل الأحداث
 * @param {number} page - رقم الصفحة
 */
function loadActivityLogs(page = 1) {
    // التحقق من الصلاحيات
    if (!currentUser || currentUser.type !== USER_TYPES.ADMIN) {
        showNotification('ليس لديك صلاحية عرض سجل الأحداث', 'error');
        return;
    }
    
    // تحديث عنصر عرض الصفحة الحالية
    const currentPageElement = document.getElementById('current-page');
    if (currentPageElement) {
        currentPageElement.textContent = page;
    }
    
    // تحديث حالة أزرار الانتقال بين الصفحات
    updatePaginationButtons(page);
    
    // جلب السجلات من ذاكرة التخزين المؤقت إذا كانت متاحة
    if (logsCache[page]) {
        renderLogs(logsCache[page]);
        return;
    }
    
    // عرض شاشة التحميل
    const tableBody = document.querySelector('#logs-table tbody');
    if (tableBody) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center"><div class="loader"></div></td></tr>';
    }
    
    // تحميل السجلات من Firebase
    Promise.all([
        databaseRef.ref('system_logs/authentication').orderByChild('timestamp').limitToLast(logsPerPage * page).once('value'),
        databaseRef.ref('system_logs/investors').orderByChild('timestamp').limitToLast(logsPerPage * page).once('value'),
        databaseRef.ref('system_logs/transactions').orderByChild('timestamp').limitToLast(logsPerPage * page).once('value'),
        databaseRef.ref('system_logs/users').orderByChild('timestamp').limitToLast(logsPerPage * page).once('value'),
        databaseRef.ref('system_logs/system').orderByChild('timestamp').limitToLast(logsPerPage * page).once('value')
    ])
    .then(([authSnapshot, investorsSnapshot, transactionsSnapshot, usersSnapshot, systemSnapshot]) => {
        // تجميع السجلات من جميع الأنواع
        const logs = [];
        
        // إضافة السجلات مع تحديد النوع
        addLogsFromSnapshot(logs, authSnapshot, 'auth');
        addLogsFromSnapshot(logs, investorsSnapshot, 'investors');
        addLogsFromSnapshot(logs, transactionsSnapshot, 'transactions');
        addLogsFromSnapshot(logs, usersSnapshot, 'users');
        addLogsFromSnapshot(logs, systemSnapshot, 'system');
        
        // ترتيب السجلات حسب التاريخ (الأحدث أولاً)
        logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // تقسيم السجلات إلى صفحات
        const totalLogs = logs.length;
        totalLogsPages = Math.ceil(totalLogs / logsPerPage);
        
        // تحديث عنصر عرض إجمالي الصفحات
        const totalPagesElement = document.getElementById('total-pages');
        if (totalPagesElement) {
            totalPagesElement.textContent = totalLogsPages;
        }
        
        // تحديث حالة أزرار الانتقال بين الصفحات
        updatePaginationButtons(page);
        
        // تحديد السجلات للصفحة الحالية
        const startIndex = (page - 1) * logsPerPage;
        const endIndex = Math.min(startIndex + logsPerPage, totalLogs);
        const pageLogs = logs.slice(startIndex, endIndex);
        
        // تخزين السجلات في ذاكرة التخزين المؤقت
        logsCache[page] = pageLogs;
        
        // عرض السجلات
        renderLogs(pageLogs);
    })
    .catch(error => {
        console.error('خطأ في تحميل سجل الأحداث:', error);
        
        const tableBody = document.querySelector('#logs-table tbody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">حدث خطأ أثناء تحميل السجلات</td></tr>';
        }
    });
}

/**
 * إضافة السجلات من Snapshot إلى المصفوفة
 * @param {Array} logs - مصفوفة السجلات
 * @param {Object} snapshot - الـ Snapshot من Firebase
 * @param {string} type - نوع السجلات
 */
function addLogsFromSnapshot(logs, snapshot, type) {
    if (!snapshot.exists()) return;
    
    snapshot.forEach(childSnapshot => {
        const log = childSnapshot.val();
        log.id = childSnapshot.key;
        log.logType = type;
        logs.push(log);
    });
}

/**
 * تحديث حالة أزرار الانتقال بين الصفحات
 * @param {number} currentPage - الصفحة الحالية
 */
function updatePaginationButtons(currentPage) {
    const prevPageBtn = document.querySelector('#logs-page .prev-page-btn');
    const nextPageBtn = document.querySelector('#logs-page .next-page-btn');
    
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage <= 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage >= totalLogsPages;
    }
}

/**
 * عرض السجلات في الجدول
 * @param {Array} logs - قائمة السجلات
 */
function renderLogs(logs) {
    const tableBody = document.querySelector('#logs-table tbody');
    if (!tableBody) return;
    
    // مسح محتوى الجدول
    tableBody.innerHTML = '';
    
    if (!logs || logs.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">لا توجد سجلات</td></tr>';
        return;
    }
    
    // إنشاء صفوف الجدول
    logs.forEach(log => {
        const row = document.createElement('tr');
        
        // تنسيق التاريخ
        const timestamp = new Date(log.timestamp).toLocaleString();
        
        // تحديد نوع الحدث وتسميته
        const eventType = getEventType(log.action);
        const logTypeLabel = getLogTypeLabel(log.logType);
        
        // تحديد اسم المستخدم
        const userName = log.userName || log.userEmail || 'مستخدم غير معروف';
        
        row.innerHTML = `
            <td>${timestamp}</td>
            <td>
                <div class="user-info-cell">
                    <div class="user-avatar small">${userName.charAt(0).toUpperCase()}</div>
                    <span>${userName}</span>
                </div>
            </td>
            <td>${eventType}</td>
            <td><span class="badge badge-${getLogTypeBadgeClass(log.logType)}">${logTypeLabel}</span></td>
            <td>
                <button class="btn btn-sm btn-outline view-log-details" data-id="${log.id}" data-type="${log.logType}">
                    <i class="fas fa-info-circle"></i>
                    <span>التفاصيل</span>
                </button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // إضافة مستمعي الأحداث لأزرار عرض التفاصيل
    setupLogDetailsButtons();
}

/**
 * إضافة مستمعي الأحداث لأزرار عرض تفاصيل السجل
 */
function setupLogDetailsButtons() {
    const detailButtons = document.querySelectorAll('.view-log-details');
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            const logId = this.getAttribute('data-id');
            const logType = this.getAttribute('data-type');
            
            showLogDetailsModal(logId, logType);
        });
    });
}

/**
 * عرض نافذة تفاصيل السجل
 * @param {string} logId - معرف السجل
 * @param {string} logType - نوع السجل
 */
function showLogDetailsModal(logId, logType) {
    // جلب تفاصيل السجل من Firebase
    databaseRef.ref(`system_logs/${logType}/${logId}`).once('value')
        .then(snapshot => {
            const log = snapshot.val();
            
            if (!log) {
                showNotification('لم يتم العثور على تفاصيل السجل', 'error');
                return;
            }
            
            // تنسيق التاريخ
            const timestamp = new Date(log.timestamp).toLocaleString();
            
            // تحديد نوع الحدث وتسميته
            const eventType = getEventType(log.action);
            const logTypeLabel = getLogTypeLabel(log.logType || logType);
            
            // تحديد اسم المستخدم
            const userName = log.userName || log.userEmail || 'مستخدم غير معروف';
            
            // تحديد تفاصيل إضافية
            let additionalDetails = '';
            
            if (log.details) {
                additionalDetails = `
                    <div class="log-details-section">
                        <h4>تفاصيل إضافية</h4>
                        <pre>${JSON.stringify(log.details, null, 2)}</pre>
                    </div>
                `;
            }
            
            // إنشاء محتوى النافذة
            const modalContent = `
                <div class="modal-header">
                    <h3 class="modal-title">تفاصيل السجل</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="log-details">
                        <div class="log-header">
                            <div class="log-badge ${getLogTypeBadgeClass(logType)}">${logTypeLabel}</div>
                            <div class="log-timestamp">${timestamp}</div>
                        </div>
                        
                        <div class="log-details-section">
                            <h4>المستخدم</h4>
                            <div class="user-info-detail">
                                <div class="user-avatar medium">${userName.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div class="user-name">${userName}</div>
                                    <div class="user-email">${log.userEmail || ''}</div>
                                    <div class="user-type">${getUserTypeLabel(log.userType || '')}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="log-details-section">
                            <h4>الحدث</h4>
                            <p>${eventType}</p>
                            ${log.entityId ? `<p>المعرف: ${log.entityId}</p>` : ''}
                            ${log.entityType ? `<p>النوع: ${log.entityType}</p>` : ''}
                        </div>
                        
                        ${additionalDetails}
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline modal-close-btn">إغلاق</button>
                </div>
            `;
            
            showModal('log-details-modal', modalContent);
        })
        .catch(error => {
            console.error('خطأ في جلب تفاصيل السجل:', error);
            showNotification('حدث خطأ أثناء جلب تفاصيل السجل', 'error');
        });
}

/**
 * تصفية السجلات حسب النوع
 * @param {string} filterType - نوع التصفية
 */
function filterLogs(filterType) {
    const tableRows = document.querySelectorAll('#logs-table tbody tr');
    
    tableRows.forEach(row => {
        const logTypeCell = row.querySelector('td:nth-child(4) .badge');
        
        if (!logTypeCell) return;
        
        if (filterType === 'all') {
            row.style.display = '';
        } else {
            const logType = getLogTypeFromLabel(logTypeCell.textContent.trim());
            
            if (logType === filterType) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

/**
 * البحث في السجلات
 * @param {string} query - نص البحث
 */
function searchLogs(query) {
    query = query.trim().toLowerCase();
    
    if (!query) {
        // إذا كان البحث فارغًا، نعيد تحديث التصفية
        const activeFilter = document.querySelector('#logs-page .btn-group .btn.active');
        if (activeFilter) {
            const filterType = activeFilter.getAttribute('data-filter');
            filterLogs(filterType);
        } else {
            filterLogs('all');
        }
        return;
    }
    
    const tableRows = document.querySelectorAll('#logs-table tbody tr');
    
    tableRows.forEach(row => {
        const timestamp = row.querySelector('td:nth-child(1)').textContent.trim().toLowerCase();
        const userName = row.querySelector('td:nth-child(2)').textContent.trim().toLowerCase();
        const eventType = row.querySelector('td:nth-child(3)').textContent.trim().toLowerCase();
        const logType = row.querySelector('td:nth-child(4)').textContent.trim().toLowerCase();
        
        if (timestamp.includes(query) || userName.includes(query) || eventType.includes(query) || logType.includes(query)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * الحصول على تسمية نوع الحدث
 * @param {string} action - نوع الحدث
 * @returns {string} - تسمية نوع الحدث
 */
function getEventType(action) {
    switch (action) {
        // أحداث المصادقة
        case 'user_login':
            return 'تسجيل دخول';
        case 'user_logout':
            return 'تسجيل خروج';
        case 'password_changed':
            return 'تغيير كلمة المرور';
        case 'password_reset_requested':
            return 'طلب إعادة تعيين كلمة المرور';
            
        // أحداث المستخدمين
        case 'user_created':
            return 'إنشاء مستخدم جديد';
        case 'user_updated':
            return 'تحديث بيانات مستخدم';
        case 'user_deleted':
            return 'حذف مستخدم';
            
        // أحداث المستثمرين
        case 'investor_created':
            return 'إضافة مستثمر جديد';
        case 'investor_updated':
            return 'تحديث بيانات مستثمر';
        case 'investor_deleted':
            return 'حذف مستثمر';
            
        // أحداث العمليات
        case 'transaction_created':
            return 'إضافة عملية جديدة';
        case 'deposit_added':
            return 'إضافة إيداع';
        case 'withdrawal_added':
            return 'إضافة سحب';
        case 'profit_paid':
            return 'دفع أرباح';
            
        // أحداث النظام
        case 'admin_code_changed':
            return 'تغيير رمز المسؤول';
        case 'settings_updated':
            return 'تحديث إعدادات النظام';
        case 'backup_created':
            return 'إنشاء نسخة احتياطية';
        case 'backup_restored':
            return 'استعادة نسخة احتياطية';
            
        default:
            return action || 'حدث غير معروف';
    }
}

/**
 * الحصول على تسمية نوع السجل
 * @param {string} logType - نوع السجل
 * @returns {string} - تسمية نوع السجل
 */
function getLogTypeLabel(logType) {
    switch (logType) {
        case 'auth':
            return 'المصادقة';
        case 'investors':
            return 'المستثمرين';
        case 'transactions':
            return 'العمليات';
        case 'users':
            return 'المستخدمين';
        case 'system':
            return 'النظام';
        default:
            return 'غير معروف';
    }
}

/**
 * الحصول على نوع السجل من التسمية
 * @param {string} label - تسمية نوع السجل
 * @returns {string} - نوع السجل
 */
function getLogTypeFromLabel(label) {
    switch (label) {
        case 'المصادقة':
            return 'auth';
        case 'المستثمرين':
            return 'investors';
        case 'العمليات':
            return 'transactions';
        case 'المستخدمين':
            return 'users';
        case 'النظام':
            return 'system';
        default:
            return '';
    }
}

/**
 * الحصول على فئة شارة نوع السجل
 * @param {string} logType - نوع السجل
 * @returns {string} - فئة الشارة
 */
function getLogTypeBadgeClass(logType) {
    switch (logType) {
        case 'auth':
            return 'info';
        case 'investors':
            return 'success';
        case 'transactions':
            return 'primary';
        case 'users':
            return 'warning';
        case 'system':
            return 'danger';
        default:
            return 'secondary';
    }
}

/**
 * إعداد المصادقة والأمان للنظام
 */
function setupSecuritySystem() {
    // تهيئة نظام المصادقة
    initialize()
        .then(initialized => {
            console.log('تهيئة نظام المصادقة:', initialized ? 'تمت بنجاح' : 'لم تكتمل');
            
            if (initialized) {
                // إضافة أنماط CSS
                addAuthStyles();
                
                // إنشاء صفحة إدارة المستخدمين
                createUserManagementPage();
                
                // إنشاء صفحة سجل الأحداث
                createActivityLogPage();
                
                // تعديل دوال النظام
                modifySystemFunctions();
                
                // تعديل دالة تحميل البيانات
                modifyLoadDataFunction();
                
                // إضافة طبقة أمان
                addSecurityLayer();
                
                // تفعيل القفل التلقائي
                setupAutoLock();
                
                // إضافة مستمع حدث للتحقق من تسجيل الدخول
                setupAuthCheckInterceptor();
                
                console.log('تم إعداد نظام الأمان بنجاح');
            }
        })
        .catch(error => {
            console.error('خطأ في إعداد نظام الأمان:', error);
        });
}


// تصدير واجهة برمجة التطبيق
const AuthSystem = {
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
    isAdmin: () => currentUser && currentUser.type === USER_TYPES.ADMIN,
    isManager: () => currentUser && (currentUser.type === USER_TYPES.ADMIN || currentUser.type === USER_TYPES.MANAGER),
    hasPermission: (permission) => currentUser && currentUser.permissions && currentUser.permissions[permission],
    USER_TYPES,
    PERMISSIONS
};

// إعداد النظام تلقائيًا عند تحميل الصفحة
window.addEventListener('load', setupSecuritySystem);


