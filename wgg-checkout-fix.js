/* West Grand Garden — keep the Booqable MY BOOKING checkout visible.
   Hosted on jsDelivr (GitHub johnwu55/wgg-scripts, public repo).
   Load it in the booking embed with:
   <script src="https://cdn.jsdelivr.net/gh/johnwu55/wgg-scripts@main/wgg-checkout-fix.js"></script>
   (Inline <script> blocks do not execute in the Hostinger embed, so this
   fix must be loaded as an external file, the same way booqable.js is.)
   It finds the CHECKOUT button by its text (no Booqable class names needed),
   turns the tall panel into a viewport-sized drawer, and pins the footer
   (Subtotal + deposit + CHECKOUT) to the panel bottom. */
(function(){
  function findCheckout(){
    var els = document.querySelectorAll('button, a, input[type="submit"]');
    for (var i = 0; i < els.length; i++){
      var t = (els[i].textContent || els[i].value || '').trim();
      if (t === 'CHECKOUT') return els[i];
    }
    return null;
  }
  function applyFix(){
    try{
      var co = findCheckout();
      if (!co) return;
      /* Footer = nearest ancestor that also contains "Subtotal" */
      var footer = co, found = false;
      while (footer && footer !== document.body){
        if ((footer.textContent || '').indexOf('Subtotal') !== -1){ found = true; break; }
        footer = footer.parentElement;
      }
      if (found && !footer.getAttribute('data-wgg-pinned')){
        footer.setAttribute('data-wgg-pinned', '1');
        footer.style.position = 'sticky';
        footer.style.bottom = '0';
        footer.style.zIndex = '5';
        footer.style.background = '#ffffff';
        footer.style.boxShadow = '0 -8px 20px rgba(0,0,0,0.08)';
      }
      /* Panel = smallest ancestor containing both MY BOOKING and CHECKOUT */
      var panel = co;
      while (panel && panel !== document.body){
        if ((panel.textContent || '').indexOf('MY BOOKING') !== -1) break;
        panel = panel.parentElement;
      }
      if (panel && panel !== document.body && !panel.getAttribute('data-wgg-panel')){
        panel.setAttribute('data-wgg-panel', '1');
        var w = panel.getBoundingClientRect().width;
        panel.style.position = 'fixed';
        panel.style.top = '0';
        panel.style.right = '0';
        panel.style.height = '100vh';
        panel.style.maxHeight = '100dvh';
        panel.style.overflowY = 'auto';
        panel.style.zIndex = '9999';
        if (w > 0) panel.style.width = w + 'px';
      }
    }catch(e){ /* never break the booking widget */ }
  }
  var obs = new MutationObserver(function(){ applyFix(); });
  obs.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('click', function(){ setTimeout(applyFix, 300); setTimeout(applyFix, 1200); });
  applyFix();
})();
