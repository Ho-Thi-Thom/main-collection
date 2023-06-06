import { shopifyReloadSection } from "./utils";

window.addEventListener('DOMContentLoaded', function () {
    const body = document.querySelector('body')
    body.addEventListener("click", (event) => {
        if (event.target.classList.contains('jsViewCart')) {
            event.preventDefault()
            console.log(event.dataset.variantId)
        }
    })
});
// function viewCart() {
// }

// shopifyReloadSection(viewCart)
