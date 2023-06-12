import { updateDataCart, updateInfoCartPage, fetchAPIUpdateItemCart } from "./cart-service";
import { createUrlCustom, debounce, shopifyReloadSection } from "./utils";
const sectionId = document.querySelector('.cart-section-wrapper').dataset.sectionId
shopifyReloadSection(init, sectionId)
function init() {
    let removeBtns = document.querySelectorAll('.cart__item .remove__qlt');
    let addBtns = document.querySelectorAll('.cart__item .add__qlt');

    function validateValue(value, max, min) {
        value = parseInt(value)
        max = parseInt(max)
        min = parseInt(min)

        return Math.max(Math.min(value, max), min)
    }


    function trigger(elements = [], getNewValue) {
        if (!elements || elements.length === 0 || !getNewValue || typeof getNewValue !== "function") {
            return
        }

        elements.forEach((element) => {
            let timeout = null
            element.addEventListener("click", event => {
                const lineIndex = event.target.closest('.cart__item.jsLineItem').dataset.lineIndex;
                const quantityInput = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .quantity__input`);

                // check class la + hay - => stepUp() stepDown()
                // quantityInput.value = getNewValue(parseInt(quantityInput.value));

                if (timeout) {
                    clearTimeout(timeout)
                }
                timeout = setTimeout(async () => {
                    // const newQuantity = validateValue(quantityInput.value, quantityInput.getAttribute("max"), quantityInput.getAttribute("min"))
                    // quantityInput.value = newQuantity
                    const newQuantity = quantityInput.value;
                    const sectionId = quantityInput.getAttribute('data-sections');
                    const variantId = quantityInput.getAttribute('data-key');
                    const options = {
                        variantId: variantId,
                        newQuantity: newQuantity,
                        sectionId: sectionId
                    };
                    try {
                        const data = await fetchAPIUpdateItemCart(options)
                        const result = data.sections[sectionId]
                        updateInfoCartPage(result, lineIndex);
                    } catch (err) { }
                }, 1000)
            })

        })
    }

    trigger([...addBtns, ...removeBtns], (value) => value + 1)
    trigger(removeBtns, (value) => value - 1)

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
            const newQuantity = validateValue(quantityInput.value, quantityInput.getAttribute("max"), quantityInput.getAttribute("min"))
            quantityInput.value = newQuantity
            const variantId = quantityInput.getAttribute('data-key');
            const options = {
                variantId: variantId,
                newQuantity: newQuantity,
                sectionId: sectionId
            };
            try {
                const data = await fetchAPIUpdateItemCart(options)
                const result = data.sections[sectionId]
                updateInfoCartPage(result, lineIndex);
            } catch (err) { }
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
    const debouncedFetch = debounce(() => updateDataCart(textarea.value), 2000); // Hàm debounce cho cuộc gọi API
    textarea.addEventListener('input', debouncedFetch);

    // jsShippingRates
    const elmShippingRates = document.querySelector('.jsShippingRates');
    const url = elmShippingRates.dataset.url;
    const formShipping = document.querySelector(".shipping-form");
    formShipping.addEventListener("submit", (event) => {
        event.preventDefault();
        const productFormData = Object.fromEntries(new FormData(event.target).entries());
        const newUrl = createUrlCustom(url, productFormData);

        fetch(newUrl)
            .then(res => {
                console.log("check", res)
            })
    });




}