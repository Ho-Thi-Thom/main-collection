import { tns } from "tiny-slider";
import { debounce, setValuePopupInfo, uppercaseFirstLetter } from "./utils";

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
            nextButton: ".thumbnail-slider ~ .next",
            prevButton: ".thumbnail-slider ~ .prev",
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
            nextButton: ".customize-thumbnails ~ .next",
            prevButton: ".customize-thumbnails ~ .prev",
        });

        slider.events.on("indexChanged", function (info) {
            sliderCustom.goTo(info.index);
        });
    };

    initializeSlider();

    const debouncedInitializeSlider = debounce(initializeSlider, 500);
    window.addEventListener("resize", debouncedInitializeSlider);

    return slider;
}

export function onVariantChange(getUrl) {
    const url = getUrl();
    if (url) {
        fetch(url)
            .then((res) => res.text())
            .then((data) => {
                const div = document.createElement("div");
                div.innerHTML = data;
                updateElementPrice(
                    div.querySelector(".compare-price"),
                    div.querySelector(".price")
                );
                updateElementVariantInventory(div.querySelector(".variant-inventory"));
                updateElementAddToCart(div.querySelector(".btn-add"));
                updateElementSKU(div.querySelector(".product-sku"));
                updateElementInput(div.querySelector(".jsSubmit"));
            });
    } else {
        updateElementAddToCart(null, true);
        const options = {
            type: "warring",
            title: "Not found",
            textContent: 'Variant does not exist'
        };

        setValuePopupInfo(options);
    }
}

function updateElementPrice(divCompare, divPrice, checkEmpty = false) {
    if (checkEmpty) {
        return;
    }
    const cpPrice = document.querySelector(".compare-price");
    const price = document.querySelector(".price");
    cpPrice.parentNode.replaceChild(divCompare, cpPrice);
    price.parentNode.replaceChild(divPrice, price);
}

function updateElementVariantInventory(element, checkEmpty = false) {
    if (checkEmpty) {
        return;
    }
    const variantInventory = document.querySelector(".variant-inventory");
    variantInventory.parentNode.replaceChild(element, variantInventory);
}

function updateElementSKU(element, checkEmpty = false) {
    if (checkEmpty) {
        return;
    }
    const sku = document.querySelector(".product-sku");
    sku.parentNode.replaceChild(element, sku);
}

function updateElementAddToCart(element, checkEmpty = false) {
    const btnAdd = document.querySelector(".btn-add");

    if (checkEmpty) {
        btnAdd.setAttribute("disabled", "");
        const btnAddSpan = btnAdd.querySelector("span");
        btnAdd.setAttribute("data-selected-quantity", 0);
        btnAddSpan.textContent = 'Not Available'
        return;
    }

    if (btnAdd && element) {
        const btnAddSpan = btnAdd.querySelector("span");
        const elementSpan = element.querySelector("span");
        if (btnAddSpan && elementSpan) {
            btnAddSpan.parentNode.replaceChild(elementSpan, btnAddSpan);
        }
        const selectedQuantity = element.getAttribute("data-selected-quantity");
        if (selectedQuantity) {
            btnAdd.setAttribute("data-selected-quantity", selectedQuantity);
        }
        if (parseInt(selectedQuantity) === 0) {
            btnAdd.setAttribute("disabled", "true");
        } else {
            const checkbox = document.querySelector(".cart__condition");
            if (checkbox.classList.contains("checked")) {
                btnAdd.removeAttribute("disabled");
            }
        }
    }
}

function updateElementInput(element, checkEmpty = false) {
    if (checkEmpty) {
        return;
    }
    const input = document.querySelector(".jsSubmit");
    input.value = element.value;
}

export function updateCssOption(titles, productOptions, name) {
    name = uppercaseFirstLetter(name);
    const filteredPositions = productOptions
        .filter((item) => item.name !== name)
        .map((item) => item.position);

    const element = productOptions.find((item) => item.name === name);
    const input = element ? element.position : null;
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

    const mergedArray = filteredPositions.map((element, index) => [
        element,
        result[index],
    ]);
    const checkPositions = document.querySelectorAll(".check-position");
    mergedArray.forEach((item) => {
        checkPositions.forEach((element) => {
            if (item[0] == element.dataset.position) {
                const inputs = element.querySelectorAll('input[type="radio"]');
                const options = element.querySelectorAll("option");

                Array.from(inputs)
                    .concat(Array.from(options))
                    .forEach((input) => {
                        const value = input.value;
                        if (!item[1].includes(value)) {
                            input.setAttribute("data-disabled", "true");
                        } else {
                            input.setAttribute("data-disabled", "false");
                        }
                    });
            }
        });
    });
}

export function getValue(selects, radios) {
    const inputsData = [];

    if (selects) {
        selects.forEach((select) => {
            const options = select.querySelectorAll("option");

            options.forEach((option) => {
                const value = option.value;
                const checked = option.selected;
                if (checked) {
                    inputsData.push(value);
                }
            });
        });
    }

    if (radios) {
        radios.forEach((input) => {
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
        const response = await fetch(window.Shopify.routes.root + "cart.js");
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
        return quantity;
    } catch (error) {
        return error;
    }
}

export function checkPolicy() {
    const checkbox = document.getElementById("cart-condition");

    checkbox.addEventListener("click", function (event) {
        const cartCondition = document.querySelector(".cart__condition");
        const addButton = document.querySelector("button[name='add']");

        if (this.checked) {
            cartCondition.classList.add("checked");
            const selectedQuantity = addButton.getAttribute("data-selected-quantity");
            if (parseInt(selectedQuantity) !== 0) {
                addButton.removeAttribute("disabled");
            }
        } else {
            cartCondition.classList.remove("checked");
            addButton.setAttribute("disabled", "");
        }
    });
}
