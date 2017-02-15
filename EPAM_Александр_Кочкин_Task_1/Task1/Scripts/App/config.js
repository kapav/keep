; var appConfig = (function() {
    var prod = {
            name: "",
            count: "",
            price: "",
            propriety: "0",
            controlCharMaxNum: 32,
            firefoxFuncBtnNum: 0,
            isAcceptableNameChar: /[a-zA-Zа-яА-ЯёЁ0-9 _,;:\\\/\-\.\+\*\(\)!@#\$%&={}\[\]\"\'\?<>№]/,
            isAcceptableNameString: /^[a-zA-Zа-яА-ЯёЁ0-9 _,;:\\\/\-\.\+\*\(\)!@#\$%&={}\[\]\"\'\?<>№]{0,15}$/,
            showError: function (container, errorMessage) {
                var elem = container;
                $(elem).next().html(errorMessage);
                $(elem).next().removeClass("text-hide");
                $(elem).addClass("data-paint-red");
            },
            resetError: function (container) {
                var elem = container;
                $(elem).next().addClass("text-hide");
                $(elem).removeClass("data-paint-red");
            }
        };

    return prod;
}());
