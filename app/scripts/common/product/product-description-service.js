export function createActive(id) {
    const targetElement = document.querySelector(`.jsBodyTab[data-id="${id}"]`);
    const targetHeader = document.querySelector(`.jsNavTab[data-id="${id}"]`);
    document.querySelector('.jsNavTab.active')?.classList.remove("active");
    targetHeader?.classList.add("active");
    document.querySelector('.jsBodyTab.active')?.classList.remove("active");
    targetElement?.classList.add("active");
}

export function createActive1(id) {
    const targetElement = document.querySelector(`.jsBodyTab1[data-id="${id}"]`);
    const targetHeader = document.querySelector(`.jsNavTab1[data-id="${id}"]`);
    if (targetHeader.classList.contains('active')) {
        targetElement.classList.remove("active");
        targetHeader.classList.remove("active");
    } else {
        targetHeader.classList.add("active");
        targetElement.classList.add("active");
    }
}
