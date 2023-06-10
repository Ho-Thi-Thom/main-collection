import { event } from "jquery";
import { checkMaxCartPage, checkMaxLine, updateInfoCartPage } from "./cart-service";
import { debounce, fetchAPIUpdateItemCart, shopifyReloadSection } from "./utils";
const sectionId = document.querySelector('.cart-section-wrapper').dataset.sectionId
shopifyReloadSection(init, sectionId)
function init() {
    let removeBtns = document.querySelectorAll('.cart__item .remove__qlt');
    let addBtns = document.querySelectorAll('.cart__item .add__qlt');

    async function handleClickButton(type, target, event) {
        event.preventDefault();
        const lineIndex = target.closest('.cart__item.jsLineItem').dataset.lineIndex;
        const quantityInput = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .quantity__input`);
        const elmAdd = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .add__qlt`);
        const sectionId = quantityInput.getAttribute('data-sections');
        const variantId = quantityInput.getAttribute('data-key');
        let newQuantity = 0;
        switch (type) {
            case 'add':
                newQuantity = parseInt(quantityInput.value) + 1;
                break;
            case 'remove':
                newQuantity = parseInt(quantityInput.value) - 1;
                break;
            case 'change':
                console.log("abc")
                const max = parseInt(quantityInput.getAttribute("max"))
                const min = parseInt(quantityInput.getAttribute("min"))
                newQuantity = parseInt(quantityInput.value);
                console.log("abcd", newQuantity)

                if (newQuantity > max) {
                    newQuantity = max
                }

                if (newQuantity < min) {
                    newQuantity = min
                }

                break
            default:
                break;
        }
        const options = {
            variantId: variantId,
            newQuantity: newQuantity,
            sectionId: sectionId
        };
        console.log("options", options);

        try {
            const data = await fetchAPIUpdateItemCart(options)
            const result = data.sections[sectionId]
            const inputElementNew = updateInfoCartPage(result, lineIndex);
            checkMaxLine(inputElementNew, elmAdd)
            inputEvents()

        } catch (error) {

        }


    }

    addBtns.forEach(function (addBtn) {
        addBtn.addEventListener('click', (event) => handleClickButton('add', event.target, event));
    });

    removeBtns.forEach(function (removeBtn) {
        removeBtn.addEventListener('click', (event) => handleClickButton('remove', event.target, event));
    });

    function inputEvents() {
        let inputs = document.querySelectorAll('.cart__item .quantity__input');
        inputs.forEach(function (input) {
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                }
            })
            input.addEventListener('input', debounce((event) => handleClickButton('change', event.target, event), 2000))
        })
    }

    inputEvents()

    checkMaxCartPage()
}
