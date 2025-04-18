/**
 * نظام الاستثمار المتكامل - التقارير
 * يتحكم في وظائف صفحة التقارير وعرض الإحصائيات والرسوم البيانية التحليلية
 */

class ReportsManager {
    constructor() {
        // عناصر الرسوم البيانية
        this.investmentsGrowthChart = null;
        this.profitsGrowthChart = null;
        this.investmentsDistributionChart = null;
        this.investmentsPerformanceChart = null;
        
        // البيانات
        this.investors = [];
        this.transactions = [];
        this.profits = [];
        
        // فترة التقرير
        this.reportPeriod = 'monthly'; // weekly, monthly, yearly
        
        // تهيئة صفحة التقارير
        this.initialize();
    }
    
    // تهيئة صفحة التقارير
    async initialize() {
        // تحميل البيانات
        await this.loadData();
        
        // تهيئة الرسوم البيانية
        this.initCharts();
        
        // إعداد المستمعين للأحداث
        this.setupEventListeners();
    }
    
    // تحميل البيانات
    async loadData() {
        // التحقق من وجود قاعدة البيانات
        if (typeof db !== 'undefined') {
            this.investors = db.getAllInvestors();
            this.transactions = db.getAllTransactions();
            this.profits = db.getAllProfits();
        } else {
            // استخدام بيانات من localStorage مباشرة
            try {
                const savedInvestors = localStorage.getItem('investors');
                if (savedInvestors) {
                    this.investors = JSON.parse(savedInvestors);
                }
                
                const savedTransactions = localStorage.getItem('transactions');
                if (savedTransactions) {
                    this.transactions = JSON.parse(savedTransactions);
                }
                
                const savedProfits = localStorage.getItem('profits');
                if (savedProfits) {
                    this.profits = JSON.parse(savedProfits);
                }
            } catch (error) {
                console.error('خطأ في تحميل البيانات:', error);
                // استخدام مصفوفات فارغة في حالة الفشل
                this.investors = [];
                this.transactions = [];
                this.profits = [];
            }
        }
    }
    
    // تهيئة الرسوم البيانية
    initCharts() {
        try {
            this.initInvestmentsGrowthChart();
            this.initProfitsGrowthChart();
            this.initInvestmentsDistributionChart();
            this.initInvestmentsPerformanceChart();
        } catch (error) {
            console.error('خطأ في تهيئة الرسوم البيانية:', error);
        }
    }
    
    // تهيئة رسم بياني لتطور الاستثمارات
    initInvestmentsGrowthChart() {
        const canvas = document.getElementById('investments-growth-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // تجهيز البيانات
        const { labels, data } = this.prepareGrowthData(this.transactions, 'إيداع');
        
        // تدمير الرسم البياني السابق إذا وجد
        if (this.investmentsGrowthChart) {
            this.investmentsGrowthChart.destroy();
        }
        
        // إنشاء الرسم البياني إذا كان Chart موجود
        if (typeof Chart !== 'undefined') {
            this.investmentsGrowthChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'إجمالي الاستثمارات',
                        data: data,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw || 0;
                                    const currency = window.SYSTEM_CONFIG ? window.SYSTEM_CONFIG.currency : 'دينار';
                                    return `${context.dataset.label}: ${value.toLocaleString()} ${currency}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    const currency = window.SYSTEM_CONFIG ? window.SYSTEM_CONFIG.currency : 'دينار';
                                    return value.toLocaleString() + ' ' + currency;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // تهيئة رسم بياني لتطور الأرباح
    initProfitsGrowthChart() {
        const canvas = document.getElementById('profits-growth-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // تجهيز البيانات
        const { labels, data } = this.prepareGrowthData(this.profits);
        
        // تدمير الرسم البياني السابق إذا وجد
        if (this.profitsGrowthChart) {
            this.profitsGrowthChart.destroy();
        }
        
        // إنشاء الرسم البياني إذا كان Chart موجود
        if (typeof Chart !== 'undefined') {
            this.profitsGrowthChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'إجمالي الأرباح',
                        data: data,
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                        borderColor: 'rgba(16, 185, 129, 1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw || 0;
                                    const currency = window.SYSTEM_CONFIG ? window.SYSTEM_CONFIG.currency : 'دينار';
                                    return `${context.dataset.label}: ${value.toLocaleString()} ${currency}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    const currency = window.SYSTEM_CONFIG ? window.SYSTEM_CONFIG.currency : 'دينار';
                                    return value.toLocaleString() + ' ' + currency;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // تهيئة رسم بياني لتوزيع الاستثمارات
    initInvestmentsDistributionChart() {
        const canvas = document.getElementById('investments-distribution-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // تجميع الاستثمارات حسب الفئة
        const investmentRanges = {
            '<10000': { count: 0, total: 0, color: 'rgba(59, 130, 246, 0.7)' },
            '10000-50000': { count: 0, total: 0, color: 'rgba(16, 185, 129, 0.7)' },
            '50000-100000': { count: 0, total: 0, color: 'rgba(245, 158, 11, 0.7)' },
            '>100000': { count: 0, total: 0, color: 'rgba(239, 68, 68, 0.7)' }
        };
        
        this.investors.forEach(investor => {
            const amount = Number(investor.amount) || 0;
            
            if (amount < 10000) {
                investmentRanges['<10000'].count++;
                investmentRanges['<10000'].total += amount;
            } else if (amount >= 10000 && amount < 50000) {
                investmentRanges['10000-50000'].count++;
                investmentRanges['10000-50000'].total += amount;
            } else if (amount >= 50000 && amount < 100000) {
                investmentRanges['50000-100000'].count++;
                investmentRanges['50000-100000'].total += amount;
            } else {
                investmentRanges['>100000'].count++;
                investmentRanges['>100000'].total += amount;
            }
        });
        
        // تحويل البيانات إلى تنسيق مناسب للرسم البياني
        const labels = [
            'أقل من 10,000',
            'من 10,000 إلى 50,000',
            'من 50,000 إلى 100,000',
            'أكثر من 100,000'
        ];
        
        const data = [
            investmentRanges['<10000'].total,
            investmentRanges['10000-50000'].total,
            investmentRanges['50000-100000'].total,
            investmentRanges['>100000'].total
        ];
        
        const colors = [
            investmentRanges['<10000'].color,
            investmentRanges['10000-50000'].color,
            investmentRanges['50000-100000'].color,
            investmentRanges['>100000'].color
        ];
        
        // تدمير الرسم البياني السابق إذا وجد
        if (this.investmentsDistributionChart) {
            this.investmentsDistributionChart.destroy();
        }
        
        // إنشاء الرسم البياني إذا كان Chart موجود
        if (typeof Chart !== 'undefined') {
            this.investmentsDistributionChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: colors,
                        borderColor: '#ffffff',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw || 0;
                                    const currency = window.SYSTEM_CONFIG ? window.SYSTEM_CONFIG.currency : 'دينار';
                                    const total = context.dataset.data.reduce((a, b) => (a || 0) + (b || 0), 0);
                                    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
                                    return `${context.label}: ${value.toLocaleString()} ${currency} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // تهيئة رسم بياني لأداء الاستثمارات
    initInvestmentsPerformanceChart() {
        const canvas = document.getElementById('investments-performance-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // تجهيز البيانات
        const investmentData = this.preparePerformanceData();
        
        // تدمير الرسم البياني السابق إذا وجد
        if (this.investmentsPerformanceChart) {
            this.investmentsPerformanceChart.destroy();
        }
        
        // إنشاء الرسم البياني إذا كان Chart موجود
        if (typeof Chart !== 'undefined') {
            this.investmentsPerformanceChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: investmentData.labels,
                    datasets: [
                        {
                            label: 'الاستثمارات',
                            data: investmentData.investments,
                            backgroundColor: 'rgba(59, 130, 246, 0.7)',
                            borderColor: 'rgba(59, 130, 246, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'الأرباح',
                            data: investmentData.profits,
                            backgroundColor: 'rgba(16, 185, 129, 0.7)',
                            borderColor: 'rgba(16, 185, 129, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw || 0;
                                    const currency = window.SYSTEM_CONFIG ? window.SYSTEM_CONFIG.currency : 'دينار';
                                    return `${context.dataset.label}: ${value.toLocaleString()} ${currency}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    const currency = window.SYSTEM_CONFIG ? window.SYSTEM_CONFIG.currency : 'دينار';
                                    return value.toLocaleString() + ' ' + currency;
                                }
                            }
                        }
                    }
                }
            });
        }
    }
    
    // تجهيز بيانات النمو
    prepareGrowthData(dataArray, type = null) {
        const labels = [];
        const data = [];
        
        // تحديد الفترة المناسبة
        let dateFormat;
        let groupingFunction;
        let periodCount;
        
        if (this.reportPeriod === 'weekly') {
            dateFormat = { day: 'numeric', month: 'short' };
            groupingFunction = date => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            periodCount = 7; // 7 أيام
        } else if (this.reportPeriod === 'monthly') {
            dateFormat = { month: 'short', year: 'numeric' };
            groupingFunction = date => `${date.getFullYear()}-${date.getMonth()}`;
            periodCount = 6; // 6 أشهر
        } else {
            dateFormat = { year: 'numeric' };
            groupingFunction = date => `${date.getFullYear()}`;
            periodCount = 5; // 5 سنوات
        }
        
        // إنشاء مجموعة الفترات
        const periods = [];
        const now = new Date();
        
        if (this.reportPeriod === 'weekly') {
            for (let i = periodCount - 1; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                periods.push({
                    key: groupingFunction(date),
                    label: this.formatDateForChart(date, dateFormat),
                    date
                });
            }
        } else if (this.reportPeriod === 'monthly') {
            for (let i = periodCount - 1; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                periods.push({
                    key: groupingFunction(date),
                    label: this.formatDateForChart(date, dateFormat),
                    date
                });
            }
        } else {
            for (let i = periodCount - 1; i >= 0; i--) {
                const date = new Date(now.getFullYear() - i, 0, 1);
                periods.push({
                    key: groupingFunction(date),
                    label: this.formatDateForChart(date, dateFormat),
                    date
                });
            }
        }
        
        // تجميع البيانات حسب الفترة
        const groupedData = {};
        periods.forEach(period => {
            groupedData[period.key] = 0;
        });
        
        // التحقق من وجود البيانات قبل المعالجة
        if (Array.isArray(dataArray)) {
            dataArray.forEach(item => {
                if (!item) return;
                
                // تحديد التاريخ والمبلغ
                let itemDate;
                try {
                    itemDate = new Date(item.createdAt || item.date);
                    if (isNaN(itemDate.getTime())) {
                        return;
                    }
                } catch (e) {
                    return;
                }
                
                let amount = Number(item.amount) || 0;
                
                // تصفية حسب النوع إذا كان مطلوبًا
                if (type && item.type !== type) {
                    return;
                }
                
                // تحديد مفتاح المجموعة
                const key = groupingFunction(itemDate);
                
                // إضافة المبلغ إلى المجموعة المناسبة إذا كانت ضمن الفترة
                if (groupedData.hasOwnProperty(key)) {
                    groupedData[key] += amount;
                }
            });
        }
        
        // إنشاء البيانات التراكمية
        let cumulative = 0;
        
        // تحويل البيانات إلى تنسيق مناسب للرسم البياني
        periods.forEach(period => {
            labels.push(period.label);
            cumulative += groupedData[period.key];
            data.push(cumulative);
        });
        
        return { labels, data };
    }
    
    // تنسيق التاريخ للرسم البياني
    formatDateForChart(date, options) {
        try {
            return date.toLocaleDateString('ar-EG', options);
        } catch (error) {
            return date.toISOString().split('T')[0];
        }
    }
    
    // تجهيز بيانات الأداء
    preparePerformanceData() {
        const labels = [];
        const investments = [];
        const profits = [];
        
        // تحديد الفترة المناسبة
        let dateFormat;
        let groupingFunction;
        let periodCount;
        
        if (this.reportPeriod === 'weekly') {
            dateFormat = { day: 'numeric', month: 'short' };
            groupingFunction = date => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
            periodCount = 7; // 7 أيام
        } else if (this.reportPeriod === 'monthly') {
            dateFormat = { month: 'short', year: 'numeric' };
            groupingFunction = date => `${date.getFullYear()}-${date.getMonth()}`;
            periodCount = 6; // 6 أشهر
        } else {
            dateFormat = { year: 'numeric' };
            groupingFunction = date => `${date.getFullYear()}`;
            periodCount = 5; // 5 سنوات
        }
        
        // إنشاء مجموعة الفترات
        const periods = [];
        const now = new Date();
        
        if (this.reportPeriod === 'weekly') {
            for (let i = periodCount - 1; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                periods.push({
                    key: groupingFunction(date),
                    label: this.formatDateForChart(date, dateFormat),
                    date
                });
            }
        } else if (this.reportPeriod === 'monthly') {
            for (let i = periodCount - 1; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
                periods.push({
                    key: groupingFunction(date),
                    label: this.formatDateForChart(date, dateFormat),
                    date
                });
            }
        } else {
            for (let i = periodCount - 1; i >= 0; i--) {
                const date = new Date(now.getFullYear() - i, 0, 1);
                periods.push({
                    key: groupingFunction(date),
                    label: this.formatDateForChart(date, dateFormat),
                    date
                });
            }
        }
        
        // تجميع البيانات حسب الفترة
        const depositsByPeriod = {};
        const profitsByPeriod = {};
        
        periods.forEach(period => {
            depositsByPeriod[period.key] = 0;
            profitsByPeriod[period.key] = 0;
        });
        
        // تجميع الإيداعات
        if (Array.isArray(this.transactions)) {
            this.transactions.forEach(transaction => {
                if (!transaction || transaction.type !== 'إيداع') return;
                
                try {
                    const date = new Date(transaction.createdAt || transaction.date);
                    if (isNaN(date.getTime())) return;
                    
                    const key = groupingFunction(date);
                    
                    if (depositsByPeriod.hasOwnProperty(key)) {
                        depositsByPeriod[key] += Number(transaction.amount) || 0;
                    }
                } catch (e) {
                    console.error('خطأ في تحليل تاريخ العملية:', e);
                }
            });
        }
        
        // تجميع الأرباح
        if (Array.isArray(this.profits)) {
            this.profits.forEach(profit => {
                if (!profit || profit.status !== 'مدفوعة') return;
                
                try {
                    const date = new Date(profit.createdAt || profit.paidAt);
                    if (isNaN(date.getTime())) return;
                    
                    const key = groupingFunction(date);
                    
                    if (profitsByPeriod.hasOwnProperty(key)) {
                        profitsByPeriod[key] += Number(profit.amount) || 0;
                    }
                } catch (e) {
                    console.error('خطأ في تحليل تاريخ الربح:', e);
                }
            });
        }
        
        // تحويل البيانات إلى تنسيق مناسب للرسم البياني
        periods.forEach(period => {
            labels.push(period.label);
            investments.push(depositsByPeriod[period.key]);
            profits.push(profitsByPeriod[period.key]);
        });
        
        return { labels, investments, profits };
    }
    
    // إعداد المستمعين للأحداث
    setupEventListeners() {
        // الاستماع لتغيير الصفحة
        document.addEventListener('page:change', (e) => {
            if (e.detail && e.detail.page === 'reports') {
                this.refresh();
            }
        });
        
        // تصفية التقارير حسب الفترة
        const filterButtons = document.querySelectorAll('#reports-page .btn-group .btn');
        if (filterButtons && filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // تحديث الزر النشط
                    filterButtons.forEach(btn => {
                        btn.classList.remove('active');
                    });
                    button.classList.add('active');
                    
                    // تحديث فترة التقرير
                    const filterText = button.textContent.trim().toLowerCase();
                    if (filterText.includes('أسبوعي')) {
                        this.reportPeriod = 'weekly';
                    } else if (filterText.includes('شهري')) {
                        this.reportPeriod = 'monthly';
                    } else if (filterText.includes('سنوي')) {
                        this.reportPeriod = 'yearly';
                    }
                    
                    // تحديث الرسوم البيانية
                    this.refresh();
                });
            });
        }
        
        // تصدير التقرير
        const exportButton = document.querySelector('#reports-page .btn-primary[title="تصدير التقرير"]');
        if (exportButton) {
            exportButton.addEventListener('click', () => {
                this.exportReport();
            });
        }
    }
    
    // تصدير التقرير
    exportReport() {
        // تجهيز بيانات التقرير
        const totalInvestors = this.investors ? this.investors.length : 0;
        const activeInvestors = this.investors ? this.investors.filter(inv => inv.status === 'نشط').length : 0;
        
        const totalInvestments = this.investors ? this.investors.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0) : 0;
        
        const totalProfits = this.profits ? this.profits.reduce((sum, profit) => {
            if (profit.status === 'مدفوعة') {
                return sum + (Number(profit.amount) || 0);
            }
            return sum;
        }, 0) : 0;
        
        const reportData = {
            title: `تقرير ${this.reportPeriod === 'weekly' ? 'أسبوعي' : (this.reportPeriod === 'monthly' ? 'شهري' : 'سنوي')}`,
            date: new Date().toLocaleDateString('ar-EG'),
            stats: {
                totalInvestors,
                activeInvestors,
                totalInvestments,
                totalProfits
            }
        };
        
        // توليد محتوى التقرير
        const reportContent = `
            <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="text-align: center;">${reportData.title}</h1>
                <p style="text-align: center;">تاريخ التقرير: ${reportData.date}</p>
                
                <h2>ملخص النظام</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">البيان</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">القيمة</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">إجمالي المستثمرين</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${reportData.stats.totalInvestors}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">المستثمرين النشطين</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${reportData.stats.activeInvestors}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">إجمالي الاستثمارات</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${this.formatCurrency(reportData.stats.totalInvestments)}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px;">إجمالي الأرباح المدفوعة</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${this.formatCurrency(reportData.stats.totalProfits)}</td>
                    </tr>
                </table>
                
                <h2>أعلى المستثمرين</h2>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">المستثمر</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">المبلغ المستثمر</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">تاريخ الانضمام</th>
                    </tr>
                    ${this.getTopInvestors(5).map(inv => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px;">${inv.name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${this.formatCurrency(inv.amount)}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${this.formatDate(inv.createdAt)}</td>
                        </tr>
                    `).join('')}
                </table>
                
                <h2>آخر العمليات</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">المستثمر</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">نوع العملية</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">التاريخ</th>
                        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">المبلغ</th>
                    </tr>
                    ${this.getRecentTransactions(5).map(trx => {
                        const investor = this.investors.find(inv => inv.id === trx.investorId) || { name: 'غير معروف' };
                        return `
                            <tr>
                                <td style="border: 1px solid #ddd; padding: 8px;">${investor.name}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${trx.type}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${this.formatDate(trx.createdAt)}</td>
                                <td style="border: 1px solid #ddd; padding: 8px;">${this.formatCurrency(trx.amount)}</td>
                            </tr>
                        `;
                    }).join('')}
                </table>
            </div>
        `;
        
        // إنشاء ملف البيانات
        const blob = new Blob([reportContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        
        // إنشاء رابط تنزيل
        const a = document.createElement('a');
        a.href = url;
        a.download = `تقرير_النظام_${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        
        // تنظيف
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 0);
    }
    
    // الحصول على أعلى المستثمرين
    getTopInvestors(count = 5) {
        if (!Array.isArray(this.investors)) {
            return [];
        }
        
        return [...this.investors]
            .filter(inv => inv && typeof inv === 'object' && inv.amount) // التحقق من صحة بيانات المستثمر
            .sort((a, b) => (Number(b.amount) || 0) - (Number(a.amount) || 0))
            .slice(0, count);
    }
    
    // الحصول على آخر العمليات
    getRecentTransactions(count = 5) {
        if (!Array.isArray(this.transactions)) {
            return [];
        }
        
        return [...this.transactions]
            .filter(trx => trx && typeof trx === 'object') // التحقق من صحة بيانات العملية
            .sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0))
            .slice(0, count);
    }
    
    // تنسيق المبالغ المالية
    formatCurrency(amount) {
        const currency = window.SYSTEM_CONFIG ? window.SYSTEM_CONFIG.currency : 'دينار';
        
        if (isNaN(amount)) {
            return `0 ${currency}`;
        }
        
        try {
            return `${Number(amount).toLocaleString()} ${currency}`;
        } catch (error) {
            return `${amount} ${currency}`;
        }
    }
    
    // تنسيق التاريخ
    formatDate(date) {
        if (!date) {
            return 'غير محدد';
        }
        
        try {
            const validDate = new Date(date);
            if (isNaN(validDate.getTime())) {
                return 'تاريخ غير صالح';
            }
            
            return validDate.toLocaleDateString('ar-EG');
        } catch (error) {
            return String(date);
        }
    }
    
    // تحديث صفحة التقارير
    async refresh() {
        await this.loadData();
        
        // تحديث الرسوم البيانية
        this.initInvestmentsGrowthChart();
        this.initProfitsGrowthChart();
        this.initInvestmentsDistributionChart();
        this.initInvestmentsPerformanceChart();
    }
}

// إنشاء كائن إدارة التقارير عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // تأخير تهيئة مدير التقارير للتأكد من تحميل العناصر
    setTimeout(() => {
        window.reportsManager = new ReportsManager();
    }, 500);
});

