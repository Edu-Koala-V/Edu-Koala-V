addEventElement("#formNewClass", "submit", function (e) {
  e.preventDefault();
  const className = document.querySelector(
    "#formNewClass input[name='className']"
  ).value;
  if (!className) {
    createNotification("Koala-V - Błąd:", "Nazwa klasy nie może być pusta");
    return;
  }
  sendDataToServer({ className: className }, "/add-new-class").then(function (
    response
  ) {
    if (response.added) {
      createNotification("Koala-V -  Klasa dodana:", className, "success");
      createClassElementBox(response.classData.id, response.classData.name);
    }
  });
});
/**
 * Tworzy nowy element HTML klasy i dodaje go do elementu HTML listy klas.
 * @param {int} classID - ID klasy
 * @param {string} className - Nazwa klasy
 */
function createClassElementBox(classID, className) {
  console.log(classID, className);
  const classElementBox = createElement("div", ["classBox"]);
  classElementBox.appendChild(createElement("span")).innerText = classID;
  classElementBox.appendChild(createElement("h2")).innerText = className;
  const linkClass = createElement("a", ["btn", "primary"]);
  linkClass.innerText = "Zobacz klasę";
  linkClass.href = "/classes/" + classID;
  classElementBox.appendChild(linkClass);
  classElementBox.appendChild(createElement("p")).innerText = "0 uczniów";
  document.querySelector(".classesList").appendChild(classElementBox);
}


const FNameInput = document.querySelector('input[name="FName"]');
const SNameInput = document.querySelector('input[name="SName"]');
const LNameInput = document.querySelector('input[name="LName"]');
const NRInput = document.querySelector('input[name="nr"]');
const usernameInput = document.querySelector('input[name="username"]');

// Pobranie danych z formularza dodawania ucznia do klasy
let classID,FName,SName,LName,NR,username;
if(document.querySelector("#formNewStudentInClass")){
    const url = new URL(document.location.href);
    classID = parseInt(url.pathname.split("/").pop());
    FName = FNameInput.value;
    SName = SNameInput.value;
    LName = LNameInput.value;
    NR = NRInput.value;
    username = usernameInput.value;
}


addEventElement('input[name="username"]', "input", function () {
    username = usernameInput.value;
  setupUsernameInput(FName, LName, SName, NR, classID);
});
addEventElement('input[name="FName"]', "input", function () {
    FName = FNameInput.value;
  setupUsernameInput(FName, LName, SName, NR, classID);
});
addEventElement('input[name="SName"]', "input", function () {
    SName = SNameInput.value;
  setupUsernameInput(FName, LName, SName, NR, classID);
});
addEventElement('input[name="LName"]', "input", function () {
    LName = LNameInput.value;
  setupUsernameInput(FName, LName, SName, NR, classID);
});
addEventElement('input[name="nr"]', "input", function () {
    NR = NRInput.value;
  setupUsernameInput(FName, LName, SName, NR, classID);
});

addEventElement("#formNewStudentInClass", "submit", function (e) {
  e.preventDefault();


  if (FName=="" ||FName==undefined || LName=="" || LName==undefined || NR=="" || NR==undefined) {
    createNotification(
      "Koala-V - Błąd:",
      "Imię, nazwisko i numer ucznia nie mogą być puste"
    );
    return;
  }
  sendDataToServer(
    {
      FName: FName,
      SName: SName,
      LName: LName,
      NR: NR,
      username: document.querySelector('input[name="username"]').value,
      classID: classID,
    },
    "/add-new-student-in-class"
  ).then(function (response) {
    if (response.status === "success") {
      createNotification(
        "Koala-V - Uczeń dodany:",
        response.message,
        "success"
      );
      setTimeout(function () {
        location.reload();
      }, 2000);
    } else {
      createNotification("Koala-V - Błąd:", response.message);
    }
  });
});
/**
 * Zamienia pierwszą literę ciągu znaków na wielką. Pozostałe litery pozostają bez zmian.
 * @param {string} inputValue Ciąg znaków, którego pierwsza litera ma zostać zamieniona na wielką.
 */
function firstLetterUpperCase(input) {
  input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
}
/**
 * Generuje nazwę użytkownika na podstawie imienia, nazwiska, numeru ucznia i ID klasy. Nazwa użytkownika jest ustawiana w polu input[name="username"].
 * @param {string} FName Imie ucznia
 * @param {string} LName Drugie imie ucznia
 * @param {string} SName Nazwisko ucznia
 * @param {number} NR Numer ucznia
 * @param {number} classID ID klasy
 */
function setupUsernameInput(FName, LName, SName, NR, classID) {
  firstLetterUpperCase(FNameInput);
  firstLetterUpperCase(SNameInput);
  firstLetterUpperCase(LNameInput);
  // Usunięcie spacji z imienia i nazwiska
  FName = FName.replace(/\s/g, "");
  LName = LName.replace(/\s/g, "");
  SName = SName.replace(/\s/g, "");

  // Pobranie pierwszych dwóch liter z FName i LName
  const firstTwoLettersFName = FName.slice(0, 3);
  const firstTwoLettersLName = LName.slice(0, 3);

  // Zapewnienie, że NR ma trzy cyfry, dodając wiodące zera, jeśli to konieczne
  const formattedNR = NR.padStart(3, "0");

  // Tworzenie nazwy użytkownika
  let username =
    firstTwoLettersFName + firstTwoLettersLName + formattedNR + "_0" + (classID-1);
    username=replacePolishChars(username);
  // Ustawienie wartości w polu input
  formNewStudentInClass.querySelector('input[name="username"]').value = username
  
}

function replacePolishChars(string){
  return string.replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e').replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o').replace(/ś/g, 's').replace(/ż/g, 'z').replace(/ź/g, 'z');
}
/**
 * Funkcja obsługująca zdarzenie kliknięcia w ikonę oka w tabeli. Pokazuje lub ukrywa login ucznia.
 */
addEventElements(".eye-icon.show-student-login", "click", function (e) {
  const tdElement = e.target.closest("td");
  if (tdElement) {
    // Znajdź element <span> wewnątrz <td>
    const spanElement = tdElement.querySelector("span");
    if (spanElement) {
      // Przełącz widoczność elementu <span>
      spanElement.style.display =
        spanElement.style.display === "none" ? "block" : "none";
    }
  }
});
/**
 * Funkcja obsługująca zdarzenie kliknięcia w ikonę oka poza tabelą. Pokazuje lub ukrywa loginy wszystkich uczniów.
 */
addEventElement(".eye-icon", "click", () => {
  const showStatus = document.querySelector(".classFunctions");
  document.querySelectorAll(".student-login").forEach((span) => {
    span.style.display =
      showStatus.getAttribute("data-show-login-status") === "false"
        ? "block"
        : "none";
  });
  showStatus.setAttribute(
    "data-show-login-status",
    showStatus.getAttribute("data-show-login-status") === "false"
      ? "true"
      : "false"
  );
});

document.querySelectorAll(".reset-passwd").forEach((btnResetPasswd) => {
  btnResetPasswd.addEventListener("click", function () {
   const login = btnResetPasswd.parentElement.parentElement.children[0].children[1].textContent;
    sendDataToServer({login:login}, "/reset-password").then((response) => {
      if(response.status === "success"){
        createNotification("Koala-V - Hasło zresetowane:", response.message, "success");
      }else{
        createNotification("Koala-V - Błąd:", response.message);
      }
    });
  });
});