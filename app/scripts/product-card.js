import { openPopup } from "./popup-product-item";
import { addToCart } from "./utils";

window.addEventListener('DOMContentLoaded', function () {
    const body = document.querySelector('body')
    body.addEventListener("click", (event) => {

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
            addToCart(data)
        }
        if (event.target.classList.contains('jsQuickView')) {
            event.preventDefault();
            const url = event.target.dataset.urlProductPopup;
            fetchDataPopup(url)
        }
    })
});


async function fetchDataPopup(url) {
    const result = await fetch(url);
    const data = await result.text();
    const div = document.createElement("div");
    div.innerHTML = data;
    const popup = document.querySelector('#popup-product-item');
    const quickView = div.querySelector('.dialog__quick-view');

    popup.querySelector('.content').appendChild(quickView);
    openPopup()
}
