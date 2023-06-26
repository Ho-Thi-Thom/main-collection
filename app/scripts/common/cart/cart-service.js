import { setValuePopupInfo } from "../utils/utils";

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

async function countItemCart() {
    try {
        const response = await fetch(window.Shopify.routes.root + 'cart.js');
        const data = await response.json();
        return data.item_count;
    } catch (error) {
        return error;
    }
}

export async function updateCountCart() {
    try {
        const count = await countItemCart();
        const elm = document.querySelector('.jsCountItemCart');
        elm.textContent = count;
    } catch (error) {
        console.error(error);
    }
}

export function addToCart(data, isPopupInfo = true) {
    return new Promise((resolve, reject) => {
        fetch(window.Shopify.routes.root + 'cart/add.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => {
                switch (res.status) {
                    case 200:
                        res.json().then((data) => {
                            const options = {
                                type: "success",
                                title: "Add to Cart",
                                textContent: `Add success "${data.items[0].product_title}"`
                            };

                            updateCountCart();
                            if (isPopupInfo) {
                                setValuePopupInfo(options);
                            }
                            resolve(true); // Resolve with success status
                        });
                        break;
                    case 404:
                        resolve(false); // Resolve with failure status
                        break;
                    case 422:
                        res.json().then((data) => {
                            const options = {
                                type: "error",
                                title: "422",
                                textContent: data.description
                            };

                            setValuePopupInfo(options);
                            resolve(false); // Resolve with failure status
                        });
                        break;
                    default:
                        resolve(false); // Resolve with failure status
                        break;
                }
            })
            .catch((error) => {
                console.log('Error:', error);
                reject(error); // Reject with the error
            });
    });
}
