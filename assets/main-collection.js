(() => {
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
            let callback2 = function(searchParams) {
              searchParams.set("section_id", sectionId);
            };
            var callback = callback2;
            const target = entry.target;
            const url = target.dataset.url;
            const sectionId = target.dataset.sectionId;
            const _url = url ? createUrl(callback2, url.split("?")[1]) : null;
            if (_url == null) {
              observer.disconnect();
              return;
            }
            loading(target);
            getApi(_url).then((data) => {
              const infinityPoint3 = data.getElementPointInfinity();
              appendProduct(data.getElementProduct());
              updatePointInfinity(infinityPoint3);
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
  if (sortBy) {
    sortBy.addEventListener("change", (event) => {
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
        updatePointInfinity(data.getElementPointInfinity());
        updateShowing(data.getElementShowing());
      });
    });
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
        sections: [sectionId]
      };
      const options = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json"
        }
      };
      function getResponse(res) {
        return res.json().then((data2) => data2.sections[sectionId]);
      }
      getApi(url, options, getResponse).then((data2) => {
        setProduct(data2.getElementProduct());
        updatePointInfinity(data2.getElementPointInfinity());
        updatePaginate(data2.getPaginate());
        updateShowing(data2.getElementShowing());
      });
    });
  }
  if (filterForms) {
    filterForms.forEach((input) => {
      input.addEventListener("change", (event) => {
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
          updatePointInfinity(data.getElementPointInfinity());
          updatePaginate(data.getPaginate());
          updateShowing(data.getElementShowing());
        });
      });
    });
  }
  if (filterPrice) {
    const params = { "filter.v.price.gte": 0, "filter.v.price.lte": Number.MAX_SAFE_INTEGER };
    filterPrice.forEach((input) => {
      input.addEventListener("change", (event) => {
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
          updatePointInfinity(data.getElementPointInfinity());
          updatePaginate(data.getPaginate());
          updateShowing(data.getElementShowing());
        });
      });
    });
  }
  paginateFuc(paginateLinks);
  function paginateFuc(paginateLinks2) {
    if (paginateLinks2) {
      paginateLinks2.forEach((paginateLink) => {
        paginateLink.addEventListener("click", (event) => {
          const target = event.target;
          const url = target.dataset.url;
          const sectionId = target.dataset.sectionId;
          function callback(searchParams) {
            searchParams.set("section_id", sectionId);
          }
          const _url = createUrl(callback, url.split("?")[1]);
          getApi(_url).then((data) => {
            setProduct(data.getElementProduct());
            updatePaginate(data.getPaginate());
            updateShowing(data.getElementShowing());
          });
        });
      });
    }
  }
  function collectionService() {
    let listProduct = document.querySelector("#collection__products");
    let productCount = document.querySelector(".product_count");
    let showing2 = document.querySelector(".collection__toolbar-filter-showing");
    let infinityPoint2 = document.querySelector("#infinity_point");
    let paginate = document.querySelector(".paginate");
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
    function getApi2(url, options, getResponse) {
      return fetch(url, options).then((res) => getResponse?.(res) ?? res.text()).then((data) => _extract(data));
    }
    function appendProduct2(elements) {
      elements.querySelectorAll("#collection__products > *")?.forEach((element) => {
        listProduct?.appendChild(element);
      });
    }
    function setProduct2(element) {
      if (listProduct) {
        listProduct.parentNode.replaceChild(element, listProduct);
        listProduct = document.querySelector("#collection__products");
      }
    }
    function updateCount2(element) {
      if (productCount) {
        productCount.parentNode.replaceChild(element, productCount);
        productCount = document.querySelector(".product_count");
      }
    }
    function updateShowing2(element) {
      if (showing2) {
        showing2.parentNode.replaceChild(element, showing2);
        showing2 = document.querySelector(".collection__toolbar-filter-showing");
      }
    }
    function updatePointInfinity2(element) {
      if (infinityPoint2) {
        infinityPoint2.parentNode.replaceChild(element, infinityPoint2);
        infinityPoint2 = document.querySelector("#infinity_point");
        infinityFuc(document.querySelector("#infinity_point"));
      }
    }
    function updatePaginate2(element) {
      if (paginate) {
        paginate.parentNode.replaceChild(element, paginate);
        paginate = document.querySelector(".paginate");
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
      createUrlFilter: createUrlFilter2
    };
    return services;
  }
})();
