const jsCartPopup = document.querySelector(".jsCartPopup")
const closeButton = document.querySelector('.jsCartPopup .header-close');
const body = document.querySelector('#bg-color');
closeButton.addEventListener('click', () => {
    jsCartPopup.classList.remove('active');
    body.classList.remove('body-overlay');
});
