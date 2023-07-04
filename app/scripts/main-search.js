import *  as searchPage from "./common/search/main-search-service";
const paginateLinks = document.querySelectorAll('.paginate_link[data-url]')
const show = document.querySelector('#show')
const sort_by = document.querySelector('#sort_by')
const filterForms = document.querySelectorAll('input[type="checkbox"]')
const filterPrice = document.querySelectorAll('input[type="number"]')
init()
function init() {
    searchPage.paginate(paginateLinks)
    searchPage.addEventButtonFilter()
    searchPage.sortBy(sort_by)
    searchPage.filterForm(filterForms)
    searchPage.filterPrice(filterPrice)
    searchPage.show(show)
}

document.addEventListener("shopify:section:load", init);

