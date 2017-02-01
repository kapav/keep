; (function () {
	var controlCharMaxNum = 32,
		firefoxFuncBtnNum = 0,
        filterMask = /[a-zA-Zа-яА-ЯёЁ0-9 _,;:\\\/\-\.\+\*\(\)!@#\$%&={}\[\]\"\'\?<>№]/,
		filterName = document.forms.filterAndAddForm.filterName;

    filterName.value = "";

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

    function filterFormat(e) { // Проверка символов по одному.
        var e = e || window.e,
            code = e.charCode || e.keyCode,
            filterSymbol;

        resetError(filterName.parentElement.parentElement.parentElement);
        if (code < controlCharMaxNum ||
			e.charCode === firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }

        filterSymbol = String.fromCharCode(code);

        if (!filterMask.test(filterSymbol)) {
            showError(filterName.parentElement.parentElement.parentElement, "* Введите буквы, цифры или спецсимволы");
        } else if (filterName.value.length >= 15) {
            showError(filterName.parentElement.parentElement.parentElement, "* Фильтр должен быть от 1 до 15 символов");
        } else {
            return;
        }
        e.preventDefault();
    }

    function filterCheck() { // Проверка фильтра имени товара для поиска.
        var filterText = filterName.value.trim();
        resetError(filterName.parentElement.parentElement.parentElement);
        filterName.value = filterText;
    }

    function filterDeny(e) { // Запрещение копирования из буфера обмена.
        resetError(filterName.parentElement.parentElement.parentElement);
        showError(filterName.parentElement.parentElement.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault();
    }

    filterName.addEventListener("keypress", filterFormat);
    filterName.addEventListener("paste", filterDeny);
    filterName.addEventListener("blur", filterCheck);
})();