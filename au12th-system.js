
const ADMIN_SECRET = "admin@123"; // غيّر هذه الكلمة للسرية

function handleLogin() {
  const email = document.getElementById("auth-email").value;
  const password = document.getElementById("auth-password").value;

  FirebaseSync.login(email, password)
    .then(() => {
      document.getElementById("auth-container").style.display = "none";
      document.querySelector(".layout").style.display = "block";
      window._enhancedLoadData(); // تحميل بيانات المستخدم
    })
    .catch(err => {
      document.getElementById("auth-error").innerText = "فشل تسجيل الدخول: " + err.message;
    });
}

function handleSignup() {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const adminPass = document.getElementById("admin-pass").value;

  if (adminPass !== ADMIN_SECRET) {
    document.getElementById("auth-error").innerText = "كلمة الإدمن غير صحيحة!";
    return;
  }

  FirebaseSync.signup(email, password)
    .then(() => {
      document.getElementById("auth-error").innerText = "تم إنشاء الحساب بنجاح. سجل الدخول الآن.";
    })
    .catch(err => {
      document.getElementById("auth-error").innerText = "فشل إنشاء الحساب: " + err.message;
    });
}
