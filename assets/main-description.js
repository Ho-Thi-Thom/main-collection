(() => {
  // app/scripts/main-description.js
  var headerList = document.querySelectorAll(".jsNavTab");
  var bodyList = document.querySelectorAll(".jsBodyTab");
  function createActive(header, bodyList2, index) {
    const body = bodyList2[index];
    document.querySelector(".jsNavTab.active")?.classList.remove("active");
    header.classList.add("active");
    document.querySelector(".jsBodyTab.active")?.classList.remove("active");
    body?.classList.add("active");
  }
  if (headerList) {
    const initIndex = 0;
    const header = headerList[initIndex];
    createActive(header, bodyList, initIndex);
    headerList.forEach((header2, index) => {
      header2.addEventListener("click", () => createActive(header2, bodyList, index));
    });
  }
})();
