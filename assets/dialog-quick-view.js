(() => {
  // app/scripts/utils.js
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
  function updateUrl(url, sectionId) {
    url += url.includes("?") ? "&" : "?";
    return url += `section_id=${sectionId}`;
  }
  function uppercaseFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
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
    debounce(closePopup, 1e3)();
  }
  function closePopup() {
    const popupInfo = document.querySelector("#popup-info");
    popupInfo.classList.remove("active");
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
  function addToCart(data) {
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
            setValuePopupInfo(options);
          });
          break;
        case 404:
          break;
        case 422:
          res.json().then((data2) => {
            const options = {
              type: "error",
              title: "422",
              textContent: data2.description
            };
            setValuePopupInfo(options);
          });
          break;
        default:
          break;
      }
    }).catch((error) => {
      console.log("Error:", error);
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
    } catch (error) {
      console.error(error);
    }
  }

  // app/scripts/dialog-quick-view-service.js
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
    console.log(url);
    if (url) {
      fetch(url).then((res) => res.text()).then((data) => {
        const div = document.createElement("div");
        div.innerHTML = data;
        console.log(div);
        updateElementPrice(div.querySelector(".compare-price"), div.querySelector(".price"));
        updateElementVariantInventory(div.querySelector(".variant-inventory"));
        updateElementAddToCart(div.querySelector(".btn-add"));
        updateElementSKU(div.querySelector(".product-sku"));
        updateElementInput(div.querySelector(".jsSubmit"));
      });
    } else {
      updateElementAddToCart(null, true);
      const options = {
        type: "warring",
        title: "Not found",
        textContent: "Variant does not exist"
      };
      setValuePopupInfo(options);
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

  // app/scripts/dialog-quick-view.js
  function initQuickView(newUrl = null) {
    const formEl = document.querySelector(".jsProductForm");
    const productOptions = getScript(document.getElementById("popup_product_options"), []);
    const productData = getScript(document.getElementById("popup-variants"), []);
    const variants = productData.variants;
    const { slider, cleanup } = runSlider();
    const removeBtn = document.querySelector(".remove__qlt");
    const addBtn = document.querySelector(".add__qlt");
    const quantityInput = document.querySelector(".quantity__input");
    const formProduct = document.getElementById("jsFormProduct");
    formEl.addEventListener("change", function(event) {
      if (event.target.id !== "cart-condition") {
        const titles = variants.filter((variant) => Object.values(variant).includes(event.target.value)).map((product) => product.title);
        onVariantChange(() => getUrl(formEl.dataset.sectionId, slider));
        updateCssOption(titles, productOptions, event.target.name);
      }
    });
    function getUrl(sectionId, slider2) {
      const selects = document.querySelectorAll(".js-variant-change");
      const radios = document.querySelectorAll(".js-radio");
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
      return updateUrl(url, sectionId);
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
    addToCart2();
    checkPolicy();
    function addToCart2() {
      if (formProduct && formProduct.dataset.type === "b") {
        formProduct.addEventListener("submit", function(event) {
          event.preventDefault();
          const productFormData = Object.fromEntries(new FormData(event.target).entries());
          let formData = {
            "items": [productFormData]
          };
          addToCart(formData);
        });
      }
    }
  }
})();
