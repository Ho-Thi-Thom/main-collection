import { jsDialogQuickView } from "./common/utils/dialog-quick-view";
import { openPopup } from "./popup-product-item";
import { addToCart } from "./common/cart/cart-service";
import { handelActivePopup, updateCartPopup } from "./cart-popup";
import { initCartPage } from "./cart";
import { debounce } from "./common/utils/utils";

window.addEventListener('DOMContentLoaded', function () {
    const body = document.querySelector('body')
    body.addEventListener("click", async (event) => {
        if (event.target.classList.contains('jsAddToCart')) {
            event.preventDefault()
            const productForm = event.target.closest('.jsProductItemForm');
            const productFormData = Object.fromEntries(new FormData(productForm).entries());
            let formData = {
                "items": [productFormData]
            }
            try {
                const checkAddToCart = await addToCart(formData, false)
                if (checkAddToCart) {
                    const check = await updateCartPopup()
                    if (check) {
                        debounce(handelActivePopup(), 500)
                        initCartPage(false, true);
                    }
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
