(function() {
  var slides = document.querySelectorAll('.hero__slide');
  var dots = document.querySelectorAll('.hero__dot');
  var prevBtn = document.querySelector('.hero__btn--prev');
  var nextBtn = document.querySelector('.hero__btn--next');
  var hero = document.querySelector('.hero');
  var current = 0;
  var interval;

  function goToSlide(index) {
    slides.forEach(function(slide) { slide.classList.remove('hero__slide--active'); });
    dots.forEach(function(dot) { dot.classList.remove('hero__dot--active'); });

    slides[index].classList.add('hero__slide--active');
    dots[index].classList.add('hero__dot--active');
    current = index;
  }

  function nextSlide() {
    var next = (current + 1) % slides.length;
    goToSlide(next);
  }

  function prevSlide() {
    var prev = (current - 1 + slides.length) % slides.length;
    goToSlide(prev);
  }

  function startSlider() {
    stopSlider();
    interval = setInterval(nextSlide, 5000);
  }

  function stopSlider() {
    clearInterval(interval);
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      var index = parseInt(this.getAttribute('data-slide'), 10);
      goToSlide(index);
      startSlider();
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      prevSlide();
      startSlider();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      nextSlide();
      startSlider();
    });
  }

  if (hero) {
    hero.addEventListener('mouseenter', stopSlider);
    hero.addEventListener('mouseleave', startSlider);
  }

  startSlider();
})();
