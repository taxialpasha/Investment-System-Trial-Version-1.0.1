/**
 * ملف تكامل النظام الشامل
 * يقوم بدمج وربط جميع مكونات نظام ملف المستخدم المحسن ونظام إدارة المستخدمين
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('بدء تكامل النظام الشامل المحسن...');
    
    // تحميل الأنماط المطلوبة
    loadEnhancedStyles();
    
    // تهيئة مكونات الواجهة الإضافية
    initializeEnhancedComponents();
    
    // ربط النظام بقائمة المستخدمين العلوية
    setupEnhancedUserMenuIntegration();
    
    // تهيئة نظام إدارة المستخدمين (إذا كان المستخدم يملك الصلاحيات المناسبة)
    if (hasUserManagementPermission()) {
        initializeUserManagement();
    }
    
    console.log('تم تكامل النظام الشامل المحسن بنجاح');
});

/**
 * تحميل الأنماط المطلوبة
 */
function loadEnhancedStyles() {
    // تحميل أنماط نظام ملف المستخدم المحسن
    loadStylesheet('user-profile-enhanced-styles.css', 'enhanced-user-profile-styles');
    
    // تحميل أنماط إضافية
    addInlineStyles();
}

/**
 * تحميل ملف أنماط CSS
 * @param {string} href - مسار ملف CSS
 * @param {string} id - معرف العنصر
 */
function loadStylesheet(href, id) {
    // التحقق من وجود الملف مسبقاً
    if (document.getElementById(id)) {
        return;
    }
    
    // إنشاء عنصر رابط CSS
    const linkElement = document.createElement('link');
    linkElement.id = id;
    linkElement.rel = 'stylesheet';
    linkElement.href = href;
    
    // إضافة الملف إلى رأس الصفحة
    document.head.appendChild(linkElement);
    
    console.log(`تم تحميل ملف الأنماط: ${href}`);
}

/**
 * إضافة أنماط CSS مباشرة
 */
function addInlineStyles() {
    // التحقق من وجود الأنماط مسبقاً
    if (document.getElementById('enhanced-inline-styles')) {
        return;
    }
    
    // إنشاء عنصر النمط
    const styleElement = document.createElement('style');
    styleElement.id = 'enhanced-inline-styles';
    
    // إضافة أنماط CSS
    styleElement.textContent = `
        /* تعديلات لتحسين المظهر العام */
        .header-actions {
            display: flex;
            align-items: center;
        }
        
        /* إصلاح تداخل العناصر */
        .user-dropdown-menu {
            z-index: 1000 !important;
        }
        
        /* إخفاء العناصر المقيدة بالصلاحيات */
        [data-permission] {
            display: inherit;
        }
        
        [data-permission].hidden {
            display: none !important;
        }
        
        /* نافذة الملف الشخصي */
        .avatar-circle {
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }
        
        /* المؤشرات والتنبيهات */
        .notification {
            direction: rtl;
            text-align: right;
        }
        
        /* زر الإغلاق في النوافذ المنبثقة */
        .modal-close {
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        }
        
        .modal-close:hover {
            opacity: 1;
        }
    `;
    
    // إضافة الأنماط للصفحة
    document.head.appendChild(styleElement);
    
    console.log('تم إضافة الأنماط الإضافية');
}

/**
 * تهيئة مكونات الواجهة الإضافية
 */
function initializeEnhancedComponents() {
    // تهيئة نظام ملف المستخدم المحسن
    if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.init === 'function') {
        window.EnhancedUserProfile.init();
    } else {
        console.warn('نظام ملف المستخدم المحسن غير متوفر');
        loadScript('user-profile-enhanced.js', 'enhanced-user-profile-script', function() {
            if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.init === 'function') {
                window.EnhancedUserProfile.init();
            }
        });
    }
}

/**
 * ربط النظام بقائمة المستخدمين العلوية
 */
function setupEnhancedUserMenuIntegration() {
    // البحث عن عنصر قائمة المستخدم الحالي
    const existingUserMenuContainer = document.getElementById('user-menu-container');
    
    // إذا كان هناك قائمة مستخدم حالية، نتأكد من وجود العناصر المطلوبة
    if (existingUserMenuContainer) {
        ensureUserMenuHasRequiredElements(existingUserMenuContainer);
    } else {
        // إنشاء حاوية قائمة المستخدم
        createUserMenuContainer();
    }
}

/**
 * التأكد من وجود العناصر المطلوبة في قائمة المستخدم
 * @param {HTMLElement} container - حاوية قائمة المستخدم
 */
function ensureUserMenuHasRequiredElements(container) {
    // التحقق من وجود زر تبديل القائمة
    if (!container.querySelector('.dropdown-toggle')) {
        const currentUser = firebase.auth().currentUser;
        
        if (currentUser) {
            container.innerHTML = `
                <div class="user-info dropdown">
                    <button class="dropdown-toggle">
                        <span class="user-avatar">${(currentUser.displayName || currentUser.email).charAt(0)}</span>
                        <span class="user-name">${currentUser.displayName || currentUser.email.split('@')[0]}</span>
                        <span class="user-type">${getUserTypeLabel(currentUser.type || 'user')}</span>
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
                </div>
            `;
            
            // إضافة مستمعي الأحداث
            setupUserMenuEvents(container);
        }
    }
}

/**
 * إنشاء حاوية قائمة المستخدم
 */
function createUserMenuContainer() {
    // البحث عن حاوية header-actions
    const headerActions = document.querySelector('.header-actions');
    
    if (headerActions) {
        // إنشاء حاوية قائمة المستخدم
        const userMenuContainer = document.createElement('div');
        userMenuContainer.id = 'user-menu-container';
        
        // إضافة الحاوية إلى header-actions
        headerActions.appendChild(userMenuContainer);
        
        // التأكد من وجود العناصر المطلوبة
        ensureUserMenuHasRequiredElements(userMenuContainer);
        
        console.log('تم إنشاء حاوية قائمة المستخدم');
    } else {
        console.warn('لم يتم العثور على عنصر header-actions');
    }
}

/**
 * إضافة مستمعي الأحداث لقائمة المستخدم
 * @param {HTMLElement} container - حاوية قائمة المستخدم
 */
function setupUserMenuEvents(container) {
    // تبديل القائمة المنسدلة
    const dropdownToggle = container.querySelector('.dropdown-toggle');
    const dropdown = container.querySelector('.dropdown');
    
    if (dropdownToggle && dropdown) {
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        });
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target) && dropdown.classList.contains('active')) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    // الملف الشخصي
    const profileBtn = container.querySelector('#profile-btn');
    if (profileBtn && window.EnhancedUserProfile) {
        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.remove('active');
            window.EnhancedUserProfile.showProfileModal();
        });
    }
    
    // تغيير كلمة المرور
    const changePasswordBtn = container.querySelector('#change-password-btn');
    if (changePasswordBtn && window.EnhancedUserProfile) {
        changePasswordBtn.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.remove('active');
            window.EnhancedUserProfile.showChangePasswordModal();
        });
    }
    
    // تسجيل الخروج
    const logoutBtn = container.querySelector('#logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.remove('active');
            
            // تأكيد تسجيل الخروج
            if (confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
                if (window.AuthSystem && typeof window.AuthSystem.logout === 'function') {
                    window.AuthSystem.logout()
                        .then(() => {
                            showNotification('تم تسجيل الخروج بنجاح', 'success');
                        })
                        .catch(error => {
                            console.error('خطأ في تسجيل الخروج:', error);
                            showNotification('حدث خطأ أثناء تسجيل الخروج', 'error');
                        });
                }
            }
        });
    }
}

/**
 * تهيئة نظام إدارة المستخدمين
 */
function initializeUserManagement() {
    // تحميل سكربت إدارة المستخدمين إذا لم يكن متوفراً
    if (!window.UserManagement) {
        loadScript('user-management.js', 'user-management-script', function() {
            if (window.UserManagement && typeof window.UserManagement.init === 'function') {
                window.UserManagement.init();
            }
        });
    } else if (typeof window.UserManagement.init === 'function') {
        window.UserManagement.init();
    }
}

/**
 * التحقق من امتلاك المستخدم لصلاحية إدارة المستخدمين
 * @returns {boolean} - هل يملك المستخدم الصلاحية
 */
function hasUserManagementPermission() {
    const currentUser = firebase.auth().currentUser;
    
    // إذا لم يكن هناك مستخدم مسجل الدخول
    if (!currentUser) {
        return false;
    }
    
    // إذا كان المستخدم من نوع admin أو manager
    if (currentUser.type === 'admin' || currentUser.type === 'manager') {
        return true;
    }
    
    // التحقق من الصلاحيات المخصصة
    if (currentUser.permissions && currentUser.permissions.canCreateUsers) {
        return true;
    }
    
    return false;
}

/**
 * تحميل سكربت خارجي
 * @param {string} src - مسار السكربت
 * @param {string} id - معرف العنصر
 * @param {Function} callback - دالة تنفذ بعد تحميل السكربت
 */
function loadScript(src, id, callback) {
    // التحقق من وجود السكربت مسبقاً
    if (document.getElementById(id)) {
        if (typeof callback === 'function') {
            callback();
        }
        return;
    }
    
    // إنشاء عنصر السكربت
    const scriptElement = document.createElement('script');
    scriptElement.id = id;
    scriptElement.src = src;
    
    // مستمع حدث اكتمال التحميل
    scriptElement.onload = function() {
        console.log(`تم تحميل السكربت: ${src}`);
        if (typeof callback === 'function') {
            callback();
        }
    };
    
    // مستمع حدث خطأ في التحميل
    scriptElement.onerror = function() {
        console.error(`فشل تحميل السكربت: ${src}`);
    };
    
    // إضافة السكربت إلى نهاية الصفحة
    document.body.appendChild(scriptElement);
}

/**
 * عرض إشعار
 * @param {string} message - رسالة الإشعار
 * @param {string} type - نوع الإشعار (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // استخدام دالة الإشعارات من نظام ملف المستخدم المحسن
    if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.showNotification === 'function') {
        window.EnhancedUserProfile.showNotification(message, type);
        return;
    }
    
    // استخدام دالة الإشعارات من نظام إدارة المستخدمين
    if (window.UserManagement && typeof window.UserManagement.showNotification === 'function') {
        window.UserManagement.showNotification(message, type);
        return;
    }
    
    // استخدام أي دالة إشعارات موجودة
    if (typeof window.showNotification === 'function' && window.showNotification !== showNotification) {
        window.showNotification(message, type);
        return;
    }
    
    // إنشاء إشعار بسيط
    alert(message);
}

/**
 * الحصول على تسمية نوع المستخدم
 * @param {string} userType - نوع المستخدم
 * @returns {string} - تسمية نوع المستخدم
 */
function getUserTypeLabel(userType) {
    // استخدام الدالة من نظام ملف المستخدم المحسن
    if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.getUserTypeLabel === 'function') {
        return window.EnhancedUserProfile.getUserTypeLabel(userType);
    }
    
    // استخدام الدالة من نظام إدارة المستخدمين
    if (window.UserManagement && typeof window.UserManagement.getUserTypeLabel === 'function') {
        return window.UserManagement.getUserTypeLabel(userType);
    }
    
    // تنفيذ محلي للدالة
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

// تصدير الدوال للاستخدام الخارجي
window.EnhancedIntegration = {
    loadEnhancedStyles,
    initializeEnhancedComponents,
    setupEnhancedUserMenuIntegration,
    initializeUserManagement,
    showNotification
};