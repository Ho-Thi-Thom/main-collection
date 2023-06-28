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
  async function fetchDataCart(sectionId2) {
    try {
      const response = await fetch(window.location.pathname + `?section_id=${sectionId2}`);
      const data = await response.text();
      return data;
    } catch (error) {
      return error;
    }
  }
  async function updateCartPopup() {
    const elementPopup = document.querySelector(".jsCartPopup");
    const sectionId2 = elementPopup.dataset.sectionId;
    const data = await fetchDataCart(sectionId2);
    const div = document.createElement("div");
    div.innerHTML = data;
    const cartPopup = div.querySelector(".jsCartPopup");
    const elements = cartPopup.querySelectorAll(".jsPopupUpdate");
    const oldElement = document.querySelectorAll(".jsCartPopup .jsPopupUpdate");
    oldElement.forEach((item, index) => {
      item.parentNode.replaceChild(elements[index], item);
    });
    return true;
  }

  // app/scripts/common/utils/utils.js
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
  function setValuePopupInfo(options) {
    const popupInfo = document.querySelector("#popup-info");
    const titleElm = document.querySelector("#popup-info .title");
    const contentElm = document.querySelector("#popup-info .wrapper-content");
    const { type, title, textContent } = options;
    titleElm.setAttribute("data-type", type);
    titleElm.innerHTML = title.trim();
    contentElm.innerHTML = textContent.trim();
    popupInfo.classList.add("active");
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

  // app/scripts/common/cart/cart-service.js
  function updateInfoCartPage(data, lineIndex, checkRemove2, isCheckPopupEmpty = false) {
    const div = document.createElement("div");
    div.innerHTML = data;
    const liElement = document.querySelector(`li.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
    if (!checkRemove2) {
      const liElementNew = div.querySelector(`li.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
      const jsLineUpdatesOld = liElement.querySelectorAll(".jsLineUpdate");
      const jsLineUpdatesNew = liElementNew.querySelectorAll(".jsLineUpdate");
      jsLineUpdatesOld.forEach((item, index) => {
        item.parentNode.replaceChild(jsLineUpdatesNew[index], item);
      });
    } else {
      if (isCheckPopupEmpty) {
      } else {
        liElement.remove();
      }
    }
    const jsCartUpdateOld = document.querySelectorAll(".js-cart-update");
    const jsCartUpdateNew = div.querySelectorAll(".js-cart-update");
    jsCartUpdateOld.forEach((item, index) => {
      item.parentNode.replaceChild(jsCartUpdateNew[index], item);
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
  function checkMax(input, type, lineIndex) {
    const btnAdd = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .add__qlt`);
    switch (type) {
      case "add":
        if (+input.value === +input.max) {
          btnAdd.disabled = true;
        }
        break;
      case "remove":
        btnAdd.disabled = false;
        break;
      default:
        break;
    }
  }
  function checkListCart() {
    const liElements = document.querySelectorAll(".jsLineItem");
    liElements.forEach((liElement) => {
      const inputElement = liElement.querySelector(".quantity__input");
      const maxValue = parseInt(inputElement.getAttribute("max"));
      const addButton = liElement.querySelector(".add__qlt");
      if (inputElement.value === maxValue.toString()) {
        addButton.disabled = true;
      } else {
        addButton.disabled = false;
      }
    });
  }
  async function countItemCart() {
    try {
      const response = await fetch(window.Shopify.routes.root + "cart.js");
      const data = await response.json();
      return data.item_count;
    } catch (error) {
      return error;
    }
  }
  async function updateCountCart() {
    try {
      const count = await countItemCart();
      const elm = document.querySelector(".jsCountItemCart");
      elm.textContent = count;
      return count;
    } catch (error) {
      console.error(error);
    }
  }

  // app/scripts/cart.js
  var sectionId = document.querySelector(".cart-section-wrapper")?.dataset.sectionId;
  if (sectionId) {
    shopifyReloadSection(initCartPage, sectionId);
  }
  function initCartPage(isSipping = true, isPopupCart = false) {
    const removeBtns = document.querySelectorAll(".cart__item .remove__qlt");
    const addBtns = document.querySelectorAll(".cart__item .add__qlt");
    const btnRemoves = document.querySelectorAll(".btn-remove");
    checkListCart();
    trigger(btnRemoves);
    trigger([...addBtns, ...removeBtns]);
    function trigger(elements = []) {
      if (!elements || elements.length === 0) {
        return;
      }
      elements.forEach((element) => {
        let timeout = null;
        element.addEventListener("click", (event) => {
          const elm = event.target;
          const lineIndex = elm.closest(".cart__item.jsLineItem").dataset.lineIndex;
          const quantityInput = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .quantity__input`);
          if (elm.classList.contains("add__qlt")) {
            quantityInput.stepUp();
            checkMax(quantityInput, "add", lineIndex);
          }
          if (elm.classList.contains("remove__qlt")) {
            quantityInput.stepDown();
            checkMax(quantityInput, "remove", lineIndex);
          }
          let newQuantity = quantityInput.value;
          const checkRemoveItem = elm.classList.contains("btn-remove");
          if (checkRemoveItem) {
            newQuantity = 0;
          }
          if (timeout) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(async () => {
            quantityInput.value;
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
              const cartCount = await updateCountCart();
              if (cartCount) {
                updateInfoCartPage(result, lineIndex, checkRemove = checkRemoveItem);
              } else {
                if (isPopupCart) {
                  updateCartPopup();
                } else {
                  location.reload();
                }
              }
            } catch (err) {
              console.log("Error", err);
            }
          }, 1e3);
        });
      });
    }
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
        const variantId = quantityInput.getAttribute("data-key");
        const options = {
          variantId,
          newQuantity: quantityInput.value,
          sectionId
        };
        try {
          const data = await fetchAPIUpdateItemCart(options);
          const result = data.sections[sectionId];
          updateInfoCartPage(result, lineIndex);
        } catch (err) {
          const options2 = {
            type: "error",
            title: "422",
            textContent: `Only ${quantityInput.getAttribute("max")} products in stock`
          };
          setValuePopupInfo(options2);
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
    const debouncedFetch = debounce(() => updateDataCart(textarea.value), 500);
    textarea.addEventListener("input", debouncedFetch);
    if (isSipping) {
      handleShipping();
    }
  }
  function handleShipping() {
    const selectField = document.getElementsByName("shipping_address[country]")[0];
    selectField.addEventListener("change", function(event) {
      const selectedOption = selectField.options[selectField.selectedIndex];
      const province = selectedOption.getAttribute("data-provinces");
      const formField = document.querySelector(".jsProvince");
      const selectProvince = formField.querySelector("[name='shipping_address[province]']");
      if (JSON.parse(province).length) {
        JSON.parse(province).forEach(([value, label]) => {
          const option = document.createElement("option");
          option.value = value;
          option.text = label;
          selectProvince.appendChild(option);
        });
        formField.style.display = "block";
      } else {
        formField.style.display = "none";
      }
    });
    const elmShippingRates = document.querySelector(".jsShippingRates");
    const url = elmShippingRates.dataset.url;
    const formShipping = document.querySelector(".shipping-form");
    formShipping.addEventListener("submit", (event) => {
      event.preventDefault();
      const productFormData = Object.fromEntries(new FormData(event.target).entries());
      const btnState = document.querySelector(".jsButtonShipping");
      btnState.classList.add("loading");
      const newUrl = createUrlCustom(url, productFormData);
      let n = document.querySelector(".js-shipping-result");
      let i = document.querySelector("template").content.firstElementChild;
      let s = document.createElement("div");
      n.innerHTML = "";
      fetch(newUrl).then((res) => res.json()).then((data) => {
        const _data = data.shipping_rates;
        let t = theme.strings.notFoundShippingRate;
        if (_data && _data.length > 1) {
          t = theme.strings.manyShippingRate.replace("{{ number }}", _data.length);
        } else if (_data && _data.length === 1) {
          t = theme.strings.oneShippingRate;
        }
        document.querySelector(".js-response-title").innerHTML = t;
        if (_data) {
          _data.forEach((item) => {
            s.innerHTML = i.outerHTML;
            s.querySelector(".shipping-name").innerHTML = item.name;
            s.querySelector(".shipping-cost").textContent = item.price;
            n.insertAdjacentHTML("beforeend", s.innerHTML);
          });
        }
        btnState.classList.remove("loading");
      });
    });
  }
})();
