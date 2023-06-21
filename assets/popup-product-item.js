(() => {
  // app/scripts/popup-product-item.js
  function closePopup() {
    const popupProduct = document.querySelector("#popup-product-item");
    popupProduct.classList.remove("active");
  }
  function openPopup() {
    const popupProduct = document.querySelector("#popup-product-item");
    popupProduct.classList.add("active");
  }
  var btnClose = document.querySelector("#popup-product-item .close-popup");
  if (btnClose) {
    btnClose.addEventListener("click", () => {
      closePopup();
    });
  }
})();
