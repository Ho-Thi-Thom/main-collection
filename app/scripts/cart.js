import { updateInfoCartPage } from "./cart-service";
import { fetchAPIUpdateItemCart, shopifyReloadSection } from "./utils";
const sectionId = document.querySelector('.cart-section-wrapper').dataset.sectionId
shopifyReloadSection(init, sectionId)
function init() {
    let removeBtns = document.querySelectorAll('.cart__item .remove__qlt');
    let addBtns = document.querySelectorAll('.cart__item .add__qlt');

    async function handleAddClick(type, target, event) {
        event.preventDefault();
        const lineIndex = target.closest('.cart__item.jsLineItem').dataset.lineIndex;
        const quantityInput = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .quantity__input`);
        const sectionId = quantityInput.getAttribute('data-sections');
        const variantId = quantityInput.getAttribute('data-key').split(":")[0];
        let newQuantity = 0;
        switch (type) {
            case 'add':
                newQuantity = parseInt(quantityInput.getAttribute('value')) + 1;
                break;
            case 'remove':
                newQuantity = parseInt(quantityInput.getAttribute('value')) - 1;
                break;
            default:
                break;
        }
        const options = {
            variantId: variantId,
            newQuantity: newQuantity,
            sectionId: sectionId
        };
        const data = await fetchAPIUpdateItemCart(options)
        const result = data.sections[sectionId]

        updateInfoCartPage(result, lineIndex);
    }

    addBtns.forEach(function (addBtn) {
        addBtn.addEventListener('click', (event) => handleAddClick('add', event.target, event));
    });

    removeBtns.forEach(function (removeBtn) {
        removeBtn.addEventListener('click', (event) => handleAddClick('remove', event.target, event));
    });
}
