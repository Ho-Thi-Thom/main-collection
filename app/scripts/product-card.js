import { addToCart } from "./utils";

window.addEventListener('DOMContentLoaded', function () {
    const body = document.querySelector('body')
    body.addEventListener("click", (event) => {
        if (event.target.classList.contains('jsViewCart')) {
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
    })
});
