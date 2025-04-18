/**
 * نظام الاستثمار المتكامل - مديرو المكونات
 * يحتوي على تعريف لمديري المكونات المختلفة في النظام
 */

// مدير الإشعارات
class NotificationsManager {
    constructor() {
        this.container = document.getElementById('success-notification');
    }
    
    // عرض إشعار للمستخدم
    show(message, type = 'success', duration = 5000) {
        if (!this.container) {
            console.error('عنصر الإشعارات غير موجود في DOM');
            return;
        }
        
        const notificationIcon = this.container.querySelector('.notification-icon');
        const notificationTitle = this.container.querySelector('.notification-title');
        const notificationMessage = this.container.querySelector('.notification-message');
        
        if (!notificationIcon || !notificationTitle || !notificationMessage) {
            console.error('عناصر الإشعارات الداخلية غير موجودة');
            return;
        }
        
        // تعيين نوع الإشعار
        notificationIcon.className = 'notification-icon';
        notificationIcon.classList.add(type);
        
        // تعيين العنوان حسب النوع
        let title = 'إشعار';
        switch(type) {
            case 'success':
                title = 'تمت العملية بنجاح';
                notificationIcon.innerHTML = '<i class="fas fa-check"></i>';
                break;
            case 'error':
                title = 'خطأ';
                notificationIcon.innerHTML = '<i class="fas fa-times"></i>';
                break;
            case 'warning':
                title = 'تنبيه';
                notificationIcon.innerHTML = '<i class="fas fa-exclamation"></i>';
                break;
            case 'info':
                title = 'معلومات';
                notificationIcon.innerHTML = '<i class="fas fa-info"></i>';
                break;
        }
        
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;
        
        // عرض الإشعار
        this.container.classList.add('show');
        
        // إخفاء الإشعار بعد فترة
        setTimeout(() => {
            this.container.classList.remove('show');
        }, duration);
    }
}

// مدير المستثمرين
class InvestorsManager {
    constructor() {
        this.investors = [];
        this.initEventListeners();
        this.loadInvestors();
    }
    
    // تهيئة مستمعي الأحداث
    initEventListeners() {
        // أزرار إضافة مستثمر جديد
        const addInvestorBtn = document.getElementById('add-investor-btn');
        if (addInvestorBtn) {
            addInvestorBtn.addEventListener('click', () => this.openAddInvestorModal());
        }
        
        // زر حفظ المستثمر
        const saveInvestorBtn = document.getElementById('save-investor-btn');
        if (saveInvestorBtn) {
            saveInvestorBtn.addEventListener('click', () => this.addNewInvestor());
        }
        
        // أزرار إجراءات المستثمر (عرض، تعديل، حذف)
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.investor-action-btn');
            
            if (!target) return;
            
            const investorId = target.getAttribute('data-id');
            
            if (target.classList.contains('view-investor')) {
                this.viewInvestorDetails(investorId);
            } else if (target.classList.contains('edit-investor')) {
                this.editInvestor(investorId);
            } else if (target.classList.contains('delete-investor')) {
                this.confirmDeleteInvestor(investorId);
            }
        });
        
        // مستمعات أخرى حسب الحاجة
    }
    
    // تحميل المستثمرين
    loadInvestors() {
        this.investors = window.investors || [];
        this.renderInvestorsTable();
    }
    
    // عرض جدول المستثمرين
    renderInvestorsTable() {
        const tableBody = document.querySelector('#investors-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // ترتيب المستثمرين حسب تاريخ الإضافة (الأحدث أولاً)
        const sortedInvestors = [...this.investors].sort((a, b) => {
            return new Date(b.createdAt || b.joinDate) - new Date(a.createdAt || a.joinDate);
        });
        
        sortedInvestors.forEach(investor => {
            const row = document.createElement('tr');
            
            // حساب الربح الشهري
            const monthlyProfit = investor.investments && investor.investments.length > 0 
                ? investor.investments.reduce((total, inv) => {
                    return total + (inv.interest || 0);
                }, 0)
                : 0;
            
            // تنسيق تاريخ الانضمام
            const joinDate = investor.joinDate || investor.createdAt || '';
            
            row.innerHTML = `
                <td>${investor.id}</td>
                <td>
                    <div class="investor-info">
                        <div class="investor-avatar">${investor.name.charAt(0)}</div>
                        <div>
                            <div class="investor-name">${investor.name}</div>
                            <div class="investor-phone">${investor.phone}</div>
                        </div>
                    </div>
                </td>
                <td>${investor.phone}</td>
                <td>${(investor.amount || 0).toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                <td>${monthlyProfit.toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                <td>${joinDate}</td>
                <td><span class="badge badge-success">${investor.status || 'نشط'}</span></td>
                <td>
                    <div class="investor-actions">
                        <button class="investor-action-btn view-investor" data-id="${investor.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="investor-action-btn edit edit-investor" data-id="${investor.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="investor-action-btn delete delete-investor" data-id="${investor.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        if (sortedInvestors.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="8" class="text-center">لا يوجد مستثمرين</td>';
            tableBody.appendChild(emptyRow);
        }
    }
    
    // فتح نافذة إضافة مستثمر
    openAddInvestorModal() {
        const modal = document.getElementById('add-investor-modal');
        if (!modal) {
            console.error('نافذة إضافة مستثمر غير موجودة');
            return;
        }
        
        modal.classList.add('active');
        
        // إعادة تعيين النموذج
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        // تحديث تاريخ اليوم
        const dateInputs = modal.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.value = new Date().toISOString().split('T')[0];
        });
    }
    
    // إضافة مستثمر جديد
    addNewInvestor() {
        const nameInput = document.getElementById('investor-name');
        const phoneInput = document.getElementById('investor-phone');
        const addressInput = document.getElementById('investor-address');
        const cardInput = document.getElementById('investor-card');
        const depositDateInput = document.getElementById('investor-deposit-date');
        const amountInput = document.getElementById('investor-amount');
        
        if (!nameInput || !phoneInput || !addressInput || !cardInput || !depositDateInput || !amountInput) {
            window.notifications.show('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'error');
            return;
        }
        
        const name = nameInput.value;
        const phone = phoneInput.value;
        const address = addressInput.value;
        const cardNumber = cardInput.value;
        const depositDate = depositDateInput.value;
        const amount = parseFloat(amountInput.value);
        
        if (!name || !phone || !address || !cardNumber || !depositDate || isNaN(amount) || amount <= 0) {
            window.notifications.show('يرجى إدخال جميع البيانات المطلوبة بشكل صحيح', 'error');
            return;
        }
        
        // حساب الفائدة
        let interest = 0;
        if (window.calculateInterest) {
            interest = window.calculateInterest(amount, depositDate);
        } else if (window.settings && window.settings.interestRate) {
            interest = amount * (window.settings.interestRate / 100);
        } else {
            interest = amount * 0.175; // استخدام القيمة الافتراضية 17.5%
        }
        
        const newInvestor = {
            id: Date.now().toString(),
            name,
            phone,
            address,
            cardNumber,
            joinDate: depositDate,
            createdAt: new Date().toISOString(),
            status: 'نشط',
            investments: [
                {
                    amount,
                    date: depositDate,
                    interest
                }
            ],
            profits: [],
            withdrawals: [],
            amount
        };
        
        // إضافة المستثمر الجديد إلى المصفوفة
        this.investors.push(newInvestor);
        window.investors = this.investors;
        
        // إضافة عملية جديدة
        if (window.addTransaction) {
            window.addTransaction('إيداع', newInvestor.id, amount);
        } else if (window.transactionsManager) {
            window.transactionsManager.addTransaction('إيداع', newInvestor.id, amount);
        }
        
        // حفظ البيانات
        if (window.saveData) {
            window.saveData();
        } else {
            localStorage.setItem('investors', JSON.stringify(this.investors));
        }
        
        // تحديث واجهة المستخدم
        this.renderInvestorsTable();
        
        // إغلاق النافذة المنبثقة
        const modal = document.getElementById('add-investor-modal');
        if (modal) modal.classList.remove('active');
        
        // عرض إشعار النجاح
        window.notifications.show(`تمت إضافة المستثمر ${name} بنجاح!`, 'success');
        
        // تحديث لوحة التحكم وباقي الواجهة
        if (window.updateDashboard) window.updateDashboard();
        if (window.renderTransactionsTable) window.renderTransactionsTable();
        if (window.renderProfitsTable) window.renderProfitsTable();
        if (window.renderRecentTransactions) window.renderRecentTransactions();
        if (window.populateInvestorSelects) window.populateInvestorSelects();
        if (window.updateCharts) window.updateCharts();
    }
    
    // عرض تفاصيل المستثمر
    viewInvestorDetails(investorId) {
        const investor = this.investors.find(inv => inv.id === investorId);
        if (!investor) {
            window.notifications.show('لم يتم العثور على بيانات المستثمر', 'error');
            return;
        }
        
        const modal = document.getElementById('investor-details-modal');
        if (!modal) {
            window.notifications.show('نافذة تفاصيل المستثمر غير موجودة', 'error');
            return;
        }
        
        const content = modal.querySelector('#investor-details-content');
        if (!content) return;
        
        // حساب إجمالي الاستثمارات
        const totalInvestment = investor.amount || 0;
        
        // حساب الربح الشهري
        const monthlyProfit = investor.investments && investor.investments.length > 0 
            ? investor.investments.reduce((total, inv) => {
                return total + (inv.interest || 0);
            }, 0)
            : 0;
        
        // إنشاء محتوى تفاصيل المستثمر
        content.innerHTML = `
            <div class="investor-profile">
                <div class="investor-header">
                    <div class="investor-avatar large">${investor.name.charAt(0)}</div>
                    <div class="investor-info">
                        <h2>${investor.name}</h2>
                        <p><i class="fas fa-phone"></i> ${investor.phone}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${investor.address || 'غير متوفر'}</p>
                        <p><i class="fas fa-id-card"></i> ${investor.cardNumber || 'غير متوفر'}</p>
                    </div>
                    <div class="investor-status">
                        <span class="badge badge-success">${investor.status || 'نشط'}</span>
                    </div>
                </div>
                
                <div class="grid-cols-2">
                    <div class="summary-card">
                        <div class="summary-title">المبلغ المستثمر</div>
                        <div class="summary-value">${totalInvestment.toLocaleString()} ${window.settings?.currency || 'دينار'}</div>
                    </div>
                    
                    <div class="summary-card">
                        <div class="summary-title">الربح الشهري</div>
                        <div class="summary-value">${monthlyProfit.toLocaleString()} ${window.settings?.currency || 'دينار'}</div>
                    </div>
                </div>
                
                <div class="section">
                    <h3 class="section-title">تفاصيل الاستثمارات</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>المبلغ</th>
                                <th>تاريخ الإيداع</th>
                                <th>الربح الشهري</th>
                                <th>ملاحظات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${investor.investments && investor.investments.length > 0 ? 
                                investor.investments.map(inv => `
                                    <tr>
                                        <td>${inv.amount.toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                                        <td>${inv.date}</td>
                                        <td>${(inv.interest || 0).toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                                        <td>${inv.notes || '-'}</td>
                                    </tr>
                                `).join('') : 
                                '<tr><td colspan="4" class="text-center">لا توجد استثمارات</td></tr>'
                            }
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <h3 class="section-title">سجل الأرباح</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>التاريخ</th>
                                <th>المبلغ</th>
                                <th>الحالة</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${investor.profits && investor.profits.length > 0 ? 
                                investor.profits.map(profit => `
                                    <tr>
                                        <td>${profit.date}</td>
                                        <td>${profit.amount.toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                                        <td><span class="badge badge-success">مدفوع</span></td>
                                    </tr>
                                `).join('') : 
                                '<tr><td colspan="3" class="text-center">لا توجد أرباح مدفوعة</td></tr>'
                            }
                        </tbody>
                    </table>
                </div>
                
                <div class="section">
                    <h3 class="section-title">سجل السحوبات</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>التاريخ</th>
                                <th>المبلغ</th>
                                <th>ملاحظات</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${investor.withdrawals && investor.withdrawals.length > 0 ? 
                                investor.withdrawals.map(withdrawal => `
                                    <tr>
                                        <td>${withdrawal.date}</td>
                                        <td>${withdrawal.amount.toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                                        <td>${withdrawal.notes || '-'}</td>
                                    </tr>
                                `).join('') : 
                                '<tr><td colspan="3" class="text-center">لا توجد سحوبات</td></tr>'
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        // إضافة أنماط CSS
        if (!document.getElementById('investor-details-styles')) {
            const styles = document.createElement('style');
            styles.id = 'investor-details-styles';
            styles.textContent = `
                .investor-profile {
                    padding: 20px;
                }
                
                .investor-header {
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 30px;
                }
                
                .investor-avatar.large {
                    width: 80px;
                    height: 80px;
                    font-size: 2rem;
                    margin-left: 20px;
                }
                
                .investor-info {
                    flex: 1;
                }
                
                .investor-info h2 {
                    margin: 0 0 10px 0;
                    font-size: 1.5rem;
                }
                
                .investor-info p {
                    margin: 5px 0;
                    color: #666;
                }
                
                .investor-info p i {
                    width: 20px;
                    margin-left: 10px;
                    color: #3b82f6;
                }
                
                .summary-card {
                    background-color: #f9fafb;
                    border-radius: 8px;
                    padding: 20px;
                    border: 1px solid #e5e7eb;
                    margin-bottom: 20px;
                }
                
                .summary-title {
                    font-size: 0.875rem;
                    color: #6b7280;
                    margin-bottom: 5px;
                }
                
                .summary-value {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // عرض النافذة
        modal.classList.add('active');
    }
    
    // تعديل بيانات المستثمر
    editInvestor(investorId) {
        // يمكن تنفيذ وظيفة تعديل المستثمر هنا
        window.notifications.show('وظيفة تعديل المستثمر قيد التطوير', 'info');
    }
    
    // حذف المستثمر
    confirmDeleteInvestor(investorId) {
        if (confirm('هل أنت متأكد من رغبتك في حذف هذا المستثمر؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            const index = this.investors.findIndex(inv => inv.id === investorId);
            if (index === -1) {
                window.notifications.show('لم يتم العثور على المستثمر', 'error');
                return;
            }
            
            // حذف المستثمر
            const deletedInvestor = this.investors.splice(index, 1)[0];
            window.investors = this.investors;
            
            // حفظ البيانات
            if (window.saveData) {
                window.saveData();
            } else {
                localStorage.setItem('investors', JSON.stringify(this.investors));
            }
            
            // تحديث الواجهة
            this.renderInvestorsTable();
            
            // عرض إشعار النجاح
            window.notifications.show(`تم حذف المستثمر ${deletedInvestor.name} بنجاح`, 'success');
            
            // تحديث باقي الواجهة
            if (window.updateDashboard) window.updateDashboard();
            if (window.populateInvestorSelects) window.populateInvestorSelects();
            if (window.updateCharts) window.updateCharts();
        }
    }
}

// مدير العمليات
class TransactionsManager {
    constructor() {
        this.transactions = [];
        this.initEventListeners();
        this.loadTransactions();
    }
    
    // تهيئة مستمعي الأحداث
    initEventListeners() {
        // أزرار الإيداع والسحب
        const addDepositBtn = document.getElementById('add-deposit-btn');
        const addWithdrawBtn = document.getElementById('add-withdraw-btn');
        
        if (addDepositBtn) {
            addDepositBtn.addEventListener('click', () => this.openDepositModal());
        }
        
        if (addWithdrawBtn) {
            addWithdrawBtn.addEventListener('click', () => this.openWithdrawModal());
        }
        
        // أزرار الحفظ
        const saveDepositBtn = document.getElementById('save-deposit-btn');
        const saveWithdrawBtn = document.getElementById('save-withdraw-btn');
        
        if (saveDepositBtn) {
            saveDepositBtn.addEventListener('click', () => this.addDeposit());
        }
        
        if (saveWithdrawBtn) {
            saveWithdrawBtn.addEventListener('click', () => this.withdrawAmount());
        }
        
        // مستمع تغيير المستثمر في نافذة السحب
        const withdrawInvestor = document.getElementById('withdraw-investor');
        if (withdrawInvestor) {
            withdrawInvestor.addEventListener('change', () => this.showInvestorBalance());
        }
    }
    
    // تحميل العمليات
    loadTransactions() {
        this.transactions = window.transactions || [];
        this.renderTransactionsTable();
    }
    
    // عرض جدول العمليات
    renderTransactionsTable() {
        const tableBody = document.querySelector('#transactions-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        // ترتيب العمليات حسب التاريخ (الأحدث أولاً)
        const sortedTransactions = [...this.transactions].sort((a, b) => {
            return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        });
        
        sortedTransactions.forEach(transaction => {
            const row = document.createElement('tr');
            
            // تحديد نوع العملية وأيقونتها
            let typeClass = '';
            let typeIcon = '';
            
            switch(transaction.type) {
                case 'إيداع':
                    typeClass = 'success';
                    typeIcon = '<i class="fas fa-arrow-up"></i>';
                    break;
                case 'سحب':
                    typeClass = 'danger';
                    typeIcon = '<i class="fas fa-arrow-down"></i>';
                    break;
                case 'دفع أرباح':
                    typeClass = 'info';
                    typeIcon = '<i class="fas fa-hand-holding-usd"></i>';
                    break;
                default:
                    typeClass = 'primary';
                    typeIcon = '<i class="fas fa-exchange-alt"></i>';
            }
            
            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${transaction.investorName}</td>
                <td>
                    <span class="badge badge-${typeClass}">${typeIcon} ${transaction.type}</span>
                </td>
                <td>${transaction.date}</td>
                <td>${transaction.amount.toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                <td>${transaction.balanceAfter ? transaction.balanceAfter.toLocaleString() + ' ' + (window.settings?.currency || 'دينار') : '-'}</td>
                <td>
                    <button class="btn btn-outline btn-sm transaction-details" data-id="${transaction.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        if (sortedTransactions.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="7" class="text-center">لا يوجد عمليات</td>';
            tableBody.appendChild(emptyRow);
        }
        
        // تحديث العمليات الأخيرة
        this.renderRecentTransactions();
    }
    
    // عرض آخر العمليات في لوحة التحكم
    renderRecentTransactions() {
        const tableBody = document.querySelector('#recent-transactions tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';

        // عرض أحدث 5 عمليات فقط
        const recent = [...this.transactions].sort((a, b) => {
            return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
        }).slice(0, 5);

        recent.forEach(tr => {
            // تحديد نوع العملية وأيقونتها
            let statusClass = 'active';
            
            switch(tr.type) {
                case 'إيداع':
                    statusClass = 'success';
                    break;
                case 'سحب':
                    statusClass = 'warning';
                    break;
                case 'دفع أرباح':
                    statusClass = 'info';
                    break;
            }
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tr.id}</td>
                <td>${tr.investorName}</td>
                <td>${tr.type}</td>
                <td>${tr.date}</td>
                <td>${tr.amount.toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                <td><span class="status status-${statusClass}">مكتمل</span></td>
                <td>
                    <button class="btn btn-outline btn-sm">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
        
        if (recent.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="7" class="text-center">لا توجد عمليات حديثة</td>';
            tableBody.appendChild(emptyRow);
        }
    }
    
    // فتح نافذة الإيداع
    openDepositModal() {
        const modal = document.getElementById('add-deposit-modal');
        if (!modal) {
            console.error('نافذة الإيداع غير موجودة');
            return;
        }
        
        modal.classList.add('active');
        
        // إعادة تعيين النموذج
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        // تحديث تاريخ اليوم
        const dateInputs = modal.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.value = new Date().toISOString().split('T')[0];
        });
        
        // تحديث قائمة المستثمرين
        this.populateInvestorSelects();
    }
    
    // فتح نافذة السحب
    openWithdrawModal() {
        const modal = document.getElementById('add-withdraw-modal');
        if (!modal) {
            console.error('نافذة السحب غير موجودة');
            return;
        }
        
        modal.classList.add('active');
        
        // إعادة تعيين النموذج
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        // تحديث تاريخ اليوم
        const dateInputs = modal.querySelectorAll('input[type="date"]');
        dateInputs.forEach(input => {
            input.value = new Date().toISOString().split('T')[0];
        });
        
        // تحديث قائمة المستثمرين
        this.populateInvestorSelects();
        
        // إعادة تعيين معلومات الرصيد
        const balanceInfo = document.getElementById('withdraw-balance-info');
        if (balanceInfo) balanceInfo.innerHTML = '';
    }
    
    // إضافة عملية جديدة
    addTransaction(type, investorId, amount) {
        const investor = window.investors.find(inv => inv.id === investorId);
        if (!investor) return;
        
        // تحديد رصيد المستثمر بعد العملية
        let balanceAfter = 0;
        if (type === 'إيداع') {
            // تحديث رصيد المستثمر
            investor.amount = (investor.amount || 0) + amount;
            balanceAfter = investor.amount;
        } else if (type === 'سحب') {
            // تحديث رصيد المستثمر
            investor.amount = (investor.amount || 0) - amount;
            balanceAfter = investor.amount;
        } else {
            // في حالة الأرباح، لا نضيف للرصيد الأساسي
            balanceAfter = investor.amount || 0;
        }
        
        const newTransaction = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            type,
            investorId,
            investorName: investor ? investor.name : 'غير معروف',
            amount,
            balanceAfter
        };
        
        this.transactions.push(newTransaction);
        window.transactions = this.transactions;
        
        // حفظ البيانات
        if (window.saveData) {
            window.saveData();
        } else {
            localStorage.setItem('transactions', JSON.stringify(this.transactions));
            localStorage.setItem('investors', JSON.stringify(window.investors));
        }
        
        // تحديث الواجهة
        this.renderTransactionsTable();
        this.renderRecentTransactions();
        
        // تحديث باقي الواجهة
        if (window.updateDashboard) window.updateDashboard();
        if (window.updateCharts) window.updateCharts();
    }
    
    // إضافة إيداع جديد
    addDeposit() {
        const depositInvestorSelect = document.getElementById('deposit-investor');
        const depositAmountInput = document.getElementById('deposit-amount');
        const depositDateInput = document.getElementById('deposit-date');
        const depositNotesInput = document.getElementById('deposit-notes');
        
        if (!depositInvestorSelect || !depositAmountInput || !depositDateInput) {
            window.notifications.show('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'error');
            return;
        }
        
        const investorId = depositInvestorSelect.value;
        const amount = parseFloat(depositAmountInput.value);
        const depositDate = depositDateInput.value;
        const notes = depositNotesInput ? depositNotesInput.value || '' : '';
        
        if (!investorId || isNaN(amount) || amount <= 0 || !depositDate) {
            window.notifications.show('الرجاء إدخال جميع البيانات المطلوبة بشكل صحيح', 'error');
            return;
        }
        
        const investor = window.investors.find(inv => inv.id === investorId);
        if (!investor) {
            window.notifications.show('لم يتم العثور على بيانات المستثمر', 'error');
            return;
        }
        
        // حساب الفائدة
        let interest = 0;
        if (window.calculateInterest) {
            interest = window.calculateInterest(amount, depositDate);
        } else if (window.settings && window.settings.interestRate) {
            interest = amount * (window.settings.interestRate / 100);
        } else {
            interest = amount * 0.175; // استخدام القيمة الافتراضية 17.5%
        }
        
        // إضافة الاستثمار الجديد
        investor.investments.push({
            amount,
            date: depositDate,
            interest,
            notes
        });
        
        // إضافة عملية جديدة
        this.addTransaction('إيداع', investorId, amount);
        
        // إغلاق النافذة المنبثقة
        const modal = document.getElementById('add-deposit-modal');
        if (modal) modal.classList.remove('active');
        
        // عرض إشعار النجاح
        window.notifications.show(`تم إضافة إيداع جديد بمبلغ ${amount.toLocaleString()} ${window.settings?.currency || 'دينار'} للمستثمر ${investor.name} بنجاح!`, 'success');
        
        // تحديث واجهة المستخدم
        if (window.investorsManager) window.investorsManager.renderInvestorsTable();
        if (window.profitsManager) window.profitsManager.renderProfitsTable();
    }
    
    // سحب مبلغ
    withdrawAmount() {
        const withdrawInvestorSelect = document.getElementById('withdraw-investor');
        const withdrawAmountInput = document.getElementById('withdraw-amount');
        const withdrawDateInput = document.getElementById('withdraw-date');
        const withdrawNotesInput = document.getElementById('withdraw-notes');
        
        if (!withdrawInvestorSelect || !withdrawAmountInput || !withdrawDateInput) {
            window.notifications.show('خطأ في النموذج: بعض الحقول المطلوبة غير موجودة', 'error');
            return;
        }
        
        const investorId = withdrawInvestorSelect.value;
        const amount = parseFloat(withdrawAmountInput.value);
        const withdrawDate = withdrawDateInput.value;
        const notes = withdrawNotesInput ? withdrawNotesInput.value || '' : '';
        
        if (!investorId || isNaN(amount) || amount <= 0 || !withdrawDate) {
            window.notifications.show('الرجاء إدخال جميع البيانات المطلوبة بشكل صحيح', 'error');
            return;
        }
        
        const investor = window.investors.find(inv => inv.id === investorId);
        if (!investor) {
            window.notifications.show('لم يتم العثور على بيانات المستثمر', 'error');
            return;
        }
        
        // التحقق من توفر الرصيد الكافي
        if (amount > (investor.amount || 0)) {
            window.notifications.show('مبلغ السحب أكبر من الرصيد المتاح', 'error');
            return;
        }
        
        // إضافة السحب
        investor.withdrawals.push({
            date: withdrawDate,
            amount,
            notes
        });
        
        // تحديث رصيد المستثمر الإجمالي
        investor.amount = (investor.amount || 0) - amount;
        
        // تحديث الاستثمارات (تخفيض المبالغ بدءًا من الأقدم)
        let remainingWithdrawal = amount;
        for (let i = 0; i < investor.investments.length; i++) {
            if (remainingWithdrawal <= 0) break;
            
            if (investor.investments[i].amount <= remainingWithdrawal) {
                remainingWithdrawal -= investor.investments[i].amount;
                investor.investments[i].amount = 0;
            } else {
                investor.investments[i].amount -= remainingWithdrawal;
                remainingWithdrawal = 0;
            }
            
            // إعادة حساب الفائدة
            if (window.calculateInterest) {
                investor.investments[i].interest = window.calculateInterest(
                    investor.investments[i].amount,
                    investor.investments[i].date
                );
            } else {
                investor.investments[i].interest = investor.investments[i].amount * (window.settings?.interestRate / 100 || 0.175);
            }
        }
        
        // إزالة الاستثمارات ذات المبلغ الصفري
        investor.investments = investor.investments.filter(inv => inv.amount > 0);
        
        // إضافة عملية جديدة
        this.addTransaction('سحب', investorId, amount);
        
        // إغلاق النافذة المنبثقة
        const modal = document.getElementById('add-withdraw-modal');
        if (modal) modal.classList.remove('active');
        
        // عرض إشعار النجاح
        window.notifications.show(`تم سحب مبلغ ${amount.toLocaleString()} ${window.settings?.currency || 'دينار'} من حساب المستثمر ${investor.name} بنجاح!`, 'success');
        
        // تحديث واجهة المستخدم
        if (window.investorsManager) window.investorsManager.renderInvestorsTable();
        if (window.profitsManager) window.profitsManager.renderProfitsTable();
    }
    
    // عرض رصيد المستثمر
    showInvestorBalance() {
        const withdrawInvestorSelect = document.getElementById('withdraw-investor');
        const balanceInfo = document.getElementById('withdraw-balance-info');
        
        if (!withdrawInvestorSelect || !balanceInfo) return;
        
        const investorId = withdrawInvestorSelect.value;
        
        if (!investorId) {
            balanceInfo.innerHTML = '';
            return;
        }
        
        const investor = window.investors.find(inv => inv.id === investorId);
        if (!investor) {
            balanceInfo.innerHTML = '';
            return;
        }
        
        const totalInvestment = investor.amount || 0;
        balanceInfo.innerHTML = `
            <label class="form-label">الرصيد المتاح</label>
            <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color); margin-bottom: 1rem;">
                ${totalInvestment.toLocaleString()} ${window.settings?.currency || 'دينار'}
            </div>
        `;
    }
    
    // ملء قوائم اختيار المستثمرين
    populateInvestorSelects() {
        const depositInvestorSelect = document.getElementById('deposit-investor');
        const withdrawInvestorSelect = document.getElementById('withdraw-investor');
        const profitInvestorSelect = document.getElementById('profit-investor');
        
        // تجهيز قائمة المستثمرين مرتبة أبجديًا
        const sortedInvestors = [...(window.investors || [])].sort((a, b) => a.name.localeCompare(b.name));
        
        // ملء قائمة الإيداع
        if (depositInvestorSelect) {
            depositInvestorSelect.innerHTML = '<option value="">اختر المستثمر</option>';
            sortedInvestors.forEach(investor => {
                const option = document.createElement('option');
                option.value = investor.id;
                option.textContent = `${investor.name} (${investor.phone})`;
                depositInvestorSelect.appendChild(option);
            });
        }
        
        // ملء قائمة السحب
        if (withdrawInvestorSelect) {
            withdrawInvestorSelect.innerHTML = '<option value="">اختر المستثمر</option>';
            sortedInvestors.forEach(investor => {
                const option = document.createElement('option');
                option.value = investor.id;
                option.textContent = `${investor.name} (${investor.phone})`;
                withdrawInvestorSelect.appendChild(option);
            });
        }
        
        // ملء قائمة الأرباح
        if (profitInvestorSelect) {
            profitInvestorSelect.innerHTML = '<option value="">اختر المستثمر</option>';
            sortedInvestors.forEach(investor => {
                const option = document.createElement('option');
                option.value = investor.id;
                option.textContent = `${investor.name} (${investor.phone})`;
                profitInvestorSelect.appendChild(option);
            });
        }
    }
}

// مدير الأرباح
class ProfitsManager {
    constructor() {
        this.initEventListeners();
    }
    
    // تهيئة مستمعي الأحداث
    initEventListeners() {
        // زر دفع الأرباح
        const payProfitsBtn = document.getElementById('pay-profits-btn');
        if (payProfitsBtn) {
            payProfitsBtn.addEventListener('click', () => this.openPayProfitModal());
        }
        
        // زر تأكيد دفع الأرباح
        const confirmPayProfit = document.getElementById('confirm-pay-profit');
        if (confirmPayProfit) {
            confirmPayProfit.addEventListener('click', () => this.payProfit());
        }
        
        // اختيار المستثمر للأرباح
        const profitInvestor = document.getElementById('profit-investor');
        if (profitInvestor) {
            profitInvestor.addEventListener('change', () => this.calculateProfitForInvestor());
        }
        
        // مستمعات إضافية لأزرار دفع الأرباح في الجدول
        document.addEventListener('click', (e) => {
            const target = e.target.closest('.pay-profit-btn');
            if (!target) return;
            
            const investorId = target.getAttribute('data-id');
            if (investorId) {
                this.setupPayProfitForInvestor(investorId);
            }
        });
    }
    
    // فتح نافذة دفع الأرباح
    openPayProfitModal() {
        const modal = document.getElementById('pay-profit-modal');
        if (!modal) {
            console.error('نافذة دفع الأرباح غير موجودة');
            return;
        }
        
        modal.classList.add('active');
        
        // تحديث قائمة المستثمرين
        if (window.transactionsManager) {
            window.transactionsManager.populateInvestorSelects();
        } else if (window.populateInvestorSelects) {
            window.populateInvestorSelects();
        }
        
        // إعادة تعيين النموذج
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        // إعادة تعيين تفاصيل الأرباح
        const profitDetails = document.getElementById('profit-details');
        if (profitDetails) profitDetails.innerHTML = '';
    }
    
    // إعداد المستثمر لدفع الأرباح
    setupPayProfitForInvestor(investorId) {
        const profitInvestorSelect = document.getElementById('profit-investor');
        if (profitInvestorSelect) {
            profitInvestorSelect.value = investorId;
            this.calculateProfitForInvestor();
            this.openPayProfitModal();
        }
    }
    
    // حساب الأرباح لمستثمر محدد
    calculateProfitForInvestor() {
        const investorSelect = document.getElementById('profit-investor');
        if (!investorSelect) return;
        
        const investorId = investorSelect.value;
        const profitDetails = document.getElementById('profit-details');
        
        if (!investorId || !profitDetails) {
            if (profitDetails) profitDetails.innerHTML = '';
            return;
        }
        
        const investor = window.investors.find(inv => inv.id === investorId);
        
        if (investor) {
            let totalProfit = 0;
            let profitBreakdown = `
                <div class="section">
                    <h3 class="section-title">تفاصيل الأرباح</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>المبلغ</th>
                                <th>تاريخ الإيداع</th>
                                <th>أيام الاستثمار</th>
                                <th>الربح</th>
                            </tr>
                        </thead>
                        <tbody>
            `;
            
            investor.investments.forEach(inv => {
                const start = new Date(inv.date);
                const today = new Date();
                const days = Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
                
                // حساب الربح
                let profit = 0;
                if (window.calculateInterest) {
                    profit = window.calculateInterest(inv.amount, inv.date, today.toISOString().split('T')[0]);
                } else if (window.settings && window.settings.interestRate) {
                    profit = inv.amount * (window.settings.interestRate / 100);
                } else {
                    profit = inv.amount * 0.175; // استخدام القيمة الافتراضية 17.5%
                }
                
                totalProfit += profit;
                profitBreakdown += `
                    <tr>
                        <td>${inv.amount.toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                        <td>${inv.date}</td>
                        <td>${days} يوم</td>
                        <td>${profit.toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                    </tr>
                `;
            });
            
            profitBreakdown += `
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3"><strong>إجمالي الربح</strong></td>
                                <td><strong>${totalProfit.toLocaleString()} ${window.settings?.currency || 'دينار'}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            `;
            
            profitDetails.innerHTML = profitBreakdown;
        } else {
            profitDetails.innerHTML = '<p>لم يتم العثور على بيانات المستثمر</p>';
        }
    }
    
    // دفع الأرباح
    payProfit() {
        const profitInvestorSelect = document.getElementById('profit-investor');
        if (!profitInvestorSelect) {
            window.notifications.show('خطأ في النموذج: لم يتم العثور على عنصر اختيار المستثمر', 'error');
            return;
        }
        
        const investorId = profitInvestorSelect.value;
        if (!investorId) {
            window.notifications.show('الرجاء اختيار مستثمر', 'error');
            return;
        }
        
        const investor = window.investors.find(inv => inv.id === investorId);
        if (!investor) {
            window.notifications.show('لم يتم العثور على بيانات المستثمر', 'error');
            return;
        }
        
        let totalProfit = 0;
        investor.investments.forEach(inv => {
            const start = new Date(inv.date);
            const today = new Date();
            
            // حساب الربح
            let profit = 0;
            if (window.calculateInterest) {
                profit = window.calculateInterest(inv.amount, inv.date, today.toISOString().split('T')[0]);
            } else if (window.settings && window.settings.interestRate) {
                profit = inv.amount * (window.settings.interestRate / 100);
            } else {
                profit = inv.amount * 0.175; // استخدام القيمة الافتراضية 17.5%
            }
            
            totalProfit += profit;
        });
        
        // تسجيل عملية دفع الأرباح
        investor.profits.push({
            date: new Date().toISOString().split('T')[0],
            amount: totalProfit
        });
        
        // إضافة عملية جديدة
        if (window.transactionsManager) {
            window.transactionsManager.addTransaction('دفع أرباح', investorId, totalProfit);
        } else if (window.addTransaction) {
            window.addTransaction('دفع أرباح', investorId, totalProfit);
        }
        
        // حفظ البيانات
        if (window.saveData) {
            window.saveData();
        } else {
            localStorage.setItem('investors', JSON.stringify(window.investors));
        }
        
        // تحديث الواجهة
        this.renderProfitsTable();
        
        // إغلاق النافذة المنبثقة
        const modal = document.getElementById('pay-profit-modal');
        if (modal) modal.classList.remove('active');
        
        // عرض إشعار النجاح
        window.notifications.show(`تم دفع الأرباح بمبلغ ${totalProfit.toLocaleString()} ${window.settings?.currency || 'دينار'} للمستثمر ${investor.name} بنجاح!`, 'success');
        
        // تحديث باقي الواجهة
        if (window.updateDashboard) window.updateDashboard();
    }
    
    // عرض جدول الأرباح
    renderProfitsTable() {
        const tableBody = document.querySelector('#profits-table tbody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (!window.investors || window.investors.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="7" class="text-center">لا يوجد أرباح مستحقة</td>';
            tableBody.appendChild(emptyRow);
            return;
        }
        
        // إعداد قائمة الأرباح المستحقة لكل مستثمر
        const profitsList = [];
        
        window.investors.forEach(investor => {
            if (!investor.investments || investor.investments.length === 0) return;
            
            const totalInvestment = investor.amount || investor.investments.reduce((sum, inv) => sum + inv.amount, 0);
            if (totalInvestment <= 0) return;
            
            // اختيار أقدم تاريخ استثمار
            const oldestInvestment = investor.investments.reduce((oldest, current) => {
                const oldestDate = oldest ? new Date(oldest.date) : new Date();
                const currentDate = new Date(current.date);
                return currentDate < oldestDate ? current : oldest;
            }, null);
            
            if (!oldestInvestment) return;
            
            const investmentDate = oldestInvestment.date;
            const today = new Date();
            const investmentStartDate = new Date(investmentDate);
            
            // حساب عدد أيام الاستثمار
            const days = Math.floor((today - investmentStartDate) / (1000 * 60 * 60 * 24));
            
            // حساب الربح المستحق
            let profit = 0;
            investor.investments.forEach(inv => {
                if (window.calculateInterest) {
                    profit += window.calculateInterest(inv.amount, inv.date);
                } else if (window.settings && window.settings.interestRate) {
                    profit += inv.amount * (window.settings.interestRate / 100);
                } else {
                    profit += inv.amount * 0.175; // استخدام القيمة الافتراضية 17.5%
                }
            });
            
            // تقدير تاريخ الاستحقاق (بعد 30 يوم من تاريخ الاستثمار)
            const dueDate = new Date(investmentStartDate);
            dueDate.setDate(dueDate.getDate() + (window.settings?.profitCycle || 30));
            
            profitsList.push({
                investor: investor,
                investmentAmount: totalInvestment,
                investmentDate: investmentDate,
                days: days,
                profit: profit,
                dueDate: dueDate
            });
        });
        
        // ترتيب الأرباح حسب تاريخ الاستحقاق (الأقرب أولاً)
        profitsList.sort((a, b) => a.dueDate - b.dueDate);
        
        // عرض الأرباح في الجدول
        profitsList.forEach(item => {
            const row = document.createElement('tr');
            
            // تحديد حالة استحقاق الربح
            const today = new Date();
            const isDue = item.dueDate <= today;
            const daysToMaturity = Math.floor((item.dueDate - today) / (1000 * 60 * 60 * 24));
            
            let dueBadge = '';
            if (isDue) {
                dueBadge = '<span class="badge badge-danger">مستحق الآن</span>';
            } else if (daysToMaturity <= (window.settings?.reminderDays || 3)) {
                dueBadge = `<span class="badge badge-warning">بعد ${daysToMaturity} يوم</span>`;
            }
            
            row.innerHTML = `
                <td>
                    <div class="investor-info">
                        <div class="investor-avatar">${item.investor.name.charAt(0)}</div>
                        <div>
                            <div class="investor-name">${item.investor.name}</div>
                            <div class="investor-id">${item.investor.phone}</div>
                        </div>
                    </div>
                </td>
                <td>${item.investmentAmount.toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                <td>${item.investmentDate}</td>
                <td>${item.days} يوم</td>
                <td>${item.profit.toLocaleString()} ${window.settings?.currency || 'دينار'}</td>
                <td>${item.dueDate.toISOString().split('T')[0]} ${dueBadge}</td>
                <td>
                    <button class="btn btn-success btn-sm pay-profit-btn" data-id="${item.investor.id}">
                        <i class="fas fa-coins"></i>
                        <span>دفع الأرباح</span>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        if (profitsList.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = '<td colspan="7" class="text-center">لا يوجد أرباح مستحقة</td>';
            tableBody.appendChild(emptyRow);
        }
        
        // إضافة مستمعي الأحداث لأزرار دفع الأرباح
        document.querySelectorAll('.pay-profit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const investorId = btn.getAttribute('data-id');
                this.setupPayProfitForInvestor(investorId);
            });
        });
    }
}

// مدير التنقل
class Navigation {
    constructor() {
        this.initNavigation();
    }
    
    // تهيئة التنقل بين الصفحات
    initNavigation() {
        // التنقل بين الصفحات
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // إزالة الكلاس النشط من جميع الروابط
                navLinks.forEach(l => l.classList.remove('active'));
                
                // إضافة الكلاس النشط للرابط المحدد
                link.classList.add('active');
                
                // إظهار الصفحة المقابلة
                const pageId = link.getAttribute('data-page');
                this.showPage(pageId);
            });
        });

        // التبديل بين التبويبات
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                const tabContent = document.getElementById(`${tabId}-tab`);
                
                // إزالة الكلاس النشط من جميع الأزرار والمحتويات
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                // إضافة الكلاس النشط للزر والمحتوى المحدد
                this.classList.add('active');
                if (tabContent) {
                    tabContent.classList.add('active');
                }
            });
        });

        // أزرار فتح وإغلاق القائمة الجانبية
        document.querySelectorAll('.toggle-sidebar').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('active');
            });
        });
    }
    
    // إظهار صفحة محددة
    showPage(pageId) {
        // إخفاء جميع الصفحات
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // إظهار الصفحة المطلوبة
        const targetPage = document.getElementById(`${pageId}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    }
    
    // التنقل إلى صفحة محددة
    navigateTo(pageId) {
        const navLink = document.querySelector(`.nav-link[data-page="${pageId}"]`);
        if (navLink) {
            navLink.click();
        } else {
            this.showPage(pageId);
        }
    }
}

// أضف المديرين إلى النافذة العامة ليتم الوصول إليهم من باقي أجزاء التطبيق
window.notifications = new NotificationsManager();
window.navigation = new Navigation();
window.investorsManager = new InvestorsManager();
window.transactionsManager = new TransactionsManager();
window.profitsManager = new ProfitsManager();