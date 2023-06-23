import { createActive, createActive1 } from "./common/product/product-description-service";

const headerList = document.querySelectorAll('.jsNavTab');
const headerList1 = document.querySelectorAll('.jsNavTab1');
const bodyList = document.querySelectorAll('.jsBodyTab');
const bodyList1 = document.querySelectorAll('.jsBodyTab1');

if (headerList.length > 0) {
    const idFirstHeader = headerList[0].dataset.id;
    createActive(idFirstHeader);

    headerList.forEach((header) => {
        header.addEventListener("click", () => {
            const id = header.dataset.id;
            createActive(id);
        });
    });
}

if (headerList1.length > 0) {
    const idFirstHeader = headerList1[0].dataset.id;
    createActive1(idFirstHeader);

    headerList1.forEach((header) => {
        header.addEventListener("click", () => {
            const id = header.dataset.id;
            createActive1(id);
        });
    });
}

