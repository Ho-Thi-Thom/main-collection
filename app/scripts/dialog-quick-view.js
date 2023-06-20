import { tns } from "tiny-slider";
import { getScript } from "./utils";
const productData = getScript(document.getElementById("popup-variants"), []);
const variants = productData.variants

slider = tns({
    container: ".popup__thumbnail-gallery",
    items: 1,
    autoplay: false,
    speed: 400,
    mouseDrag: true,
    loop: false,
    nav: false,
    controls: false,
});

const sectionId = document.querySelector('.dialog__quick-view').dataset.sectionId


const formEl = document.querySelector('.jsProductForm');
formEl.addEventListener('change', function (event) {
    if (event.target.id !== 'cart-condition') {
        const titles = variants.filter(variant => Object.values(variant).includes(event.target.value)).map(product => product.title)
        console.log(titles)
    }
})