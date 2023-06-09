
import * as collection from "./common/collection/collection-function"

init()

document.addEventListener("shopify:section:load", init);

function init() {
    const infinityPoint = document.querySelector('#infinity_point')
    const sort_by = document.querySelector('#sort_by')
    const filterForms = document.querySelectorAll('input[type="checkbox"]')
    const filterPrice = document.querySelectorAll('input[type="number"]')
    const paginateLinks = document.querySelectorAll('.paginate_link[data-url]')
    const show = document.querySelector('#show')

    collection.infinity(infinityPoint)
    collection.sortBy(sort_by)
    collection.filterForm(filterForms)
    collection.filterPrice(filterPrice)
    collection.paginate(paginateLinks)
    collection.show(show)
    collection.addEventButtonFilter()
}