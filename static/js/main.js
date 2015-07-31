(function() {
    var isLoginFormPresent = false;
    var isRegistrationFormPresent = false;

    $('#loginForm').onHide = function () {
        isLoginFormPresent = false;
    };

    $('#registrationForm').onHide = function () {
        isRegistrationFormPresent = false;
    };

    window.showForm = function(name, hide) {
        switch (name) {
            case 'login':
                if (!isLoginFormPresent) {
                    $('#loginForm').show();
                    isLoginFormPresent = true;

                    if (isRegistrationFormPresent) {
                        $('#registrationForm').hide();
                        isRegistrationFormPresent = false;
                    }
                } else if (isLoginFormPresent && hide) {
                    $('#loginForm').hide();
                    isLoginFormPresent = false;
                }
                break;
            case 'registration':
                if (!isRegistrationFormPresent) {
                    $('#registrationForm').show();
                    isRegistrationFormPresent = true;

                    if (isLoginFormPresent) {
                        $('#loginForm').hide();
                        isLoginFormPresent = false;
                    }
                } else if (isRegistrationFormPresent && hide) {
                    $('#registrationForm').hide();
                    isRegistrationFormPresent = false;
                }
                break;
            default:
                break;
        }
    };

    $('')
}());