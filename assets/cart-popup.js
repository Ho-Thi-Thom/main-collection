(() => {
  // app/scripts/cart-popup.js
  function handelClose() {
    const jsCartPopup = document.querySelector(".jsCartPopup");
    const closeButton = document.querySelector(".jsCartPopup .popup__header-close");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        jsCartPopup.classList.remove("active");
        const overlay = document.querySelector("#bg-color");
        overlay.classList.remove("body-overlay");
      });
    }
  }
  handelClose();
  function handelActivePopup() {
    const jsCartPopup = document.querySelector(".jsCartPopup");
    jsCartPopup.classList.add("active");
    const overlay = document.querySelector("#bg-color");
    overlay.classList.add("body-overlay");
  }
  async function fetchDataCart(sectionId) {
    try {
      const response = await fetch(window.location.pathname + `?section_id=${sectionId}`);
      const data = await response.text();
      return data;
    } catch (error) {
      return error;
    }
  }
})();
