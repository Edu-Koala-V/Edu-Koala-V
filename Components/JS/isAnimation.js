isAnimation();
const inpRadiosAnimation = document.querySelectorAll('[name="isAnimation"]');
if(inpRadiosAnimation.length > 0){
    document.querySelectorAll('[name="isAnimation"]').forEach((radio) => {
        radio.checked = getCookie("isAnimation") === radio.value;
        radio.addEventListener("change", function(e) {
            if (e.target.checked) {
                setCookie("isAnimation", e.target.value, 1);
            }
            isAnimation();
        });
    });
}

function isAnimation() {
    if(getCookie("isAnimation") === "") {
        setCookie("isAnimation", "true", 100);
    }
    if (getCookie("isAnimation") === "false") {
        document.body.classList.add('no-animation');
    }else{
        document.body.classList.remove('no-animation');
    }
}
