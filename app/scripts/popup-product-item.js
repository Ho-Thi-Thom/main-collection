export function closePopup() {
    const popupProduct = document.querySelector('#popup-product-item')
    popupProduct.classList.remove('active')
}

export function openPopup() {
    const popupProduct = document.querySelector('#popup-product-item')
    popupProduct.classList.add('active')
}

const btnClose = document.querySelector('#popup-product-item .close-popup')
if (btnClose) {
    btnClose.addEventListener('click', () => {
        closePopup()
    })
}