; (function () {
    var glyphiconTopClass = "glyphicon glyphicon-triangle-top",
        glyphiconBottomClass = "glyphicon glyphicon-triangle-bottom",
        tbodyElem = "#tbodyElement",
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
        tbodyDb = $(tbodyElem)[0];

    $(window).on("load", searchDb);
    $(dbBtnFilter).on("click", searchDb);
    $(toggleName).on("click", sortingToggleName);
    $(togglePrice).on("click", sortingTogglePrice);
    $(dbBtnAdd).on("click", addRetrieve);
	dbBtnInModal.addEventListener("click", changePlace);
	tbodyDb.addEventListener("click", tbodyClick);

	function drawDb(prodArray) { // Отрисовывает сведения о товарах.
	    var tableRows = document.createDocumentFragment();
        tbodyDb.innerHTML = "";
        prodArray.forEach(appendTableRow, tableRows);
	    tbodyDb.appendChild(tableRows);
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
			glyphiconToggleName.className = glyphiconBottomClass;
		} else {
            glyphiconToggleName.className = glyphiconTopClass;
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
			glyphiconTogglePrice.className = glyphiconBottomClass;
		} else {
            glyphiconTogglePrice.className = glyphiconTopClass;
		}
        drawDb(prodShow);
    }

    function appendTableRow(prod) { // Отрисовывает элемент tr - строку перечня.
        var innerBlock = document.getElementById("rowBlock").innerHTML,
            trElem = document.createElement("tr");
        trElem.id = "row" + prod.id;
        trElem.innerHTML = innerBlock;

        trElem.querySelector("a.prodName").innerHTML = prod.name;
        trElem.querySelector("span.prodCount").innerHTML = prod.count;
        trElem.querySelector("div.prodPrice").innerHTML = formatterUsdCur.format(prod.price);
        trElem.querySelector("button.editForModal").id = "editProduct" + prod.id;
        trElem.querySelector("button.dropForModal").id = "dropProduct" + prod.id;

        this.appendChild(trElem);
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
        prodIndexInArray = getIndex(prodStorage, +prodId);
        if (prodIndexInArray !== -1) {
            appConfig.name = prodStorage[prodIndexInArray].name;
            appConfig.count = prodStorage[prodIndexInArray].count;
            appConfig.price = prodStorage[prodIndexInArray].price;
        }
		dbBtnInModal.classList.remove("btn-primary");
		dbBtnInModal.classList.add("btn-warning");
		dbBtnInModal.innerHTML = "Update";
		dbBtnInModal.dataset.isUpdate = "1";
	    dbBtnInModal.dataset.prodIdInObj = prodId;
	}
	
	function changePlace() { // Размещает отредактированные сведения о товаре в хранилище.
	    setTimeout(function() {
	        var prodObj = {},
                priceRound,
	            changeTrElem;
	        if (+appConfig.propriety) {
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
	                changeTrElem = document.getElementById("row" + dbBtnInModal.dataset.prodIdInObj);
	                changeTrElem.parentElement.removeChild(changeTrElem);
	            }
	            prodShow = prodStorage;
	        }
	    }, 0);
    }

    function dropRetrieve(prodId) { // Извлекает удаляемый товар.
        prodIndexInArray = getIndex(prodStorage, +prodId);
        dbBtnInModal = document.forms.dropForm.dropInModal;
        dbBtnInModal.dataset.prodIdInObj = prodId;
        dbBtnInModal.addEventListener("click", dropPlace);
    }

    function dropPlace() { // Удаляет из хранилища объект товара, используя его индекс.
        var dropTrElem = document.getElementById("row" + dbBtnInModal.dataset.prodIdInObj);;
        prodStorage.splice(prodIndexInArray, 1);
        dropTrElem.parentElement.removeChild(dropTrElem);
        prodShow = prodStorage;
    }

    function tbodyClick(e) { // Кнопки редактирования или удаления.
        var target = e.target;

        switch (target.id.substring(0, 11)) {
            case "editProduct":
                editRetrieve(target.id.substring(11));
                break;
            case "dropProduct":
                dropRetrieve(target.id.substring(11));
                break;
            default:
                break;
        }
    }
})();
