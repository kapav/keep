; (function () {
    var controlCharMaxNum = 32,
		firefoxFuncBtnNum = 0,
        nameMask = /[a-zA-Zа-яА-ЯёЁ0-9 _,;:\\\/\-\.\+\*\(\)!@#\$%&={}\[\]\"\'\?<>№]/,
        nameWildcard = /^[a-zA-Zа-яА-ЯёЁ0-9 _,;:\\\/\-\.\+\*\(\)!@#\$%&={}\[\]\"\'\?<>№]{1,15}$/,
        countMask = /[\d]/,
        priceMask = /[\d\.]/,
		formatterUsdCur = new Intl.NumberFormat("en-US", {
		  style: "currency",
		  currency: "USD"
		}),
        flagName = false,
        flagCount = false,
        flagPrice = false,
		storeName = document.forms.storeForm.storeName,
        storeCount = document.forms.storeForm.storeCount,
        storePrice = document.forms.storeForm.storePrice,
        storePropriety = document.forms.storeForm.storePropriety,
		changeBtnAboveModal = document.forms.filterAndAddForm.addAboveModal,
        changeName = document.forms.filterAndAddForm.addName,
        changeCount = document.forms.filterAndAddForm.addCount,
        changePrice = document.forms.filterAndAddForm.addPrice,
        changeBtnInModal = document.forms.filterAndAddForm.changeInModal,
        tbodyEdit = document.getElementById("tbodyElem");

	document.addEventListener("click", tbodyClick);
	
    function showError(container, errorMessage) { // Отобразить ошибку.
        var msgElem = document.createElement("span");
        msgElem.className = "error-msg";
        msgElem.innerHTML = errorMessage;
        container.insertBefore(msgElem, container.firstChild);
    }

    function resetError(container) { // Сбросить ошибку.
        if (container.firstChild.className === "error-msg") {
            container.removeChild(container.firstChild);
        }
    }

    function addPrepare() { // Очистка полей input при открытии модального окна.
        resetError(changeName.parentElement);
        resetError(changeCount.parentElement);
        resetError(changePrice.parentElement);
        resetError(changeBtnInModal.parentElement);
        storePropriety.value = 0;
        flagName = flagCount = flagPrice = false;
        changeName.value = changeCount.value = changePrice.value = "";
        storeName.value = storeCount.value = storePrice.value = "";
		changeName.addEventListener("keypress", nameFormat);
		changeName.addEventListener("paste", nameDeny);
		changeName.addEventListener("blur", nameCheck);
		changeCount.addEventListener("keypress", countFormat);
		changeCount.addEventListener("paste", countDeny);
		changeCount.addEventListener("blur", countCheck);
		changePrice.addEventListener("focus", priceRegain);
		changePrice.addEventListener("keypress", priceFormat);
		changePrice.addEventListener("paste", priceDeny);
		changePrice.addEventListener("blur", priceCheck);
		changeBtnInModal.addEventListener("click", changeCheck);
    }

    function editPrepare() { // Заполнение полей input значениями из хранилища.
        resetError(changeName.parentElement);
        resetError(changeCount.parentElement);
        resetError(changePrice.parentElement);
        resetError(changeBtnInModal.parentElement);
        storePropriety.value = 0;
        flagName = flagCount = flagPrice = false;
        changeName.value = storeName.value;
        changeCount.value = storeCount.value;
        changePrice.value = formatterUsdCur.format(+storePrice.value);
        changeName.addEventListener("keypress", nameFormat);
        changeName.addEventListener("paste", nameDeny);
        changeName.addEventListener("blur", nameCheck);
        changeCount.addEventListener("keypress", countFormat);
        changeCount.addEventListener("paste", countDeny);
        changeCount.addEventListener("blur", countCheck);
        changePrice.addEventListener("focus", priceRegain);
        changePrice.addEventListener("keypress", priceFormat);
        changePrice.addEventListener("paste", priceDeny);
        changePrice.addEventListener("blur", priceCheck);
        changeBtnInModal.addEventListener("click", changeCheck);
    }

    function nameFormat(evt) { // Проверка символов по одному.
        var e = evt || window.evt,
            code = e.charCode || e.keyCode,
            nameSymbol;

        resetError(changeName.parentElement);
        if (code < controlCharMaxNum ||
			e.charCode === firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }
        nameSymbol = String.fromCharCode(code);

        if (!nameMask.test(nameSymbol)) {
            showError(changeName.parentElement, "* Введите буквы, цифры или спецсимволы");
        } else if (changeName.value.length >= 15) {
            showError(changeName.parentElement, "* Имя должно быть от 1 до 15 символов");
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

        resetError(changeName.parentElement);

        if (emptyName) {
            showError(changeName.parentElement, "* Поле не может быть пустым или из одних пробелов");
        } else if (!nameWildcard.test(nameText)) {
            showError(changeName.parentElement, "* Должно быть от 1 до 15 букв, цифр или спецсимволов");
        } else {
            storeName.value = nameText;
            changeName.value = nameText;
            flagName = true;
            proprietyControl();
        }
    }

    function nameDeny(e) { // Запрещение копирования из буфера обмена.
        resetError(changeName.parentElement);
        showError(changeName.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault();
    }

    function countFormat(evt) { // Проверка символов на цифры по одному.
        var e = evt || window.evt,
            code = e.charCode || e.keyCode,
            countSymbol;

        resetError(changeCount.parentElement);
        if (code < controlCharMaxNum ||
			e.charCode === firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }
        countSymbol = String.fromCharCode(code);

        if (!countMask.test(countSymbol)) {
            showError(changeCount.parentElement, "* Нужно вводить цифры");
        } else if (changeCount.value.length >= 15) {
            showError(changeCount.parentElement, "* Количество должно быть от 1 до 15 цифр");
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
        resetError(changeCount.parentElement);

        if (emptyCount) {
            showError(changeCount.parentElement, "* Введена пустая строка. Повторите ввод");
        } else if (isNaN(countNumber)) {
            showError(changeCount.parentElement, "* Введено не число. Повторите ввод");
        } else if (!countNumber) {
            changeCount.value = 0;
            showError(changeCount.parentElement, "* Введён ноль. Повторите ввод");
        } else {
            storeCount.value = countNumber;
            changeCount.value = countNumber;
            flagCount = true;
            proprietyControl();
        }
    }

    function countDeny(e) { // Запрещение копирования из буфера обмена.
        resetError(changeCount.parentElement);
        showError(changeCount.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault();
    }

    function priceFormat(evt) { // Проверка символов по одному.
        var e = evt || window.evt,
            code = e.charCode || e.keyCode,
            priceSymbol;

        resetError(changePrice.parentElement);
        if (code < controlCharMaxNum ||
			e.charCode === firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }

        priceSymbol = String.fromCharCode(code);

        if (!priceMask.test(priceSymbol)) {
            showError(changePrice.parentElement, "* Введите цифры или десятичную точку");
        } else if (changePrice.value.length >= 15) {
            showError(changePrice.parentElement, "* Цена должна содержать от 1 до 15 цифр или точку");
        } else {
            return;
        }
        e.preventDefault();
    }

    function priceRegain() { // Восстановление отображения цены при получении фокуса.
        if (storePrice.value) {
            changePrice.value = storePrice.value;
        }
    }

    function priceCheck() { // Проверка по завершении редактирования.
        var priceNumber = changePrice.value,
            emptyPrice = false;

        if (priceNumber === "") {
            emptyPrice = true;
        }

        resetError(changePrice.parentElement);
        priceNumber = +priceNumber;

        if (emptyPrice) {
            showError(changePrice.parentElement, "* Введена пустая строка. Повторите ввод");
        } else if (isNaN(priceNumber)) {
            showError(changePrice.parentElement, "* Введено не число. Повторите ввод");
        } else if (!priceNumber) {
            changePrice.value = 0;
            showError(changePrice.parentElement, "* Введён ноль. Повторите ввод");
        } else {
            storePrice.value = Math.round(priceNumber * 100) / 100;
            changePrice.value = formatterUsdCur.format(priceNumber);
            flagPrice = true;
            proprietyControl();
        }
    }

    function priceDeny(e) { // Запрещение копирования из буфера обмена.
        resetError(changePrice.parentElement);
        showError(changePrice.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault();
    }

    function changeCheck(e) { // Проверка корректности ввода.
        var correctness = +storePropriety.value;
        resetError(changeBtnInModal.parentElement);
        nameCheck();
        countCheck();
        priceRegain();
        priceCheck();
        if (!correctness) {
            showError(changeBtnInModal.parentElement, "* Заполните поля правильно");
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function proprietyControl() { // Проверка корректности ввода.
        if (flagName && flagCount && flagPrice) {
            storePropriety.value = 1;
        }
    }

    function tbodyClick(e) { // Обработка нажатия на кнопку редактирования.
        var target = e.target;
		
        switch (target.id.substring(0, 13)) {
            case "addAboveModal":
                addPrepare();
                break;
            case "editAboveModa":
                editPrepare();
                break;
            default:
                break;
        }
    }
})();
