; (function () {
	var controlCharMaxNum = 32,
		firefoxFuncBtnNum = 0,
        filterMask = /[a-zA-Zа-яА-ЯёЁ0-9 _,;:\\\/\-\.\+\*\(\)!@#\$%&={}\[\]\"\'\?<>№]/,
		btnFilterName = document.forms.filterAndAddForm.filterName;

    btnFilterName.value = "";

    $(btnFilterName)
        .on({
            keypress: filterFormat,
            paste: filterDeny,
            blur: filterCheck()
        });

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

    function filterFormat(evt) { // Проверка символов по одному.
        var e = evt || window.evt,
            code = e.charCode || e.keyCode,
            filterSymbol;

        resetError(btnFilterName.parentElement.parentElement.parentElement);
        if (code < controlCharMaxNum ||
			e.charCode === firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }

        filterSymbol = String.fromCharCode(code);

        if (!filterMask.test(filterSymbol)) {
            showError(btnFilterName.parentElement.parentElement.parentElement, "* Введите буквы, цифры или спецсимволы");
        } else if (btnFilterName.value.length >= 15) {
            showError(btnFilterName.parentElement.parentElement.parentElement, "* Фильтр должен быть от 1 до 15 символов");
        } else {
            return;
        }
        e.preventDefault();
    }

    function filterCheck() { // Проверка фильтра имени товара для поиска.
        var filterText = btnFilterName.value.trim();
        resetError(btnFilterName.parentElement.parentElement.parentElement);
        btnFilterName.value = filterText;
    }

    function filterDeny(e) { // Запрещение копирования из буфера обмена.
        resetError(btnFilterName.parentElement.parentElement.parentElement);
        showError(btnFilterName.parentElement.parentElement.parentElement, "* Нельзя копировать из буфера обмена");
        e.preventDefault();
    }
})();