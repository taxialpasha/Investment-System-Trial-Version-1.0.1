/**
 * ملف تكامل نظام ملف المستخدم المحسن
 * يقوم بدمج النظام الجديد مع التطبيق الحالي
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('بدء تكامل نظام ملف المستخدم المحسن الجديد...');
    
    // إضافة ملفات CSS
    addEnhancedUserProfileStyles();
    
    // إضافة العناصر اللازمة للواجهة
    addEnhancedUserProfileElements();
    
    // تهيئة النظام المحسن
    if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.init === 'function') {
        window.EnhancedUserProfile.init();
    } else {
        console.warn('نظام ملف المستخدم المحسن غير متوفر');
        loadEnhancedUserProfileScript();
    }
    
    // تحديث عناصر الصلاحيات في الواجهة
    addPermissionAttributes();
    
    console.log('تم تكامل نظام ملف المستخدم المحسن الجديد بنجاح');
});

/**
 * إضافة أنماط CSS لنظام ملف المستخدم المحسن
 */
function addEnhancedUserProfileStyles() {
    // التحقق من وجود الأنماط مسبقاً
    if (document.getElementById('enhanced-user-profile-styles')) {
        return;
    }
    
    // إنشاء عنصر رابط CSS
    const linkElement = document.createElement('link');
    linkElement.id = 'enhanced-user-profile-styles';
    linkElement.rel = 'stylesheet';
    linkElement.href = 'user-profile-enhanced-styles.css';
    
    // إضافة العنصر إلى رأس الصفحة
    document.head.appendChild(linkElement);
    
    console.log('تم إضافة أنماط CSS لنظام ملف المستخدم المحسن');
}

/**
 * إضافة عناصر نظام ملف المستخدم المحسن للواجهة
 */
function addEnhancedUserProfileElements() {
    // البحث عن حاوية قائمة المستخدم
    let userMenuContainer = document.getElementById('user-menu-container');
    
    // إذا لم تكن موجودة، نبحث عن header-actions ونضيف الحاوية فيها
    if (!userMenuContainer) {
        const headerActions = document.querySelector('.header-actions');
        
        if (headerActions) {
            // إنشاء حاوية قائمة المستخدم
            userMenuContainer = document.createElement('div');
            userMenuContainer.id = 'user-menu-container';
            
            // إضافة الحاوية إلى header-actions
            headerActions.appendChild(userMenuContainer);
            
            console.log('تم إضافة حاوية قائمة المستخدم');
        } else {
            console.warn('لم يتم العثور على عنصر header-actions');
        }
    }
}

/**
 * تحميل سكربت نظام ملف المستخدم المحسن إذا لم يكن متوفراً
 */
function loadEnhancedUserProfileScript() {
    // التحقق من وجود السكربت مسبقاً
    if (document.getElementById('enhanced-user-profile-script')) {
        return;
    }
    
    // إنشاء عنصر السكربت
    const scriptElement = document.createElement('script');
    scriptElement.id = 'enhanced-user-profile-script';
    scriptElement.src = 'user-profile-enhanced.js';
    
    // إضافة السكربت إلى نهاية الصفحة
    document.body.appendChild(scriptElement);
    
    // مستمع لتهيئة النظام بعد تحميل السكربت
    scriptElement.onload = function() {
        if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.init === 'function') {
            window.EnhancedUserProfile.init();
        } else {
            console.error('فشل في تحميل نظام ملف المستخدم المحسن');
        }
    };
    
    console.log('جاري تحميل سكربت نظام ملف المستخدم المحسن');
}

/**
 * إضافة سمات الصلاحيات لعناصر الواجهة
 * يتم استخدام هذه السمات لإخفاء العناصر بناءً على صلاحيات المستخدم
 */
function addPermissionAttributes() {
    // إدارة المستخدمين (للمسؤولين والمديرين فقط)
    const userManagementElements = document.querySelectorAll('.users-link, .add-user-btn, #users-page .admin-action');
    userManagementElements.forEach(element => {
        element.setAttribute('data-permission', 'canCreateUsers');
    });
    
    // إدارة الإعدادات (للمسؤولين والمديرين فقط)
    const settingsElements = document.querySelectorAll('.settings-link, #settings-page .admin-action');
    settingsElements.forEach(element => {
        element.setAttribute('data-permission', 'canManageSettings');
    });
    
    // أزرار حذف المستثمرين (للمسؤولين والمديرين فقط)
    const deleteInvestorElements = document.querySelectorAll('.delete-investor-btn, .remove-investor-btn');
    deleteInvestorElements.forEach(element => {
        element.setAttribute('data-permission', 'canDeleteInvestors');
    });
    
    // أزرار تصدير البيانات (للجميع)
    const exportDataElements = document.querySelectorAll('.export-btn, [title="تصدير"]');
    exportDataElements.forEach(element => {
        element.setAttribute('data-permission', 'canExportData');
    });
    
    // عناصر استيراد البيانات (للمسؤولين والمديرين فقط)
    const importDataElements = document.querySelectorAll('.import-btn, [title="استيراد"]');
    importDataElements.forEach(element => {
        element.setAttribute('data-permission', 'canImportData');
    });
    
    // عناصر النسخ الاحتياطي (للمسؤولين فقط)
    const backupElements = document.querySelectorAll('#backup-tab .backup-action');
    backupElements.forEach(element => {
        if (element.classList.contains('create-backup')) {
            element.setAttribute('data-permission', 'canCreateBackup');
        } else if (element.classList.contains('restore-backup')) {
            element.setAttribute('data-permission', 'canRestoreBackup');
        }
    });
    
    console.log('تم إضافة سمات الصلاحيات لعناصر الواجهة');
}

/**
 * تحديث الشريط الجانبي والقوائم لإضافة عناصر جديدة
 */
function updateNavigationElements() {
    // إضافة عنصر إدارة المستخدمين للشريط الجانبي (للمسؤولين فقط)
    const sidebar = document.querySelector('.nav-list');
    
    if (sidebar) {
        // التحقق من وجود عنصر إدارة المستخدمين مسبقاً
        if (!document.querySelector('[data-page="users"]')) {
            // إنشاء عنصر القائمة
            const usersNavItem = document.createElement('li');
            usersNavItem.className = 'nav-item';
            usersNavItem.setAttribute('data-permission', 'canCreateUsers');
            usersNavItem.innerHTML = `
                <a class="nav-link" data-page="users" href="#">
                    <div class="nav-icon">
                        <i class="fas fa-user-shield"></i>
                    </div>
                    <span>إدارة المستخدمين</span>
                </a>
            `;
            
            // إضافة العنصر قبل الإعدادات
            const settingsNavItem = document.querySelector('[data-page="settings"]');
            if (settingsNavItem && settingsNavItem.parentNode) {
                sidebar.insertBefore(usersNavItem, settingsNavItem.parentNode);
            } else {
                sidebar.appendChild(usersNavItem);
            }
            
            console.log('تم إضافة عنصر إدارة المستخدمين للشريط الجانبي');
        }
    }
}

// تصدير الدوال للاستخدام الخارجي
window.UserProfileIntegration = {
    addEnhancedUserProfileStyles,
    addEnhancedUserProfileElements,
    loadEnhancedUserProfileScript,
    addPermissionAttributes,
    updateNavigationElements
};

// تحديث عناصر التنقل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', updateNavigationElements);