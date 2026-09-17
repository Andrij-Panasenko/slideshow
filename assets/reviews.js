import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs'

document.addEventListener("DOMContentLoaded", Reviews);

function Reviews() { 
     const selectors = {
          section: '.js-reviews',
          authorContainer: '.js-navigation-author',
     }

     const swiperText = new Swiper('.js-swiper-text', {
          effect: "fade",
          fadeEffect: {
               crossFade: true
          },
          grabCursor: true,
          loop: true,
          speed: 700,
          navigation: {
               nextEl: ".swiper-next",
               prevEl: ".swiper-prev"
          },
     });

     const swiperMedia = new Swiper('.js-swiper-media', {
          effect: "fade",
          fadeEffect: {
               crossFade: true
          },
          grabCursor: true,
          loop: true,
          speed: 700,
     })

     swiperText.controller.control = swiperMedia;
     swiperMedia.controller.control = swiperText;

     const section = document.querySelector(selectors.section);

     if (!section) return;
     
     const authors = document.querySelectorAll(selectors.authorContainer);
     
     function updateAuthor(idx) {
          [...authors].forEach((author, currentidx) => {
               if (currentidx === idx) {
                    author.classList.add('is-active');
               } else {
                    author.classList.remove('is-active');
               }
          })
     }
     
     swiperText.on('slideChange', () => {
          updateAuthor(swiperText.realIndex);
     });
}
