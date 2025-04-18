/**
 * ملف إصلاح مشاكل التنقل والتكامل
 * يعالج مشاكل الأزرار والتنقل بين الصفحات في الشريط الجانبي
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('تنفيذ إصلاحات التنقل والتكامل...');
    
    // إصلاح مشاكل التنقل في الشريط الجانبي
    fixSidebarNavigation();
    
    // إضافة مستمعي أحداث للصفحات الجديدة
    setupNewPageListeners();
    
    // مراقبة تحديثات DOM لإعادة تطبيق الإصلاحات عند تغير العناصر
    setupDOMObserver();
    
    console.log('تم تنفيذ إصلاحات التنقل والتكامل بنجاح');
});

/**
 * إصلاح مشاكل التنقل في الشريط الجانبي
 */
function fixSidebarNavigation() {
    // الحصول على جميع روابط التنقل
    const navLinks = document.querySelectorAll('.nav-link');
    
    // إعادة إضافة مستمعي الأحداث
    navLinks.forEach(link => {
        // إزالة مستمعي الأحداث السابقة لمنع التكرار
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        
        // إضافة مستمع حدث جديد
        newLink.addEventListener('click', handleNavigation);
    });
    
    console.log('تم إصلاح روابط التنقل في الشريط الجانبي');
}

/**
 * معالجة حدث التنقل
 * @param {Event} e - حدث النقر
 */
function handleNavigation(e) {
    e.preventDefault();
    
    // الحصول على صفحة الهدف
    const targetPage = this.getAttribute('data-page');
    if (!targetPage) return;
    
    console.log(`محاولة التنقل إلى الصفحة: ${targetPage}`);
    
    // إزالة الفئة النشطة من جميع الروابط
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // إضافة الفئة النشطة للرابط الحالي
    this.classList.add('active');
    
    // إخفاء جميع الصفحات
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // إظهار الصفحة المطلوبة
    const page = document.getElementById(`${targetPage}-page`);
    if (page) {
        page.classList.add('active');
        console.log(`تم الانتقال إلى الصفحة: ${targetPage}`);
        
        // تحديث العنوان
        updatePageTitle(targetPage);
        
        // تنفيذ أي إجراءات خاصة بالصفحة
        executePageSpecificActions(targetPage);
    } else {
        console.warn(`الصفحة غير موجودة: ${targetPage}`);
    }
}

/**
 * تحديث عنوان الصفحة
 * @param {string} pageName - اسم الصفحة
 */
function updatePageTitle(pageName) {
    // تحديث عنوان الصفحة في الهيدر
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) {
        switch (pageName) {
            case 'dashboard':
                pageTitle.textContent = 'لوحة التحكم';
                break;
            case 'investors':
                pageTitle.textContent = 'المستثمرين';
                break;
            case 'transactions':
                pageTitle.textContent = 'العمليات';
                break;
            case 'profits':
                pageTitle.textContent = 'الأرباح';
                break;
            case 'reports':
                pageTitle.textContent = 'التقارير';
                break;
            case 'settings':
                pageTitle.textContent = 'الإعدادات';
                break;
            case 'users':
                pageTitle.textContent = 'إدارة المستخدمين';
                break;
            default:
                pageTitle.textContent = pageName;
        }
    }
}

/**
 * تنفيذ إجراءات خاصة بالصفحة
 * @param {string} pageName - اسم الصفحة
 */
function executePageSpecificActions(pageName) {
    switch (pageName) {
        case 'users':
            // إذا كانت صفحة المستخدمين وكان النظام موجودًا
            if (window.UserManagement && typeof window.UserManagement.renderUsersList === 'function') {
                window.UserManagement.renderUsersList();
            } else if (!document.getElementById('user-management-script')) {
                // تحميل نظام إدارة المستخدمين إذا لم يكن موجودًا
                console.log('تحميل نظام إدارة المستخدمين...');
                loadScript('user-management.js', 'user-management-script', function() {
                    if (window.UserManagement && typeof window.UserManagement.init === 'function') {
                        window.UserManagement.init();
                    }
                });
            }
            break;
        
        case 'dashboard':
            // تحديث لوحة التحكم
            if (typeof updateDashboardData === 'function') {
                updateDashboardData();
            }
            break;
            
        case 'investors':
            // تحديث قائمة المستثمرين
            if (typeof loadInvestors === 'function') {
                loadInvestors();
            }
            break;
        
        // يمكن إضافة المزيد من الحالات الخاصة بالصفحات الأخرى
    }
}

/**
 * إضافة مستمعي أحداث للصفحات الجديدة
 */
function setupNewPageListeners() {
    // إضافة مستمع حدث لعنصر إدارة المستخدمين في الشريط الجانبي
    createUserManagementNavItem();
}

/**
 * إنشاء عنصر إدارة المستخدمين في الشريط الجانبي
 */
function createUserManagementNavItem() {
    // التحقق من وجود العنصر مسبقًا
    if (document.querySelector('.nav-link[data-page="users"]')) {
        // إضافة مستمع الحدث فقط
        const userNavLink = document.querySelector('.nav-link[data-page="users"]');
        if (userNavLink) {
            userNavLink.addEventListener('click', handleNavigation);
        }
        return;
    }
    
    // البحث عن قائمة الشريط الجانبي
    const navList = document.querySelector('.nav-list');
    if (!navList) {
        console.warn('لم يتم العثور على قائمة الشريط الجانبي');
        return;
    }
    
    // إنشاء عنصر إدارة المستخدمين
    const navItem = document.createElement('li');
    navItem.className = 'nav-item';
    navItem.setAttribute('data-permission', 'canCreateUsers');
    navItem.innerHTML = `
        <a class="nav-link" data-page="users" href="#">
            <div class="nav-icon">
                <i class="fas fa-user-shield"></i>
            </div>
            <span>إدارة المستخدمين</span>
        </a>
    `;
    
    // إضافة العنصر قبل عنصر الإعدادات
    const settingsNavItem = document.querySelector('.nav-link[data-page="settings"]');
    if (settingsNavItem && settingsNavItem.parentNode) {
        navList.insertBefore(navItem, settingsNavItem.parentNode);
    } else {
        navList.appendChild(navItem);
    }
    
    console.log('تم إضافة عنصر إدارة المستخدمين للشريط الجانبي');
    
    // إضافة مستمع حدث للتنقل
    navItem.querySelector('.nav-link').addEventListener('click', handleNavigation);
    
    // إضافة صفحة إدارة المستخدمين إذا لم تكن موجودة
    createUsersPage();
}

/**
 * إنشاء صفحة إدارة المستخدمين
 */
function createUsersPage() {
    // التحقق من وجود الصفحة مسبقًا
    if (document.getElementById('users-page')) {
        return;
    }
    
    // إنشاء صفحة إدارة المستخدمين
    const usersPage = document.createElement('div');
    usersPage.id = 'users-page';
    usersPage.className = 'page';
    
    // إضافة محتوى الصفحة
    usersPage.innerHTML = `
        <div class="header">
            <button class="toggle-sidebar">
                <i class="fas fa-bars"></i>
            </button>
            <h1 class="page-title">إدارة المستخدمين</h1>
            <div class="header-actions">
                <div class="search-box">
                    <input class="search-input" placeholder="بحث عن مستخدم..." type="text" id="search-users-input" />
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
                    <div class="btn-group">
                        <button class="btn btn-outline btn-sm active" data-filter="all">الكل</button>
                        <button class="btn btn-outline btn-sm" data-filter="admin">المسؤولين</button>
                        <button class="btn btn-outline btn-sm" data-filter="manager">المديرين</button>
                        <button class="btn btn-outline btn-sm" data-filter="user">المستخدمين</button>
                    </div>
                </div>
            </div>
            
            <div class="table-container">
                <table id="users-table" class="admin-access-table">
                    <thead>
                        <tr>
                            <th>المعرف</th>
                            <th>الاسم</th>
                            <th>البريد الإلكتروني</th>
                            <th>نوع المستخدم</th>
                            <th>تاريخ الإنشاء</th>
                            <th>آخر تسجيل دخول</th>
                            <th>الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody id="users-table-body">
                        <!-- سيتم ملؤها ديناميكيًا -->
                        <tr>
                            <td colspan="7" class="text-center">جاري تحميل البيانات...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    // إضافة الصفحة إلى main-content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.appendChild(usersPage);
        console.log('تم إضافة صفحة إدارة المستخدمين');
        
        // إضافة مستمع حدث لزر إضافة مستخدم
        const addUserBtn = usersPage.querySelector('#add-user-btn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', function() {
                if (window.UserManagement && typeof window.UserManagement.showAddUserModal === 'function') {
                    window.UserManagement.showAddUserModal();
                }
            });
        }
        
        // إضافة مستمع حدث للبحث
        const searchInput = usersPage.querySelector('#search-users-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                if (window.UserManagement && typeof window.UserManagement.filterUsers === 'function') {
                    window.UserManagement.filterUsers(this.value);
                }
            });
        }
        
        // إضافة مستمعي أحداث لأزرار التصفية
        const filterButtons = usersPage.querySelectorAll('.btn-group .btn[data-filter]');
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع الأزرار
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // إضافة الفئة النشطة للزر الحالي
                this.classList.add('active');
                
                // تصفية المستخدمين حسب النوع
                const filterType = this.getAttribute('data-filter');
                if (window.UserManagement && typeof window.UserManagement.filterUsersByType === 'function') {
                    window.UserManagement.filterUsersByType(filterType);
                }
            });
        });
    } else {
        console.warn('لم يتم العثور على عنصر main-content');
    }
}

/**
 * مراقبة تغيرات DOM
 */
function setupDOMObserver() {
    // التحقق من دعم المتصفح لـ MutationObserver
    if (!window.MutationObserver) {
        console.warn('المتصفح لا يدعم MutationObserver');
        return;
    }
    
    // تكوين المراقب
    const observer = new MutationObserver(function(mutations) {
        // البحث عن إضافات في الشريط الجانبي
        const sidebarChanged = mutations.some(mutation => {
            return mutation.target.className && 
                  (mutation.target.className.includes('sidebar') || 
                   mutation.target.className.includes('nav-list'));
        });
        
        if (sidebarChanged) {
            console.log('تم اكتشاف تغييرات في الشريط الجانبي، إعادة تطبيق الإصلاحات');
            fixSidebarNavigation();
            createUserManagementNavItem();
        }
    });
    
    // بدء المراقبة
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
    
    console.log('تمت إضافة مراقب DOM للتغييرات');
}

/**
 * تحميل سكربت خارجي
 * @param {string} src - مسار السكربت
 * @param {string} id - معرف العنصر
 * @param {Function} callback - دالة تنفذ بعد تحميل السكربت
 */
function loadScript(src, id, callback) {
    // التحقق من وجود السكربت مسبقًا
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