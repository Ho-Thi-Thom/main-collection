export default function collectionService() {
    function loading(target) {
        target.innerHTML = "Loading..."
    }

    function hiddenLoading(target) {
        target.innerHTML = ""
    }

    function createUrl(callback, initParam) {
        const urlSearchParams = new URLSearchParams(initParam)
        callback(urlSearchParams)
        return window.location.pathname + "?" + urlSearchParams.toString()

    }

    function createUrlFilter(callback, search) {
        const params = new URLSearchParams(search);
        const checkedValues = {};
        params.forEach(function (value, key) {
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
        return newUrl
    }


    function getApi(url, options) {
        return fetch(url, options).then(res => res.text()).then(data => _extract(data))
    }

    function appendProduct(elements) {
        let listProduct = document.querySelector('#collection__products');
        elements.querySelectorAll("#collection__products > *")?.forEach(element => {
            listProduct?.appendChild(element);
        });
    }

    function setProduct(element) {
        let listProduct = document.querySelector('#collection__products');
        if (element) {
            listProduct.parentNode.replaceChild(element, listProduct)
            listProduct = element
        }
    }

    function updateCount(element) {
        let productCount = document.querySelector('.product_count')
        if (element) {
            productCount.parentNode.replaceChild(element, productCount)
        }
    }

    function updateShowing(element) {
        let showing = document.querySelector('.collection__toolbar-filter-showing')
        if (element) {
            showing.parentNode.replaceChild(element, showing)
        }
    }

    function updatePointInfinity(element, infinityFuc) {
        let infinityPoint = document.querySelector('#infinity_point')
        if (element) {
            infinityPoint.parentNode.replaceChild(element, infinityPoint)
            infinityFuc(element);
        }
    }


    function updatePaginate(element, paginateFuc) {
        let paginate = document.querySelector('.paginate')
        if (element) {
            paginate.parentNode.replaceChild(element, paginate)
            paginateFuc(document.querySelectorAll('.paginate_link[data-url]'))
        }
    }

    function _extract(data) {

        const div = document.createElement("div");
        div.innerHTML = data;

        return {
            getElementProduct() {
                return div.querySelector('#collection__products')
            },
            getProductCount() {
                return div.querySelector(".product_count")
            },
            getElementPointInfinity() {
                return div.querySelector("#infinity_point")
            },
            getPaginate() {
                return div.querySelector(".paginate")
            },
            getElementShowing() {
                return div.querySelector(".collection__toolbar-filter-showing")
            }
        }
    }

    const services = {
        loading,
        hiddenLoading,
        getApi,
        appendProduct,
        setProduct,
        updateCount,
        updateShowing,
        updatePointInfinity,
        createUrl,
        updatePaginate,
        createUrlFilter
    }
    return services;
}