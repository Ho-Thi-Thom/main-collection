import { tns } from "tiny-slider";
import { getScript, shopifyReloadSection, tnsSplit } from "./common/utils/utils";

const sectionId = document.querySelector('.recommendations-container').dataset.sectionId
shopifyReloadSection(init, sectionId)

function init() {
    const element = document.querySelector(".jsRecommendations")
    const data = getScript(document.getElementById("recommendation"), "");
    const { spacingItem, screen: [mobile = 2, tablet = 4, desktop = 5] } = tnsSplit(data)
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

}
