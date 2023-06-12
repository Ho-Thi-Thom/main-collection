(() => {
  // app/scripts/cart-service.js
  function updateInfoCartPage(data, lineIndex) {
    const div = document.createElement("div");
    div.innerHTML = data;
    const liElement = document.querySelector(`li.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
    const liElementNew = div.querySelector(`li.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
    const jsLineUpdatesOld = liElement.querySelectorAll(".jsLineUpdate");
    const jsLineUpdatesNew = liElementNew.querySelectorAll(".jsLineUpdate");
    jsLineUpdatesOld.forEach((item, index) => {
      item.parentNode.replaceChild(jsLineUpdatesNew[index], item);
    });
  }
  function updateDataCart(note) {
    fetch("/cart/update.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ note })
    });
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

  // app/scripts/utils.js
  function createUrlCustom(intURl = "", initParam = {}, callback) {
    const urlSearchParams = new URLSearchParams(initParam);
    if (callback && typeof callback === "function") {
      callback(urlSearchParams);
    }
    return intURl ? intURl + "?" + urlSearchParams.toString() : window.location.pathname + "?" + urlSearchParams.toString();
  }
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
  function debounce(fn, delay) {
    var timeoutID = null;
    return function() {
      clearTimeout(timeoutID);
      var args = arguments;
      var that = this;
      timeoutID = setTimeout(function() {
        fn.apply(that, args);
      }, delay);
    };
  }

  // app/scripts/cart.js
  var sectionId = document.querySelector(".cart-section-wrapper").dataset.sectionId;
  shopifyReloadSection(init, sectionId);
  function init() {
    let removeBtns = document.querySelectorAll(".cart__item .remove__qlt");
    let addBtns = document.querySelectorAll(".cart__item .add__qlt");
    function validateValue(value, max, min) {
      value = parseInt(value);
      max = parseInt(max);
      min = parseInt(min);
      return Math.max(Math.min(value, max), min);
    }
    function trigger(elements = [], getNewValue) {
      if (!elements || elements.length === 0 || !getNewValue || typeof getNewValue !== "function") {
        return;
      }
      elements.forEach((element) => {
        let timeout = null;
        element.addEventListener("click", (event) => {
          const lineIndex = event.target.closest(".cart__item.jsLineItem").dataset.lineIndex;
          const quantityInput = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .quantity__input`);
          if (timeout) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(async () => {
            const newQuantity = quantityInput.value;
            const sectionId2 = quantityInput.getAttribute("data-sections");
            const variantId = quantityInput.getAttribute("data-key");
            const options = {
              variantId,
              newQuantity,
              sectionId: sectionId2
            };
            try {
              const data = await fetchAPIUpdateItemCart(options);
              const result = data.sections[sectionId2];
              updateInfoCartPage(result, lineIndex);
            } catch (err) {
            }
          }, 1e3);
        });
      });
    }
    trigger([...addBtns, ...removeBtns], (value) => value + 1);
    trigger(removeBtns, (value) => value - 1);
    let inputs = document.querySelectorAll(".cart__item .quantity__input");
    inputs.forEach(function(input) {
      input.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
        }
      });
      input.addEventListener("input", debounce(async (event) => {
        const lineIndex = event.target.closest(".cart__item.jsLineItem").dataset.lineIndex;
        const quantityInput = event.target;
        const newQuantity = validateValue(quantityInput.value, quantityInput.getAttribute("max"), quantityInput.getAttribute("min"));
        quantityInput.value = newQuantity;
        const variantId = quantityInput.getAttribute("data-key");
        const options = {
          variantId,
          newQuantity,
          sectionId
        };
        try {
          const data = await fetchAPIUpdateItemCart(options);
          const result = data.sections[sectionId];
          updateInfoCartPage(result, lineIndex);
        } catch (err) {
        }
      }, 2e3));
    });
    const accordionItems = document.querySelectorAll(".accordion-initialized");
    accordionItems.forEach(function(accordionItem) {
      const span = accordionItem.querySelector(".accordion-trigger");
      const formNote = accordionItem.querySelector(".cart__form-note");
      span.addEventListener("click", function() {
        formNote.classList.toggle("active");
      });
    });
    const textarea = document.getElementById("cart-note");
    const debouncedFetch = debounce(() => updateDataCart(textarea.value), 2e3);
    textarea.addEventListener("input", debouncedFetch);
    const elmShippingRates = document.querySelector(".jsShippingRates");
    const url = elmShippingRates.dataset.url;
    const formShipping = document.querySelector(".shipping-form");
    formShipping.addEventListener("submit", (event) => {
      event.preventDefault();
      const productFormData = Object.fromEntries(new FormData(event.target).entries());
      const newUrl = createUrlCustom(url, productFormData);
      fetch(newUrl).then((res) => {
        console.log("check", res);
      });
    });
  }
})();
