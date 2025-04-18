/**
 * نظام الاستثمار المتكامل - إدارة العمليات
 * يتحكم في وظائف صفحة العمليات، بما في ذلك عرض العمليات وإضافة عمليات جديدة (إيداع/سحب)
 */

class TransactionsManager {
    constructor() {
        // عناصر واجهة المستخدم
        this.transactionsTable = document.getElementById('transactions-table').querySelector('tbody');
        this.addDepositBtn = document.getElementById('add-deposit-btn');
        this.addWithdrawBtn = document.getElementById('add-withdraw-btn');
        this.depositModal = document.getElementById('add-deposit-modal');
        this.withdrawModal = document.getElementById('add-withdraw-modal');
        this.saveDepositBtn = document.getElementById('save-deposit-btn');
        this.saveWithdrawBtn = document.getElementById('save-withdraw-btn');
        this.depositInvestorSelect = document.getElementById('deposit-investor');
        this.withdrawInvestorSelect = document.getElementById('withdraw-investor');
        this.withdrawBalanceInfo = document.getElementById('withdraw-balance-info');
        
        // البيانات
        this.transactions = [];
        this.investors = [];
        this.filterType = 'all'; // all, deposit, withdraw, profit
        
        // تهيئة صفحة العمليات
        this.initialize();
    }
    
    // تهيئة صفحة العمليات
    async initialize() {
        // تحميل البيانات
        await this.loadData();
        
        // عرض جدول العمليات
        this.renderTransactionsTable();
        
        // تحديث قوائم المستثمرين في النماذج
        this.updateInvestorsSelects();
        
        // إعداد المستمعين للأحداث
        this.setupEventListeners();
    }
    
    // تحميل البيانات
    async loadData() {
        this.transactions = db.getAllTransactions();
        this.investors = db.getAllInvestors();
    }
    
    // عرض جدول العمليات
    renderTransactionsTable() {
        // تصفية العمليات حسب النوع المحدد
        let filteredTransactions = [...this.transactions];
        
        if (this.filterType !== 'all') {
            filteredTransactions = filteredTransactions.filter(trx => {
                return trx.type.toLowerCase() === this.filterType.toLowerCase();
            });
        }
        
        // ترتيب العمليات حسب التاريخ (الأحدث أولاً)
        filteredTransactions.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        // إفراغ الجدول
        this.transactionsTable.innerHTML = '';
        
        // إضافة صفوف العمليات
        filteredTransactions.forEach(transaction => {
            // الحصول على معلومات المستثمر
            const investor = this.investors.find(inv => inv.id === transaction.investorId) || { name: 'غير معروف' };
            
            // تحديد لون ونوع العملية
            let typeClass = '';
            switch (transaction.type) {
                case TRANSACTION_TYPES.DEPOSIT:
                    typeClass = 'success';
                    break;
                case TRANSACTION_TYPES.WITHDRAW:
                    typeClass = 'danger';
                    break;
                case TRANSACTION_TYPES.PROFIT:
                    typeClass = 'primary';
                    break;
            }
            
            // إنشاء الصف
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>
                    <div class="investor-info">
                        <div class="investor-avatar">${investor.name.charAt(0)}</div>
                        <div>
                            <div class="investor-name">${investor.name}</div>
                            <div class="investor-id">${investor.id}</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="transaction-type">
                        <div class="transaction-type-icon ${typeClass.toLowerCase()}">${transaction.type === TRANSACTION_TYPES.DEPOSIT ? '↑' : (transaction.type === TRANSACTION_TYPES.WITHDRAW ? '↓' : '↔')}</div>
                        <span>${transaction.type}</span>
                    </div>
                </td>
                <td>${formatDate(transaction.date || transaction.createdAt)}</td>
                <td class="transaction-amount ${transaction.type === TRANSACTION_TYPES.DEPOSIT || transaction.type === TRANSACTION_TYPES.PROFIT ? 'positive' : 'negative'}">
                    ${transaction.type === TRANSACTION_TYPES.WITHDRAW ? '-' : '+'} ${formatCurrency(transaction.amount)} ${SYSTEM_CONFIG.currency}
                </td>
                <td>${transaction.balanceAfter ? formatCurrency(transaction.balanceAfter) + ' ' + SYSTEM_CONFIG.currency : '-'}</td>
                <td>
                    <div class="investor-actions">
                        <button class="investor-action-btn view-transaction" data-id="${transaction.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${transaction.notes ? `
                            <button class="investor-action-btn info view-notes" data-notes="${transaction.notes}">
                                <i class="fas fa-info"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            `;
            
            this.transactionsTable.appendChild(row);
        });
        
        // إذا لم تكن هناك عمليات، نظهر رسالة
        if (filteredTransactions.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="7" class="text-center">لا توجد عمليات</td>
            `;
            this.transactionsTable.appendChild(emptyRow);
        }
    }
    
    // تحديث قوائم المستثمرين في النماذج
    updateInvestorsSelects() {
        // تصفية المستثمرين النشطين فقط
        const activeInvestors = this.investors.filter(investor => investor.status === INVESTOR_STATUS.ACTIVE);
        
        // ترتيب المستثمرين حسب الاسم
        activeInvestors.sort((a, b) => a.name.localeCompare(b.name));
        
        // إفراغ القوائم
        this.depositInvestorSelect.innerHTML = '<option value="">اختر المستثمر</option>';
        this.withdrawInvestorSelect.innerHTML = '<option value="">اختر المستثمر</option>';
        
        // إضافة المستثمرين إلى القوائم
        activeInvestors.forEach(investor => {
            // قائمة الإيداع
            const depositOption = document.createElement('option');
            depositOption.value = investor.id;
            depositOption.textContent = `${investor.name} (${investor.phone})`;
            this.depositInvestorSelect.appendChild(depositOption);
            
            // قائمة السحب
            const withdrawOption = document.createElement('option');
            withdrawOption.value = investor.id;
            withdrawOption.textContent = `${investor.name} (${investor.phone})`;
            this.withdrawInvestorSelect.appendChild(withdrawOption);
        });
    }
    
    // إعداد المستمعين للأحداث
    setupEventListeners() {
        // الاستماع لتغيير الصفحة
        document.addEventListener('page:change', (e) => {
            if (e.detail.page === 'transactions') {
                this.refresh();
            }
        });
        
        // فتح نوافذ الإيداع والسحب
        this.addDepositBtn.addEventListener('click', () => {
            this.openDepositModal();
        });
        
        this.addWithdrawBtn.addEventListener('click', () => {
            this.openWithdrawModal();
        });
        
        // حفظ عمليات الإيداع والسحب
        this.saveDepositBtn.addEventListener('click', () => {
            this.saveDeposit();
        });
        
        this.saveWithdrawBtn.addEventListener('click', () => {
            this.saveWithdraw();
        });
        
        // إغلاق النوافذ المنبثقة عند النقر على زر الإغلاق
        document.querySelectorAll('.modal-close, .modal-close-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.modal-overlay').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });
        
        // تصفية العمليات حسب النوع
        document.querySelectorAll('.btn-group button').forEach(button => {
            button.addEventListener('click', () => {
                // تحديث الزر النشط
                document.querySelectorAll('.btn-group button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // تحديث نوع التصفية
                const filterText = button.textContent.trim().toLowerCase();
                switch (filterText) {
                    case 'إيداع':
                        this.filterType = 'deposit';
                        break;
                    case 'سحب':
                        this.filterType = 'withdraw';
                        break;
                    case 'أرباح':
                        this.filterType = 'profit';
                        break;
                    default:
                        this.filterType = 'all';
                }
                
                // تحديث الجدول
                this.renderTransactionsTable();
            });
        });
        
        // عرض ملاحظات العملية
        this.transactionsTable.addEventListener('click', (e) => {
            const viewNotesBtn = e.target.closest('.view-notes');
            const viewTransactionBtn = e.target.closest('.view-transaction');
            
            if (viewNotesBtn) {
                const notes = viewNotesBtn.getAttribute('data-notes');
                alert(notes);
            }
            
            if (viewTransactionBtn) {
                const transactionId = viewTransactionBtn.getAttribute('data-id');
                this.showTransactionDetails(transactionId);
            }
        });
        
        // تغيير المستثمر في نموذج السحب لعرض الرصيد
        this.withdrawInvestorSelect.addEventListener('change', () => {
            this.updateWithdrawInfo();
        });
    }
    
    // تحديث معلومات السحب
    updateWithdrawInfo() {
        const investorId = this.withdrawInvestorSelect.value;
        
        if (investorId) {
            const investor = this.investors.find(inv => inv.id === investorId);
            
            if (investor) {
                this.withdrawBalanceInfo.innerHTML = `
                    <div class="alert alert-info">
                        <div class="alert-title">معلومات الرصيد</div>
                        <div class="alert-content">
                            <strong>الرصيد الحالي:</strong> ${formatCurrency(investor.amount)} ${SYSTEM_CONFIG.currency}
                        </div>
                    </div>
                `;
                
                // تعيين الحد الأقصى للسحب
                document.getElementById('withdraw-amount').max = investor.amount;
            }
        } else {
            this.withdrawBalanceInfo.innerHTML = '';
        }
    }
    
    // فتح نافذة الإيداع
    openDepositModal() {
        // إعادة تعيين النموذج
        document.getElementById('add-deposit-form').reset();
        
        // تعيين تاريخ اليوم كتاريخ افتراضي
        document.getElementById('deposit-date').value = new Date().toISOString().split('T')[0];
        
        // عرض النافذة المنبثقة
        this.depositModal.classList.add('active');
    }
    
    // فتح نافذة السحب
    openWithdrawModal() {
        // إعادة تعيين النموذج
        document.getElementById('add-withdraw-form').reset();
        this.withdrawBalanceInfo.innerHTML = '';
        
        // تعيين تاريخ اليوم كتاريخ افتراضي
        document.getElementById('withdraw-date').value = new Date().toISOString().split('T')[0];
        
        // عرض النافذة المنبثقة
        this.withdrawModal.classList.add('active');
    }
    
    // التحقق من نموذج الإيداع
    validateDepositForm() {
        const investorSelect = document.getElementById('deposit-investor');
        const amountInput = document.getElementById('deposit-amount');
        const dateInput = document.getElementById('deposit-date');
        
        let isValid = true;
        
        if (!investorSelect.value) {
            isValid = false;
            investorSelect.classList.add('error');
        } else {
            investorSelect.classList.remove('error');
        }
        
        if (!amountInput.value || Number(amountInput.value) <= 0) {
            isValid = false;
            amountInput.classList.add('error');
        } else {
            amountInput.classList.remove('error');
        }
        
        if (!dateInput.value) {
            isValid = false;
            dateInput.classList.add('error');
        } else {
            dateInput.classList.remove('error');
        }
        
        return isValid;
    }
    
    // التحقق من نموذج السحب
    validateWithdrawForm() {
        const investorSelect = document.getElementById('withdraw-investor');
        const amountInput = document.getElementById('withdraw-amount');
        const dateInput = document.getElementById('withdraw-date');
        
        let isValid = true;
        
        if (!investorSelect.value) {
            isValid = false;
            investorSelect.classList.add('error');
        } else {
            investorSelect.classList.remove('error');
        }
        
        if (!amountInput.value || Number(amountInput.value) <= 0) {
            isValid = false;
            amountInput.classList.add('error');
        } else {
            amountInput.classList.remove('error');
        }
        
        if (!dateInput.value) {
            isValid = false;
            dateInput.classList.add('error');
        } else {
            dateInput.classList.remove('error');
        }
        
        // التحقق من أن المبلغ المطلوب سحبه لا يتجاوز رصيد المستثمر
        if (investorSelect.value && amountInput.value) {
            const investor = this.investors.find(inv => inv.id === investorSelect.value);
            if (investor && Number(amountInput.value) > Number(investor.amount)) {
                isValid = false;
                amountInput.classList.add('error');
                this.showNotification('المبلغ المطلوب سحبه أكبر من رصيد المستثمر', 'danger');
            }
        }
        
        return isValid;
    }
    
    // حفظ عملية الإيداع
    saveDeposit() {
        if (!this.validateDepositForm()) {
            return;
        }
        
        const investorId = document.getElementById('deposit-investor').value;
        const amount = Number(document.getElementById('deposit-amount').value);
        const date = document.getElementById('deposit-date').value;
        const notes = document.getElementById('deposit-notes').value.trim();
        
        // إنشاء عملية الإيداع
        const depositData = {
            investorId,
            type: TRANSACTION_TYPES.DEPOSIT,
            amount,
            date,
            notes,
            status: TRANSACTION_STATUS.COMPLETED
        };
        
        // إضافة العملية
        const newTransaction = db.addTransaction(depositData);
        
        if (newTransaction) {
            // عرض رسالة نجاح
            this.showNotification('تمت عملية الإيداع بنجاح', 'success');
            
            // تحديث البيانات
            this.refresh();
            
            // إغلاق النافذة المنبثقة
            this.depositModal.classList.remove('active');
        } else {
            // عرض رسالة خطأ
            this.showNotification('حدث خطأ أثناء عملية الإيداع', 'danger');
        }
    }
    
    // حفظ عملية السحب
    saveWithdraw() {
        if (!this.validateWithdrawForm()) {
            return;
        }
        
        const investorId = document.getElementById('withdraw-investor').value;
        const amount = Number(document.getElementById('withdraw-amount').value);
        const date = document.getElementById('withdraw-date').value;
        const notes = document.getElementById('withdraw-notes').value.trim();
        
        // إنشاء عملية السحب
        const withdrawData = {
            investorId,
            type: TRANSACTION_TYPES.WITHDRAW,
            amount,
            date,
            notes,
            status: TRANSACTION_STATUS.COMPLETED
        };
        
        // إضافة العملية
        const newTransaction = db.addTransaction(withdrawData);
        
        if (newTransaction) {
            // عرض رسالة نجاح
            this.showNotification('تمت عملية السحب بنجاح', 'success');
            
            // تحديث البيانات
            this.refresh();
            
            // إغلاق النافذة المنبثقة
            this.withdrawModal.classList.remove('active');
        } else {
            // عرض رسالة خطأ
            this.showNotification('حدث خطأ أثناء عملية السحب', 'danger');
        }
    }
    
    // عرض تفاصيل العملية
    showTransactionDetails(transactionId) {
        const transaction = db.getTransactionById(transactionId);
        
        if (transaction) {
            const investor = this.investors.find(inv => inv.id === transaction.investorId) || { name: 'غير معروف' };
            
            let typeClass = '';
            switch (transaction.type) {
                case TRANSACTION_TYPES.DEPOSIT:
                    typeClass = 'success';
                    break;
                case TRANSACTION_TYPES.WITHDRAW:
                    typeClass = 'danger';
                    break;
                case TRANSACTION_TYPES.PROFIT:
                    typeClass = 'primary';
                    break;
            }
            
            const detailsHTML = `
                <div class="transaction-details">
                    <div class="transaction-header">
                        <div class="transaction-badge ${typeClass.toLowerCase()}">${transaction.type}</div>
                        <div class="transaction-date">${formatDate(transaction.date || transaction.createdAt)}</div>
                    </div>
                    
                    <div class="transaction-info">
                        <h3>معلومات العملية</h3>
                        <div class="detail-item">
                            <div class="detail-label">المعرف</div>
                            <div class="detail-value">${transaction.id}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">المستثمر</div>
                            <div class="detail-value">${investor.name} (${investor.id})</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">النوع</div>
                            <div class="detail-value">${transaction.type}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">التاريخ</div>
                            <div class="detail-value">${formatDate(transaction.date || transaction.createdAt)}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">المبلغ</div>
                            <div class="detail-value">${formatCurrency(transaction.amount)} ${SYSTEM_CONFIG.currency}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">الرصيد بعد العملية</div>
                            <div class="detail-value">${transaction.balanceAfter ? formatCurrency(transaction.balanceAfter) + ' ' + SYSTEM_CONFIG.currency : '-'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">الحالة</div>
                            <div class="detail-value">${transaction.status}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">الملاحظات</div>
                            <div class="detail-value">${transaction.notes || 'لا توجد ملاحظات'}</div>
                        </div>
                    </div>
                </div>
            `;
            
            // استخدام مكونات الإشعارات لعرض التفاصيل
            if (window.notifications) {
                window.notifications.showCustom('تفاصيل العملية', detailsHTML);
            } else {
                alert(`تفاصيل العملية: ${transaction.id}\nالمستثمر: ${investor.name}\nالنوع: ${transaction.type}\nالمبلغ: ${formatCurrency(transaction.amount)} ${SYSTEM_CONFIG.currency}\nالتاريخ: ${formatDate(transaction.date || transaction.createdAt)}`);
            }
        }
    }
    
    // عرض إشعار
    showNotification(message, type = 'success') {
        // استدعاء وظيفة الإشعارات العامة
        if (window.notifications) {
            window.notifications.show(message, type);
        } else {
            alert(message);
        }
    }
    
    // تحديث صفحة العمليات
    async refresh() {
        await this.loadData();
        this.renderTransactionsTable();
        this.updateInvestorsSelects();
    }
}

// إنشاء كائن إدارة العمليات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.transactionsManager = new TransactionsManager();
});