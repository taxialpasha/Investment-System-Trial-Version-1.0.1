/**
 * دمج ميزة التعرف على الصوت مع نظام الاستثمار المتكامل
 * يوفر هذا الملف التكامل بين نظام التعرف على الصوت والتطبيق الأساسي
 */

// تحديث دالة setupSpeechRecognition الموجودة في ملف app-fixed.js
// نستبدل الدالة الحالية بالتنفيذ المحسن التالي

/**
 * إعداد التعرف على الصوت وتكامله مع نظام الاستثمار
 */
function setupSpeechRecognition() {
    console.log('تهيئة نظام التعرف على الصوت...');
    
    // التحقق من دعم المتصفح للتعرف على الصوت
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    
    if (!SpeechRecognition) {
        console.warn('المتصفح لا يدعم ميزة التعرف على الصوت');
        disableMicrophoneButtons();
        return;
    }
    
    // إضافة أنماط CSS للتعرف على الصوت
    addSpeechRecognitionStyles();
    
    // إعداد قواعد القواميس للتعرف على الصوت (للأرقام والمصطلحات المالية)
    setupSpeechGrammar(SpeechGrammarList);
    
    // البحث عن جميع أزرار المايكروفون المتوافرة في الصفحة
    const micButtons = document.querySelectorAll('.mic-btn');
    if (micButtons.length === 0) {
        console.warn('لم يتم العثور على أزرار مايكروفون في الصفحة');
        
        // إنشاء أزرار المايكروفون للحقول الموجودة
        createMicrophoneButtons();
    } else {
        setupExistingMicrophoneButtons(micButtons);
    }
    
    // إضافة زر المساعدة للتعرف على الصوت
    addSpeechRecognitionHelpButton();
    
    // إضافة مستمعي الأحداث النافذة المنبثقة
    setupModalEvents();
    
    console.log('تم تهيئة نظام التعرف على الصوت بنجاح');
}

/**
 * تعطيل أزرار المايكروفون في حالة عدم دعم المتصفح
 */
function disableMicrophoneButtons() {
    const micButtons = document.querySelectorAll('.mic-btn');
    
    micButtons.forEach(button => {
        button.classList.add('not-supported');
        button.title = 'التعرف على الصوت غير مدعوم في هذا المتصفح';
        
        const icon = button.querySelector('i.fa-microphone');
        if (icon) {
            icon.classList.remove('fa-microphone');
            icon.classList.add('fa-microphone-slash');
        }
        
        button.disabled = true;
    });
}

/**
 * إنشاء أزرار المايكروفون للحقول النصية الموجودة في النماذج
 */
function createMicrophoneButtons() {
    console.log('إنشاء أزرار المايكروفون للحقول النصية...');
    
    // العثور على جميع حقول الإدخال النصية ورقمية
    const textInputs = document.querySelectorAll('input[type="text"], input[type="tel"], input[type="number"], textarea');
    
    textInputs.forEach((input, index) => {
        // التحقق من أن الحقل ليس مخفيًا
        if (input.style.display === 'none' || input.type === 'hidden') {
            return;
        }
        
        // التحقق مما إذا كان الحقل يقع داخل مجموعة إدخال
        const parentGroup = input.closest('.input-group');
        
        // إذا كان الحقل ليس بداخل مجموعة إدخال، قم بإنشاء مجموعة جديدة
        if (!parentGroup) {
            // الحصول على معرف الحقل، أو إنشاء واحد إذا لم يكن موجودًا
            if (!input.id) {
                input.id = `input-field-${Date.now()}-${index}`;
            }
            
            // إنشاء مجموعة إدخال جديدة
            const inputGroup = document.createElement('div');
            inputGroup.className = 'input-group';
            
            // إدراج مجموعة الإدخال قبل الحقل النصي في DOM
            input.parentNode.insertBefore(inputGroup, input);
            
            // نقل الحقل النصي إلى داخل مجموعة الإدخال
            inputGroup.appendChild(input);
            
            // إنشاء زر المايكروفون
            const micButton = document.createElement('button');
            micButton.className = 'btn btn-icon-sm mic-btn';
            micButton.type = 'button';
            micButton.setAttribute('data-input', input.id);
            micButton.title = 'انقر للتحدث';
            micButton.innerHTML = '<i class="fas fa-microphone"></i>';
            
            // إضافة زر المايكروفون إلى مجموعة الإدخال
            inputGroup.appendChild(micButton);
        }
    });
    
    // إعداد أزرار المايكروفون التي تم إنشاؤها
    const newMicButtons = document.querySelectorAll('.mic-btn:not(.setup-complete)');
    setupExistingMicrophoneButtons(newMicButtons);
}

/**
 * إعداد أزرار المايكروفون الموجودة بالفعل
 * @param {NodeList} buttons - قائمة أزرار المايكروفون
 */
function setupExistingMicrophoneButtons(buttons) {
    let recognitionInstance = null;
    let currentInputField = null;
    
    buttons.forEach(button => {
        // تجنب إعادة إعداد الأزرار التي تم إعدادها بالفعل
        if (button.classList.contains('setup-complete')) {
            return;
        }
        
        // إضافة فئة تشير إلى اكتمال الإعداد
        button.classList.add('setup-complete');
        
        // إضافة نص بديل للزر
        button.title = 'انقر للتحدث';
        
        // التأكد من وجود معرف لحقل الإدخال
        const inputId = button.getAttribute('data-input');
        if (!inputId) {
            console.error('زر المايكروفون ليس له سمة data-input:', button);
            return;
        }
        
        // إضافة مستمع حدث النقر
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // الحصول على حقل الإدخال المرتبط بالزر
            const inputField = document.getElementById(inputId);
            
            if (!inputField) {
                console.error(`لم يتم العثور على حقل الإدخال: ${inputId}`);
                return;
            }
            
            // إذا كان هناك تعرف نشط على الصوت، يتم إيقافه أولاً
            if (recognitionInstance) {
                recognitionInstance.abort();
                stopSpeechRecognition(recognitionInstance);
                
                // إذا كان حقل الإدخال الحالي هو نفسه، فلا داعي لبدء تعرف جديد
                if (currentInputField === inputField) {
                    currentInputField = null;
                    return;
                }
            }
            
            // تخزين حقل الإدخال الحالي
            currentInputField = inputField;
            
            // بدء التعرف على الصوت
            recognitionInstance = startSpeechRecognition(button, inputField);
        });
    });
}

/**
 * بدء عملية التعرف على الصوت
 * @param {HTMLElement} button - زر المايكروفون الذي تم النقر عليه
 * @param {HTMLElement} inputField - حقل الإدخال المرتبط
 * @returns {SpeechRecognition} - كائن التعرف على الصوت
 */
function startSpeechRecognition(button, inputField) {
    // الحصول على كائن التعرف على الصوت
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    try {
        // إنشاء كائن جديد للتعرف على الصوت
        const recognition = new SpeechRecognition();
        
        // إعداد خيارات التعرف على الصوت
        recognition.lang = 'ar-SA'; // تعيين اللغة العربية
        recognition.continuous = false; // التعرف على جملة واحدة فقط
        recognition.interimResults = true; // عرض النتائج المؤقتة
        recognition.maxAlternatives = 1; // الحصول على نتيجة واحدة فقط
        
        // إضافة قواعد القواميس إذا كانت متاحة
        if (window.speechGrammarList) {
            recognition.grammars = window.speechGrammarList;
        }
        
        // تغيير مظهر الزر ليعكس حالة الاستماع
        button.classList.add('listening');
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-microphone');
            icon.classList.add('fa-spinner');
            icon.classList.add('fa-pulse');
        }
        
        // إضافة فئة تشير إلى أن الحقل يستخدم الإدخال الصوتي
        inputField.classList.add('voice-input');
        
        // إنشاء مؤشر التسجيل النشط
        const recordingIndicator = document.createElement('div');
        recordingIndicator.className = 'recording-indicator';
        recordingIndicator.textContent = 'جارٍ الاستماع... تحدث الآن';
        document.body.appendChild(recordingIndicator);
        
        // إظهار إشعار للمستخدم
        showNotification('جارٍ الاستماع... تحدث الآن', 'info');
        
        // مستمع حدث لنتائج التعرف المؤقتة
        recognition.onresult = function(event) {
            // الحصول على النص المتعرف عليه
            const speechResult = event.results[0][0].transcript;
            console.log(`نتيجة التعرف: "${speechResult}" (الثقة: ${event.results[0][0].confidence})`);
            
            // تحديث قيمة حقل الإدخال بالنص المتعرف عليه
            inputField.value = speechResult;
            
            // إطلاق حدث تغيير لحقل الإدخال
            const changeEvent = new Event('change', { bubbles: true });
            inputField.dispatchEvent(changeEvent);
            
            // إطلاق حدث إدخال لحقل الإدخال
            const inputEvent = new Event('input', { bubbles: true });
            inputField.dispatchEvent(inputEvent);
        };
        
        // مستمع حدث لانتهاء التعرف
        recognition.onend = function() {
            // إعادة تعيين حالة الزر
            button.classList.remove('listening');
            if (icon) {
                icon.classList.remove('fa-spinner');
                icon.classList.remove('fa-pulse');
                icon.classList.add('fa-microphone');
            }
            
            // إزالة فئة الإدخال الصوتي بعد فترة قصيرة
            setTimeout(() => {
                inputField.classList.remove('voice-input');
            }, 2000);
            
            // إزالة مؤشر التسجيل
            if (recordingIndicator.parentNode) {
                recordingIndicator.parentNode.removeChild(recordingIndicator);
            }
            
            if (inputField.value) {
                showNotification('تم التعرف بنجاح!', 'success');
            }
        };
        
        // مستمع حدث للأخطاء
        recognition.onerror = function(event) {
            console.error(`خطأ في التعرف على الصوت: ${event.error}`);
            
            let errorMessage = 'حدث خطأ في التعرف على الصوت';
            
            // تحديد رسائل الخطأ المختلفة
            switch(event.error) {
                case 'no-speech':
                    errorMessage = 'لم يتم اكتشاف أي كلام';
                    break;
                case 'audio-capture':
                    errorMessage = 'تعذر الوصول إلى المايكروفون';
                    break;
                case 'not-allowed':
                    errorMessage = 'تم رفض الوصول إلى المايكروفون';
                    break;
                case 'network':
                    errorMessage = 'حدث خطأ في الشبكة';
                    break;
                case 'aborted':
                    // لا حاجة لعرض إشعار في حالة الإلغاء
                    errorMessage = null;
                    break;
            }
            
            // إعادة تعيين حالة الزر
            button.classList.remove('listening');
            if (icon) {
                icon.classList.remove('fa-spinner');
                icon.classList.remove('fa-pulse');
                icon.classList.add('fa-microphone');
            }
            
            // إزالة فئة الإدخال الصوتي
            inputField.classList.remove('voice-input');
            
            // إزالة مؤشر التسجيل
            if (recordingIndicator.parentNode) {
                recordingIndicator.parentNode.removeChild(recordingIndicator);
            }
            
            if (errorMessage) {
                showNotification(errorMessage, 'error');
            }
        };
        
        // بدء عملية التعرف على الصوت
        recognition.start();
        console.log('بدأ الاستماع للصوت...');
        
        return recognition;
        
    } catch (error) {
        console.error('خطأ في بدء التعرف على الصوت:', error);
        showNotification('تعذر بدء التعرف على الصوت', 'error');
        
        // إعادة تعيين حالة الزر
        button.classList.remove('listening');
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-spinner');
            icon.classList.remove('fa-pulse');
            icon.classList.add('fa-microphone');
        }
        
        return null;
    }
}

/**
 * إيقاف عملية التعرف على الصوت
 * @param {SpeechRecognition} recognition - كائن التعرف على الصوت
 */
function stopSpeechRecognition(recognition) {
    if (recognition) {
        try {
            recognition.stop();
        } catch (e) {
            // تجاهل الأخطاء عند إيقاف التعرف
        }
    }
    
    // إعادة تعيين حالة جميع أزرار المايكروفون
    const micButtons = document.querySelectorAll('.mic-btn.listening');
    micButtons.forEach(button => {
        button.classList.remove('listening');
        
        // إعادة تعيين الأيقونة
        const icon = button.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-spinner');
            icon.classList.remove('fa-pulse');
            icon.classList.add('fa-microphone');
        }
    });
    
    // إزالة جميع مؤشرات التسجيل المتبقية
    const indicators = document.querySelectorAll('.recording-indicator');
    indicators.forEach(indicator => {
        if (indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    });
    
    // إزالة فئة الإدخال الصوتي من جميع الحقول
    const voiceInputs = document.querySelectorAll('.voice-input');
    voiceInputs.forEach(input => {
        input.classList.remove('voice-input');
    });
}

/**
 * إضافة أنماط CSS للتعرف على الصوت
 */
function addSpeechRecognitionStyles() {
    // التحقق من وجود أنماط مسبقة
    if (document.getElementById('speech-recognition-styles')) {
        return;
    }
    
    // إنشاء عنصر نمط جديد
    const styleElement = document.createElement('style');
    styleElement.id = 'speech-recognition-styles';
    
    // إضافة أنماط CSS
    styleElement.textContent = `
        /* نمط لزر المايكروفون */
        .mic-btn {
            position: relative;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        /* زر المايكروفون عند حالة الاستماع */
        .mic-btn.listening {
            background-color: #f44336;
            color: white;
            border-color: #d32f2f;
            box-shadow: 0 0 0 4px rgba(244, 67, 54, 0.3);
        }
        
        /* زر المايكروفون في حالة عدم الدعم */
        .mic-btn.not-supported {
            opacity: 0.6;
            cursor: not-allowed;
        }
        
        /* مؤشر التسجيل النشط */
        .recording-indicator {
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #f44336;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            z-index: 9999;
            display: flex;
            align-items: center;
            animation: pulse 1.5s infinite;
        }
        
        .recording-indicator::before {
            content: "●";
            margin-left: 8px;
            font-size: 16px;
            animation: blink 1s infinite;
        }
        
        /* تنسيق حقل الإدخال أثناء استخدام الصوت */
        .voice-input {
            border-color: #f44336 !important;
            background-color: rgba(244, 67, 54, 0.05) !important;
            transition: all 0.3s ease;
        }
        
        /* تنشيط نبض للمؤشر */
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.6; }
            100% { opacity: 1; }
        }
        
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
        }
        
        /* زر المساعدة للتعرف على الصوت */
        .speech-help-btn {
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-color: #3498db;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .speech-help-btn:hover {
            transform: scale(1.1);
            background-color: #2980b9;
        }
    `;
    
    // إضافة عنصر النمط إلى رأس الصفحة
    document.head.appendChild(styleElement);
    console.log('تم إضافة أنماط CSS للتعرف على الصوت');
}

/**
 * إعداد قواعد القواميس للتعرف على الصوت
 * @param {Object} SpeechGrammarList - كائن قائمة القواعد النحوية
 */
function setupSpeechGrammar(SpeechGrammarList) {
    if (!SpeechGrammarList) {
        return; // عدم دعم قوائم القواعد النحوية
    }
    
    try {
        // إنشاء قائمة قواعد نحوية للأرقام والكلمات المتوقعة
        const numbers = '0 1 2 3 4 5 6 7 8 9 صفر واحد اثنان ثلاثة أربعة خمسة ستة سبعة ثمانية تسعة عشرة عشرون ثلاثون أربعون خمسون ستون سبعون ثمانون تسعون مائة مئة ألف مليون';
        const financialTerms = 'دينار ريال درهم دولار يورو إيداع سحب استثمار ربح أرباح فائدة رصيد مستثمر';
        
        // إنشاء قواعد JSGF
        const grammar = `#JSGF V1.0; grammar numbers; public <numbers> = ${numbers}; public <terms> = ${financialTerms};`;
        
        // إنشاء قائمة القواعد النحوية
        const speechGrammarList = new SpeechGrammarList();
        speechGrammarList.addFromString(grammar, 1);
        
        // حفظ القواعد النحوية
        window.speechGrammarList = speechGrammarList;
        
        console.log('تم إعداد قواعد القواميس للتعرف على الصوت');
    } catch (error) {
        console.error('خطأ في إعداد قواعد القواميس:', error);
    }
}

/**
 * إضافة زر المساعدة للتعرف على الصوت
 */
function addSpeechRecognitionHelpButton() {
    // التحقق من وجود الزر مسبقًا
    if (document.querySelector('.speech-help-btn')) {
        return;
    }
    
    // إنشاء زر المساعدة
    const helpButton = document.createElement('button');
    helpButton.className = 'speech-help-btn';
    helpButton.title = 'مساعدة حول استخدام الإدخال الصوتي';
    helpButton.innerHTML = '<i class="fas fa-microphone"></i>';
    
    // إضافة مستمع حدث النقر
    helpButton.addEventListener('click', function() {
        showSpeechHelpModal();
    });
    
    // إضافة الزر إلى الصفحة
    document.body.appendChild(helpButton);
    
    console.log('تم إضافة زر المساعدة للتعرف على الصوت');
}

/**
 * عرض نافذة المساعدة للتعرف على الصوت
 */
function showSpeechHelpModal() {
    const content = `
        <div style="font-family: 'Tajawal', sans-serif; line-height: 1.6; text-align: right; direction: rtl;">
            <h3 style="color: #3498db; margin-bottom: 15px; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-microphone"></i>
                كيفية استخدام الإدخال الصوتي
            </h3>
            
            <p>يمكنك استخدام ميزة الإدخال الصوتي لإدخال البيانات باستخدام الصوت بدلاً من الكتابة. اتبع الخطوات التالية:</p>
            
            <ol style="padding-right: 20px; margin-bottom: 20px;">
                <li>انقر على زر المايكروفون <i class="fas fa-microphone"></i> بجانب حقل الإدخال.</li>
                <li>اسمح للمتصفح بالوصول إلى المايكروفون إذا طُلب منك ذلك.</li>
                <li>تحدث بوضوح باللغة العربية.</li>
                <li>سيتم تحويل كلامك تلقائيًا إلى نص في حقل الإدخال.</li>
                <li>يمكنك تعديل النص يدويًا بعد الانتهاء إذا لزم الأمر.</li>
            </ol>
            
            <div style="background-color: #f8fafc; border-right: 4px solid #3498db; padding: 15px; border-radius: 4px;">
                <p style="margin-top: 0;"><strong>ملاحظات:</strong></p>
                <ul style="padding-right: 20px; margin-bottom: 0;">
                    <li>تأكد من أن المايكروفون يعمل بشكل صحيح.</li>
                    <li>تحدث بوضوح وببطء للحصول على نتائج أفضل.</li>
                    <li>يعمل هذا بشكل أفضل في بيئة هادئة خالية من الضوضاء.</li>
                    <li>الأرقام والقيم المالية يتم التعرف عليها بشكل أفضل عند نطقها بوضوح.</li>
                    <li>تأكد من استخدام متصفح حديث (Chrome أو Edge أو Safari) للحصول على أفضل نتائج.</li>
                </ul>
            </div>
        </div>
    `;
    
    // استخدام دالة عرض النافذة المنبثقة الموجودة
    showModal('مساعدة الإدخال الصوتي', content);
}

/**
 * إعداد مستمعي الأحداث للنوافذ المنبثقة
 */
function setupModalEvents() {
    // استمع لأحداث فتح النوافذ المنبثقة لإضافة أزرار المايكروفون للحقول الجديدة
    document.addEventListener('click', function(event) {
        // البحث عن أزرار فتح النوافذ المنبثقة التي تم النقر عليها
        const modalTrigger = event.target.closest('[data-modal], [data-page], .modal-close, .modal-close-btn');
        
        if (modalTrigger) {
            // تأخير لإعطاء وقت للنافذة المنبثقة للظهور
            setTimeout(() => {
                // البحث عن حقول النموذج التي تحتاج إلى أزرار المايكروفون
                createMicrophoneButtons();
                
                // البحث عن أزرار المايكروفون الموجودة وإعدادها
                const modalMicButtons = document.querySelectorAll('.modal.active .mic-btn:not(.setup-complete)');
                if (modalMicButtons.length > 0) {
                    setupExistingMicrophoneButtons(modalMicButtons);
                }
            }, 300);
        }
    });
    
    // إيقاف أي تعرف على الصوت نشط عند إغلاق النافذة المنبثقة
    document.addEventListener('click', function(event) {
        const modalCloseBtn = event.target.closest('.modal-close, .modal-close-btn');
        if (modalCloseBtn) {
                        // إيقاف أي تعرف على الصوت نشط
                    }
                });
            }