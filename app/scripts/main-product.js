import { checkPolicy, getValue, onVariantChange, runSlider, updateCssOption } from "./main-product-service";
import { pushRecently } from "./product-recently-service";
import { addToCart as addToCartByForm, createUrl, getScript, shopifyReloadSection, updateUrl } from "./utils";
import { isWishItem, toggleWishItem } from "./wishlist-service";


shopifyReloadSection(init)

function init() {

    const wishList = document.querySelector('.wish-list')
    const formEl = document.querySelector('.jsProductForm');
    const productData = getScript(document.getElementById("product_data"), []);
    const productOptions = getScript(document.getElementById("product_options"), []);
    const productHandle = getScript(document.getElementById("product_handle"), "")
    const productId = getScript(document.getElementById("product_id"), "")
    const variants = productData.variants

    const removeBtn = document.querySelector('.remove__qlt');
    const addBtn = document.querySelector('.add__qlt');
    const quantityInput = document.querySelector('.quantity__input');
    const formProduct = document.getElementById('jsFormProduct');

    const slider = runSlider()

    formEl.addEventListener('change', function (event) {
        if (event.target.id !== 'cart-condition') {
            const titles = variants.filter(variant => Object.values(variant).includes(event.target.value)).map(product => product.title)
            onVariantChange(() => getUrl(formEl.dataset.sectionId));
            updateCssOption(titles, productOptions, event.target.name);
        }
    })
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


    /** Khi vào trang product thì push vào local-storage */
    pushRecently(productHandle)

    /** Kiểm tra lần đầu vào trang có active wish-list-item không */
    initialWishListItem()

    /** Event click wish-list */
    toggleWishList()

    /** Event add to cart */
    addToCart()
    /** Check input policy */
    checkPolicy();

    function initialWishListItem() {
        if (isWishItem(productId)) {
            wishList.classList.add("active")
        }
    }

    function toggleWishList() {
        wishList?.addEventListener("click", function () {
            const isExisted = toggleWishItem(productId)

            if (isExisted) {
                wishList.classList.remove("active")
            } else {
                wishList.classList.add("active")
            }
        })
    }

    function getUrl(sectionId) {
        const selects = document.querySelectorAll('.js-variant-change');
        const radios = document.querySelectorAll('.js-radio');

        const value = getValue(selects, radios)
        const data = variants.find(variant => {
            return variant.options.join('/') == value.join('/')
        })

        if (!data) {
            return
        }

        slider.goTo(data.featured_image.position - 1);
        const url = createUrl(function (searchParams) {
            searchParams.set('variant', data.id);
        })

        history.pushState(null, null, url);

        return updateUrl(url, sectionId)
    }


    function addToCart() {
        // type =  b thì hiện thông báo, bằng a =
        if (formProduct && formProduct.dataset.type === 'b') {
            formProduct.addEventListener('submit', function (event) {
                event.preventDefault();
                const productFormData = Object.fromEntries(new FormData(event.target).entries());
                let formData = {
                    "items": [productFormData]
                }
                addToCartByForm(formData)
            });
        }
    }


    // window.onscroll = function () { scrollFunction() };
    // function scrollFunction() {

    //     if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
    //         document.getElementById("btn-arrow-top").style.display = "block";
    //     } else {
    //         document.getElementById("btn-arrow-top").style.display = "none";
    //     }
    // }

    // document.getElementById('btn-arrow-top').addEventListener("click", function () {
    //     document.body.scrollTop = 0;
    //     document.documentElement.scrollTop = 0;
    // });

}