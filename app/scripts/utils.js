export function readLocalStorage(key, defaultValue = []) {
    try {
        const data = window.localStorage.getItem(key);

        if (data) {
            return JSON.parse(data);
        }
        return defaultValue;
    } catch (error) {
        console.log(error);
        return defaultValue;
    }
}

export function setLocalStorage(key, data) {
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.log(error)
    }
}


export function getScript(selector, defaultValue) {
    try {
        return JSON.parse(selector.textContent)
    } catch (error) {
        console.log(error)
        return defaultValue
    }
}

export function createUrlCustom(intURl = '', initParam = {}, callback) {
    const urlSearchParams = new URLSearchParams(initParam);
    if (callback && typeof callback === "function") {
        callback(urlSearchParams);
    }
    return intURl ? intURl + "?" + urlSearchParams.toString() : window.location.pathname + "?" + urlSearchParams.toString();
}

export function createUrl(callback, initParam) {
    const urlSearchParams = new URLSearchParams(initParam)
    if (callback && typeof callback === "function") {
        callback(urlSearchParams)
    }
    return window.location.pathname + "?" + urlSearchParams.toString()

}

export function updateUrl(url, sectionId) {
    url += url.includes('?') ? '&' : '?';
    return url += `section_id=${sectionId}`;
}


export function uppercaseFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export function tnsSplit(text = "", splitCharacter = ";") {
    const myArray = text.split(splitCharacter);
    const spacingItem = myArray[1] ?? 0;
    const screen = myArray[0].split(",");

    return {
        spacingItem,
        screen /**[mobile, tablet, desktop] */
    }
}


export function shopifyReloadSection(callback, sectionId, isShopifySectionReload = true) {
    if (callback) {
        callback()
        if (isShopifySectionReload) {
            /** shopify:section:load */
            document.addEventListener("shopify:section:load", (event) => {
                if (event.detail.sectionId === sectionId) {
                    callback()
                }
            });
        }
    }
}


export function setValuePopupInfo(options) {
    const popupInfo = document.querySelector("#popup-info")
    const titleElm = document.querySelector("#popup-info .title")
    const contentElm = document.querySelector("#popup-info .wrapper-content")

    const { type, title, textContent } = options
    titleElm.setAttribute('data-type', type)
    titleElm.innerHTML = title.trim();
    contentElm.innerHTML = textContent.trim()
    popupInfo.classList.add('active');
}

export function closePopup() {
    const popupInfo = document.querySelector("#popup-info")
    popupInfo.classList.remove('active')
}

export function debounce(fn, delay) {
    var timeoutID = null
    return function () {
        clearTimeout(timeoutID)
        var args = arguments
        var that = this
        timeoutID = setTimeout(function () {
            fn.apply(that, args)
        }, delay)
    }
}

export function addToCart(data) {
    fetch(window.Shopify.routes.root + 'cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        switch (res.status) {
            case 200:
                res.json().then((data) => {
                    const options = {
                        type: "success",
                        title: "Add to Cart",
                        textContent: `Add success "${data.items[0].product_title}"`
                    };

                    updateCountCart();
                    setValuePopupInfo(options);
                })
                break;
            case 404:
                break;
            case 422:
                res.json().then((data) => {
                    const options = {
                        type: "error",
                        title: "422",
                        textContent: data.description
                    };

                    setValuePopupInfo(options);
                })
                break;
            default:
                break;
        }
    })
        .catch((error) => {
            console.log('Error:', error);
        });
}

async function countItemCart() {
    try {
        const response = await fetch(window.Shopify.routes.root + 'cart.js');
        const data = await response.json();
        return data.item_count;
    } catch (error) {
        return error;
    }
}

async function updateCountCart() {
    try {
        const count = await countItemCart();
        const elm = document.querySelector('.jsCountItemCart');
        elm.textContent = count;
    } catch (error) {
        console.error(error);
    }
}

