/* ==========================================================================
   main.js - الوظائف العامة: الهيدر، القائمة الجانبية، التمرير، العدادات،
   الفلترة، المفضلة، الحركات عند الظهور
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  // Enable reveal animations only when this script is actually running.
  document.documentElement.classList.add('aos-enabled');

  /* ---------------------- Preloader ---------------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(() => preloader && preloader.classList.add('hide'), 300);
  });
  // أمان إضافي في حال تأخر حدث load
  setTimeout(() => preloader && preloader.classList.add('hide'), 2500);

  /* ---------------------- الهيدر عند التمرير ---------------------- */
  const header = document.getElementById('header');
  const backToTop = document.getElementById('backToTop');

  function handleScroll() {
    const scrolled = window.scrollY > 60;
    if (header) header.classList.toggle('scrolled', scrolled);
    if (backToTop) backToTop.classList.toggle('show', window.scrollY > 500);
  }
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------- قائمة الموبايل (Burger) ---------------------- */
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const navOverlay = document.getElementById('navOverlay');
  const navLinks = document.querySelectorAll('.nav__link');

  function closeMenu() {
    if (burger) burger.classList.remove('active');
    if (nav) nav.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    if (!nav || !burger || !navOverlay) return;
    const isOpen = nav.classList.toggle('open');
    burger.classList.toggle('active', isOpen);
    navOverlay.classList.toggle('show', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (burger) burger.addEventListener('click', toggleMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  /* ---------------------- تفعيل الرابط النشط حسب القسم ---------------------- */
  const sections = document.querySelectorAll('section[id]');

  function setActiveLink() {
    let current = 'home';
    const scrollPos = window.scrollY + window.innerHeight * 0.3;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  /* ---------------------- عداد الأرقام في قسم الهيرو ---------------------- */
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;

  function animateCounters() {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800;
      const startTime = performance.now();

      function update(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        counter.textContent = value;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }
      requestAnimationFrame(update);
    });
  }

  /* ---------------------- مراقبة الظهور عند التمرير (Intersection Observer) ---------------------- */
  const aosElements = document.querySelectorAll('[data-aos]');
  const heroStats = document.querySelector('.hero__stats');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  aosElements.forEach(el => observer.observe(el));

  // تشغيل العدادات عند ظهور قسم الإحصائيات أو مباشرة لأنه في أعلى الصفحة
  if (heroStats) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(heroStats);
  }

  /* ---------------------- فلترة العقارات ---------------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const propertyCards = document.querySelectorAll('.property-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      propertyCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const shouldShow = filter === 'all' || filter === category;
        card.classList.toggle('hide', !shouldShow);
      });
    });
  });

  /* ---------------------- زر المفضلة في بطاقات العقارات ---------------------- */
  const favButtons = document.querySelectorAll('.fav-btn');
  favButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('active');
      const icon = btn.querySelector('i');
      icon.classList.toggle('fa-regular');
      icon.classList.toggle('fa-solid');
    });
  });

  /* ---------------------- اشتراك النشرة البريدية ---------------------- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input.value.trim()) {
        input.value = '';
        input.placeholder = 'تم الاشتراك بنجاح! شكرًا لك';
        setTimeout(() => (input.placeholder = 'بريدك الإلكتروني'), 3000);
      }
    });
  }

});
