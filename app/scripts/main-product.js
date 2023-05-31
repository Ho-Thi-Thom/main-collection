
const selects = document.querySelectorAll('.js-variant-change');
const radio = document.querySelectorAll('input[type="radio"]');
const productData = JSON.parse(document.getElementById("product_data").textContent);
const productOptions = JSON.parse(document.getElementById("product_options").textContent);
const variants = productData.variants
const wishList = document.querySelector('.wish-list')

const recentlyTrigger = (handle) => {
    const RECENTLY_LIST_KEY = "recently-list";

    const getRecentlyList = () => {
        try {
            const data = window.localStorage.getItem(RECENTLY_LIST_KEY);
            if (data) {
                return JSON.parse(data);
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    };

    const setRecentlyList = () => {
        const data = getRecentlyList();
        const index = data.findIndex(item => item === handle);
        if (index > -1) {
            data.splice(index, 1);
        }
        data.unshift(handle);
        window.localStorage.setItem(RECENTLY_LIST_KEY, JSON.stringify(data));
    };


    setRecentlyList()
};
window.recentlyTrigger = recentlyTrigger


const productTrigger = (id) => {
    const WISH_LIST_KEY = "wish-list"

    const getWishList = () => {
        try {

            const data = window.localStorage.getItem(WISH_LIST_KEY)
            if (data) {
                return JSON.parse(data)
            }
            return []
        } catch (error) {
            console.log(error)
        }
    }

    const initialWishList = () => {
        const _wishList = getWishList()
        const index = _wishList.findIndex(item => item === id)

        if (index !== -1) {
            wishList.classList.add("active")
        }
    }

    const toggleWishList = () => {
        const newData = getWishList()
        const index = newData.findIndex(item => item === id)
        if (index !== -1) {
            newData.splice(index, 1)
            wishList.classList.remove("active")
        } else {
            newData.push(id)
            wishList.classList.add("active")
        }
        window.localStorage.setItem(WISH_LIST_KEY, JSON.stringify(newData))
    }


    initialWishList()
    wishList.addEventListener("click", function changeWishList() {
        toggleWishList()
    })
}
window.productTrigger = productTrigger




function createUrl(callback) {
    const urlSearchParams = new URLSearchParams()
    callback(urlSearchParams)
    return window.location.pathname + "?" + urlSearchParams.toString()

}

function updateUrl(url, sectionId) {
    url += url.includes('?') ? '&' : '?';
    return url += `section_id=${sectionId}`;
}

function updateElementPrice(divCompare, divPrice) {
    const cpPrice = document.querySelector('.compare-price')
    const price = document.querySelector(".price")
    cpPrice.parentNode.replaceChild(divCompare, cpPrice)
    price.parentNode.replaceChild(divPrice, price)
}

function updateElementVariantInventory(element) {
    const variantInventory = document.querySelector(".variant-inventory");
    variantInventory.parentNode.replaceChild(element, variantInventory)

}

function updateElementSKU(element) {
    const sku = document.querySelector(".product-sku");
    sku.parentNode.replaceChild(element, sku)
}

function updateElementAddToCart(element) {
    const btnAdd = document.querySelector(".btn-add");
    btnAdd.parentNode.replaceChild(element, btnAdd)
}

function onVariantChange(sectionId, event) {
    const value = getValue();
    const result = getVariant(value);
    if (result != undefined) {
        mainSlider.goTo(result.featured_image.position - 1);
        function callback(searchParams) {
            searchParams.set('variant', result.id);
        }
        let url = createUrl(callback)
        history.pushState(null, null, url);
        let _url = updateUrl(url, sectionId)
        fetch(_url)
            .then(res => res.text())
            .then(data => {
                const div = document.createElement("div");
                div.innerHTML = data;
                updateElementPrice(div.querySelector('.compare-price'), div.querySelector(".price"));
                updateElementVariantInventory(div.querySelector(".variant-inventory"))
                updateElementAddToCart(div.querySelector(".btn-add"))
                updateElementSKU(div.querySelector(".product-sku"))
            })
    } else {
        console.log(value)
    }


}

function updateCssOption(value, name) {
    name = name.charAt(0).toUpperCase() + name.slice(1);
    const filteredProducts = variants.filter(variant => Object.values(variant).includes(value));
    const filteredPositions = productOptions
        .filter((item) => item.name !== name)
        .map((item) => item.position);
    const titles = filteredProducts.map(product => product.title);

    const element = productOptions.find(item => item.name === name);
    const input = element ? element.position : null;;
    const uniqueElements = [...new Set(titles)];
    const result = uniqueElements.reduce((acc, item) => {
        const parts = item.split(" / ");
        const filteredParts = parts.filter((_, index) => index !== input - 1);
        filteredParts.forEach((part, index) => {
            if (!acc[index]) {
                acc[index] = [];
            }
            if (!acc[index].includes(part)) {
                acc[index].push(part);
            }
        });

        return acc;
    }, []);

    const mergedArray = filteredPositions.map((element, index) => [element, result[index]]);
    // console.log("mergedArray", mergedArray)
    const checkPositions = document.querySelectorAll(".check-position");
    // console.log("checkPositions", checkPositions)
    mergedArray.forEach(item => {
        checkPositions.forEach(element => {
            if (item[0] == element.dataset.position) {
                const inputs = element.querySelectorAll('input[type="radio"]');
                const options = element.querySelectorAll("option")


                Array.from(inputs).concat(Array.from(options)).forEach(input => {
                    const value = input.value;
                    if (!item[1].includes(value)) {
                        input.setAttribute("data-disabled", "true")
                    } else {
                        input.setAttribute("data-disabled", "false")
                    }
                });
            }
        });
    });
}


const formEl = document.querySelector('.jsProductForm');
formEl.addEventListener('change', event => {
    onVariantChange(formEl.dataset.sectionId, event);
    updateCssOption(event.target.value, event.target.name);
})

function getVariant(data) {
    return variants.find(variant => {
        return variant.options.join('/') == data.join('/')
    })
}


function getValue() {
    const inputsData = [];

    selects.forEach(select => {
        const options = select.querySelectorAll('option');

        options.forEach(option => {
            const value = option.value;
            const checked = option.selected;
            if (checked) {
                inputsData.push(value);
            }
        });
    });

    radio.forEach(input => {
        const value = input.value;
        const checked = input.checked;
        if (checked) {
            inputsData.push(value);
        }
    });
    return inputsData;
}



//  change quantity
const removeBtn = document.querySelector('.remove__qlt');
const addBtn = document.querySelector('.add__qlt');
const quantityInput = document.querySelector('.quantity__input');

removeBtn.addEventListener('click', function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
});

addBtn.addEventListener('click', function () {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
});

// event enter
quantityInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});






