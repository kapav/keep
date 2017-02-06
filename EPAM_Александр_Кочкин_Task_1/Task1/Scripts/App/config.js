; var appConfig = (function() {
    var prod = {
            name: "",
            count: "",
            price: "",
            propriety: "0",
            showError: function(container, errorMessage) {
                $(container.nextElementSibling).html(errorMessage);
                $(container.nextElementSibling).removeClass("text-hide");
                $(container).addClass("data-paint-red");
            },
            resetError: function(container) {
                $(container.nextElementSibling).addClass("text-hide");
                $(container).removeClass("data-paint-red");
            }
        };

    return prod;
}());
