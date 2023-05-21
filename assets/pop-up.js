(() => {
  // app/scripts/pop-up.js
  var popUpListener = (e) => {
    document.querySelector(".pop-up")?.classList.toggle("active", e.target.classList.contains("shopify-section-swatch-color"));
  };
  document.addEventListener("shopify:section:select", popUpListener);
  document.addEventListener("shopify:section:load", popUpListener);
})();
