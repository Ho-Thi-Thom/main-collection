import { tns } from "tiny-slider";
const element = document.querySelector(".jsRecommendations")
const url = element.dataset.url;
const data = JSON.parse(document.getElementById("recommendation").textContent);
const myArray = data.split(";");
const spacingItem = myArray[1];
const [mobile, tablet, desktop] = myArray[0].split(",");


fetch(url)
    .then(response => response.text())
    .then((data) => {
        const div = document.createElement("div")
        div.innerHTML = data
        const recommendationElm = document.querySelector(".jsRecommendations");
        recommendationElm.parentNode.replaceChild(div.querySelector('.jsRecommendations'), recommendationElm)

        tns({
            container: '.tns-sli',
            slideBy: 'page',
            autoplay: false,
            loop: false,
            mouseDrag: true,
            nextButton: '.recommendation-slider ~ .next',
            prevButton: '.recommendation-slider ~ .prev',
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




