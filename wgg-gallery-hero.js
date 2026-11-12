/* West Grand Garden · Past-events gallery, hero + filmstrip (GLightbox) */
/* Clicking a thumbnail swaps the hero photo. Clicking the hero opens it full screen. */
/* Loaded after the GLightbox CDN script. If GLightbox fails to load, the hero link
   still opens the photo directly and the thumbnails still swap the hero. */
(function () {
  var lightbox = null;

  function initLightbox() {
    if (typeof GLightbox === 'undefined') return;
    lightbox = GLightbox({
      selector: '.wgg-glb',
      touchNavigation: true,
      loop: true,
      zoomable: true,
      descPosition: 'bottom',
      openEffect: 'zoom',
      closeEffect: 'fade'
    });
  }

  function initSwap() {
    var heroLink = document.getElementById('wgg-hero-link');
    var heroImg = document.getElementById('wgg-hero-img');
    var heroCap = document.getElementById('wgg-hero-cap');
    var thumbs = document.querySelectorAll('.wgg-thumb');
    if (!heroLink || !heroImg || !thumbs.length) return;
    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var full = btn.getAttribute('data-full');
        var title = btn.getAttribute('data-title') || '';
        if (!full) return;
        heroImg.src = full;
        heroImg.alt = title;
        heroLink.href = full;
        heroLink.setAttribute('data-title', title);
        if (heroCap) heroCap.textContent = title;
        thumbs.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        if (lightbox && lightbox.reload) lightbox.reload();
      });
    });
  }

  function init() {
    initLightbox();
    initSwap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
