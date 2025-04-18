/**
 * نظام الاستثمار المتكامل - إدارة المستثمرين
 * يتحكم في وظائف صفحة المستثمرين، بما في ذلك عرض القائمة وإضافة/تعديل/حذف المستثمرين
 */

class InvestorsManager {
    constructor() {
        // عناصر واجهة المستخدم
        this.investorsTable = document.getElementById('investors-table').querySelector('tbody');
        this.addInvestorBtn = document.getElementById('add-investor-btn');
        this.addInvestorModal = document.getElementById('add-investor-modal');
        this.addInvestorForm = document.getElementById('add-investor-form');
        this.saveInvestorBtn = document.getElementById('save-investor-btn');
        this.investorDetailsModal = document.getElementById('investor-details-modal');
        this.investorDetailsContent = document.getElementById('investor-details-content');
        this.editInvestorBtn = document.getElementById('edit-investor-btn');
        this.deleteInvestorBtn = document.getElementById('delete-investor-btn');
        this.investorProfitBtn = document.getElementById('investor-profit-btn');
        
        // البيانات
        this.investors = [];
        this.currentInvestor = null;
        this.isEditing = false;
        
        // تهيئة صفحة المستثمرين
        this.initialize();
    }
    
    // تهيئة صفحة المستثمرين
    async initialize() {
        // تحميل البيانات
        await this.loadData();
        
        // عرض جدول المستثمرين
        this.renderInvestorsTable();
        
        // إعداد المستمعين للأحداث
        this.setupEventListeners();
    }
    
    // تحميل البيانات
    async loadData() {
        this.investors = db.getAllInvestors();
    }
    
    // عرض جدول المستثمرين
    renderInvestorsTable() {
        // ترتيب المستثمرين حسب تاريخ الإنشاء (الأحدث أولاً)
        const sortedInvestors = [...this.investors].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        
        // إفراغ الجدول
        this.investorsTable.innerHTML = '';
        
        // إضافة صفوف المستثمرين
        sortedInvestors.forEach(investor => {
            // حساب الربح الشهري
            const monthlyProfit = calculateProfit(investor.amount, 30);
            
            // تحديد لون حالة المستثمر
            let statusClass = '';
            switch (investor.status) {
                case INVESTOR_STATUS.ACTIVE:
                    statusClass = 'success';
                    break;
                case INVESTOR_STATUS.PENDING:
                    statusClass = 'warning';
                    break;
                case INVESTOR_STATUS.INACTIVE:
                    statusClass = 'danger';
                    break;
            }
            
            // إنشاء الصف
            const row = document.createElement('tr');
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
                <td>${formatCurrency(investor.amount)} ${SYSTEM_CONFIG.currency}</td>
                <td>${formatCurrency(monthlyProfit)} ${SYSTEM_CONFIG.currency}</td>
                <td>${formatDate(investor.depositDate || investor.createdAt)}</td>
                <td>
                    <span class="badge badge-${statusClass.toLowerCase()}">${investor.status}</span>
                </td>
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
            
            this.investorsTable.appendChild(row);
        });
        
        // إذا لم يكن هناك مستثمرين، نظهر رسالة
        if (sortedInvestors.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="8" class="text-center">لا يوجد مستثمرين</td>
            `;
            this.investorsTable.appendChild(emptyRow);
        }
    }
    
    // إعداد المستمعين للأحداث
    setupEventListeners() {
        // الاستماع لتغيير الصفحة
        document.addEventListener('page:change', (e) => {
            if (e.detail.page === 'investors') {
                this.refresh();
            }
        });
        
        // فتح نافذة إضافة مستثمر
        this.addInvestorBtn.addEventListener('click', () => {
            this.openAddInvestorModal();
        });
        
        // حفظ المستثمر
        this.saveInvestorBtn.addEventListener('click', () => {
            this.saveInvestor();
        });
        
        // إغلاق النوافذ المنبثقة عند النقر على زر الإغلاق
        document.querySelectorAll('.modal-close, .modal-close-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.modal-overlay').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });
        
        // التعامل مع النقر على أزرار المستثمرين
        this.investorsTable.addEventListener('click', (e) => {
            const viewButton = e.target.closest('.view-investor');
            const editButton = e.target.closest('.edit-investor');
            const deleteButton = e.target.closest('.delete-investor');
            
            if (viewButton) {
                const investorId = viewButton.getAttribute('data-id');
                this.showInvestorDetails(investorId);
            }
            
            if (editButton) {
                const investorId = editButton.getAttribute('data-id');
                this.openEditInvestorModal(investorId);
            }
            
            if (deleteButton) {
                const investorId = deleteButton.getAttribute('data-id');
                this.confirmDeleteInvestor(investorId);
            }
        });
        
        // أزرار في نافذة تفاصيل المستثمر
        this.editInvestorBtn.addEventListener('click', () => {
            if (this.currentInvestor) {
                this.openEditInvestorModal(this.currentInvestor.id);
            }
        });
        
        this.deleteInvestorBtn.addEventListener('click', () => {
            if (this.currentInvestor) {
                this.confirmDeleteInvestor(this.currentInvestor.id);
            }
        });
        
        this.investorProfitBtn.addEventListener('click', () => {
            if (this.currentInvestor) {
                this.openPayProfitModal(this.currentInvestor.id);
                this.closeInvestorDetailsModal();
            }
        });
        
        // مراقبة نموذج إضافة مستثمر للتحقق
        this.addInvestorForm.addEventListener('input', () => {
            this.validateForm();
        });
    }
    
    // التحقق من صحة النموذج
    validateForm() {
        const nameInput = document.getElementById('investor-name');
        const phoneInput = document.getElementById('investor-phone');
        const amountInput = document.getElementById('investor-amount');
        const depositDateInput = document.getElementById('investor-deposit-date');
        
        let isValid = true;
        
        if (!nameInput.value.trim()) {
            isValid = false;
            nameInput.classList.add('error');
        } else {
            nameInput.classList.remove('error');
        }
        
        if (!phoneInput.value.trim()) {
            isValid = false;
            phoneInput.classList.add('error');
        } else {
            phoneInput.classList.remove('error');
        }
        
        if (!amountInput.value || Number(amountInput.value) <= 0) {
            isValid = false;
            amountInput.classList.add('error');
        } else {
            amountInput.classList.remove('error');
        }
        
        if (!depositDateInput.value) {
            isValid = false;
            depositDateInput.classList.add('error');
        } else {
            depositDateInput.classList.remove('error');
        }
        
        this.saveInvestorBtn.disabled = !isValid;
        
        return isValid;
    }
    
    // فتح نافذة إضافة مستثمر
    openAddInvestorModal() {
        // إعادة تعيين النموذج
        this.addInvestorForm.reset();
        
        // تعيين تاريخ اليوم كتاريخ افتراضي
        document.getElementById('investor-deposit-date').value = new Date().toISOString().split('T')[0];
        
        // تحديث عنوان النافذة
        document.querySelector('#add-investor-modal .modal-title').textContent = 'إضافة مستثمر جديد';
        
        // تحديث نص زر الحفظ
        this.saveInvestorBtn.textContent = 'إضافة';
        
        // إعادة تعيين متغيرات الحالة
        this.currentInvestor = null;
        this.isEditing = false;
        
        // عرض النافذة المنبثقة
        this.addInvestorModal.classList.add('active');
    }
    
    // فتح نافذة تعديل مستثمر
    openEditInvestorModal(investorId) {
        // الحصول على بيانات المستثمر
        const investor = db.getInvestorById(investorId);
        
        if (investor) {
            // تعيين قيم النموذج
            document.getElementById('investor-name').value = investor.name;
            document.getElementById('investor-phone').value = investor.phone;
            document.getElementById('investor-address').value = investor.address || '';
            document.getElementById('investor-card').value = investor.card || '';
            document.getElementById('investor-amount').value = investor.amount;
            
            // تنسيق التاريخ للحقل
            let depositDate = investor.depositDate || investor.createdAt;
            if (depositDate) {
                depositDate = new Date(depositDate).toISOString().split('T')[0];
                document.getElementById('investor-deposit-date').value = depositDate;
            }
            
            // تحديث عنوان النافذة
            document.querySelector('#add-investor-modal .modal-title').textContent = 'تعديل بيانات المستثمر';
            
            // تحديث نص زر الحفظ
            this.saveInvestorBtn.textContent = 'حفظ التعديلات';
            
            // تعيين متغيرات الحالة
            this.currentInvestor = investor;
            this.isEditing = true;
            
            // عرض النافذة المنبثقة
            this.addInvestorModal.classList.add('active');
            
            // إغلاق نافذة التفاصيل إذا كانت مفتوحة
            this.closeInvestorDetailsModal();
        }
    }
    
    // حفظ المستثمر
    saveInvestor() {
        // التحقق من صحة النموذج
        if (!this.validateForm()) {
            return;
        }
        
        // جمع البيانات من النموذج
        const investorData = {
            name: document.getElementById('investor-name').value.trim(),
            phone: document.getElementById('investor-phone').value.trim(),
            address: document.getElementById('investor-address').value.trim(),
            card: document.getElementById('investor-card').value.trim(),
            amount: Number(document.getElementById('investor-amount').value),
            depositDate: document.getElementById('investor-deposit-date').value,
            status: INVESTOR_STATUS.ACTIVE
        };
        
        // إضافة أو تحديث المستثمر
        if (this.isEditing && this.currentInvestor) {
            // تحديث المستثمر
            const updatedInvestor = db.updateInvestor(this.currentInvestor.id, investorData);
            
            if (updatedInvestor) {
                // عرض رسالة نجاح
                this.showNotification('تم تحديث بيانات المستثمر بنجاح', 'success');
                
                // تحديث الجدول
                this.refresh();
                
                // إغلاق النافذة المنبثقة
                this.addInvestorModal.classList.remove('active');
            } else {
                // عرض رسالة خطأ
                this.showNotification('حدث خطأ أثناء تحديث بيانات المستثمر', 'danger');
            }
        } else {
            // إضافة مستثمر جديد
            const newInvestor = db.addInvestor(investorData);
            
            if (newInvestor) {
                // عرض رسالة نجاح
                this.showNotification('تمت إضافة المستثمر بنجاح', 'success');
                
                // تحديث الجدول
                this.refresh();
                
                // إغلاق النافذة المنبثقة
                this.addInvestorModal.classList.remove('active');
            } else {
                // عرض رسالة خطأ
                this.showNotification('حدث خطأ أثناء إضافة المستثمر', 'danger');
            }
        }
    }
    
    // عرض تفاصيل المستثمر
    showInvestorDetails(investorId) {
        // الحصول على بيانات المستثمر
        const investor = db.getInvestorById(investorId);
        
        if (investor) {
            // الحصول على عمليات المستثمر
            const transactions = db.getInvestorTransactions(investorId);
            
            // الحصول على أرباح المستثمر
            const profits = db.getInvestorProfits(investorId);
            
            // حساب الربح الشهري
            const monthlyProfit = calculateProfit(investor.amount, 30);
            
            // حساب إجمالي الإيداعات
            const totalDeposits = transactions.reduce((sum, trx) => {
                if (trx.type === TRANSACTION_TYPES.DEPOSIT) {
                    return sum + (Number(trx.amount) || 0);
                }
                return sum;
            }, 0);
            
            // حساب إجمالي السحوبات
            const totalWithdrawals = transactions.reduce((sum, trx) => {
                if (trx.type === TRANSACTION_TYPES.WITHDRAW) {
                    return sum + (Number(trx.amount) || 0);
                }
                return sum;
            }, 0);
            
            // حساب إجمالي الأرباح المدفوعة
            const totalPaidProfits = transactions.reduce((sum, trx) => {
                if (trx.type === TRANSACTION_TYPES.PROFIT) {
                    return sum + (Number(trx.amount) || 0);
                }
                return sum;
            }, 0);
            
            // تاريخ الاستثمار
            const investmentDate = new Date(investor.depositDate || investor.createdAt);
            const today = new Date();
            const daysPassed = daysBetween(investmentDate, today);
            
            // تحديد لون حالة المستثمر
            let statusClass = '';
            switch (investor.status) {
                case INVESTOR_STATUS.ACTIVE:
                    statusClass = 'success';
                    break;
                case INVESTOR_STATUS.PENDING:
                    statusClass = 'warning';
                    break;
                case INVESTOR_STATUS.INACTIVE:
                    statusClass = 'danger';
                    break;
            }
            
            // إنشاء محتوى التفاصيل
            this.investorDetailsContent.innerHTML = `
                <div class="investor-profile">
                    <div class="investor-avatar large">${investor.name.charAt(0)}</div>
                    <h2 class="investor-fullname">${investor.name}</h2>
                    <span class="badge badge-${statusClass.toLowerCase()}">${investor.status}</span>
                </div>
                
                <div class="investor-stats">
                    <div class="stat-item">
                        <div class="stat-value">${formatCurrency(investor.amount)} ${SYSTEM_CONFIG.currency}</div>
                        <div class="stat-label">إجمالي الاستثمار</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${formatCurrency(monthlyProfit)} ${SYSTEM_CONFIG.currency}</div>
                        <div class="stat-label">الربح الشهري</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${daysPassed} يوم</div>
                        <div class="stat-label">مدة الاستثمار</div>
                    </div>
                </div>
                
                <div class="detail-group">
                    <h3 class="detail-group-title">معلومات الاتصال</h3>
                    <div class="detail-item">
                        <div class="detail-label">رقم الهاتف</div>
                        <div class="detail-value">${investor.phone}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">العنوان</div>
                        <div class="detail-value">${investor.address || 'غير محدد'}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">رقم البطاقة</div>
                        <div class="detail-value">${investor.card || 'غير محدد'}</div>
                    </div>
                </div>
                
                <div class="detail-group">
                    <h3 class="detail-group-title">معلومات الاستثمار</h3>
                    <div class="detail-item">
                        <div class="detail-label">تاريخ الانضمام</div>
                        <div class="detail-value">${formatDate(investor.createdAt)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">تاريخ الإيداع</div>
                        <div class="detail-value">${formatDate(investor.depositDate || investor.createdAt)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">إجمالي الإيداعات</div>
                        <div class="detail-value">${formatCurrency(totalDeposits)} ${SYSTEM_CONFIG.currency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">إجمالي السحوبات</div>
                        <div class="detail-value">${formatCurrency(totalWithdrawals)} ${SYSTEM_CONFIG.currency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">إجمالي الأرباح المدفوعة</div>
                        <div class="detail-value">${formatCurrency(totalPaidProfits)} ${SYSTEM_CONFIG.currency}</div>
                    </div>
                </div>
                
                <div class="detail-group">
                    <h3 class="detail-group-title">آخر العمليات</h3>
                    <div class="mini-table-container">
                        <table class="mini-table">
                            <thead>
                                <tr>
                                    <th>التاريخ</th>
                                    <th>النوع</th>
                                    <th>المبلغ</th>
                                    <th>الملاحظات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.renderLatestTransactions(transactions)}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
            
            // تعيين المستثمر الحالي
            this.currentInvestor = investor;
            
            // عرض النافذة المنبثقة
            this.investorDetailsModal.classList.add('active');
        }
    }
    
    // عرض آخر العمليات في نافذة التفاصيل
    renderLatestTransactions(transactions) {
        if (transactions.length === 0) {
            return '<tr><td colspan="4">لا توجد عمليات</td></tr>';
        }
        
        // ترتيب العمليات حسب التاريخ (الأحدث أولاً)
        const sortedTransactions = [...transactions]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5); // أخذ آخر 5 عمليات فقط
        
        return sortedTransactions.map(trx => {
            return `<tr>
                <td>${formatDate(trx.date || trx.createdAt)}</td>
                <td>
                    <span class="badge badge-${trx.type === TRANSACTION_TYPES.DEPOSIT ? 'success' : (trx.type === TRANSACTION_TYPES.WITHDRAW ? 'danger' : 'primary')}">
                        ${trx.type}
                    </span>
                </td>
                <td class="${trx.type === TRANSACTION_TYPES.DEPOSIT || trx.type === TRANSACTION_TYPES.PROFIT ? 'positive' : 'negative'}">
                    ${trx.type === TRANSACTION_TYPES.WITHDRAW ? '-' : '+'} ${formatCurrency(trx.amount)} ${SYSTEM_CONFIG.currency}
                </td>
                <td>${trx.notes || ''}</td>
            </tr>`;
        }).join('');
    }
    
    // فتح نافذة دفع الأرباح
    openPayProfitModal(investorId) {
        // هنا يمكن إضافة الكود لفتح نافذة دفع الأرباح
        // على سبيل المثال، يمكنك استدعاء دالة في مدير الأرباح
        
        if (window.profitsManager) {
            window.profitsManager.openPayProfitModal(investorId);
        }
    }
    
    // إغلاق نافذة تفاصيل المستثمر
    closeInvestorDetailsModal() {
        this.investorDetailsModal.classList.remove('active');
    }
    
    // تأكيد حذف مستثمر
    confirmDeleteInvestor(investorId) {
        if (confirm('هل أنت متأكد من رغبتك في حذف هذا المستثمر؟ هذا الإجراء لا يمكن التراجع عنه.')) {
            const success = db.deleteInvestor(investorId);
            
            if (success) {
                // عرض رسالة نجاح
                this.showNotification('تم حذف المستثمر بنجاح', 'success');
                
                // تحديث الجدول
                this.refresh();
                
                // إغلاق نافذة التفاصيل إذا كانت مفتوحة
                this.closeInvestorDetailsModal();
            } else {
                // عرض رسالة خطأ
                this.showNotification('حدث خطأ أثناء حذف المستثمر', 'danger');
            }
        }
    }
    
    // عرض إشعار
    showNotification(message, type = 'success') {
        // هنا يمكن استدعاء وظيفة الإشعارات العامة
        if (window.notifications) {
            window.notifications.show(message, type);
        } else {
            alert(message);
        }
    }
    
    // تحديث صفحة المستثمرين
    async refresh() {
        await this.loadData();
        this.renderInvestorsTable();
    }
}

// إنشاء كائن إدارة المستثمرين عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.investorsManager = new InvestorsManager();
});

function calculateMonthlyProfits() {
    // التأكد من وجود مصفوفة المستثمرين
    if (!Array.isArray(investors) || investors.length === 0) {
        return 0;
    }
    
    return investors.reduce((sum, investor) => {
        // التحقق من وجود المستثمر واستثماراته
        if (!investor || !investor.investments || !Array.isArray(investor.investments)) {
            return sum;
        }
        
        console.log('investor:', investor);
        console.log('investor.investments:', investor.investments);
        
        const monthlyProfit = investor.investments && Array.isArray(investor.investments)
            ? investor.investments.reduce((total, investment) => {
                if (!investment || !investment.amount) {
                    return total;
                }
                return total + calculateInterest(investment.amount, investment.date);
            }, 0)
            : 0;
        
        return sum + monthlyProfit;
    }, 0);
}