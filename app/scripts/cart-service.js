export function updateInfoCartPage(data, lineIndex) {
    const div = document.createElement("div");
    div.innerHTML = data;
    const liElement = document.querySelector(`li.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
    const liElementNew = div.querySelector(`li.cart__item.jsLineItem[data-line-index="${lineIndex}"]`);
    const jsLineUpdatesOld = liElement.querySelectorAll(".jsLineUpdate");
    const jsLineUpdatesNew = liElementNew.querySelectorAll(".jsLineUpdate");

    jsLineUpdatesOld.forEach((item, index) => {
        item.parentNode.replaceChild(jsLineUpdatesNew[index], item);
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