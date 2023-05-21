(() => {
  // app/scripts/service.js
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
      let showing2 = document.querySelector(".collection__toolbar-filter-showing");
      if (element) {
        showing2.parentNode.replaceChild(element, showing2);
      }
    }
    function updatePointInfinity2(element, infinityFuc2) {
      let infinityPoint2 = document.querySelector("#infinity_point");
      if (element) {
        infinityPoint2.parentNode.replaceChild(element, infinityPoint2);
        infinityFuc2(element);
      }
    }
    function updatePaginate2(element, paginateFuc2) {
      let paginate2 = document.querySelector(".paginate");
      if (element) {
        paginate2.parentNode.replaceChild(element, paginate2);
        paginateFuc2(document.querySelectorAll(".paginate_link[data-url]"));
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
      createUrlFilter: createUrlFilter2
    };
    return services;
  }

  // app/scripts/main-collection.js
  var infinityPoint = document.querySelector("#infinity_point");
  var sortBy = document.querySelector("#sort_by");
  var show = document.querySelector("#show");
  var filterForms = document.querySelectorAll('input[type="checkbox"]');
  var filterPrice = document.querySelectorAll('input[type="number"]');
  var paginateLinks = document.querySelectorAll(".paginate_link[data-url]");
  var showing = document.querySelector(".collection__toolbar-filter-showing");
  var { loading, createUrl, hiddenLoading, getApi, appendProduct, setProduct, updateCount, updateShowing, updatePointInfinity, updatePaginate, createUrlFilter } = collectionService();
  infinityFuc(infinityPoint);
  function infinityFuc(infinityPoint2) {
    if (infinityPoint2) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let callback = function(searchParams) {
              searchParams.set("section_id", sectionId);
            };
            const target = entry.target;
            const url = target.dataset.url;
            const sectionId = target.dataset.sectionId;
            const _url = url ? createUrl(callback, url.split("?")[1]) : null;
            if (_url == null) {
              observer.disconnect();
              return;
            }
            loading(target);
            getApi(_url).then((data) => {
              const infinityPoint3 = data.getElementPointInfinity();
              appendProduct(data.getElementProduct());
              updatePointInfinity(infinityPoint3, infinityFuc);
              updateShowing(data.getElementShowing());
            }).finally(() => {
              hiddenLoading(target);
            });
          }
        });
      });
      observer.observe(infinityPoint2);
    }
  }
  function _sortBy(event) {
    const value = event.target.value;
    const sectionId = event.target.dataset.sectionId;
    function callback(searchParams) {
      searchParams.set("sort_by", value);
    }
    let url = createUrl(callback, window.location.href.split("?")[1]);
    history.pushState(null, null, url);
    url += url.includes("?") ? "&" : "?";
    url += `section_id=${sectionId}`;
    getApi(url).then((data) => {
      setProduct(data.getElementProduct());
      updatePointInfinity(data.getElementPointInfinity(), infinityFuc);
      updateShowing(data.getElementShowing());
    });
  }
  if (sortBy) {
    sortBy.addEventListener("change", _sortBy);
  }
  if (show) {
    show.addEventListener("change", (event) => {
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
          updatePointInfinity(data2.getElementPointInfinity(), infinityFuc);
          updatePaginate(data2.getPaginate(), paginateFuc);
          updateShowing(data2.getElementShowing());
        });
      });
    });
  }
  function filterListAndCheckbox(event) {
    const value = event.target.value;
    const name = event.target.name;
    function callback(checkedValues) {
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
    }
    const url = createUrlFilter(callback, window.location.search);
    history.pushState(null, null, url);
    getApi(url).then((data) => {
      setProduct(data.getElementProduct());
      updateCount(data.getProductCount());
      updatePaginate(data.getPaginate(), paginateFuc);
      updateShowing(data.getElementShowing());
      updatePointInfinity(data.getElementPointInfinity(), infinityFuc);
    });
  }
  if (filterForms) {
    filterForms.forEach((input) => {
      input.addEventListener("change", filterListAndCheckbox);
    });
  }
  function _filterPrice(event, params) {
    const value = event.target.value;
    const name = event.target.name;
    const max = event.target.dataset.max;
    params["filter.v.price.lte"] = max;
    params[name] = value;
    function callback(checkedValues) {
      for (const key in params) {
        checkedValues[key] = [];
        checkedValues[key].push(params[key]);
      }
    }
    const url = createUrlFilter(callback, window.location.search);
    history.pushState(null, null, url);
    getApi(url).then((data) => {
      setProduct(data.getElementProduct());
      updateCount(data.getProductCount());
      updatePointInfinity(data.getElementPointInfinity(), infinityFuc);
      updatePaginate(data.getPaginate(), paginateFuc);
      updateShowing(data.getElementShowing());
    });
  }
  if (filterPrice) {
    const params = { "filter.v.price.gte": 0, "filter.v.price.lte": Number.MAX_SAFE_INTEGER };
    filterPrice.forEach((input) => {
      input.addEventListener("change", (event) => _filterPrice(event, params));
    });
  }
  paginateFuc(paginateLinks);
  function paginate(event) {
    const target = event.target;
    const url = target.dataset.url;
    const sectionId = target.dataset.sectionId;
    function callback(searchParams) {
      searchParams.set("section_id", sectionId);
    }
    const _url = createUrl(callback, url.split("?")[1]);
    getApi(_url).then((data) => {
      setProduct(data.getElementProduct());
      updatePaginate(data.getPaginate(), paginateFuc);
      updateShowing(data.getElementShowing());
    });
  }
  function paginateFuc(paginateLinks2) {
    if (paginateLinks2) {
      paginateLinks2.forEach((paginateLink) => {
        paginateLink.addEventListener("click", paginate);
      });
    }
  }
  document.addEventListener("shopify:section:load", () => {
    infinityFuc(document.querySelector("#infinity_point"));
    const sort_by = document.querySelector("#sort_by");
    if (sort_by) {
      sort_by.addEventListener("change", _sortBy);
    }
    const filterForms2 = document.querySelectorAll('input[type="checkbox"]');
    if (filterForms2) {
      filterForms2.forEach((input) => {
        input.addEventListener("change", filterListAndCheckbox);
      });
    }
    const filterPrice2 = document.querySelectorAll('input[type="number"]');
    if (filterPrice2) {
      const params = { "filter.v.price.gte": 0, "filter.v.price.lte": Number.MAX_SAFE_INTEGER };
      filterPrice2.forEach((input) => {
        input.addEventListener("change", (event) => _filterPrice(event, params));
      });
    }
    const paginateLinks2 = document.querySelectorAll(".paginate_link[data-url]");
    if (paginateLinks2) {
      paginateLinks2.forEach((paginateLink) => {
        paginateLink.addEventListener("click", paginate);
      });
    }
  });
})();
