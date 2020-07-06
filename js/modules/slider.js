import {getZero} from './timer';

function slider() {
    // Slider

    const 
        slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        slidesField = document.querySelector('.offer__slide-inner'),
        sliderWidth = window.getComputedStyle(slidesWrapper).width.replace(/\D/g, '');

    let 
        slideIndex = 0,
        offset = 0,
        indicators,
        dots;

    function Initialization() {

        current.textContent = getZero(slideIndex + 1);
        total.textContent = getZero(slides.length);

        slidesField.style.width = 100 * slides.length + '%';
        slidesField.style.display = 'flex';
        slidesField.style.transition = '0.5s all';

        slidesWrapper.style.overflow = 'hidden';

        slides.forEach((slide) => {
            slide.style.width = sliderWidth;
        });

        slider.style.position = 'relative';
 
        indicators = document.createElement('ol');
        dots = [];

        indicators.classList.add('carousel-indicators');
        slider.append(indicators);

        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('li');
            dot.setAttribute('data-slide-to', i);
            dot.classList.add('dot');

            if (i == 0) {
                dot.style.opacity = 1;
            }

            indicators.append(dot);
            dots.push(dot);
        }
    }

    function RedrawSliderElements() {
        current.textContent = getZero(slideIndex + 1);

        offset = slideIndex * sliderWidth;

        slidesField.style.transform = `translateX(-${offset}px)`;

        dots.forEach(dot => dot.style.opacity = '.5');
        dots[slideIndex].style.opacity = '1';
    }

    function MoveSlide(isMoveForward) {
        const 
            nextSlide = slideIndex + ((isMoveForward) ? 1 : -1);
            
        let rightNextSlide;

        if (nextSlide < 0) {
            rightNextSlide = slides.length - 1;
        } else if (nextSlide >= slides.length) {
            rightNextSlide = 0;
        } else {
            rightNextSlide = nextSlide;
        }

        MoveSlideTo(rightNextSlide);

    }

    function MoveSlideTo(number) {
        slideIndex = number;
        offset = slideIndex * sliderWidth;

        RedrawSliderElements();
    }

    Initialization();

    next.addEventListener('click', () => {
        MoveSlide(true);
    });

    prev.addEventListener('click', () => {
        MoveSlide(false);
    });

    indicators.addEventListener('click', (event) => {
        const slideTo = event.target.getAttribute('data-slide-to');
        MoveSlideTo(+slideTo);
    });
}

export default slider;