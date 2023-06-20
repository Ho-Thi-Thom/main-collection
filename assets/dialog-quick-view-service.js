(() => {
  // app/scripts/utils.js
  function debounce(fn, delay) {
    var timeoutID = null;
    return function() {
      clearTimeout(timeoutID);
      var args = arguments;
      var that = this;
      timeoutID = setTimeout(function() {
        fn.apply(that, args);
      }, delay);
    };
  }

  // app/scripts/dialog-quick-view-service.js
  function runSlider() {
    let slider = null;
    let thumbnailSlider = null;
    const initializeSlider = () => {
      console.log(slider);
      if (slider) {
        slider.destroy();
      }
      if (thumbnailSlider) {
        thumbnailSlider.destroy();
      }
      const isTablet = window.matchMedia("(max-width: 1023px)").matches;
      const axisValue = isTablet ? "horizontal" : "vertical";
      let sliderContainer = document.querySelector("#customize");
      const thumbnailContainer = document.querySelector("#customize-thumbnails");
      slider = tns({
        container: sliderContainer,
        navContainer: thumbnailContainer || void 0,
        controlsContainer: "#controls",
        items: 1,
        axis: "horizontal",
        autoplay: false,
        autoplayTimeout: 1e3,
        speed: 400,
        mouseDrag: true,
        loop: false,
        controls: true,
        nav: true
      });
      if (thumbnailContainer) {
        thumbnailSlider = tns({
          container: thumbnailContainer,
          items: 3,
          axis: axisValue,
          autoplay: false,
          autoplayTimeout: 1e3,
          speed: 400,
          mouseDrag: true,
          loop: false,
          controls: true,
          controlsContainer: "#customize-controls",
          nav: true
        });
        slider.events.on("indexChanged", function(info) {
          thumbnailSlider.goTo(info.index);
        });
      }
      return slider;
    };
    initializeSlider();
    const debouncedInitializeSliderPopup = debounce(initializeSlider, 500);
    window.addEventListener("resize", debouncedInitializeSliderPopup);
    return slider;
  }
})();
