const selects = document.querySelectorAll('.js-variant-change');
const radio = document.querySelectorAll('input[type="radio"]');
const productData = JSON.parse(document.getElementById("product_data").textContent);
const variants = productData.variants

function createUrl(callback) {
    const urlSearchParams = new URLSearchParams()
    callback(urlSearchParams)
    return window.location.pathname + "?" + urlSearchParams.toString()

}

function updateElementPrice(divCompare, divPrice) {
    const cpPrice = document.querySelector('.compare-price')
    const price = document.querySelector(".price")
    cpPrice.parentNode.replaceChild(divCompare, cpPrice)
    price.parentNode.replaceChild(divPrice, price)
}

function updateElementVariantInventory(element) {
    const variantInventory = document.querySelector(".variant-inventory");
    variantInventory.parentNode.replaceChild(element, variantInventory)

}

function updateElementSKU(element) {
    const sku = document.querySelector(".product-sku");
    sku.parentNode.replaceChild(element, sku)
}

function onVariantChange(sectionId) {
    const value = getValue();
    const result = getVariant(value);
    function callback(searchParams) {
        searchParams.set('section_id', sectionId);
        searchParams.set('variant', result.id);
    }
    const _url = createUrl(callback)
    fetch(_url)
        .then(res => res.text())
        .then(data => {
            const div = document.createElement("div");
            div.innerHTML = data;
            updateElementPrice(div.querySelector('.compare-price'), div.querySelector(".price"));
            updateElementVariantInventory(div.querySelector(".variant-inventory"))
            updateElementSKU(div.querySelector(".product-sku"))
        })
}

const formEl = document.querySelector('.jsProductForm');
formEl.addEventListener('change', e => {
    onVariantChange(formEl.dataset.sectionId);
})

function getVariant(data) {
    return variants.find(variant => {
        return variant.options.join('/') == data.join('/')
    })
}


function getValue() {
    const inputsData = [];

    selects.forEach(select => {
        const options = select.querySelectorAll('option');

        options.forEach(option => {
            const value = option.value;
            const checked = option.selected;
            if (checked) {
                inputsData.push(value);
            }
        });
    });

    radio.forEach(input => {
        const value = input.value;
        const checked = input.checked;
        if (checked) {
            inputsData.push(value);
        }
    });
    return inputsData;
}



//  change quantity
const removeBtn = document.querySelector('.remove__qlt');
const addBtn = document.querySelector('.add__qlt');
const quantityInput = document.querySelector('.quantity__input');

removeBtn.addEventListener('click', function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
        quantityInput.value = currentValue - 1;
    }
});

addBtn.addEventListener('click', function () {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
});

// event enter
quantityInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
    }
});