(() => {
  // app/scripts/collection.js
  addEventButtonFilter();
  function addEventButtonFilter() {
    const filter = document.querySelector(".collection__toolbar__filter");
    const buttons = document.querySelectorAll(".collection__toolbar-filter-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const currentState = button.getAttribute("data-state");
        filter.classList.toggle("active");
        if (!currentState || currentState === "closed") {
          button.setAttribute("data-state", "opened");
          button.setAttribute("aria-expanded", "true");
        } else {
          button.setAttribute("data-state", "closed");
          button.setAttribute("aria-expanded", "false");
        }
      });
    });
  }
  document.addEventListener("shopify:section:load", () => {
    addEventButtonFilter();
  });
})();
