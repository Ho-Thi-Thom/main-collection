(() => {
  // app/scripts/common/product/product-description-service.js
  function createActiveBodyDesktop(id) {
    const targetElement = document.querySelector(`.tab__panel-content.jsBodyTab[data-id="${id}"]`);
    document.querySelector(".tab__panel-content.jsBodyTab.active")?.classList.remove("active");
    targetElement?.classList.add("active");
    const targetHeader = document.querySelector(`.jsNavTabDesktop[data-id="${id}"]`);
    document.querySelector(".jsNavTabDesktop.active")?.classList.remove("active");
    targetHeader?.classList.add("active");
  }
  function createActiveBodyMobile(id) {
    const targetElement = document.querySelector(`.jsBodyTabMobile[data-id="${id}"]`);
    const targetHeader = document.querySelector(`.jsNavTabMobile[data-id="${id}"]`);
    if (targetHeader.classList.contains("active")) {
      targetElement.classList.remove("active");
      targetHeader.classList.remove("active");
    } else {
      targetHeader.classList.add("active");
      targetElement.classList.add("active");
    }
  }

  // app/scripts/product-description.js
  var headerList = document.querySelectorAll(".jsNavTabDesktop");
  var headerListMobile = document.querySelectorAll(".jsNavTabMobile");
  if (headerList.length > 0) {
    const idFirstHeader = headerList[0].dataset.id;
    createActiveBodyDesktop(idFirstHeader);
    headerList.forEach((header) => {
      header.addEventListener("click", () => {
        const id = header.dataset.id;
        createActiveBodyDesktop(id);
      });
    });
  }
  if (headerListMobile.length > 0) {
    headerListMobile.forEach((header) => {
      header.addEventListener("click", () => {
        const id = header.dataset.id;
        createActiveBodyMobile(id);
      });
      const mobileTab = header.nextElementSibling;
      mobileTab.style.setProperty("--height", mobileTab.scrollHeight + "px");
      const obsever = new MutationObserver(() => {
        mobileTab.style.setProperty("--height", mobileTab.scrollHeight + "px");
      });
      obsever.observe(mobileTab, { subtree: true, childList: true });
    });
  }
})();
