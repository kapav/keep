; (function () {
	var btnFilterName = document.forms.filterAndAddForm.filterName;

    btnFilterName.value = "";

    $(btnFilterName)
        .on({
            keypress: filterFormat,
            paste: filterDeny,
            blur: filterCheck
        });

    function filterFormat(evt) { // Проверка символов по одному.
        var e = evt || window.evt,
            code = e.charCode || e.keyCode,
            filterSymbol;

        appConfig.resetError(btnFilterName.parentElement.parentElement);
        if (code < appConfig.controlCharMaxNum ||
			e.charCode === appConfig.firefoxFuncBtnNum ||
			e.ctrlKey || e.altKey) {
            return;
        }

        filterSymbol = String.fromCharCode(code);

        if (!appConfig.isAcceptableNameChar.test(filterSymbol)) {
            appConfig.showError(btnFilterName.parentElement.parentElement, "* Введите буквы, цифры или спецсимволы");
        } else if (btnFilterName.value.length >= 15) {
            appConfig.showError(btnFilterName.parentElement.parentElement, "* Фильтр должен быть от 1 до 15 символов");
        } else {
            return;
        }
        e.preventDefault();
    }

    function filterCheck() { // Проверка фильтра имени товара для поиска.
        var filterText = btnFilterName.value.trim();
        appConfig.resetError(btnFilterName.parentElement.parentElement);
        btnFilterName.value = filterText;
    }

    function filterDeny(e) { // Запрещение копирования недопустимых символов.
        var clipboardData = e.originalEvent.clipboardData || window.clipboardData,
            pastedData;
        pastedData = clipboardData.getData("text");
        appConfig.resetError(btnFilterName.parentElement.parentElement);
        if (!appConfig.isAcceptableNameString.test(pastedData)) {
            appConfig.showError(btnFilterName.parentElement.parentElement, "* Нельзя копировать из буфера обмена недопустимые символы");
        } else {
            return;
        }
        e.preventDefault();
    }
}());