(function() {
  'use strict';

  var nav = document.getElementById('nav');
  var hamburger = document.getElementById('hamburger');
  var navMobile = document.getElementById('navMobile');
  var scrollProgressFill = document.getElementById('scrollProgressFill');
  var backToTop = document.getElementById('backToTop');
  var yearSpan = document.getElementById('year');

  var ticking = false;
  var focusIndex = -1;

  // --- Nav scroll handler ---

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  // --- Scroll progress ---

  function updateScrollProgress() {
    if (!scrollProgressFill) return;
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgressFill.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + '%';
  }

  function updateBackToTop() {
    if (backToTop) backToTop.classList.toggle('back-to-top--visible', window.scrollY > 400);
  }

  // --- Scroll spy ---

  function updateActiveSection() {
    var sections = document.querySelectorAll('[data-nav-section]');
    if (!sections.length) return;
    var navLinks = document.querySelectorAll('[data-section]');
    var scrollPos = window.scrollY + 150;
    var currentSection = '';

    sections.forEach(function(section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = section.getAttribute('data-nav-section');
      }
    });

    if (currentSection) {
      navLinks.forEach(function(link) {
        var isParent = link.classList.contains('nav__link--parent');
        var cls = isParent ? 'nav__link--parent--active' : 'nav__link--active';
        link.classList.toggle(cls, link.getAttribute('data-section') === currentSection);
      });
    }
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function() {
        updateNav();
        updateScrollProgress();
        updateBackToTop();
        updateActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  }

  // --- Mobile toggle (slide-down) ---

  function toggleMobile() {
    hamburger.classList.toggle('nav__hamburger--active');
    navMobile.classList.toggle('nav__mobile-overlay--open');
    document.body.style.overflow = navMobile.classList.contains('nav__mobile-overlay--open') ? 'hidden' : '';
    if (!navMobile.classList.contains('nav__mobile-overlay--open')) closeAllAccordions();
  }

  function closeMobile() {
    hamburger.classList.remove('nav__hamburger--active');
    navMobile.classList.remove('nav__mobile-overlay--open');
    document.body.style.overflow = '';
    closeAllAccordions();
  }

  // --- Mobile accordion ---

  var accordionBtns = document.querySelectorAll('.nav__mobile-accordion-btn');

  function closeAllAccordions(exclude) {
    accordionBtns.forEach(function(btn) {
      var parent = btn.closest('.nav__mobile-accordion');
      if (parent && parent !== exclude) {
        parent.classList.remove('nav__mobile-accordion--open');
      }
    });
  }

  accordionBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var parent = btn.closest('.nav__mobile-accordion');
      var isOpen = parent.classList.contains('nav__mobile-accordion--open');
      closeAllAccordions(parent);
      if (!isOpen) parent.classList.add('nav__mobile-accordion--open');
    });
  });

  // --- Desktop dropdown ---

  var dropdowns = document.querySelectorAll('.nav__dropdown');

  function closeAllDropdowns() {
    document.querySelectorAll('.nav__dropdown-menu--open').forEach(function(m) {
      m.classList.remove('nav__dropdown-menu--open');
    });
    document.querySelectorAll('.nav__link--parent[aria-expanded]').forEach(function(t) {
      t.setAttribute('aria-expanded', 'false');
    });
  }

  function moveFocus(direction, items) {
    if (!items || items.length === 0) return;
    focusIndex = Math.max(0, Math.min(items.length - 1, focusIndex + direction));
    items.forEach(function(item, i) {
      item.setAttribute('tabindex', i === focusIndex ? '0' : '-1');
    });
    items[focusIndex].focus();
  }

  dropdowns.forEach(function(dropdown) {
    var trigger = dropdown.querySelector('.nav__link--parent');
    var menu = dropdown.querySelector('.nav__dropdown-menu');
    var links = menu ? menu.querySelectorAll('.nav__dropdown-link') : [];
    var closeTimer = null;

    function openDropdown() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      if (menu) {
        menu.classList.add('nav__dropdown-menu--open');
        menu.removeAttribute('aria-hidden');
      }
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
      if (menu) {
        menu.classList.remove('nav__dropdown-menu--open');
        menu.setAttribute('aria-hidden', 'true');
      }
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    }

    function scheduleClose() {
      if (closeTimer) clearTimeout(closeTimer);
      closeTimer = setTimeout(closeDropdown, 100);
    }

    function cancelClose() {
      if (closeTimer) {
        clearTimeout(closeTimer);
        closeTimer = null;
      }
    }

    dropdown.addEventListener('mouseenter', function() {
      cancelClose();
      closeAllDropdowns();
      openDropdown();
    });

    dropdown.addEventListener('mouseleave', function() {
      scheduleClose();
    });

    if (menu) {
      menu.addEventListener('mouseenter', cancelClose);
      menu.addEventListener('mouseleave', scheduleClose);
    }

    if (trigger) {
      trigger.addEventListener('click', function(e) {
        if (trigger.getAttribute('href') === '#') e.preventDefault();
      });

      trigger.addEventListener('keydown', function(e) {
        var key = e.key;
        if (key === 'Enter' || key === ' ') {
          e.preventDefault();
          if (menu && menu.classList.contains('nav__dropdown-menu--open')) {
            closeDropdown();
          } else {
            closeAllDropdowns();
            openDropdown();
            focusIndex = -1;
          }
        }
        if (key === 'ArrowDown' || key === 'ArrowUp') {
          e.preventDefault();
          if (!menu || !menu.classList.contains('nav__dropdown-menu--open')) {
            closeAllDropdowns();
            openDropdown();
          }
          moveFocus(key === 'ArrowDown' ? 1 : -1, links);
        }
        if (key === 'Escape') {
          closeDropdown();
          if (trigger) trigger.focus();
        }
      });
    }

    if (menu) {
      menu.setAttribute('role', 'menu');
      links.forEach(function(link, i) {
        link.setAttribute('role', 'menuitem');
        link.setAttribute('tabindex', '-1');
        link.addEventListener('keydown', function(e) {
          var key = e.key;
          if (key === 'ArrowDown' || key === 'ArrowUp') {
            e.preventDefault();
            moveFocus(key === 'ArrowDown' ? 1 : -1, links);
          }
          if (key === 'Escape') {
            e.preventDefault();
            closeDropdown();
            if (trigger) trigger.focus();
          }
          if (key === 'Enter' || key === ' ') {
            closeDropdown();
          }
        });
      });
    }
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav__dropdown')) closeAllDropdowns();
  });

  // --- Active page ---

  function highlightActivePage() {
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav__link').forEach(function(link) {
      link.classList.toggle('nav__link--active', link.getAttribute('href') === currentPage);
    });

    document.querySelectorAll('.nav__link--parent').forEach(function(link) {
      link.classList.toggle('nav__link--parent--active', link.getAttribute('href') === currentPage);
    });

    document.querySelectorAll('.nav__dropdown-link').forEach(function(link) {
      link.classList.toggle('nav__dropdown-link--active', link.getAttribute('href') === currentPage);
    });

    document.querySelectorAll('.nav__mobile-link').forEach(function(link) {
      link.classList.toggle('nav__mobile-link--active', link.getAttribute('href') === currentPage);
    });

    document.querySelectorAll('.nav__mobile-sub-link').forEach(function(link) {
      link.classList.toggle('nav__mobile-sub-link--active', link.getAttribute('href') === currentPage);
    });
  }

  // --- Events ---

  hamburger.addEventListener('click', toggleMobile);

  navMobile.addEventListener('click', function(e) {
    if (e.target === navMobile) closeMobile();
  });

  document.querySelectorAll('.nav__mobile-link, .nav__link, .nav__mobile-sub-link').forEach(function(link) {
    link.addEventListener('click', function() { closeMobile(); });
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Init ---

  updateNav();
  updateScrollProgress();
  updateBackToTop();
  highlightActivePage();

  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  if (backToTop) {
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('.btn').forEach(function(btn) {
    var rippleTimer;
    btn.addEventListener('click', function(e) {
      clearTimeout(rippleTimer);
      var oldRipple = btn.querySelector('.ripple');
      if (oldRipple) oldRipple.remove();
      var rect = btn.getBoundingClientRect();
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      rippleTimer = setTimeout(function() { ripple.remove(); }, 600);
    });
  });
})();
