import { updateInfoCartPage } from "./cart-service";
import { debounce, fetchAPIUpdateItemCart, shopifyReloadSection } from "./utils";
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
                quantityInput.value = getNewValue(parseInt(quantityInput.value));

                if (timeout) {
                    clearTimeout(timeout)
                }
                timeout = setTimeout(async () => {
                    const newQuantity = validateValue(quantityInput.value, quantityInput.getAttribute("max"), quantityInput.getAttribute("min"))
                    quantityInput.value = newQuantity
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

    trigger(addBtns, (value) => value + 1)
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
}