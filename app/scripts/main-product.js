import { runSlider } from "./common/product/main-product-service";
import { pushRecently } from "./common/product/product-recently-service";
import { addToCart, getScript, shopifyReloadSection } from "./common/utils/utils";
import { addToCart } from "./common/cart/cart-service"
import { isWishItem, toggleWishItem } from "./common/utils//wishlist-service";
import { initQuickView } from "./common/utils/dialog-quick-view";

const sectionId = document.querySelector('.product-section-wrapper').dataset.sectionId
shopifyReloadSection(init, sectionId)

function init() {
    const wishList = document.querySelector('.wish-list')
    const productHandle = getScript(document.getElementById("product_handle"), "")
    const productId = getScript(document.getElementById("product_id"), "")

    initQuickView(null, document, runSlider)

    /** Khi vào trang product thì push vào local-storage */
    pushRecently(productHandle)

    /** Kiểm tra lần đầu vào trang có active wish-list-item không */
    initialWishListItem()

    /** Event click wish-list */
    toggleWishList()

    /** Event add to cart */
    addToCart()

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
}
