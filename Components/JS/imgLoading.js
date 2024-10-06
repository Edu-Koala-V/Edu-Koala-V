loadingImgStyle();
/**
 * Funkcja sprawdza czy obrazki w divach z klasą blur-load są załadowane, jeśli tak to dodaje im klasę loaded
 */
function loadingImgStyle() {
    const blurDivImages = document.querySelectorAll(".blur-load");
    if (blurDivImages.length > 0) {
        blurDivImages.forEach(div => {
            const img = div.querySelector("img");
            if (img.complete && img.naturalHeight !== 0) {
                loaded(div);
            } else {
                img.addEventListener("load", () => loaded(div));
            }
        });
    }
}
/**
 * Nadaje klasę loaded divowi z obrazkiem i dodaje event listener <showBigPicture> do obrazka w celu powiększenia obrazka po kliknięciu
 * @param {HTMLElement} div Referencja do diva z obrazkiem
 */
function loaded(div) {
    const img = div.querySelector("img");
    div.classList.add("loaded");
    if(!location.href.includes("testy-edycja")){
        if(window.innerWidth>800){
            if (img.getAttribute("data-big-img") && img.getAttribute("data-big-img") !== "" && window.innerWidth>800) {
                img.addEventListener("click", () => showBigPicture(img));
                img.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        showBigPicture(img);
                    }
                });
            } else {
                img.style.cursor = "default";
            }
        }
    }
}
/**
 * Tworzy okno modalne z powiększonym obrazem i lupą
 * @param {ElementIMG} img Referencja do obrazka
 */
function showBigPicture(img){
    document.querySelectorAll(".back-blur").forEach(blur => {
        blur.remove();
    });
    createModal("Powiekszenie obrazu: "+img.alt,3,"large");

    const bigIMG = createIMG(img.getAttribute("data-big-img"),[""],img.alt,img.alt);


    document.querySelector(".modal-content").appendChild(bigIMG);
    document.querySelector(".modal-content img").style.width="100%";
    document.querySelector(".modal-content img").style.height="auto";
    document.querySelector(".modal-content img").style.cursor="default";
    

    const loupe = createElement("div", ["loupe"]);
    loupe.title="To jest lupa. Poruszaj kursorem myszki po obrazku aby zobaczyć jego dwukrotne powiekszenie. :)"
    
    document.querySelector(".modal-left-container").appendChild(loupe);

    bigIMG.addEventListener('mousemove', function(e) {
        loupeFu(bigIMG,loupe,e);
    });

}
/**
 * Na podstawie położenia myszki nad obrazkiem, przesuwa tło lupy powiekszonego obrazka z uwzględnieniem przesunięcia myszki względem oryginalnego obrazka
 * @param {ElementIMG} bigIMG Referencja do obrazka
 * @param {div} loupe Referencja do diva bedacego lupą i wyświetlającym powiększenie obrazka
 * @param {event} e Event poruszania myszki 
 */
function loupeFu(bigIMG,loupe,e){
    const loupeLeft = 100;
    const loupeTop = 300;
    // Rozmiar lupy
    loupe.style.backgroundImage = `url(${bigIMG.src})`;
    loupe.style.backgroundSize = `${bigIMG.width * 2}px ${bigIMG.height * 2}px`;

    let bgX = (e.pageX - bigIMG.getBoundingClientRect().left - window.scrollX - loupeLeft / 2) * 2;
    let bgY = (e.pageY - bigIMG.getBoundingClientRect().top - window.scrollY - loupeTop / 2) * 2;

    // Odwróć wartości bgX i bgY
    bgX = -bgX;
    bgY = -bgY;

    // Sprawdź, czy bgX i bgY przekraczają rozmiar obrazka, a jeśli tak, ustaw je na maksymalny dopuszczalny rozmiar
    bgX = bgX < -(bigIMG.width * 2 - loupeLeft) ? -(bigIMG.width * 2 - loupeLeft) : bgX;
    bgY = bgY < -(bigIMG.height * 2 - loupeTop) ? -(bigIMG.height * 2 - loupeTop) : bgY;

    loupe.style.backgroundPosition = `${bgX}px ${bgY}px`;
}