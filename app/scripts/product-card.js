import { jsDialogQuickView } from "./common/utils/dialog-quick-view";
import { openPopup } from "./popup-product-item";
import { addToCart, updateCountCart, updateInfoCartPage } from "./common/cart/cart-service";
import { fetchDataCart, handelActivePopup } from "./cart-popup";
import { initCartPage } from "./cart";
import { debounce } from "./common/utils/utils";

window.addEventListener('DOMContentLoaded', function () {
    const body = document.querySelector('body')
    body.addEventListener("click", async (event) => {
        if (event.target.classList.contains('jsAddToCart')) {
            event.preventDefault()
            const variantId = event.target.dataset.firstVariant
            let data = {
                items: [
                    {
                        id: variantId,
                        quantity: 1
                    }
                ]
            }
            try {
                const checkAddToCart = await addToCart(data, false)
                if (checkAddToCart) {
                    updateCartPopup()
                    debounce(handelActivePopup(), 500)
                }
            } catch (error) {
                console.log('Error:', error)
            }
        }
        if (event.target.classList.contains('jsQuickView')) {
            event.preventDefault()
            const url = event.target.dataset.urlProductPopup
            fetchDataPopup(url)
        }
    })
})


async function updateCartPopup() {
    const elementPopup = document.querySelector('.jsCartPopup');
    const sectionId = elementPopup.dataset.sectionId;
    const data = await fetchDataCart(sectionId);
    const div = document.createElement("div");
    div.innerHTML = data;
    const cartPopup = div.querySelector('.jsCartPopup')
    const elements = cartPopup.querySelectorAll('.jsPopupUpdate');
    const oldElement = document.querySelectorAll('.jsCartPopup .jsPopupUpdate');
    oldElement.forEach((item, index) => {
        item.parentNode.replaceChild(elements[index], item);
    })
    initCartPage(false);
    updateCountCart();
}

async function fetchDataPopup(url) {
    const result = await fetch(url);
    const data = await result.text();
    const div = document.createElement("div");
    div.innerHTML = data;
    const popup = document.querySelector('#popup-product-item .popup-content .content');
    const quickView = div.querySelector('.dialog__quick-view');
    popup.innerHTML = '';
    popup.appendChild(quickView);
    const newUrl = url.split('?')[0]
    jsDialogQuickView(newUrl, popup);
    openPopup()
}
