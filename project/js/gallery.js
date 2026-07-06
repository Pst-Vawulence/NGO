(function() {
  const filters = document.querySelectorAll('.gallery__filter');
  const items = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');

  function filterGallery(category) {
    items.forEach(function(item) {
      const match = category === 'all' || item.getAttribute('data-category') === category;
      item.classList.toggle('gallery__item--hidden', !match);
    });
  }

  filters.forEach(function(filter) {
    filter.addEventListener('click', function() {
      filters.forEach(function(f) { f.classList.remove('gallery__filter--active'); });
      filter.classList.add('gallery__filter--active');
      filterGallery(filter.getAttribute('data-filter'));
    });
  });

  function openLightbox(item) {
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery__overlay');
    if (!img) return;

    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt');
    let category = '';
    let title = '';

    if (overlay) {
      const catEl = overlay.querySelector('.gallery__overlay-category');
      const titleEl = overlay.querySelector('.gallery__overlay-title');
      if (catEl) category = catEl.textContent;
      if (titleEl) title = titleEl.textContent;
    }

    lightboxImage.setAttribute('src', src);
    lightboxImage.setAttribute('alt', alt);
    if (lightboxCategory) lightboxCategory.textContent = category;
    if (lightboxTitle) lightboxTitle.textContent = title;
    lightbox.classList.add('lightbox--open');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  }

  items.forEach(function(item) {
    item.addEventListener('click', function() {
      openLightbox(this);
    });
    item.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(this);
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('lightbox--open');
    document.body.style.overflow = '';
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('lightbox--open')) {
      closeLightbox();
    }
  });
})();
