(function() {
  const counters = document.querySelectorAll('.count-up');
  const progressFill = document.getElementById('progressFill');
  let countersAnimated = false;
  let progressAnimated = false;
  let ticking = false;

  function formatWithSuffix(num, suffix) {
    var n = num;
    if (suffix === 'K+' || suffix === 'K') {
      if (n >= 1000) {
        var val = n / 1000;
        return (val % 1 === 0 ? val.toFixed(0) : val.toFixed(1).replace(/\.0$/, '')) + suffix;
      }
      return n + suffix;
    }
    return n + (suffix || '');
  }

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;
    counters.forEach(function(counter) {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      const suffix = counter.getAttribute('data-suffix') || '';
      if (isNaN(target)) return;

      const duration = 2500;
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);
        counter.textContent = formatWithSuffix(current, suffix);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = formatWithSuffix(target, suffix);
        }
      }

      requestAnimationFrame(step);
    });
  }

  function animateProgress() {
    if (progressAnimated || !progressFill) return;
    progressAnimated = true;
    const width = parseInt(progressFill.getAttribute('data-width'), 10);
    if (!isNaN(width)) {
      setTimeout(function() {
        progressFill.style.width = width + '%';
      }, 300);
    }
  }

  function checkVisibility() {
    const statsSection = document.querySelector('.stats-strip');
    if (!statsSection) return;

    const rect = statsSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - 100 && rect.bottom > 0;

    if (isVisible) {
      if (!countersAnimated) animateCounters();
      if (!progressAnimated) animateProgress();

      if (countersAnimated && progressAnimated) {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function() {
        checkVisibility();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  checkVisibility();
})();
