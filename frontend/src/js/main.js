function signUpSubmit(e) {
    e.preventDefault();
    var data = $("#registration-form").parseForm();
    $.ajax({
        type: "POST",
        url: "/api/user/signup",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function(response) {
            console.log(response);
            var isSucceed = response["succeed"];
            if (isSucceed) {
                $("#form-err-msg").html("");
                $("#form-err-msg").hide();
                $("#signup-cancel-btn").click();
                msgAnimate("Succefully registered account, please Sign In");
            } else {
                console.log("not succeed");
                $("#form-err-msg").html(response["errorMsg"]);
                $("#form-err-msg").show();
            }
        },
        error: function(err) {

        }
    });
    return false;
}