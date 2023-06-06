
import { tns } from "tiny-slider";
import { getRecentlyList } from "./product-recently-service";
import { getScript, shopifyReloadSection, tnsSplit } from "./utils";
import { RECENTLY_LIST_KEY } from "./constants";
import { setLocalStorage } from "./utils";

shopifyReloadSection(init)


function init() {
    const jsRecently = document.querySelector('.jsRecently')
    const data = getScript(document.getElementById("recently"));
    const { spacingItem, screen: [mobile = 2, tablet = 4, desktop = 5] } = tnsSplit(data)

    updateRecently()

    function updateRecently() {
        function removeItemRecently(listHandle, listHandleInvalid) {
            const filteredList = listHandle.filter(item => !listHandleInvalid.includes(item));
            setLocalStorage(RECENTLY_LIST_KEY, filteredList);
        }

        const updateData = async () => {
            const recently = document.querySelector('.recently')
            const sectionId = jsRecently.dataset.sectionId
            const productCurrent = jsRecently.dataset.productHandel
            const listHandle = getRecentlyList();
            const listHandleInvalid = []
            const listPromises = listHandle.filter(item => item !== productCurrent).map(item => {
                return fetch(`/products/${item}?section_id=${sectionId}`);
            })

            const promises = await Promise.all(listPromises)

            const data = []
            for (const res of promises) {
                const html = await res.text()
                data.push(html)
            }

            if (data.length === 0) {
                return
            }

            data.forEach((html) => {
                const div = document.createElement("div")
                div.innerHTML = html
                const elementHidden = div.querySelector('.jsRecently .hidden a')
                const hrefValue = elementHidden.getAttribute("href") ?? null;

                if (!hrefValue) {
                    listHandleInvalid.push(html)
                } else {
                    recently?.appendChild(elementHidden);
                }
            })

            if (listHandleInvalid.length > 0) {
                removeItemRecently(listHandle, listHandleInvalid)
            }


            tns({
                container: '.recently',
                slideBy: 'page',
                autoplay: false,
                loop: false,
                mouseDrag: true,
                nextButton: '.recently ~ .next',
                prevButton: '.recently ~ .prev',
                gutter: spacingItem,
                responsive: {
                    0: {
                        items: mobile
                    },
                    768: {
                        items: tablet
                    },
                    1024: {
                        items: desktop
                    }
                }
            });
        }
        updateData()
    }

}
