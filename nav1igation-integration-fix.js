/**
 * دمج نظام الحماية مع التنقل في التطبيق
 * يتحكم في عرض الصفحات حسب صلاحيات المستخدم
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('تهيئة دمج نظام الحماية مع التنقل...');
    
    // إضافة مستمعي الأحداث لروابط التنقل
    setupNavigationListeners();
    
    // مستمع لأحداث تسجيل الدخول/الخروج
    setupAuthEventListeners();
});

/**
 * إضافة مستمعي الأحداث لروابط التنقل
 */
function setupNavigationListeners() {
    // الروابط في الشريط الجانبي
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // حفظ مستمع الحدث الأصلي
        const originalClickHandler = link.onclick;
        
        // استبدال مستمع الحدث بمستمع جديد
        link.onclick = function(e) {
            e.preventDefault();
            
            // التحقق من حالة المصادقة
            if (!isUserAuthenticated()) {
                showAuthenticationRequired();
                return;
            }
            
            // الحصول على معرف الصفحة
            const pageId = this.getAttribute('data-page');
            
            // التحقق من الصلاحيات للصفحة
            if (!hasPermissionForPage(pageId)) {
                showPermissionDenied();
                return;
            }
            
            // استدعاء المستمع الأصلي إذا كان موجوداً
            if (typeof originalClickHandler === 'function') {
                originalClickHandler.call(this, e);
            } else {
                // تنفيذ السلوك الافتراضي إذا لم يكن هناك مستمع أصلي
                // إزالة الفئة النشطة من جميع الروابط
                navLinks.forEach(l => l.classList.remove('active'));
                
                // إضافة الفئة النشطة للرابط المحدد
                this.classList.add('active');
                
                // إظهار الصفحة المقابلة
                showPage(pageId);
            }
            
            // تحديث الصفحة النشطة في العنوان URL
            updateActivePage(pageId);
        };
    });
    
    // الأزرار التي تفتح النوافذ المنبثقة
    const modalTriggers = document.querySelectorAll('[data-modal]');
    
    modalTriggers.forEach(trigger => {
        // حفظ مستمع الحدث الأصلي
        const originalClickHandler = trigger.onclick;
        
        // استبدال مستمع الحدث بمستمع جديد
        trigger.onclick = function(e) {
            e.preventDefault();
            
            // التحقق من حالة المصادقة
            if (!isUserAuthenticated()) {
                showAuthenticationRequired();
                return;
            }
            
            // الحصول على معرف النافذة
            const modalId = this.getAttribute('data-modal');
            
            // التحقق من الصلاحيات للنافذة
            if (!hasPermissionForModal(modalId)) {
                showPermissionDenied();
                return;
            }
            
            // استدعاء المستمع الأصلي إذا كان موجوداً
            if (typeof originalClickHandler === 'function') {
                originalClickHandler.call(this, e);
            } else {
                // تنفيذ السلوك الافتراضي إذا لم يكن هناك مستمع أصلي
                openModal(modalId);
            }
        };
    });
}

/**
 * إضافة مستمعي الأحداث لأحداث تسجيل الدخول/الخروج
 */
function setupAuthEventListeners() {
    // مستمع حدث تسجيل الدخول
    document.addEventListener('auth:login', function(e) {
        console.log('تم تسجيل الدخول:', e.detail.user.displayName);
        
        // تحديث الصفحة النشطة
        const currentPage = getCurrentPage();
        if (currentPage && hasPermissionForPage(currentPage)) {
            showPage(currentPage);
        } else {
            // الانتقال إلى لوحة التحكم إذا لم تكن هناك صفحة نشطة أو المستخدم لا يملك صلاحية الوصول إليها
            showPage('dashboard');
        }
        
        // تطبيق الصلاحيات على واجهة المستخدم
        applyPermissionsToUI();
    });
    
    // مستمع حدث تسجيل الخروج
    document.addEventListener('auth:logout', function() {
        console.log('تم تسجيل الخروج');
        
        // إعادة تعيين الصفحة النشطة
        resetActivePage();
    });
}

/**
 * التحقق من حالة المصادقة
 * @returns {boolean} - ما إذا كان المستخدم مسجل الدخول
 */
function isUserAuthenticated() {
    // استخدام نظام الحماية إذا كان متاحاً
    if (window.AuthGuard && typeof window.AuthGuard.isAuthenticated === 'function') {
        return window.AuthGuard.isAuthenticated();
    }
    
    // التحقق من التخزين المحلي كخيار احتياطي
    return !!localStorage.getItem('currentUser');
}

/**
 * التحقق من صلاحيات المستخدم للصفحة
 * @param {string} pageId - معرف الصفحة
 * @returns {boolean} - ما إذا كان المستخدم يملك صلاحية الوصول إلى الصفحة
 */
function hasPermissionForPage(pageId) {
    // السماح بالوصول إلى صفحة لوحة التحكم دائماً
    if (pageId === 'dashboard') {
        return true;
    }
    
    // الحصول على معلومات المستخدم
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return false;
    }
    
    // التحقق من الصلاحيات حسب الصفحة
    switch (pageId) {
        case 'users':
            return currentUser.permissions.canCreateUsers;
        case 'settings':
            return currentUser.permissions.canManageSettings;
        case 'investors':
        case 'transactions':
        case 'profits':
        case 'reports':
            // الصفحات الأساسية متاحة لجميع المستخدمين
            return true;
        default:
            // السماح بالوصول إلى الصفحات غير المعروفة بشكل افتراضي
            return true;
    }
}

/**
 * التحقق من صلاحيات المستخدم للنافذة المنبثقة
 * @param {string} modalId - معرف النافذة
 * @returns {boolean} - ما إذا كان المستخدم يملك صلاحية الوصول إلى النافذة
 */
function hasPermissionForModal(modalId) {
    // الحصول على معلومات المستخدم
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return false;
    }
    
    // التحقق من الصلاحيات حسب النافذة
    switch (modalId) {
        case 'add-user-modal':
            return currentUser.permissions.canCreateUsers;
        case 'delete-user-modal':
            return currentUser.permissions.canDeleteUsers;
        case 'edit-user-modal':
            return currentUser.permissions.canCreateUsers;
        case 'add-investor-modal':
            return true; // متاح للجميع
        case 'add-deposit-modal':
            return true; // متاح للجميع
        case 'add-withdraw-modal':
            return true; // متاح للجميع
        case 'pay-profit-modal':
            return true; // متاح للجميع
        default:
            // السماح بالوصول إلى النوافذ غير المعروفة بشكل افتراضي
            return true;
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
    
    // استخدام نظام ملف المستخدم المحسن إذا كان متاحاً
    if (window.EnhancedUserProfile && window.currentUser) {
        return window.currentUser;
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
 * عرض إشعار بأن المستخدم غير مسجل الدخول
 */
function showAuthenticationRequired() {
    showNotification('يجب تسجيل الدخول للوصول إلى هذه الصفحة', 'error');
    
    // إعادة توجيه المستخدم إلى شاشة تسجيل الدخول
    if (window.AuthGuard) {
        // استخدام شاشة تسجيل الدخول الداخلية
        hideApplication();
        showLoginScreen();
    } else {
        // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول الخارجية
        window.location.href = 'login.html';
    }
}

/**
 * عرض إشعار بأن المستخدم لا يملك صلاحية الوصول
 */
function showPermissionDenied() {
    showNotification('لا تملك صلاحية الوصول إلى هذه الصفحة', 'error');
}

/**
 * إظهار صفحة معينة
 * @param {string} pageId - معرف الصفحة
 */
function showPage(pageId) {
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // إظهار الصفحة المطلوبة
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // تحديث البيانات حسب الصفحة
        if (typeof window.updatePageData === 'function') {
            window.updatePageData(pageId);
        }
    }
}

/**
 * فتح نافذة منبثقة
 * @param {string} modalId - معرف النافذة
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('active');
}

/**
 * إخفاء التطبيق
 */
function hideApplication() {
    // استخدام نظام الحماية إذا كان متاحاً
    if (window.AuthGuard && typeof window.AuthGuard.hideApplication === 'function') {
        window.AuthGuard.hideApplication();
        return;
    }
    
    // إخفاء محتوى التطبيق
    document.body.style.overflow = 'hidden';
    document.querySelector('.layout').style.display = 'none';
}

/**
 * إظهار شاشة تسجيل الدخول
 */
function showLoginScreen() {
    // استخدام نظام الحماية إذا كان متاحاً
    if (window.AuthGuard && typeof window.AuthGuard.showLoginScreen === 'function') {
        window.AuthGuard.showLoginScreen();
        return;
    }
    
    // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول الخارجية
    window.location.href = 'login.html';
}

/**
 * تحديث الصفحة النشطة في العنوان URL
 * @param {string} pageId - معرف الصفحة
 */
function updateActivePage(pageId) {
    // استخدام History API إذا كان متاحاً
    if (window.history && window.history.pushState) {
        const url = new URL(window.location.href);
        
        // تحديث المعلمة page في العنوان URL
        url.searchParams.set('page', pageId);
        
        // تحديث العنوان URL
        window.history.pushState({ page: pageId }, '', url.toString());
    }
}

/**
 * إعادة تعيين الصفحة النشطة
 */
function resetActivePage() {
    // استخدام History API إذا كان متاحاً
    if (window.history && window.history.pushState) {
        const url = new URL(window.location.href);
        
        // إزالة المعلمة page من العنوان URL
        url.searchParams.delete('page');
        
        // تحديث العنوان URL
        window.history.pushState({}, '', url.toString());
    }
}

/**
 * الحصول على الصفحة النشطة من العنوان URL
 * @returns {string|null} - معرف الصفحة النشطة أو null إذا لم يكن هناك صفحة نشطة
 */
function getCurrentPage() {
    const url = new URL(window.location.href);
    return url.searchParams.get('page') || 'dashboard';
}

/**
 * تطبيق الصلاحيات على واجهة المستخدم
 */
function applyPermissionsToUI() {
    // استخدام نظام ملف المستخدم المحسن إذا كان متاحاً
    if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.updateElementsAccess === 'function') {
        window.EnhancedUserProfile.updateElementsAccess();
        return;
    }
    
    // الحصول على معلومات المستخدم
    const currentUser = getCurrentUser();
    if (!currentUser) {
        return;
    }
    
    const userType = currentUser.type || 'user';
    const permissions = currentUser.permissions || {};
    
    // إضافة نوع المستخدم كخاصية لعنصر body
    document.body.setAttribute('data-user-type', userType);
    
    // إخفاء العناصر التي لا يملك المستخدم صلاحية الوصول إليها
    
    // إدارة المستخدمين
    const userManagementElements = document.querySelectorAll('[data-permission="canCreateUsers"]');
    userManagementElements.forEach(element => {
        if (permissions.canCreateUsers) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
    
    // إدارة الإعدادات
    const settingsElements = document.querySelectorAll('[data-permission="canManageSettings"]');
    settingsElements.forEach(element => {
        if (permissions.canManageSettings) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
    
    // حذف المستثمرين
    const deleteInvestorsElements = document.querySelectorAll('[data-permission="canDeleteInvestors"]');
    deleteInvestorsElements.forEach(element => {
        if (permissions.canDeleteInvestors) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
}

/**
 * عرض إشعار
 * @param {string} message - نص الإشعار
 * @param {string} type - نوع الإشعار (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // استخدام نظام الإشعارات العام إذا كان متاحاً
    if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.showNotification === 'function') {
        window.EnhancedUserProfile.showNotification(message, type);
        return;
    }
    
    // استخدام نظام الحماية إذا كان متاحاً
    if (window.AuthGuard && typeof window.AuthGuard.showNotification === 'function') {
        window.AuthGuard.showNotification(message, type);
        return;
    }
    
    // استخدام دالة الإشعارات المحلية إذا كانت متوفرة
    if (typeof window.showNotification === 'function' && window.showNotification !== showNotification) {
        window.showNotification(message, type);
        return;
    }
    
    // إنشاء إشعار جديد
    console.log(`[${type.toUpperCase()}] ${message}`);
    alert(message);
}

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من حالة المصادقة
    if (!isUserAuthenticated()) {
        // المستخدم غير مسجل الدخول، عرض شاشة تسجيل الدخول
        showAuthenticationRequired();
    } else {
        // المستخدم مسجل الدخول، تطبيق الصلاحيات على واجهة المستخدم
        applyPermissionsToUI();
        
        // تحديث الصفحة النشطة
        const currentPage = getCurrentPage();
        if (currentPage && hasPermissionForPage(currentPage)) {
            showPage(currentPage);
        } else {
            // الانتقال إلى لوحة التحكم إذا لم تكن هناك صفحة نشطة أو المستخدم لا يملك صلاحية الوصول إليها
            showPage('dashboard');
        }
    }
});

// تصدير الدوال للاستخدام الخارجي
window.NavigationGuard = {
    isUserAuthenticated,
    hasPermissionForPage,
    hasPermissionForModal,
    getCurrentUser,
    showPage,
    showAuthenticationRequired,
    showPermissionDenied
};