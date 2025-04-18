/**
 * سكربت تثبيت إصلاحات النظام
 * يتحقق من وجود جميع الملفات المطلوبة ويضيف العناصر الضرورية لحماية النظام
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('بدء تثبيت إصلاحات النظام...');
    
    // التحقق من وجود جميع الملفات المطلوبة
    checkRequiredFiles();
    
    // إضافة سمات الصلاحيات للعناصر
    addPermissionAttributes();
    
    // تهيئة نظام حماية التطبيق
    initAuthGuard();
    
    console.log('تم تثبيت إصلاحات النظام بنجاح');
});

/**
 * التحقق من وجود جميع الملفات المطلوبة
 */
function checkRequiredFiles() {
    const requiredFiles = [
        { name: 'auth-guard.js', tag: 'auth-guard-script' },
        { name: 'navigation-integration-fix.js', tag: 'navigation-fix-script' },
        { name: 'user-profile-enhanced.js', tag: 'enhanced-user-profile-script' },
        { name: 'user-profile-enhanced-styles.css', tag: 'enhanced-user-profile-styles' }
    ];
    
    requiredFiles.forEach(file => {
        if (!document.getElementById(file.tag)) {
            // إنشاء عنصر السكربت أو CSS
            let element;
            
            if (file.name.endsWith('.js')) {
                element = document.createElement('script');
                element.src = file.name;
                element.type = 'text/javascript';
            } else if (file.name.endsWith('.css')) {
                element = document.createElement('link');
                element.rel = 'stylesheet';
                element.href = file.name;
            }
            
            if (element) {
                element.id = file.tag;
                document.body.appendChild(element);
                console.log(`تمت إضافة الملف: ${file.name}`);
            }
        }
    });
}

/**
 * إضافة سمات الصلاحيات للعناصر
 */
function addPermissionAttributes() {
    // إدارة المستخدمين (للمسؤولين والمديرين فقط)
    const userManagementElements = document.querySelectorAll('.nav-link[data-page="users"], #add-user-btn, .user-management');
    userManagementElements.forEach(element => {
        element.setAttribute('data-permission', 'canCreateUsers');
    });
    
    // إدارة الإعدادات (للمسؤولين والمديرين فقط)
    const settingsElements = document.querySelectorAll('.nav-link[data-page="settings"], #settings-page button[type="submit"]');
    settingsElements.forEach(element => {
        element.setAttribute('data-permission', 'canManageSettings');
    });
    
    // حذف المستثمرين (للمسؤولين والمديرين فقط)
    const deleteInvestorElements = document.querySelectorAll('.delete-investor-btn, .delete-investor');
    deleteInvestorElements.forEach(element => {
        element.setAttribute('data-permission', 'canDeleteInvestors');
    });
    
    // تصدير البيانات (للجميع)
    const exportDataElements = document.querySelectorAll('.export-btn, [title="تصدير"]');
    exportDataElements.forEach(element => {
        element.setAttribute('data-permission', 'canExportData');
    });
    
    // النسخ الاحتياطي (للمسؤولين فقط)
    const backupElements = document.querySelectorAll('#backup-tab button');
    backupElements.forEach(element => {
        if (element.textContent.includes('تنزيل') || element.textContent.includes('نسخة احتياطية')) {
            element.setAttribute('data-permission', 'canCreateBackup');
        } else if (element.textContent.includes('استعادة')) {
            element.setAttribute('data-permission', 'canRestoreBackup');
        }
    });
    
    console.log('تمت إضافة سمات الصلاحيات للعناصر');
}

/**
 * تهيئة نظام حماية التطبيق
 */
function initAuthGuard() {
    // إضافة عنصر حاوية قائمة المستخدم إذا لم يكن موجوداً
    if (!document.getElementById('user-menu-container')) {
        const headerActions = document.querySelector('.header-actions');
        
        if (headerActions) {
            const userMenuContainer = document.createElement('div');
            userMenuContainer.id = 'user-menu-container';
            
            // إضافة الحاوية قبل أول عنصر في header-actions
            headerActions.insertBefore(userMenuContainer, headerActions.firstChild);
            
            console.log('تمت إضافة حاوية قائمة المستخدم');
        }
    }
    
    // إضافة أنماط CSS للعناصر المخفية
    addHiddenElementsStyles();
    
    // تعديل السلوك الافتراضي لزر الإغلاق
    customizeCloseButton();
    
    // إضافة بيانات المستخدمين الافتراضية للوضع التجريبي
    setupDefaultUsers();
}

/**
 * إضافة أنماط CSS للعناصر المخفية
 */
function addHiddenElementsStyles() {
    // التحقق من وجود الأنماط مسبقاً
    if (document.getElementById('hidden-elements-styles')) {
        return;
    }
    
    // إنشاء عنصر النمط
    const styleElement = document.createElement('style');
    styleElement.id = 'hidden-elements-styles';
    
    // إضافة أنماط CSS
    styleElement.textContent = `
        /* إخفاء العناصر حسب الصلاحيات */
        .hidden {
            display: none !important;
        }
        
        /* تنسيق عناصر القائمة المخفية */
        .nav-item[data-permission] {
            position: relative;
        }
        
        .nav-item[data-permission].hidden {
            display: block !important;
            opacity: 0.5;
            pointer-events: none;
        }
        
        .nav-item[data-permission].hidden::after {
            content: '🔒';
            position: absolute;
            top: 50%;
            left: 1rem;
            transform: translateY(-50%);
            font-size: 1rem;
        }
        
        /* تعديل عناصر التحكم حسب نوع المستخدم */
        body[data-user-type="user"] .admin-only,
        body[data-user-type="user"] .manager-only {
            display: none !important;
        }
        
        body[data-user-type="manager"] .admin-only {
            display: none !important;
        }
    `;
    
    // إضافة الأنماط إلى الصفحة
    document.head.appendChild(styleElement);
    
    console.log('تمت إضافة أنماط CSS للعناصر المخفية');
}

/**
 * تعديل السلوك الافتراضي لزر الإغلاق
 */
function customizeCloseButton() {
    // البحث عن زر الإغلاق
    const closeButton = document.getElementById('close-btn');
    
    if (closeButton) {
        // حفظ السلوك الأصلي
        const originalClickHandler = closeButton.onclick;
        
        // استبدال السلوك
        closeButton.onclick = function(e) {
            e.preventDefault();
            
            // التحقق من حالة المصادقة
            const currentUser = getCurrentUser();
            
            if (currentUser) {
                // المستخدم مسجل الدخول
                // تأكيد تسجيل الخروج قبل الإغلاق
                if (confirm('هل تريد تسجيل الخروج قبل إغلاق التطبيق؟')) {
                    logout()
                        .then(() => {
                            // استدعاء السلوك الأصلي بعد تسجيل الخروج
                            if (typeof originalClickHandler === 'function') {
                                originalClickHandler.call(this, e);
                            } else {
                                window.close();
                            }
                        })
                        .catch(() => {
                            // استدعاء السلوك الأصلي حتى لو فشل تسجيل الخروج
                            if (typeof originalClickHandler === 'function') {
                                originalClickHandler.call(this, e);
                            } else {
                                window.close();
                            }
                        });
                } else {
                    // استدعاء السلوك الأصلي بدون تسجيل الخروج
                    if (typeof originalClickHandler === 'function') {
                        originalClickHandler.call(this, e);
                    } else {
                        window.close();
                    }
                }
            } else {
                // المستخدم غير مسجل الدخول
                // استدعاء السلوك الأصلي مباشرة
                if (typeof originalClickHandler === 'function') {
                    originalClickHandler.call(this, e);
                } else {
                    window.close();
                }
            }
        };
        
        console.log('تم تعديل السلوك الافتراضي لزر الإغلاق');
    }
}

/**
 * إضافة بيانات المستخدمين الافتراضية للوضع التجريبي
 */
function setupDefaultUsers() {
    // التحقق من وجود بيانات المستخدمين
    if (localStorage.getItem('defaultUsersSet')) {
        return;
    }
    
    // إضافة بيانات المستخدمين الافتراضية
    const defaultUsers = [
        {
            id: 'admin-user',
            email: 'admin@example.com',
            password: 'admin123',
            displayName: 'مسؤول النظام',
            type: 'admin',
            permissions: getDefaultPermissions('admin')
        },
        {
            id: 'manager-user',
            email: 'manager@example.com',
            password: 'manager123',
            displayName: 'مدير النظام',
            type: 'manager',
            permissions: getDefaultPermissions('manager')
        },
        {
            id: 'user-standard',
            email: 'user@example.com',
            password: 'user123',
            displayName: 'مستخدم عادي',
            type: 'user',
            permissions: getDefaultPermissions('user')
        }
    ];
    
    // حفظ بيانات المستخدمين في التخزين المحلي
    localStorage.setItem('defaultUsers', JSON.stringify(defaultUsers));
    localStorage.setItem('defaultUsersSet', 'true');
    
    console.log('تمت إضافة بيانات المستخدمين الافتراضية');
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
 * الحصول على معلومات المستخدم الحالي
 * @returns {Object|null} - معلومات المستخدم أو null إذا لم يكن مسجل الدخول
 */
function getCurrentUser() {
    // استخدام نظام الحماية إذا كان متاحاً
    if (window.AuthGuard && typeof window.AuthGuard.getCurrentUser === 'function') {
        return window.AuthGuard.getCurrentUser();
    }
    
    // محاولة استرداد معلومات المستخدم من التخزين المحلي
    try {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            return JSON.parse(storedUser);
        }
    } catch (error) {
        console.error('خطأ في استرداد معلومات المستخدم من التخزين المحلي:', error);
    }
    
    return null;
}

/**
 * تسجيل الخروج
 * @returns {Promise} - وعد يشير إلى نجاح أو فشل تسجيل الخروج
 */
function logout() {
    return new Promise((resolve, reject) => {
        // استخدام نظام الحماية إذا كان متاحاً
        if (window.AuthGuard && typeof window.AuthGuard.logout === 'function') {
            window.AuthGuard.logout()
                .then(resolve)
                .catch(reject);
            return;
        }
        
        // تنفيذ تسجيل الخروج يدوياً
        try {
            // مسح معلومات المستخدم من التخزين المحلي
            localStorage.removeItem('currentUser');
            
            // إطلاق حدث تسجيل الخروج
            document.dispatchEvent(new CustomEvent('auth:logout'));
            
            resolve();
        } catch (error) {
            console.error('خطأ في تسجيل الخروج:', error);
            reject(error);
        }
    });
}