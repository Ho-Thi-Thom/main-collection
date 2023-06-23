import { readLocalStorage, setLocalStorage } from "../utils/utils";
import { RECENTLY_LIST_KEY, WISH_LIST_KEY } from "../utils/constants"

export function getRecentlyList() {
    return readLocalStorage(RECENTLY_LIST_KEY, [])
};

export function setRecentlyList(data) {
    setLocalStorage(RECENTLY_LIST_KEY, data)
};

export function pushRecently(handle) {
    if (handle) {
        const data = getRecentlyList();
        const index = data.findIndex(item => item === handle);
        if (index > -1) {
            data.splice(index, 1);
        }
        data.unshift(handle);
        let newData = data.length > 11 ? data.slice(0, 10) : data;
        setRecentlyList(newData)
    }
};
