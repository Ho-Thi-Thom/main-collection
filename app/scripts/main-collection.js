
import * as collection from "./collection-function"

init()

document.addEventListener("shopify:section:load", init);

function init() {
    const infinityPoint = document.querySelector('#infinity_point')
    const sort_by = document.querySelector('#sort_by')
    const filterForms = document.querySelectorAll('input[type="checkbox"]')
    const filterPrice = document.querySelectorAll('input[type="number"]')
    const paginateLinks = document.querySelectorAll('.paginate_link[data-url]')

    collection.infinity(infinityPoint)
    collection.sortBy(sort_by)
    collection.filterForm(filterForms)
    collection.filterPrice(filterPrice)
    collection.paginate(paginateLinks)
}