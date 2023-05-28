import { tns } from "tiny-slider";



export function runSlider() {
    var slider = tns({
        container: ".thumbnail-slider",
        navContainer: ".customize-thumbnails",
        items: 1,
        axis: "horizontal",
        autoplay: false,
        autoplayTimeout: 1000,
        speed: 400,
        mouseDrag: true,
        loop: false,
        nextButton: '.thumbnail-slider ~ .next',
        prevButton: '.thumbnail-slider ~ .prev',

    });

    var sliderCustom = tns({
        container: ".customize-thumbnails",
        items: 4,
        axis: "vertical",
        autoplay: false,
        autoplayTimeout: 1000,
        speed: 400,
        loop: false,
        mouseDrag: true,
        nextButton: '.customize-thumbnails ~ .next',
        prevButton: '.customize-thumbnails ~ .prev',

    });


    slider.events.on('indexChanged', function (info) {
        sliderCustom.goTo(info.index)
    })

    window.mainSlider = slider;
}
runSlider()
document.addEventListener("shopify:section:load", () => {
    runSlider()
});