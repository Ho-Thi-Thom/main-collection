
const headerList = document.querySelectorAll('.jsNavTab')
const bodyList = document.querySelectorAll('.jsBodyTab')

function createActive(header, bodyList, index) {
    const body = bodyList[index];
    document.querySelector('.jsNavTab.active')?.classList.remove("active");
    header.classList.add("active");
    document.querySelector('.jsBodyTab.active')?.classList.remove("active");
    body?.classList.add("active");
}

if (headerList) {
    const initIndex = 0;
    const header = headerList[initIndex]
    createActive(header, bodyList, initIndex)

    headerList.forEach((header, index) => {
        header.addEventListener("click", () => createActive(header, bodyList, index))

    })

}