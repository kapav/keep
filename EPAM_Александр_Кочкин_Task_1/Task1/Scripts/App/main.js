; (function () {
    var glyphiconTopClass = "glyphicon glyphicon-triangle-top",
        glyphiconBottomClass = "glyphicon glyphicon-triangle-bottom",
        primaryButtonStyle = "btn-primary",
        warningButtonStyle = "btn-warning",
        prodStorage = [
            { id: 1, name: "Товар 1", count: 5, price: 12352.25 },
            { id: 2, name: "Товар 2", count: 15, price: 12552.25 },
            { id: 3, name: "Товар 3", count: 150, price: 12452.25 }
        ],
        prodShow = [],
        formatterUsdCur = new Intl.NumberFormat("en-US", {
		  style: "currency",
		  currency: "USD"
		}),
        currentId = 4,
        prodIndexInArray = -1,
        sortingName = false,
        sortingPrice = false,
		dbBtnFilter = document.forms.filterAndAddForm.filterProduct,
        dbBtnAdd = document.forms.filterAndAddForm.addProduct,
		dbBtnInModal = document.forms.changeForm.changeInModal,
		toggleName = document.forms.toggleNameForm.toggleName,
		togglePrice = document.forms.togglePriceForm.togglePrice,
        tbodyDb = $("#tbodyElement")[0];

    $(window).on("load", searchDb);
    $(dbBtnFilter).click(searchDb);
    $(dbBtnAdd).click(addRetrieve);
    $(dbBtnInModal).click(changePlace);
    $(toggleName).click(sortingToggle);
    $(togglePrice).click(sortingToggle);
    $(tbodyDb).click(tbodyClick);

	function drawDb(prodArray) { // Отрисовывает сведения о товарах.
	    var tableRows = document.createDocumentFragment();
        $(tbodyDb).empty();
        prodArray.forEach(appendTableRow, tableRows);
	    $(tbodyDb).append(tableRows);
	}

	function searchDb() { // Фильтрация по имени товара.
	    var dbFilter = document.forms.filterAndAddForm.filterName,
	        dbFilterUpperCase = dbFilter.value.toUpperCase();
        if ( (!dbFilter.value.trim()) && (prodShow.length === prodStorage.length) ) {
            return;
        }
        prodShow = prodStorage.filter(function (prod) {
            return prod.name.slice(0, dbFilter.value.length).toUpperCase() === dbFilterUpperCase;
        });
        drawDb(prodShow);
    }

	function sortingToggle() { // Меняет направление сортировки по цене.
	    var glyphiconToggle = this.firstElementChild,
	        sortingFeature,
	        sortingFunc = function (prodA, prodB) {
	            return prodA.name.toUpperCase() < prodB.name.toUpperCase() ? -1 : 1;
	        };
	    if (!prodShow) prodShow = prodStorage;
	    switch (this.id) {
	        case "toggleName":
	            sortingName = !sortingName;
	            sortingFeature = sortingName;
	            break;
	        case "togglePrice":
	            sortingFunc = function(prodA, prodB) {
	                return prodA.price < prodB.price ? -1 : 1;
	            };
	            sortingPrice = !sortingPrice;
	            sortingFeature = sortingPrice;
	        default:
                break;
	    }
	    prodShow.sort(sortingFunc);
	    if (sortingFeature) {
	        prodShow.reverse();
	        glyphiconToggle.className = glyphiconBottomClass;
	    } else {
	        glyphiconToggle.className = glyphiconTopClass;
	    }
	    drawDb(prodShow);
	}

    function appendTableRow(prod) { // Отрисовывает элемент tr - строку перечня.
        var trElem = $(document.createElement("tr")).html($("#rowBlock").html())[0];
        trElem.id = "row" + prod.id;

        trElem.querySelector("a.prodName").innerHTML = prod.name;
        trElem.querySelector("span.prodCount").innerHTML = prod.count;
        trElem.querySelector("div.prodPrice").innerHTML = formatterUsdCur.format(prod.price);
        trElem.querySelector("button.editForModal").id = "editProduct" + prod.id;
        trElem.querySelector("button.dropForModal").id = "dropProduct" + prod.id;

        $(this).append(trElem);
    }

    function getIndex(prodArray, prodId) { // Возвращает индекс товара.
        for (var i = 0; i < prodArray.length; i++) {
            if (prodArray[i].id === prodId) { return i; }
        }
        return -1;
    }

	function addRetrieve() { // Подготавливает добавление товара.
	    $(dbBtnInModal).removeClass(warningButtonStyle);
		$(dbBtnInModal).addClass(primaryButtonStyle);
		$(dbBtnInModal).html("Add");
		dbBtnInModal.dataset.isUpdate = "0";
	}
	
	function editRetrieve(prodId) { // Извлекает из хранилища сведения о товаре.
        prodIndexInArray = getIndex(prodStorage, +prodId);
        if (prodIndexInArray !== -1) {
            appConfig.name = prodStorage[prodIndexInArray].name;
            appConfig.count = prodStorage[prodIndexInArray].count;
            appConfig.price = prodStorage[prodIndexInArray].price;
        }
        $(dbBtnInModal).removeClass(primaryButtonStyle);
        $(dbBtnInModal).addClass(warningButtonStyle);
		$(dbBtnInModal).html("Update");
		dbBtnInModal.dataset.isUpdate = "1";
	    dbBtnInModal.dataset.prodIdInObj = prodId;
	}
	
	function changePlace() { // Размещает отредактированные сведения о товаре в хранилище.
	    setTimeout(function() {
	        var prodObj = {},
                priceRound,
	            changeTrElem;
	        if (appConfig.propriety) {
	            prodObj.id = currentId;
	            prodObj.name = appConfig.name;
	            prodObj.count = +appConfig.count;
	            priceRound = +appConfig.price;
	            prodObj.price = Math.round(priceRound * 100) / 100;
	            prodStorage.push(prodObj);
	            appendTableRow.call(tbodyDb, prodObj);
	            currentId++;
	            if (+dbBtnInModal.dataset.isUpdate) {
	                prodStorage.splice(prodIndexInArray, 1);
	                changeTrElem = $("#row" + dbBtnInModal.dataset.prodIdInObj)[0];
	                $(changeTrElem).remove();
	            }
	            prodShow = prodStorage;
	        }
	    }, 0);
    }

    function dropRetrieve(prodId) { // Извлекает удаляемый товар.
        prodIndexInArray = getIndex(prodStorage, +prodId);
        dbBtnInModal = document.forms.dropForm.dropInModal;
        dbBtnInModal.dataset.prodIdInObj = prodId;
        $(dbBtnInModal).click(dropPlace);
    }

    function dropPlace() { // Удаляет из хранилища объект товара.
        var dropTrElem = $("#row" + dbBtnInModal.dataset.prodIdInObj)[0];
        prodStorage.splice(prodIndexInArray, 1);
        $(dropTrElem).remove();
        prodShow = prodStorage;
    }

    function tbodyClick(e) { // Кнопки редактирования или удаления.
        var target = e.target.id;

        switch (target.substring(0, 11)) {
            case "editProduct":
                editRetrieve(target.substring(11));
                break;
            case "dropProduct":
                dropRetrieve(target.substring(11));
                break;
            default:
                break;
        }
    }
}());
