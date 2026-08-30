import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.mjs';

document.addEventListener("DOMContentLoaded", Slideshow);

function Slideshow() {
     const selectors = {
          section: '.js-slideshow',
          video: '.js-video',
          slide: '.js-slide',
          activeSlide: '.swiper-slide-active',
          buttonSlideControl: '.js-button-slide-control',
     }

     const iframeActions = {
          play: 'playVideo',
          stop: 'stopVideo'
     }

     const section = document.querySelector(selectors.section);
     if (!section) return

     const isAutoplay = section.dataset.autoplay;
     const autoplaySpeed = section.dataset.autoplaySpeed; 

     const swiperOptions = {
          slidesPerView: 1,
          speed: 700,
          loop: true,
          grabCursor: true,
          spaceBetween: 5,
          navigation: {
               nextEl: ".swiper-button-next-slide",
               prevEl: ".swiper-button-prev-slide"
          },
          direction: 'horizontal',
     }

     if (isAutoplay === "true") {
          swiperOptions.autoplay = {
               delay: autoplaySpeed,
          }
     }

     const swiper = new Swiper('.swiper', swiperOptions);

     const buttons = section.querySelector(selectors.buttonSlideControl)
     swiper.slides.length === 1 ? buttons.style.display = 'none' : buttons.style.display = 'block'

     function controlIframeVideo(element, action) {
          if (element.src.includes('youtube')) {
               element.contentWindow.postMessage('{ "event": "command", "func": "'+ action +'", "args": "" }', "*")
          }

          if (element.src.includes('vimeo')) {
               if (action.includes('stop')) {
                    action = 'pause'
               } else if (action.includes('play')) {
                    action = 'play'
               }
               element.contentWindow.postMessage('{ "method":"' + action + '"}', "*")
          }
     }
    
     swiper.on('slideChange', function (event) {
          const videoSlides = event.slides.filter(slide => slide.querySelector(selectors.video)); 
          videoSlides.forEach(slide => {
               const videos = slide.querySelectorAll(selectors.video);
               videos.forEach(video => {
                    if (video.tagName.toLowerCase() === 'video') {
                         video.pause()
                    } else {
                         controlIframeVideo(video, iframeActions.stop)
                    }
               })
          })
     });

     swiper.on('slideChange', function (event) {
          const activeSlide = event.slides[event.activeIndex];
          const activeVideoPlayers = activeSlide.querySelectorAll(selectors.video);

          if (activeVideoPlayers.length === 0) return;
          
          [...activeVideoPlayers].some(video => { 
               const playerStyle = window.getComputedStyle(video);

               if (playerStyle.display !== 'none') {
                    setTimeout(() => {
                         if (video.tagName.toLowerCase() === 'video') {
                              video.play()
                         } else if (video.tagName.toLowerCase() === 'iframe') {
                              controlIframeVideo(video, iframeActions.play)
                         }
                    }, 100)
               }
          })
     });
}
