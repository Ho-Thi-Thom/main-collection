(() => {
  // app/scripts/constants.js
  var WISH_LIST_KEY = "wish-list";

  // app/scripts/utils.js
  function readLocalStorage(key, defaultValue = []) {
    try {
      const data = window.localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      return defaultValue;
    } catch (error) {
      console.log(error);
      return defaultValue;
    }
  }
  function setLocalStorage(key, data) {
    try {
      window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }

  // app/scripts/wishlist-service.js
  function getWishList() {
    return readLocalStorage(WISH_LIST_KEY, []);
  }
  function getWishListCount() {
    return getWishList().length;
  }
  function isWishItem(id) {
    const wishList = getWishList();
    const index = wishList.findIndex((item) => item === id);
    return index !== -1;
  }
  function toggleWishItem(id) {
    const data = getWishList();
    const index = data.findIndex((item) => item === id);
    const isExisted = index !== -1;
    if (isExisted) {
      data.splice(index, 1);
    } else {
      data.push(id);
    }
    setLocalStorage(WISH_LIST_KEY, data);
    updateWishListHeader();
    return isExisted;
  }
  function updateWishListHeader() {
    const jsWishList = document.querySelector(".jsWishList");
    if (jsWishList) {
      jsWishList.innerHTML = getWishListCount();
    }
  }
})();
