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
        inputName,
        inputCount,
        inputPrice,
        changeBtnInModal,
		changeBtnAboveModal = document.getElementById("addAboveModal"),
		changeName = document.getElementById("storeName"),
        changeCount = document.getElementById("storeCount"),
        changePrice = document.getElementById("storePrice"),
        changePropriety = document.getElementById("storePropriety"),
        tbodyEdit = document.getElementById("tbodyElem");

    changeBtnAboveModal.addEventListener("click", addPrepare);
	tbodyEdit.addEventListener("click", tbodyClick);
	
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
        inputName = document.getElementById("addName");
        inputCount = document.getElementById("addCount");
        inputPrice = document.getElementById("addPrice");
        changeBtnInModal = document.getElementById("addInModal");
        resetError(inputName.parentElement);
        resetError(inputCount.parentElement);
        resetError(inputPrice.parentElement);
        resetError(changeBtnInModal.parentElement);
        changePropriety.value = 0;
        flagName = flagCount = flagPrice = false;
        inputName.value = inputCount.value = inputPrice.value = "";
        changeName.value = changeCount.value = changePrice.value = "";
		inputName.addEventListener("keypress", nameFormat);
		inputName.addEventListener("paste", nameDeny);
		inputName.addEventListener("blur", nameCheck);
		inputCount.addEventListener("keypress", countFormat);
		inputCount.addEventListener("paste", countDeny);
		inputCount.addEventListener("blur", countCheck);
		inputPrice.addEventListener("focus", priceRegain);
		inputPrice.addEventListener("keypress", priceFormat);
		inputPrice.addEventListener("paste", priceDeny);
		inputPrice.addEventListener("blur", priceCheck);
		changeBtnInModal.addEventListener("click", changeCheck);
    }

    function editPrepare(prodId) { // Заполнение полей input значениями из хранилища.
        inputName = document.getElementById("editName" + prodId);
        inputCount = document.getElementById("editCount" + prodId);
        inputPrice = document.getElementById("editPrice" + prodId);
        changeBtnInModal = document.getElementById("editInModal" + prodId);
        resetError(inputName.parentElement);
        resetError(inputCount.parentElement);
        resetError(inputPrice.parentElement);
        resetError(changeBtnInModal.parentElement);
        changePropriety.value = 0;
        flagName = flagCount = flagPrice = false;
        inputName.value = changeName.value;
        inputCount.value = changeCount.value;
        inputPrice.value = formatterUsdCur.format(+changePrice.value);
        inputName.addEventListener("keypress", nameFormat);
        inputName.addEventListener("paste", nameDeny);
        inputName.addEventListener("blur", nameCheck);
        inputCount.addEventListener("keypress", countFormat);
        inputCount.addEventListener("paste", countDeny);
        inputCount.addEventListener("blur", countCheck);
        inputPrice.addEventListener("focus", priceRegain);
        inputPrice.addEventListener("keypress", priceFormat);
        inputPrice.addEventListener("paste", priceDeny);
        inputPrice.addEventListener("blur", priceCheck);
        changeBtnInModal.addEventListener("click", changeCheck);
    }

    function nameFormat(evt) { // Проверка символов по одному.
        var e = evt || window.evt,
            code = e.charCode || e.keyCode,
            nameSymbol;

        resetError(inputName.parentElement);
        if (code < controlCharMaxNum ||
			e.charCode === firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }
        nameSymbol = String.fromCharCode(code);

        if (!nameMask.test(nameSymbol)) {
            showError(inputName.parentElement, "* Введите буквы, цифры или спецсимволы");
        } else if (inputName.value.length >= 15) {
            showError(inputName.parentElement, "* Имя должно быть от 1 до 15 символов");
        } else {
            return;
        }
        e.preventDefault();
    }

    function nameCheck() { // Проверка по завершении редактирования.
        var nameText = inputName.value.trim(),
            emptyName = false; 
        if (nameText === "") {
            emptyName = true;
        }

        resetError(inputName.parentElement);

        if (emptyName) {
            showError(inputName.parentElement, "* Поле не может быть пустым или из одних пробелов");
        } else if (!nameWildcard.test(nameText)) {
            showError(inputName.parentElement, "* Должно быть от 1 до 15 букв, цифр или спецсимволов");
        } else {
            changeName.value = nameText;
            inputName.value = nameText;
            flagName = true;
            proprietyControl();
        }
    }

    function nameDeny(e) { // Запрещение копирования из буфера обмена.
        resetError(inputName.parentElement);
        showError(inputName.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault();
    }

    function countFormat(evt) { // Проверка символов на цифры по одному.
        var e = evt || window.evt,
            code = e.charCode || e.keyCode,
            countSymbol;

        resetError(inputCount.parentElement);
        if (code < controlCharMaxNum ||
			e.charCode === firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }
        countSymbol = String.fromCharCode(code);

        if (!countMask.test(countSymbol)) {
            showError(inputCount.parentElement, "* Нужно вводить цифры");
        } else if (inputCount.value.length >= 15) {
            showError(inputCount.parentElement, "* Количество должно быть от 1 до 15 цифр");
        } else {
            return;
        }
        e.preventDefault();
    }

    function countCheck() { // Проверка по завершении редактирования.
        var countNumber = inputCount.value,
            emptyCount = false;
        if (countNumber === "") {
            emptyCount = true;
        }

        countNumber = +countNumber; // Преобразование к числовому значению.
        resetError(inputCount.parentElement);

        if (emptyCount) {
            showError(inputCount.parentElement, "* Введена пустая строка. Повторите ввод");
        } else if (isNaN(countNumber)) {
            showError(inputCount.parentElement, "* Введено не число. Повторите ввод");
        } else if (!countNumber) {
            inputCount.value = 0;
            showError(inputCount.parentElement, "* Введён ноль. Повторите ввод");
        } else {
            changeCount.value = countNumber;
            inputCount.value = countNumber;
            flagCount = true;
            proprietyControl();
        }
    }

    function countDeny(e) { // Запрещение копирования из буфера обмена.
        resetError(inputCount.parentElement);
        showError(inputCount.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault();
    }

    function priceFormat(evt) { // Проверка символов по одному.
        var e = evt || window.evt,
            code = e.charCode || e.keyCode,
            priceSymbol;

        resetError(inputPrice.parentElement);
        if (code < controlCharMaxNum ||
			e.charCode === firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }

        priceSymbol = String.fromCharCode(code);

        if (!priceMask.test(priceSymbol)) {
            showError(inputPrice.parentElement, "* Введите цифры или десятичную точку");
        } else if (inputPrice.value.length >= 15) {
            showError(inputPrice.parentElement, "* Цена должна содержать от 1 до 15 цифр или точку");
        } else {
            return;
        }
        e.preventDefault();
    }

    function priceRegain() { // Восстановление отображения цены при получении фокуса.
        if (changePrice.value) {
            inputPrice.value = changePrice.value;
        }
    }

    function priceCheck() { // Проверка по завершении редактирования.
        var priceNumber = inputPrice.value,
            emptyPrice = false;

        if (priceNumber === "") {
            emptyPrice = true;
        }

        resetError(inputPrice.parentElement);
        priceNumber = +priceNumber;

        if (emptyPrice) {
            showError(inputPrice.parentElement, "* Введена пустая строка. Повторите ввод");
        } else if (isNaN(priceNumber)) {
            showError(inputPrice.parentElement, "* Введено не число. Повторите ввод");
        } else if (!priceNumber) {
            inputPrice.value = 0;
            showError(inputPrice.parentElement, "* Введён ноль. Повторите ввод");
        } else {
            changePrice.value = Math.round(priceNumber * 100) / 100;
            inputPrice.value = formatterUsdCur.format(priceNumber);
            flagPrice = true;
            proprietyControl();
        }
    }

    function priceDeny(e) { // Запрещение копирования из буфера обмена.
        resetError(inputPrice.parentElement);
        showError(inputPrice.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault();
    }

    function changeCheck(e) { // Проверка корректности ввода.
        var correctness = +changePropriety.value;
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
            changePropriety.value = 1;
        }
    }

    function tbodyClick(e) { // Обработка нажатия на кнопку редактирования.
        var target = e.target;
		if (target.id.substring(0, 8) === "editAbov") {
			editPrepare(target.id.substring(14));
		}
    }
})();
