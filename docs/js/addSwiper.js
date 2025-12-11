document.addEventListener("DOMContentLoaded", function () {

    let swiperBaner = new Swiper(".swiperBaner", {
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        speed: 1500,

        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
            nextEl: ".swiperBaner .sw-btn-next",
            prevEl: ".swiperBaner .sw-btn-prev",
        },
        pagination: {
            el: ".swiperBaner .sw-pagination",
        },

    });
    let swiperZapchasti = new Swiper(".swiperZapchasti", {
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        speed: 1500,

        loop: true,
        slidesPerView: 1,
        spaceBetween: 10,
        navigation: {
            nextEl: ".swiperZapchasti-cont .sw-btn-next",
            prevEl: ".swiperZapchasti-cont .sw-btn-prev",
        },
        scrollbar: {
            el: ".swiperZapchasti-cont .swiper-scrollbar",
            hide: true,
          },
        breakpoints: {
            374: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
            },
        },
    });
    if (document.querySelector(".swiperProduct")) {
        document.querySelectorAll(".swiperProduct").forEach((swiperEl) => {
            // Добавляем случайную задержку для каждого слайдера, чтобы они не прокручивались одновременно
            const randomDelay = Math.floor(Math.random() * 3000); // случайная задержка от 0 до 3000 мс
            const baseDelay = 5000;

            new Swiper(swiperEl, {
                autoplay: {
                    delay: baseDelay + randomDelay,
                    disableOnInteraction: false,
                },
                speed: 1500,
                loop: true,
                slidesPerView: 1,
                spaceBetween: 10,
                pagination: {
                    el: swiperEl.querySelector(".sw-pagination"),
                },
            });
        });
    }

    var priceFilterContainer = document.querySelector('.price-filter-container');
    var priceFilter = document.getElementById('price-filter');

    if (priceFilter && priceFilterContainer) {
        var priceMin = document.getElementById('price-min');
        var priceMax = document.getElementById('price-max');

        // Получаем значения из атрибутов и преобразуем в числа
        var minValueAttr = priceMin ? priceMin.getAttribute('data-min') : null;
        var maxValueAttr = priceMax ? priceMax.getAttribute('data-max') : null;

        var minValue = minValueAttr ? parseFloat(minValueAttr) : null;
        var maxValue = maxValueAttr ? parseFloat(maxValueAttr) : null;

        // Проверяем валидность значений
        var isValid = minValue !== null && maxValue !== null &&
            !isNaN(minValue) && !isNaN(maxValue) &&
            minValue < maxValue;

        // Если значения невалидны, скрываем контейнер
        if (!isValid) {
            priceFilterContainer.style.display = 'none';
        } else {
            // Устанавливаем начальные значения слайдера (средние между min и max)
            var startMin = minValue;
            var startMax = maxValue;

            // Находим кнопку "Показать"
            var viewButton = document.querySelector('.view.button');

            // Функция для обновления URL с GET параметрами
            function updateURL(minPrice, maxPrice) {
                var url = new URL(window.location.href);
                url.searchParams.set('min_price', minPrice);
                url.searchParams.set('max_price', maxPrice);
                window.history.pushState({}, '', url);
            }

            // Функция для показа кнопки и обновления URL
            function showButtonAndUpdateURL() {
                if (viewButton) {
                    viewButton.classList.remove('invise');
                    var currentValues = priceFilter.noUiSlider.get();
                    var minPrice = Math.round(currentValues[0]);
                    var maxPrice = Math.round(currentValues[1]);

                    // Обновляем href кнопки
                    var url = new URL(window.location.href);
                    url.searchParams.set('min_price', minPrice);
                    url.searchParams.set('max_price', maxPrice);
                    viewButton.href = url.toString();

                    // Обновляем URL в браузере
                    updateURL(minPrice, maxPrice);
                }
            }

            // Проверяем начальные значения из URL
            var urlParams = new URLSearchParams(window.location.search);
            var urlMinPrice = urlParams.get('min_price');
            var urlMaxPrice = urlParams.get('max_price');

            if (urlMinPrice && urlMaxPrice) {
                var parsedMin = parseFloat(urlMinPrice);
                var parsedMax = parseFloat(urlMaxPrice);
                if (!isNaN(parsedMin) && !isNaN(parsedMax) &&
                    parsedMin >= minValue && parsedMax <= maxValue &&
                    parsedMin <= parsedMax) {
                    startMin = parsedMin;
                    startMax = parsedMax;
                }
            }

            // Флаг для отслеживания перетаскивания
            var isDragging = false;
            // Флаг для отслеживания инициализации (чтобы не показывать кнопку при загрузке)
            var isInitializing = true;

            noUiSlider.create(priceFilter, {
                start: [startMin, startMax],
                connect: true,
                range: {
                    'min': minValue,
                    'max': maxValue
                }
            });

            // Когда начинается перетаскивание ползунка - скрываем кнопку
            priceFilter.noUiSlider.on('start', function () {
                isDragging = true;
                isInitializing = false; // После первого взаимодействия инициализация завершена
                if (viewButton) {
                    viewButton.classList.add('invise');
                }
            });

            // Когда заканчивается перетаскивание ползунка - показываем кнопку и обновляем URL
            priceFilter.noUiSlider.on('end', function () {
                isDragging = false;
                isInitializing = false; // После первого взаимодействия инициализация завершена
                showButtonAndUpdateURL();
            });

            // Обновление полей значений при изменении слайдера
            priceFilter.noUiSlider.on('update', function (values, handle) {
                var value = Math.round(values[handle]);
                if (handle) {
                    priceMax.value = value;
                } else {
                    priceMin.value = value;
                }
                // Обновляем URL только если не идет перетаскивание и не идет инициализация
                if (!isDragging && !isInitializing) {
                    showButtonAndUpdateURL();
                }
            });

            // Установка начальных значений
            var initialValues = priceFilter.noUiSlider.get();
            priceMin.value = Math.round(initialValues[0]);
            priceMax.value = Math.round(initialValues[1]);

            // Если значения были загружены из URL, обновляем href кнопки, но не показываем её
            if (urlMinPrice && urlMaxPrice) {
                if (viewButton) {
                    var url = new URL(window.location.href);
                    url.searchParams.set('min_price', Math.round(initialValues[0]));
                    url.searchParams.set('max_price', Math.round(initialValues[1]));
                    viewButton.href = url.toString();
                }
            }

            // Завершаем инициализацию после установки начальных значений
            // Используем setTimeout, чтобы убедиться, что все события update обработаны
            setTimeout(function () {
                isInitializing = false;
            }, 100);

            // Обработка ручного ввода значений в инпуты
            var sliderRange = priceFilter.noUiSlider.options.range;
            var sliderMinValue = sliderRange.min;
            var sliderMaxValue = sliderRange.max;

            // Функция для фильтрации только чисел
            function allowOnlyNumbers(input) {
                input.addEventListener('input', function (e) {
                    // Удаляем все символы, кроме цифр
                    this.value = this.value.replace(/[^\d]/g, '');
                });

                // Блокируем ввод нечисловых символов при нажатии клавиш
                input.addEventListener('keypress', function (e) {
                    // Разрешаем: цифры (0-9), Backspace, Delete, Tab, Escape, Enter
                    var char = String.fromCharCode(e.which || e.keyCode);
                    if (!/[0-9]/.test(char) && !/[8,9,27,13,46]/.test(e.keyCode) &&
                        !(e.keyCode === 65 && e.ctrlKey === true) && // Ctrl+A
                        !(e.keyCode >= 35 && e.keyCode <= 40)) { // Home, End, стрелки
                        e.preventDefault();
                    }
                });

                // Блокируем вставку нечисловых символов
                input.addEventListener('paste', function (e) {
                    e.preventDefault();
                    var paste = (e.clipboardData || window.clipboardData).getData('text');
                    var numbersOnly = paste.replace(/[^\d]/g, '');
                    if (numbersOnly) {
                        this.value = numbersOnly;
                        // Триггерим событие change для валидации
                        this.dispatchEvent(new Event('change'));
                    }
                });
            }

            // Применяем фильтрацию к обоим инпутам
            allowOnlyNumbers(priceMin);
            allowOnlyNumbers(priceMax);

            // Обработчик для минимального значения
            priceMin.addEventListener('change', function () {
                isInitializing = false; // После первого взаимодействия инициализация завершена
                var value = parseFloat(this.value);

                // Если значение не число, используем текущее минимальное значение слайдера
                if (isNaN(value)) {
                    var currentValues = priceFilter.noUiSlider.get();
                    value = currentValues[0];
                }

                // Если значение меньше минимального, ставим минимальное
                if (value < sliderMinValue) {
                    value = sliderMinValue;
                }

                // Если значение больше максимального, ставим максимальное
                if (value > sliderMaxValue) {
                    value = sliderMaxValue;
                }

                // Если значение больше максимального значения слайдера, ограничиваем
                var currentMax = parseFloat(priceMax.value);
                if (!isNaN(currentMax) && value > currentMax) {
                    value = currentMax;
                }

                this.value = Math.round(value);
                priceFilter.noUiSlider.set([value, null]);

                // Показываем кнопку и обновляем URL
                showButtonAndUpdateURL();
            });

            // Обработчик для максимального значения
            priceMax.addEventListener('change', function () {
                isInitializing = false; // После первого взаимодействия инициализация завершена
                var value = parseFloat(this.value);

                // Если значение не число, используем текущее максимальное значение слайдера
                if (isNaN(value)) {
                    var currentValues = priceFilter.noUiSlider.get();
                    value = currentValues[1];
                }

                // Если значение больше максимального, ставим максимальное
                if (value > sliderMaxValue) {
                    value = sliderMaxValue;
                }

                // Если значение меньше минимального, ставим минимальное
                if (value < sliderMinValue) {
                    value = sliderMinValue;
                }

                // Если значение меньше минимального значения слайдера, ограничиваем
                var currentMin = parseFloat(priceMin.value);
                if (!isNaN(currentMin) && value < currentMin) {
                    value = currentMin;
                }

                this.value = Math.round(value);
                priceFilter.noUiSlider.set([null, value]);

                // Показываем кнопку и обновляем URL
                showButtonAndUpdateURL();
            });
        }
    }

    var mySwiper2 = new Swiper(".mySwiper2", {
        spaceBetween: 10,
        slidesPerView: "auto",
        freeMode: true,
        watchSlidesProgress: true,
    });
    var mySwiper = new Swiper(".mySwiper", {
        spaceBetween: 10,
        pagination: {
            el: ".mySwiper .sw-pagination",
        },
        thumbs: {
            swiper: mySwiper2,
        },
    });



    if (document.getElementById('isAdmin')) {
        console.log('addSwiper.js finish work');
    }
});