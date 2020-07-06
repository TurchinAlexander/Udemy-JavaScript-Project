document.addEventListener('DOMContentLoaded', () => {
    
    // Tabs
    
    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent() {
        tabsContent.forEach((item) => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach((item) => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target 
            && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, index) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(index);
                }
            });
        }
    });

    // Timer

    const deadline = '2020-06-30';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
              days = Math.floor(t / (1000 * 60 * 60 * 24)),
              hours = Math.floor((t / (1000 * 60 * 60)) % 24),
              minutes = Math.floor((t / (1000 * 60) % 60)),
              seconds = Math.floor((t / 1000) % 60);

        return {
            'total' : t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0
            && num < 10) {
                return `0${num}`;
            } else {
                return num;
            }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
              days = timer.querySelector('#days'),
              hours = timer.querySelector('#hours'),
              minutes = timer.querySelector('#minutes'),
              seconds = timer.querySelector('#seconds'),
              timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
            
            if (t.total < 0) {
                clearInterval(timeInterval);
            }
        }

    }

    setClock('.timer', deadline);

    // Modal

    const openModalButtons = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';

        clearInterval(modalTimerId);
    }

    openModalButtons.forEach((item) => {
        item.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (event) => {
        if (event.target === modal 
            || event.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (modal.classList.contains('show')
            && event.code === 'Escape') {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    // function showModalByScroll() {
    //     if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
    //         openModal();
    //         window.removeEventListener('scroll', showModalByScroll);
    //     }
    // }

    // window.addEventListener('scroll', showModalByScroll);




    class MenuItem {
        constructor(imageSource, alt, title, description, price, parentSelector, ...classes) {
            this.imageSource = imageSource;
            this.alt = alt;
            this.title = title;
            this.description = description;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;

            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const div = document.createElement('div');
            
            if (this.classes.length == 0) {
                this.element = 'menu__item';
                div.classList.add(this.element);
            } else {
                this.classes.forEach(className => div.classList.add(className));
            }
            div.innerHTML = `
                <img src="${this.imageSource}" alt="${this.alt}">
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.description}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена: </div>
                    <div class="menu__item-total">
                        <span>${this.price}</span> грн/день
                    </div>
                </div>`;

            this.parent.append(div);
        }
    }

    const foodContainer = document.querySelector('.menu__field div');

    // foodContainer.innerHTML = '';

    const getResource = async (url) => {
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };

    // getResource('http://localhost:3000/menu')
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuItem(
    //                 img,
    //                 altimg,
    //                 title,
    //                 descr,
    //                 price,
    //                 '.menu .container'
    //             ).render();
    //         });
    //     });


    getResource('http://localhost:3000/menu')
        .then(data => createItem(data));

    function createItem(data) {
        data.forEach(({img, altimg, title, descr, price}) => {
            const element = document.createElement('div');

            element.classList.add('menu__item');

            element.innerHTML = `
                <img src="${img}" alt="${altimg}">
                <h3 class="menu__item-subtitle">${title}</h3>
                <div class="menu__item-descr">${descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена: </div>
                    <div class="menu__item-total">
                        <span>${price}</span> грн/день
                    </div>
                </div>
            `;

            document.querySelector('.menu .container').append(element);
        });
    }

    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Thanks! We will contact with you soon!',
        failure: "Something went wrong..."
    };

    forms.forEach((form) => {
        bindPostData(form);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        // return res.then(data => data.json());

        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;

            // form.append(statusMessage);
            form.insertAdjacentElement('afterend', statusMessage);
            
            const formData = new FormData(form);
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then((data) => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });
        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');

        // It's used by the order form.
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal')
            .append(thanksModal);

        setTimeout(() => {
            thanksModal.remove();
            // prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }

    fetch('http://localhost:3000/menu')
        .then(data => data.json())
        .then(res => console.log(res));


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

    // Calculator

    const
        result = document.querySelector('.calculating__result span'),
        globalDiv = document.querySelector('.calculating__field');
    

    let
        sex = (localStorage.getItem('sex')) ? localStorage.getItem('sex') : 'female',
        height,
        weight,
        age,
        ratio = (localStorage.getItem('ratio')) ? localStorage.getItem('ratio') : 1.375;
    
    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);

        elements.forEach((item) => {
            item.classList.remove(activeClass);

            if (item.getAttribute('id') === localStorage.getItem('sex')
                || item.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                item.classList.add(activeClass);
            }
        });
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function CalculateTotal() {
        // if (!sex || !height || !weight || !age || !ratio) {
        if (!(sex && height && weight && age && ratio)) {
            result.textContent = '____';
            return;
        }

        if (sex == 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(`${selector} div`);

        document.querySelector(selector).addEventListener('click', (event) => {
            if (!event.target.classList.contains('calculating__choose-item')) {
                return;
            }
            
            if (event.target.getAttribute('data-ratio')) {
                ratio = +event.target.getAttribute('data-ratio');
                localStorage.setItem('ratio', ratio);
            } else {
                sex = event.target.getAttribute('id');
                localStorage.setItem('sex', sex);
            }

            elements.forEach((item) => {
                item.classList.remove(activeClass);
            });

            event.target.classList.add(activeClass);

            // CalculateTotal();
        });

    }

    getStaticInformation('#gender', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big', 'calculating__choose-item_active');

    function getDynamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', (event) => {
            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }

            // CalculateTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');

    function checkClientInput(event) {
        if (event.target.classList.contains('calculating__choose-item')) {
            CalculateTotal();
        }
    }

    globalDiv.addEventListener('click', checkClientInput);
    globalDiv.addEventListener('input', checkClientInput);
});