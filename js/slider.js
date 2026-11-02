/* ==========================================================================
   slider.js - سلايدر آراء العملاء (Testimonials Slider)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {

  const track = document.getElementById('testimonialTrack');
  if (!track) return;

  const slides = Array.from(track.children);
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  let currentIndex = 0;
  let autoPlayInterval = null;
  const AUTOPLAY_DELAY = 5500;

  /* ---------------------- بناء النقاط (Dots) ---------------------- */
  slides.forEach((_, index) => {
    const dot = document.createElement('span');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = Array.from(dotsContainer.children);

  /* ---------------------- تحديث موضع السلايدر ----------------------
     ملاحظة: الصفحة RTL لذلك نستخدم قيمة موجبة للترجمة لتحريك الشرائح للاتجاه الصحيح */
  function updateSlider() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateSlider();
    restartAutoPlay();
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  /* ---------------------- التشغيل التلقائي ---------------------- */
  function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, AUTOPLAY_DELAY);
  }
  function restartAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }
  startAutoPlay();

  /* ---------------------- دعم السحب باللمس (Touch Swipe) ---------------------- */
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    const threshold = 40;
    if (diff > threshold) {
      // سحب لليسار - الصفحة RTL لذلك هذا يعني الشريحة التالية
      prevSlide();
    } else if (diff < -threshold) {
      nextSlide();
    }
  }

  /* ---------------------- إيقاف التشغيل التلقائي عند التفاعل ---------------------- */
  const sliderWrapper = document.querySelector('.testimonial-slider');
  sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
  sliderWrapper.addEventListener('mouseleave', startAutoPlay);

  updateSlider();
});
