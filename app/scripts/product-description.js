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
    // const idFirstHeader = headerListMobile[0].dataset.id;
    // createActiveBodyMobile(idFirstHeader);

    headerListMobile.forEach((header) => {
        header.addEventListener("click", () => {
            const id = header.dataset.id;
            createActiveBodyMobile(id);
        });
    });
}

