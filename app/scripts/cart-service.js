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