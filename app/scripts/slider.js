import { tns } from 'tiny-slider';

const thumbnailSliders = document.querySelectorAll('.thumbnail-slider')
if (thumbnailSliders) {
    thumbnailSliders.forEach(thumbnailSlider => {
        const { itemCount = 1, axis = 'vertical' } = thumbnailSlider.dataset;

        const slider = tns({
            container: thumbnailSlider,
            items: itemCount,
            slideBy: 'page',
            axis: axis,
            nav: false,
            nextButton: '.next',
            prevButton: '.prev',
            gutter: 7,
            mouseDrag: true,
            loop: false,
        });


        slider.events.on('indexChanged', function (info) {
            var isFirst = info.index === 0;
            var isLast = info.index === info.slideCount - info.items;

            if (isFirst) {
                info.prevButton.style.opacity = 0;
            } else {
                info.prevButton.style.opacity = 1;
            }

            if (isLast) {
                info.nextButton.style.opacity = 0;
            } else {
                info.nextButton.style.opacity = 1;
            }
        });
    })
}
