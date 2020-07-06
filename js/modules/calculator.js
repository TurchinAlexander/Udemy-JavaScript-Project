function calculator() {
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
}

module.exports = calculator;