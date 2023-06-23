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


