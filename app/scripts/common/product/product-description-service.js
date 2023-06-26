export function createActiveBodyDesktop(id) {
    const targetElement = document.querySelector(`.jsBodyTabDesktop[data-id="${id}"]`);
    const targetHeader = document.querySelector(`.jsNavTabDesktop[data-id="${id}"]`);
    document.querySelector('.jsNavTabDesktop.active')?.classList.remove("active");
    targetHeader?.classList.add("active");
    document.querySelector('.jsBodyTabDesktop.active')?.classList.remove("active");
    targetElement?.classList.add("active");
}

export function createActiveBodyMobile(id) {
    const targetElement = document.querySelector(`.jsBodyTabMobile[data-id="${id}"]`);
    const targetHeader = document.querySelector(`.jsNavTabMobile[data-id="${id}"]`);
    if (targetHeader.classList.contains('active')) {
        targetElement.classList.remove("active");
        targetHeader.classList.remove("active");
    } else {
        targetHeader.classList.add("active");
        targetElement.classList.add("active");
    }
}
