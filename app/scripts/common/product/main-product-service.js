import { tns } from "tiny-slider";
import { debounce } from "../utils/utils";

export function runSlider() {
    let slider = null;
    let sliderCustom = null;

    const initializeSlider = () => {
        const isTablet = window.matchMedia("(max-width: 1023px)").matches;
        const axisValue = isTablet ? "horizontal" : "vertical";

        if (slider) {
            slider.destroy();
        }

        if (sliderCustom) {
            sliderCustom.destroy();
        }

        slider = tns({
            container: ".thumbnail-slider",
            navContainer: ".customize-thumbnails",
            items: 1,
            axis: "horizontal",
            autoplay: false,
            autoplayTimeout: 1000,
            speed: 400,
            mouseDrag: true,
            loop: false,
            nextButton: ".thumbnail-slider ~ .next",
            prevButton: ".thumbnail-slider ~ .prev",
        });

        sliderCustom = tns({
            container: ".customize-thumbnails",
            items: 4,
            axis: axisValue,
            autoplay: false,
            autoplayTimeout: 1000,
            speed: 400,
            loop: false,
            mouseDrag: true,
            nav: false,
            nextButton: ".customize-thumbnails ~ .next",
            prevButton: ".customize-thumbnails ~ .prev",
        });

        slider.events.on("indexChanged", function (info) {
            sliderCustom.goTo(info.index);
        });
    };

    initializeSlider();

    const debouncedInitializeSlider = debounce(initializeSlider, 500);
    window.addEventListener("resize", debouncedInitializeSlider);

    return { slider: slider, cleanup: () => { } };
}
