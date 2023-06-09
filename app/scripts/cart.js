import { updateCartPopup } from "./cart-popup";
import { updateDataCart, updateInfoCartPage, fetchAPIUpdateItemCart, checkMax, checkListCart, updateCountCart } from "./common/cart/cart-service";
import { createUrlCustom, debounce, setValuePopupInfo, shopifyReloadSection } from "./common/utils/utils";

const sectionId = document.querySelector('.cart-section-wrapper')?.dataset.sectionId
if (sectionId) {
    shopifyReloadSection(initCartPage, sectionId)
}

export function initCartPage(isSipping = true, isPopupCart = false) {
    // check list cart
    const removeBtns = document.querySelectorAll('.cart__item .remove__qlt');
    const addBtns = document.querySelectorAll('.cart__item .add__qlt');
    const btnRemoves = document.querySelectorAll('.btn-remove')

    checkListCart()
    trigger(btnRemoves)
    trigger([...addBtns, ...removeBtns])

    function trigger(elements = []) {
        if (!elements || elements.length === 0) {
            return
        }
        elements.forEach((element) => {
            let timeout = null
            element.addEventListener("click", (event) => {
                const elm = event.target;
                const lineIndex = elm.closest('.cart__item.jsLineItem').dataset.lineIndex;
                const quantityInput = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .quantity__input`);

                if (elm.classList.contains("add__qlt")) {
                    quantityInput.stepUp();
                    checkMax(quantityInput, 'add', lineIndex)
                }

                if (elm.classList.contains("remove__qlt")) {
                    quantityInput.stepDown();
                    checkMax(quantityInput, 'remove', lineIndex)
                }
                let newQuantity = quantityInput.value;
                const checkRemoveItem = elm.classList.contains("btn-remove")
                if (checkRemoveItem) {
                    newQuantity = 0;
                }

                if (timeout) {
                    clearTimeout(timeout);
                }

                timeout = setTimeout(async () => {
                    quantityInput.value;
                    const sectionId = quantityInput.getAttribute('data-sections');
                    const variantId = quantityInput.getAttribute('data-key');
                    const options = {
                        variantId: variantId,
                        newQuantity: newQuantity,
                        sectionId: sectionId
                    };

                    try {
                        const data = await fetchAPIUpdateItemCart(options);
                        const result = data.sections[sectionId];
                        const cartCount = await updateCountCart();
                        if (cartCount) {
                            updateInfoCartPage(result, lineIndex, checkRemove = checkRemoveItem);
                        } else {
                            if (isPopupCart) {
                                updateCartPopup()
                            } else {
                                location.reload();
                            }
                        }
                    } catch (err) {
                        console.log("Error", err)
                    }
                }, 1000);
            });

        })
    }

    let inputs = document.querySelectorAll('.cart__item .quantity__input');
    inputs.forEach(function (input) {
        input.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        })
        input.addEventListener('input', debounce(async (event) => {
            const lineIndex = event.target.closest('.cart__item.jsLineItem').dataset.lineIndex;
            const quantityInput = event.target

            const variantId = quantityInput.getAttribute('data-key');
            const options = {
                variantId: variantId,
                newQuantity: quantityInput.value,
                sectionId: sectionId
            };
            try {
                const data = await fetchAPIUpdateItemCart(options)
                const result = data.sections[sectionId]
                updateInfoCartPage(result, lineIndex);
            } catch (err) {
                const options = {
                    type: "error",
                    title: "422",
                    textContent: `Only ${quantityInput.getAttribute('max')} products in stock`
                };
                setValuePopupInfo(options);
            }
        }, 2000))
    })

    // cart-summary
    const accordionItems = document.querySelectorAll('.accordion-initialized');

    accordionItems.forEach(function (accordionItem) {
        const span = accordionItem.querySelector('.accordion-trigger');
        const formNote = accordionItem.querySelector('.cart__form-note');

        span.addEventListener('click', function () {
            formNote.classList.toggle('active');
        });
    });

    const textarea = document.getElementById('cart-note');
    const debouncedFetch = debounce(() => updateDataCart(textarea.value), 500);
    textarea.addEventListener('input', debouncedFetch);
    if (isSipping) {
        handleShipping()
    }
}


function handleShipping() {
    // jsShippingRates
    const selectField = document.getElementsByName("shipping_address[country]")[0];
    selectField.addEventListener("change", function (event) {
        const selectedOption = selectField.options[selectField.selectedIndex];
        const province = selectedOption.getAttribute("data-provinces");
        const formField = document.querySelector('.jsProvince')
        const selectProvince = formField.querySelector("[name='shipping_address[province]']");

        if (JSON.parse(province).length) {
            JSON.parse(province).forEach(([value, label]) => {
                const option = document.createElement("option");
                option.value = value;
                option.text = label;
                selectProvince.appendChild(option);
            });

            formField.style.display = "block";
        } else {
            formField.style.display = "none";
        }
    });

    const elmShippingRates = document.querySelector('.jsShippingRates');
    const url = elmShippingRates.dataset.url;
    const formShipping = document.querySelector(".shipping-form");
    formShipping.addEventListener("submit", (event) => {
        event.preventDefault();
        const productFormData = Object.fromEntries(new FormData(event.target).entries());
        const btnState = document.querySelector(".jsButtonShipping");
        btnState.classList.add('loading')
        const newUrl = createUrlCustom(url, productFormData);
        let n = document.querySelector(".js-shipping-result");
        let i = document.querySelector("template").content.firstElementChild;
        let s = document.createElement("div");
        n.innerHTML = "";

        fetch(newUrl)
            .then(res => res.json())
            .then(data => {
                const _data = data.shipping_rates;
                let t = theme.strings.notFoundShippingRate;
                if (_data && _data.length > 1) {
                    t = theme.strings.manyShippingRate.replace("{{ number }}", _data.length);
                } else if (_data && _data.length === 1) {
                    t = theme.strings.oneShippingRate;
                }
                document.querySelector(".js-response-title").innerHTML = t;
                if (_data) {
                    _data.forEach(item => {
                        s.innerHTML = i.outerHTML;
                        s.querySelector(".shipping-name").innerHTML = item.name;
                        s.querySelector(".shipping-cost").textContent = item.price;
                        n.insertAdjacentHTML("beforeend", s.innerHTML);
                    });
                }
                btnState.classList.remove('loading')
            });
    });
}