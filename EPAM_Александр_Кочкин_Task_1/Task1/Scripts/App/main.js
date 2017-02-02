; (function () {
    var prodStorage = [
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
        prodIndex = -1,
        sortingName = false,
        sortingPrice = false,
		dbBtnAboveModal = document.forms.filterAndAddForm.filterAboveModal,
		dbBtnInModal = document.forms.changeForm.changeInModal,
		toggleName = document.forms.toggleNameForm.toggleName,
		togglePrice = document.forms.togglePriceForm.togglePrice,
        tbodyDb = document.getElementById("tbodyElem");

    window.addEventListener("load", displayDb);
    dbBtnAboveModal.addEventListener("click", searchDb);
    toggleName.addEventListener("click", sortingToggleName);
    togglePrice.addEventListener("click", sortingTogglePrice);
	dbBtnInModal.addEventListener("click", changePlace);
	document.addEventListener("click", tbodyClick);

    function drawDb(prodRow) { // Отрисовывает сведения о товарах.
        tbodyDb.innerHTML = "";
        prodRow.forEach(displayBlock);
    }

	function displayDb() { // Отображение перечня товаров.
		prodShow = prodStorage;
		drawDb(prodShow);
	}
	
	function searchDb() { // Фильтрация по имени товара.
	    var dbFilter = document.getElementById("filterName"),
	        dbFilterUpperCase = dbFilter.value.toUpperCase();
        prodShow = prodStorage.filter(function (prod) {
            return prod.name.slice(0, dbFilter.value.length).toUpperCase() === dbFilterUpperCase;
        });
        drawDb(prodShow);
    }

    function sortingToggleName() { // Меняет направление сортировки по имени.
        var glyphiconToggleName = toggleName.firstElementChild;
        if (!prodShow) prodShow = prodStorage;
		prodShow.sort(function (prodA, prodB) {
            if (prodA.name.toUpperCase() < prodB.name.toUpperCase()) return -1;
            return 1;
        }); 
        sortingName = !sortingName;
        if (sortingName) {
			prodShow.reverse();
			glyphiconToggleName.className = "glyphicon glyphicon-triangle-bottom";
		} else {
			glyphiconToggleName.className = "glyphicon glyphicon-triangle-top";
		}
        drawDb(prodShow);
    }

    function sortingTogglePrice() { // Меняет направление сортировки по цене.
        var glyphiconTogglePrice = togglePrice.firstElementChild;
        if (!prodShow) prodShow = prodStorage;
        prodShow.sort(function (prodA, prodB) {
            if (prodA.price < prodB.price) return -1;
            return 1;
        });
        sortingPrice = !sortingPrice;
        if (sortingPrice) {
			prodShow.reverse();
			glyphiconTogglePrice.className = "glyphicon glyphicon-triangle-bottom";
		} else {
			glyphiconTogglePrice.className = "glyphicon glyphicon-triangle-top";
		}
        drawDb(prodShow);
    }

    function displayBlock(prod) { // Отрисовывает элемент tr - строку перечня.
        var innerBlock = document.getElementById("rowBlock").innerHTML,
            trElemBlock = document.createElement("tr"),
            rowName = "rowName" + prod.id,
            rowPrice = "rowPrice" + prod.id,
            rowAction = "rowAction" + prod.id;
        trElemBlock.innerHTML = innerBlock;

        trElemBlock.getElementsByClassName("rowName")[0].name = rowName;
        trElemBlock.getElementsByClassName("rowPrice")[0].name = rowPrice;
        trElemBlock.getElementsByClassName("rowAction")[0].name = rowAction;
		
        tbodyDb.appendChild(trElemBlock);

        document.forms[rowName].querySelector("a").innerHTML = prod.name;
        document.forms[rowName].querySelector("span").innerHTML = prod.count;
        document.forms[rowPrice].querySelector("div").innerHTML = formatterUsdCur.format(prod.price);

        for (var i = 0; i < document.forms[rowAction].elements.length; i++) {
            switch (document.forms[rowAction].elements[i].name) {
                case "#editAboveModal":
                    document.forms[rowAction].elements[i].id = "editAboveModal" + prod.id;
                    break;
                case "#dropAboveModal":
                    document.forms[rowAction].elements[i].id = "dropAboveModal" + prod.id;
                    break;
                default:
                    break;
            }
        }
    }

    function getIndex(prodArr, prodId) { // Возвращает индекс товара в массиве по id товара.
        for (var i = 0; i < prodArr.length; i++) {
            if (prodArr[i].id === prodId) {
                return i;
            }
        }
        return -1;
    }

	function addRetrieve() { // Подготавливает добавление товара.
		dbBtnInModal.classList.remove("btn-warning");
		dbBtnInModal.classList.add("btn-primary");
		dbBtnInModal.innerHTML = "Add";
		dbBtnInModal.dataset.isUpdate = "0";
	}
	
    function editRetrieve(prodId) { // Извлекает из хранилища сведения о товаре.
        prodIndex = getIndex(prodStorage, +prodId);
        if (prodIndex !== -1) {
            appConfig.name = prodStorage[prodIndex].name;
            appConfig.count = prodStorage[prodIndex].count;
            appConfig.price = prodStorage[prodIndex].price;
        }
		dbBtnInModal.classList.remove("btn-primary");
		dbBtnInModal.classList.add("btn-warning");
		dbBtnInModal.innerHTML = "Update";
		dbBtnInModal.dataset.isUpdate = "1";
    }
	
	function clearSpareElem() {
        var spareElem = document.querySelector("div.modal-backdrop.fade.in");
        if (spareElem) { spareElem.parentNode.removeChild(spareElem); }
	}

	function changePlace() { // Размещает отредактированные сведения о товаре в хранилище.
	    setTimeout(function() {
	        var prodObj = {},
                priceRound;
	        if (+appConfig.propriety) {
	            prodObj.id = currentId;
	            prodObj.name = appConfig.name;
	            prodObj.count = +appConfig.count;
	            priceRound = +appConfig.price;
	            prodObj.price = Math.round(priceRound * 100) / 100;
	            prodStorage.push(prodObj);
	            currentId++;
	            if (+dbBtnInModal.dataset.isUpdate) {
	                prodStorage.splice(prodIndex, 1);
	            }
	            searchDb();
	            clearSpareElem();
	        }
	    }, 0);
    }

    function dropRetrieve(prodId) { // Извлекает удаляемый товар.
        prodIndex = getIndex(prodStorage, +prodId);
        dbBtnInModal = document.forms.dropForm.dropInModal;
		dbBtnInModal.addEventListener("click", dropPlace);
    }

    function dropPlace() { // Удаляет из хранилища объект товара, используя его индекс.
        prodStorage.splice(prodIndex, 1);
        searchDb();
		clearSpareElem();
    }

    function tbodyClick(e) { // Кнопки редактирования или удаления.
        var target = e.target;

        switch (target.id.substring(0, 13)) {
            case "addAboveModal":
                addRetrieve();
                break;
            case "editAboveModa":
                editRetrieve(target.id.substring(14));
                break;
            case "dropAboveModa":
                dropRetrieve(target.id.substring(14));
                break;
            default:
                break;
        }
    }
})();
