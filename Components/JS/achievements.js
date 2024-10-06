/**
 * Funkcjonalność zmiany awatara użytkownika. 
 * Pobiera listę dostępnych awatarów z serwera i wyświetla w oknie modalnym aby użytkownik mógł zmienić swój obraz profilu. 
 */
addEventElement("#change-avatar", "click", function () {
    fetchJSONFile("/achievements").then((data) => {
      if (data) {
        data.unshift({
          id: 0,
          img_name: "defaultAvatar.jpg",
          title: "Domyślny",
          alt: "Domyślny awatar",
        });
        createAchievementsAvatarBox(data);
      }
    });
  });

/**
 * Tworzy okno modalne z listą dostępnych awatarów do wyboru, oraz możliwością zapisania wybranego awatara dla profilu użytkownika.
 * @param {dataObject} data 
 */
function createAchievementsAvatarBox(data){
    createModal("Zmiana awatara", 2, "medium");
    const modalContent = document.querySelector(".modal-content");

    const avatarsContainer = createElement("div", ["achievements-avatar"]);

    data.forEach((avatar) => {
        const avatarElement = createIMG("../../Resources/Web/achievements/"+ avatar.img_name, [], avatar.title, avatar.title, 100, 100);
        avatarElement.setAttribute("data-id", avatar.id);

        avatarsContainer.appendChild(avatarElement);

        // Zaznaczanie wybranego awatara i odznaczanie pozostałych
        avatarElement.addEventListener("click", function(){
            const allAvatars = avatarsContainer.querySelectorAll("img");
            allAvatars.forEach((element) => {
                element.classList.remove("selected");
            });
            avatarElement.classList.add("selected");
            modalContent.querySelector("button").disabled = false;
            modalContent.querySelector("button").title = "Ustaw wybrany awatar jako swój.";


        });
    });
   

    modalContent.appendChild(avatarsContainer);

    // Przycisk zapisu wybranego awatara do profilu użytkownika na stronie i w bazie danych
    const button = createButton("Zapisz", ["btn", "secondary"], () =>{

        const selectedAvatar = avatarsContainer.querySelector("img.selected");
        if(selectedAvatar){
            const avatarID = selectedAvatar.getAttribute("data-id");
            sendDataToServer({avatar: avatarID}, "/avatar-change").then((data) => {
                if(data){
                    createNotification("Koala-V   Sukces: ", "Zmieniono awatar.", "success");
                    document.querySelector("#avatar").src = selectedAvatar.src;
                }
            });
        } else {
            createNotification("Koala-V   Błąd: ", "Nie wybrano awatara.");
        }
    });
    button.disabled = true;
    button.title = "Wybierz awatara aby móc zapisać.";

    modalContent.appendChild(button);
   
}

