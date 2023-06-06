import { tns } from "tiny-slider";
import { debounce, uppercaseFirstLetter } from "./utils";

export function runSlider() {
    let slider = null;
    let sliderCustom = null;

    const initializeSlider = () => {
        const isTablet = window.matchMedia("(max-width: 1023px)").matches;
        const axisValue = isTablet ? "horizontal" : "vertical";

        if (slider) {
            slider.destroy();
        }

        if (sliderCustom) {
            sliderCustom.destroy();
        }

        slider = tns({
            container: ".thumbnail-slider",
            navContainer: ".customize-thumbnails",
            items: 1,
            axis: "horizontal",
            autoplay: false,
            autoplayTimeout: 1000,
            speed: 400,
            mouseDrag: true,
            loop: false,
            nextButton: '.thumbnail-slider ~ .next',
            prevButton: '.thumbnail-slider ~ .prev',
        });

        sliderCustom = tns({
            container: ".customize-thumbnails",
            items: 4,
            axis: axisValue,
            autoplay: false,
            autoplayTimeout: 1000,
            speed: 400,
            loop: false,
            mouseDrag: true,
            nav: false,
            nextButton: '.customize-thumbnails ~ .next',
            prevButton: '.customize-thumbnails ~ .prev',
        });

        slider.events.on('indexChanged', function (info) {
            sliderCustom.goTo(info.index);
        });
    };

    initializeSlider();

    const debouncedInitializeSlider = debounce(initializeSlider, 500);
    window.addEventListener('resize', debouncedInitializeSlider);

    return slider;
}


export function onVariantChange(getUrl) {
    const url = getUrl();

    if (url) {
        fetch(url)
            .then(res => res.text())
            .then(data => {
                const div = document.createElement("div");
                div.innerHTML = data;
                updateElementPrice(div.querySelector('.compare-price'), div.querySelector(".price"));
                updateElementVariantInventory(div.querySelector(".variant-inventory"))
                updateElementAddToCart(div.querySelector(".btn-add"))
                updateElementSKU(div.querySelector(".product-sku"))
                updateElementInput(div.querySelector(".jsSubmit"))
            })
    }
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

function updateElementInput(element) {
    const input = document.querySelector(".jsSubmit")
    input.value = element.value
}

export function updateCssOption(titles, productOptions, name) {
    name = uppercaseFirstLetter(name);
    const filteredPositions = productOptions
        .filter((item) => item.name !== name)
        .map((item) => item.position);

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

export function getValue(selects, radios) {
    const inputsData = [];

    if (selects) {
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
    }

    if (radios) {
        radios.forEach(input => {
            const value = input.value;
            const checked = input.checked;
            if (checked) {
                inputsData.push(value);
            }
        });
    }

    return inputsData;
}

async function fetchDataCart() {
    try {
        const response = await fetch(window.Shopify.routes.root + 'cart.js');
        const data = await response.json();
        return data.items;
    } catch (error) {
        return error;
    }
}

async function getCountByVariant(variantId) {
    try {
        const arrCart = await fetchDataCart();
        let quantity = 0;

        for (let i = 0; i < arrCart.length; i++) {
            if (arrCart[i].variant_id === variantId) {
                quantity = arrCart[i].quantity;
                break;
            }
        }
        return quantity
    } catch (error) {
        return error
    }
}


export function checkPolicy() {
    const checkbox = document.getElementById('cart-condition');
    const cartCondition = document.querySelector('.cart__condition');

    checkbox.addEventListener('click', function (event) {
        // event.stopPropagation();
        if (this.checked) {
            cartCondition.classList.add('checked');
        } else {
            cartCondition.classList.remove('checked');
        }
    });
}