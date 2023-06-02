(() => {
  // app/scripts/cart-item.js
  var removeBtns = document.querySelectorAll(".cart__item .remove__qlt");
  var addBtns = document.querySelectorAll(".cart__item .add__qlt");
  var quantityInputs = document.querySelectorAll(".cart__item .quantity__input");
  removeBtns.forEach(function(removeBtn) {
    removeBtn.addEventListener("click", function() {
      const lineIndex = this.closest(".cart__item.jsLineItem").dataset.lineIndex;
      console.log(lineIndex);
      const quantityInput = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .quantity__input`);
      let currentValue = parseInt(quantityInput.value);
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
      }
    });
  });
  addBtns.forEach(function(addBtn) {
    addBtn.addEventListener("click", function() {
      const lineIndex = this.closest(".cart__item.jsLineItem").dataset.lineIndex;
      const quantityInput = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .quantity__input`);
      console.log(lineIndex);
      let currentValue = parseInt(quantityInput.value);
      quantityInput.value = currentValue + 1;
    });
  });
  quantityInputs.forEach(function(quantityInput) {
    quantityInput.addEventListener("keydown", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
      }
    });
  });
})();
