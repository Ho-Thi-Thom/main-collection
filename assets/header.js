(() => {
  // app/scripts/header-service.js
  function menuAction(selector, callback) {
    selector.addEventListener("click", callback);
  }

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

  // app/scripts/wishlist-service.js
  function getWishList() {
    return readLocalStorage(WISH_LIST_KEY, []);
  }
  function getWishListCount() {
    return getWishList().length;
  }
  function updateWishListHeader() {
    const jsWishList2 = document.querySelector(".jsWishList");
    jsWishList2.innerHTML = getWishListCount();
  }

  // app/scripts/header.js
  var menuButton = document.querySelector(".header-bugger");
  var menu = document.querySelector(".header-menu");
  var closeButton = document.querySelector(".header-close");
  var body = document.querySelector("#bg-color");
  var jsWishList = document.querySelector(".jsWishList");
  menuAction(menuButton, function() {
    menu.classList.toggle("active");
    body.classList.toggle("body-overlay");
  });
  menuAction(closeButton, function() {
    menu.classList.remove("active");
    body.classList.remove("body-overlay");
  });
  updateWishListHeader();
})();
