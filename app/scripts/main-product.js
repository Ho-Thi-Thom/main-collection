const selects = document.querySelectorAll('.js-variant-change');
const radio = document.querySelectorAll('input[type="radio"]');
const productData = JSON.parse(document.getElementById("product_data").textContent);
// const variantsDataSet = document.getElementById("varients");
// const variantQt = variantsDataSet.dataset.variants;
// console.log(variantQt);
const variants = productData.variants

function createUrl(callback) {
    const urlSearchParams = new URLSearchParams()
    callback(urlSearchParams)
    return window.location.pathname + "?" + urlSearchParams.toString()

}
function getApi(url) {
    return fetch(url).then(res => res.text())
}

async function onVariantChange(sectionId) {
    const value = getValue();
    const result = getVariant(value);
    console.log(`shopify-section-${sectionId}`)
    function callback(searchParams) {
        searchParams.set('section_id', sectionId);
        searchParams.set('varient', result.id);
    }
    const _url = createUrl(callback)
    getApi(_url).then(data => {
        const div = document.createElement("div");
        div.innerHTML = data;

    })
    const comparePrice = document.querySelector('.compare-price')
    const price = document.getElementsByName("price");
    const variantInventory = document.getElementsByName("variant-inventory");
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