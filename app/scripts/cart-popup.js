const jsCartPopup = document.querySelector(".jsCartPopup")
const closeButton = document.querySelector('.jsCartPopup .header-close');

closeButton.addEventListener('click', () => {
    jsCartPopup.classList.remove('active');
});
