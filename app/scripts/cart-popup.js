
export function handelClose() {
    const jsCartPopup = document.querySelector(".jsCartPopup")
    const closeButton = document.querySelector('.jsCartPopup .popup__header-close');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            jsCartPopup.classList.remove('active');
            const overlay = document.querySelector('#bg-color')
            overlay.classList.remove('body-overlay')
        });
    }

}

handelClose()

export function handelActivePopup() {
    const jsCartPopup = document.querySelector(".jsCartPopup")
    jsCartPopup.classList.add('active')
    const overlay = document.querySelector('#bg-color')
    overlay.classList.add('body-overlay')
}

export async function fetchDataCart(sectionId) {
    try {
        const response = await fetch(window.location.pathname + `?section_id=${sectionId}`);
        const data = await response.text();
        return data
    } catch (error) {
        return error;
    }
}

export async function updateCartPopup() {
    const elementPopup = document.querySelector('.jsCartPopup');
    const sectionId = elementPopup.dataset.sectionId;
    const data = await fetchDataCart(sectionId);
    const div = document.createElement("div");
    div.innerHTML = data;
    const cartPopup = div.querySelector('.jsCartPopup')
    const elements = cartPopup.querySelectorAll('.jsPopupUpdate');
    const oldElement = document.querySelectorAll('.jsCartPopup .jsPopupUpdate');
    oldElement.forEach((item, index) => {
        item.parentNode.replaceChild(elements[index], item);
    })
    return true
}