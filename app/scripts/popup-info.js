import { shopifyReloadSection } from "./common/utils/utils"

function closePopupInfo() {
    const btnClose = document.querySelector('.jsClosePopup')
    if (btnClose) {
        btnClose.addEventListener('click', () => {
            const popupInfo = document.querySelector("#popup-info")
            popupInfo.classList.remove('active')
        })
    }
}

shopifyReloadSection(closePopupInfo)