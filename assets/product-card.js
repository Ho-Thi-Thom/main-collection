(() => {
  // app/scripts/common/utils/utils.js
  function getScript(selector, defaultValue) {
    try {
      return JSON.parse(selector.textContent);
    } catch (error) {
      console.log(error);
      return defaultValue;
    }
  }
  function createUrlCustom(intURl = "", initParam = {}, callback) {
    const urlSearchParams = new URLSearchParams(initParam);
    if (callback && typeof callback === "function") {
      callback(urlSearchParams);
    }
    return intURl ? intURl + "?" + urlSearchParams.toString() : window.location.pathname + "?" + urlSearchParams.toString();
  }
  function createUrl(callback, initParam) {
    const urlSearchParams = new URLSearchParams(initParam);
    if (callback && typeof callback === "function") {
      callback(urlSearchParams);
    }
    return window.location.pathname + "?" + urlSearchParams.toString();
  }
  function updateUrl(url, sectionId2) {
    url += url.includes("?") ? "&" : "?";
    return url += `section_id=${sectionId2}`;
  }
  function uppercaseFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
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
  function addToCart(data, isPopupInfo = true) {
    return new Promise((resolve, reject) => {
      fetch(window.Shopify.routes.root + "cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then((res) => {
        switch (res.status) {
          case 200:
            res.json().then((data2) => {
              const options = {
                type: "success",
                title: "Add to Cart",
                textContent: `Add success "${data2.items[0].product_title}"`
              };
              updateCountCart();
              if (isPopupInfo) {
                setValuePopupInfo(options);
              }
              resolve(true);
            });
            break;
          case 404:
            resolve(false);
            break;
          case 422:
            res.json().then((data2) => {
              const options = {
                type: "error",
                title: "422",
                textContent: data2.description
              };
              setValuePopupInfo(options);
              resolve(false);
            });
            break;
          default:
            resolve(false);
            break;
        }
      }).catch((error) => {
        console.log("Error:", error);
        reject(error);
      });
    });
  }

  // app/scripts/common/utils/dialog-quick-view-service.js
  function runSlider() {
    let slider = null;
    let thumbnailSlider = null;
    let resizeObserver = null;
    let isTablet = null;
    const initializeSlider = () => {
      if (slider) {
        slider.destroy();
      }
      if (thumbnailSlider) {
        thumbnailSlider.destroy();
      }
      const axisValue = isTablet ? "horizontal" : "vertical";
      const sliderContainer = document.querySelector("#customize");
      const thumbnailContainer = document.querySelector("#customize-thumbnails");
      slider = tns({
        container: sliderContainer,
        navContainer: thumbnailContainer || void 0,
        controlsContainer: "#controls",
        items: 1,
        axis: "horizontal",
        autoplay: false,
        autoplayTimeout: 1e3,
        speed: 400,
        mouseDrag: true,
        loop: false,
        controls: true,
        nav: true
      });
      if (thumbnailContainer) {
        thumbnailSlider = tns({
          container: thumbnailContainer,
          items: 3,
          axis: axisValue,
          autoplay: false,
          autoplayTimeout: 1e3,
          speed: 400,
          mouseDrag: true,
          loop: false,
          controls: true,
          controlsContainer: "#customize-controls",
          nav: false
        });
        slider.events.on("indexChanged", function(info) {
          thumbnailSlider.goTo(info.index);
        });
      }
      return slider;
    };
    const handleResize = debounce(() => {
      const newIsTablet = window.matchMedia("(max-width: 1023px)").matches;
      if (isTablet !== null && isTablet !== newIsTablet) {
        isTablet = newIsTablet;
        initializeSlider();
      }
    }, 500);
    const setupResizeObserver = () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      const sliderContainer = document.querySelector("#customize");
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(sliderContainer);
    };
    const cleanup = () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
      }
    };
    const init = () => {
      isTablet = window.matchMedia("(max-width: 1023px)").matches;
      initializeSlider();
      setupResizeObserver();
      window.addEventListener("resize", handleResize);
    };
    init();
    return {
      slider,
      cleanup
    };
  }
  function updateElementPrice(divCompare, divPrice, checkEmpty = false) {
    if (checkEmpty) {
      return;
    }
    const cpPrice = document.querySelector(".compare-price");
    const price = document.querySelector(".price");
    cpPrice.parentNode.replaceChild(divCompare, cpPrice);
    price.parentNode.replaceChild(divPrice, price);
  }
  function updateElementVariantInventory(element, checkEmpty = false) {
    if (checkEmpty) {
      return;
    }
    const variantInventory = document.querySelector(".variant-inventory");
    variantInventory.parentNode.replaceChild(element, variantInventory);
  }
  function updateElementAddToCart(element, checkEmpty = false) {
    const btnAdd = document.querySelector(".btn-add");
    if (checkEmpty) {
      btnAdd.setAttribute("disabled", "");
      const btnAddSpan = btnAdd.querySelector("span");
      btnAdd.setAttribute("data-selected-quantity", 0);
      btnAddSpan.textContent = "Not Available";
      return;
    }
    if (btnAdd && element) {
      const btnAddSpan = btnAdd.querySelector("span");
      const elementSpan = element.querySelector("span");
      if (btnAddSpan && elementSpan) {
        btnAddSpan.parentNode.replaceChild(elementSpan, btnAddSpan);
      }
      const selectedQuantity = element.getAttribute("data-selected-quantity");
      if (selectedQuantity) {
        btnAdd.setAttribute("data-selected-quantity", selectedQuantity);
      }
      if (parseInt(selectedQuantity) === 0) {
        btnAdd.setAttribute("disabled", "true");
      } else {
        const checkbox = document.querySelector(".cart__condition");
        if (checkbox.classList.contains("checked")) {
          btnAdd.removeAttribute("disabled");
        }
      }
    }
  }
  function updateElementSKU(element, checkEmpty = false) {
    if (checkEmpty) {
      return;
    }
    const sku = document.querySelector(".product-sku");
    sku.parentNode.replaceChild(element, sku);
  }
  function updateElementInput(element, checkEmpty = false) {
    if (checkEmpty) {
      return;
    }
    const input = document.querySelector(".jsSubmit");
    input.value = element.value;
  }
  function onVariantChange(getUrl) {
    const url = getUrl();
    if (url) {
      fetch(url).then((res) => res.text()).then((data) => {
        const div = document.createElement("div");
        div.innerHTML = data;
        updateElementPrice(div.querySelector(".compare-price"), div.querySelector(".price"));
        updateElementVariantInventory(div.querySelector(".variant-inventory"));
        updateElementAddToCart(div.querySelector(".btn-add"));
        updateElementSKU(div.querySelector(".product-sku"));
        updateElementInput(div.querySelector(".jsSubmit"));
      });
      setInfoWarning(false);
    } else {
      updateElementAddToCart(null, true);
      setInfoWarning(true);
    }
  }
  function setInfoWarning(options = false) {
    const elementInfo = document.querySelector(".jsProductForm .card-info");
    if (options) {
      elementInfo.classList.remove("visibility-hidden");
    } else {
      elementInfo.classList.add("visibility-hidden");
    }
  }
  function updateCssOption(titles, productOptions, name) {
    name = uppercaseFirstLetter(name);
    const filteredPositions = productOptions.filter((item) => item.name !== name).map((item) => item.position);
    const element = productOptions.find((item) => item.name === name);
    const input = element ? element.position : null;
    const uniqueElements = [...new Set(titles)];
    const result = uniqueElements.reduce((acc, item) => {
      const parts = item.split(" / ");
      const filteredParts = parts.filter((_, index) => index !== input - 1);
      filteredParts.forEach((part, index) => {
        if (!acc[index]) {
          acc[index] = [];
        }
        if (!acc[index].includes(part)) {
          acc[index].push(part);
        }
      });
      return acc;
    }, []);
    const mergedArray = filteredPositions.map((element2, index) => [
      element2,
      result[index]
    ]);
    const checkPositions = document.querySelectorAll(".check-position");
    mergedArray.forEach((item) => {
      checkPositions.forEach((element2) => {
        if (item[0] == element2.dataset.position) {
          const inputs = element2.querySelectorAll('input[type="radio"]');
          const options = element2.querySelectorAll("option");
          Array.from(inputs).concat(Array.from(options)).forEach((input2) => {
            const value = input2.value;
            if (!item[1].includes(value)) {
              input2.setAttribute("data-disabled", "true");
            } else {
              input2.setAttribute("data-disabled", "false");
            }
          });
        }
      });
    });
  }
  function getValue(selects, radios) {
    const inputsData = [];
    if (selects) {
      selects.forEach((select) => {
        const options = select.querySelectorAll("option");
        options.forEach((option) => {
          const value = option.value;
          const checked = option.selected;
          if (checked) {
            inputsData.push(value);
          }
        });
      });
    }
    if (radios) {
      radios.forEach((input) => {
        const value = input.value;
        const checked = input.checked;
        if (checked) {
          inputsData.push(value);
        }
      });
    }
    return inputsData;
  }
  function checkPolicy() {
    const checkbox = document.getElementById("cart-condition");
    checkbox.addEventListener("click", function(event) {
      const cartCondition = document.querySelector(".cart__condition");
      const addButton = document.querySelector("button[name='add']");
      if (this.checked) {
        cartCondition.classList.add("checked");
        const selectedQuantity = addButton.getAttribute("data-selected-quantity");
        if (parseInt(selectedQuantity) !== 0) {
          addButton.removeAttribute("disabled");
        }
      } else {
        cartCondition.classList.remove("checked");
        addButton.setAttribute("disabled", "");
      }
    });
  }

  // app/scripts/common/utils/dialog-quick-view.js
  function handleChangeFormProduct(newUrl = null, container = document, runSlider2) {
    const formEl = container.querySelector(".jsProductForm");
    const productOptions = getScript(container.querySelector("#popup_product_options"), []);
    const productData = getScript(container.querySelector("#popup-variants"), []);
    const variants = productData.variants;
    const { slider, cleanup } = runSlider2();
    const removeBtn = container.querySelector(".remove__qlt");
    const addBtn = container.querySelector(".add__qlt");
    const quantityInput = container.querySelector(".quantity__input");
    const formProduct = container.querySelector("#jsFormProduct");
    formEl.addEventListener("change", function(event) {
      if (event.target.id !== "cart-condition" && event.target.className !== "quantity__input") {
        const titles = variants.filter((variant) => Object.values(variant).includes(event.target.value)).map((product) => product.title);
        onVariantChange(() => getUrl(formEl.dataset.sectionId, slider));
        updateCssOption(titles, productOptions, event.target.name);
      }
    });
    function getUrl(sectionId2, slider2) {
      const selects = container.querySelectorAll(".js-variant-change");
      const radios = container.querySelectorAll(".js-radio");
      const value = getValue(selects, radios);
      const data = variants.find((variant) => {
        return variant.options.join("/") == value.join("/");
      });
      if (!data) {
        return;
      }
      if (data.featured_image !== null) {
        slider2.goTo(data.featured_image.position - 1);
      }
      let url = "";
      if (newUrl) {
        url = createUrlCustom(newUrl, void 0, function(searchParams) {
          searchParams.set("variant", data.id);
        });
      } else {
        url = createUrl(function(searchParams) {
          searchParams.set("variant", data.id);
        });
        history.pushState(null, null, url);
      }
      return updateUrl(url, sectionId2);
    }
    removeBtn.addEventListener("click", function() {
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
    addBtn.addEventListener("click", function() {
      let currentValue = parseInt(quantityInput.value);
      quantityInput.value = currentValue + 1;
    });
    quantityInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });
    addToCartByForm();
    checkPolicy();
    function addToCartByForm() {
      if (formProduct && formProduct.dataset.type === "b") {
        formProduct.addEventListener("submit", function(event) {
          event.preventDefault();
          const productFormData = Object.fromEntries(new FormData(event.target).entries());
          let formData = {
            "items": [productFormData]
          };
          try {
            addToCart(formData);
          } catch (error) {
            console.log(error);
          }
        });
      }
    }
  }
  function jsDialogQuickView(newUrl, container) {
    handleChangeFormProduct(newUrl, container, runSlider);
  }

  // app/scripts/popup-product-item.js
  function closePopup() {
    const popupProduct = document.querySelector("#popup-product-item");
    popupProduct.classList.remove("active");
    const popupContent = popupProduct.querySelector("#popup-product-item .content");
    popupContent.innerHTML = "";
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

  // app/scripts/product-card.js
  window.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector("body");
    body.addEventListener("click", async (event) => {
      if (event.target.classList.contains("jsAddToCart")) {
        event.preventDefault();
        const productForm = event.target.closest(".jsProductItemForm");
        const productFormData = Object.fromEntries(new FormData(productForm).entries());
        let formData = {
          "items": [productFormData]
        };
        try {
          const checkAddToCart = await addToCart(formData, false);
          if (checkAddToCart) {
            const check = await updateCartPopup();
            if (check) {
              debounce(handelActivePopup(), 500);
              initCartPage(false, true);
            }
          }
        } catch (error) {
          console.log("Error:", error);
        }
      }
      if (event.target.classList.contains("jsQuickView")) {
        event.preventDefault();
        const url = event.target.dataset.urlProductPopup;
        fetchDataPopup(url);
      }
    });
  });
  async function fetchDataPopup(url) {
    const result = await fetch(url);
    const data = await result.text();
    const div = document.createElement("div");
    div.innerHTML = data;
    const popup = document.querySelector("#popup-product-item .popup-content .content");
    const quickView = div.querySelector(".dialog__quick-view");
    popup.innerHTML = "";
    popup.appendChild(quickView);
    const newUrl = url.split("?")[0];
    jsDialogQuickView(newUrl, popup);
    openPopup();
  }
})();
