
document.addEventListener("DOMContentLoaded", function () {

    function addClass(el, class_name) {
        el.classList.add(class_name);
    }
    function removeClass(el, class_name) {
        el.classList.remove(class_name);
    }
    function toggleClass(el, class_name) {
        el.classList.toggle(class_name);
    }
    function containsClass(el, class_name) {
        return el.classList.contains(class_name);
    }

    let loadSvg = document.getElementById('load-svg');

    function addLoad() {
        addClass(loadSvg, 'open');
    }
    function removeLoad() {
        removeClass(loadSvg, 'open');
    }

    function removeAllOpen() {
        if (document.querySelector('.open')) {
            document.querySelectorAll('.open').forEach(el => {
                removeClass(el, "open");
            });
        }
    }

    const header = document.querySelector('header');
    let headerOverlay = document.querySelector('.header-overlay');
    const main = document.querySelector('main');
    const footer = document.querySelector('footer');
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    if (document.querySelector('.header-search')) {
        var searchTop = document.querySelector('.header-search');
        var inputSearch = searchTop.querySelector('#title-search-input');
        var headerTopContainer = document.querySelector('.header-top-container');
        var dataSearchFocus = document.querySelector('[data-search-focus]');

        if (dataSearchFocus) {
            dataSearchFocus.addEventListener('click', (e) => {
                if (!searchTop.classList.contains('focus')) {
                    if (containsClass(header, 'open')) {
                        removeClass(header, 'open');
                        setTimeout(() => {
                            removeClass(header, 'open');
                            addClass(searchTop, 'focus');
                            addClass(dataSearchFocus, 'active');
                            inputSearch.focus();
                            return;
                        }, 500);
                    } else {
                        removeClass(header, 'open');
                        addClass(searchTop, 'focus');
                        addClass(dataSearchFocus, 'active');
                        inputSearch.focus();
                        return;
                    }
                }
            });
        }

        inputSearch.addEventListener('focus', () => {
            addClass(searchTop, 'focus');
            if (dataSearchFocus) {
                addClass(dataSearchFocus, 'active');
            }
        })

        inputSearch.addEventListener('blur', (e) => {
            setTimeout(() => {
                if (e.target.closest('[data-search-focus]')) {
                    return;
                }
                if (dataSearchFocus) {
                    removeClass(dataSearchFocus, 'active');
                }
                removeClass(searchTop, 'focus');
            }, 200);

        })
    }

    if (document.querySelector('[data-btn-catalog]')) {
        let dataCatalogMenu = document.querySelector('[data-catalog-menu]:not(header [data-catalog-menu])');
        let dataCatalogMenuOverlay = document.querySelector('[data-catalog-menu-overlay]');
        let btnCatalog = document.querySelectorAll('[data-btn-catalog]');

        dataCatalogMenuOverlay.addEventListener('click', () => {
            removeAllOpen();
        });

        btnCatalog.forEach(el => {
            el.addEventListener('click', () => {

                // Моментально прокрутить страничку вверх
                window.scrollTo({ top: 0, behavior: "auto" });

                // Вычислить высоту header и сделать top = высоте header для dataCatalogMenu
                if (dataCatalogMenu) {
                    const header = document.querySelector('header');
                    let headerHeight = header ? header.offsetHeight : 0;
                    dataCatalogMenu.style.top = headerHeight + 'px';
                }

                toggleClass(dataCatalogMenu, 'open');
                toggleClass(el, 'open');
                toggleClass(dataCatalogMenuOverlay, 'open');
            });
        });
    }

    if (document.querySelector('[data-menu-open-btn]')) {
        document.querySelectorAll('[data-menu-open-btn]').forEach(menuOpenBtn => {
            menuOpenBtn.addEventListener('click', () => {
                if (containsClass(headerOverlay, 'open')) {
                    document.querySelector('[data-catalog-mob-open-btn]').click();
                }
                toggleClass(header, 'open');
            })
        });
    }

    if (document.querySelector('header')) {
        const headerBot = document.querySelector('header');



        if (!headerBot || !main) return;

        main.style.paddingTop = `${headerBot.offsetHeight}px`;

        // Сохраняем исходную позицию элемента
        let originalHeaderTop = headerBot.offsetTop;

        function handleScroll() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;

            // Если прокрутили до верха страницы
            if (scrollTop === 0) {
                headerBot.classList.remove('fixed'); // Удаляем класс fixed
                // main.style.paddingTop = '0'; // Сбрасываем padding-top
            }
            // Если прокрутили ниже исходной позиции header
            else if (scrollTop >= originalHeaderTop) {
                headerBot.classList.add('fixed'); // Добавляем класс fixed
                // main.style.paddingTop = `${headerBot.offsetHeight}px`; // Устанавливаем padding-top
            }
        }

        // Обработчик изменения размера окна
        function handleResize() {
            // Пересчитываем исходную позицию при изменении размера окна
            originalHeaderTop = headerBot.offsetTop;
            handleScroll(); // Вызываем handleScroll для корректировки состояния
        }

        // Добавляем обработчики событий
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);

        // Убедимся, что скрипт выполняется после полной загрузки DOM
        document.addEventListener('DOMContentLoaded', () => {
            // Пересчитываем originalHeaderTop после загрузки DOM
            originalHeaderTop = headerBot.offsetTop;
            handleScroll(); // Вызываем handleScroll для корректировки состояния
        });
    }

    if (document.querySelector('[data-href]')) {
        const data_href = document.querySelectorAll('[data-href]');

        data_href.forEach(element => {

            element.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-popup-open')) {
                    return;
                }

                if (e.target.tagName == 'A') {
                    return;
                }
                if (e.target.closest(".drop_2")) {
                    return;
                }
                if (e.target.closest(".drop_3")) {
                    return;
                }



                window.location = element.getAttribute('data-href');
            })
        });
    }

    if (document.querySelector('a[href^="#"]')) {
        const headerOffset = header ? header.offsetHeight : 0;

        // Находим все ссылки с якорями внутри текущей страницы
        const anchorLinks = document.querySelectorAll('a[href^="#"]');

        anchorLinks.forEach(link => {
            const href = link.getAttribute('href');

            // Пропускаем пустые якоря (#) и внешние ссылки
            if (href === '#' || href.length <= 1) return;

            const targetId = href.substring(1); // убираем '#'
            const targetElement = document.getElementById(targetId);

            // Если целевой элемент существует — навешиваем обработчик
            if (targetElement) {
                link.addEventListener('click', function (e) {
                    e.preventDefault();

                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset - 40;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                });
            }
        });
    }

    if (document.querySelector('[data-catalog-mob-open-btn]')) {
        let headerMenuCopy = header.querySelector('.header-menu-1-copy')
        document.querySelectorAll('[data-catalog-mob-open-btn]').forEach(catalogMobOpenBtn => {
            catalogMobOpenBtn.addEventListener('click', () => {

                toggleClass(headerOverlay, 'open');
                toggleClass(headerMenuCopy, 'open');
                document.querySelectorAll('[data-catalog-mob-open-btn]').forEach(el => {
                    toggleClass(el, 'open');
                });
            })
        });
    }

    if (header.querySelector('.header-menu-1-copy')) {
        const headerMenu = header.querySelector('.header-menu-1-copy');
        let drop_2_all = headerMenu.querySelectorAll('.drop_2');

        if (screenWidth < 971) {
            const headerMobMenuBackContainer = headerMenu.querySelectorAll(".header-mob-menu-back-container");

            if (headerMenu.querySelector(".header-mob-menu-back-container")) {
                headerMobMenuBackContainer.forEach(back => {
                    back.addEventListener('click', (e) => {
                        e.preventDefault();
                        removeClass(back.closest(".catalog-menu-el"), "open");
                        if (back.closest(".catalog-menu-el").classList.contains("drop_2")) {
                            removeClass(headerMenu, "no-scroll");
                        } else if (back.closest(".catalog-menu-el").classList.contains("drop_3")) {
                            removeClass(back.closest(".catalog-menu-level-3-container"), "no-scroll");
                        } else if (back.closest(".catalog-menu-el").classList.contains("drop_4")) {
                            removeClass(back.closest(".catalog-menu-level-4-container"), "no-scroll");
                        }
                    })
                });
            }

            if (drop_2_all) {
                drop_2_all.forEach(drop2 => {
                    let drop_3 = drop2.querySelectorAll(".drop_3");
                    let cont_2 = drop2.querySelector('.cont_2');
                    let headerMenuLevel3Container = drop2.querySelector('.catalog-menu-level-3-container');

                    cont_2.addEventListener('click', (e) => {
                        e.preventDefault();
                        addClass(drop2, "open");
                        addClass(drop2, "no-scroll");
                    })

                    if (drop2.querySelector(".drop_3")) {
                        drop_3.forEach(drop3 => {
                            let cont_3 = drop3.querySelector('.cont_3');

                            cont_3.addEventListener('click', (e) => {
                                e.preventDefault();
                                addClass(drop3, "open");
                                addClass(headerMenuLevel3Container, "no-scroll");
                            })
                        });
                    }
                });
            }
        }
    }

    if (document.querySelector('.header-overlay')) {
        const headerOverlay = document.querySelector('.header-overlay');

        headerOverlay.addEventListener('click', () => {
            removeAllOpen();
        })
    }

    if (document.querySelector('.footer-check-height-cont')) {
        const footerCheckHeightCont = document.querySelectorAll('.footer-check-height-cont');

        footerCheckHeightCont.forEach((el) => {

            const footerCheckHeight = el.querySelectorAll('.footer-check-height');

            footerCheckHeight.forEach((element) => {

                const elementHeight = element.offsetHeight;
                if (elementHeight > 240) {


                    element.classList.add('overflow-hidden-bottom');
                    let dataId = element.getAttribute('data-id');
                    let btn = el.querySelector(`[data-id="${dataId}-footer-menu"]`);
                    if (btn) {
                        removeClass(btn, "invise");
                        btn.addEventListener('click', () => {
                            toggleClass(element, "opened");
                            toggleClass(btn, "opened");
                        })
                    }

                }
            });
        });
    }

    if (document.querySelector("[data-tab-container]")) {
        const tabsCont = document.querySelectorAll("[data-tab-container]");
        tabsCont.forEach(el => {
            const tab = el.querySelectorAll("[data-tab]");
            const tabContEls = el.querySelectorAll("[data-tab-el]");

            function addActive(element) {
                element.classList.add("active");
            }

            function removeActive(element) {
                element.classList.remove("active");
            }

            function toggleActive(element) {
                element.classList.toggle("active");
            }
            let num = 0;
            tab.forEach(element => {
                let dataTab = element.getAttribute('data-tab');



                if (num == 0) {
                    dataTab = element.getAttribute('data-tab');

                    addActive(element);
                    tabContEls.forEach(el_tab => {
                        let dataTabEl = el_tab.getAttribute('data-tab-el');

                        if (!dataTab) {
                            addActive(el_tab);
                        } else {
                            if (dataTab == dataTabEl) {
                                addActive(el_tab);
                            } else {
                                removeActive(el_tab);
                            }
                        }

                       
                    });
                } else {
                    removeActive(element);
                }

                element.addEventListener('click', () => {
                    dataTab = element.getAttribute('data-tab');
                    if (!dataTab) {
                        tabContEls.forEach(el_tab => {
                            addActive(el_tab);
                        });
                        tab.forEach(el_tab => {
                            removeActive(el_tab);
                        })
                        addActive(element);
                        return;
                    }
                    tab.forEach(el_tab => {
                        removeActive(el_tab);
                    })
                    tabContEls.forEach(el_tab => {
                        let dataTabEl = el_tab.getAttribute('data-tab-el');
                        if (dataTab == dataTabEl) {
                            addActive(el_tab);
                        } else {
                            removeActive(el_tab);
                        }
                    });
                    addActive(element);
                })

                num++;
            });
        });

    }


    if (document.querySelector('.footer-menu-mob')) {
        const footerMenuMob = document.querySelector('.footer-menu-mob');
        const footerMenuEls = footerMenuMob.querySelectorAll(".footer-menu-el.drop_1");

        footerMenuEls.forEach(el => {
            let cont_1 = el.querySelector(".cont_1");
            cont_1.addEventListener('click', (e) => {
                e.preventDefault();
                toggleClass(el, "open");
            })
        });
    }

    if (document.querySelector('.checkbox')) {
        const checkboxs = document.querySelectorAll('.checkbox');

        checkboxs.forEach(el => {
            let checkBoxBtn = el.querySelector('.check-box-btn');

            checkBoxBtn.addEventListener('click', () => {
                if (checkBoxBtn.getAttribute('data-toggle') == 'y') {
                    toggleClass(el, 'checked');
                } else {
                    addClass(el, 'checked');
                    removeClass(el, 'err');
                }
            })
        });
    }

    if (document.querySelector('form')) {
        var overlay = document.querySelector('.overlay');
        var popupCheck = document.querySelector('.popupCheck')
        var popupCheckCloseBtn = popupCheck.querySelector('.close-btn');

        popupCheckCloseBtn.addEventListener('click', () => {
            removeClass(overlay, 'open');
            removeClass(popupCheck, 'open');
        })
        overlay.addEventListener('click', () => {
            document.querySelectorAll('.open').forEach(el => {
                removeClass(el, 'open');
            })
        })

        if (document.querySelector('.btn_pop')) {
            const btnPopAdd = document.querySelectorAll('.btn_pop')

            btnPopAdd.forEach(element => {
                element.addEventListener('click', () => {
                    addClass(overlay, 'open');
                })
            });
        }

    }

    if (document.querySelector('[data-popup-open]')) {
        let popupOpenBtns = document.querySelectorAll('[data-popup-open]');

        popupOpenBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {

                if (e.target.tagName == 'A' && !e.target.getAttribute('data-popup-open')) {
                    return;
                }

                e.preventDefault();

                let btnDataId = btn.getAttribute('data-popup-open');

                let dataPopupServiceName = btn.getAttribute('data-popup-service-name');

                let dataPopupStockName = btn.getAttribute('data-popup-stock-name');

                let dataPopupServiceLink = btn.getAttribute('data-popup-service-link');

                let dataPopupSertificateName = btn.getAttribute('data-popup-sertificate-name');

                let dataPopupSpecialistName = btn.getAttribute('data-popup-specialist-name');

                let dataPopupSpecialistLink = btn.getAttribute('data-popup-specialist-link');

                let popup = document.getElementById(`${btnDataId}`);
                if (popup) {

                    let popupForm = popup.querySelector("form");

                    if (popupForm) {

                        let serviceLinkInput = popupForm.querySelector('input[name="service-link"]');
                        if (serviceLinkInput) {
                            popupForm.removeChild(serviceLinkInput);
                        }

                        let specialistNameInput = popupForm.querySelector('input[name="specialist-name"]');
                        if (specialistNameInput) {
                            popupForm.removeChild(specialistNameInput);
                        }

                        let serviceNameInput = popupForm.querySelector('input[name="service-name"]');
                        if (serviceNameInput) {
                            popupForm.removeChild(serviceNameInput);
                        }

                        let specialistLinkInput = popupForm.querySelector('input[name="specialist-link"]');
                        if (specialistLinkInput) {
                            popupForm.removeChild(specialistLinkInput);
                        }

                        let stockNameInput = popupForm.querySelector('input[name="stock-name"]');
                        if (stockNameInput) {
                            popupForm.removeChild(stockNameInput);
                        }
                        let sertificateNameInput = popupForm.querySelector('input[name="sertificate-name"]');
                        if (sertificateNameInput) {
                            popupForm.removeChild(sertificateNameInput);
                        }

                        if (dataPopupStockName) {
                            let stockNameInput = document.createElement("input");
                            stockNameInput.type = "hidden";
                            stockNameInput.name = "stock-name";
                            stockNameInput.value = dataPopupStockName;
                            popupForm.appendChild(stockNameInput);

                        }

                        if (dataPopupSpecialistLink) {
                            let specialistLinkInput = document.createElement("input");
                            specialistLinkInput.type = "hidden";
                            specialistLinkInput.name = "specialist-link";
                            specialistLinkInput.value = dataPopupSpecialistLink;
                            popupForm.appendChild(specialistLinkInput);
                        }

                        if (dataPopupSpecialistName) {
                            let specialistNameInput = document.createElement("input");
                            specialistNameInput.type = "hidden";
                            specialistNameInput.name = "specialist-name";
                            specialistNameInput.value = dataPopupSpecialistName;
                            popupForm.appendChild(specialistNameInput);
                        }

                        if (dataPopupServiceName) {
                            let serviceNameInput = document.createElement("input");
                            serviceNameInput.type = "hidden";
                            serviceNameInput.name = "service-name";
                            serviceNameInput.value = dataPopupServiceName;
                            popupForm.appendChild(serviceNameInput);

                        }

                        if (dataPopupSertificateName) {
                            let sertificateNameInput = document.createElement("input");
                            sertificateNameInput.type = "hidden";
                            sertificateNameInput.name = "sertificate-name";
                            sertificateNameInput.value = dataPopupSertificateName;
                            popupForm.appendChild(sertificateNameInput);
                        }

                        if (dataPopupServiceLink) {
                            let serviceLinkInput = document.createElement("input");
                            serviceLinkInput.type = "hidden";
                            serviceLinkInput.name = "service-link";
                            serviceLinkInput.value = dataPopupServiceLink;
                            popupForm.appendChild(serviceLinkInput);
                        }

                    }

                    addClass(overlay, 'open');
                    addClass(popup, 'open');
                } else {
                    console.error(`Попап с ID: ${btnDataId} не найден`);
                }
            })
        });
    }

    if (document.querySelector('.form-all')) {
        const formSect = document.querySelectorAll(".form-all");
        const titlePopupCheck = popupCheck.querySelector('.h2');

        let widgetId;

        function handleCaptcha(btn, input) {

            // if (!window.smartCaptcha) {
            //     console.error("SmartCaptcha не загружен.");
            //     return;
            // }

            // widgetId = window.smartCaptcha.render(`captcha-container`, {
            //     sitekey: 'ysc1_Y9uiAkGdpunKlCiElSagu658pl0QGAKlFwn3Qlsze326e63b', // Замените на ваш Client Key
            //     invisible: true, // Указываем, что капча невидимая
            //     callback: (token) => {
            //         input.value = token;
            //         btn.click();
            //     },
            // });
        }

        formSect.forEach(formSect => {

            let form = formSect.querySelector("form");
            let formBtn = formSect.querySelector("[type='submit']");
            let nameInp = formSect.querySelector("[name='name']");
            let phoneInp = formSect.querySelector("[name='phone']");
            let textInp = formSect.querySelector("[name='message']");
            let selectInp = formSect.querySelector("[name='service']");

            let checkBoxBtn = formSect.querySelector("[data-processing]");

            if (checkBoxBtn) {
                removeClass(checkBoxBtn, 'checked');
            }

            if (formSect.classList.contains('popupForm')) {
                let closePopupBtn = formSect.querySelector('.close-btn');

                closePopupBtn.addEventListener('click', () => {
                    removeClass(overlay, 'open');
                    removeClass(formSect, 'open');
                })

                formSect.addEventListener('click', (e) => {
                    if (e.target.classList.contains('popupForm')) {
                        overlay.click();
                    }
                })
            }

            function allCheck() {
                if (checkInputsValid(nameInp, 1) && checkInputsValid(phoneInp, 17) && checkCheckBox(checkBoxBtn)) {
                    return true;
                } else {
                    return false;
                }
            }

            function checkCheckBox(checkbox) {
                if (checkbox) {
                    if (checkbox.classList.contains('checked')) {
                        removeClass(checkbox, 'err');
                        formBtn.disabled = false;
                        return true;
                    } else {
                        addClass(checkbox, 'err');
                        formBtn.disabled = true;
                        return false;
                    }
                } else {
                    return true;
                }
            }

            window.addEventListener("DOMContentLoaded", function () {
                [].forEach.call(document.querySelectorAll("[name='phone']"), function (input) {
                    var keyCode;
                    function mask(event) {
                        event.keyCode && (keyCode = event.keyCode);
                        var pos = this.selectionStart;
                        if (pos < 3) event.preventDefault();
                        var matrix = "+7 (___) ___ ____",
                            i = 0,
                            def = matrix.replace(/\D/g, ""),
                            val = this.value.replace(/\D/g, ""),
                            new_value = matrix.replace(/[_\d]/g, function (a) {
                                return i < val.length ? val.charAt(i++) : a
                            });
                        i = new_value.indexOf("_");
                        if (i != -1) {
                            i < 5 && (i = 3);
                            new_value = new_value.slice(0, i)
                        }
                        var reg = matrix.substr(0, this.value.length).replace(/_+/g,
                            function (a) {
                                return "\\d{1," + a.length + "}"
                            }).replace(/[+()]/g, "\\$&");
                        reg = new RegExp("^" + reg + "$");
                        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) {
                            this.value = new_value;
                        }
                        if (event.type == "blur" && this.value.length < 5) {
                            this.value = "";
                        }
                    }

                    input.addEventListener("input", mask, false);
                    input.addEventListener("focus", mask, false);
                    input.addEventListener("blur", mask, false);
                    input.addEventListener("keydown", mask, false);

                });
            });

            $(function () {
                $(nameInp).keyup(function () {
                    sergey = $(this).val().toLowerCase(), spout = 'http://,https,url,.ru,.com,.net,.tk,php,.ucoz,www,.ua,.tv,.info,.org,.su,.ру,.су,.ком,.инфо,//'.split(',');
                    for (litvinov = 0; litvinov < spout.length; litvinov++) {
                        if (sergey.search(spout[litvinov]) != -1) {
                            $(this).val(sergey.replace(spout[litvinov], '[Запрещено]'));
                            return true;
                        }
                    }
                });
            });

            function checkInputsValid(input, num) {
                if (input.value.length < num) {
                    input.parentNode.classList.add("err");
                    formBtn.disabled = true;
                    return false;
                } else {
                    input.parentNode.classList.remove("err");

                    return true;
                }
            }

            let check;

            function addLisInput(input, num) {
                checkInputsValid(input, num);
                input.addEventListener('input', check = () => {
                    checkInputsValid(input, num);
                    if (allCheck()) {
                        formBtn.disabled = false;
                    } else {
                        formBtn.disabled = true;
                    }
                })
            }

            function removeLisInput(input) {
                input.removeEventListener('input', check)
            }

            let check_4;

            function addLisCheckBox(checkbox) {
                checkCheckBox(checkbox);
                checkbox.addEventListener('click', check_4 = () => {
                    checkCheckBox(checkbox);
                    if (allCheck()) {
                        formBtn.disabled = false;
                    } else {
                        formBtn.disabled = true;
                    }
                })
            }

            function removeLisCheckBox(checkbox) {
                checkbox.removeEventListener('click', check_4);
            }

            function clearInputs(input) {
                removeLisInput(input);

                if (checkBoxBtn) {
                    removeClass(checkBoxBtn, 'err');
                    removeClass(checkBoxBtn, 'checked');
                }

                input.value = '';
            }

            function handleTextGood() {
                // window.smartCaptcha.destroy(widgetId);
                addLoad();
                setTimeout(() => {
                    removeLoad();
                    titlePopupCheck.textContent = 'Спасибо за заявку! Скоро мы вам перезвоним!';
                    removeClass(formSect, 'open');
                    addClass(overlay, 'open')
                    addClass(popupCheck, 'open')
                    formSect.querySelectorAll('.focus').forEach(el => {
                        removeClass(el, 'focus');
                    });
                    if (textInp) {
                        textInp.value = "";
                    }
                    if (selectInp) {
                        selectInp.value = 'all';
                    }
                    if (nameInp) {
                        clearInputs(nameInp);
                    }
                    clearInputs(phoneInp);

                    clearInputs(captchaInp);
                    setTimeout(() => {
                        document.querySelectorAll('.open').forEach(el => {
                            removeClass(el, 'open');
                        })
                    }, 3500);
                }, 1000);

            }

            function handleTextNoGood() {
                removeLoad();
                titlePopupCheck.textContent = 'Повторите попытку позже';
                removeClass(formSect, 'open');
                addClass(popupCheck, 'open');
                setTimeout(() => {
                    if (overlay.classList.contains('open')) {
                        addClass(formSect, 'open');
                    }
                }, 3500);
            }

            function handleTextError() {
                removeLoad();
                titlePopupCheck.textContent = 'Что-то пошло не так';
                removeClass(formSect, 'open');
                addClass(popupCheck, 'open');
                setTimeout(() => {
                    if (overlay.classList.contains('open')) {
                        addClass(formSect, 'open');
                    }
                }, 3500);
            }

            // Создаем скрытое поле для токена капчи
            let captchaTokenInput = document.createElement('input');
            captchaTokenInput.type = 'hidden';
            captchaTokenInput.name = `captcha_token`;

            // Добавляем скрытое поле в начало текущей формы
            form.prepend(captchaTokenInput);

            let captchaInp = form.querySelector(`[name="captcha_token"]`);

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                removeLisInput(phoneInp);

                if (nameInp) {
                    removeLisInput(nameInp);
                    addLisInput(nameInp, 1);
                }
                addLisInput(phoneInp, 17);

                if (checkBoxBtn) {
                    removeLisCheckBox(checkBoxBtn);
                    addLisCheckBox(checkBoxBtn);
                }

                if (allCheck()) {
                    // if (!captchaInp.value) {
                    //     handleCaptcha(formBtn, captchaInp);
                    //     window.smartCaptcha.execute(widgetId);
                    //     return;
                    // } else {
                    //     addLoad();

                    //     let formData = new FormData(form);
                    //     formData.append('captcha_token', captchaInp.value);
                    //     fetch('/local/templates/main/tools/send.php', {
                    //         method: 'POST',
                    //         body: formData,
                    //     })
                    //         .then((res) => res.json())
                    //         .then(result => {
                    //             if (result.success) {
                    //                 handleTextGood();
                    //             } else {
                    //                 handleTextNoGood();
                    //             }
                    //         })
                    //         .catch((err) => {
                    //             handleTextError();
                    //             console.log(err);
                    //         });
                    // }
                    handleTextGood();
                }

            })
        });
    }

    if (document.getElementById('isAdmin')) {
        console.log('index.js finish work');
    }
});