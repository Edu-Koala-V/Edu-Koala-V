const loginForm = document.querySelector("#loginForm");
if(loginForm){
    var username = loginForm.querySelector("#login");
    var password = loginForm.querySelector("#password");
    username.addEventListener('input', function (e) {
        username.setCustomValidity("");
    });
    
    password.addEventListener('input', function (e) {
        password.setCustomValidity("");
    });
    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        // Walidacja formularza
        if(!validate_LoginForm(username, 5)) return;
        if(!validate_LoginForm(password)) return;
    
        
            sendDataToServer({login:username.value,password:password.value}, "/login")
            .then((response) => {
                if(response.status === "success"){
                    createNotification("Udane logowanie","Zalogowano pomyślnie","success");
                    location.reload();
                }else{
                    createNotification("Pierwsze logowanie",response.message,response.status);
                    loginFromActions(response.action);
                }
            })
            .catch((error) => {
                createNotification("Błąd logowania",error);
            });
        
    });
}

function validate_LoginForm(input, valueLength = 12){
    let inputValue = input.value;
    let errorMessage = "";

    if(inputValue.length < valueLength){
        errorMessage += `Wprowadzono za krótką wartość. \n  --- Wymagane minimum ${valueLength} znaków.\n`;
    }
    if(!(/(?=.*[a-z])/.test(inputValue))){
        errorMessage += "Brak małej litery. \n  --- Wymagana co najmniej jedna mała litera.\n";
    }
    if(!(/(?=.*[A-Z])/.test(inputValue))){
        errorMessage += "Brak dużej litery. \n  --- Wymagana co najmniej jedna duża litera.\n";
    }
    if(!(/(?=.*\d)/.test(inputValue))){
        errorMessage += "Brak cyfry. \n  --- Wymagana co najmniej jedna cyfra.\n";
    }

    input.setCustomValidity(errorMessage);
    input.reportValidity();
    return errorMessage === "";
}

function loginFromActions(action){
    switch(action){
        case "bad-login":
            username.classList.add("is-invalid");
            username.setCustomValidity("Niepoprawny login");
            username.reportValidity();
            break;
        case "bad-password":
            password.classList.add("is-invalid");
            password.setCustomValidity("Niepoprawne hasło");
            password.reportValidity();
            break;
        case "change-password":
            loginForm.style.display = "none";
            changePassForm.style.display = "block";
            changePasswordForm();
            break;
    }
}
const changePassForm = document.querySelector("#changePassForm");
changePassForm.style.display = "none";

function changePasswordForm(){
    
    if(changePassForm){
        var login = changePassForm.querySelector("#login2");
        login.setAttribute("placeholder", username.value);
        var newPassword = changePassForm.querySelector("#newPassword");
        var newPasswordRepeat = changePassForm.querySelector("#newPasswordRepeat");
        newPassword.addEventListener('input', function (e) {
            newPassword.setCustomValidity("");
        });
        newPasswordRepeat.addEventListener('input', function (e) {
            newPasswordRepeat.setCustomValidity("");
        });
        changePassForm.addEventListener("submit", function(e) {
            e.preventDefault();
            // Walidacja formularza
            if(!validate_LoginForm(newPassword, 12)) return;
            if(!validate_LoginForm(newPasswordRepeat, 12)) return;
            if(newPassword.value !== newPasswordRepeat.value){
                newPasswordRepeat.setCustomValidity("Hasła nie są takie same");
                newPasswordRepeat.reportValidity();
                return;
            }
            sendDataToServer({login:username.value, newPassword:newPassword.value, oldPassword:password.value}, "/change-password")
            .then((response) => {
                if(response.status === "success"){
                    createNotification("Zmiana hasła","Hasło zostało zmienione pomyślnie","success");
                    location.reload();
                }else{
                    createNotification("Błąd zmiany hasła",response.message,response.status);
                }
            })
            .catch((error) => {
                createNotification("Błąd zmiany hasła",error);
            });
        });
    }
}