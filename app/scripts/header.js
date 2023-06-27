import { initCartPage } from "./cart";
import { handelActivePopup, updateCartPopup } from "./cart-popup";
import { debounce } from "./common/utils/utils";

const menuButton = document.querySelector('.header-bugger');
const menu = document.querySelector('.header-menu');
const closeButton = document.querySelector('.header-close');
const body = document.querySelector('#bg-color');


menuAction(menuButton, function () {
    menu.classList.toggle('active');
    body.classList.toggle('body-overlay');
})

menuAction(closeButton, function () {
    menu.classList.remove('active');
    body.classList.remove('body-overlay');
});

function menuAction(selector, callback) {
    selector.addEventListener("click", callback)
}

const jsViewPopupCart = document.querySelector('.jsViewPopupCart')
jsViewPopupCart.addEventListener('click', async () => {
    const check = await updateCartPopup()
    if (check) {
        debounce(handelActivePopup(), 500)
        initCartPage(false, true);
    }
})