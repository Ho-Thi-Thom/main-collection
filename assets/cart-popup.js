(() => {
  // app/scripts/cart-popup.js
  var jsCartPopup = document.querySelector(".jsCartPopup");
  var closeButton = document.querySelector(".jsCartPopup .header-close");
  var body = document.querySelector("#bg-color");
  closeButton.addEventListener("click", () => {
    jsCartPopup.classList.remove("active");
    body.classList.remove("body-overlay");
  });
})();
