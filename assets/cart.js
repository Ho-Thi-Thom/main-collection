(() => {
  // app/scripts/cart-service.js
  function updateInfoCartPage(data, lineIndex) {
    const div = document.createElement("div");
    div.innerHTML = data;
    const ulElement = document.querySelector(`ul.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
    const ulElementNew = div.querySelector(`ul.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
    const jsLineUpdatesOld = ulElement.querySelectorAll(".jsLineUpdate");
    const jsLineUpdatesNew = ulElementNew.querySelectorAll(".jsLineUpdate");
    jsLineUpdatesOld.forEach((item, index) => {
      item.replaceWith(jsLineUpdatesNew[index]);
    });
    return ulElement;
  }

  // app/scripts/utils.js
  function shopifyReloadSection(callback, sectionId2, isShopifySectionReload = true) {
    if (callback) {
      callback();
      if (isShopifySectionReload) {
        document.addEventListener("shopify:section:load", (event) => {
          if (event.detail.sectionId === sectionId2) {
            callback();
          }
        });
      }
    }
  }
  async function fetchAPIUpdateItemCart(options) {
    const { variantId, newQuantity, sectionId: sectionId2 } = options;
    const data = await fetch("/cart/change.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: variantId,
        quantity: newQuantity,
        sections: sectionId2
      })
    });
    const res = await data.json();
    return res;
  }

  // app/scripts/cart.js
  var sectionId = document.querySelector(".cart-section-wrapper").dataset.sectionId;
  shopifyReloadSection(init, sectionId);
  function init() {
    let removeBtns = document.querySelectorAll(".cart__item .remove__qlt");
    let addBtns = document.querySelectorAll(".cart__item .add__qlt");
    async function handleAddClick(type, target, event) {
      event.preventDefault();
      const lineIndex = target.closest(".cart__item.jsLineItem").dataset.lineIndex;
      const quantityInput = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .quantity__input`);
      const sectionId2 = quantityInput.getAttribute("data-sections");
      const variantId = quantityInput.getAttribute("data-key").split(":")[0];
      let newQuantity = 0;
      switch (type) {
        case "add":
          newQuantity = parseInt(quantityInput.getAttribute("value")) + 1;
          break;
        case "remove":
          newQuantity = parseInt(quantityInput.getAttribute("value")) - 1;
          break;
        default:
          break;
      }
      const options = {
        variantId,
        newQuantity,
        sectionId: sectionId2
      };
      const data = await fetchAPIUpdateItemCart(options);
      const result = data.sections[sectionId2];
      updateInfoCartPage(result, lineIndex);
    }
    addBtns.forEach(function(addBtn) {
      addBtn.addEventListener("click", (event) => handleAddClick("add", event.target, event));
    });
    removeBtns.forEach(function(removeBtn) {
      removeBtn.addEventListener("click", (event) => handleAddClick("remove", event.target, event));
    });
  }
})();
