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

  // app/scripts/utils.js
  function setValuePopupInfo(options) {
    const popupInfo = document.querySelector("#popup-info");
    const titleElm = document.querySelector("#popup-info .title");
    const contentElm = document.querySelector("#popup-info .wrapper-content");
    const { type, title, textContent } = options;
    titleElm.setAttribute("data-type", type);
    titleElm.innerHTML = title.trim();
    contentElm.innerHTML = textContent.trim();
    popupInfo.classList.add("active");
    debounce(closePopup2, 1e3)();
  }
  function closePopup2() {
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

  // app/scripts/product-card.js
  window.addEventListener("DOMContentLoaded", function() {
    const body = document.querySelector("body");
    body.addEventListener("click", (event) => {
      if (event.target.classList.contains("jsAddToCart")) {
        event.preventDefault();
        const variantId = event.target.dataset.firstVariant;
        let data = {
          items: [
            {
              id: variantId,
              quantity: 1
            }
          ]
        };
        addToCart(data);
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
    const popup = document.querySelector("#popup-product-item");
    const quickView = div.querySelector(".dialog__quick-view");
    popup.querySelector(".content").appendChild(quickView);
    openPopup();
  }
})();
