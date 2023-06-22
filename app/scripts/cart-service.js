export function updateInfoCartPage(data, lineIndex, checkRemove) {
    const div = document.createElement("div");
    div.innerHTML = data;
    const liElement = document.querySelector(`li.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
    if (!checkRemove) {
        const liElementNew = div.querySelector(`li.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
        const jsLineUpdatesOld = liElement.querySelectorAll(".jsLineUpdate");
        const jsLineUpdatesNew = liElementNew.querySelectorAll(".jsLineUpdate");
        jsLineUpdatesOld.forEach((item, index) => {
            item.parentNode.replaceChild(jsLineUpdatesNew[index], item);
        });
    } else {
        liElement.remove()
    }
    const jsCartUpdateOld = document.querySelectorAll('.js-cart-update')
    const jsCartUpdateNew = div.querySelectorAll('.js-cart-update')

    jsCartUpdateOld.forEach((item, index) => {
        item.parentNode.replaceChild(jsCartUpdateNew[index], item);
    });


}

export function updateDataCart(note) {
    fetch('/cart/update.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ note }),
    })
}

export async function fetchAPIUpdateItemCart(options) {
    const { variantId, newQuantity, sectionId } = options;

    const data = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: variantId,
            quantity: newQuantity,
            sections: sectionId
        })
    })
    const res = await data.json();
    return res
}


export function checkMax(input, type, lineIndex) {
    const btnAdd = document.querySelector(`.cart__item.jsLineItem[data-line-index="${lineIndex}"] .add__qlt`);
    switch (type) {
        case 'add':
            if (+input.value === +input.max) {
                btnAdd.disabled = true;
            }
            break;
        case 'remove':
            btnAdd.disabled = false;
            break;
        default:
            break;
    }
}

export function checkListCart() {
    const liElements = document.querySelectorAll('.jsLineItem');
    liElements.forEach((liElement) => {
        const inputElement = liElement.querySelector('.quantity__input');
        const maxValue = parseInt(inputElement.getAttribute('max'));
        const addButton = liElement.querySelector('.add__qlt');

        if (inputElement.value === maxValue.toString()) {
            addButton.disabled = true;
        } else {
            addButton.disabled = false;
        }
    });
}
