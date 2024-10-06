/**
 * Tworzy przycisk do dodania nowej grupy lekcji.
 */
const addNewTopic = createButton("Dodaj nową grupę lekcji", ["btn", "primary"], (e) => {
    const lessonGroup = createElement("div", ["lesson-group"]);

    const lessonGroupHeader = createElement("div", ["lesson-group__header"]);
    const lessonTitle = createElement("h3");
    lessonTitle.setAttribute("data-lesson-group-id", "1");
    lessonTitle.innerText = "Nowa grupa lekcji";
    lessonTitle.contentEditable = true;
    lessonGroupHeader.appendChild(lessonTitle);
    lessonGroupHeader.appendChild(addLessonBtn());

    lessonGroup.appendChild(lessonGroupHeader);
    lessonGroup.appendChild(createNewLessonListElement());

    e.target.parentElement.insertBefore(lessonGroup, e.target);
    toggleEditButton();
});

/**
 * Sprawdza, czy URL zawiera 5 segmentów, a następnie dodaje przycisk do głównego elementu.
 */
if (window.location.href.split("/").length === 5) {
    document.querySelector("main").appendChild(addNewTopic);
    replaceEditButton();
}

/**
 * Zastępuje istniejący przycisk edycji nowym przyciskiem.
 */
function replaceEditButton() {
    const oldEditButton = document.querySelector("#edit-button");
    const editButton = createButton("Modyfikuj", ["btn", "btn-img"], (e) => {
        if (e.target.innerText === "Modyfikuj") {
            setAllEditableTitles();
            e.target.innerText = "Zapisz";
            e.target.classList = "btn btn-sky";
        } else {
            setNewLessons();
        }
    });

    editButton.id = "edit-button";
    oldEditButton.parentElement.replaceChild(editButton, oldEditButton);
}

/**
 * Ustawia wszystkie tytuły jako nieedytowalne i zapisuje zmiany.
 */
function setNewLessons() {
    setEditableTitles(false);
    document.querySelector("#edit-button").innerText = "Modyfikuj";
    document.querySelector("#edit-button").classList = "btn btn-img";
    saveChangesTopics();
}

/**
 * Ustawia wszystkie tytuły jako edytowalne.
 */
function setAllEditableTitles() {
    setEditableTitles(true);
}

/**
 * Ustawia edytowalność tytułów.
 * @param {boolean} editable - Czy tytuły mają być edytowalne.
 */
function setEditableTitles(editable) {
    const main = document.querySelector("main");
    const elements = main.querySelectorAll("h2, h3");

    elements.forEach((el) => {
        el.contentEditable = editable;
        el.style.border = editable ? "1px solid #ccc" : "none";
        el.style.padding = editable ? "5px" : "0";

        if (editable && el.tagName === "H2") {
            el.addEventListener("input", (e) => {
                e.target.parentElement.parentElement.querySelector("a").href = window.location.href + "/" + convertStringURL(e.target.innerText).trim();
            });
        }

        if (editable && el.tagName === "H3" && !el.parentElement.querySelector("button")) {
            el.parentElement.appendChild(addLessonBtn());
        }
    });
    const groupsLessons = document.querySelectorAll(".lesson-group");

    groupsLessons.forEach((group) => {
        group.querySelectorAll(".lesson-topic-list").forEach((lesson) => {
            setElementAsDraggable(lesson)
        });
    });
    setDraggableElements(groupsLessons);

    
}
//*####################
// Zapobiega wklejaniu formatowania z innych stron
if(document.querySelector("article")){
    document.querySelector("article").querySelectorAll("*")
    .forEach((element) => {
      element.addEventListener("paste", function (event) {
        event.preventDefault();
  
        // Pobierz wklejane dane jako tekst
        const text = (event.clipboardData || window.clipboardData).getData(
          "text"
        );
  
        // Wstaw przetworzony tekst do elementu
        const selection = window.getSelection();
        if (!selection.rangeCount) return false;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(text));
      });
    });
  }
    
  //*####################//
/**
 * Zapisuje zmiany w tematach lekcji.
 */
function saveChangesTopics() {
    const lessonGroups = document.querySelectorAll(".lesson-group");
    const titleData = [];
    const lessonData = [];

    lessonGroups.forEach((group) => {
        const titleElement = group.querySelector("h3");
        const title = titleElement.innerText.trim();
        const lessonGroupID = titleElement.getAttribute("data-lesson-group-id");

        if (title === "") {
            group.remove(); // TODO: Usuwanie w bazie danych
            return;
        }

        titleData.push([lessonGroupID, title]);

        const lessons = group.querySelectorAll("h2");
        const lessonTab = [];

        lessons.forEach((lesson) => {
            const lessonTitle = lesson.innerText.trim();
            const lessonID = lesson.getAttribute("data-lesson-id");

            if (lessonTitle === "") {
                lesson.remove();
                return;
            }

            lessonTab.push([lessonID, lessonTitle, lessonGroupID]);
        });

        lessonData.push(lessonTab);
    });

    const urlSegments = window.location.href.split("/");
    const courseName = convertURLToString(urlSegments[urlSegments.length - 1]);

    sendDataToServer({ CourseName: courseName, titleData: titleData, lessonData: lessonData }, "/setTopics", 'POST');
}

/**
 * Tworzy nowy element listy lekcji.
 * @returns {HTMLElement} - Nowy element listy lekcji.
 */
function createNewLessonListElement() {
    const lessonTopicListWrapper = createElement("div", ["lesson-topic-list"]);
    const lessonTopicHeader = createElement("div", ["lesson-topic-list__header"]);
    const lessonTopicTitle = createElement("div", ["lesson-topic-list__header__title"]);
    const lessonTopicTitleText = createElement("h2");

    lessonTopicTitleText.setAttribute("data-lesson-id", "new");
    lessonTopicTitleText.innerText = "Tematy lekcji";
    lessonTopicTitleText.contentEditable = true;
    lessonTopicTitle.appendChild(lessonTopicTitleText);
    lessonTopicHeader.appendChild(lessonTopicTitle);

    const lessonsActionsLinkWrapper = createElement("div", ["lesson-topic-list__header__actions"]);
    const lessonsActionsLink = createElement("a", ["btn", "primary"]);
    lessonsActionsLink.href = "/courses/#";
    lessonsActionsLink.innerText = "Przejdź do lekcji";

    lessonsActionsLinkWrapper.appendChild(lessonsActionsLink);
    lessonTopicHeader.appendChild(lessonsActionsLinkWrapper);
    lessonTopicListWrapper.appendChild(lessonTopicHeader);

    return lessonTopicListWrapper;
}

/**
 * Tworzy przycisk do dodania nowej lekcji.
 * @returns {HTMLElement} - Przycisk do dodania nowej lekcji.
 */
function addLessonBtn() {
    return createButton("Dodaj nową lekcję", ["btn", "primary"], (e) => {
        const lessonTopicListRef = e.target.parentElement.parentElement;
        lessonTopicListRef.appendChild(createNewLessonListElement());
        setAllEditableTitles();
    });
}

/**
 * Przełącza stan przycisku edycji.
 */
function toggleEditButton() {
    const editButton = document.querySelector("#edit-button");
    if (editButton.innerText === "Zapisz") {
        setAllEditableTitles();
    } else {
        editButton.click();
    }
}