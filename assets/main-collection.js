(() => {
  // app/scripts/common/collection/service.js
  function collectionService() {
    function loading2(target) {
      target.innerHTML = "Loading...";
    }
    function hiddenLoading2(target) {
      target.innerHTML = "";
    }
    function createUrl2(callback, initParam) {
      const urlSearchParams = new URLSearchParams(initParam);
      callback(urlSearchParams);
      return window.location.pathname + "?" + urlSearchParams.toString();
    }
    function createUrlFilter2(callback, search) {
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
    function updateUrl2(url, sectionId) {
      url += url.includes("?") ? "&" : "?";
      return url += `section_id=${sectionId}`;
    }
    function getApi2(url, options) {
      return fetch(url, options).then((res) => res.text()).then((data) => _extract(data));
    }
    function appendProduct2(elements) {
      let listProduct = document.querySelector("#collection__products");
      elements.querySelectorAll("#collection__products > *")?.forEach((element) => {
        listProduct?.appendChild(element);
      });
    }
    function setProduct2(element) {
      let listProduct = document.querySelector("#collection__products");
      if (element) {
        listProduct.parentNode.replaceChild(element, listProduct);
        listProduct = element;
      }
    }
    function updateCount2(element) {
      let productCount = document.querySelector(".product_count");
      if (element) {
        productCount.parentNode.replaceChild(element, productCount);
      }
    }
    function updateShowing2(element) {
      let showing = document.querySelector(".collection__toolbar-filter-showing");
      if (element) {
        showing.parentNode.replaceChild(element, showing);
      }
    }
    function updatePointInfinity2(element, infinityFuc) {
      let infinityPoint = document.querySelector("#infinity_point");
      if (element) {
        infinityPoint.parentNode.replaceChild(element, infinityPoint);
        infinityFuc(element);
      }
    }
    function updatePaginate2(element, paginateFuc) {
      let paginate2 = document.querySelector(".paginate");
      if (element) {
        paginate2.parentNode.replaceChild(element, paginate2);
        paginateFuc(document.querySelectorAll(".paginate_link[data-url]"));
      }
    }
    function _extract(data) {
      const div = document.createElement("div");
      div.innerHTML = data;
      return {
        getElementProduct() {
          return div.querySelector("#collection__products");
        },
        getProductCount() {
          return div.querySelector(".product_count");
        },
        getElementPointInfinity() {
          return div.querySelector("#infinity_point");
        },
        getPaginate() {
          return div.querySelector(".paginate");
        },
        getElementShowing() {
          return div.querySelector(".collection__toolbar-filter-showing");
        }
      };
    }
    const services = {
      loading: loading2,
      hiddenLoading: hiddenLoading2,
      getApi: getApi2,
      appendProduct: appendProduct2,
      setProduct: setProduct2,
      updateCount: updateCount2,
      updateShowing: updateShowing2,
      updatePointInfinity: updatePointInfinity2,
      createUrl: createUrl2,
      updatePaginate: updatePaginate2,
      createUrlFilter: createUrlFilter2,
      updateUrl: updateUrl2
    };
    return services;
  }

  // app/scripts/common/collection/collection-function.js
  var { loading, createUrl, hiddenLoading, getApi, appendProduct, setProduct, updateCount, updateShowing, updatePointInfinity, updatePaginate, createUrlFilter, updateUrl } = collectionService();
  function infinity(infinityPoint) {
    if (infinityPoint) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const url = target.dataset.url;
            const sectionId = target.dataset.sectionId;
            try {
              let callback = function(searchParams) {
                searchParams.set("section_id", sectionId);
              };
              const _url = url ? createUrl(callback, url.split("?")[1]) : null;
              if (_url == null) {
                observer.disconnect();
                return;
              }
              loading(target);
              getApi(_url).then((data) => {
                const infinityPoint2 = data.getElementPointInfinity();
                appendProduct(data.getElementProduct());
                updatePointInfinity(infinityPoint2, infinity);
                updateShowing(data.getElementShowing());
              }).finally(() => {
                hiddenLoading(target);
              });
            } catch (error) {
              console.error(error);
            }
          }
        });
      });
      observer.observe(infinityPoint);
    }
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
          updatePointInfinity(data.getElementPointInfinity(), infinity);
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
            updatePointInfinity(data2.getElementPointInfinity(), infinity);
            updatePaginate(data2.getPaginate(), paginate);
            updateShowing(data2.getElementShowing());
          });
        });
      });
    }
  }
  async function filterForm(filterForms) {
    if (filterForms) {
      filterForms.forEach((input) => {
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
            updateCount(data.getProductCount());
            updatePaginate(data.getPaginate(), paginate);
            updateShowing(data.getElementShowing());
            updatePointInfinity(data.getElementPointInfinity(), infinity);
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
              updateCount(data.getProductCount());
              updatePointInfinity(data.getElementPointInfinity(), infinity);
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
  function paginate(paginateLinks) {
    if (paginateLinks) {
      paginateLinks.forEach((paginateLink) => {
        paginateLink.addEventListener("click", (event) => {
          const target = event.currentTarget;
          const url = target.dataset.url;
          const sectionId = target.dataset.sectionId;
          function callback(searchParams) {
            searchParams.set("section_id", sectionId);
          }
          const _url = createUrl(callback, url.split("?")[1]);
          getApi(_url).then((data) => {
            setProduct(data.getElementProduct());
            updatePaginate(data.getPaginate(), paginate);
            updateShowing(data.getElementShowing());
          });
        });
      });
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

  // app/scripts/main-collection.js
  init();
  document.addEventListener("shopify:section:load", init);
  function init() {
    const infinityPoint = document.querySelector("#infinity_point");
    const sort_by = document.querySelector("#sort_by");
    const filterForms = document.querySelectorAll('input[type="checkbox"]');
    const filterPrice2 = document.querySelectorAll('input[type="number"]');
    const paginateLinks = document.querySelectorAll(".paginate_link[data-url]");
    const show2 = document.querySelector("#show");
    infinity(infinityPoint);
    sortBy(sort_by);
    filterForm(filterForms);
    filterPrice(filterPrice2);
    paginate(paginateLinks);
    show(show2);
    addEventButtonFilter();
  }
})();
