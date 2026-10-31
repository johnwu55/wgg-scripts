/* West Grand Garden · Colour booking popup (external JS for the /rental colour-section embed).
   Loaded via <script src> because inline scripts do not run in Hostinger embeds.
   Handles: swatch building, colour switching, modal open/close, Booqable button toggling. */
(function () {
  var base = 'https://images.booqablecdn.com/w500/h500/uploads/1f6dd94c63ac7cf34b015047cecdecf3/photo/photo/';
  var big = 'https://images.booqablecdn.com/w1000/h1000/uploads/1f6dd94c63ac7cf34b015047cecdecf3/photo/photo/';
  var colours = [
    { name: 'White', file: '3e059cc2-1d40-4da0-a318-88da014c18de/export__1_.jpeg', id: 'canopy-rent-white' },
    { name: 'Blue', file: '4b395a5d-28ce-42b5-a2ec-e394150d7fd8/export__2_.jpeg', id: 'canopy-rent-blue' },
    { name: 'Green', file: 'd8ed1d65-40c9-412a-822f-cf9ebc98fcb3/export__4_.jpeg', id: 'canopy-rent-green' },
    { name: 'Orange', file: '22f7cdc9-4684-4b4a-8ff5-89ec78a6e82f/export.jpeg', id: 'canopy-rent-orange' },
    { name: 'Black', file: 'cb500b8e-99b3-4386-b4a0-12b9a8de209a/export__5_.jpeg', id: 'canopy-rent-black' },
    { name: 'Sand', file: 'a04ac582-6534-4a26-b877-ae45b8703eb2/export__7_.jpeg', id: 'canopy-rent-sand' },
    { name: 'Cream', file: 'b0e61aae-35f3-4c0b-b32e-a422d236a9bc/export__6_.jpeg', id: 'canopy-rent-cream' },
    { name: 'Yellow', file: '46662d2c-0cbe-4525-9bea-0de0123e4856/export__3_.jpeg', id: 'canopy-rent-yellow' }
  ];
  var thumbsWrap = document.getElementById('wggColourThumbs');
  var bigImg = document.getElementById('wggColourImg');
  var nameEl = document.getElementById('wggColourName');
  var modal = document.getElementById('wggPopup');
  var modalImg = document.getElementById('wggPopupImg');
  var modalName = document.getElementById('wggPopupName');
  var reserveBtn = document.getElementById('wggReserveBtn');
  if (!thumbsWrap || !bigImg || !nameEl || !modal) return;
  var current = 0;
  var started = false;
  bigImg.style.transition = 'opacity .3s ease';
  modalImg.style.transition = 'opacity .3s ease';
  function swapImg(img, src, alt) {
    if (!started) { img.src = src; img.alt = alt; return; }
    if (img._fadeTimer) clearTimeout(img._fadeTimer);
    var pre = new Image();
    pre.onload = function () {
      img.style.opacity = '0';
      img._fadeTimer = setTimeout(function () { img.src = src; img.alt = alt; img.style.opacity = '1'; }, 300);
    };
    pre.onerror = function () { img.src = src; img.alt = alt; };
    pre.src = src;
  }
  function select(i, open) {
    current = i;
    var c = colours[i];
    swapImg(bigImg, big + c.file, '10 × 10 Canopy Tent — ' + c.name);
    nameEl.textContent = c.name;
    swapImg(modalImg, big + c.file, '10 × 10 Canopy Tent — ' + c.name);
    modalName.textContent = c.name;
    started = true;
    var thumbs = thumbsWrap.querySelectorAll('.wgg-colour-thumb');
    thumbs.forEach(function (t, j) { t.classList.toggle('on', j === i); });
    colours.forEach(function (cc, j) {
      var w = document.getElementById('wggBtn-' + cc.id);
      if (w) w.style.display = (j === i) ? '' : 'none';
    });
    if (open) openModal();
  }
  function openModal() {
    modal.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.style.display = 'none';
    document.documentElement.style.overflow = '';
  }
  colours.forEach(function (c, i) {
    var d = document.createElement('div');
    d.className = 'wgg-colour-thumb' + (i === 0 ? ' on' : '');
    d.innerHTML = '<img src="' + base + c.file + '" alt="10 × 10 Canopy Tent — ' + c.name + '"><span>' + c.name + '</span>';
    d.addEventListener('click', function () { select(i, true); });
    thumbsWrap.appendChild(d);
  });
  bigImg.addEventListener('click', function () { select(current, true); });
  if (reserveBtn) reserveBtn.addEventListener('click', function () { select(current, true); });
  var closeBtn = document.getElementById('wggPopupClose');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  select(0, false);
})();
