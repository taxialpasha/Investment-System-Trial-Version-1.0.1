/**
 * نظام حماية التطبيق والتحكم في الوصول
 * يتحقق من تسجيل دخول المستخدم قبل عرض أي محتوى ويتحكم في الصلاحيات
 */

// متغيرات عامة
let currentUser = null;
let isAuthenticated = false;
let authScreen = null;

// تهيئة نظام حماية التطبيق
document.addEventListener('DOMContentLoaded', function() {
    console.log('تهيئة نظام حماية التطبيق...');
    
    // إضافة أنماط CSS
    addAuthGuardStyles();
    
    // التحقق من وجود مستخدم مسجل الدخول
    checkAuthentication()
        .then(user => {
            if (user) {
                // المستخدم مسجل الدخول، عرض التطبيق
                currentUser = user;
                isAuthenticated = true;
                showApplication();
            } else {
                // المستخدم غير مسجل الدخول، عرض شاشة تسجيل الدخول
                hideApplication();
                showLoginScreen();
            }
        })
        .catch(error => {
            console.error('خطأ في التحقق من حالة المصادقة:', error);
            hideApplication();
            showLoginScreen();
        });
    
    // إضافة مستمع لتغييرات حالة المصادقة
    setupAuthChangeListener();
});

/**
 * التحقق من حالة المصادقة
 * @returns {Promise<Object|null>} - وعد بمعلومات المستخدم أو null
 */
function checkAuthentication() {
    return new Promise((resolve, reject) => {
        if (!window.firebase || !window.firebase.auth) {
            console.warn('Firebase غير متوفر، يتم التحقق من التخزين المحلي...');
            
            // محاولة استرداد معلومات المستخدم من التخزين المحلي
            try {
                const storedUser = localStorage.getItem('currentUser');
                if (storedUser) {
                    resolve(JSON.parse(storedUser));
                } else {
                    resolve(null);
                }
            } catch (error) {
                console.error('خطأ في قراءة معلومات المستخدم من التخزين المحلي:', error);
                resolve(null);
            }
            
            return;
        }
        
        // استخدام Firebase Auth للتحقق من حالة المصادقة
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // المستخدم مسجل الدخول، الحصول على معلومات إضافية من قاعدة البيانات
                firebase.database().ref(`users/${user.uid}/profile`).once('value')
                    .then(snapshot => {
                        const userProfile = snapshot.val() || {};
                        
                        // دمج معلومات المستخدم من Firebase Auth وقاعدة البيانات
                        const fullUserInfo = {
                            uid: user.uid,
                            email: user.email,
                            displayName: userProfile.displayName || user.displayName || user.email,
                            type: userProfile.type || 'user',
                            permissions: userProfile.permissions || getDefaultPermissions(userProfile.type || 'user'),
                            metadata: {
                                createdAt: user.metadata.creationTime,
                                lastLogin: user.metadata.lastSignInTime
                            }
                        };
                        
                        // حفظ معلومات المستخدم في التخزين المحلي للاستخدام اللاحق
                        localStorage.setItem('currentUser', JSON.stringify(fullUserInfo));
                        
                        resolve(fullUserInfo);
                    })
                    .catch(error => {
                        console.error('خطأ في الحصول على معلومات المستخدم:', error);
                        
                        // استخدام الحد الأدنى من معلومات المستخدم
                        const basicUserInfo = {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName || user.email,
                            type: 'user',
                            permissions: getDefaultPermissions('user')
                        };
                        
                        localStorage.setItem('currentUser', JSON.stringify(basicUserInfo));
                        
                        resolve(basicUserInfo);
                    });
            } else {
                // المستخدم غير مسجل الدخول
                localStorage.removeItem('currentUser');
                resolve(null);
            }
        }, reject);
    });
}

/**
 * الحصول على الصلاحيات الافتراضية حسب نوع المستخدم
 * @param {string} userType - نوع المستخدم (admin, manager, user)
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
 * إضافة مستمع لتغييرات حالة المصادقة
 */
function setupAuthChangeListener() {
    if (!window.firebase || !window.firebase.auth) {
        console.warn('Firebase غير متوفر، لن يتم رصد تغييرات حالة المصادقة');
        return;
    }
    
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            // المستخدم قام بتسجيل الدخول
            firebase.database().ref(`users/${user.uid}/profile`).once('value')
                .then(snapshot => {
                    const userProfile = snapshot.val() || {};
                    
                    currentUser = {
                        uid: user.uid,
                        email: user.email,
                        displayName: userProfile.displayName || user.displayName || user.email,
                        type: userProfile.type || 'user',
                        permissions: userProfile.permissions || getDefaultPermissions(userProfile.type || 'user'),
                        metadata: {
                            createdAt: user.metadata.creationTime,
                            lastLogin: user.metadata.lastSignInTime
                        }
                    };
                    
                    isAuthenticated = true;
                    
                    // حفظ معلومات المستخدم في التخزين المحلي
                    localStorage.setItem('currentUser', JSON.stringify(currentUser));
                    
                    // تحديث واجهة المستخدم
                    showApplication();
                    
                    // تسجيل آخر دخول
                    updateLastLogin(user.uid);
                    
                    // إطلاق حدث تسجيل الدخول
                    document.dispatchEvent(new CustomEvent('auth:login', { detail: { user: currentUser } }));
                });
        } else {
            // المستخدم قام بتسجيل الخروج
            currentUser = null;
            isAuthenticated = false;
            
            // مسح معلومات المستخدم من التخزين المحلي
            localStorage.removeItem('currentUser');
            
            // إخفاء التطبيق وعرض شاشة تسجيل الدخول
            hideApplication();
            showLoginScreen();
            
            // إطلاق حدث تسجيل الخروج
            document.dispatchEvent(new CustomEvent('auth:logout'));
        }
    });
}

/**
 * تحديث تاريخ آخر تسجيل دخول
 * @param {string} uid - معرف المستخدم
 */
function updateLastLogin(uid) {
    if (!window.firebase || !window.firebase.database) {
        return;
    }
    
    firebase.database().ref(`users/${uid}/profile`).update({
        lastSignInTime: new Date().toISOString()
    }).catch(error => {
        console.error('خطأ في تحديث تاريخ آخر تسجيل دخول:', error);
    });
}

/**
 * عرض التطبيق بعد تسجيل الدخول
 */
function showApplication() {
    // إزالة شاشة تسجيل الدخول إذا كانت موجودة
    if (authScreen && authScreen.parentNode) {
        authScreen.parentNode.removeChild(authScreen);
        authScreen = null;
    }
    
    // إظهار محتوى التطبيق
    document.body.style.overflow = 'auto';
    document.querySelector('.layout').style.display = 'flex';
    
    // تطبيق الصلاحيات على العناصر
    applyPermissionsToUI();
}

/**
 * إخفاء التطبيق قبل تسجيل الدخول
 */
function hideApplication() {
    // إخفاء محتوى التطبيق
    document.body.style.overflow = 'hidden';
    document.querySelector('.layout').style.display = 'none';
}

/**
 * عرض شاشة تسجيل الدخول
 */
function showLoginScreen() {
    // التحقق من وجود شاشة تسجيل الدخول مسبقاً
    if (authScreen) {
        return;
    }
    
    // إنشاء شاشة تسجيل الدخول
    authScreen = document.createElement('div');
    authScreen.className = 'auth-screen';
    
    // إنشاء محتوى شاشة تسجيل الدخول
    authScreen.innerHTML = `
        <div class="auth-container">
            <div class="auth-logo">
                <i class="fas fa-chart-line"></i>
                <span>نظام الاستثمار المتكامل</span>
            </div>
            
            <div class="auth-tabs">
                <button class="auth-tab active" data-tab="login">تسجيل الدخول</button>
                <button class="auth-tab" data-tab="register">إنشاء حساب</button>
            </div>
            
            <div class="auth-tab-content active" id="login-tab">
                <form id="login-form">
                    <div class="form-group">
                        <label class="form-label">البريد الإلكتروني</label>
                        <input type="email" class="form-input" id="login-email" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">كلمة المرور</label>
                        <div class="password-input-container">
                            <input type="password" class="form-input" id="login-password" required>
                            <button type="button" class="toggle-password">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        <div class="form-check">
                            <input type="checkbox" id="remember-me">
                            <label for="remember-me">تذكرني</label>
                        </div>
                        
                        <a href="#" class="forgot-password-link">نسيت كلمة المرور؟</a>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-block">تسجيل الدخول</button>
                    </div>
                </form>
            </div>
            
            <div class="auth-tab-content" id="register-tab">
                <form id="register-form">
                    <div class="form-group">
                        <label class="form-label">الاسم الكامل</label>
                        <input type="text" class="form-input" id="register-name" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">البريد الإلكتروني</label>
                        <input type="email" class="form-input" id="register-email" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">كلمة المرور</label>
                        <div class="password-input-container">
                            <input type="password" class="form-input" id="register-password" required>
                            <button type="button" class="toggle-password">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">تأكيد كلمة المرور</label>
                        <div class="password-input-container">
                            <input type="password" class="form-input" id="register-confirm-password" required>
                            <button type="button" class="toggle-password">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary btn-block">إنشاء حساب</button>
                    </div>
                </form>
            </div>
            
            <div class="auth-footer">
                <p>© ${new Date().getFullYear()} نظام الاستثمار المتكامل. جميع الحقوق محفوظة.</p>
            </div>
        </div>
    `;
    
    // إضافة شاشة تسجيل الدخول إلى الصفحة
    document.body.appendChild(authScreen);
    
    // إضافة مستمعي الأحداث لشاشة تسجيل الدخول
    setupLoginScreenEvents();
}

/**
 * إضافة مستمعي الأحداث لشاشة تسجيل الدخول
 */
function setupLoginScreenEvents() {
    if (!authScreen) return;
    
    // التبديل بين علامات التبويب
    const tabButtons = authScreen.querySelectorAll('.auth-tab');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع الأزرار
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            // إضافة الفئة النشطة للزر المحدد
            this.classList.add('active');
            
            // إخفاء جميع محتويات علامات التبويب
            const tabContents = authScreen.querySelectorAll('.auth-tab-content');
            tabContents.forEach(content => content.classList.remove('active'));
            
            // إظهار محتوى علامة التبويب المحددة
            const tabId = this.getAttribute('data-tab');
            const selectedTab = authScreen.querySelector(`#${tabId}-tab`);
            if (selectedTab) {
                selectedTab.classList.add('active');
            }
        });
    });
    
    // إظهار/إخفاء كلمة المرور
    const togglePasswordButtons = authScreen.querySelectorAll('.toggle-password');
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
    
    // معالجة نموذج تسجيل الدخول
    const loginForm = authScreen.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            
            if (!email || !password) {
                showAuthNotification('يرجى إدخال البريد الإلكتروني وكلمة المرور', 'error');
                return;
            }
            
            // تغيير حالة زر تسجيل الدخول
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
            submitButton.disabled = true;
            
            // تسجيل الدخول باستخدام Firebase Auth
            if (window.firebase && window.firebase.auth) {
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .then(userCredential => {
                        const user = userCredential.user;
                        console.log('تم تسجيل الدخول بنجاح:', user.email);
                        
                        // تحديث واجهة المستخدم وفق حالة المصادقة
                        // سيتم التعامل معها من خلال firebase.auth().onAuthStateChanged
                    })
                    .catch(error => {
                        console.error('خطأ في تسجيل الدخول:', error);
                        
                        let errorMessage = 'حدث خطأ أثناء تسجيل الدخول';
                        
                        if (error.code === 'auth/wrong-password') {
                            errorMessage = 'كلمة المرور غير صحيحة';
                        } else if (error.code === 'auth/user-not-found') {
                            errorMessage = 'البريد الإلكتروني غير مسجل';
                        } else if (error.code === 'auth/invalid-email') {
                            errorMessage = 'البريد الإلكتروني غير صالح';
                        } else if (error.code === 'auth/too-many-requests') {
                            errorMessage = 'تم تجاوز عدد المحاولات، يرجى المحاولة لاحقاً';
                        }
                        
                        showAuthNotification(errorMessage, 'error');
                        
                        // إعادة حالة الزر
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                    });
            } else {
                // وضع تجريبي - محاكاة تسجيل الدخول بدون Firebase
                mockLogin(email, password)
                    .then(user => {
                        console.log('تم تسجيل الدخول بنجاح (وضع تجريبي):', user.email);
                        
                        // تحديث حالة المصادقة
                        currentUser = user;
                        isAuthenticated = true;
                        
                        // حفظ معلومات المستخدم في التخزين المحلي
                        localStorage.setItem('currentUser', JSON.stringify(currentUser));
                        
                        // تحديث واجهة المستخدم
                        showApplication();
                        
                        // إطلاق حدث تسجيل الدخول
                        document.dispatchEvent(new CustomEvent('auth:login', { detail: { user: currentUser } }));
                    })
                    .catch(error => {
                        console.error('خطأ في تسجيل الدخول (وضع تجريبي):', error);
                        showAuthNotification(error.message, 'error');
                        
                        // إعادة حالة الزر
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                    });
            }
        });
    }
    
    // معالجة نموذج إنشاء الحساب
    const registerForm = authScreen.querySelector('#register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            if (!name || !email || !password || !confirmPassword) {
                showAuthNotification('يرجى إدخال جميع البيانات المطلوبة', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showAuthNotification('كلمة المرور وتأكيدها غير متطابقين', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAuthNotification('يجب أن تكون كلمة المرور 6 أحرف على الأقل', 'error');
                return;
            }
            
            // تغيير حالة زر إنشاء الحساب
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
            submitButton.disabled = true;
            
            // إنشاء حساب جديد باستخدام Firebase Auth
            if (window.firebase && window.firebase.auth) {
                firebase.auth().createUserWithEmailAndPassword(email, password)
                    .then(userCredential => {
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
                                type: 'user',
                                permissions: getDefaultPermissions('user'),
                                createdAt: new Date().toISOString()
                            });
                        })
                        .then(() => {
                            console.log('تم إنشاء حساب جديد بنجاح:', user.email);
                            showAuthNotification('تم إنشاء الحساب بنجاح، يمكنك تسجيل الدخول الآن', 'success');
                            
                            // الانتقال إلى تبويب تسجيل الدخول
                            const loginTab = authScreen.querySelector('.auth-tab[data-tab="login"]');
                            if (loginTab) {
                                loginTab.click();
                            }
                        });
                    })
                    .catch(error => {
                        console.error('خطأ في إنشاء الحساب:', error);
                        
                        let errorMessage = 'حدث خطأ أثناء إنشاء الحساب';
                        
                        if (error.code === 'auth/email-already-in-use') {
                            errorMessage = 'البريد الإلكتروني مستخدم بالفعل';
                        } else if (error.code === 'auth/invalid-email') {
                            errorMessage = 'البريد الإلكتروني غير صالح';
                        } else if (error.code === 'auth/weak-password') {
                            errorMessage = 'كلمة المرور ضعيفة جداً';
                        }
                        
                        showAuthNotification(errorMessage, 'error');
                    })
                    .finally(() => {
                        // إعادة حالة الزر
                        submitButton.innerHTML = originalText;
                        submitButton.disabled = false;
                    });
            } else {
                // عدم دعم إنشاء حساب في الوضع التجريبي
                showAuthNotification('إنشاء حساب جديد غير متاح في الوضع التجريبي', 'error');
                
                // إعادة حالة الزر
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    // معالجة رابط استعادة كلمة المرور
    const forgotPasswordLink = authScreen.querySelector('.forgot-password-link');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value.trim();
            
            if (!email) {
                showAuthNotification('يرجى إدخال البريد الإلكتروني أولاً', 'error');
                return;
            }
            
            if (window.firebase && window.firebase.auth) {
                firebase.auth().sendPasswordResetEmail(email)
                    .then(() => {
                        showAuthNotification(`تم إرسال رابط إعادة تعيين كلمة المرور إلى ${email}`, 'success');
                    })
                    .catch(error => {
                        console.error('خطأ في إرسال رابط إعادة تعيين كلمة المرور:', error);
                        
                        let errorMessage = 'حدث خطأ أثناء إرسال رابط إعادة تعيين كلمة المرور';
                        
                        if (error.code === 'auth/user-not-found') {
                            errorMessage = 'لم يتم العثور على حساب بهذا البريد الإلكتروني';
                        } else if (error.code === 'auth/invalid-email') {
                            errorMessage = 'البريد الإلكتروني غير صالح';
                        }
                        
                        showAuthNotification(errorMessage, 'error');
                    });
            } else {
                // عدم دعم استعادة كلمة المرور في الوضع التجريبي
                showAuthNotification('استعادة كلمة المرور غير متاحة في الوضع التجريبي', 'error');
            }
        });
    }
}

/**
 * محاكاة تسجيل الدخول في الوضع التجريبي
 * @param {string} email - البريد الإلكتروني
 * @param {string} password - كلمة المرور
 * @returns {Promise<Object>} - وعد بمعلومات المستخدم
 */
function mockLogin(email, password) {
    return new Promise((resolve, reject) => {
        // التحقق من البريد الإلكتروني وكلمة المرور التجريبية
        // يمكن تغيير هذه القيم حسب الحاجة
        if (email === 'admin@example.com' && password === 'admin123') {
            setTimeout(() => {
                resolve({
                    uid: 'mock-admin-uid',
                    email: 'admin@example.com',
                    displayName: 'مدير النظام',
                    type: 'admin',
                    permissions: getDefaultPermissions('admin'),
                    metadata: {
                        createdAt: new Date().toISOString(),
                        lastLogin: new Date().toISOString()
                    }
                });
            }, 1000);
        } else if (email === 'manager@example.com' && password === 'manager123') {
            setTimeout(() => {
                resolve({
                    uid: 'mock-manager-uid',
                    email: 'manager@example.com',
                    displayName: 'مدير',
                    type: 'manager',
                    permissions: getDefaultPermissions('manager'),
                    metadata: {
                        createdAt: new Date().toISOString(),
                        lastLogin: new Date().toISOString()
                    }
                });
            }, 1000);
        } else if (email === 'user@example.com' && password === 'user123') {
            setTimeout(() => {
                resolve({
                    uid: 'mock-user-uid',
                    email: 'user@example.com',
                    displayName: 'مستخدم عادي',
                    type: 'user',
                    permissions: getDefaultPermissions('user'),
                    metadata: {
                        createdAt: new Date().toISOString(),
                        lastLogin: new Date().toISOString()
                    }
                });
            }, 1000);
        } else {
            setTimeout(() => {
                reject(new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة'));
            }, 1000);
        }
    });
}

/**
 * عرض إشعار في شاشة تسجيل الدخول
 * @param {string} message - نص الإشعار
 * @param {string} type - نوع الإشعار (success, error, warning, info)
 */
function showAuthNotification(message, type = 'info') {
    // التحقق من وجود حاوية الإشعارات
    let notificationContainer = document.querySelector('.auth-notification-container');
    
    if (!notificationContainer) {
        // إنشاء حاوية الإشعارات
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'auth-notification-container';
        
        // إضافة الحاوية إلى شاشة المصادقة
        const authContainer = authScreen.querySelector('.auth-container');
        if (authContainer) {
            authContainer.appendChild(notificationContainer);
        } else {
            return;
        }
    }
    
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    
    // إضافة المحتوى
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // إضافة الإشعار إلى الحاوية
    notificationContainer.appendChild(notification);
    
    // إظهار الإشعار
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // إغلاق الإشعار بعد فترة
    const timeout = setTimeout(() => {
        notification.classList.remove('show');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
    
    // إضافة مستمع حدث زر الإغلاق
    const closeButton = notification.querySelector('.notification-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            clearTimeout(timeout);
            notification.classList.remove('show');
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
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
 * تطبيق الصلاحيات على عناصر واجهة المستخدم
 */
function applyPermissionsToUI() {
    if (!currentUser) {
        return;
    }
    
    const userType = currentUser.type || 'user';
    const permissions = currentUser.permissions || getDefaultPermissions(userType);
    
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
    
    // تصدير البيانات
    const exportDataElements = document.querySelectorAll('[data-permission="canExportData"]');
    exportDataElements.forEach(element => {
        if (permissions.canExportData) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
    
    // استيراد البيانات
    const importDataElements = document.querySelectorAll('[data-permission="canImportData"]');
    importDataElements.forEach(element => {
        if (permissions.canImportData) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
    
    // إنشاء نسخة احتياطية
    const createBackupElements = document.querySelectorAll('[data-permission="canCreateBackup"]');
    createBackupElements.forEach(element => {
        if (permissions.canCreateBackup) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
    
    // استعادة نسخة احتياطية
    const restoreBackupElements = document.querySelectorAll('[data-permission="canRestoreBackup"]');
    restoreBackupElements.forEach(element => {
        if (permissions.canRestoreBackup) {
            element.classList.remove('hidden');
        } else {
            element.classList.add('hidden');
        }
    });
    
    // تحديث عناصر قائمة المستخدم
    updateUserMenuElements();
}

/**
 * تحديث عناصر قائمة المستخدم
 */
function updateUserMenuElements() {
    // البحث عن عنصر معلومات المستخدم
    const userMenuContainer = document.getElementById('user-menu-container');
    
    if (!userMenuContainer) {
        return;
    }
    
    // التحقق من وجود نظام ملف المستخدم المحسن
    if (window.EnhancedUserProfile && typeof window.EnhancedUserProfile.updateUserInfo === 'function') {
        // استخدام النظام المحسن لتحديث معلومات المستخدم
        window.EnhancedUserProfile.updateUserInfo();
    } else {
        // تحديث معلومات المستخدم يدوياً
        userMenuContainer.innerHTML = `
            <div class="user-info dropdown">
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
            </div>
        `;
        
        // إضافة مستمعي الأحداث
        const dropdownToggle = userMenuContainer.querySelector('.dropdown-toggle');
        if (dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                const dropdown = this.closest('.dropdown');
                dropdown.classList.toggle('active');
            });
        }
        
        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                const activeDropdowns = document.querySelectorAll('.dropdown.active');
                activeDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
            }
        });
        
        // تسجيل الخروج
        const logoutBtn = userMenuContainer.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        }
    }
}

/**
 * تسجيل الخروج
 */
function logout() {
    // تأكيد تسجيل الخروج
    if (!confirm('هل أنت متأكد من رغبتك في تسجيل الخروج؟')) {
        return;
    }
    
    // تسجيل الخروج من Firebase Auth
    if (window.firebase && window.firebase.auth) {
        firebase.auth().signOut()
            .then(() => {
                // تم تسجيل الخروج بنجاح
                // سيتم التعامل معه من خلال firebase.auth().onAuthStateChanged
            })
            .catch(error => {
                console.error('خطأ في تسجيل الخروج:', error);
                showNotification('حدث خطأ أثناء تسجيل الخروج', 'error');
            });
    } else {
        // الوضع التجريبي - تسجيل الخروج يدوياً
        currentUser = null;
        isAuthenticated = false;
        
        // مسح معلومات المستخدم من التخزين المحلي
        localStorage.removeItem('currentUser');
        
        // إخفاء التطبيق وعرض شاشة تسجيل الدخول
        hideApplication();
        showLoginScreen();
        
        // إطلاق حدث تسجيل الخروج
        document.dispatchEvent(new CustomEvent('auth:logout'));
    }
}

/**
 * عرض إشعار
 * @param {string} message - نص الإشعار
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
    console.log(`[${type.toUpperCase()}] ${message}`);
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
 * إضافة أنماط CSS لنظام حماية التطبيق
 */
function addAuthGuardStyles() {
    // التحقق من وجود الأنماط مسبقاً
    if (document.getElementById('auth-guard-styles')) {
        return;
    }
    
    // إنشاء عنصر النمط
    const styleElement = document.createElement('style');
    styleElement.id = 'auth-guard-styles';
    
    // إضافة أنماط CSS
    styleElement.textContent = `
        /* شاشة تسجيل الدخول */
        .auth-screen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #f0f4f8, #3b82f6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            direction: rtl;
        }
        
        .auth-container {
            width: 100%;
            max-width: 450px;
            background-color: white;
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            padding: 2.5rem;
            position: relative;
            overflow: hidden;
        }
        
        .auth-logo {
            text-align: center;
            margin-bottom: 2.5rem;
        }
        
        .auth-logo i {
            font-size: 3.5rem;
            color: #3b82f6;
            margin-bottom: 1rem;
        }
        
        .auth-logo span {
            display: block;
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
        }
        
        .auth-tabs {
            display: flex;
            margin-bottom: 2rem;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .auth-tab {
            flex: 1;
            padding: 0.75rem 1rem;
            text-align: center;
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            color: #6b7280;
            transition: all 0.3s ease;
        }
        
        .auth-tab.active {
            color: #3b82f6;
            border-bottom: 2px solid #3b82f6;
        }
        
        .auth-tab-content {
            display: none;
        }
        
        .auth-tab-content.active {
            display: block;
            animation: fadeIn 0.5s ease;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #4b5563;
        }
        
        .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 1rem;
            transition: all 0.3s ease;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .password-input-container {
            position: relative;
        }
        
        .toggle-password {
            position: absolute;
            top: 50%;
            left: 0.75rem;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            color: #6b7280;
            font-size: 1rem;
            padding: 0.25rem;
        }
        
        .form-actions {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .form-check {
            display: flex;
            align-items: center;
        }
        
        .form-check input[type="checkbox"] {
            margin-left: 0.5rem;
        }
        
        .forgot-password-link {
            color: #3b82f6;
            text-decoration: none;
            font-size: 0.875rem;
        }
        
        .forgot-password-link:hover {
            text-decoration: underline;
        }
        
        .btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background-color: #3b82f6;
            color: white;
        }
        
        .btn-primary:hover {
            background-color: #2563eb;
        }
        
        .btn-block {
            display: block;
            width: 100%;
        }
        
        .btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
        }
        
        .auth-footer {
            text-align: center;
            margin-top: 2rem;
            color: #6b7280;
            font-size: 0.875rem;
        }
        
        /* إشعارات المصادقة */
        .auth-notification-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            pointer-events: none;
        }
        
        .auth-notification {
            margin-top: 1rem;
            padding: 0.75rem 1rem;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 90%;
            width: 350px;
            transform: translateY(-20px);
            opacity: 0;
            transition: all 0.3s ease;
            pointer-events: auto;
        }
        
        .auth-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .auth-notification.success {
            border-right: 4px solid #10b981;
        }
        
        .auth-notification.success i {
            color: #10b981;
        }
        
        .auth-notification.error {
            border-right: 4px solid #ef4444;
        }
        
        .auth-notification.error i {
            color: #ef4444;
        }
        
        .auth-notification.warning {
            border-right: 4px solid #f59e0b;
        }
        
        .auth-notification.warning i {
            color: #f59e0b;
        }
        
        .auth-notification.info {
            border-right: 4px solid #3b82f6;
        }
        
        .auth-notification.info i {
            color: #3b82f6;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            margin-left: 0.5rem;
        }
        
        .notification-content i {
            margin-left: 0.75rem;
            font-size: 1.25rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.25rem;
            cursor: pointer;
            color: #9ca3af;
            transition: color 0.3s ease;
        }
        
        .notification-close:hover {
            color: #4b5563;
        }
        
        /* الرسوم المتحركة */
        @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
        }
        
        /* إخفاء عناصر حسب الصلاحيات */
        .hidden {
            display: none !important;
        }
        
        /* تنسيق عناصر حسب نوع المستخدم */
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
    
    console.log('تم إضافة أنماط CSS لنظام حماية التطبيق');
}

// تصدير الدوال للاستخدام الخارجي
window.AuthGuard = {
    isAuthenticated: () => isAuthenticated,
    getCurrentUser: () => currentUser,
    logout,
    showNotification
};