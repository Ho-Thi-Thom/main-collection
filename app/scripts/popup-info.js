import { closePopup, shopifyReloadSection } from "./utils"

function closePopupInfo() {
    const btnClose = document.querySelector('.jsClosePopup')
    if (btnClose) {
        btnClose.addEventListener('click', closePopup)
    }
}

shopifyReloadSection(closePopupInfo)