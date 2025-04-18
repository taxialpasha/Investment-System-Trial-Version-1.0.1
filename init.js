/**
 * نظام الاستثمار المتكامل - ملف التهيئة
 * يقوم بتهيئة النظام وتحميل البيانات وتشغيل المديرين
 */

// تحميل البيانات من التخزين المحلي
function loadData() {
    // تحميل المستثمرين
    window.investors = [];
    const savedInvestors = localStorage.getItem('investors');
    if (savedInvestors) {
        window.investors = JSON.parse(savedInvestors);
    }

    // تحميل العمليات
    window.transactions = [];
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
        window.transactions = JSON.parse(savedTransactions);
    }

    // تحميل الإعدادات
    window.settings = {
        interestRate: 17.5,
        reminderDays: 3,
        currency: 'دينار',
        language: 'ar',
        systemName: 'نظام الاستثمار المتكامل',
        profitCalculation: 'daily',
        profitCycle: 30,
        autoBackup: true,
        backupFrequency: 'weekly'
    };
    
    const savedSettings = localStorage.getItem('settings');
    if (savedSettings) {
        window.settings = {...window.settings, ...JSON.parse(savedSettings)};
    }
    
    // تحديث عناصر الإعدادات
    updateSettingsDisplay();
}

// حفظ البيانات في التخزين المحلي
function saveData() {
    localStorage.setItem('investors', JSON.stringify(window.investors));
    localStorage.setItem('transactions', JSON.stringify(window.transactions));
    localStorage.setItem('settings', JSON.stringify(window.settings));
}

// تحديث عرض الإعدادات
function updateSettingsDisplay() {
    // التحقق من وجود العناصر قبل تعيين القيم
    const interestRateSetting = document.getElementById('interest-rate-setting');
    const reminderDays = document.getElementById('reminder-days');
    const interestRate = document.getElementById('interest-rate');
    
    if (interestRateSetting) interestRateSetting.value = window.settings.interestRate;
    if (reminderDays) reminderDays.value = window.settings.reminderDays;
    if (interestRate) interestRate.textContent = `${window.settings.interestRate}%`;
}

// تحديث لوحة التحكم الرئيسية
function updateDashboard() {
    // تحديث إجمالي الاستثمارات
    const totalInvestments = window.investors.reduce((sum, investor) => sum + (investor.amount || 0), 0);
    const totalInvestmentsElement = document.getElementById('total-investments');
    if (totalInvestmentsElement) {
        totalInvestmentsElement.textContent = `${totalInvestments.toLocaleString()} ${window.settings.currency}`;
    }
    
    // تحديث الأرباح الشهرية
    const monthlyProfits = calculateMonthlyProfits();
    const monthlyProfitsElement = document.getElementById('monthly-profits');
    if (monthlyProfitsElement) {
        monthlyProfitsElement.textContent = `${monthlyProfits.toLocaleString()} ${window.settings.currency}`;
    }
    
    // تحديث عدد المستثمرين
    const investorsCountElement = document.getElementById('investors-count');
    if (investorsCountElement) {
        investorsCountElement.textContent = window.investors.length;
    }
    
    // تحديث نسبة العائد
    const interestRateElement = document.getElementById('interest-rate');
    if (interestRateElement) {
        interestRateElement.textContent = `${window.settings.interestRate}%`;
    }
}

// حساب الأرباح الشهرية
function calculateMonthlyProfits() {
    return window.investors.reduce((sum, investor) => {
        const monthlyProfit = investor.investments ? investor.investments.reduce((total, investment) => {
            // حساب الفائدة الشهرية بشكل صحيح
            const profitRate = window.settings.interestRate / 100;
            return total + (investment.amount * profitRate);
        }, 0) : 0;
        return sum + monthlyProfit;
    }, 0);
}

// حساب الفائدة بشكل صحيح
function calculateInterest(amount, startDate, endDate = null) {
    const rate = window.settings.interestRate / 100;
    
    // استخدام تاريخ نهاية محدد أو نهاية الشهر الحالي
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date(start.getFullYear(), start.getMonth() + 1, 0);
    
    // حساب عدد الأيام
    const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    // عدد الأيام في الشهر (أو الدورة)
    const daysInCycle = window.settings.profitCycle;
    
    // حساب الفائدة حسب طريقة الحساب
    let interest = 0;
    
    if (window.settings.profitCalculation === 'daily') {
        // حساب الفائدة النسبية بالأيام
        interest = (amount * rate * days) / daysInCycle;
    } else {
        // حساب الفائدة الشهرية كاملة (17.5%)
        interest = amount * rate;
    }
    
    return interest;
}

// إعداد النظام عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحميل البيانات
    loadData();
    
    // جعل دوال النظام متاحة للاستخدام العام
    window.loadData = loadData;
    window.saveData = saveData;
    window.updateDashboard = updateDashboard;
    window.calculateMonthlyProfits = calculateMonthlyProfits;
    window.calculateInterest = calculateInterest;
    
    // تحديث واجهة المستخدم
    updateDashboard();
    
    // تحديث تاريخ اليوم كقيمة افتراضية لحقول التاريخ
    const today = new Date().toISOString().split('T')[0];
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        input.value = today;
    });
    
    // إضافة مستمعي أحداث لأزرار النوافذ المنبثقة
    setupModalEvents();
    
    // تهيئة المخططات البيانية
    initCharts();
});

// إعداد مستمعي أحداث النوافذ المنبثقة
function setupModalEvents() {
    // إغلاق النوافذ المنبثقة
    document.querySelectorAll('.modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal-overlay');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
    
    // إغلاق النافذة عند النقر خارجها
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
}

// تهيئة المخططات البيانية
function initCharts() {
    // إذا كانت مكتبة Chart.js متاحة
    if (window.Chart) {
        // مخطط الاستثمارات
        const investmentChart = document.getElementById('investment-chart');
        if (investmentChart) {
            new Chart(investmentChart.getContext('2d'), {
                type: 'line',
                data: {
                    labels: getLast6Months(),
                    datasets: [{
                        label: 'إجمالي الاستثمارات',
                        data: getMonthlyInvestmentData(),
                        borderColor: '#3b82f6',
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
        
        // مخطط المستثمرين
        const investorsChart = document.getElementById('investors-chart');
        if (investorsChart) {
            new Chart(investorsChart.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['نشط', 'قيد المراجعة', 'غير نشط'],
                    datasets: [{
                        data: [window.investors.length, 0, 0],
                        backgroundColor: [
                            '#10b981',
                            '#f59e0b',
                            '#ef4444'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }
}

// الحصول على أسماء الأشهر الستة الأخيرة
function getLast6Months() {
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
        const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = month.toLocaleDateString('ar-EG', { month: 'short' });
        months.push(monthName);
    }
    
    return months;
}

// الحصول على بيانات الاستثمارات الشهرية
function getMonthlyInvestmentData() {
    const data = [0, 0, 0, 0, 0, 0]; // 6 أشهر
    const now = new Date();
    
    window.transactions.forEach(transaction => {
        if (transaction.type !== 'إيداع') return;
        
        const transDate = new Date(transaction.date || transaction.createdAt);
        const monthsAgo = (now.getFullYear() - transDate.getFullYear()) * 12 + now.getMonth() - transDate.getMonth();
        
        if (monthsAgo >= 0 && monthsAgo < 6) {
            data[5 - monthsAgo] += transaction.amount;
        }
    });
    
    return data;
}