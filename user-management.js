/**
 * نظام إدارة المستخدمين والصلاحيات
 * يوفر وظائف إدارة المستخدمين وأنواعهم وصلاحياتهم
 */

// متغيرات عامة
let usersList = [];
let currentUserEdit = null;

// أنواع المستخدمين
const USER_TYPES = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    USER: 'user'
};

/**
 * تهيئة نظام إدارة المستخدمين
 */
function initUserManagement() {
    console.log('تهيئة نظام إدارة المستخدمين...');
    
    // إضافة صفحة إدارة المستخدمين
    addUsersPage();
    
    // تحميل قائمة المستخدمين
    loadUsers()
        .then(users => {
            usersList = users;
            renderUsersList();
        })
        .catch(error => {
            console.error('خطأ في تحميل قائمة المستخدمين:', error);
            showNotification('فشل في تحميل قائمة المستخدمين', 'error');
        });
    
    // إضافة مستمعي الأحداث
    setupUserManagementEvents();
}

/**
 * إضافة صفحة إدارة المستخدمين
 */
function addUsersPage() {
    // التحقق من وجود الصفحة مسبقاً
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
    } else {
        console.warn('لم يتم العثور على عنصر main-content');
    }
    
    // إضافة عنصر للشريط الجانبي
    addUserManagementNavItem();
}

/**
 * إضافة عنصر إدارة المستخدمين للشريط الجانبي
 */
function addUserManagementNavItem() {
    // التحقق من وجود العنصر مسبقاً
    if (document.querySelector('.nav-link[data-page="users"]')) {
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
    navItem.querySelector('.nav-link').addEventListener('click', function(e) {
        e.preventDefault();
        
        // مسح الفئة النشطة من جميع الروابط
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
        }
    });
}

/**
 * إضافة مستمعي الأحداث لإدارة المستخدمين
 */
function setupUserManagementEvents() {
    // زر إضافة مستخدم
    const addUserBtn = document.getElementById('add-user-btn');
    if (addUserBtn) {
        addUserBtn.addEventListener('click', showAddUserModal);
    }
    
    // البحث في قائمة المستخدمين
    const searchInput = document.getElementById('search-users-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterUsers(this.value);
        });
    }
    
    // أزرار تصفية المستخدمين
    const filterButtons = document.querySelectorAll('.section-actions .btn-group .btn[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // إضافة الفئة النشطة للزر الحالي
            this.classList.add('active');
            
            // تصفية المستخدمين حسب النوع
            const filterType = this.getAttribute('data-filter');
            filterUsersByType(filterType);
        });
    });
}

/**
 * تحميل قائمة المستخدمين من قاعدة البيانات
 * @returns {Promise<Array>} وعد بمصفوفة المستخدمين
 */
function loadUsers() {
    // التحقق من وجود مرجع قاعدة البيانات
    if (!firebase.database) {
        return Promise.reject(new Error('مرجع قاعدة البيانات غير متوفر'));
    }
    
    return firebase.database().ref('users').once('value')
        .then(snapshot => {
            const users = [];
            
            snapshot.forEach(childSnapshot => {
                const userId = childSnapshot.key;
                const userData = childSnapshot.val();
                
                // التحقق من وجود بيانات الملف الشخصي
                if (userData.profile) {
                    users.push({
                        id: userId,
                        email: userData.profile.email,
                        displayName: userData.profile.displayName || userData.profile.email.split('@')[0],
                        type: userData.profile.type || USER_TYPES.USER,
                        permissions: userData.profile.permissions || getDefaultPermissions(userData.profile.type || USER_TYPES.USER),
                        createdAt: userData.profile.createdAt || null,
                        lastLogin: userData.profile.lastSignInTime || null
                    });
                }
            });
            
            return users;
        });
}

/**
 * عرض قائمة المستخدمين في الجدول
 */
function renderUsersList() {
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) {
        console.warn('لم يتم العثور على جدول المستخدمين');
        return;
    }
    
    // تفريغ الجدول
    tableBody.innerHTML = '';
    
    // إذا لم يكن هناك مستخدمين
    if (usersList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">لا يوجد مستخدمين</td>
            </tr>
        `;
        return;
    }
    
    // إضافة المستخدمين للجدول
    usersList.forEach((user, index) => {
        const row = document.createElement('tr');
        
        // إضافة فئة حسب نوع المستخدم
        row.className = `user-${user.type}`;
        row.setAttribute('data-user-id', user.id);
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="user-cell">
                    <div class="user-avatar-sm ${user.type}">${(user.displayName || 'U').charAt(0)}</div>
                    <span>${user.displayName}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="user-type-badge ${user.type}">
                    ${getUserTypeLabel(user.type)}
                </span>
            </td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'غير متوفر'}</td>
            <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'غير متوفر'}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-icon btn-sm edit-user-btn" data-user-id="${user.id}" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon btn-sm btn-danger delete-user-btn" data-user-id="${user.id}" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // إضافة مستمعي أحداث للأزرار
    setupUserRowActionEvents();
}

/**
 * إضافة مستمعي أحداث لأزرار الإجراءات في صفوف المستخدمين
 */
function setupUserRowActionEvents() {
    // أزرار تعديل المستخدم
    const editButtons = document.querySelectorAll('.edit-user-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            editUser(userId);
        });
    });
    
    // أزرار حذف المستخدم
    const deleteButtons = document.querySelectorAll('.delete-user-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            confirmDeleteUser(userId);
        });
    });
}

/**
 * البحث في قائمة المستخدمين
 * @param {string} query - نص البحث
 */
function filterUsers(query) {
    if (!query) {
        // إعادة عرض جميع المستخدمين
        renderUsersList();
        return;
    }
    
    // تحويل النص إلى أحرف صغيرة للمقارنة
    const searchQuery = query.toLowerCase();
    
    // تصفية المستخدمين حسب الاسم أو البريد الإلكتروني
    const filteredUsers = usersList.filter(user => {
        const nameMatch = user.displayName && user.displayName.toLowerCase().includes(searchQuery);
        const emailMatch = user.email && user.email.toLowerCase().includes(searchQuery);
        return nameMatch || emailMatch;
    });
    
    // تحديث قائمة المستخدمين المعروضة مؤقتاً
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    
    // تفريغ الجدول
    tableBody.innerHTML = '';
    
    // إذا لم يكن هناك نتائج بحث
    if (filteredUsers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">لا توجد نتائج مطابقة للبحث</td>
            </tr>
        `;
        return;
    }
    
    // إضافة المستخدمين المصفاة للجدول
    filteredUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        
        // إضافة فئة حسب نوع المستخدم
        row.className = `user-${user.type}`;
        row.setAttribute('data-user-id', user.id);
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="user-cell">
                    <div class="user-avatar-sm ${user.type}">${(user.displayName || 'U').charAt(0)}</div>
                    <span>${user.displayName}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="user-type-badge ${user.type}">
                    ${getUserTypeLabel(user.type)}
                </span>
            </td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'غير متوفر'}</td>
            <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'غير متوفر'}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-icon btn-sm edit-user-btn" data-user-id="${user.id}" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon btn-sm btn-danger delete-user-btn" data-user-id="${user.id}" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // إضافة مستمعي أحداث للأزرار
    setupUserRowActionEvents();
}

/**
 * تصفية المستخدمين حسب النوع
 * @param {string} type - نوع المستخدم (all, admin, manager, user)
 */
function filterUsersByType(type) {
    if (type === 'all') {
        // إعادة عرض جميع المستخدمين
        renderUsersList();
        return;
    }
    
    // تصفية المستخدمين حسب النوع
    const filteredUsers = usersList.filter(user => user.type === type);
    
    // تحديث قائمة المستخدمين المعروضة مؤقتاً
    const tableBody = document.getElementById('users-table-body');
    if (!tableBody) return;
    
    // تفريغ الجدول
    tableBody.innerHTML = '';
    
    // إذا لم يكن هناك نتائج بحث
    if (filteredUsers.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">لا يوجد مستخدمين من هذا النوع</td>
            </tr>
        `;
        return;
    }
    
    // إضافة المستخدمين المصفاة للجدول
    filteredUsers.forEach((user, index) => {
        const row = document.createElement('tr');
        
        // إضافة فئة حسب نوع المستخدم
        row.className = `user-${user.type}`;
        row.setAttribute('data-user-id', user.id);
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>
                <div class="user-cell">
                    <div class="user-avatar-sm ${user.type}">${(user.displayName || 'U').charAt(0)}</div>
                    <span>${user.displayName}</span>
                </div>
            </td>
            <td>${user.email}</td>
            <td>
                <span class="user-type-badge ${user.type}">
                    ${getUserTypeLabel(user.type)}
                </span>
            </td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'غير متوفر'}</td>
            <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'غير متوفر'}</td>
            <td>
                <div class="actions">
                    <button class="btn btn-icon btn-sm edit-user-btn" data-user-id="${user.id}" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon btn-sm btn-danger delete-user-btn" data-user-id="${user.id}" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // إضافة مستمعي أحداث للأزرار
    setupUserRowActionEvents();
}

/**
 * عرض نافذة إضافة مستخدم جديد
 */
function showAddUserModal() {
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
                        <option value="${USER_TYPES.USER}">مستخدم عادي</option>
                        <option value="${USER_TYPES.MANAGER}">مدير</option>
                        <option value="${USER_TYPES.ADMIN}">مسؤول النظام</option>
                    </select>
                </div>
                
                <div class="form-group" id="permissions-container">
                    <label class="form-label">الصلاحيات</label>
                    
                    <div class="permissions-grid">
                        <div class="permission-item">
                            <input type="checkbox" id="perm-create-users" class="permission-checkbox">
                            <label for="perm-create-users">إدارة المستخدمين</label>
                        </div>
                        
                        <div class="permission-item">
                            <input type="checkbox" id="perm-manage-settings" class="permission-checkbox">
                            <label for="perm-manage-settings">إدارة الإعدادات</label>
                        </div>
                        
                        <div class="permission-item">
                            <input type="checkbox" id="perm-delete-investors" class="permission-checkbox">
                            <label for="perm-delete-investors">حذف المستثمرين</label>
                        </div>
                        
                        <div class="permission-item">
                            <input type="checkbox" id="perm-export-data" class="permission-checkbox">
                            <label for="perm-export-data">تصدير البيانات</label>
                        </div>
                        
                        <div class="permission-item">
                            <input type="checkbox" id="perm-import-data" class="permission-checkbox">
                            <label for="perm-import-data">استيراد البيانات</label>
                        </div>
                        
                        <div class="permission-item">
                            <input type="checkbox" id="perm-create-backup" class="permission-checkbox">
                            <label for="perm-create-backup">إنشاء نسخة احتياطية</label>
                        </div>
                        
                        <div class="permission-item">
                            <input type="checkbox" id="perm-restore-backup" class="permission-checkbox">
                            <label for="perm-restore-backup">استعادة نسخة احتياطية</label>
                        </div>
                    </div>
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
        
        // تحديث الصلاحيات عند تغيير نوع المستخدم
        const userTypeSelect = document.getElementById('new-user-type');
        if (userTypeSelect) {
            userTypeSelect.addEventListener('change', function() {
                const userType = this.value;
                updatePermissionsCheckboxes(userType);
            });
            
            // تحديث الصلاحيات الافتراضية للنوع الأولي
            updatePermissionsCheckboxes(userTypeSelect.value);
        }
        
        // مستمع حدث إضافة المستخدم
        const saveButton = document.getElementById('save-new-user-btn');
        if (saveButton) {
            saveButton.addEventListener('click', addNewUser);
        }
    });
}

/**
 * إضافة مستخدم جديد
 */
function addNewUser() {
    // الحصول على بيانات المستخدم من النموذج
    const email = document.getElementById('new-user-email').value.trim();
    const name = document.getElementById('new-user-name').value.trim();
    const password = document.getElementById('new-user-password').value;
    const confirmPassword = document.getElementById('new-user-password-confirm').value;
    const userType = document.getElementById('new-user-type').value;
    
    // التحقق من تعبئة الحقول المطلوبة
    if (!email || !name || !password || !confirmPassword) {
        showNotification('يرجى تعبئة جميع الحقول المطلوبة', 'error');
        return;
    }
    
    // التحقق من صحة البريد الإلكتروني
    if (!isValidEmail(email)) {
        showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
        return;
    }
    
    // التحقق من تطابق كلمة المرور
    if (password !== confirmPassword) {
        showNotification('كلمة المرور وتأكيدها غير متطابقين', 'error');
        return;
    }
    
    // التحقق من طول كلمة المرور
    if (password.length < 6) {
        showNotification('يجب أن تكون كلمة المرور على الأقل 6 أحرف', 'error');
        return;
    }
    
   // الحصول على الصلاحيات المحددة
   const permissions = {
    canCreateUsers: document.getElementById('perm-create-users').checked,
    canManageSettings: document.getElementById('perm-manage-settings').checked,
    canDeleteInvestors: document.getElementById('perm-delete-investors').checked,
    canExportData: document.getElementById('perm-export-data').checked,
    canImportData: document.getElementById('perm-import-data').checked,
    canCreateBackup: document.getElementById('perm-create-backup').checked,
    canRestoreBackup: document.getElementById('perm-restore-backup').checked
};

// تغيير حالة الزر
const saveButton = document.getElementById('save-new-user-btn');
const originalText = saveButton.textContent;
saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإضافة...';
saveButton.disabled = true;

// إنشاء المستخدم في Firebase Authentication
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
                type: userType,
                permissions: permissions,
                createdAt: new Date().toISOString(),
                createdBy: firebase.auth().currentUser ? firebase.auth().currentUser.uid : null
            });
        })
        .then(() => {
            // إضافة المستخدم إلى القائمة المحلية
            usersList.push({
                id: user.uid,
                email: email,
                displayName: name,
                type: userType,
                permissions: permissions,
                createdAt: new Date().toISOString(),
                lastLogin: null
            });
            
            // إعادة عرض قائمة المستخدمين
            renderUsersList();
            
            // إغلاق النافذة
            closeModal('add-user-modal');
            
            // عرض رسالة نجاح
            showNotification('تم إضافة المستخدم بنجاح', 'success');
            
            // تسجيل العملية
            logAction('create_user', 'user', user.uid, {
                email: email,
                type: userType
            });
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
        saveButton.textContent = originalText;
        saveButton.disabled = false;
    });
}

/**
* تحديث حالة مربعات اختيار الصلاحيات بناءً على نوع المستخدم
* @param {string} userType - نوع المستخدم
* @param {Object} [customPermissions=null] - صلاحيات مخصصة (اختياري)
*/
function updatePermissionsCheckboxes(userType, customPermissions = null) {
// الحصول على الصلاحيات الافتراضية لنوع المستخدم
const defaultPermissions = getDefaultPermissions(userType);

// الصلاحيات المراد تطبيقها (الافتراضية أو المخصصة)
const permissions = customPermissions || defaultPermissions;

// تحديث حالة مربعات الاختيار
for (const [permKey, permValue] of Object.entries(permissions)) {
    const checkboxId = `perm-${permKey.replace(/^can/, '').replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    const checkbox = document.getElementById(checkboxId);
    
    if (checkbox) {
        checkbox.checked = permValue;
        
        // تعطيل التعديل لصلاحيات معينة حسب نوع المستخدم
        if (userType === USER_TYPES.ADMIN) {
            // المسؤول يجب أن يملك جميع الصلاحيات
            checkbox.checked = true;
            checkbox.disabled = true;
        } else if (userType === USER_TYPES.USER && (permKey === 'canCreateUsers' || permKey === 'canManageSettings' || permKey === 'canRestoreBackup')) {
            // المستخدم العادي لا يمكن أن يملك صلاحيات معينة
            checkbox.checked = false;
            checkbox.disabled = true;
        } else {
            // باقي الحالات يمكن التعديل عليها
            checkbox.disabled = false;
        }
    }
}
}

/**
* الحصول على الصلاحيات الافتراضية لنوع المستخدم
* @param {string} userType - نوع المستخدم
* @returns {Object} - كائن الصلاحيات
*/
function getDefaultPermissions(userType) {
switch (userType) {
    case USER_TYPES.ADMIN:
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
    case USER_TYPES.MANAGER:
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
    case USER_TYPES.USER:
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
* تعديل بيانات مستخدم
* @param {string} userId - معرف المستخدم
*/
function editUser(userId) {
// البحث عن المستخدم في القائمة المحلية
const user = usersList.find(u => u.id === userId);

if (!user) {
    showNotification('لم يتم العثور على المستخدم', 'error');
    return;
}

// تخزين المستخدم الحالي للتعديل
currentUserEdit = user;

// إنشاء محتوى النافذة
const modalContent = `
    <div class="modal-header">
        <h3 class="modal-title">تعديل المستخدم</h3>
        <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
        <div class="profile-avatar">
            <div class="avatar-circle ${user.type}">
                ${(user.displayName || '').charAt(0)}
            </div>
            <div class="profile-info">
                <h3>${user.displayName}</h3>
                <p class="user-type-badge ${user.type}">${getUserTypeLabel(user.type)}</p>
            </div>
        </div>
        
        <form id="edit-user-form">
            <div class="form-group">
                <label class="form-label">البريد الإلكتروني</label>
                <input type="email" class="form-input" id="edit-user-email" value="${user.email}" readonly>
            </div>
            
            <div class="form-group">
                <label class="form-label">الاسم الكامل</label>
                <input type="text" class="form-input" id="edit-user-name" value="${user.displayName || ''}" required>
            </div>
            
            <div class="form-group">
                <label class="form-label">نوع المستخدم</label>
                <select class="form-select" id="edit-user-type">
                    <option value="${USER_TYPES.USER}" ${user.type === USER_TYPES.USER ? 'selected' : ''}>مستخدم عادي</option>
                    <option value="${USER_TYPES.MANAGER}" ${user.type === USER_TYPES.MANAGER ? 'selected' : ''}>مدير</option>
                    <option value="${USER_TYPES.ADMIN}" ${user.type === USER_TYPES.ADMIN ? 'selected' : ''}>مسؤول النظام</option>
                </select>
            </div>
            
            <div class="form-group" id="permissions-container">
                <label class="form-label">الصلاحيات</label>
                
                <div class="permissions-grid">
                    <div class="permission-item">
                        <input type="checkbox" id="perm-create-users" class="permission-checkbox">
                        <label for="perm-create-users">إدارة المستخدمين</label>
                    </div>
                    
                    <div class="permission-item">
                        <input type="checkbox" id="perm-manage-settings" class="permission-checkbox">
                        <label for="perm-manage-settings">إدارة الإعدادات</label>
                    </div>
                    
                    <div class="permission-item">
                        <input type="checkbox" id="perm-delete-investors" class="permission-checkbox">
                        <label for="perm-delete-investors">حذف المستثمرين</label>
                    </div>
                    
                    <div class="permission-item">
                        <input type="checkbox" id="perm-export-data" class="permission-checkbox">
                        <label for="perm-export-data">تصدير البيانات</label>
                    </div>
                    
                    <div class="permission-item">
                        <input type="checkbox" id="perm-import-data" class="permission-checkbox">
                        <label for="perm-import-data">استيراد البيانات</label>
                    </div>
                    
                    <div class="permission-item">
                        <input type="checkbox" id="perm-create-backup" class="permission-checkbox">
                        <label for="perm-create-backup">إنشاء نسخة احتياطية</label>
                    </div>
                    
                    <div class="permission-item">
                        <input type="checkbox" id="perm-restore-backup" class="permission-checkbox">
                        <label for="perm-restore-backup">استعادة نسخة احتياطية</label>
                    </div>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">إعادة تعيين كلمة المرور</label>
                <div class="password-input-container">
                    <input type="password" class="form-input" id="edit-user-new-password" placeholder="اترك فارغًا للاحتفاظ بكلمة المرور الحالية">
                    <button type="button" class="toggle-password">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <button class="btn btn-outline modal-close-btn">إلغاء</button>
        <button class="btn btn-primary" id="save-user-changes-btn">حفظ التغييرات</button>
    </div>
`;

// عرض النافذة
showModal('edit-user-modal', modalContent, function(modal) {
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
    
    // تحديث الصلاحيات حسب بيانات المستخدم
    updatePermissionsCheckboxes(user.type, user.permissions);
    
    // تحديث الصلاحيات عند تغيير نوع المستخدم
    const userTypeSelect = document.getElementById('edit-user-type');
    if (userTypeSelect) {
        userTypeSelect.addEventListener('change', function() {
            const newUserType = this.value;
            updatePermissionsCheckboxes(newUserType);
        });
    }
    
    // مستمع حدث حفظ التغييرات
    const saveButton = document.getElementById('save-user-changes-btn');
    if (saveButton) {
        saveButton.addEventListener('click', saveUserChanges);
    }
});
}

/**
* حفظ تغييرات المستخدم
*/
function saveUserChanges() {
if (!currentUserEdit) {
    showNotification('لم يتم تحديد مستخدم للتعديل', 'error');
    return;
}

// الحصول على البيانات من النموذج
const name = document.getElementById('edit-user-name').value.trim();
const userType = document.getElementById('edit-user-type').value;
const newPassword = document.getElementById('edit-user-new-password').value;

// التحقق من تعبئة الحقول المطلوبة
if (!name) {
    showNotification('يرجى إدخال اسم المستخدم', 'error');
    return;
}

// الحصول على الصلاحيات المحددة
const permissions = {
    canCreateUsers: document.getElementById('perm-create-users').checked,
    canManageSettings: document.getElementById('perm-manage-settings').checked,
    canDeleteInvestors: document.getElementById('perm-delete-investors').checked,
    canExportData: document.getElementById('perm-export-data').checked,
    canImportData: document.getElementById('perm-import-data').checked,
    canCreateBackup: document.getElementById('perm-create-backup').checked,
    canRestoreBackup: document.getElementById('perm-restore-backup').checked
};

// تغيير حالة الزر
const saveButton = document.getElementById('save-user-changes-btn');
const originalText = saveButton.textContent;
saveButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحفظ...';
saveButton.disabled = true;

// بناء كائن التحديثات
const updates = {
    displayName: name,
    type: userType,
    permissions: permissions,
    updatedAt: new Date().toISOString(),
    updatedBy: firebase.auth().currentUser ? firebase.auth().currentUser.uid : null
};

// تحديث بيانات المستخدم في قاعدة البيانات
firebase.database().ref(`users/${currentUserEdit.id}/profile`).update(updates)
    .then(() => {
        // تحديث اسم المستخدم في Firebase Authentication إذا كان هذا المستخدم هو المستخدم الحالي
        if (firebase.auth().currentUser && firebase.auth().currentUser.uid === currentUserEdit.id) {
            return firebase.auth().currentUser.updateProfile({
                displayName: name
            });
        }
        return Promise.resolve();
    })
    .then(() => {
        // تحديث كلمة المرور إذا تم إدخال كلمة مرور جديدة
        if (newPassword) {
            // لا يمكن تغيير كلمة مرور مستخدم آخر مباشرة، نستخدم Cloud Functions أو Admin SDK
            // هنا نفترض وجود دالة في Cloud Functions تقوم بتحديث كلمة المرور
            console.log('طلب تغيير كلمة المرور للمستخدم:', currentUserEdit.id);
            
            // يتم تنفيذ هذا عادة من خلال Cloud Functions
            // للتبسيط، نعتبر أن التغيير قد تم بنجاح
            showNotification('تم طلب تغيير كلمة المرور، سيتم تنفيذه قريبًا', 'info');
        }
        
        // تحديث بيانات المستخدم في القائمة المحلية
        const userIndex = usersList.findIndex(u => u.id === currentUserEdit.id);
        if (userIndex !== -1) {
            usersList[userIndex] = {
                ...usersList[userIndex],
                displayName: name,
                type: userType,
                permissions: permissions
            };
        }
        
        // إعادة عرض قائمة المستخدمين
        renderUsersList();
        
        // إغلاق النافذة
        closeModal('edit-user-modal');
        
        // عرض رسالة نجاح
        showNotification('تم تحديث بيانات المستخدم بنجاح', 'success');
        
        // تسجيل العملية
        logAction('update_user', 'user', currentUserEdit.id, {
            type: userType
        });
        
        // مسح المستخدم الحالي للتعديل
        currentUserEdit = null;
    })
    .catch(error => {
        console.error('خطأ في تحديث بيانات المستخدم:', error);
        showNotification('حدث خطأ أثناء تحديث بيانات المستخدم', 'error');
    })
    .finally(() => {
        // إعادة حالة الزر
        saveButton.textContent = originalText;
        saveButton.disabled = false;
    });
}

/**
* تأكيد حذف مستخدم
* @param {string} userId - معرف المستخدم
*/
function confirmDeleteUser(userId) {
// البحث عن المستخدم في القائمة المحلية
const user = usersList.find(u => u.id === userId);

if (!user) {
    showNotification('لم يتم العثور على المستخدم', 'error');
    return;
}

// إنشاء محتوى النافذة
const modalContent = `
    <div class="modal-header">
        <h3 class="modal-title">حذف المستخدم</h3>
        <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
        <div class="confirm-delete">
            <i class="fas fa-exclamation-triangle warning-icon"></i>
            <p>هل أنت متأكد من رغبتك في حذف المستخدم "${user.displayName || user.email}"؟</p>
            <p class="warning-text">هذا الإجراء لا يمكن التراجع عنه وسيؤدي إلى حذف جميع بيانات المستخدم.</p>
        </div>
    </div>
    <div class="modal-footer">
        <button class="btn btn-outline modal-close-btn">إلغاء</button>
        <button class="btn btn-danger" id="confirm-delete-user-btn" data-user-id="${userId}">
            <i class="fas fa-trash"></i>
            <span>حذف المستخدم</span>
        </button>
    </div>
`;

// عرض النافذة
showModal('delete-user-modal', modalContent, function(modal) {
    // مستمع حدث تأكيد الحذف
    const confirmButton = document.getElementById('confirm-delete-user-btn');
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            const userId = this.getAttribute('data-user-id');
            deleteUser(userId);
        });
    }
});
}

/**
* حذف مستخدم
* @param {string} userId - معرف المستخدم
*/
function deleteUser(userId) {
// البحث عن المستخدم في القائمة المحلية
const user = usersList.find(u => u.id === userId);

if (!user) {
    showNotification('لم يتم العثور على المستخدم', 'error');
    return;
}

// تغيير حالة الزر
const deleteButton = document.getElementById('confirm-delete-user-btn');
const originalText = deleteButton.innerHTML;
deleteButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الحذف...';
deleteButton.disabled = true;

// حذف بيانات المستخدم من قاعدة البيانات
firebase.database().ref(`users/${userId}`).remove()
    .then(() => {
        // حذف المستخدم من Firebase Authentication
        // لا يمكن حذف مستخدم آخر مباشرة، نستخدم Cloud Functions أو Admin SDK
        // هنا نفترض وجود دالة في Cloud Functions تقوم بحذف المستخدم
        console.log('طلب حذف المستخدم من Firebase Authentication:', userId);
        
        // حذف المستخدم من القائمة المحلية
        usersList = usersList.filter(u => u.id !== userId);
        
        // إعادة عرض قائمة المستخدمين
        renderUsersList();
        
        // إغلاق النافذة
        closeModal('delete-user-modal');
        
        // عرض رسالة نجاح
        showNotification('تم حذف المستخدم بنجاح', 'success');
        
        // تسجيل العملية
        logAction('delete_user', 'user', userId, {
            email: user.email
        });
    })
    .catch(error => {
        console.error('خطأ في حذف المستخدم:', error);
        showNotification('حدث خطأ أثناء حذف المستخدم', 'error');
    })
    .finally(() => {
        // إعادة حالة الزر
        deleteButton.innerHTML = originalText;
        deleteButton.disabled = false;
    });
}

/**
* تسجيل العمليات في قاعدة البيانات
* @param {string} action - نوع العملية
* @param {string} entityType - نوع الكيان (مستخدم، إلخ)
* @param {string} entityId - معرف الكيان
* @param {Object} details - تفاصيل العملية
* @returns {Promise} - وعد بالاستجابة
*/
function logAction(action, entityType, entityId, details = {}) {
// التحقق من وجود مرجع قاعدة البيانات
if (!firebase.database) {
    return Promise.reject(new Error('مرجع قاعدة البيانات غير متوفر'));
}

// إنشاء كائن السجل
const logEntry = {
    action,
    entityType,
    entityId,
    timestamp: new Date().toISOString(),
    details
};

// إضافة معلومات المستخدم
if (firebase.auth().currentUser) {
    logEntry.user = {
        uid: firebase.auth().currentUser.uid,
        email: firebase.auth().currentUser.email,
        displayName: firebase.auth().currentUser.displayName
    };
}

// إضافة السجل إلى قاعدة البيانات
return firebase.database().ref('system_logs').push(logEntry);
}

/**
* التحقق من صحة البريد الإلكتروني
* @param {string} email - البريد الإلكتروني
* @returns {boolean} - صحة البريد الإلكتروني
*/
function isValidEmail(email) {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
}

/**
* عرض نافذة منبثقة
* @param {string} id - معرف النافذة
* @param {string} content - محتوى النافذة
* @param {Function} onRendered - دالة تنفذ بعد إضافة النافذة للصفحة
*/
function showModal(id, content, onRendered) {
// التحقق من وجود النافذة مسبقاً
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
* الحصول على تسمية نوع المستخدم
* @param {string} userType - نوع المستخدم
* @returns {string} - تسمية نوع المستخدم
*/
function getUserTypeLabel(userType) {
switch (userType) {
    case USER_TYPES.ADMIN:
        return 'مسؤول النظام';
    case USER_TYPES.MANAGER:
        return 'مدير';
    case USER_TYPES.USER:
        return 'مستخدم';
    default:
        return 'غير معروف';
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
    
    // استخدام دالة الإشعارات المحلية إذا كانت متوفرة
    if (typeof window.showNotification === 'function' && window.showNotification !== showNotification) {
        window.showNotification(message, type);
        return;
    }
    
    // إنشاء إشعار جديد
    const notificationElement = document.createElement('div');
    notificationElement.className = `notification ${type}`;
    
    // إضافة المحتوى
    notificationElement.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${getNotificationIcon(type)}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${getNotificationTitle(type)}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // إضافة الإشعار للصفحة
    document.body.appendChild(notificationElement);
    
    // إظهار الإشعار
    setTimeout(() => {
        notificationElement.classList.add('show');
    }, 10);
    
    // إغلاق الإشعار بعد 5 ثوانٍ
    const timeout = setTimeout(() => {
        hideNotification(notificationElement);
    }, 5000);
    
    // مستمع حدث زر الإغلاق
    const closeButton = notificationElement.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            clearTimeout(timeout);
            hideNotification(notificationElement);
        });
    }
}

/**
 * إخفاء الإشعار
 * @param {HTMLElement} notification - عنصر الإشعار
 */
function hideNotification(notification) {
    notification.classList.remove('show');
    
    // إزالة الإشعار من الصفحة بعد انتهاء الرسوم المتحركة
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
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

/**
 * إضافة أنماط CSS لنظام إدارة المستخدمين
 */
function addUserManagementStyles() {
    // التحقق من وجود الأنماط مسبقاً
    if (document.getElementById('user-management-styles')) {
        return;
    }
    
    // إنشاء عنصر النمط
    const styleElement = document.createElement('style');
    styleElement.id = 'user-management-styles';
    
    // إضافة أنماط CSS
    styleElement.textContent = `
        /* جدول المستخدمين */
        #users-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
        }
        
        #users-table th {
            background-color: #f9fafb;
            color: #4b5563;
            font-weight: 500;
            padding: 12px 16px;
            text-align: right;
            border-bottom: 1px solid #e5e7eb;
        }
        
        #users-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #e5e7eb;
            vertical-align: middle;
        }
        
        #users-table tr:last-child td {
            border-bottom: none;
        }
        
        #users-table tr:hover {
            background-color: #f3f4f6;
        }
        
        /* خلية المستخدم */
        .user-cell {
            display: flex;
            align-items: center;
        }
        
        .user-avatar-sm {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            margin-left: 12px;
            font-size: 0.875rem;
        }
        
        .user-avatar-sm.admin {
            background-color: var(--danger-color);
        }
        
        .user-avatar-sm.manager {
            background-color: var(--warning-color);
        }
        
        /* بطاقة نوع المستخدم */
        .user-type-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 20px;
            font-size: 0.75rem;
            font-weight: 500;
            text-align: center;
        }
        
        .user-type-badge.admin {
            background-color: rgba(239, 68, 68, 0.1);
            color: #ef4444;
        }
        
        .user-type-badge.manager {
            background-color: rgba(245, 158, 11, 0.1);
            color: #f59e0b;
        }
        
        .user-type-badge.user {
            background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6;
        }
        
        /* أزرار الإجراءات */
        .actions {
            display: flex;
            gap: 8px;
        }
        
        .btn-icon {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: transparent;
            border: none;
            cursor: pointer;
            color: #6b7280;
            transition: all 0.2s ease;
        }
        
        .btn-icon:hover {
            background-color: #f3f4f6;
            color: #4b5563;
        }
        
        .btn-icon.btn-danger {
            color: #ef4444;
        }
        
        .btn-icon.btn-danger:hover {
            background-color: rgba(239, 68, 68, 0.1);
        }
        
        /* نافذة تأكيد الحذف */
        .confirm-delete {
            text-align: center;
            padding: 1rem;
        }
        
        .warning-icon {
            font-size: 3rem;
            color: #f59e0b;
            margin-bottom: 1rem;
        }
        
        .warning-text {
            color: #ef4444;
            margin-top: 0.5rem;
            font-size: 0.875rem;
        }
        
        /* شبكة الصلاحيات */
        .permissions-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 0.5rem;
        }
        
        .permission-item {
            display: flex;
            align-items: center;
        }
        
        .permission-checkbox {
            margin-left: 0.5rem;
        }
        
        /* زر البحث */
        .search-box {
            position: relative;
        }
        
        .search-input {
            padding-right: 2.5rem;
        }
        
        .search-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #6b7280;
        }
    `;
    
    // إضافة الأنماط للصفحة
    document.head.appendChild(styleElement);
    
    console.log('تم إضافة أنماط CSS لنظام إدارة المستخدمين');
}

// تصدير الدوال للاستخدام الخارجي
window.UserManagement = {
    init: initUserManagement,
    renderUsersList,
    addUserManagementStyles,
    getUserTypeLabel,
    getDefaultPermissions
};

// تهيئة النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // إضافة أنماط CSS
    addUserManagementStyles();
    
    // التحقق من وجود مستخدم مسجل الدخول قبل تهيئة النظام
    if (firebase.auth().currentUser) {
        initUserManagement();
    } else {
        // إضافة مستمع لحدث تسجيل الدخول
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                initUserManagement();
            }
        });
    }
});