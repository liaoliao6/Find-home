$(window).resize(function() {
    var window_width = $(window).width();
    if (window_width <= 991) {
        putAuthenticationInCollapse();
    } else {
        if ($("nav#site-nav #collapse-nav").length == 1) {
            $("#collapse-nav").remove();
            $("nav#site-nav .container").append(regSignupUL);
        }
    }
});
$(document).ready(function() {
    regSignupUL = $(".reg-or-sign").prop("outerHTML");
    var window_width = $(window).width();
    if (window_width <= 991) {
        putAuthenticationInCollapse();
    } else {}
});

function putAuthenticationInCollapse() {
    if ($("nav#site-nav #collapse-nav").length == 0) {
        $(".reg-or-sign").remove();
        $("nav#site-nav .container").append("<div id='collapse-nav' style='position:relative;'>\
                                         <i class='fa fa-bars' aria-hidden='true'></i>\
                                         <div id='collapse-content' style='display:none;'>" + regSignupUL + "</div>\
                                    </div>");
        $("#collapse-nav").click(function() {
            if ($("#collapse-content").css("display") == "none") {
                $("#collapse-content").css("display", "block");
                $(document).click(function(e) {
                    if ($(e.target).closest($("#collapse-nav")).length <= 0) {
                        $("#collapse-content").css("display", "none");
                    }
                });
            } else {
                $("#collapse-content").css("display", "none");
            }
        });

    }
}