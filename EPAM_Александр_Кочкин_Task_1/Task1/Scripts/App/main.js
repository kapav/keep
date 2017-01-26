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
		dbBtnInModal = document.getElementById("addInModal"),
		dbBtnAboveModal = document.getElementById("searchAboveModal"),
		dbToggleName = document.getElementById("toggleName"),
		dbTogglePrice = document.getElementById("togglePrice"),
        dbName = document.getElementById("storeName"),
        dbCount = document.getElementById("storeCount"),
        dbPrice = document.getElementById("storePrice"),
        dbPropriety = document.getElementById("storePropriety"),
        tbodyDb = document.getElementById("tbodyElem");

    //for (var i = 0; i < do)

    window.addEventListener("load", displayDb);
    dbBtnInModal.addEventListener("click", addPlace);
    dbBtnAboveModal.addEventListener("click", searchDb);
    dbToggleName.addEventListener("click", sortingToggleName);
    dbTogglePrice.addEventListener("click", sortingTogglePrice);
	tbodyDb.addEventListener("click", tbodyClick);

    function drawDb(prodRow) { // Отрисовывает сведения о товарах.
        tbodyDb.innerHTML = "";
        prodRow.forEach(displayBlock);
    }

	function displayDb() { // Отображение перечня товаров.
		prodShow = prodStorage;
		drawDb(prodShow);
	}
	
	function searchDb() { // Фильтрация по имени товара.
	    var dbFilter = document.getElementById("storeFilter"),
	        dbFilterUpperCase = dbFilter.value.toUpperCase();
        prodShow = prodStorage.filter(function (prod) {
            return prod.name.slice(0, dbFilter.value.length).toUpperCase() === dbFilterUpperCase;
        });
        drawDb(prodShow);
    }

    function sortingToggleName() { // Меняет направление сортировки по имени.
        var glyphiconToggleName = dbToggleName.firstElementChild;
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
        var glyphiconTogglePrice = dbTogglePrice.firstElementChild;
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
            trElemBlock = document.createElement("tr");
        trElemBlock.innerHTML = innerBlock;
		
        trElemBlock.getElementsByClassName("prodName")[0].innerHTML = prod.name;
        trElemBlock.getElementsByClassName("prodCount")[0].innerHTML = prod.count;
        trElemBlock.getElementsByClassName("prodPrice")[0].innerHTML = formatterUsdCur.format(prod.price);
        trElemBlock.getElementsByClassName("#prodEditStartModal")[0].setAttribute("data-target", "#editStartModal" + prod.id);
        trElemBlock.getElementsByClassName("#prodEditStartModal")[0].id = "editAboveModal" + prod.id;
        trElemBlock.getElementsByClassName("prodEditStartModal")[0].id = "editStartModal" + prod.id;
        trElemBlock.getElementsByClassName("prodEditNameFor")[0].setAttribute("for", "editName" + prod.id);
        trElemBlock.getElementsByClassName("prodEditNameId")[0].id = "editName" + prod.id;
        trElemBlock.getElementsByClassName("prodEditCountFor")[0].setAttribute("for", "editCount" + prod.id);
        trElemBlock.getElementsByClassName("prodEditCountId")[0].id = "editCount" + prod.id;
        trElemBlock.getElementsByClassName("prodEditPriceFor")[0].setAttribute("for", "editPrice" + prod.id);
        trElemBlock.getElementsByClassName("prodEditPriceId")[0].id = "editPrice" + prod.id;
        trElemBlock.getElementsByClassName("prodEditInModal")[0].id = "editInModal" + prod.id;
        trElemBlock.getElementsByClassName("#prodDropStartModal")[0].setAttribute("data-target", "#dropStartModal" + prod.id);
        trElemBlock.getElementsByClassName("#prodDropStartModal")[0].id = "dropAboveModal" + prod.id;
        trElemBlock.getElementsByClassName("prodDropStartModal")[0].id = "dropStartModal" + prod.id;
        trElemBlock.getElementsByClassName("prodDropInModal")[0].id = "dropInModal" + prod.id;

        tbodyDb.appendChild(trElemBlock);
    }

    function getIndex(prodArr, prodId) { // Возвращает индекс товара в массиве по id товара.
        for (var i = 0; i < prodArr.length; i++) {
            if (prodArr[i].id === prodId) {
                return i;
            }
        }
        return -1;
    }

    function addPlace() { // Размещает добавляемый объект в хранилище объектов.
        var prodObj = {},
			correctness = +dbPropriety.value,
            priceRound;

        if (correctness) {
            prodObj.id = currentId;
            prodObj.name = dbName.value;
            prodObj.count = +dbCount.value;
            priceRound = +dbPrice.value;
            prodObj.price = Math.round(priceRound * 100) / 100;
            prodStorage.push(prodObj);
            currentId++;
            searchDb();
        } 
    }

    function editRetrieve(prodId) { // Извлекает из хранилища сведения о товаре.
        prodIndex = getIndex(prodStorage, +prodId);
        if (prodIndex !== -1) {
            dbName.value = prodStorage[prodIndex].name;
            dbCount.value = prodStorage[prodIndex].count;
            dbPrice.value = prodStorage[prodIndex].price;
        }
        dbBtnInModal = document.getElementById("editInModal" + prodId);
		dbBtnInModal.addEventListener("click", editPlace);
    }

    function editPlace() { // Размещает отредактированные сведения о товаре в хранилище.
        setTimeout(function() {
            var prodObj = {},
                correctness = +dbPropriety.value,
                priceRound;
            if (!!correctness) {
                prodObj.id = currentId;
                prodObj.name = dbName.value;
                prodObj.count = +dbCount.value;
                priceRound = +dbPrice.value;
                prodObj.price = Math.round(priceRound * 100) / 100;
                prodStorage.push(prodObj);
                currentId++;
                prodStorage.splice(prodIndex, 1);
                searchDb();
            }
        }, 0);
        var spareElem = document.querySelector("div.modal-backdrop.fade.in");
        if (spareElem) { spareElem.parentNode.removeChild(spareElem); }
    }

    function dropRetrieve(prodId) { // Извлекает удаляемого товара.
        prodIndex = getIndex(prodStorage, +prodId);
        dbBtnInModal = document.getElementById("dropInModal" + prodId);
		dbBtnInModal.addEventListener("click", dropPlace);
    }

    function dropPlace() { // Удаляет из хранилища объект товара, используя его индекс.
        prodStorage.splice(prodIndex, 1);
        searchDb();
        var spareElem = document.querySelector("div.modal-backdrop.fade.in");
        if (spareElem) { spareElem.parentNode.removeChild(spareElem); }
    }

    function tbodyClick(e) { // Кнопки редактирования или удаления.
        var target = e.target;

        switch (target.id.substring(0, 8)) {
            case "editAbov":
                editRetrieve(target.id.substring(14));
                break;
            case "dropAbov":
                dropRetrieve(target.id.substring(14));
                break;
            default:
                break;
        }
    }
})();
