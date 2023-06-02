(() => {
  // app/scripts/cart-popup.js
  var jsCartPopup = document.querySelector(".jsCartPopup");
  var closeButton = document.querySelector(".jsCartPopup .header-close");
  closeButton.addEventListener("click", () => {
    jsCartPopup.classList.remove("active");
  });
})();
