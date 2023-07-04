(() => {
  // app/scripts/common/utils/utils.js
  function createUrl(callback, initParam) {
    const urlSearchParams = new URLSearchParams(initParam);
    if (callback && typeof callback === "function") {
      callback(urlSearchParams);
    }
    return window.location.pathname + "?" + urlSearchParams.toString();
  }

  // app/scripts/common/search/main-search-service.js
  function paginate(paginateLinks2) {
    if (paginateLinks2) {
      paginateLinks2.forEach((paginateLink) => {
        paginateLink.addEventListener("click", async (event) => {
          const target = event.currentTarget;
          const url = target.dataset.url;
          const sectionId = target.dataset.sectionId;
          function callback(searchParams) {
            searchParams.set("section_id", sectionId);
          }
          const _url = createUrl(callback, url.split("?")[1]);
          getApi(_url).then((data) => {
            updatePaginate(data.getPaginate(), paginate);
            setProduct(data.getElementProduct());
            updateShowing(data.getElementShowing());
          });
        });
      });
    }
  }
  function getApi(url, options) {
    return fetch(url, options).then((res) => res.text()).then((data) => _extract(data));
  }
  function _extract(data) {
    const div = document.createElement("div");
    div.innerHTML = data;
    return {
      getElementProduct() {
        return div.querySelector(".search__products");
      },
      getPaginate() {
        return div.querySelector(".paginate");
      },
      getElementShowing() {
        return div.querySelector(".collection__toolbar-filter-showing");
      }
    };
  }
  function updatePaginate(element, paginateFuc) {
    let paginate2 = document.querySelector(".paginate");
    if (element) {
      paginate2.parentNode.replaceChild(element, paginate2);
      paginateFuc(document.querySelectorAll(".paginate_link[data-url]"));
    }
  }
  function setProduct(element) {
    let listProduct = document.querySelector(".search__products");
    if (element) {
      listProduct.parentNode.replaceChild(element, listProduct);
      listProduct = element;
    }
  }
  function addEventButtonFilter() {
    const filter = document.querySelector(".collection__toolbar__filter");
    const buttons = document.querySelectorAll(".collection__toolbar-filter-btn");
    const buttonDropdowns = document.querySelectorAll(".collection__toolbar-filter-btn.dropdown");
    const buttonSidebars = document.querySelectorAll(".collection__toolbar-filter-btn.sidebar");
    const sidebar = document.querySelector(".collection__toolbar__filter-sidebar");
    const closeSidebarBtn = document.querySelector(".collection__toolbar__filter-sidebar > span");
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const currentState = button.getAttribute("data-state");
        if (!currentState || currentState === "closed") {
          button.setAttribute("data-state", "opened");
          button.setAttribute("aria-expanded", "true");
        } else {
          button.setAttribute("data-state", "closed");
          button.setAttribute("aria-expanded", "false");
        }
        if (closeSidebarBtn) {
          closeSidebarBtn.addEventListener("click", () => {
            sidebar.classList.remove("active");
            button.setAttribute("data-state", "closed");
            button.setAttribute("aria-expanded", "false");
          });
        }
      });
    });
    buttonDropdowns.forEach((button) => {
      button.addEventListener("click", () => {
        if (filter) {
          filter.classList.toggle("active");
        }
      });
    });
    buttonSidebars.forEach((button) => {
      button.addEventListener("click", () => {
        if (sidebar) {
          sidebar.classList.add("active");
        }
      });
    });
  }
  function sortBy(element) {
    if (element) {
      element.addEventListener("change", (event) => {
        const value = event.target.value;
        const sectionId = event.target.dataset.sectionId;
        function callback(searchParams) {
          searchParams.set("sort_by", value);
        }
        let url = createUrl(callback, window.location.href.split("?")[1]);
        history.pushState(null, null, url);
        url = updateUrl(url, sectionId);
        getApi(url).then((data) => {
          setProduct(data.getElementProduct());
          updateShowing(data.getElementShowing());
        });
      });
    }
  }
  function show(showElement) {
    if (showElement) {
      showElement.addEventListener("change", (event) => {
        const value = event.target.value;
        const sectionId = event.target.dataset.sectionId;
        const url = `${window.Shopify.routes.root}cart/update.js`;
        const data = {
          attributes: {
            items_per_page: value
          },
          sections: [sectionId],
          section_url: location.pathname + location.search
        };
        const options = {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json"
          }
        };
        getApi(url, options).then(() => {
          let collectionUrl = location.pathname;
          collectionUrl += location.search;
          collectionUrl += location.search.includes("?") ? "&" : "?";
          collectionUrl += "section_id=" + sectionId;
          getApi(collectionUrl).then((data2) => {
            setProduct(data2.getElementProduct());
            updatePaginate(data2.getPaginate(), paginate);
            updateShowing(data2.getElementShowing());
          });
        });
      });
    }
  }
  async function filterForm(filterForms2) {
    if (filterForms2) {
      filterForms2.forEach((input) => {
        input.addEventListener("change", async (event) => {
          const value = event.target.value;
          const name = event.target.name;
          const sectionId = event.target.dataset.sectionId;
          try {
            let callback = function(checkedValues) {
              if (event.target.checked) {
                if (!checkedValues[name]) {
                  checkedValues[name] = [];
                }
                checkedValues[name].push(value);
              } else {
                if (checkedValues[name]) {
                  checkedValues[name] = checkedValues[name].filter((val) => val !== value);
                }
              }
            };
            let url = createUrlFilter(callback, window.location.search);
            history.pushState(null, null, url);
            url = updateUrl(url, sectionId);
            const data = await getApi(url);
            setProduct(data.getElementProduct());
            updatePaginate(data.getPaginate(), paginate);
            updateShowing(data.getElementShowing());
          } catch (error) {
            console.error(error);
          }
        });
      });
    }
  }
  function filterPrice(filterPriceElement) {
    if (filterPriceElement) {
      const params = { "filter.v.price.gte": 0, "filter.v.price.lte": Number.MAX_SAFE_INTEGER };
      filterPriceElement.forEach((input) => {
        input.addEventListener("change", (event) => {
          const value = event.target.value;
          const name = event.target.name;
          const max = event.target.dataset.max;
          const sectionId = event.target.dataset.sectionId;
          params["filter.v.price.lte"] = max;
          params[name] = value;
          try {
            let callback = function(checkedValues) {
              for (const key in params) {
                checkedValues[key] = [];
                checkedValues[key].push(params[key]);
              }
            };
            const url = createUrlFilter(callback, window.location.search);
            history.pushState(null, null, url);
            const updatedUrl = updateUrl(url, sectionId);
            getApi(updatedUrl).then((data) => {
              setProduct(data.getElementProduct());
              updatePaginate(data.getPaginate(), paginate);
              updateShowing(data.getElementShowing());
            });
          } catch (error) {
            console.error(error);
          }
        });
      });
    }
  }
  function updateShowing(element) {
    let showing = document.querySelector(".collection__toolbar-filter-showing");
    if (element) {
      showing.parentNode.replaceChild(element, showing);
    }
  }
  function createUrlFilter(callback, search) {
    const params = new URLSearchParams(search);
    const checkedValues = {};
    params.forEach(function(value, key) {
      if (!checkedValues[key]) {
        checkedValues[key] = [];
      }
      checkedValues[key].push(value);
    });
    callback(checkedValues);
    const urlParams = new URLSearchParams();
    Object.keys(checkedValues).forEach((name) => {
      checkedValues[name].forEach((value) => {
        urlParams.append(name, value);
      });
    });
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    return newUrl;
  }
  function updateUrl(url, sectionId) {
    url += url.includes("?") ? "&" : "?";
    return url += `section_id=${sectionId}`;
  }

  // app/scripts/main-search.js
  var paginateLinks = document.querySelectorAll(".paginate_link[data-url]");
  var show2 = document.querySelector("#show");
  var sort_by = document.querySelector("#sort_by");
  var filterForms = document.querySelectorAll('input[type="checkbox"]');
  var filterPrice2 = document.querySelectorAll('input[type="number"]');
  init();
  function init() {
    paginate(paginateLinks);
    addEventButtonFilter();
    sortBy(sort_by);
    filterForm(filterForms);
    filterPrice(filterPrice2);
    show(show2);
  }
  document.addEventListener("shopify:section:load", init);
})();
