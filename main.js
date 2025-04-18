/**
 * نظام الاستثمار المتكامل - الملف الرئيسي
 * يمثل نقطة الدخول الرئيسية للتطبيق ويتحكم في تهيئة جميع المكونات
 */

class InvestmentSystemApp {
    constructor() {
        // حالة التطبيق
        this.isInitialized = false;
        
        // تهيئة التطبيق
        this.initialize();
    }
    
    // تهيئة التطبيق
    async initialize() {
        // التحقق من أن التطبيق لم يتم تهيئته بالفعل
        if (this.isInitialized) {
            return;
        }
        
        // تعيين عنوان الصفحة
        document.title = SYSTEM_CONFIG.systemName;
        
        // تهيئة مديري المكونات
        this.initializeManagers();
        
        // تهيئة الأحداث العامة
        this.setupEventListeners();
        
        // تهيئة الزر العائم
        this.setupFloatingActionButton();
        
        // تعيين علم التهيئة
        this.isInitialized = true;
        
        // عرض رسالة ترحيب
        setTimeout(() => {
            this.showWelcomeMessage();
        }, 1000);
    }
    
    // تهيئة مديري المكونات
    initializeManagers() {
        // إنشاء مدير الإشعارات إذا لم يكن موجودًا
        if (!window.notifications) {
            window.notifications = new NotificationsManager();
        }
        
        // التحقق من وجود المديرين الآخرين (سيتم إنشاؤهم تلقائيًا عند تحميل الصفحة)
        if (!window.navigation) {
            window.navigation = new Navigation();
        }
    }
    
    // تهيئة الأحداث العامة
    setupEventListeners() {
        // حدث النقر خارج النافذة المنبثقة لإغلاقها
        document.addEventListener('click', (e) => {
            const modals = document.querySelectorAll('.modal-overlay');
            modals.forEach(modal => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // حدث المفاتيح لإغلاق النافذة المنبثقة عند الضغط على ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal-overlay.active');
                if (modals.length > 0) {
                    modals.forEach(modal => {
                        modal.classList.remove('active');
                    });
                }
            }
        });
        
        // التحقق من الاتصال بالإنترنت
        window.addEventListener('online', () => {
            window.notifications.show('تم استعادة الاتصال بالإنترنت', 'success', 3000);
        });
        
        window.addEventListener('offline', () => {
            window.notifications.show('انقطع الاتصال بالإنترنت. جميع البيانات محفوظة محليًا.', 'warning');
        });
        
        // حدث تغيير اللغة
        document.addEventListener('language:change', (e) => {
            document.documentElement.lang = e.detail.language;
            document.documentElement.dir = e.detail.language === 'ar' ? 'rtl' : 'ltr';
        });
    }
    
    // تهيئة الزر العائم
    setupFloatingActionButton() {
        const fab = document.getElementById('add-new-fab');
        
        if (fab) {
            // إضافة قائمة منسدلة للزر العائم
            const fabMenu = document.createElement('div');
            fabMenu.className = 'fab-menu';
            fabMenu.innerHTML = `
                <div class="fab-menu-item" data-action="add-investor">
                    <i class="fas fa-user-plus"></i>
                    <span>إضافة مستثمر</span>
                </div>
                <div class="fab-menu-item" data-action="add-deposit">
                    <i class="fas fa-plus"></i>
                    <span>إيداع جديد</span>
                </div>
                <div class="fab-menu-item" data-action="add-withdraw">
                    <i class="fas fa-minus"></i>
                    <span>سحب جديد</span>
                </div>
                <div class="fab-menu-item" data-action="pay-profit">
                    <i class="fas fa-hand-holding-usd"></i>
                    <span>دفع أرباح</span>
                </div>
            `;
            
            // إضافة القائمة بعد الزر العائم
            fab.parentNode.insertBefore(fabMenu, fab.nextSibling);
            
            // إضافة حدث النقر على الزر العائم
            fab.addEventListener('click', () => {
                fab.classList.toggle('active');
                fabMenu.classList.toggle('active');
            });
            
            // إضافة أحداث للعناصر
            fabMenu.querySelectorAll('.fab-menu-item').forEach(item => {
                item.addEventListener('click', () => {
                    const action = item.getAttribute('data-action');
                    this.handleFabAction(action);
                    
                    // إغلاق القائمة
                    fab.classList.remove('active');
                    fabMenu.classList.remove('active');
                });
            });
            
            // إغلاق القائمة عند النقر في أي مكان آخر
            document.addEventListener('click', (e) => {
                if (!fab.contains(e.target) && !fabMenu.contains(e.target)) {
                    fab.classList.remove('active');
                    fabMenu.classList.remove('active');
                }
            });
            
            // إضافة الأنماط للقائمة
            this.addFabMenuStyles();
        }
    }
    
    // إضافة أنماط CSS للزر العائم
    addFabMenuStyles() {
        if (!document.getElementById('fab-menu-styles')) {
            const styles = document.createElement('style');
            styles.id = 'fab-menu-styles';
            styles.textContent = `
                .fab {
                    transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
                }
                
                .fab.active {
                    transform: rotate(45deg);
                    background-color: #ef4444;
                }
                
                .fab-menu {
                    position: fixed;
                    bottom: 100px;
                    left: 30px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    opacity: 0;
                    transform: translateY(20px);
                    pointer-events: none;
                    transition: all 0.3s ease;
                    z-index: 9;
                }
                
                .fab-menu.active {
                    opacity: 1;
                    transform: translateY(0);
                    pointer-events: auto;
                }
                
                .fab-menu-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 15px;
                    background-color: white;
                    border-radius: 30px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .fab-menu-item:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                }
                
                .fab-menu-item i {
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f3f4f6;
                    border-radius: 50%;
                    color: #3b82f6;
                }
                
                .fab-menu-item span {
                    font-weight: 500;
                    white-space: nowrap;
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    // معالجة إجراءات الزر العائم
    handleFabAction(action) {
        switch (action) {
            case 'add-investor':
                if (window.investorsManager) {
                    window.investorsManager.openAddInvestorModal();
                } else {
                    // التنقل إلى صفحة المستثمرين أولاً
                    window.navigation.navigateTo('investors');
                    
                    // فتح النافذة المنبثقة بعد تحميل الصفحة
                    setTimeout(() => {
                        if (window.investorsManager) {
                            window.investorsManager.openAddInvestorModal();
                        }
                    }, 500);
                }
                break;
                
            case 'add-deposit':
                if (window.transactionsManager) {
                    window.transactionsManager.openDepositModal();
                } else {
                    // التنقل إلى صفحة العمليات أولاً
                    window.navigation.navigateTo('transactions');
                    
                    // فتح النافذة المنبثقة بعد تحميل الصفحة
                    setTimeout(() => {
                        if (window.transactionsManager) {
                            window.transactionsManager.openDepositModal();
                        }
                    }, 500);
                }
                break;
                
            case 'add-withdraw':
                if (window.transactionsManager) {
                    window.transactionsManager.openWithdrawModal();
                } else {
                    // التنقل إلى صفحة العمليات أولاً
                    window.navigation.navigateTo('transactions');
                    
                    // فتح النافذة المنبثقة بعد تحميل الصفحة
                    setTimeout(() => {
                        if (window.transactionsManager) {
                            window.transactionsManager.openWithdrawModal();
                        }
                    }, 500);
                }
                break;
                
            case 'pay-profit':
                if (window.profitsManager) {
                    window.profitsManager.openPayProfitModal();
                } else {
                    // التنقل إلى صفحة الأرباح أولاً
                    window.navigation.navigateTo('profits');
                    
                    // فتح النافذة المنبثقة بعد تحميل الصفحة
                    setTimeout(() => {
                        if (window.profitsManager) {
                            window.profitsManager.openPayProfitModal();
                        }
                    }, 500);
                }
                break;
        }
    }
    
    // عرض رسالة ترحيب
    showWelcomeMessage() {
        // الحصول على وقت اليوم
        const hour = new Date().getHours();
        let greeting;
        
        if (hour < 12) {
            greeting = 'صباح الخير';
        } else if (hour < 18) {
            greeting = 'مساء الخير';
        } else {
            greeting = 'مساء الخير';
        }
        
        // عرض رسالة ترحيب
        window.notifications.show(`${greeting}! مرحبًا بك في ${SYSTEM_CONFIG.systemName}`, 'info', 5000);
    }
    
    // تحميل البيانات التجريبية (للعرض فقط)
    loadDemoData() {
        // التحقق مما إذا كانت البيانات التجريبية محملة بالفعل
        if (localStorage.getItem('demoDataLoaded')) {
            return;
        }
        
        // إنشاء بيانات المستثمرين
        const investors = [
            {
                name: 'محمد أحمد',
                phone: '0501234567',
                address: 'الرياض، حي النخيل',
                card: 'ID12345678',
                amount: 50000,
                status: INVESTOR_STATUS.ACTIVE,
                depositDate: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString()
            },
            {
                name: 'سارة علي',
                phone: '0557654321',
                address: 'جدة، حي الشاطئ',
                card: 'ID87654321',
                amount: 75000,
                status: INVESTOR_STATUS.ACTIVE,
                depositDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString()
            },
            {
                name: 'خالد محمد',
                phone: '0509876543',
                address: 'الدمام، حي الفيصلية',
                card: 'ID56789012',
                amount: 120000,
                status: INVESTOR_STATUS.ACTIVE,
                depositDate: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString()
            },
            {
                name: 'نورة عبدالله',
                phone: '0553456789',
                address: 'الرياض، حي العليا',
                card: 'ID43219876',
                amount: 25000,
                status: INVESTOR_STATUS.PENDING,
                depositDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
            },
            {
                name: 'أحمد يوسف',
                phone: '0508901234',
                address: 'مكة، حي العزيزية',
                card: 'ID65432109',
                amount: 200000,
                status: INVESTOR_STATUS.ACTIVE,
                depositDate: new Date(new Date().setDate(new Date().getDate() - 90)).toISOString()
            }
        ];
        
        // إضافة المستثمرين
        investors.forEach(investor => {
            db.addInvestor(investor);
        });
        
        // إضافة بعض العمليات الإضافية
        // (عمليات الإيداع الأولية تمت إضافتها تلقائيًا عند إضافة المستثمرين)
        
        // إضافة عملية سحب
        const withdrawalData = {
            investorId: investors[2].id,
            type: TRANSACTION_TYPES.WITHDRAW,
            amount: 20000,
            date: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
            notes: 'سحب جزئي لتغطية نفقات',
            status: TRANSACTION_STATUS.COMPLETED
        };
        
        // إضافة عمليات أرباح
        const profit1 = {
            investorId: investors[0].id,
            amount: calculateProfit(investors[0].amount, 30),
            startDate: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString(),
            endDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
            dueDate: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString(),
            investmentAmount: investors[0].amount,
            days: 30,
            status: PROFIT_STATUS.PAID,
            paidAt: new Date(new Date().setDate(new Date().getDate() - 15)).toISOString()
        };
        
        const profit2 = {
            investorId: investors[2].id,
            amount: calculateProfit(investors[2].amount, 30),
            startDate: new Date(new Date().setDate(new Date().getDate() - 60)).toISOString(),
            endDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
            dueDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
            investmentAmount: investors[2].amount,
            days: 30,
            status: PROFIT_STATUS.PAID,
            paidAt: new Date(new Date().setDate(new Date().getDate() - 28)).toISOString()
        };
        
        // إضافة العمليات والأرباح
        db.addTransaction(withdrawalData);
        
        const addedProfit1 = db.addProfit(profit1);
        db.updateProfitStatus(addedProfit1.id, PROFIT_STATUS.PAID);
        
        const addedProfit2 = db.addProfit(profit2);
        db.updateProfitStatus(addedProfit2.id, PROFIT_STATUS.PAID);
        
        // تعيين علم البيانات التجريبية
        localStorage.setItem('demoDataLoaded', 'true');
        
        console.log('تم تحميل البيانات التجريبية بنجاح');
    }
}

// إنشاء التطبيق عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تحميل الإعدادات
    loadSystemConfig();
    
    // إنشاء التطبيق
    window.app = new InvestmentSystemApp();
    
    // تحميل البيانات التجريبية (اختياري - للعرض فقط)
    // للتفعيل، قم بإزالة التعليق عن السطر التالي
    // window.app.loadDemoData();
});