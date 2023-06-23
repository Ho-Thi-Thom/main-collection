(() => {
  // app/scripts/header.js
  var menuButton = document.querySelector(".header-bugger");
  var menu = document.querySelector(".header-menu");
  var closeButton = document.querySelector(".header-close");
  var body = document.querySelector("#bg-color");
  menuAction(menuButton, function() {
    menu.classList.toggle("active");
    body.classList.toggle("body-overlay");
  });
  menuAction(closeButton, function() {
    menu.classList.remove("active");
    body.classList.remove("body-overlay");
  });
  function menuAction(selector, callback) {
    selector.addEventListener("click", callback);
  }
})();
