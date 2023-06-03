export function readLocalStorage(key, defaultValue = []) {
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

export function setLocalStorage(key, data) {
    try {
        window.localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.log(error)
    }
}


export function getScript(selector, defaultValue) {
    try {
        return JSON.parse(selector.textContent)
    } catch (error) {
        console.log(error)
        return defaultValue
    }
}

export function createUrl(callback, initParam) {
    const urlSearchParams = new URLSearchParams(initParam)
    if (callback && typeof callback === "function") {
        callback(urlSearchParams)
    }
    return window.location.pathname + "?" + urlSearchParams.toString()

}

export function updateUrl(url, sectionId) {
    url += url.includes('?') ? '&' : '?';
    return url += `section_id=${sectionId}`;
}


export function uppercaseFirstLetter(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export function tnsSplit(text = "", splitCharacter = ";") {
    const myArray = text.split(splitCharacter);
    const spacingItem = myArray[1] ?? 0;
    const screen = myArray[0].split(",");

    return {
        spacingItem,
        screen /**[mobile, tablet, desktop] */
    }
}


export function shopifyReloadSection(callback, isShopifySectionReload = true) {
    if (callback) {
        callback()

        if (isShopifySectionReload) {
            /** shopify:section:load */
            document.addEventListener("shopify:section:load", () => {
                callback()
            });
        }
    }
}