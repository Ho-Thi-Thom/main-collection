export function closePopup() {
    const popupProduct = document.querySelector('#popup-product-item')
    popupProduct.classList.remove('active')
    const popupContent = popupProduct.querySelector('#popup-product-item .content');
    popupContent.innerHTML = ''
}

export function openPopup() {
    const popupProduct = document.querySelector('#popup-product-item')
    popupProduct.classList.add('active')
}

const btnClose = document.querySelector('#popup-product-item .close-popup div')
if (btnClose) {
    btnClose.addEventListener('click', () => {
        closePopup()
    })
}


