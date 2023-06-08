(() => {
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
      if (event.target.classList.contains("jsViewCart")) {
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
    });
  });
})();
