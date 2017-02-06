;
(function() {
    var controlCharMaxNum = 32,
        firefoxFuncBtnNum = 0,
        nameMask = /[a-zA-Zа-яА-ЯёЁ0-9 _,;:\\\/\-\.\+\*\(\)!@#\$%&={}\[\]\"\'\?<>№]/,
        nameWildcard = /^[a-zA-Zа-яА-ЯёЁ0-9 _,;:\\\/\-\.\+\*\(\)!@#\$%&={}\[\]\"\'\?<>№]{1,15}$/,
        countMask = /[\d]/,
        priceMask = /[\d\.]/,
        formatterUsdCur = new Intl.NumberFormat("en-US",
        {
            style: "currency",
            currency: "USD"
        }),
        flagName = false,
        flagCount = false,
        flagPrice = false,
        btnAdd = document.forms.filterAndAddForm.addProduct,
        changeForm = document.forms.changeForm,
        changeName = changeForm.changeName,
        changeCount = changeForm.changeCount,
        changePrice = changeForm.changePrice,
        changeBtnInModal = changeForm.changeInModal,
        tbodyChange = $("#tbodyElement")[0];

    $(btnAdd).click(addPrepare);
    $(changeBtnInModal).click(changeCheck);
    $(tbodyChange).click(tbodyClick);

    $(changeName)
        .on({
            keypress: nameFormat,
            paste: nameDeny,
            blur: nameCheck
        });
    $(changeCount)
        .on({
            keypress: countFormat,
            paste: countDeny,
            blur: countCheck
        });
    $(changePrice)
        .on({
            focus: priceRegain,
            keypress: priceFormat,
            paste: priceDeny,
            blur: priceCheck
        });

	function resetErrorsProprietyAndFlags() {
        appConfig.resetError(changeName);
        appConfig.resetError(changeCount);
        appConfig.resetError(changePrice);
        appConfig.propriety = 0;
        flagName = flagCount = flagPrice = false;
	}
	
    function addPrepare() { // Очистка полей input при открытии модального окна.
		resetErrorsProprietyAndFlags();
        changeName.value = changeCount.value = changePrice.value = "";
        appConfig.name = appConfig.count = appConfig.price = "";
    }

    function editPrepare() { // Заполнение полей input значениями из хранилища.
        setTimeout(function() {
            resetErrorsProprietyAndFlags();
            changeName.value = appConfig.name;
            changeCount.value = appConfig.count;
            changePrice.value = formatterUsdCur.format(+appConfig.price);
        }, 0);
    }

    function nameFormat(evt) { // Проверка символов по одному.
        var e = evt || window.evt,
            code = e.charCode || e.keyCode,
            nameSymbol;

        appConfig.resetError(changeName);
        if (code < controlCharMaxNum ||
			e.charCode === firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }
        nameSymbol = String.fromCharCode(code);

        if (!nameMask.test(nameSymbol)) {
            appConfig.showError(changeName, "* Введите буквы, цифры или спецсимволы");
        } else if (changeName.value.length >= 15) {
            appConfig.showError(changeName, "* Имя должно быть от 1 до 15 символов");
        } else {
            return;
        }
        e.preventDefault();
    }

    function nameCheck() { // Проверка по завершении редактирования.
        var nameText = changeName.value.trim(),
            emptyName = false; 
        if (nameText === "") {
            emptyName = true;
        }

        appConfig.resetError(changeName);

        if (emptyName) {
            appConfig.showError(changeName, "* Поле не может быть пустым или из одних пробелов");
        } else if (!nameWildcard.test(nameText)) {
            appConfig.showError(changeName, "* Должно быть от 1 до 15 букв, цифр или спецсимволов");
        } else {
            appConfig.name = nameText;
            changeName.value = nameText;
            flagName = true;
            proprietyControl();
        }
    }

    function nameDeny(e) { // Запрещение копирования из буфера обмена.
        appConfig.resetError(changeName);
        appConfig.showError(changeName, "* Нельзя копировать из буфера обмена");
        e.preventDefault();
    }

    function countFormat(evt) { // Проверка символов на цифры по одному.
        var e = evt || window.evt,
            code = e.charCode || e.keyCode,
            countSymbol;

        appConfig.resetError(changeCount);
        if (code < controlCharMaxNum ||
			e.charCode === firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }
        countSymbol = String.fromCharCode(code);

        if (!countMask.test(countSymbol)) {
            appConfig.showError(changeCount, "* Нужно вводить цифры");
        } else if (changeCount.value.length >= 15) {
            appConfig.showError(changeCount, "* Количество должно быть от 1 до 15 цифр");
        } else {
            return;
        }
        e.preventDefault();
    }

    function countCheck() { // Проверка по завершении редактирования.
        var countNumber = changeCount.value,
            emptyCount = false;
        if (countNumber === "") {
            emptyCount = true;
        }

        countNumber = +countNumber; // Преобразование к числовому значению.
        appConfig.resetError(changeCount);

        if (emptyCount) {
            appConfig.showError(changeCount, "* Введена пустая строка. Повторите ввод");
        } else if (isNaN(countNumber)) {
            appConfig.showError(changeCount, "* Введено не число. Повторите ввод");
        } else if (!countNumber) {
            changeCount.value = 0;
            appConfig.showError(changeCount, "* Введён ноль. Повторите ввод");
        } else {
            appConfig.count = countNumber;
            changeCount.value = countNumber;
            flagCount = true;
            proprietyControl();
        }
    }

    function countDeny(e) { // Запрещение копирования из буфера обмена.
        appConfig.resetError(changeCount);
        appConfig.showError(changeCount, "* Нельзя копировать из буфера обмена");
        e.preventDefault();
    }

    function priceFormat(evt) { // Проверка символов по одному.
        var e = evt || window.evt,
            code = e.charCode || e.keyCode,
            priceSymbol;

        appConfig.resetError(changePrice);
        if (code < controlCharMaxNum ||
			e.charCode === firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }

        priceSymbol = String.fromCharCode(code);

        if (!priceMask.test(priceSymbol)) {
            appConfig.showError(changePrice, "* Введите цифры или десятичную точку");
        } else if (changePrice.value.length >= 15) {
            appConfig.showError(changePrice, "* Цена должна содержать от 1 до 15 цифр или точку");
        } else {
            return;
        }
        e.preventDefault();
    }

    function priceRegain() { // Восстановление отображения цены при получении фокуса.
        if (appConfig.price) {
            changePrice.value = appConfig.price;
        }
    }

    function priceCheck() { // Проверка по завершении редактирования.
        var priceNumber = changePrice.value,
            emptyPrice = false;

        if (priceNumber === "") {
            emptyPrice = true;
        }

        appConfig.resetError(changePrice);
        priceNumber = +priceNumber;

        if (emptyPrice) {
            appConfig.showError(changePrice, "* Введена пустая строка. Повторите ввод");
        } else if (isNaN(priceNumber)) {
            appConfig.showError(changePrice, "* Введено не число. Повторите ввод");
        } else if (!priceNumber) {
            changePrice.value = 0;
            appConfig.showError(changePrice, "* Введён ноль. Повторите ввод");
        } else {
            appConfig.price = Math.round(priceNumber * 100) / 100;
            changePrice.value = formatterUsdCur.format(priceNumber);
            flagPrice = true;
            proprietyControl();
        }
    }

    function priceDeny(e) { // Запрещение копирования из буфера обмена.
        appConfig.resetError(changePrice);
        appConfig.showError(changePrice, "* Нельзя копировать из буфера обмена");
        e.preventDefault();
    }

    function changeCheck(e) { // Проверка корректности ввода.
        nameCheck();
        countCheck();
        priceRegain();
        priceCheck();
        if (!+appConfig.propriety) {
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function proprietyControl() { // Проверка корректности ввода.
        if (flagName && flagCount && flagPrice) {
            appConfig.propriety = 1;
        }
    }

    function tbodyClick(e) { // Обработка нажатия на кнопку редактирования.
        var target = e.target;
		
        if (target.id.substring(0, 11) === "editProduct") {
            editPrepare();
        }
    }
}());
