 /**
 * Tworzy modalne okno z rozmytym tłem, odpowiednim rozmiarem i layoutem.
 * @param {string} headerText - Tekst nagłówka modalnego okna.
 * @param {number} layoutNumber - Numer layoutu modalnego okna.
 * @param {string} size - Rozmiar modalnego okna (small, medium, large).
 * 
 */
 function createModal(headerText = "", layoutNumber, size = "small") {
    // Rozmyte ciemne tło
    const modalBackBlur = createElement("div",["back-blur"]);
    document.body.appendChild(modalBackBlur);

    // Rozmiar okna modalnego i layout
    const modalDivSize = createModalWindow(setModalLayout(layoutNumber), size);

    // Okno modalne
    modalBackBlur.appendChild(modalDivSize);

    // Header okna modalnego
    createModalHeader(modalBackBlur, headerText);
    return modalBackBlur;
}

/**
 * Tworzy nagłówek modalnego okna z przyciskiem zamknięcia.
 * @param {HTMLElement} modalBackBlur - Element tła modalnego okna.
 * @param {string} headerText - Tekst nagłówka modalnego okna.
 */
function createModalHeader(modalBackBlur, headerText) {
    // Header okna modalnego
    const modalDivHeaderSpan = createElement("span",["modal-header-span"]);
    modalDivHeaderSpan.innerHTML = headerText;

    // Przycisk zamknięcia okna modalnego
    const modalDivClose = createButton("X", ["btn", "danger"], () => modalBackBlur.remove());
    modalDivClose.title = "Zamknij to okno.";
    // Zamknięcie okna modalnego po naciśnięciu klawisza Escape chyba że jesteśmy na stronie testów

    document.body.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && window.location.pathname != "/testy") {
            modalBackBlur.remove();
        }
    });

    const modalHeader = modalBackBlur.querySelector(".modal-header");
    modalHeader.appendChild(modalDivHeaderSpan);
    modalHeader.appendChild(modalDivClose);
}

/**
 * Ustawia rozmiar modalnego okna.
 * @param {HTMLElement} modalLayout - Element layoutu modalnego okna.
 * @param {string} size - Rozmiar modalnego okna (small, medium, large).
 * @returns {HTMLElement} - Element modalnego okna z ustawionym rozmiarem.
 */
function createModalWindow(modalLayout, size) {
    switch (size) {
        case "small":
            modalLayout.classList.add("modal-small");
            break;
        case "medium":
            modalLayout.classList.add("modal-medium");
            break;
        case "large":
            modalLayout.classList.add("modal-large");
            break;
        default:
            modalLayout.classList.add("modal-medium");
    }
    return modalLayout;
}

/**
 * Ustawia layout modalnego okna na podstawie numeru layoutu.
 * @param {number} layoutNumber - Numer layoutu modalnego okna.
 * @returns {HTMLElement} - Element layoutu modalnego okna.
 */
function setModalLayout(layoutNumber) {
    const divWrapper = createElement("div");
    const divHeader = createElement("div",["modal-header"]);
    divWrapper.appendChild(divHeader);

    const divContent = createElement("div",["modal-content"]);

    const divRightContainer = createElement("div",["modal-right-container"]);
    const divLeftContainer = createElement("div",["modal-left-container"]);

    switch (layoutNumber) {
        case 1:
            divWrapper.appendChild(divRightContainer);
            divWrapper.classList.add("modal-layout-1");
            break;
        case 2:            
            divWrapper.classList.add("modal-layout-2");
            break;
        case 3:
            divWrapper.appendChild(divLeftContainer);
            divWrapper.classList.add("modal-layout-3");
            break;
        default:
            divWrapper.appendChild(divRightContainer);
            divWrapper.appendChild(divLeftContainer);
            divWrapper.classList.add("modal-layout-4");
    }
    divWrapper.appendChild(divContent);

    return divWrapper;
}