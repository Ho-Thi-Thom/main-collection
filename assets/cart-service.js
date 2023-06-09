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
})();
