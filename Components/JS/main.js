document.addEventListener('keydown', function(e) {
    // Sprawdź, czy wciśnięty jest klawisz Ctrl
    if (e.ctrlKey) {
        // Sprawdź, czy wciśnięty jest klawisz Q
        if (e.key === 'q' || e.key === 'Q') {
            // Przejdź do menu
            const menu = document.querySelector('#menu');
            if (menu) {
                // Ustaw fokus na menu
                menu.focus();
                // Zapobiegaj domyślnej akcji Ctrl + Q, aby nie otworzyć okna zakładek w niektórych przeglądarkach
                e.preventDefault();
            }
        }
        if (e.key == 'ArrowUp'){
            window.scrollTo({
                top: 0,
                behavior: 'smooth', // Dodaj płynne przewijanie
            });
        }
        if (e.key == 'ArrowDown'){
            window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth', // Dodaj płynne przewijanie
            });
        }
    }
});


const nav = document.querySelector("nav");
if(nav){
    addEventElement("#menu", "keydown", function(e) {
    if (e.key === "Enter") {
        e.preventDefault();
        nav.classList.toggle("short-menu");
    }
});
addEventElement("#menu", "click", function() {
    nav.classList.toggle("short-menu");
});
}



const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button =>{
        if (typeof (navigator.clipboard) == 'undefined'){
            button.style.display = 'none';
            return;
        }
        button.setAttribute("title", button.getAttribute("title")+" "+ button.parentElement.textContent.trim())
        button.addEventListener("click", ()=>{
            navigator.clipboard.writeText(button.parentElement.textContent.trim());
            createNotification("Skopiowano",button.parentElement.textContent.trim(),"info");
        })
    })


if(document.documentElement.scrollHeight > window.innerHeight){
    const backToTop = createElement("div", ["back-to-top"]);
    backToTop.tabIndex = 0;
    backToTop.innerHTML = '<i class="arrow-up-icon"></i>';
    document.body.appendChild(backToTop);
    backToTop.addEventListener('click', function(){
        window.scrollTo({
            top: 0,
            behavior: 'smooth', // Dodaj płynne przewijanie
        });
    });
    backToTop.addEventListener('keydown', function(e){
        if(e.key === "Enter"){
            window.scrollTo({
                top: 0,
                behavior: 'smooth', // Dodaj płynne przewijanie
            });
        }
    });
    window.addEventListener('scroll', function(){
        if(window.scrollY > 100){
            backToTop.style.display = 'block';
        } else {
            backToTop.style.display = 'none';
        }
    });
}