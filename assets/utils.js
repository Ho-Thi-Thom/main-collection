(() => {
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
  function getScript(selector, defaultValue) {
    try {
      return JSON.parse(selector.textContent);
    } catch (error) {
      console.log(error);
      return defaultValue;
    }
  }
  function createUrl(callback, initParam) {
    const urlSearchParams = new URLSearchParams(initParam);
    if (callback && typeof callback === "function") {
      callback(urlSearchParams);
    }
    return window.location.pathname + "?" + urlSearchParams.toString();
  }
  function updateUrl(url, sectionId) {
    url += url.includes("?") ? "&" : "?";
    return url += `section_id=${sectionId}`;
  }
  function uppercaseFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  function tnsSplit(text = "", splitCharacter = ";") {
    const myArray = text.split(splitCharacter);
    const spacingItem = myArray[1] ?? 0;
    const screen = myArray[0].split(",");
    return {
      spacingItem,
      screen
    };
  }
  function shopifyReloadSection(callback, isShopifySectionReload = true) {
    if (callback) {
      callback();
      if (isShopifySectionReload) {
        document.addEventListener("shopify:section:load", () => {
          callback();
        });
      }
    }
  }
  function setValuePopupInfo(options) {
    const popupInfo = document.querySelector("#popup-info");
    const titleElm = document.querySelector("#popup-info .title");
    const contentElm = document.querySelector("#popup-info .wrapper-content");
    const { type, title, textContent } = options;
    titleElm.setAttribute("data-type", type);
    titleElm.innerHTML = title.trim();
    contentElm.innerHTML = textContent.trim();
    popupInfo.classList.add("active");
  }
  function closePopup() {
    const popupInfo = document.querySelector("#popup-info");
    popupInfo.classList.remove("active");
  }
  function debounce(fn, delay) {
    var timeoutID = null;
    return function() {
      clearTimeout(timeoutID);
      var args = arguments;
      var that = this;
      timeoutID = setTimeout(function() {
        fn.apply(that, args);
      }, delay);
    };
  }
})();
