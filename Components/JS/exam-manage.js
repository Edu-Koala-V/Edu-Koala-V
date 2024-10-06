document.querySelectorAll(".points-for-question").forEach((element) => {
    const oldText = "Punkty do zdobycia:";
    const text = element.textContent;
    const stingPoints = text.split(oldText);
    element.innerHTML = oldText + "<input type='number' value='" + stingPoints[1] + "' class='points-for-question-input'>";
});
document.querySelectorAll(".quiz").forEach((element) => {
    const question = element.querySelectorAll(".quiz-question")[1];
    console.log(question);
    question.addEventListener("dblclick", () => {
        question.setAttribute("contenteditable", "true");
    });
    const buttonsEditorDiv = element.querySelector(".buttons-editor");

    const divWrapper = createDiv(["quiz-question-buttons"]);
    const buttonIMG = createButton("Zdjęcie", ["btn", "btn-img"], () => createImageElements(element));


    const buttonVideo = createButton("Film", ["btn", "btn-video"]);

    if(element.getAttribute("data-type") === "radio"){
    const buttonAddRadioAnswer =  createButton("Dodaj odpowiedź radio", ["btn", "primary"]);
    divWrapper.appendChild(buttonAddRadioAnswer);
    }
    if(element.getAttribute("data-type") === "checkbox"){
        const buttonAddCheckboxAnswer = createButton("Dodaj odpowiedź checkbox", ["btn", "primary"]);
        divWrapper.appendChild(buttonAddCheckboxAnswer);
    }
    if(element.getAttribute("data-type") === "sorting"){
        const buttonAddSortingElement = createButton("Dodaj element do sortowania", ["btn", "primary"]);
        divWrapper.appendChild(buttonAddSortingElement);
    }
    divWrapper.appendChild(buttonIMG);
    divWrapper.appendChild(buttonVideo);
    buttonsEditorDiv.appendChild(divWrapper);

function createImageElements(element){
        const imgWrapper = element.querySelector(".img-quiz-wrapper");
        const img = createIMG("https://via.placeholder.com/150", ["quiz-question-img"]);
        img.src = "https://via.placeholder.com/150";
        img.classList.add("quiz-question-img");
        imgWrapper.innerHTML = "";
        imgWrapper.appendChild(img);
        img.addEventListener("click", () => {
            choiceIMGWindow(img);
        });
        img.style.cursor = "pointer";
    }
    buttonVideo.addEventListener("click", () => {
        const videoWrapper = createDiv(["quiz-question-video-wrapper"]);
        const video = document.createElement("video");
        video.src = "https://www.w3schools.com/html/mov_bbb.mp4";
        video.controls = true;
        video.classList.add("quiz-question-video");
        videoWrapper.innerHTML = "";
        videoWrapper.appendChild(video);
    });

    element.querySelectorAll("div.quiz-answer").forEach((answer) => {
        const text = answer.querySelector("label.quiz-answer");
        text.addEventListener("click", (event) => {
            event.preventDefault();
            text.setAttribute("contenteditable", "true");
            text.focus();
            text.style='background-color: #fff;';
        });
        const buttonDelete = createButton("X", ["btn", "danger"], () => {answer.remove();});
        answer.appendChild(buttonDelete);
    });

});


if(document.querySelector("#quiz-container")){
document.querySelector("#quiz-container").querySelectorAll("img").forEach((element) => {
    element.addEventListener("click", function() {
        choiceIMGWindow(element);
        
    });
});
}
function choiceIMGWindow(element){
    createModal("Co chcesz zrobić z tym obrazkiem? ",2,"small");
    const modalDivContent = document.querySelector(".modal-content");

    const buttonShowBigPicture = document.createElement("button");
    buttonShowBigPicture.classList.add("btn", "primary");
    buttonShowBigPicture.innerHTML = "Pokaż powiększenie";
    buttonShowBigPicture.addEventListener("click", () => {
        document.querySelector(".back-blur").remove();
        showBigPicture(element);
    });
    if(!element.getAttribute("data-big-img")){
        buttonShowBigPicture.setAttribute("disabled", "disabled");
        buttonShowBigPicture.title = "Powiekszenie niedostepne. Brak linku oryginalnego obrazu w atrybucie data-big-img.";
    }
    const buttonChangeIMG = document.createElement("button");
    buttonChangeIMG.classList.add("btn", "primary");
    buttonChangeIMG.innerHTML = "Zmień obraz";
    buttonChangeIMG.addEventListener("click", () => {
        document.querySelector(".back-blur").remove();
        modal_window_All_IMG(element);
    });
    const buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("button-wrapper");
    buttonWrapper.appendChild(buttonShowBigPicture);
    buttonWrapper.appendChild(buttonChangeIMG);
    modalDivContent.appendChild(buttonWrapper);
}

function includesOriginal(text) {
    return text.toUpperCase().includes("ORIGINAL");
}
function modal_window_All_IMG(this_img) {
    const pathDirs = [
        " https://raw.githubusercontent.com/KiraTheGames/test/main/IMAGES/"
    ]
    
    const data = JSON.parse(document.querySelector("#quiz-container").getAttribute("data-github-img"));
    createModal("Zmiana obrazu",1, "large");

    data.forEach((element) => {
        if(!includesOriginal(element)){
            
            const img = document.createElement("img");
            img.classList.add("img-github-box");
            img.src = pathDirs[0] + element;
            img.setAttribute("data-big-img", pathDirs[0] + element.split(".")[0] + "_ORIGINAL.webp");
            img.addEventListener("click", (event) => {
                document.querySelectorAll(".img-github-box").forEach((img) => {
                    img.classList.remove("selected-img");
                });
                changeIMG(this_img,event.target);
                event.target.classList.add("selected-img");
            });
           try{
                const srcPath = new URL(this_img.src).pathname;
                const comparePath = new URL(pathDirs[0] + element, 'https://raw.githubusercontent.com').pathname; // Dodajemy bazowy URL dla normalizacji

                console.log(srcPath, comparePath, srcPath === comparePath);

                if (srcPath === comparePath) {
                    img.classList.add("selected-img");
                }
              }finally{}
            document.querySelector(".modal-content").appendChild(img);

        }
        
    });
    document.querySelector(".modal-right-container").appendChild(uploaderIMGContainer());
}
function changeIMG(img,newIMG){
    img.src = newIMG.src;
    img.width = newIMG.width*2;
    img.height = newIMG.height*2;
    img.setAttribute("data-big-img", newIMG.getAttribute("data-big-img"));
}

function uploaderIMGContainer(){
    const div = createDiv(["img-uploader-container"]);
    const h2 = document.createElement("h2");
    h2.innerHTML = "Dodaj nowy obraz";
    div.appendChild(h2);

    const imgOptimal = createIMG("https://via.placeholder.com/150", ["img-optimal"], (event) => {
        changeIMG_input_upload(event.target);
    });
    imgOptimal.src = "https://via.placeholder.com/150";

    const imgOriginal = createIMG("https://via.placeholder.com/150", ["img-original"], (event) => {
        changeIMG_input_upload(event.target);
    });


    const divIMG_optimal = createDiv(["img-optimal"]);
    divIMG_optimal.appendChild(imgOptimal);
    const h3_optimal = document.createElement("h3");
    h3_optimal.innerHTML = "Obraz zoptymalizowany";
    divIMG_optimal.appendChild(h3_optimal);

    const divIMG_original = createDiv(["img-original"]);
    divIMG_original.appendChild(imgOriginal);
    const h3_original = document.createElement("h3");
    h3_original.innerHTML = "Obraz oryginalny";
    divIMG_original.appendChild(h3_original);

    div.appendChild(divIMG_optimal);
    div.appendChild(divIMG_original);

    const inputText = document.createElement("input");
    inputText.type = "text";
    inputText.placeholder = "Podaj krótki opis obrazu";
    div.appendChild(inputText);

    const button = createButton("Zapisz", ["btn", "primary"], () => {
        console.log("Zapisano");//TODO: Zapisz obraz
        });
    div.appendChild(button);
    return div;
}

function changeIMG_input_upload(img){
    console.log(img);
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/webp";
    input.addEventListener("change", (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
    document.body.appendChild(input);
    input.click();
}
