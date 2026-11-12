/* West Grand Garden · Past-events gallery (GLightbox) */
/* Loaded after the GLightbox CDN script. If GLightbox fails to load, the
   links still work as plain links to the full-size photos. */
(function () {
  function init() {
    if (typeof GLightbox === 'undefined') return;
    GLightbox({
      selector: '.wgg-glb',
      touchNavigation: true,
      loop: true,
      zoomable: true,
      descPosition: 'bottom',
      openEffect: 'zoom',
      closeEffect: 'fade'
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
