/**
 * نظام الاستثمار المتكامل - إدارة قاعدة البيانات
 * يوفر طبقة وسيطة للتعامل مع البيانات المخزنة في LocalStorage
 */

class Database {
    constructor() {
        // المفاتيح المستخدمة في التخزين المحلي
        this.KEYS = {
            INVESTORS: 'investors',
            TRANSACTIONS: 'transactions',
            PROFITS: 'profits',
        };
        
        // تهيئة البيانات الأولية إذا كانت فارغة
        this.initializeData();
    }
    
    // تهيئة قاعدة البيانات
    initializeData() {
        if (!localStorage.getItem(this.KEYS.INVESTORS)) {
            localStorage.setItem(this.KEYS.INVESTORS, JSON.stringify([]));
        }
        
        if (!localStorage.getItem(this.KEYS.TRANSACTIONS)) {
            localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify([]));
        }
        
        if (!localStorage.getItem(this.KEYS.PROFITS)) {
            localStorage.setItem(this.KEYS.PROFITS, JSON.stringify([]));
        }
    }
    
    // --- المستثمرين ---
    
    // استرجاع جميع المستثمرين
    getAllInvestors() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.INVESTORS)) || [];
        } catch (error) {
            console.error('خطأ في استرجاع بيانات المستثمرين:', error);
            return [];
        }
    }
    
    // إضافة مستثمر جديد
    addInvestor(investor) {
        try {
            const investors = this.getAllInvestors();
            
            // إضافة معرف فريد ووقت الإنشاء
            investor.id = generateId('inv');
            investor.createdAt = new Date().toISOString();
            investor.updatedAt = new Date().toISOString();
            
            investors.push(investor);
            localStorage.setItem(this.KEYS.INVESTORS, JSON.stringify(investors));
            
            // إضافة عملية إيداع مبدئية
            if (investor.amount > 0) {
                this.addTransaction({
                    investorId: investor.id,
                    type: TRANSACTION_TYPES.DEPOSIT,
                    amount: investor.amount,
                    date: investor.depositDate || investor.createdAt,
                    notes: 'إيداع مبدئي',
                    status: TRANSACTION_STATUS.COMPLETED
                });
            }
            
            return investor;
        } catch (error) {
            console.error('خطأ في إضافة مستثمر:', error);
            return null;
        }
    }
    
    // الحصول على مستثمر بواسطة المعرف
    getInvestorById(id) {
        try {
            const investors = this.getAllInvestors();
            return investors.find(investor => investor.id === id) || null;
        } catch (error) {
            console.error('خطأ في استرجاع بيانات المستثمر:', error);
            return null;
        }
    }
    
    // تحديث بيانات مستثمر
    updateInvestor(id, updatedData) {
        try {
            const investors = this.getAllInvestors();
            const index = investors.findIndex(investor => investor.id === id);
            
            if (index !== -1) {
                // الاحتفاظ بالمعرف ووقت الإنشاء
                updatedData.id = investors[index].id;
                updatedData.createdAt = investors[index].createdAt;
                updatedData.updatedAt = new Date().toISOString();
                
                investors[index] = { ...investors[index], ...updatedData };
                localStorage.setItem(this.KEYS.INVESTORS, JSON.stringify(investors));
                return investors[index];
            }
            
            return null;
        } catch (error) {
            console.error('خطأ في تحديث بيانات المستثمر:', error);
            return null;
        }
    }
    
    // حذف مستثمر
    deleteInvestor(id) {
        try {
            const investors = this.getAllInvestors();
            const filteredInvestors = investors.filter(investor => investor.id !== id);
            
            if (filteredInvestors.length !== investors.length) {
                localStorage.setItem(this.KEYS.INVESTORS, JSON.stringify(filteredInvestors));
                
                // حذف العمليات المرتبطة بالمستثمر
                const transactions = this.getAllTransactions();
                const filteredTransactions = transactions.filter(transaction => transaction.investorId !== id);
                localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(filteredTransactions));
                
                // حذف الأرباح المرتبطة بالمستثمر
                const profits = this.getAllProfits();
                const filteredProfits = profits.filter(profit => profit.investorId !== id);
                localStorage.setItem(this.KEYS.PROFITS, JSON.stringify(filteredProfits));
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('خطأ في حذف المستثمر:', error);
            return false;
        }
    }
    
    // الحصول على إحصائيات المستثمرين
    getInvestorsStats() {
        try {
            const investors = this.getAllInvestors();
            const transactions = this.getAllTransactions();
            const profits = this.getAllProfits();
            
            const activeInvestors = investors.filter(inv => inv.status === INVESTOR_STATUS.ACTIVE).length;
            const totalInvestments = investors.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0);
            
            // تجميع البيانات حسب تاريخ الإنشاء (شهرياً)
            const investorsByMonth = {};
            investors.forEach(inv => {
                const date = new Date(inv.createdAt);
                const month = `${date.getFullYear()}-${date.getMonth() + 1}`;
                
                if (!investorsByMonth[month]) {
                    investorsByMonth[month] = 0;
                }
                
                investorsByMonth[month]++;
            });
            
            return {
                total: investors.length,
                active: activeInvestors,
                totalInvestments,
                investorsByMonth
            };
        } catch (error) {
            console.error('خطأ في استرجاع إحصائيات المستثمرين:', error);
            return {
                total: 0,
                active: 0,
                totalInvestments: 0,
                investorsByMonth: {}
            };
        }
    }
    
    // --- العمليات ---
    
    // استرجاع جميع العمليات
    getAllTransactions() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.TRANSACTIONS)) || [];
        } catch (error) {
            console.error('خطأ في استرجاع بيانات العمليات:', error);
            return [];
        }
    }
    
    // إضافة عملية جديدة
    addTransaction(transaction) {
        try {
            const transactions = this.getAllTransactions();
            
            // إضافة معرف فريد ووقت الإنشاء
            transaction.id = generateId('trx');
            transaction.createdAt = new Date().toISOString();
            
            // حساب الرصيد بعد العملية
            const investor = this.getInvestorById(transaction.investorId);
            if (investor) {
                let newBalance = Number(investor.amount) || 0;
                
                if (transaction.type === TRANSACTION_TYPES.DEPOSIT) {
                    newBalance += Number(transaction.amount) || 0;
                    
                    // تحديث رصيد المستثمر
                    this.updateInvestor(investor.id, { amount: newBalance });
                } else if (transaction.type === TRANSACTION_TYPES.WITHDRAW) {
                    newBalance -= Number(transaction.amount) || 0;
                    
                    // تحديث رصيد المستثمر
                    this.updateInvestor(investor.id, { amount: newBalance });
                }
                
                transaction.balanceAfter = newBalance;
            }
            
            transactions.push(transaction);
            localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));
            
            return transaction;
        } catch (error) {
            console.error('خطأ في إضافة عملية:', error);
            return null;
        }
    }
    
    // الحصول على عملية بواسطة المعرف
    getTransactionById(id) {
        try {
            const transactions = this.getAllTransactions();
            return transactions.find(transaction => transaction.id === id) || null;
        } catch (error) {
            console.error('خطأ في استرجاع بيانات العملية:', error);
            return null;
        }
    }
    
    // الحصول على عمليات مستثمر معين
    getInvestorTransactions(investorId) {
        try {
            const transactions = this.getAllTransactions();
            return transactions.filter(transaction => transaction.investorId === investorId);
        } catch (error) {
            console.error('خطأ في استرجاع عمليات المستثمر:', error);
            return [];
        }
    }
    
    // --- الأرباح ---
    
    // استرجاع جميع الأرباح
    getAllProfits() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.PROFITS)) || [];
        } catch (error) {
            console.error('خطأ في استرجاع بيانات الأرباح:', error);
            return [];
        }
    }
    
    // إضافة ربح جديد
    addProfit(profit) {
        try {
            const profits = this.getAllProfits();
            
            // إضافة معرف فريد ووقت الإنشاء
            profit.id = generateId('pft');
            profit.createdAt = new Date().toISOString();
            profit.status = profit.status || PROFIT_STATUS.PENDING;
            
            profits.push(profit);
            localStorage.setItem(this.KEYS.PROFITS, JSON.stringify(profits));
            
            return profit;
        } catch (error) {
            console.error('خطأ في إضافة ربح:', error);
            return null;
        }
    }
    
    // تحديث حالة الربح
    updateProfitStatus(id, status) {
        try {
            const profits = this.getAllProfits();
            const index = profits.findIndex(profit => profit.id === id);
            
            if (index !== -1) {
                profits[index].status = status;
                profits[index].updatedAt = new Date().toISOString();
                
                // إذا تم الدفع، نضيف تاريخ الدفع
                if (status === PROFIT_STATUS.PAID) {
                    profits[index].paidAt = new Date().toISOString();
                    
                    // إضافة عملية أرباح
                    this.addTransaction({
                        investorId: profits[index].investorId,
                        type: TRANSACTION_TYPES.PROFIT,
                        amount: profits[index].amount,
                        date: profits[index].paidAt,
                        notes: `دفع أرباح مستحقة للفترة من ${formatDate(profits[index].startDate)} إلى ${formatDate(profits[index].endDate)}`,
                        status: TRANSACTION_STATUS.COMPLETED
                    });
                }
                
                localStorage.setItem(this.KEYS.PROFITS, JSON.stringify(profits));
                return profits[index];
            }
            
            return null;
        } catch (error) {
            console.error('خطأ في تحديث حالة الربح:', error);
            return null;
        }
    }
    
    // الحصول على أرباح مستثمر معين
    getInvestorProfits(investorId) {
        try {
            const profits = this.getAllProfits();
            return profits.filter(profit => profit.investorId === investorId);
        } catch (error) {
            console.error('خطأ في استرجاع أرباح المستثمر:', error);
            return [];
        }
    }
    
    // حساب الأرباح المستحقة للمستثمرين
    calculateDueProfits() {
        try {
            const investors = this.getAllInvestors();
            const now = new Date();
            const profits = [];
            
            // نقوم بحساب الأرباح لكل مستثمر نشط
            investors.forEach(investor => {
                if (investor.status === INVESTOR_STATUS.ACTIVE && investor.amount > 0) {
                    // تاريخ بداية فترة الاستثمار
                    let startDate;
                    if (investor.depositDate) {
                        startDate = new Date(investor.depositDate);
                    } else if (investor.createdAt) {
                        startDate = new Date(investor.createdAt);
                    } else {
                        startDate = new Date(now);
                        startDate.setMonth(startDate.getMonth() - 1);
                    }
                    
                    // تاريخ نهاية فترة الاستثمار (بعد profitCycle يوم)
                    const endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + SYSTEM_CONFIG.profitCycle);
                    
                    // إذا كان تاريخ الاستحقاق قد حل
                    if (endDate <= now) {
                        // عدد الأيام من بداية الاستثمار حتى نهايته
                        const days = daysBetween(startDate, endDate);
                        
                        // حساب الربح المستحق
                        const profitAmount = calculateProfit(investor.amount, days);
                        
                        // إضافة الربح المستحق
                        profits.push({
                            investorId: investor.id,
                            amount: profitAmount,
                            startDate: startDate.toISOString(),
                            endDate: endDate.toISOString(),
                            dueDate: endDate.toISOString(),
                            investmentAmount: investor.amount,
                            days: days,
                            status: PROFIT_STATUS.PENDING
                        });
                    }
                }
            });
            
            return profits;
        } catch (error) {
            console.error('خطأ في حساب الأرباح المستحقة:', error);
            return [];
        }
    }
    
    // نسخ البيانات احتياطياً
    backupData() {
        try {
            const data = {
                investors: this.getAllInvestors(),
                transactions: this.getAllTransactions(),
                profits: this.getAllProfits(),
                config: SYSTEM_CONFIG,
                timestamp: new Date().toISOString()
            };
            
            const jsonData = JSON.stringify(data);
            const blob = new Blob([jsonData], { type: 'application/json' });
            
            // إنشاء رابط تنزيل
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `investment_system_backup_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            
            // تنظيف
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
            
            return true;
        } catch (error) {
            console.error('خطأ في نسخ البيانات احتياطياً:', error);
            return false;
        }
    }
    
    // استعادة البيانات من نسخة احتياطية
    async restoreData(file) {
        try {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        
                        // التحقق من صحة البيانات
                        if (!data.investors || !data.transactions || !data.profits) {
                            reject('ملف النسخة الاحتياطية غير صالح');
                            return;
                        }
                        
                        // استعادة البيانات
                        localStorage.setItem(this.KEYS.INVESTORS, JSON.stringify(data.investors));
                        localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(data.transactions));
                        localStorage.setItem(this.KEYS.PROFITS, JSON.stringify(data.profits));
                        
                        // استعادة الإعدادات إذا وجدت
                        if (data.config) {
                            Object.assign(SYSTEM_CONFIG, data.config);
                            saveSystemConfig();
                        }
                        
                        resolve(true);
                    } catch (error) {
                        console.error('خطأ في تحليل ملف النسخة الاحتياطية:', error);
                        reject('خطأ في تحليل ملف النسخة الاحتياطية');
                    }
                };
                
                reader.onerror = () => {
                    reject('خطأ في قراءة الملف');
                };
                
                reader.readAsText(file);
            });
        } catch (error) {
            console.error('خطأ في استعادة البيانات:', error);
            throw error;
        }
    }
}

// إنشاء كائن قاعدة البيانات
const db = new Database();
