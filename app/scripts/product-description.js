import { createActiveBodyDesktop, createActiveBodyMobile } from "./common/product/product-description-service";

const headerList = document.querySelectorAll('.jsNavTabDesktop');
const headerListMobile = document.querySelectorAll('.jsNavTabMobile');

if (headerList.length > 0) {
    const idFirstHeader = headerList[0].dataset.id;
    createActiveBodyDesktop(idFirstHeader);

    headerList.forEach((header) => {
        header.addEventListener("click", () => {
            const id = header.dataset.id;
            createActiveBodyDesktop(id);
        });
    });
}

if (headerListMobile.length > 0) {

    headerListMobile.forEach((header) => {
        header.addEventListener("click", () => {
            const id = header.dataset.id;
            createActiveBodyMobile(id);
        });
        const mobileTab = header.nextElementSibling;
        mobileTab.style.setProperty('--height', mobileTab.scrollHeight + 'px');
        const obsever = new MutationObserver(() => {
            mobileTab.style.setProperty('--height', mobileTab.scrollHeight + 'px');

        })
        obsever.observe(mobileTab, { subtree: true, childList: true })
    });
}

