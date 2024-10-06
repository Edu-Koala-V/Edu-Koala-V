if (
    location.pathname != "/wynik" &&
    location.pathname.split("/")[1] != "archiwum"
  ) {
    if (document.querySelector("#exam-time") != null) {
      examStartModalWindow();
    }
  } else {
    document.querySelector("#exam-time").remove();
  }

/**
 * Nadaje funkcjonalność przycisku "Zakończ test" w teście. Wysyła dane do serwera, a następnie przekierowuje użytkownika na odpowiednią stronę.
 */
addEventElement(".quiz-end", "click", function () {
  sendDataToServer(
    { examData: JSON.stringify(getQuizAnswerCheckedData()) },
    "/exam-check",
    (method = "POST")
  ).then((data) => {
    if (data.status != null) {
      createNotification("Ups", data.message, data.status);
    } else {
      document.documentElement.requestFullscreen();
      window.location.href = data.gotoLocation;
    }
  });
});

setupStyleAnswers();
/**
 * Ustawia odpowiednie style dla odpowiedzi w teście.
 */
function setupStyleAnswers() {
  const checkedAnswersInputs = document.querySelectorAll("input:checked");
  if (checkedAnswersInputs != null) {
    checkedAnswersInputs.forEach((input) => {
      const label = document.querySelector('[for="' + input.id + '"]');
      if (label.getAttribute("data-correct") == "false") {
        label.classList.add("wrong-answer");
      } else if (label.getAttribute("data-correct") == "null") {
        label.parentElement.parentElement.classList.add("non-answer");
        label.parentElement.querySelector("input").checked = false;
      } else {
        label.classList.add("good-answer");
      }
    });
  }
}
/**
 * Funkcja analizuje wszystkie pytania testu i zapisuje do tablicy done o nich.
 * @returns {Array} - Zwraca tablicę z danymi id quizu oraz id pytania i id udzielonej odpowiedzi lub -1 jeśli nie zaznaczono żadnej odpowiedzi.
 */
function getQuizAnswerCheckedData() {
    const quizzes = document.querySelectorAll(".quiz");
    const quizID = document
      .querySelector("#quiz-container")
      .getAttribute("data-quiz-id");
    const userQuizData = [];
    quizzes.forEach((quiz) => {
      userChecked = quiz.querySelectorAll("input:checked");
      const userCheckedData = [];
      userChecked.forEach((checkedInput) => {
        let questionID = checkedInput.id.split("question")[1].slice(0, -1);
        let answerRelID = checkedInput.getAttribute("data-answer-id");
        userCheckedData.push({
          questionID: questionID,
          answerRelID: answerRelID,
        });
      });
      if (userCheckedData.length == 0) {
        let questionUncheckID = quiz
          .querySelector("input")
          .id.split("question")[1]
          .slice(0, -1);
        userCheckedData.push({ questionID: questionUncheckID, answerRelID: -1 });
      }
      userQuizData.push({ quizID: quizID, userCheckedData: userCheckedData });
    });
    return userQuizData;
  }

/**
 * Funkcja zegara która rozpoczyna odliczanie czasu na rozwiązanie testu.
 * Po upływie czasu test zostanie automatycznie zakończony. Poprzez wywołanie kliknięcia przycisku "Zakończ test".
 */
function timerExam() {
  const timeDiv = document.querySelectorAll("#exam-time span")[1];
  let time = timeDiv.innerHTML;
  let timeArray = time.split(":");
  let minutes = parseInt(timeArray[0]);
  let seconds = parseInt(timeArray[1]);
  let interval = setInterval(function () {
    let timeText = "00:00";
    if (minutes == 0 && seconds == 0) {
      clearInterval(interval);
      document.querySelector(".quiz-end").click();
    } else {
      if (seconds == 0) {
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }

      if (minutes < 10) {
        timeText = "0" + minutes;
      } else {
        timeText = minutes;
      }
      if (seconds < 10) {
        timeText += ":0" + seconds;
      } else {
        timeText += ":" + seconds;
      }

      timeDiv.innerHTML = timeText;
    }
  }, 1000);
}


/**
 * Funkcja tworzy okno modalne z wstepnymi informacjami o teście i przyciskiem rozpoczynającym go.
 */
function examStartModalWindow() {
  const startExamWindow = createModal("", 4, "large");

  const modal = startExamWindow.querySelector(".modal-content");
  // modal.style='text-align: center; padding: 20px;    justify-content: space-evenly!important;flex-direction: column!important;';
  const time = document.querySelectorAll("#exam-time span")[1].textContent;
  const span = createElement("span", ["central-span"]);
  span.innerHTML =
    "Twój czas na rozwiązanie testu to: <b>" +
    time +
    "</b> minut.</br> Po upływie tego czasu test zostanie automatycznie zakończony. Powodzenia!";
  modal.appendChild(span);

  addEventElement(".btn.danger", "click", function () {
    timerExam();
    onFullScreenChange(true);
  });

  const buttonExamStart = createButton(
    "Kliknij tu aby rozpocząć test lub zamknij to okno.",
    ["btn", "primary"],
    function () {
      timerExam();
      document.querySelector(".back-blur").remove();
      onFullScreenChange(true);
    }
  );

  modal.appendChild(buttonExamStart);

  const span2 = document.createElement("span");
  span2.innerHTML =
    "<b style='color:red; te'>UWAGA!</b> Nie odświeżaj strony,pozostaw kursor myszki w obrebie okna strony i nie wyłączaj trybu pełnoekranowego ani nie zamykaj okna przeglądarki podczas rozwiązywania testu!";
  modal.appendChild(span2);
}


//############################################################################################################
/**
 * Funkcja anty-oszustwa sprawdzająca czy użytkownik nie próbuje oszukać podczas rozwiązywania testu. 
 * Sprawdza stan trybu pełnoekranowego oraz czy kursor myszki znajduje się w oknie przeglądarki.
 */
let fullscreenExit = false;
let mouseout = false;
// document.addEventListener("fullscreenchange", onFullScreenChange);
//############################################################################################################

function onFullScreenChange(is) {
  if (is == true) {
    document.documentElement.requestFullscreen();
  } else {
    if (!window.screenTop && !window.screenY) {
      if (fullscreenExit) {
        alert(
          "Opuszczono tryb pełnoekranowy poraz drugi test zostanie zakończony"
        );
        document.querySelector(".quiz-end").click();
      } else {
        createNotification(
          "Uwaga",
          "Zamknieto tryb pełnoekranowy. Masz 5 sekund na ponowne jego uruchomienie. Po tym czasie test zostanie zakończony.",
          "warning"
        );
        setTimeout(function () {
          if (!window.screenTop && !window.screenY) {
            document.querySelector(".quiz-end").click();
          } else {
            fullscreenExit = false;
          }
        }, 5000);
      }
    }
  }
  // document.addEventListener("mouseout", onMouseOut);
}
/**
 * Analizuje położenie kursora myszki w oknie przeglądarki.
 */
function onMouseOut(event) {
  // Ignoruj zdarzenia mouseout wywoływane przez elementy z klasą 'overlay'
  // Pozwala to uniknąć wywołania eventu gdy powiekszy się obraz
  if (event.target.classList.contains('back-blur')) {
    return;
  }
  // Sprawdź, czy kursor znajduje się w górnej części ekranu (np. w pierwszych 50 pikselach)
  if (
    !event.relatedTarget &&
    !event.toElement &&
    !(document.fullscreenElement && event.clientY <= 50)
  ) {
    if (mouseout) {
      createNotification(
        "Uwaga",
        "Opuszczono okno przeglądarki poraz drugi, test zostanie zakończony",
        "warning"
      );

      setTimeout(function () {
        document.querySelector(".quiz-end").click();
      }, 1000);
    } else {
      createNotification(
        "Uwaga",
        "Opuszczono okno przeglądarki. Gdy zrobisz to raz jeszcze to test zostanie zakończony",
        "warning"
      );
      setTimeout(function () {
        mouseout = true;
      }, 1000);
    }
  }
}

