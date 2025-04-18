/**
 * نظام الاستثمار المتكامل - نظام الإشعارات
 * يتحكم في نظام الإشعارات في التطبيق، ويوفر واجهة موحدة لعرض الإشعارات للمستخدم
 */

class NotificationsManager {
    constructor() {
        // إعدادات الإشعارات
        this.defaultDuration = 5000; // مدة عرض الإشعار (بالمللي ثانية)
        this.container = null; // حاوية الإشعارات
        this.notifications = []; // قائمة الإشعارات النشطة
        this.notificationCount = 0; // عداد الإشعارات
        
        // الأنواع المدعومة
        this.types = {
            success: {
                icon: 'check',
                color: 'success'
            },
            warning: {
                icon: 'exclamation',
                color: 'warning'
            },
            danger: {
                icon: 'times',
                color: 'danger'
            },
            info: {
                icon: 'info',
                color: 'info'
            }
        };
        
        // تهيئة نظام الإشعارات
        this.initialize();
    }
    
    // تهيئة نظام الإشعارات
    initialize() {
        // إنشاء حاوية الإشعارات إذا لم تكن موجودة
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'notifications-container';
            document.body.appendChild(this.container);
            
            // إضافة أنماط CSS إذا لم تكن موجودة
            this.addStyles();
        }
    }
    
    // إضافة أنماط CSS
    addStyles() {
        if (!document.getElementById('notifications-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notifications-styles';
            styles.textContent = `
                .notifications-container {
                    position: fixed;
                    top: 20px;
                    left: 20px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    max-width: 350px;
                    font-family: 'Tajawal', Arial, sans-serif;
                }
                
                .notification {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    padding: 16px;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    opacity: 0;
                    transform: translateY(-20px);
                    transition: all 0.3s ease;
                }
                
                .notification.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .notification-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.2rem;
                    color: white;
                }
                
                .notification-icon.success {
                    background-color: #10b981;
                }
                
                .notification-icon.warning {
                    background-color: #f59e0b;
                }
                
                .notification-icon.danger {
                    background-color: #ef4444;
                }
                
                .notification-icon.info {
                    background-color: #3b82f6;
                }
                
                .notification-content {
                    flex: 1;
                }
                
                .notification-title {
                    font-weight: 700;
                    margin-bottom: 4px;
                }
                
                .notification-message {
                    font-size: 0.9rem;
                    color: #4b5563;
                }
                
                .notification-close {
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    cursor: pointer;
                    color: #9ca3af;
                    transition: all 0.2s ease;
                }
                
                .notification-close:hover {
                    background-color: #f3f4f6;
                    color: #4b5563;
                }
                
                .notification-body {
                    max-height: 300px;
                    overflow-y: auto;
                    margin-top: 10px;
                    padding-top: 10px;
                    border-top: 1px solid #e5e7eb;
                }
                
                /* Custom Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .modal-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                .custom-modal {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    position: relative;
                    transition: all 0.3s ease;
                    transform: translateY(20px);
                }
                
                .modal-overlay.show .custom-modal {
                    transform: translateY(0);
                }
                
                .custom-modal-header {
                    padding: 16px 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .custom-modal-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #1f2937;
                }
                
                .custom-modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #9ca3af;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    transition: all 0.2s ease;
                }
                
                .custom-modal-close:hover {
                    background-color: #f3f4f6;
                    color: #4b5563;
                }
                
                .custom-modal-body {
                    padding: 20px;
                }
                
                .custom-modal-footer {
                    padding: 16px 20px;
                    border-top: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 10px;
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    // عرض إشعار
    show(message, type = 'success', duration = this.defaultDuration) {
        // التحقق من صحة النوع
        if (!this.types[type]) {
            type = 'info';
        }
        
        // إنشاء معرف فريد للإشعار
        const id = `notification-${++this.notificationCount}`;
        
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-icon ${type}">
                <i class="fas fa-${this.types[type].icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${this.getTitle(type)}</div>
                <div class="notification-message">${message}</div>
            </div>
            <div class="notification-close">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        // إضافة حدث إغلاق الإشعار
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            this.hide(id);
        });
        
        // إضافة الإشعار إلى الحاوية
        this.container.appendChild(notification);
        
        // إضافة الإشعار إلى القائمة
        this.notifications.push({
            id,
            element: notification,
            timeout: null
        });
        
        // عرض الإشعار مع تأثير حركي
        setTimeout(() => {
            notification.classList.add('show');
        }, 50);
        
        // تعيين مؤقت لإخفاء الإشعار تلقائيًا
        if (duration > 0) {
            const timeout = setTimeout(() => {
                this.hide(id);
            }, duration);
            
            // تحديث المؤقت في قائمة الإشعارات
            const index = this.notifications.findIndex(n => n.id === id);
            if (index !== -1) {
                this.notifications[index].timeout = timeout;
            }
        }
        
        return id;
    }
    
    // إخفاء إشعار
    hide(id) {
        const notification = document.getElementById(id);
        
        if (notification) {
            // إزالة الفئة لبدء تأثير الإخفاء
            notification.classList.remove('show');
            
            // إزالة العنصر بعد انتهاء الانتقال
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
            
            // إزالة الإشعار من القائمة
            const index = this.notifications.findIndex(n => n.id === id);
            if (index !== -1) {
                // إلغاء المؤقت إذا كان موجودًا
                if (this.notifications[index].timeout) {
                    clearTimeout(this.notifications[index].timeout);
                }
                
                // إزالة الإشعار من القائمة
                this.notifications.splice(index, 1);
            }
        }
    }
    
    // عرض إشعار بمحتوى مخصص
    showCustom(title, content, type = 'info') {
        // التحقق من صحة النوع
        if (!this.types[type]) {
            type = 'info';
        }
        
        // إنشاء معرف فريد للإشعار
        const id = `notification-${++this.notificationCount}`;
        
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.id = id;
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-icon ${type}">
                <i class="fas fa-${this.types[type].icon}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-body">${content}</div>
            </div>
            <div class="notification-close">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        // إضافة حدث إغلاق الإشعار
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            this.hide(id);
        });
        
        // إضافة الإشعار إلى الحاوية
        this.container.appendChild(notification);
        
        // إضافة الإشعار إلى القائمة
        this.notifications.push({
            id,
            element: notification,
            timeout: null
        });
        
        // عرض الإشعار مع تأثير حركي
        setTimeout(() => {
            notification.classList.add('show');
        }, 50);
        
        return id;
    }
    
    // عرض نافذة منبثقة مخصصة
    showModal(title, content, buttons = []) {
        // إنشاء حاوية النافذة المنبثقة
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        // إنشاء محتوى النافذة المنبثقة
        modalOverlay.innerHTML = `
            <div class="custom-modal">
                <div class="custom-modal-header">
                    <div class="custom-modal-title">${title}</div>
                    <button class="custom-modal-close">&times;</button>
                </div>
                <div class="custom-modal-body">${content}</div>
                ${buttons.length > 0 ? `
                    <div class="custom-modal-footer">
                        ${buttons.map(btn => `
                            <button class="btn ${btn.class || 'btn-primary'}" data-action="${btn.action || 'close'}">
                                ${btn.text || 'موافق'}
                            </button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
        
        // إضافة النافذة المنبثقة إلى الصفحة
        document.body.appendChild(modalOverlay);
        
        // عرض النافذة المنبثقة مع تأثير حركي
        setTimeout(() => {
            modalOverlay.classList.add('show');
        }, 50);
        
        // إغلاق النافذة المنبثقة عند النقر على الزر
        const closeBtn = modalOverlay.querySelector('.custom-modal-close');
        closeBtn.addEventListener('click', () => {
            this.closeModal(modalOverlay);
        });
        
        // إضافة أحداث للأزرار
        const footerButtons = modalOverlay.querySelectorAll('.custom-modal-footer .btn');
        footerButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.getAttribute('data-action');
                
                if (action === 'close') {
                    this.closeModal(modalOverlay);
                } else {
                    // تنفيذ الإجراء المخصص
                    const button = buttons.find(b => b.action === action);
                    if (button && typeof button.callback === 'function') {
                        button.callback();
                    }
                    
                    // إغلاق النافذة إذا كان مطلوبًا
                    if (!button || button.closeAfter !== false) {
                        this.closeModal(modalOverlay);
                    }
                }
            });
        });
        
        return modalOverlay;
    }
    
    // إغلاق النافذة المنبثقة
    closeModal(modalOverlay) {
        modalOverlay.classList.remove('show');
        
        // إزالة العنصر بعد انتهاء الانتقال
        setTimeout(() => {
            if (modalOverlay.parentNode) {
                modalOverlay.parentNode.removeChild(modalOverlay);
            }
        }, 300);
    }
    
    // الحصول على عنوان حسب نوع الإشعار
    getTitle(type) {
        switch (type) {
            case 'success':
                return 'تمت العملية بنجاح';
            case 'warning':
                return 'تنبيه';
            case 'danger':
                return 'خطأ';
            case 'info':
                return 'معلومات';
            default:
                return 'إشعار';
        }
    }
}

// إنشاء كائن إدارة الإشعارات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    window.notifications = new NotificationsManager();
});