(() => {
  // app/scripts/common/product/product-description-service.js
  function createActive(id) {
    const targetElement = document.querySelector(`.jsBodyTab[data-id="${id}"]`);
    const targetHeader = document.querySelector(`.jsNavTab[data-id="${id}"]`);
    document.querySelector(".jsNavTab.active")?.classList.remove("active");
    targetHeader?.classList.add("active");
    document.querySelector(".jsBodyTab.active")?.classList.remove("active");
    targetElement?.classList.add("active");
  }
  function createActive1(id) {
    const targetElement = document.querySelector(`.jsBodyTab1[data-id="${id}"]`);
    const targetHeader = document.querySelector(`.jsNavTab1[data-id="${id}"]`);
    if (targetHeader.classList.contains("active")) {
      targetElement.classList.remove("active");
      targetHeader.classList.remove("active");
    } else {
      targetHeader.classList.add("active");
      targetElement.classList.add("active");
    }
  }

  // app/scripts/product-description.js
  var headerList = document.querySelectorAll(".jsNavTab");
  var headerList1 = document.querySelectorAll(".jsNavTab1");
  var bodyList = document.querySelectorAll(".jsBodyTab");
  var bodyList1 = document.querySelectorAll(".jsBodyTab1");
  if (headerList.length > 0) {
    const idFirstHeader = headerList[0].dataset.id;
    createActive(idFirstHeader);
    headerList.forEach((header) => {
      header.addEventListener("click", () => {
        const id = header.dataset.id;
        createActive(id);
      });
    });
  }
  if (headerList1.length > 0) {
    const idFirstHeader = headerList1[0].dataset.id;
    createActive1(idFirstHeader);
    headerList1.forEach((header) => {
      header.addEventListener("click", () => {
        const id = header.dataset.id;
        createActive1(id);
      });
    });
  }
})();
