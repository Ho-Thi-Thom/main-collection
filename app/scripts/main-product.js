import { runSlider } from "./common/product/main-product-service";
import { pushRecently } from "./common/product/product-recently-service";
import { getScript, shopifyReloadSection } from "./common/utils/utils";
import { isWishItem, toggleWishItem } from "./common/utils//wishlist-service";
import { handleChangeFormProduct } from "./common/utils/dialog-quick-view";

const sectionId = document.querySelector('.product-section-wrapper').dataset.sectionId
shopifyReloadSection(init, sectionId)

async function init() {
    const wishList = document.querySelector('.wish-list')
    const productHandle = getScript(document.getElementById("product_handle"), "")
    const productId = getScript(document.getElementById("product_id"), "")

    const container = document.querySelector('.section-product')
    handleChangeFormProduct(null, container, runSlider)

    /** Add product to Recently local-storage */
    pushRecently(productHandle)

    /** Check if the first time you visit the page there is an active wish-list-item */
    initialWishListItem()

    /** Event click wish-list */
    toggleWishList()

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
