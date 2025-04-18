/**
 * نظام الاستثمار المتكامل - إدارة الأرباح
 * يتحكم في وظائف صفحة الأرباح، بما في ذلك حساب الأرباح المستحقة ودفعها للمستثمرين
 */

class ProfitsManager {
    constructor() {
        // عناصر واجهة المستخدم
        this.profitsTable = document.getElementById('profits-table').querySelector('tbody');
        this.payProfitsBtn = document.getElementById('pay-profits-btn');
        this.payProfitModal = document.getElementById('pay-profit-modal');
        this.confirmPayProfitBtn = document.getElementById('confirm-pay-profit');
        this.profitInvestorSelect = document.getElementById('profit-investor');
        this.profitDetails = document.getElementById('profit-details');
        
        // البيانات
        this.profits = [];
        this.investors = [];
        this.transactions = [];
        this.filter = 'current'; // current, pending, paid
        this.dueProfits = [];
        this.selectedProfitId = null;
        
        // تهيئة صفحة الأرباح
        this.initialize();
    }
    
    // تهيئة صفحة الأرباح
    async initialize() {
        // تحميل البيانات
        await this.loadData();
        
        // حساب الأرباح المستحقة
        this.calculateDueProfits();
        
        // عرض جدول الأرباح
        this.renderProfitsTable();
        
        // تحديث قائمة المستثمرين في نموذج دفع الأرباح
        this.updateProfitInvestorsSelect();
        
        // إعداد المستمعين للأحداث
        this.setupEventListeners();
    }
    
    // تحميل البيانات
    async loadData() {
        this.profits = db.getAllProfits();
        this.investors = db.getAllInvestors();
        this.transactions = db.getAllTransactions();
    }
    
    // حساب الأرباح المستحقة
    calculateDueProfits() {
        this.dueProfits = [];
        
        // الحصول على المستثمرين النشطين
        const activeInvestors = this.investors.filter(investor => 
            investor.status === INVESTOR_STATUS.ACTIVE && investor.amount > 0
        );
        
        // تاريخ اليوم
        const today = new Date();
        
        activeInvestors.forEach(investor => {
            // تاريخ بداية الاستثمار
            let startDate = new Date(investor.depositDate || investor.createdAt);
            
            // الأرباح المدفوعة سابقاً لهذا المستثمر
            const paidProfits = this.profits.filter(profit => 
                profit.investorId === investor.id && 
                profit.status === PROFIT_STATUS.PAID
            );
            
            // إذا كانت هناك أرباح مدفوعة، نستخدم تاريخ آخر دفعة كبداية
            if (paidProfits.length > 0) {
                // ترتيب الأرباح حسب تاريخ الانتهاء (الأحدث أولاً)
                paidProfits.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
                
                // استخدام تاريخ نهاية آخر دفعة كبداية للفترة الجديدة
                startDate = new Date(paidProfits[0].endDate);
            }
            
            // عدد الأيام منذ آخر دفعة أو بداية الاستثمار
            const daysSinceLastPayment = daysBetween(startDate, today);
            
            // إذا مرت فترة كافية (حسب دورة الأرباح)
            if (daysSinceLastPayment >= SYSTEM_CONFIG.profitCycle) {
                // تاريخ نهاية الفترة (بعد دورة الأرباح)
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + SYSTEM_CONFIG.profitCycle);
                
                // حساب مبلغ الربح
                const profitAmount = calculateProfit(
                    investor.amount, 
                    SYSTEM_CONFIG.profitCycle, 
                    SYSTEM_CONFIG.interestRate
                );
                
                // إضافة الربح المستحق
                this.dueProfits.push({
                    id: generateId('pft'),
                    investorId: investor.id,
                    investorName: investor.name,
                    amount: profitAmount,
                    investmentAmount: investor.amount,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    dueDate: endDate.toISOString(),
                    days: SYSTEM_CONFIG.profitCycle,
                    status: PROFIT_STATUS.PENDING,
                    createdAt: new Date().toISOString()
                });
            }
        });
    }
    
    // عرض جدول الأرباح
    renderProfitsTable() {
        let profitsToShow = [];
        
        // تصفية الأرباح حسب الحالة المحددة
        if (this.filter === 'current') {
            // الشهر الحالي
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();
            
            // دمج الأرباح المسجلة والأرباح المستحقة
            profitsToShow = [
                ...this.profits.filter(profit => {
                    const profitDate = new Date(profit.createdAt);
                    return profitDate.getMonth() === currentMonth && 
                           profitDate.getFullYear() === currentYear;
                }),
                ...this.dueProfits
            ];
        } else if (this.filter === 'pending') {
            profitsToShow = [
                ...this.profits.filter(profit => profit.status === PROFIT_STATUS.PENDING),
                ...this.dueProfits
            ];
        } else if (this.filter === 'paid') {
            profitsToShow = this.profits.filter(profit => profit.status === PROFIT_STATUS.PAID);
        }
        
        // ترتيب الأرباح حسب تاريخ الاستحقاق (الأقرب أولاً)
        profitsToShow.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        // إفراغ الجدول
        this.profitsTable.innerHTML = '';
        
        // إضافة صفوف الأرباح
        profitsToShow.forEach(profit => {
            // الحصول على معلومات المستثمر
            const investor = this.investors.find(inv => inv.id === profit.investorId) || { 
                name: profit.investorName || 'غير معروف'
            };
            
            // تحديد حالة الربح
            let statusClass = profit.status === PROFIT_STATUS.PAID ? 'success' : 'warning';
            let statusText = profit.status;
            
            // حساب الفترة بين تاريخ الاستحقاق واليوم
            const dueDate = new Date(profit.dueDate);
            const today = new Date();
            const daysToMaturity = daysBetween(today, dueDate);
            
            // تحديد تلميح تاريخ الاستحقاق
            let dueIndicator = '';
            
            if (profit.status === PROFIT_STATUS.PENDING) {
                if (dueDate <= today) {
                    dueIndicator = '<span class="profit-due-indicator today"></span>';
                    statusText = 'مستحق اليوم';
                    statusClass = 'danger';
                } else if (daysToMaturity <= SYSTEM_CONFIG.reminderDays) {
                    dueIndicator = '<span class="profit-due-indicator upcoming"></span>';
                    statusText = `مستحق خلال ${daysToMaturity} يوم`;
                    statusClass = 'warning';
                }
            }
            
            // إنشاء الصف
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="investor-info">
                        <div class="investor-avatar">${investor.name.charAt(0)}</div>
                        <div>
                            <div class="investor-name">${investor.name}</div>
                            <div class="investor-id">${investor.id}</div>
                        </div>
                    </div>
                </td>
                <td>${formatCurrency(profit.investmentAmount)} ${SYSTEM_CONFIG.currency}</td>
                <td>${formatDate(profit.startDate)}</td>
                <td>${profit.days} يوم</td>
                <td class="positive">${formatCurrency(profit.amount)} ${SYSTEM_CONFIG.currency}</td>
                <td>
                    <div class="profit-due-date">
                        ${dueIndicator}
                        <span>${formatDate(profit.dueDate)}</span>
                    </div>
                </td>
                <td>
                    <div class="investor-actions">
                        ${profit.status === PROFIT_STATUS.PENDING ? `
                            <button class="investor-action-btn success pay-profit" data-id="${profit.id}">
                                <i class="fas fa-hand-holding-usd"></i>
                            </button>
                        ` : `
                            <span class="badge badge-${statusClass.toLowerCase()}">${statusText}</span>
                        `}
                    </div>
                </td>
            `;
            
            this.profitsTable.appendChild(row);
        });
        
        // إذا لم تكن هناك أرباح، نظهر رسالة
        if (profitsToShow.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="7" class="text-center">لا توجد أرباح مستحقة</td>
            `;
            this.profitsTable.appendChild(emptyRow);
        }
    }
    
    // تحديث قائمة المستثمرين في نموذج دفع الأرباح
    updateProfitInvestorsSelect() {
        // إفراغ القائمة
        this.profitInvestorSelect.innerHTML = '<option value="">اختر المستثمر</option>';
        
        // الحصول على المستثمرين الذين لديهم أرباح مستحقة
        const investorsWithProfits = [];
        
        // جمع المستثمرين من الأرباح المسجلة
        this.profits.forEach(profit => {
            if (profit.status === PROFIT_STATUS.PENDING) {
                const investor = this.investors.find(inv => inv.id === profit.investorId);
                if (investor && !investorsWithProfits.some(inv => inv.id === investor.id)) {
                    investorsWithProfits.push(investor);
                }
            }
        });
        
        // جمع المستثمرين من الأرباح المستحقة
        this.dueProfits.forEach(profit => {
            const investor = this.investors.find(inv => inv.id === profit.investorId);
            if (investor && !investorsWithProfits.some(inv => inv.id === investor.id)) {
                investorsWithProfits.push(investor);
            }
        });
        
        // ترتيب المستثمرين حسب الاسم
        investorsWithProfits.sort((a, b) => a.name.localeCompare(b.name));
        
        // إضافة المستثمرين إلى القائمة
        investorsWithProfits.forEach(investor => {
            const option = document.createElement('option');
            option.value = investor.id;
            option.textContent = `${investor.name} (${investor.phone})`;
            this.profitInvestorSelect.appendChild(option);
        });
    }
    
    // إعداد المستمعين للأحداث
    setupEventListeners() {
        // الاستماع لتغيير الصفحة
        document.addEventListener('page:change', (e) => {
            if (e.detail.page === 'profits') {
                this.refresh();
            }
        });
        
        // فتح نافذة دفع الأرباح
        this.payProfitsBtn.addEventListener('click', () => {
            this.openPayProfitModal();
        });
        
        // تأكيد دفع الأرباح
        this.confirmPayProfitBtn.addEventListener('click', () => {
            this.payProfit();
        });
        
        // إغلاق النوافذ المنبثقة عند النقر على زر الإغلاق
        document.querySelectorAll('.modal-close, .modal-close-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.modal-overlay').forEach(modal => {
                    modal.classList.remove('active');
                });
            });
        });
        
        // تصفية الأرباح حسب الحالة
        document.querySelectorAll('.btn-group button').forEach(button => {
            button.addEventListener('click', () => {
                // تحديث الزر النشط
                document.querySelectorAll('.btn-group button').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // تحديث نوع التصفية
                const filterText = button.textContent.trim().toLowerCase();
                if (filterText.includes('الشهر الحالي')) {
                    this.filter = 'current';
                } else if (filterText.includes('قيد الانتظار')) {
                    this.filter = 'pending';
                } else if (filterText.includes('مدفوعة')) {
                    this.filter = 'paid';
                }
                
                // تحديث الجدول
                this.renderProfitsTable();
            });
        });
        
        // دفع الأرباح من الجدول
        this.profitsTable.addEventListener('click', (e) => {
            const payBtn = e.target.closest('.pay-profit');
            
            if (payBtn) {
                const profitId = payBtn.getAttribute('data-id');
                this.openPayProfitModalWithProfit(profitId);
            }
        });
        
        // تغيير المستثمر في نموذج دفع الأرباح
        this.profitInvestorSelect.addEventListener('change', () => {
            this.showInvestorProfitDetails();
        });
    }
    
    // فتح نافذة دفع الأرباح العامة
    openPayProfitModal(investorId = null) {
        // إعادة تعيين النموذج
        this.profitDetails.innerHTML = '';
        this.selectedProfitId = null;
        
        // إذا تم تحديد مستثمر، نحدده في القائمة
        if (investorId) {
            this.profitInvestorSelect.value = investorId;
            this.showInvestorProfitDetails();
        }
        
        // عرض النافذة المنبثقة
        this.payProfitModal.classList.add('active');
    }
    
    // فتح نافذة دفع الأرباح لربح محدد
    openPayProfitModalWithProfit(profitId) {
        // البحث عن الربح في الأرباح المسجلة
        let profit = this.profits.find(p => p.id === profitId);
        
        // إذا لم يتم العثور عليه، نبحث في الأرباح المستحقة
        if (!profit) {
            profit = this.dueProfits.find(p => p.id === profitId);
        }
        
        if (profit) {
            // تحديد المستثمر في القائمة
            this.profitInvestorSelect.value = profit.investorId;
            
            // عرض تفاصيل الربح
            this.selectedProfitId = profitId;
            this.showInvestorProfitDetails();
            
            // عرض النافذة المنبثقة
            this.payProfitModal.classList.add('active');
        }
    }
    
    // عرض تفاصيل أرباح المستثمر المحدد
    showInvestorProfitDetails() {
        const investorId = this.profitInvestorSelect.value;
        
        if (!investorId) {
            this.profitDetails.innerHTML = '';
            return;
        }
        
        // الحصول على المستثمر
        const investor = this.investors.find(inv => inv.id === investorId);
        
        if (!investor) {
            this.profitDetails.innerHTML = '<div class="alert alert-danger">لم يتم العثور على المستثمر</div>';
            return;
        }
        
        // جمع أرباح المستثمر (المسجلة والمستحقة)
        let investorProfits = [
            ...this.profits.filter(p => p.investorId === investorId && p.status === PROFIT_STATUS.PENDING),
            ...this.dueProfits.filter(p => p.investorId === investorId)
        ];
        
        // ترتيب الأرباح حسب تاريخ الاستحقاق (الأقدم أولاً)
        investorProfits.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        // إذا تم تحديد ربح معين، نضع علامة عليه
        if (this.selectedProfitId) {
            investorProfits = investorProfits.map(p => ({
                ...p,
                selected: p.id === this.selectedProfitId
            }));
        }
        
        // حساب إجمالي الأرباح المستحقة
        const totalDueProfits = investorProfits.reduce((sum, profit) => sum + Number(profit.amount), 0);
        
        // إنشاء محتوى تفاصيل الربح
        if (investorProfits.length === 0) {
            this.profitDetails.innerHTML = '<div class="alert alert-info">لا توجد أرباح مستحقة لهذا المستثمر</div>';
            return;
        }
        
        this.profitDetails.innerHTML = `
            <div class="alert alert-info mb-4">
                <div class="alert-title">معلومات المستثمر</div>
                <div class="alert-content">
                    <div class="detail-item">
                        <div class="detail-label">المستثمر</div>
                        <div class="detail-value">${investor.name}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">الرصيد الحالي</div>
                        <div class="detail-value">${formatCurrency(investor.amount)} ${SYSTEM_CONFIG.currency}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">إجمالي الأرباح المستحقة</div>
                        <div class="detail-value positive">${formatCurrency(totalDueProfits)} ${SYSTEM_CONFIG.currency}</div>
                    </div>
                </div>
            </div>
            
            <div class="profit-items mb-4">
                <h4>الأرباح المستحقة</h4>
                <div class="mini-table-container">
                    <table class="mini-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>الفترة</th>
                                <th>المبلغ المستثمر</th>
                                <th>عدد الأيام</th>
                                <th>الربح المستحق</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${investorProfits.map((profit, index) => `
                                <tr class="${profit.selected ? 'selected' : ''}">
                                    <td>
                                        <div class="form-check">
                                            <input type="radio" name="profit-item" id="profit-${index}" value="${profit.id}" ${profit.selected ? 'checked' : ''}>
                                            <label for="profit-${index}"></label>
                                        </div>
                                    </td>
                                    <td>${formatDate(profit.startDate)} - ${formatDate(profit.endDate)}</td>
                                    <td>${formatCurrency(profit.investmentAmount)} ${SYSTEM_CONFIG.currency}</td>
                                    <td>${profit.days} يوم</td>
                                    <td class="positive">${formatCurrency(profit.amount)} ${SYSTEM_CONFIG.currency}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div class="form-group mb-4">
                <label class="form-label">طريقة الدفع</label>
                <select class="form-select" id="payment-method" required>
                    <option value="cash">نقدًا</option>
                    <option value="bank">تحويل بنكي</option>
                    <option value="wallet">محفظة إلكترونية</option>
                </select>
            </div>
            
            <div class="form-group">
                <label class="form-label">ملاحظات</label>
                <textarea class="form-input" id="profit-notes" rows="3" placeholder="أي ملاحظات إضافية حول عملية دفع الأرباح"></textarea>
            </div>
        `;
        
        // إضافة مستمع الأحداث للخيارات
        this.profitDetails.querySelectorAll('input[name="profit-item"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.selectedProfitId = radio.value;
                
                // تحديث الصفوف المحددة
                this.profitDetails.querySelectorAll('tbody tr').forEach(row => {
                    row.classList.remove('selected');
                });
                
                radio.closest('tr').classList.add('selected');
            });
        });
    }
    
    // دفع الأرباح
    payProfit() {
        const investorId = this.profitInvestorSelect.value;
        
        if (!investorId) {
            this.showNotification('الرجاء اختيار مستثمر', 'warning');
            return;
        }
        
        // التحقق من اختيار ربح
        const selectedProfit = this.profitDetails.querySelector('input[name="profit-item"]:checked');
        
        if (!selectedProfit && !this.selectedProfitId) {
            this.showNotification('الرجاء اختيار ربح للدفع', 'warning');
            return;
        }
        
        const profitId = selectedProfit ? selectedProfit.value : this.selectedProfitId;
        
        // البحث عن الربح في الأرباح المسجلة
        let profit = this.profits.find(p => p.id === profitId);
        let isNewProfit = false;
        
        // إذا لم يتم العثور عليه، نبحث في الأرباح المستحقة
        if (!profit) {
            profit = this.dueProfits.find(p => p.id === profitId);
            isNewProfit = true;
        }
        
        if (!profit) {
            this.showNotification('لم يتم العثور على الربح المحدد', 'danger');
            return;
        }
        
        // جمع بيانات الدفع
        const paymentMethod = document.getElementById('payment-method').value;
        const notes = document.getElementById('profit-notes').value.trim();
        
        // إذا كان ربحًا جديدًا، نضيفه إلى قاعدة البيانات
        if (isNewProfit) {
            profit = db.addProfit(profit);
        }
        
        // تحديث حالة الربح إلى "مدفوع"
        const updatedProfit = db.updateProfitStatus(profit.id, PROFIT_STATUS.PAID);
        
        if (updatedProfit) {
            // عرض رسالة نجاح
            this.showNotification('تم دفع الأرباح بنجاح', 'success');
            
            // تحديث البيانات
            this.refresh();
            
            // إغلاق النافذة المنبثقة
            this.payProfitModal.classList.remove('active');
        } else {
            // عرض رسالة خطأ
            this.showNotification('حدث خطأ أثناء عملية دفع الأرباح', 'danger');
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
    
    // تحديث صفحة الأرباح
    async refresh() {
        await this.loadData();
        this.calculateDueProfits();
        this.renderProfitsTable();
        this.updateProfitInvestorsSelect();
    }
}

// إنشاء كائن إدارة الأرباح عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.profitsManager = new ProfitsManager();
});