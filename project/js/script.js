(function() {
  function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const staggerEls = document.querySelectorAll('.stagger-children');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.classList.contains('reveal')) el.classList.add('reveal--visible');
          if (el.classList.contains('reveal-left')) el.classList.add('reveal-left--visible');
          if (el.classList.contains('reveal-right')) el.classList.add('reveal-right--visible');
          if (el.classList.contains('reveal-scale')) el.classList.add('reveal-scale--visible');
          if (el.classList.contains('stagger-children')) el.classList.add('stagger-children--visible');
          observer.unobserve(el);
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

      revealEls.forEach(function(el) { observer.observe(el); });
      staggerEls.forEach(function(el) { observer.observe(el); });
    } else {
      function checkVisibility() {
        revealEls.forEach(function(el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight - 80 && rect.bottom > 0) {
            if (el.classList.contains('reveal')) el.classList.add('reveal--visible');
            if (el.classList.contains('reveal-left')) el.classList.add('reveal-left--visible');
            if (el.classList.contains('reveal-right')) el.classList.add('reveal-right--visible');
            if (el.classList.contains('reveal-scale')) el.classList.add('reveal-scale--visible');
          }
        });
        staggerEls.forEach(function(el) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight - 80 && rect.bottom > 0) {
            el.classList.add('stagger-children--visible');
          }
        });
      }

      checkVisibility();
      window.addEventListener('scroll', checkVisibility, { passive: true });
      window.addEventListener('resize', checkVisibility, { passive: true });
    }
  }

  function initLoadingScreen() {
    const loader = document.getElementById('loadingScreen');
    if (!loader) return;

    function hideLoader() {
      loader.classList.add('loading-screen--hidden');
    }

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 500);
    } else {
      window.addEventListener('load', function() {
        setTimeout(hideLoader, 500);
      });
    }

    setTimeout(hideLoader, 3000);
  }

  document.addEventListener('DOMContentLoaded', function() {
    initScrollReveal();
    initLoadingScreen();
  });
})();
