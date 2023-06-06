(() => {
  // app/scripts/product-card.js
  window.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector("body");
    body.addEventListener("click", (event) => {
      if (event.target.classList.contains("jsViewCart")) {
        event.preventDefault();
        console.log(event.dataset.variantId);
      }
    });
  });
})();
