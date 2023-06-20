import { debounce } from "./utils";

export function runSlider() {
    let slider = null;
    let thumbnailSlider = null;
    let resizeObserver = null;
    let isTablet = null;

    const initializeSlider = () => {
        if (slider) {
            slider.destroy();
        }

        if (thumbnailSlider) {
            thumbnailSlider.destroy();
        }

        const axisValue = isTablet ? "horizontal" : "vertical";
        const sliderContainer = document.querySelector("#customize");
        const thumbnailContainer = document.querySelector("#customize-thumbnails");

        slider = tns({
            container: sliderContainer,
            navContainer: thumbnailContainer || undefined,
            controlsContainer: "#controls",
            items: 1,
            axis: "horizontal",
            autoplay: false,
            autoplayTimeout: 1000,
            speed: 400,
            mouseDrag: true,
            loop: false,
            controls: true,
            nav: true,
        });

        if (thumbnailContainer) {
            thumbnailSlider = tns({
                container: thumbnailContainer,
                items: 3,
                axis: axisValue,
                autoplay: false,
                autoplayTimeout: 1000,
                speed: 400,
                mouseDrag: true,
                loop: false,
                controls: true,
                controlsContainer: "#customize-controls",
                nav: false,
            });

            slider.events.on("indexChanged", function (info) {
                thumbnailSlider.goTo(info.index);
            });
        }

        return slider;
    };

    const handleResize = debounce(() => {
        const newIsTablet = window.matchMedia("(max-width: 1023px)").matches;

        if (isTablet !== null && isTablet !== newIsTablet) {
            isTablet = newIsTablet;
            initializeSlider();
        }
    }, 500);

    const setupResizeObserver = () => {
        if (resizeObserver) {
            resizeObserver.disconnect();
        }

        const sliderContainer = document.querySelector("#customize");
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(sliderContainer);
    };

    const cleanup = () => {
        if (resizeObserver) {
            resizeObserver.disconnect();
            resizeObserver = null;
        }
    };

    const init = () => {
        isTablet = window.matchMedia("(max-width: 1023px)").matches;
        initializeSlider();
        setupResizeObserver();
        window.addEventListener("resize", handleResize);
    };

    init();

    return {
        slider: slider,
        cleanup: cleanup,
    };
}
