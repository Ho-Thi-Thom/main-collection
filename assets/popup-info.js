(() => {
  // app/scripts/utils.js
  function shopifyReloadSection(callback, sectionId, isShopifySectionReload = true) {
    if (callback) {
      callback();
      if (isShopifySectionReload) {
        document.addEventListener("shopify:section:load", (event) => {
          if (event.detail.sectionId === sectionId) {
            callback();
          }
        });
      }
    }
  }
  function closePopup() {
    const popupInfo = document.querySelector("#popup-info");
    popupInfo.classList.remove("active");
  }

  // app/scripts/popup-info.js
  function closePopupInfo() {
    const btnClose = document.querySelector(".jsClosePopup");
    if (btnClose) {
      btnClose.addEventListener("click", closePopup);
    }
  }
  shopifyReloadSection(closePopupInfo);
})();
