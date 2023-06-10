(() => {
  // app/scripts/cart-service.js
  function updateInfoCartPage(data, lineIndex) {
    const div = document.createElement("div");
    div.innerHTML = data;
    const liElement = document.querySelector(`li.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
    const liElementNew = div.querySelector(`li.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
    const inputElementNew = liElementNew.querySelector(".quantity__input");
    const jsLineUpdatesOld = liElement.querySelectorAll(".jsLineUpdate");
    const jsLineUpdatesNew = liElementNew.querySelectorAll(".jsLineUpdate");
    jsLineUpdatesOld.forEach((item, index) => {
      item.parentNode.replaceChild(jsLineUpdatesNew[index], item);
    });
    return inputElementNew;
  }
  function checkMaxCartPage() {
    const listItemCart = document.querySelectorAll(".jsLineItem");
    listItemCart.forEach((line) => {
      const input = line.querySelector(".quantity__input");
      const add__qlt = line.querySelector(".add__qlt");
      checkMaxLine(input, add__qlt);
    });
  }
  function checkMaxLine(elmInput, elmAdd) {
    const currentValue = parseInt(elmInput.getAttribute("value"));
    const maxValue = parseInt(elmInput.getAttribute("max"));
    if (currentValue >= maxValue) {
      elmAdd.setAttribute("disabled", "");
    } else {
      if (elmAdd.hasAttribute("disabled")) {
        elmAdd.removeAttribute("disabled");
      }
    }
  }
})();
