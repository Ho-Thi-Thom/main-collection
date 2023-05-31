import { tns } from "tiny-slider";
const element = document.querySelector(".jsRecommendations")
const url = element.dataset.url;

fetch(url)
    .then(response => response.text())
    .then((data) => {
        const div = document.createElement("div")
        div.innerHTML = data
        const recommendationElm = document.querySelector(".jsRecommendations");
        recommendationElm.parentNode.replaceChild(div.querySelector('.jsRecommendations'), recommendationElm)

        tns({
            container: '.tns-sli',
            items: 4,
            slideBy: 'page',
            autoplay: false,
            loop: false,
            mouseDrag: true,
            nextButton: '.recommendation-slider ~ .next',
            prevButton: '.recommendation-slider ~ .prev',
        });
    })

// function runSlider() {
//     tns({
//         container: ".recommendation-slider",
//         items: 3,
//         axis: "horizontal",
//         autoplay: true,
//         autoplayTimeout: 1000,
//         speed: 400,
//         mouseDrag: true,
//         loop: false,
//         nextButton: '.recommendation-slider ~ .next',
//         prevButton: '.recommendation-slider ~ .prev',

//     });
// }

// runSlider()
// document.addEventListener("shopify:section:load", () => {
//     runSlider()
// });




