import { tns } from "tiny-slider";

// const thumbnailSliders = document.querySelectorAll('thumbnail-slider')
// if (thumbnailSliders) {
//     thumbnailSliders.forEach(thumbnailSlider => {
//         const slider = tns({
//             container: thumbnailSlider,
//             items: 4,
//             slideBy: 'page',
//             axis: 'vertical',
//             nav: false,
//             nextButton: '.next',
//             prevButton: '.prev',
//             gutter: 7,
//             mouseDrag: true,
//             loop: false,
//         });
//     })
// }

var slider = tns({
    container: ".thumbnail-slider",
    navContainer: ".customize-thumbnails",
    items: 1,
    axis: "horizontal",
    autoplay: false,
    autoplayTimeout: 1000,
    speed: 400,
    mouseDrag: true,


});

var slidercustom = tns({
    container: ".customize-thumbnails ",
    items: 4,
    axis: "vertical",
    autoplay: false,
    autoplayTimeout: 1000,
    speed: 400,
    loop: false,
    mouseDrag: true,

});
