
import { tns } from "tiny-slider";
const data = JSON.parse(document.getElementById("recently").textContent);
const myArray = data.split(";");
const spacingItem = myArray[1];
const [mobile, tablet, desktop] = myArray[0].split(",");

function updateRecently() {
    const jsRecently = document.querySelector('.jsRecently')
    const RECENTLY_LIST_KEY = "recently-list";

    const getRecentlyList = () => {
        try {
            const data = window.localStorage.getItem(RECENTLY_LIST_KEY);
            if (data) {
                return JSON.parse(data);
            }
            return [];
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    function removeItemRecently(listHandle, listHandleInvalid) {
        const RECENTLY_LIST_KEY = "recently-list";
        const filteredList = listHandle.filter(item => !listHandleInvalid.includes(item));
        window.localStorage.setItem(RECENTLY_LIST_KEY, JSON.stringify(filteredList));
    }

    const updateData = async () => {
        const sectionId = jsRecently.dataset.sectionId
        const productCurrent = jsRecently.dataset.productHandel
        const listHandle = getRecentlyList();
        const listHandleInvalid = []
        const list = listHandle.map(async item => {
            if (item === productCurrent) {
                return null
            }
            const url = `/products/${item}?section_id=${sectionId}`
            const res = await fetch(url);
            const data = await res.text();
            const div = document.createElement("div")
            div.innerHTML = data
            const elementHidden = div.querySelector('.jsRecently .hidden .card')
            const hrefValue = elementHidden ? (elementHidden.querySelector('a') ? elementHidden.querySelector('a').getAttribute('href') : null) : null;
            if (!hrefValue) {
                listHandleInvalid.push(item)
                return null
            }
            return elementHidden
        })
        const data = await Promise.all(list);
        if (listHandleInvalid.length > 0) {
            removeItemRecently(listHandle, listHandleInvalid)
        }
        const recently = document.querySelector('.recently')
        data.forEach(item => {
            if (item) {
                recently.appendChild(item);
            }
        })

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

updateRecently()

