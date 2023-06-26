import { addToCart } from "../cart/cart-service";
import { checkPolicy, getValue, onVariantChange, runSlider, updateCssOption } from "./dialog-quick-view-service";
import { createUrl, createUrlCustom, getScript, updateUrl } from "./utils";

export function handleChangeFormProduct(newUrl = null, container = document, runSlider) {
    const formEl = container.querySelector('.jsProductForm');
    const productOptions = getScript(container.querySelector("#popup_product_options"), []);
    const productData = getScript(container.querySelector("#popup-variants"), []);
    const variants = productData.variants
    const { slider, cleanup } = runSlider()
    const removeBtn = container.querySelector('.remove__qlt');
    const addBtn = container.querySelector('.add__qlt');
    const quantityInput = container.querySelector('.quantity__input');
    const formProduct = container.querySelector('#jsFormProduct');

    formEl.addEventListener('change', function (event) {
        if (event.target.id !== 'cart-condition') {
            const titles = variants.filter(variant => Object.values(variant).includes(event.target.value)).map(product => product.title)
            onVariantChange(() => getUrl(formEl.dataset.sectionId, slider));
            updateCssOption(titles, productOptions, event.target.name);
        }
    })

    function getUrl(sectionId, slider) {
        const selects = container.querySelectorAll('.js-variant-change');
        const radios = container.querySelectorAll('.js-radio');

        const value = getValue(selects, radios)
        const data = variants.find(variant => {
            return variant.options.join('/') == value.join('/')
        })
        if (!data) {
            return
        }
        if (data.featured_image !== null) {
            slider.goTo(data.featured_image.position - 1);
        }

        let url = '';
        if (newUrl) {
            url = createUrlCustom(newUrl, undefined, function (searchParams) {
                searchParams.set('variant', data.id);
            })
        } else {
            url = createUrl(function (searchParams) {
                searchParams.set('variant', data.id);
            })

            history.pushState(null, null, url);
        }

        return updateUrl(url, sectionId)
    }

    //  change quantity
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

    /** Event add to cart */
    addToCartByForm()

    /** Check input policy */
    checkPolicy();

    function addToCartByForm() {
        // type =  b thì hiện thông báo, bằng a =
        if (formProduct && formProduct.dataset.type === 'b') {
            formProduct.addEventListener('submit', function (event) {
                event.preventDefault();
                const productFormData = Object.fromEntries(new FormData(event.target).entries());
                let formData = {
                    "items": [productFormData]
                }
                addToCart(formData)
            });
        }
    }
}

// handleChangeFormProduct()
export function jsDialogQuickView(newUrl, container) {
    handleChangeFormProduct(newUrl, container, runSlider)
}