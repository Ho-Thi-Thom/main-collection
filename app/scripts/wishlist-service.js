import { WISH_LIST_KEY } from "./constants"
import { readLocalStorage, setLocalStorage } from "./utils"

export function getWishList() {
    return readLocalStorage(WISH_LIST_KEY, [])
}

export function getWishListCount() {
    return getWishList().length
}

export function isWishItem(id) {
    const wishList = getWishList()
    const index = wishList.findIndex(item => item === id)
    return index !== -1
}

export function toggleWishItem(id) {
    const data = getWishList()
    const index = data.findIndex(item => item === id)
    const isExisted = index !== -1

    if (isExisted) {
        data.splice(index, 1)
    } else {
        data.push(id)
    }

    setLocalStorage(WISH_LIST_KEY, data)
    updateWishListHeader()

    return isExisted
}

export function updateWishListHeader() {
    const jsWishList = document.querySelector('.jsWishList');

    if (jsWishList) {
        jsWishList.innerHTML = getWishListCount()
    }
}