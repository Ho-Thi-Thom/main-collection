(() => {
  // app/scripts/constants.js
  var RECENTLY_LIST_KEY = "recently-list";

  // app/scripts/utils.js
  function readLocalStorage(key, defaultValue = []) {
    try {
      const data = window.localStorage.getItem(key);
      console.log(key, data);
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

  // app/scripts/product-recently-service.js
  function getRecentlyList() {
    return readLocalStorage(RECENTLY_LIST_KEY, []);
  }
  function setRecentlyList(data) {
    setLocalStorage(RECENTLY_LIST_KEY, data);
  }
  function pushRecently(handle) {
    if (handle) {
      const data = getRecentlyList();
      const index = data.findIndex((item) => item === handle);
      if (index > -1) {
        data.splice(index, 1);
      }
      data.unshift(handle);
      let newData = data.length > 11 ? data.slice(0, 10) : data;
      setRecentlyList(newData);
    }
  }
})();
