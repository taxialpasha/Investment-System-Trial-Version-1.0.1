/**
 * نظام الاستثمار المتكامل - الإعدادات
 * يتحكم في وظائف صفحة الإعدادات، بما في ذلك إعدادات النظام العامة وإعدادات الأرباح والنسخ الاحتياطي
 */

class SettingsManager {
    constructor() {
        // عناصر واجهة المستخدم
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // نماذج الإعدادات
        this.generalSettingsForm = document.getElementById('general-settings-form');
        this.profitsSettingsForm = document.getElementById('profits-settings-form');
        this.notificationsSettingsForm = document.getElementById('notifications-settings-form');
        
        // أزرار النسخ الاحتياطي
        this.backupBtn = document.querySelector('button[title="تنزيل نسخة احتياطية"]');
        this.restoreBtn = document.querySelector('button[title="استعادة من نسخة احتياطية"]');
        
        // تهيئة صفحة الإعدادات
        this.initialize();
    }
    
    // تهيئة صفحة الإعدادات
    async initialize() {
        // عرض الإعدادات الحالية
        this.loadSettings();
        
        // إعداد المستمعين للأحداث
        this.setupEventListeners();
    }
    
    // تحميل الإعدادات الحالية
    loadSettings() {
        // التحقق من وجود العناصر قبل تعيين القيم
        // تعبئة نموذج الإعدادات العامة
        const systemNameInput = document.querySelector('#general-settings-form input[type="text"]');
        const currencySelect = document.querySelector('#general-settings-form select:nth-of-type(1)');
        const languageSelect = document.querySelector('#general-settings-form select:nth-of-type(2)');
        
        if (systemNameInput) systemNameInput.value = SYSTEM_CONFIG.systemName;
        if (currencySelect) currencySelect.value = SYSTEM_CONFIG.currency;
        if (languageSelect) languageSelect.value = SYSTEM_CONFIG.language;
        
        // تعبئة نموذج إعدادات الأرباح
        const interestRateInput = document.getElementById('interest-rate-setting');
        const profitCalcSelect = document.querySelector('#profits-settings-form select[name="profit-calculation"]');
        const profitCycleSelect = document.querySelector('#profits-settings-form select[name="profit-cycle"]');
        
        if (interestRateInput) interestRateInput.value = SYSTEM_CONFIG.interestRate;
        if (profitCalcSelect) profitCalcSelect.value = SYSTEM_CONFIG.profitCalculation;
        if (profitCycleSelect) profitCycleSelect.value = SYSTEM_CONFIG.profitCycle;
        
        // تعبئة نموذج إعدادات الإشعارات
        const reminderDaysInput = document.getElementById('reminder-days');
        const emailNewInvestorCheck = document.getElementById('email-new-investor');
        const emailProfitPaymentCheck = document.getElementById('email-profit-payment');
        const emailWithdrawalCheck = document.getElementById('email-withdrawal');
        
        if (reminderDaysInput) reminderDaysInput.value = SYSTEM_CONFIG.reminderDays;
        if (emailNewInvestorCheck) emailNewInvestorCheck.checked = SYSTEM_CONFIG.emailNotifications.newInvestor;
        if (emailProfitPaymentCheck) emailProfitPaymentCheck.checked = SYSTEM_CONFIG.emailNotifications.profitPayment;
        if (emailWithdrawalCheck) emailWithdrawalCheck.checked = SYSTEM_CONFIG.emailNotifications.withdrawal;
        
        // تعبئة إعدادات النسخ الاحتياطي
        const autoBackupCheck = document.getElementById('auto-backup');
        const backupFreqSelect = document.querySelector('#backup-tab select');
        
        if (autoBackupCheck) autoBackupCheck.checked = SYSTEM_CONFIG.backup.enabled;
        if (backupFreqSelect) backupFreqSelect.value = SYSTEM_CONFIG.backup.frequency;
    }
    
    // إعداد المستمعين للأحداث
    setupEventListeners() {
        // التحقق من وجود العناصر قبل إضافة المستمعين
        // الاستماع لتغيير الصفحة
        document.addEventListener('page:change', (e) => {
            if (e.detail.page === 'settings') {
                this.loadSettings();
            }
        });
        
        // أزرار التبويب
        if (this.tabButtons) {
            this.tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const tab = button.getAttribute('data-tab');
                    this.switchTab(tab);
                });
            });
        }
        
        // حفظ الإعدادات العامة
        if (this.generalSettingsForm) {
            this.generalSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveGeneralSettings();
            });
        }
        
        // حفظ إعدادات الأرباح
        if (this.profitsSettingsForm) {
            this.profitsSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProfitSettings();
            });
        }
        
        // حفظ إعدادات الإشعارات
        if (this.notificationsSettingsForm) {
            this.notificationsSettingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveNotificationSettings();
            });
        }
        
        // حدث تغيير خيار النسخ الاحتياطي التلقائي
        const autoBackupCheck = document.getElementById('auto-backup');
        if (autoBackupCheck) {
            autoBackupCheck.addEventListener('change', () => {
                this.saveBackupSettings();
            });
        }
        
        // حدث تغيير تكرار النسخ الاحتياطي
        const backupFreqSelect = document.querySelector('#backup-tab select');
        if (backupFreqSelect) {
            backupFreqSelect.addEventListener('change', () => {
                this.saveBackupSettings();
            });
        }
        
        // أزرار النسخ الاحتياطي
        if (this.backupBtn) {
            this.backupBtn.addEventListener('click', () => {
                this.downloadBackup();
            });
        }
        
        if (this.restoreBtn) {
            this.restoreBtn.addEventListener('click', () => {
                this.restoreBackup();
            });
        }
    }
    
    // تبديل التبويب
    switchTab(tabId) {
        // تحديث الأزرار النشطة
        this.tabButtons.forEach(button => {
            if (button.getAttribute('data-tab') === tabId) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // تحديث المحتوى النشط
        this.tabContents.forEach(content => {
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
    
    // حفظ الإعدادات العامة
    saveGeneralSettings() {
        // جمع البيانات من النموذج
        const systemNameInput = document.querySelector('#general-settings-form input[type="text"]');
        const currencySelect = document.querySelector('#general-settings-form select:nth-of-type(1)');
        const languageSelect = document.querySelector('#general-settings-form select:nth-of-type(2)');
        
        if (!systemNameInput || !currencySelect || !languageSelect) {
            this.showNotification('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'danger');
            return;
        }
        
        // تحديث إعدادات النظام
        SYSTEM_CONFIG.systemName = systemNameInput.value;
        SYSTEM_CONFIG.currency = currencySelect.value;
        SYSTEM_CONFIG.language = languageSelect.value;
        
        // حفظ الإعدادات
        if (saveSystemConfig()) {
            this.showNotification('تم حفظ الإعدادات العامة بنجاح', 'success');
            
            // تحديث عنوان الصفحة
            document.title = SYSTEM_CONFIG.systemName;
        } else {
            this.showNotification('حدث خطأ أثناء حفظ الإعدادات', 'danger');
        }
    }
    
    // حفظ إعدادات الأرباح
    saveProfitSettings() {
        // جمع البيانات من النموذج
        const interestRateInput = document.getElementById('interest-rate-setting');
        const profitCalcSelect = document.querySelector('#profits-settings-form select[name="profit-calculation"]');
        const profitCycleSelect = document.querySelector('#profits-settings-form select[name="profit-cycle"]');
        
        if (!interestRateInput || !profitCalcSelect || !profitCycleSelect) {
            this.showNotification('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'danger');
            return;
        }
        
        const interestRate = parseFloat(interestRateInput.value);
        
        // التحقق من صحة البيانات
        if (isNaN(interestRate) || interestRate < 0 || interestRate > 100) {
            this.showNotification('يرجى إدخال نسبة ربح صحيحة بين 0 و 100', 'warning');
            return;
        }
        
        // تحديث إعدادات النظام
        SYSTEM_CONFIG.interestRate = interestRate;
        SYSTEM_CONFIG.profitCalculation = profitCalcSelect.value;
        SYSTEM_CONFIG.profitCycle = parseInt(profitCycleSelect.value);
        
        // حفظ الإعدادات
        if (saveSystemConfig()) {
            this.showNotification('تم حفظ إعدادات الأرباح بنجاح', 'success');
            
            // تحديث عرض نسبة الفائدة في لوحة التحكم
            const interestRateEl = document.getElementById('interest-rate');
            if (interestRateEl) {
                interestRateEl.textContent = `${interestRate}%`;
            }
        } else {
            this.showNotification('حدث خطأ أثناء حفظ الإعدادات', 'danger');
        }
    }
    
    // حفظ إعدادات الإشعارات
    saveNotificationSettings() {
        // جمع البيانات من النموذج
        const reminderDaysInput = document.getElementById('reminder-days');
        const emailNewInvestorCheck = document.getElementById('email-new-investor');
        const emailProfitPaymentCheck = document.getElementById('email-profit-payment');
        const emailWithdrawalCheck = document.getElementById('email-withdrawal');
        
        if (!reminderDaysInput || !emailNewInvestorCheck || !emailProfitPaymentCheck || !emailWithdrawalCheck) {
            this.showNotification('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'danger');
            return;
        }
        
        const reminderDays = parseInt(reminderDaysInput.value);
        
        // التحقق من صحة البيانات
        if (isNaN(reminderDays) || reminderDays < 1 || reminderDays > 30) {
            this.showNotification('يرجى إدخال عدد أيام التذكير بين 1 و 30', 'warning');
            return;
        }
        
        // تحديث إعدادات النظام
        SYSTEM_CONFIG.reminderDays = reminderDays;
        SYSTEM_CONFIG.emailNotifications = {
            newInvestor: emailNewInvestorCheck.checked,
            profitPayment: emailProfitPaymentCheck.checked,
            withdrawal: emailWithdrawalCheck.checked
        };
        
        // حفظ الإعدادات
        if (saveSystemConfig()) {
            this.showNotification('تم حفظ إعدادات الإشعارات بنجاح', 'success');
        } else {
            this.showNotification('حدث خطأ أثناء حفظ الإعدادات', 'danger');
        }
    }
    
    // حفظ إعدادات النسخ الاحتياطي
    saveBackupSettings() {
        // جمع البيانات
        const autoBackupCheck = document.getElementById('auto-backup');
        const backupFreqSelect = document.querySelector('#backup-tab select');
        
        if (!autoBackupCheck || !backupFreqSelect) {
            this.showNotification('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'danger');
            return;
        }
        
        // تحديث إعدادات النظام
        SYSTEM_CONFIG.backup = {
            enabled: autoBackupCheck.checked,
            frequency: backupFreqSelect.value
        };
        
        // حفظ الإعدادات
        if (saveSystemConfig()) {
            this.showNotification('تم حفظ إعدادات النسخ الاحتياطي بنجاح', 'success');
        } else {
            this.showNotification('حدث خطأ أثناء حفظ الإعدادات', 'danger');
        }
    }
    
    // تنزيل نسخة احتياطية
    downloadBackup() {
        // التحقق من وجود قاعدة البيانات
        if (typeof db === 'undefined' || !db.backupData) {
            this.showNotification('خطأ: قاعدة البيانات غير متاحة', 'danger');
            return;
        }
        
        try {
            // إنشاء البيانات
            const data = {
                investors: investors || [],
                transactions: transactions || [],
                settings: SYSTEM_CONFIG,
                timestamp: new Date().toISOString()
            };
            
            // تحويل البيانات إلى JSON
            const jsonData = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            
            // إنشاء رابط التنزيل
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            this.showNotification('تم إنشاء النسخة الاحتياطية بنجاح', 'success');
        } catch (error) {
            console.error('خطأ في إنشاء النسخة الاحتياطية:', error);
            this.showNotification('حدث خطأ أثناء إنشاء النسخة الاحتياطية', 'danger');
        }
    }
    
    // استعادة من نسخة احتياطية
    restoreBackup() {
        // إنشاء عنصر إدخال ملف مخفي
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.json';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        
        // إضافة حدث تحميل الملف
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files.length === 0) {
                document.body.removeChild(fileInput);
                return;
            }
            
            const file = e.target.files[0];
            
            // التحقق من نوع الملف
            if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
                this.showNotification('الملف غير صالح. يرجى اختيار ملف JSON.', 'warning');
                document.body.removeChild(fileInput);
                return;
            }
            
            try {
                // طلب تأكيد من المستخدم
                if (confirm('سيتم استبدال جميع البيانات الحالية بالبيانات من النسخة الاحتياطية. هل أنت متأكد من المتابعة؟')) {
                    // قراءة الملف
                    const reader = new FileReader();
                    
                    reader.onload = (event) => {
                        try {
                            const data = JSON.parse(event.target.result);
                            
                            // التحقق من صحة البيانات
                            if (!data.investors || !data.transactions || !data.settings) {
                                throw new Error('ملف النسخة الاحتياطية غير صالح');
                            }
                            
                            // استعادة البيانات
                            investors = data.investors;
                            transactions = data.transactions;
                            Object.assign(SYSTEM_CONFIG, data.settings);
                            
                            // حفظ البيانات
                            localStorage.setItem('investors', JSON.stringify(investors));
                            localStorage.setItem('transactions', JSON.stringify(transactions));
                            saveSystemConfig();
                            
                            // تحديث واجهة المستخدم
                            this.loadSettings();
                            
                            this.showNotification('تمت استعادة البيانات بنجاح', 'success');
                            
                            // إعادة تحميل الصفحة بعد فترة قصيرة
                            setTimeout(() => {
                                window.location.reload();
                            }, 2000);
                        } catch (error) {
                            console.error('خطأ في تحليل ملف النسخة الاحتياطية:', error);
                            this.showNotification('خطأ في ملف النسخة الاحتياطية: ' + error.message, 'danger');
                        }
                    };
                    
                    reader.onerror = () => {
                        this.showNotification('حدث خطأ أثناء قراءة الملف', 'danger');
                    };
                    
                    reader.readAsText(file);
                }
            } catch (error) {
                console.error('خطأ في استعادة البيانات:', error);
                this.showNotification('حدث خطأ أثناء استعادة البيانات: ' + error.message, 'danger');
            } finally {
                // تنظيف
                document.body.removeChild(fileInput);
            }
        });
        
        // تحفيز نقرة على عنصر الإدخال
        fileInput.click();
    }
    
    // عرض إشعار
    showNotification(message, type = 'success') {
        // استدعاء وظيفة الإشعارات العامة
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else if (window.notifications) {
            window.notifications.show(message, type);
        } else {
            alert(message);
        }
    }
}

// إنشاء كائن إدارة الإعدادات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});