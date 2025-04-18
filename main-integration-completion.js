/**
 * ملف التكامل الرئيسي
 * يجمع ويربط جميع الوظائف والتحديثات المختلفة
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('بدء تشغيل نظام التكامل الرئيسي...');
    
    // إضافة أنماط CSS
    addRequiredStyles();
    
    // تحميل الملفات المطلوبة
    loadRequiredScripts();
    
    // إضافة مستمعي الأحداث الرئيسية
    addMainEventListeners();
    
    // إنشاء العناصر المطلوبة في الواجهة
    createRequiredUIElements();
    
    console.log('تم تشغيل نظام التكامل الرئيسي بنجاح');
});

/**
 * إضافة أنماط CSS المطلوبة
 */
function addRequiredStyles() {
    // إضافة أنماط نظام المستخدم المحسن
    if (!document.getElementById('enhanced-user-profile-styles')) {
        const userProfileStyles = document.createElement('link');
        userProfileStyles.id = 'enhanced-user-profile-styles';
        userProfileStyles.rel = 'stylesheet';
        userProfileStyles.href = 'user-profile-enhanced-styles.css';
        document.head.appendChild(userProfileStyles);
    }
    
    // إضافة الأنماط المباشرة
    if (!document.getElementById('custom-integration-styles')) {
        const customStyles = document.createElement('style');
        customStyles.id = 'custom-integration-styles';
        customStyles.textContent = `
            /* أنماط عامة للتكامل */
            .dropdown-toggle {
                cursor: pointer;
            }
            
            /* إصلاح مشاكل التنسيق */
            .dropdown-menu {
                z-index: 1000;
            }
            
            /* تعديل تنسيق الشريط الجانبي */
            .sidebar .nav-list {
                margin-top: 1rem;
            }
            
            /* نافذة إدارة المستخدمين */
            #users-page .table-container {
                overflow-x: auto;
            }
            
            #users-page table th,
            #users-page table td {
                text-align: right;
            }
            
            /* تنسيق الصفحات */
            .page {
                display: none;
                padding: 1rem;
            }
            
            .page.active {
                display: block;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(customStyles);
    }
    
    console.log('تم إضافة أنماط CSS المطلوبة');
}

/**
 * تحميل الملفات النصية المطلوبة
 */
function loadRequiredScripts() {
    // إضافة المصفوفة التي تحتوي على الملفات المطلوبة
    const requiredScripts = [
        { src: 'user-profile-enhanced.js', id: 'enhanced-user-profile-script' },
        { src: 'user-profile-integration-enhanced.js', id: 'enhanced-integration-script' },
        { src: 'user-management.js', id: 'user-management-script' },
        { src: 'navigation-integration-fix.js', id: 'navigation-fix-script' }
    ];
    
    // تحميل الملفات بالترتيب
    loadScriptsSequentially(requiredScripts, 0);
}

/**
 * تحميل الملفات النصية بشكل متسلسل
 * @param {Array} scripts - مصفوفة الملفات
 * @param {number} index - الفهرس الحالي
 */
function loadScriptsSequentially(scripts, index) {
    // التحقق من انتهاء التحميل
    if (index >= scripts.length) {
        console.log('تم تحميل جميع الملفات بنجاح');
        initializeSystems();
        return;
    }
    
    // الحصول على الملف الحالي
    const script = scripts[index];
    
    // التحقق من وجود الملف مسبقًا
    if (document.getElementById(script.id)) {
        console.log(`الملف ${script.src} موجود بالفعل، الانتقال للملف التالي`);
        loadScriptsSequentially(scripts, index + 1);
        return;
    }
    
    // إنشاء عنصر السكربت
    const scriptElement = document.createElement('script');
    scriptElement.id = script.id;
    scriptElement.src = script.src;
    
    // مستمع حدث اكتمال التحميل
    scriptElement.onload = function() {
        console.log(`تم تحميل الملف: ${script.src}`);
        loadScriptsSequentially(scripts, index + 1);
    };
    
    // مستمع حدث خطأ في التحميل
    scriptElement.onerror = function() {
        console.error(`فشل تحميل الملف: ${script.src}`);
        loadScriptsSequentially(scripts, index + 1);
    };
    
    // إضافة السكربت إلى نهاية الصفحة
    document.body.appendChild(scriptElement);
}

/**
 * تهيئة الأنظمة المختلفة
 */
function initializeSystems() {
    // تهيئة نظام ملف المستخدم المحسن
    if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.init === 'function') {
        setTimeout(function() {
            window.EnhancedUserProfile.init();
        }, 100);
    }
    
    // تهيئة نظام التكامل المحسن
    if (window.EnhancedIntegration) {
        setTimeout(function() {
            if (typeof window.EnhancedIntegration.initializeEnhancedComponents === 'function') {
                window.EnhancedIntegration.initializeEnhancedComponents();
            }
            
            if (typeof window.EnhancedIntegration.setupEnhancedUserMenuIntegration === 'function') {
                window.EnhancedIntegration.setupEnhancedUserMenuIntegration();
            }
        }, 200);
    }
    
    // تهيئة نظام إدارة المستخدمين
    if (window.UserManagement && typeof window.UserManagement.init === 'function') {
        setTimeout(function() {
            window.UserManagement.init();
        }, 300);
    }
}

/**
 * إضافة مستمعي الأحداث الرئيسية
 */
function addMainEventListeners() {
    // مستمع لتغييرات حالة المصادقة
    if (window.firebase && window.firebase.auth) {
        window.firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log('تم تسجيل الدخول، تحديث واجهة المستخدم');
                
                // تحديث واجهة المستخدم بعد تسجيل الدخول
                if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.updateUserInfo === 'function') {
                    window.EnhancedUserProfile.updateUserInfo();
                }
                
                // تحديث الصلاحيات
                if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.updateElementsAccess === 'function') {
                    window.EnhancedUserProfile.updateElementsAccess();
                }
            }
        });
    }
    
    // مستمع لحدث تغيير الصفحة
    window.addEventListener('hashchange', function() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const pageLink = document.querySelector(`.nav-link[data-page="${hash}"]`);
            if (pageLink) {
                pageLink.click();
            }
        }
    });
}

/**
 * إنشاء العناصر المطلوبة في الواجهة
 */
function createRequiredUIElements() {
    // إضافة عنصر إدارة المستخدمين للشريط الجانبي إذا لم يكن موجودًا
    if (!document.querySelector('.nav-link[data-page="users"]')) {
        createUserManagementNavItem();
    }
    
    // التأكد من وجود صفحة إدارة المستخدمين
    if (!document.getElementById('users-page')) {
        createUsersPage();
    }
}

/**
 * إنشاء عنصر إدارة المستخدمين في الشريط الجانبي
 */
function createUserManagementNavItem() {
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
    navItem.querySelector('.nav-link').addEventListener('click', function(e) {
        e.preventDefault();
        
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
        
        // إظهار صفحة إدارة المستخدمين
        const usersPage = document.getElementById('users-page');
        if (usersPage) {
            usersPage.classList.add('active');
            
            // تحديث عنوان الصفحة
            const pageTitle = document.querySelector('.page-title');
            if (pageTitle) {
                pageTitle.textContent = 'إدارة المستخدمين';
            }
            
            // تحديث قائمة المستخدمين
            if (window.UserManagement && typeof window.UserManagement.renderUsersList === 'function') {
                window.UserManagement.renderUsersList();
            }
        } else {
            createUsersPage();
        }
    });
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
        
        // تفعيل الصفحة
        usersPage.classList.add('active');
        
        // تحديث عنوان الصفحة
        const pageTitle = document.querySelector('.page-title');
        if (pageTitle) {
            pageTitle.textContent = 'إدارة المستخدمين';
        }
        
        // إضافة مستمع حدث لزر إضافة مستخدم
        const addUserBtn = usersPage.querySelector('#add-user-btn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', function() {
                if (window.UserManagement && typeof window.UserManagement.showAddUserModal === 'function') {
                    window.UserManagement.showAddUserModal();
                } else {
                    showAddUserModalFallback();
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
        
        // إضافة مستمع حدث لزر قائمة الشريط الجانبي
        const toggleSidebarBtn = usersPage.querySelector('.toggle-sidebar');
        if (toggleSidebarBtn) {
            toggleSidebarBtn.addEventListener('click', function() {
                document.querySelector('.sidebar').classList.toggle('collapsed');
                document.querySelector('.main-content').classList.toggle('expanded');
            });
        }
        
        // تحميل قائمة المستخدمين
        if (window.UserManagement && typeof window.UserManagement.renderUsersList === 'function') {
            window.UserManagement.renderUsersList();
        }
    } else {
        console.warn('لم يتم العثور على عنصر main-content');
    }
}

/**
 * عرض نافذة إضافة مستخدم (في حالة عدم وجود نظام إدارة المستخدمين)
 */
function showAddUserModalFallback() {
    // إنشاء محتوى النافذة
    const modalContent = `
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
                    <label class="form-label">تأكيد كلمة المرور</label>
                    <div class="password-input-container">
                        <input type="password" class="form-input" id="new-user-password-confirm" required>
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
    `;
    
    // عرض النافذة
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
        
        // مستمع حدث إضافة المستخدم
        const saveButton = document.getElementById('save-new-user-btn');
        if (saveButton) {
            saveButton.addEventListener('click', function() {
                const email = document.getElementById('new-user-email').value.trim();
                const name = document.getElementById('new-user-name').value.trim();
                const password = document.getElementById('new-user-password').value;
                const confirmPassword = document.getElementById('new-user-password-confirm').value;
                
                // التحقق من البيانات
                if (!email || !name || !password || !confirmPassword) {
                    showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    showNotification('كلمة المرور وتأكيدها غير متطابقين', 'error');
                    return;
                }
                
                // تغيير حالة الزر
                const originalText = this.textContent;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإضافة...';
                this.disabled = true;
                
                // إضافة المستخدم باستخدام Firebase
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(userCredential => {
                        // تم إنشاء المستخدم بنجاح
                        const user = userCredential.user;
                        
                        // تحديث اسم المستخدم
                        return user.updateProfile({
                            displayName: name
                        })
                        .then(() => {
                            // إنشاء ملف شخصي للمستخدم في قاعدة البيانات
                            return firebase.database().ref(`users/${user.uid}/profile`).set({
                                displayName: name,
                                email: email,
                                type: document.getElementById('new-user-type').value,
                                createdAt: new Date().toISOString(),
                                createdBy: firebase.auth().currentUser ? firebase.auth().currentUser.uid : null
                            });
                        })
                        .then(() => {
                            // إغلاق النافذة
                            closeModal('add-user-modal');
                            
                            // عرض رسالة نجاح
                            showNotification('تم إضافة المستخدم بنجاح', 'success');
                            
                            // تحديث قائمة المستخدمين
                            if (window.UserManagement && typeof window.UserManagement.renderUsersList === 'function') {
                                window.UserManagement.renderUsersList();
                            } else {
                                // تحديث الصفحة بعد فترة
                                setTimeout(function() {
                                    location.reload();
                                }, 2000);
                            }
                        });
                    })
                    .catch(error => {
                        console.error('خطأ في إنشاء المستخدم:', error);
                        
                        let errorMessage = 'حدث خطأ أثناء إنشاء المستخدم';
                        
                        if (error.code === 'auth/email-already-in-use') {
                            errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
                        } else if (error.code === 'auth/invalid-email') {
                            errorMessage = 'البريد الإلكتروني غير صالح';
                        } else if (error.code === 'auth/weak-password') {
                            errorMessage = 'كلمة المرور ضعيفة جداً';
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
 * عرض نافذة منبثقة
 * @param {string} id - معرف النافذة
 * @param {string} content - محتوى النافذة
 * @param {Function} onRendered - دالة تنفذ بعد إضافة النافذة للصفحة
 */
function showModal(id, content, onRendered) {
    // التحقق من وجود النافذة مسبقًا
    let modalElement = document.getElementById(id);
    
    if (modalElement) {
        // إذا كانت النافذة موجودة، نحدث المحتوى فقط
        modalElement.querySelector('.modal').innerHTML = content;
    } else {
        // إنشاء عنصر النافذة
        modalElement = document.createElement('div');
        modalElement.id = id;
        modalElement.className = 'modal-overlay';
        
        // إضافة المحتوى
        const modalContent = document.createElement('div');
        modalContent.className = 'modal';
        modalContent.innerHTML = content;
        
        modalElement.appendChild(modalContent);
        
        // إضافة النافذة للصفحة
        document.body.appendChild(modalElement);
        
        // إضافة مستمعي الأحداث للأزرار
        setupModalListeners(modalElement);
    }
    
    // إظهار النافذة
    modalElement.classList.add('active');
    
    // تنفيذ الدالة بعد إضافة النافذة
    if (typeof onRendered === 'function') {
        onRendered(modalElement);
    }
    
    return modalElement;
}

/**
 * إضافة مستمعي الأحداث للنافذة
 * @param {HTMLElement} modalElement - عنصر النافذة
 */
function setupModalListeners(modalElement) {
    // أزرار الإغلاق
    const closeButtons = modalElement.querySelectorAll('.modal-close, .modal-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            closeModal(modalElement.id);
        });
    });
    
    // إغلاق النافذة عند النقر خارجها
    modalElement.addEventListener('click', function(e) {
        if (e.target === modalElement) {
            closeModal(modalElement.id);
        }
    });
}

/**
 * إغلاق نافذة منبثقة
 * @param {string} id - معرف النافذة
 */
function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * عرض إشعار
 * @param {string} message - رسالة الإشعار
 * @param {string} type - نوع الإشعار (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // استخدام دالة الإشعارات العامة إذا كانت متوفرة
    if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.showNotification === 'function') {
        window.EnhancedUserProfile.showNotification(message, type);
        return;
    }
    
    // التحقق من وجود عنصر الإشعار
    let notificationElement = document.getElementById('notification-container');
    
    // إنشاء حاوية الإشعارات إذا لم تكن موجودة
    if (!notificationElement) {
        notificationElement = document.createElement('div');
        notificationElement.id = 'notification-container';
        notificationElement.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            direction: rtl;
        `;
        document.body.appendChild(notificationElement);
    }
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        background-color: white;
        color: #333;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 12px 16px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        min-width: 300px;
        max-width: 450px;
        position: relative;
        border-right: 4px solid #3b82f6;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s ease;
    `;
    
    // تعيين لون الحدود حسب نوع الإشعار
    switch (type) {
        case 'success':
            notification.style.borderColor = '#10b981';
            break;
        case 'error':
            notification.style.borderColor = '#ef4444';
            break;
        case 'warning':
            notification.style.borderColor = '#f59e0b';
            break;
        case 'info':
            notification.style.borderColor = '#3b82f6';
            break;
    }
    
    // إضافة الأيقونة
    const iconColor = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    }[type] || '#3b82f6';
    
    const iconClass = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type] || 'fa-info-circle';
    
    // إضافة المحتوى
    notification.innerHTML = `
        <div style="color: ${iconColor}; font-size: 1.5rem; margin-left: 12px;">
            <i class="fas ${iconClass}"></i>
        </div>
        <div style="flex: 1;">
            <div style="font-weight: 600; margin-bottom: 4px;">${getNotificationTitle(type)}</div>
            <div style="color: #666;">${message}</div>
        </div>
        <button style="background: none; border: none; cursor: pointer; font-size: 1.2rem; color: #999; padding: 0;">×</button>
    `;
    
    // إضافة الإشعار للحاوية
    notificationElement.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // إغلاق الإشعار بعد 5 ثوانٍ
    const timeout = setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // مستمع حدث زر الإغلاق
    const closeButton = notification.querySelector('button');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            clearTimeout(timeout);
            hideNotification(notification);
        });
    }
}

/**
 * إخفاء الإشعار
 * @param {HTMLElement} notification - عنصر الإشعار
 */
function hideNotification(notification) {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-20px)';
    
    // إزالة الإشعار من الصفحة بعد انتهاء الرسوم المتحركة
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
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

// تصدير الدوال للاستخدام الخارجي
window.MainIntegration = {
    createUsersPage,
    showAddUserModalFallback,
    showModal,
    closeModal,
    showNotification
};

// تنفيذ التكامل عند تحميل الصفحة
if (document.readyState === 'complete') {
    createUserManagementNavItem();
} else {
    window.addEventListener('load', function() {
        setTimeout(function() {
            createUserManagementNavItem();
        }, 500);
    });
}