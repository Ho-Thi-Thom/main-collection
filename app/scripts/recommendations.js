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