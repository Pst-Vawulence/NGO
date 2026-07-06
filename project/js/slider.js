(function() {
  const swiperEl = document.getElementById('testimonialSwiper');
  if (!swiperEl || typeof Swiper === 'undefined') return;

  new Swiper(swiperEl, {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    breakpoints: {
      768: { slidesPerView: 2 },
      1024: { slidesPerView: 2 },
    },
  });
})();
