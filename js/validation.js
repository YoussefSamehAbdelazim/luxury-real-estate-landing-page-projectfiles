/* ==========================================================================
   validation.js - التحقق من صحة نموذج "تواصل معنا"
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const form = document.getElementById('contactForm');
  if (!form) return;

  const successMsg = document.getElementById('formSuccess');

  const fields = {
    name: {
      input: document.getElementById('name'),
      errorEl: document.getElementById('nameError'),
      validate: (value) => {
        if (!value.trim()) return 'من فضلك أدخل اسمك الكامل';
        if (value.trim().length < 3) return 'الاسم يجب ألا يقل عن 3 أحرف';
        return '';
      }
    },
    phone: {
      input: document.getElementById('phone'),
      errorEl: document.getElementById('phoneError'),
      validate: (value) => {
        const phoneRegex = /^01[0-2,5]{1}[0-9]{8}$/;
        if (!value.trim()) return 'من فضلك أدخل رقم هاتفك';
        if (!phoneRegex.test(value.trim())) return 'رقم الهاتف غير صحيح (مثال: 01012345678)';
        return '';
      }
    },
    email: {
      input: document.getElementById('email'),
      errorEl: document.getElementById('emailError'),
      validate: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) return 'من فضلك أدخل بريدك الإلكتروني';
        if (!emailRegex.test(value.trim())) return 'صيغة البريد الإلكتروني غير صحيحة';
        return '';
      }
    },
    message: {
      input: document.getElementById('message'),
      errorEl: document.getElementById('messageError'),
      validate: (value) => {
        if (!value.trim()) return 'من فضلك اكتب تفاصيل رسالتك';
        if (value.trim().length < 10) return 'الرسالة قصيرة جدًا، حاول إضافة تفاصيل أكثر';
        return '';
      }
    }
  };

  function showError(field, message) {
    const group = field.input.closest('.form-group');
    if (message) {
      group.classList.add('error');
      field.errorEl.textContent = message;
    } else {
      group.classList.remove('error');
      field.errorEl.textContent = '';
    }
  }

  function validateField(key) {
    const field = fields[key];
    const error = field.validate(field.input.value);
    showError(field, error);
    return !error;
  }

  // تحقق فوري أثناء الكتابة بعد أول محاولة إرسال
  let submitted = false;
  Object.keys(fields).forEach((key) => {
    fields[key].input.addEventListener('input', () => {
      if (submitted) validateField(key);
    });
    fields[key].input.addEventListener('blur', () => validateField(key));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    submitted = true;

    let isValid = true;
    Object.keys(fields).forEach((key) => {
      if (!validateField(key)) isValid = false;
    });

    if (!isValid) {
      successMsg.classList.remove('show');
      const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // محاكاة إرسال البيانات بنجاح (لا يوجد باك إند)
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جارِ الإرسال...';
    submitBtn.disabled = true;

    setTimeout(() => {
      successMsg.classList.add('show');
      form.reset();
      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;
      submitted = false;

      Object.keys(fields).forEach((key) => showError(fields[key], ''));

      setTimeout(() => successMsg.classList.remove('show'), 5000);
    }, 1200);
  });

});
