//? ############################################################################################################
/**
 * Funkcje w tym pliku przekształcają elementy HTML na zdatne do edycji i nadają im funkcjonalność drag and drop
 * Po przejściu w try edycji chwytany jest <article> i wszystkie sekcje w nim zawarte które posiadają id zaczynające się od "section" i kończące liczbą
 * Następnie dla każdej sekcji dodawany jest element <div> na końcu, zapobiega to błędnemu grupowaniu elementów w funkcji collapseTextBlocks()
 * Następnie dla każdego elementu wewnątrz sekcji sprawdzane jest czy można go zwinąć za pomocą funkcji collapseTextBlocks()
 * W zależności od tagu elementu uruchamiany jest inna funkcja konfigurująca element
 * Dla tagów <SPAN>, <B>, <I>, <U>, <S>, <BI> element jest stylizowany i zawijany w funkcji collapseTextBlocks()
 * funkcja collapseTextBlocks() zwraca false jeśli element jest jednym z tagów tekstowych i nie zawiera klasy "li-content"
 * elementy wysyłane do funkcji są zapisywane w tablicy textArt, chyba że nie spełnią warunków wtedy wszystkie elementy z tablicy są zawijane w nowy wrapper
 * i ten wrapper nadpisuje pierwszy element z tablicy textArt oraz uzyskany wrapper wysyłany do funkcji stylizedTextElement()
 * Dla tagów <A> z klasą "web-link" lub "link-art" uruchamiane są odpowiednie funkcje konfigurujące linki
 * web-link - setupWebLink() blokuje domyślne zachowanie i po kliknięciu z przytrzymaniem CTRL uruchamia okno dialogowe do wpisania nowego adresu URL
 * link-art - setupArtLink() blokuje domyślne zachowanie i po kliknięciu z przytrzymaniem CTRL uruchamia okno modalne z listami wyboru kursów i lekcji
 * Dla tagów <OL>, <UL> uruchamiana jest funkcja setupList() konfigurująca listy
 * setupList() analizuje każdy element <li> i przesyła zawartość <span class="li-content"> do funkcji stylizedTextElement() dodatkowo nasłuchuje
 * zdarzenia input i sprawdza czy dodano nowy element <li> do listy, jeśli tak to go wysyła do funkcji stylizedTextElement()
 * Dla tagów <H1>, <H2>, <H3>, <H4>, <H5>, <H6> uruchamiana jest funkcja stylizedHeaderElement() stylizująca nagłówki poprzez wybór koloru z palety nad danym nagłówkiem
 * stylizedHeaderElement() tworzy nowy element <div> z klasą "header-wrapper" i dodaje go do rodzica nagłówka, następnie dodaje kolor do nagłówka
 * ta akcja zostaje odwrócona po kliknięciu na przycisk "Zapisz zmiany"
 * Dla tagów <BR> uruchamiana jest funkcja setElementAsDraggable() ustawiająca element jako przeciągalny
 * Dla tagów <TABLE> uruchamiana jest funkcja setupTable() konfigurująca tabele
 * setupTable() ustawia element jako przeciągalny i edytowalny, dodaje przyciski do dodawania i usuwania kolumn oraz wierszy
 * sprawdza czy każda komórka tabeli ma odpowiednią liczbę kolumn i dodaje brakujące komórki
 * zawija zawartość każdej komórki w element <span> z klasą "wrapper-span" i stylizuje ją za pomocą funkcji stylizedTextElement()
 * dodaje nasłuchiwacz zdarzeń input, który sprawdza czy został dodany nowy element <td> do tabeli, jeśli tak to go wysyła do funkcji stylizedTextElement()
 *
 * toggleEditableDraggable() - funkcja przełączająca element między trybem edycji a przeciągania po wciśnięciu klawisza CTRL i kliknięciu na element
 *
 * collapseTextBlocks() - funkcja zawijająca bloki tekstu w elementy wrappera
 *
 * stylizedTextElement() - funkcja stylizująca elementy tekstowe
 *
 * Akcje wykonane poprzez funkcje edytora są zapisywane w tablicy state, która przechowuje 10 stanów, po przekroczeniu tej liczby najstarszy stan jest usuwany z tablicy(index 0)
 * Funkcje undo() i redo() pozwalają na cofanie i ponawianie ostatnich akcji
 * Funkcjonalność undo() i redo() można aktywować poprzez CTRL + SHIFT a nastepnie puszczając SHIFT i trzymając dalej klawisze CTRL klikniecie Z wywoła undo a X redo
 * Każda akcja zapisuje stan przed i po modyfikacji (Niesie to za sobą konieczność klikniecia dwukrotnie CTRL + Z aby cofnąć akcję i CTRL + X aby ponowić)
 * Aktualne akcje to:
 * - dodanie nowego wiersza do tabeli
 * - usunięcie wiersza z tabeli
 * - dodanie nowej kolumny do tabeli
 * - usunięcie kolumny z tabeli
 * - stylizacja elementów tekstowych zapisuje w stanie cały format html elementów w aktywnym span wrapper-span i li-content
 *
 * Przy zapisie zostaje uruchomiona funkcja generująca JSON i nadpisująca article treścią generowaną z wytworzonego JSON
 * a //TODO: wykonaj podgląd bez tracenia oryginału
 */
//? ############################################################################################################

/**
 * Tworzy przycisk edycji i dodaje go do dokumentu.
 *
 * Funkcja tworzy przycisk "Edytuj lekcję" z klasami CSS "btn" i "primary".
 * Przycisk ten ma przypisaną funkcję `toggleEditMode`, która przełącza pomiedzy trybami edycji i zapisu.
 * Przycisk jest następnie dodawany do elementu `body` dokumentu.
 */
function createEditButton() {
  const editBtn = createButton(
    "Edytuj lekcję",
    ["btn", "primary"],
    toggleEditMode
  );
  editBtn.id = "edit-button";
  document.body.appendChild(editBtn);
}
/**
 * Przełącza tryb edycji lekcji.
 *
 * Funkcja zmienia tekst i styl przycisku edycji oraz przełącza tryb edycji lekcji.
 * Jeśli przycisk ma tekst "Edytuj lekcję", zmienia go na "Zapisz zmiany",
 * zmienia klasy CSS przycisku, a także zmienia kolory tła elementów `main` i `article`.
 * Następnie wywołuje funkcję `editLesson`.
 * Jeśli przycisk ma tekst "Zapisz zmiany", zmienia go na "Edytuj lekcję",
 * przywraca klasy CSS przycisku, usuwa style tła z elementów `main` i `article`,
 * a następnie wywołuje funkcję `saveLesson`.
 *
 * @param {Event} e - Obiekt zdarzenia kliknięcia.
 */
function toggleEditMode(e) {
  if (e.target.textContent === "Edytuj lekcję") {
    replacingNestedTextTags();
    e.target.textContent = "Zapisz zmiany";
    e.target.classList.remove("btn-primary");
    e.target.classList.add("btn-img");
    document.querySelector("main").style.backgroundColor = "lightslategrey";
    document.querySelector("article").style.backgroundColor = "dimgray";
    editLesson();
    setupToolsBox();
    if(document.querySelector("section#authors")){
      const button = createButton("Dodaj nową sekcję", ["btn", "primary"], ()=> {
        addNewSection();
      });
      document.querySelector("article").appendChild(button);
    }
  } else {
    if (
      !confirm(
        "Czy chcesz zapisać aktualne zmiany? Cały dokument zostanie przetworzony a jego historia zmian zostanie usunięta."
      )
    ) {
      return;
    }
    saveLesson();
    e.target.textContent = "Edytuj lekcję";
    e.target.classList.remove("btn-img");
    e.target.classList.add("btn-primary");
    document.querySelector("main").removeAttribute("style");
    document.querySelector("article").removeAttribute("style");
  }
}

function replacingNestedTextTags() {
  const sections = document.querySelectorAll("section");
  sections.forEach((section) => {
    section.querySelectorAll("*").forEach((element) => {
      if (element.tagName === "B") {
        let hasIChild = false;
        let childElement;
        Array.from(element.children).forEach((child) => {
          if (child.tagName === "I") {
            hasIChild = true;
            childElement = child;
          }
        });
        if (hasIChild) {
          element.outerHTML = "<bi>" + childElement.innerHTML + "</bi>";
        }
      }
    });
  });
}

/**
 * Przełącza sekcje lekcji w tryb edycji.
 *
 * Funkcja wyszukuje wszystkie sekcje z identyfikatorem zaczynającym się od "section" i kończącym się liczbą.
 * Następnie dodaje do każdej sekcji nowy element `div` na jej końcu
 * {Jest to potrzebne aby funkcja collapseTextBlocks() grupująca tekst w bloki nie brała tekstu z nowej sekcji} i przetwarza wszystkie elementy wewnątrz sekcji.
 * Dla każdego elementu sprawdza, czy można go zwinąć za pomocą funkcji `collapseTextBlocks()`.
 * W zależności od tagu elementu, ustawia odpowiednie właściwości edytowalne i stylizacyjne:
 * - Listy (`OL`, `UL`) są konfigurowane za pomocą funkcji `setupList()`.
 * - Nagłówki (`H1` do `H6`) są ustawiane jako edytowalne i przeciągalne, oraz stylizowane.
 * - Linie przerwy (`BR`) są ustawiane jako przeciągalne.
 * - Tabele (`TABLE`) są konfigurowane za pomocą funkcji `setupTable`.
 *
 * Na końcu, wszystkie elementy, które zostały zwiniete, są ustawiane jako przeciągalne.
 */
function editLesson() {
  console.log("editLesson");
  const sections = document.querySelectorAll('section[id^="section"]');
  const filteredSections = Array.from(sections).filter((section) =>
    /\d+$/.test(section.id)
  );
  const textCollapsedElements = [];
  filteredSections.forEach((section) => {
    section.appendChild(document.createElement("div"));
    const textArt = [];
    section.querySelectorAll("*").forEach((element) => {
      if(element.classList.contains("skip-set-draggable")) return;

      if (collapseTextBlocks(element, textArt) !== false) {
        textCollapsedElements.push(collapseTextBlocks(element, textArt));
      } else {
        return;
      }
      switch (element.tagName) {
        case "A":
          if (element.classList.contains("web-link")) {
            setupWebLink(element);
          } else if (element.classList.contains("link-art")) {
            setupArtLink(element);
          }
          break;
        case "OL":
        case "UL":
          setupList(element);
          break;
        case "H1":
        case "H2":
        case "H3":
        case "H4":
        case "H5":
        case "H6":
          stylizedHeaderElement(element);
          break;
        case "BR":
          if(!element.closest("span")) {setElementAsDraggable(element);}
          textCollapsedElements.push(collapseTextBlocks(element, textArt));
          break;
        case "TABLE":
          setupTable(element);
          break;
        case "DIV":
          if (element.classList.contains("text-block-name")) {
            setupTextBlockName(element);
          } else if (element.classList.contains("keys-combo")) {
            setupKeysCombo(element);
            element.querySelectorAll("span").forEach((span) => {
              setSkipSetDraggableElement(span);
            });
          } else if (element.classList.contains("ref-btn-for-img")) {
            setElementAsDraggable(element);
            element.addEventListener("click", function (e) {
              if (e.ctrlKey) {
                if (
                  element.children[0].getAttribute("contenteditable") === "true"
                ) {
                  element.children[0].removeAttribute("contenteditable");
                  element.classList.remove("editable");
                  setElementAsDraggable(element);
                } else {
                  element.children[0].setAttribute("contenteditable", true); //TODO Wykonaj działania dla <mark>
                  element.classList.add("editable");
                  unsetElementAsDraggable(element);
                }
              }
            });
          } else if (element.classList.contains("blur-load")) {
            setupIMG_BlurLoad(element);
            console.log(element);
          }else if (element.classList.contains("card-box")) {
            setupCardBox(element);
          }
          break;
      }
    });
    setDraggableElements(filteredSections);


  });
}
function setSkipSetDraggableElement(element){
  element.classList.add("skip-set-draggable");
}
/**
 * Funkcjonalność przełączania elementu między trybem edycji a przeciągania.
 * @param {HTMLElement} element
 */
function toggleEditableDraggable(element) {
  element.addEventListener("click", function (e) {
    if (e.ctrlKey) {
      if (element.getAttribute("contenteditable") === "true") {
        element.removeAttribute("contenteditable");
        element.classList.remove("editable");
        element.classList.remove("display-block");
        setElementAsDraggable(element);
      } else {
        element.setAttribute("contenteditable", true);
        element.classList.add("editable");
        element.classList.add("display-block");
        unsetElementAsDraggable(element);
        element.querySelectorAll(".wrapper-span").forEach((spanWrapper) => {
          stylizedTextElement(spanWrapper);
        });
      }
    }
  });
}
/**
 * Zawija bloki tekstu w elementy wrappera.
 *
 * Funkcja sprawdza, czy element jest już zawinięty w element `wrapper-span`.
 * Jeśli tak, zwraca ten element, aby zapobiec duplikacji przy ciągłym przełączaniu między trybami edycji i zapisu.
 * Jeśli element jest jednym z tagów tekstowych (`SPAN`, `B`, `I`, `U`, `S`, `BI`), dodaje go do tablicy `textArt` i stylizuje.
 * Jeśli element nie jest jednym z tagów tekstowych, tworzy nowy element `div` jako wrapper.
 * Następnie zawija wszystkie elementy z `textArt` w nowy wrapper i ustawia je jako edytowalne i przeciągalne.
 *
 * @param {HTMLElement} element - Element do zawinięcia.
 * @param {HTMLElement[]} textArt - Tablica elementów tekstowych do zawinięcia.
 * @returns {HTMLElement|boolean} - Zawinięty element jeżeli trafiono na element o tagu innym niż te z tablicy `tagsNames` lub `false`, jeśli element jest już zawinięty.
 */
function collapseTextBlocks(element, textArt) {
  if (
    element.parentElement &&
    element.parentElement.classList.contains("wrapper-span")
  ) {
    return element;
  }
  const tagsNames = ["SPAN", "B", "I", "U", "S", "BI"];
  let isExitFn = false;
  tagsNames.forEach((tagName) => {
    if (element.tagName === tagName) {
      if (!element.classList.contains("li-content")) {
        textArt.push(element);
        stylizedTextElement(element);
      }
      isExitFn = true;
    }
  });
  if (isExitFn) {
    return false;
  }
  const wrapper = createElement("div");
  if (textArt.length > 0) {
    textArt.forEach((textElement) => {
      const tag = createElement(textElement.tagName);
      wrapper.appendChild(tag);
      tag.outerHTML = textElement.outerHTML;
    });
    if (textArt[0].parentElement.classList.contains("li-content")) {
      textArt[0].outerHTML = wrapper.innerHTML;
    } else {
      textArt[0].innerHTML = wrapper.innerHTML;
    }
    textArt.forEach((element, index) => {
      if (index > 0) {
        element.remove();
      }
    });
    setElementAsDraggable(textArt[0]);
    toggleEditableDraggable(textArt[0]);
    textArt[0].classList.add("wrapper-span");
    textArt.length = 0;
    return textArt[0];
  }
}

let headerColorIndex = 0;

function stylizedHeaderElement(element) {
  const colorSelector = createElement("div");
  const colorClasserH = colorClasser(false);

  colorSelector.appendChild(colorClasserH);
  const divWrapper = createElement("div", ["header-wrapper"]);
  divWrapper.appendChild(colorSelector);
  divWrapper.appendChild(element.cloneNode(true));

  const parent = element.parentNode;
  parent.replaceChild(divWrapper, element);

  const newElement = divWrapper.children[1];

  colorClasserH.querySelectorAll("input").forEach((input) => {
    input.name = "headerColorIndex" + headerColorIndex;
    input.addEventListener("click", function () {
      const hClasses = newElement.classList;
      if (hClasses.contains("draggable")) {
        newElement.className = input.value + " draggable";
      } else if (hClasses.contains("editable")) {
        newElement.className = input.value + " editable";
      } else {
        newElement.className = input.value;
      }
      console.log(input.value);
    });
  });

  setElementAsDraggable(divWrapper);
  toggleEditableDraggable(divWrapper);

  headerColorIndex++;
}
/**
 * Konfiguruje listę jako edytowalną i przeciągalną.
 *
 * Funkcja ustawia element listy jako przeciągalny i edytowalny.
 * Następnie przetwarza wszystkie elementy wewnątrz listy, aby były stylizowane za pomocą funkcji `stylizedTextElement`.
 * Dodaje również nasłuchiwacz zdarzeń `input`, który sprawdza, czy został dodany nowy element `li` do listy.
 * Jeśli nowy element `li` zostanie dodany, jego zawartość jest stylizowana za pomocą funkcji `stylizedTextElement`.
 *
 * @param {HTMLElement} element - Element listy do skonfigurowania.
 */
function setupList(element) {
  const div = createElement("div");
  const buttonVer = createButton("Zmień typ listy", ["btn", "primary"], () => {
    if(element.classList.contains("ordered-list")){
      element.classList.remove("ordered-list");
      element.classList.add("unordered-list");
    }else{
      element.classList.remove("unordered-list");
      element.classList.add("ordered-list");
    }
  });
  div.appendChild(buttonVer);
  setTimeout(() => {
    element.parentElement.insertBefore(div, element);
  }, 10);
  if(element.tagName === "OL"){
    element.classList.add("ordered-list");
  }else{
    element.classList.add("unordered-list");
  }

  setElementAsDraggable(element);
  toggleEditableDraggable(element);
  element.querySelectorAll("*").forEach((liContent) => {
    stylizedTextElement(liContent);
  });
  element.addEventListener("input", (e) => {
    const newLi = element.querySelector("li:last-child");
    if (newLi) {
      const liContent = newLi.querySelector(".li-content");
      if (liContent) {
        stylizedTextElement(liContent);
      }
    }
  });
}
/**
 * Konfiguruje tabelę jako edytowalną i przeciągalną.
 *
 * Funkcja ustawia element tabeli jako przeciągalny i edytowalny.
 * Dodaje przyciski do dodawania i usuwania kolumn do każdego nagłówka tabeli (`th`).
 * Sprawdza, czy każda komórka tabeli (`td`) ma odpowiednią liczbę kolumn i dodaje brakujące komórki.
 * Dodaje przyciski do dodawania i usuwania wierszy do pierwszej komórki każdego wiersza.
 * Zawija zawartość każdej komórki w element `span` z klasą `wrapper-span` i stylizuje ją za pomocą funkcji `stylizedTextElement`.
 * Dodaje nasłuchiwacz zdarzeń `input`, który sprawdza, czy został dodany nowy element `td` do tabeli.
 * Jeśli nowy element `td` zostanie dodany, jego zawartość jest stylizowana za pomocą funkcji `stylizedTextElement`.
 *
 * @param {HTMLElement} element - Element tabeli do skonfigurowania.
 */
function setupTable(element) {
  setElementAsDraggable(element);
  toggleEditableDraggable(element);
  const maxColumnCount = element.querySelectorAll("th").length;
  element.querySelectorAll("th").forEach((th) => {
    buttonAddTableElements(th, () => addColumnToTable(element, th));
    buttonAddTableElements(th, () => removeColumnToTable(element, th), "-");
  });
  element.querySelectorAll("tr").forEach((tr, index) => {
    if (index === 0) {
      return;
    }
    const tdElements = tr.querySelectorAll("td");
    if (tdElements.length < maxColumnCount) {
      for (let i = tdElements.length; i < maxColumnCount; i++) {
        const td = createElement("td");
        tr.appendChild(td);
      }
    }
    tdElements.forEach((tdContent, index) => {
      tdContent.removeAttribute("style");
      if (index === 0) {
        buttonAddTableElements(tr, () => addRowToTable(element, tr));
        buttonAddTableElements(tr, () => removeRowToTable(element, tr), "-");
      }
      const spanWrapper = createElement("span", ["wrapper-span"]);
      tdContent.removeAttribute("colspan");
      tdContent.querySelectorAll("*").forEach((element) => {
        spanWrapper.appendChild(element);
      });
      if (spanWrapper.innerHTML === "") {
        spanWrapper.innerHTML =
          "<span class='wrapper-span'>" + tdContent.innerHTML + "</span>";
      }
      tdContent.innerHTML = spanWrapper.innerHTML;
      stylizedTextElement(tdContent);
    });
  });
  fixTD_Table_wrapper(element);
}

function fixTD_Table_wrapper(element) {
  // Przenieś zawartość wszystkich td do span
  element.querySelectorAll("td").forEach((td) => {
    let wrapperSpan = td.querySelector(".wrapper-span"); // Poprawiony selektor
    console.log(
      td,
      " => ",
      wrapperSpan,
      "  ===  ",
      td.querySelector(".wrapper-span")
    );
    if (!wrapperSpan) {
      wrapperSpan = document.createElement("span");
      wrapperSpan.classList.add("wrapper-span");
      wrapperSpan.innerHTML = td.innerHTML;
      td.innerHTML = "";
      td.appendChild(wrapperSpan);
    }
    td.setAttribute("contenteditable", "false");
    element.addEventListener("click", function () {
      wrapperSpan.setAttribute(
        "contenteditable",
        element.getAttribute("contenteditable")
          ? element.getAttribute("contenteditable")
          : "false"
      );
    });
  });
}

/**
 * Dodaje nowy wiersz do tabeli.
 *
 * Funkcja tworzy nowy wiersz (`tr`) z odpowiednią liczbą komórek (`td`),
 * zgodnie z liczbą nagłówków kolumn (`th`) w tabeli.
 * Każda komórka jest zawijana w element `span` z klasą `wrapper-span` i stylizowana za pomocą funkcji `stylizedTextElement`.
 * Dodaje również przyciski do dodawania i usuwania wierszy do nowego wiersza.
 * Nowy wiersz jest dodawany do tabeli po wskazanym wierszu (`trElement`).
 *
 * @param {HTMLElement} tableElement - Element tabeli, do której ma być dodany nowy wiersz.
 * @param {HTMLElement} trElement - Wiersz, po którym ma być dodany nowy wiersz.
 */
function addRowToTable(tableElement, trElement) {
  saveStateColumnTable(tableElement);

  const maxColumnCount = tableElement.querySelectorAll("th").length;
  const newRow = createElement("tr");
  for (let i = 0; i < maxColumnCount; i++) {
    const td = createElement("td");
    newRow.appendChild(td);
    const spanWrapper = createElement("span", ["wrapper-span"]);
    td.appendChild(spanWrapper);
    stylizedTextElement(spanWrapper);
  }
  buttonAddTableElements(newRow, () => addRowToTable(tableElement, newRow));
  buttonAddTableElements(
    newRow,
    () => removeRowToTable(tableElement, newRow),
    "-"
  );
  trElement.after(newRow);
  fixTD_Table_wrapper(tableElement);
  saveStateColumnTable(tableElement);
}
/**
 * Dodaje nową kolumnę do tabeli.
 *
 * Funkcja tworzy nową komórkę (`td`) w każdym wierszu tabeli (`tr`),
 * zgodnie z indeksem nagłówka kolumny (`thIndex`), po którym ma być dodana nowa kolumna.
 * Każda nowa komórka jest zawijana w element `span` z klasą `wrapper-span` i stylizowana za pomocą funkcji `stylizedTextElement`.
 * Dodaje również nowy nagłówek kolumny (`th`) po wskazanym nagłówku (`thElement`).
 * Dodaje przyciski do dodawania i usuwania kolumn do nowego nagłówka.
 *
 * @param {HTMLElement} tableElement - Element tabeli, do której ma być dodana nowa kolumna.
 * @param {HTMLElement} thElement - Nagłówek kolumny, po którym ma być dodana nowa kolumna.
 */
function addColumnToTable(tableElement, thElement) {
  saveStateColumnTable(tableElement);
  const thIndex = thElement.cellIndex;
  tableElement.querySelectorAll("tr").forEach((tr, index) => {
    if (index === 0) return;
    let td = createElement("td");
    const spanWrapper = createElement("span", ["wrapper-span"]);
    td.appendChild(spanWrapper);
    stylizedTextElement(spanWrapper);
    tr.children[thIndex].after(td);
  });
  const newTh = createElement("th");
  thElement.after(newTh);
  buttonAddTableElements(newTh, () => addColumnToTable(tableElement, newTh));
  buttonAddTableElements(
    newTh,
    () => removeColumnToTable(tableElement, newTh),
    "-"
  );
  fixTD_Table_wrapper(tableElement);
  saveStateColumnTable(tableElement);

}
function saveStateColumnTable(tableElement) {
  let stateObject = {
    type: "modifyTable",
    tableElementRef: tableElement,
    tableElement: tableElement.cloneNode(true),
  };
  console.log(stateObject);
  console.log(stateObject.tableElementRef);
  console.log(stateObject.tableElement);
  saveState(stateObject);
}
/**
 * Usuwa wiersz z tabeli.
 *
 * Funkcja usuwa wskazany wiersz (`trElement`) z tabeli (`tableElement`),
 * jeśli tabela zawiera więcej niż dwa wiersze i wskazany wiersz nie zawiera nagłówka (`th`).
 * są sprawdzane dwa wiersze czyli ilość elementów tr ponieważ pierwszy wiersz to nagłówki tabeli.
 *
 * @param {HTMLElement} tableElement - Element tabeli, z której ma być usunięty wiersz.
 * @param {HTMLElement} trElement - Wiersz, który ma być usunięty.
 */
function removeRowToTable(tableElement, trElement) {
  if (
    tableElement.querySelectorAll("tr").length > 2 &&
    !trElement.querySelector("th")
  ) {
    saveStateColumnTable(tableElement);

    trElement.remove();
    fixTD_Table_wrapper(tableElement);
    saveStateColumnTable(tableElement);
  }
}
/**
 * Usuwa kolumnę z tabeli.
 *
 * Funkcja usuwa wskazaną kolumnę (`thElement`) z tabeli (`tableElement`),
 * jeśli tabela zawiera więcej niż jeden nagłówek kolumny (`th`).
 * Usuwa komórki (`td`) z każdego wiersza (`tr`) zgodnie z indeksem nagłówka kolumny (`thIndex`).
 *
 * @param {HTMLElement} tableElement - Element tabeli, z której ma być usunięta kolumna.
 * @param {HTMLElement} thElement - Nagłówek kolumny, który ma być usunięty.
 */
function removeColumnToTable(tableElement, thElement) {
  if (tableElement.querySelectorAll("th").length > 1) {
    const thIndex = thElement.cellIndex;
    saveStateColumnTable(tableElement);
    tableElement.querySelectorAll("tr").forEach((tr) => {
      tr.children[thIndex].remove();
    });
    fixTD_Table_wrapper(tableElement);
    saveStateColumnTable(tableElement);
  }
}
/**
 * Dodaje przycisk do elementu tabeli, który umożliwia dodawanie lub usuwanie wierszy/kolumn.
 *
 * Funkcja tworzy przycisk (`addBtn`) z tekstem i klasami CSS zależnymi od wartości parametru `text`.
 * Przycisk jest dodawany do elementu `parentElement` i ustawiany jako niewidoczny.
 * Przycisk ma przypisaną funkcję `functionToCall`, która jest wywoływana po kliknięciu przycisku.
 * Dodaje nasłuchiwacze zdarzeń `mousemove` i `mouseleave` do elementu `parentElement`,
 * aby wyświetlać przycisk w miejscu kursora myszy podczas poruszania się po elemencie oraz ukrywać go po opuszczeniu elementu.
 *
 * @param {HTMLElement} parentElement - Element, do którego ma być dodany przycisk.
 * @param {Function} functionToCall - Funkcja, która ma być wywoływana po kliknięciu przycisku.
 * @param {string} [text="+"] - Tekst wyświetlany na przycisku. Domyślnie "+".
 */
function buttonAddTableElements(parentElement, functionToCall, text = "+") {
  const classList = text === "+" ? ["btn", "add-row"] : ["btn", "remove-row"];
  const addBtn = createButton(text, classList, functionToCall);
  parentElement.appendChild(addBtn);
  addBtn.style.display = "none";
  addBtn.setAttribute("contenteditable", false);
  console.log(parentElement);
  parentElement.addEventListener("mousemove", (e) => {
    
    if(parentElement.closest("table").getAttribute("contenteditable") === "true") return;
    addBtn.style.display = "inline-block";
    addBtn.style.top = e.clientY + "px";
    addBtn.style.left = e.clientX + "px";
  });
  parentElement.addEventListener("mouseleave", () => {
    addBtn.style.display = "none";
  });
}

//? ############################################################################################################
let state = [];
let stateIndex = 0;

function saveState(object) {
  state = state.slice(0, stateIndex);

  if (state.length === 10) {
    state.shift();
    stateIndex--;
  }
  state.push(object);
  stateIndex++;
}
function undo() {
  stateIndex--;

  if (stateIndex >= 0) {
    setState(state[stateIndex]);
  } else {
    stateIndex = 0;
  }
  console.log(stateIndex);
  console.log(state);
}
function redo() {
  stateIndex++;
  if (stateIndex < state.length) {
    setState(state[stateIndex]);
  } else {
    stateIndex = state.length - 1;
  }
  console.log(stateIndex);
  console.log(state);
}
function setState(objectState) {
  switch (objectState.type) {
    case "styleText":
      let rangeContent = objectState.selectedHTML;
      function restoreOriginalText(range, originalContent) {
        // Zapisz stan z nowym HTML po modyfikacji
        // Znajdź najbliższego wspólnego przodka zaznaczenia
        let commonAncestor = range.commonAncestorContainer;
        // Jeśli wspólny przodek jest węzłem tekstowym, przejdź do jego rodzica
        let ancestorElement =
          commonAncestor.nodeType === 3
            ? commonAncestor.parentElement
            : commonAncestor;
        // Przechodź przez rodziców przodka, aż znajdziesz element z klasą wrapper-span lub li-content
        while (
          ancestorElement &&
          !ancestorElement.classList.contains("wrapper-span") &&
          !ancestorElement.classList.contains("li-content")
        ) {
          ancestorElement = ancestorElement.parentElement;
        }
        ancestorElement.innerHTML = originalContent;
      }
      restoreOriginalText(objectState.range, rangeContent);
      break;
    case "modifyTable":
      restoreTableState(objectState.tableElementRef, objectState.tableElement);
      break;
  }
}
function restoreTableState(tableElementRef, tableElementClone) {
  if (tableElementRef && tableElementClone) {
    tableElementClone
      .querySelectorAll(".add-row , .remove-row")
      .forEach((element) => {
        element.remove();
      });
    console.log(tableElementClone);
    tableElementRef.innerHTML = tableElementClone.innerHTML;

    setupTable(tableElementRef);

    const firstTR = tableElementRef
      .querySelector("tr")
      .querySelectorAll(".add-row , .remove-row");
    firstTR.forEach((element, index) => {
      if (index === firstTR.length - 1 || index === firstTR.length - 2) {
        element.remove();
      }
    });
  } else {
    console.error("Invalid table elements provided for restoration.");
  }
}

let shiftCtrl = false;

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("keydown", function (event) {
    if (shiftCtrl && (event.key === "z" || event.key === "Z")) {
      if (event.ctrlKey && (event.key === "z" || event.key === "Z")) {
        undo();
      } else {
        shiftCtrl = false;
      }
    }
    if (shiftCtrl && (event.key === "x" || event.key === "X")) {
      if (event.ctrlKey && (event.key === "x" || event.key === "x")) {
        redo();
      } else {
        shiftCtrl = false;
      }
    }
    if (event.shiftKey && event.ctrlKey) {
      shiftCtrl = true;
    }

    // if (event.shiftKey && event.ctrlKey && event.key === "z") {
    //   undo();
    //   console.log("undo");
    // }
    // if (event.shiftKey && event.ctrlKey && event.key === "y") {
    //   redo();
    //   console.log("redo");
    // }
    // if (event.ctrlKey && event.key === "a") {
    //   const activeElement = document.activeElement;
    //   const isEditableSpan = activeElement && activeElement.isContentEditable;

    //   if (!isEditableSpan) {
    //     event.preventDefault();
    //   } else {
    //     // Zaznacz cały tekst w aktywnym elemencie
    //     const range = document.createRange();
    //     range.selectNodeContents(activeElement);
    //     const selection = window.getSelection();
    //     selection.removeAllRanges();
    //     selection.addRange(range);

    //     // Symuluj zdarzenie mouseup na aktywnym elemencie
    //     const mouseUpEvent = new Event("mouseup");
    //     activeElement.dispatchEvent(mouseUpEvent);
    //   }
    // }
  });
});
//*####################
// Zapobiega wklejaniu formatowania z innych stron
if (document.querySelector("article")) {
  document
    .querySelector("article")
    .querySelectorAll("*")
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
//? ############################################################################################################

/**
 * Dodaje funkcjonalność stylizacji tekstu do elementu.
 *
 * Funkcja dodaje nasłuchiwacz zdarzeń `mouseup` do elementu, który sprawdza,
 * czy użytkownik zaznaczył jakiś tekst. Jeśli zaznaczono tekst,
 * zapisuje zakres zaznaczenia (`range`) i zaznaczony tekst (`selectedText`).
 * Następnie wywołuje funkcję `styleTextToolBox`, która wyświetla narzędzie do stylizacji tekstu.
 *
 * @param {HTMLElement} element - Element, do którego ma być dodana funkcjonalność stylizacji tekstu.
 */
let selectedColorClass;
let range;
let selectedText;
function stylizedTextElement(element) {
  element.addEventListener("mouseup", function () {
    const selection = window.getSelection();
    try {
      if (selection.getRangeAt(0).toString().length > 0) {
        range = selection.getRangeAt(0);
        selectedText = range.toString();
        styleTextToolBox();
      }
    } catch (e) {
      range = undefined;
      selectedText = undefined;
    }
  });
}
/**
 * Tworzy i wyświetla narzędzie do stylizacji tekstu.
 *
 * Funkcja sprawdza, czy narzędzie do stylizacji tekstu (`styleTextToolBox`) już istnieje.
 * Jeśli nie, tworzy nowy element `div` z odpowiednim identyfikatorem i klasą CSS,
 * a następnie dodaje go do dokumentu.
 * Narzędzie jest czyszczone i wypełniane przyciskami do stylizacji tekstu,
 * takimi jak pogrubienie (`B`), kursywa (`I`), podkreślenie (`U`), przekreślenie (`S`),
 * oraz kombinacja pogrubienia i kursywy (`BI`).
 * Dodaje również przycisk do usuwania stylizacji (`Clear`) i narzędzie do wyboru koloru tekstu (`colorClasser`).
 * Jeśli wybrano wcześniej kolor, odpowiedni przycisk radiowy jest zaznaczony.
 */
function styleTextToolBox() {
  let styleTextToolBox = document.querySelector("#style-text-toolbox");
  if (!styleTextToolBox) {
    styleTextToolBox = document.createElement("div");
    styleTextToolBox.id = "style-text-toolbox";
    styleTextToolBox.classList.add("style-text-toolbox");
    document.body.appendChild(styleTextToolBox);
  }

  styleTextToolBox.innerHTML = "";
  const leftColumn = createElement("div");
  const rightColumn = createElement("div");
  const columnWrapper = createElement("div", ["column-wrapper"]);
  styleTextToolBox.appendChild(
    createButton(
      "<b>Clear</b>",
      ["btn", "text-unstyle", "style-text-tool-item"],
      () => applyStyle("span")
    )
  );
  leftColumn.appendChild(
    createButton(
      "<b>B</b>",
      ["btn", "text-style", "style-text-tool-item"],
      () => applyStyle("b")
    )
  );
  leftColumn.appendChild(
    createButton(
      "<i>I</i>",
      ["btn", "text-style", "style-text-tool-item"],
      () => applyStyle("i")
    )
  );
  leftColumn.appendChild(
    createButton(
      "<u>U</u>",
      ["btn", "text-style", "style-text-tool-item"],
      () => applyStyle("u")
    )
  );
  leftColumn.appendChild(
    createButton(
      "<s>S</s>",
      ["btn", "text-style", "style-text-tool-item"],
      () => applyStyle("s")
    )
  );
  rightColumn.appendChild(
    createButton(
      "<bi>BI</bi>",
      ["btn", "text-style-combo", "style-text-tool-item"],
      () => applyStyle("bi")
    )
  );
  columnWrapper.appendChild(leftColumn);
  columnWrapper.appendChild(rightColumn);
  styleTextToolBox.appendChild(columnWrapper);
  styleTextToolBox.appendChild(colorClasser());
  if (selectedColorClass !== undefined) {
    styleTextToolBox.querySelector(
      "input." + selectedColorClass
    ).checked = true;
  } else {
    styleTextToolBox.querySelector("input.black").checked = true;
  }
}
/**
 * Tworzy narzędzie do wyboru koloru tekstu.
 *
 * Funkcja tworzy element `div` z klasą `color-classer`, który zawiera przyciski radiowe do wyboru koloru tekstu.
 * Dla każdego koloru z tablicy `classColor` tworzy przycisk radiowy (`input`) z odpowiednią klasą CSS i wartością.
 * Dodaje nasłuchiwacz zdarzeń `click` do każdego przycisku, który ustawia wybrany kolor (`selectedColorClass`).
 * Każdy przycisk radiowy jest umieszczany w osobnym elemencie `div` z odpowiednią klasą CSS.
 * Na końcu, wszystkie elementy są dodawane do wrappera, który jest zwracany przez funkcję.
 *
 * @returns {HTMLElement} - Element `div` zawierający narzędzie do wyboru koloru tekstu.
 */
function colorClasser(isAddEventListener = true) {
  const wrapper = createElement("div");
  wrapper.classList.add("color-classer");
  const classColor = [
    "red",
    "green",
    "blue",
    "yellow",
    "purple",
    "orange",
    "pink",
    "brown",
    "gray",
    "black",
  ];
  classColor.forEach((color) => {
    const colorInput = createElement("input");
    colorInput.type = "radio";
    colorInput.name = "color";
    colorInput.value = color;
    colorInput.classList.add(color);
    if (isAddEventListener) {
      colorInput.addEventListener("click", () => {
        selectedColorClass = color;
      });
    }
    const div = createElement("div");
    div.classList.add(color);
    div.appendChild(colorInput);
    wrapper.appendChild(div);
  });
  return wrapper;
}
/**
 * Stosuje wybrany styl do zaznaczonego tekstu. Dodatkowo zapobiega zagnieżdżaniu elementów jeżeli znajdują się wewnątrz elementu o klasach `li-content` i `wrapper-span`.
 *
 * Funkcja tworzy nowy element o tagu `tagName` i ustawia jego zawartość na zaznaczony tekst (`selectedText`).
 * Dodaje wybraną klasę koloru (`selectedColorClass`) do nowego elementu.
 * Usuwa zawartość zaznaczenia (`range.deleteContents()`) i wstawia nowy element w miejsce zaznaczenia (`range.insertNode(newTag)`).
 * Następnie przetwarza wszystkie elementy w zakresie zaznaczenia, aby dodać odpowiednie klasy CSS.
 * Jeśli element jest tekstem, tworzy nowy HTML z odpowiednimi tagami i klasami.
 * Jeśli element jest zawinięty w `wrapper-span` lub `li-content`, zastępuje jego zawartość nowym HTML.
 *
 * @param {string} tagName - Nazwa tagu HTML, który ma być zastosowany do zaznaczonego tekstu.
 */
function applyStyle(tagName) {
  if (selectedText !== undefined) {
    //####################################################################################################################
    saveStateOnStylizedText();
    //####################################################################################################################

    // Utwórz nowy element z nowym stylem
    const newTag = createElement(tagName);
    newTag.textContent = selectedText;
    newTag.classList.add(selectedColorClass);
    range.deleteContents();
    range.insertNode(newTag);

    // Przygotowanie nowego HTML po modyfikacji
    const modifiedElements = range.endContainer.childNodes;
    let newTextHTML = "";
    let tagClass = "";

    modifiedElements.forEach((element, index) => {
      // analiza elementu i zastosowanie odpowiedniej klasy CSS
      if (selectedColorClass !== undefined && selectedColorClass !== "black") {
        tagClass = ' class="' + selectedColorClass + '"';
      }
      if (
        element.classList === undefined ||
        element.classList.length === 0 ||
        element.classList.value === ""
      ) {
        tagClass = "";
      } else if (index !== 1) {
        tagClass = ' class="' + element.classList.value + '"';
      }
      // Przygotowanie nowego HTML po modyfikacji
      if (element.nodeName === "#text") {
        console.log(element.parentElement);
        newTextHTML +=
          "<" +
          element.parentElement.tagName +
          " class='" +
          element.parentElement.classList +
          "'>" +
          element.textContent +
          "</" +
          element.parentElement.tagName +
          ">";
        return;
      }
      newTextHTML +=
        "<" +
        element.tagName +
        tagClass +
        ">" +
        element.textContent +
        "</" +
        element.tagName +
        ">";
    });

    // Zastąp zawartość zaznaczenia nowym HTML jeżeli rodzic zakresu posiada klasę wrapper-span lub li-content
    if (
      range.endContainer.parentElement.classList.contains("wrapper-span") ||
      range.endContainer.parentElement.classList.contains("li-content")
    ) {
      range.endContainer.outerHTML = newTextHTML;
      console.log("Zawiera wrapper-span lub li-content");
    } else {
      // Zastąp zawartość zaznaczenia nowym HTML jeżeli rodzic zakresu nie posiada klasy wrapper-span lub li-content
      // Wiec najprawdopodobniej zakres zaznaczenia zawiera spana z klasą wrapper-span lub li-content
      range.endContainer.innerHTML = newTextHTML;
      console.log("Nie zawiera wrapper-span lub li-content");
    }

    //####################################################################################################################
    saveStateOnStylizedText();
    //####################################################################################################################
  }

  window.getSelection().removeAllRanges();
  range = undefined;
  selectedText = undefined;
  document.querySelector("#style-text-toolbox").remove();
}

function saveStateOnStylizedText() {
  // Zapisz stan z nowym HTML przed modyfikacją
  // Znajdź najbliższego wspólnego przodka zaznaczenia
  let commonAncestor = range.commonAncestorContainer;
  // Jeśli wspólny przodek jest węzłem tekstowym, przejdź do jego rodzica
  let ancestorElement =
    commonAncestor.nodeType === 3
      ? commonAncestor.parentElement
      : commonAncestor;
  // Przechodź przez rodziców przodka, aż znajdziesz element z klasą wrapper-span lub li-content
  while (
    ancestorElement &&
    !ancestorElement.classList.contains("wrapper-span") &&
    !ancestorElement.classList.contains("li-content")
  ) {
    ancestorElement = ancestorElement.parentElement;
  }
  // Zapisz innerHTML znalezionego elementu do zmiennej selectedHTML
  let selectedHTML = ancestorElement ? ancestorElement.innerHTML : "";

  // Zapisz stan z oryginalnym HTML
  let objectState = {
    type: "styleText",
    range: range,
    selectedHTML: selectedHTML,
  };
  saveState(objectState);
}

/**
 * Zapisuje lekcję, usuwając tryb edycji i czyszcząc elementy edytowalne.
 *
 * Funkcja usuwa narzędzie do stylizacji tekstu, jeśli istnieje.
 * Następnie przetwarza wszystkie sekcje (`section`) w dokumencie:
 * - Usuwa ostatni element `div` w sekcji, jeśli istnieje.
 * - Usuwa puste elementy, z wyjątkiem elementów `BR`.
 * - Usuwa atrybut `contenteditable` i właściwość przeciągania z elementów.
 *
 * Następnie przetwarza wszystkie tabele (`table`) w dokumencie:
 * - Usuwa przyciski (`BUTTON`).
 * - Usuwa puste komórki tabeli (`TD`).
 * - Usuwa nasłuchiwacze zdarzeń `mousemove` i `mouseleave` z wierszy (`TR`) i nagłówków (`TH`).
 *
 * Na końcu wywołuje funkcje `fixTableRows` i `fixTableTH` w celu naprawy struktury tabeli.
 */
function saveLesson() {
  if (document.querySelector("#style-text-toolbox")) {
    document.querySelector("#style-text-toolbox").remove();
  }
  document.querySelectorAll("section").forEach((section) => {
    if (section.lastChild.tagName === "DIV") {
      section.removeChild(section.lastChild);
    }
    section.querySelectorAll("*").forEach((element) => {
      if (element.innerHTML === "" && element.tagName !== "BR") {
        element.remove();
        return;
      }
      unsetElementAsDraggable(element);
      element.removeAttribute("contenteditable");
      element.classList.remove("editable");
      const newElement = element.cloneNode(true);
      element.parentNode.replaceChild(newElement, element);
    });
  });
  document.querySelectorAll("table").forEach((table) => {
    table.querySelectorAll("*").forEach((element) => {
      if (element.tagName === "BUTTON") {
        element.remove();
      }
      if (element.tagName === "TD" && element.innerHTML === "") {
        element.remove();
      }
      if (element.tagName === "TR" || element.tagName === "TH") {
        element.removeEventListener("mousemove", () => {});
        element.removeEventListener("mouseleave", () => {});
      }
    });
  });
  document.querySelectorAll("header-wrapper").forEach((element) => {
    element.outerHTML = element.children[1].outerHTML;
  });
  setTimeout(() => {
    fixTableRows();
    fixTableTH();
  }, 100);
  const jsonData = generateJSONFromArticle();

  const artLink = document.querySelector(".article-header").getAttribute("data-content");
 
  sendDataToServer({}, "/get-token").then((data) => {
    const token = data.token;
    const fileName = artLink.split("/")[4];
    const dirLocation = artLink.split("/")[3];
    const userName = artLink.split("/")[0];
    const repoName = artLink.split("/")[1];
  
    if(sendArticleToGithubRepository(jsonData, fileName, dirLocation,userName,repoName, token)){

    }
  });

  setupContentArticle(JSON.parse(jsonData));
  state = [];
  stateIndex = 0;
  // window.location.reload();
}

//! Wywołanie funkcji dla stworzenia przycisku edycji
createEditButton();

function setupWebLink(element) {
  setElementAsDraggable(element);
  element.addEventListener("click", function (e) {
    if (!e.shiftKey) {
      e.preventDefault();
    }
    if (e.ctrlKey) {
      const urlLink = prompt("Podaj adres URL:");
      if (urlLink) {
        if (urlLink.includes("https://") || urlLink.includes("http://")) {
          element.href = urlLink;
        } else {
          element.href = "https://" + urlLink;
        }
        let url = new URL(element.href);
        element.textContent = url.hostname;
      }
    }
  });
}
function setupArtLink(element) {
  setElementAsDraggable(element);
  element.addEventListener("click", function (e) {
    if (!e.shiftKey) {
      e.preventDefault();
    }
    if (e.ctrlKey) {
      const dataArtLinkValues = convertLinkArtElementToJSON(element)[1];

      fetchJSONFile("/get-courses").then((data) => {
        const windowArt = createModal(
          "Konfiguracja przekierowania do artykułu",
          2
        );
        const content = windowArt.querySelector(".modal-content");
        const divWrapper = createElement("div", ["config-setup-linkArt"]);
        const div = createElement("div");
        const label = createElement("label");
        label.textContent = "Wybierz kurs z listy:";
        const select = createElement("select");
        select.name = "course";

        data.forEach((course) => {
          const option = createElement("option");
          option.value = course.id;
          option.textContent = course.title_description;
          if (course.title_description === dataArtLinkValues[0]) {
            option.selected = true;
          }
          select.appendChild(option);
        });

        div.appendChild(label);
        div.appendChild(select);
        divWrapper.appendChild(div);
        const div2 = createElement("div");
        const label2 = createElement("label");
        label2.textContent = "Wybierz artykuł z listy:";
        div2.appendChild(label2);
        divWrapper.appendChild(div2);
        content.appendChild(divWrapper);

        getArticlesByCourseId(windowArt, select.value, div2, dataArtLinkValues);

        select.addEventListener("change", function (e) {
          getArticlesByCourseId(
            windowArt,
            e.target.value,
            div2,
            dataArtLinkValues
          );
        });

        const button = createButton("Zapisz", ["btn", "primary"], function () {
          const courseSelect = windowArt.querySelector("select[name='course']");
          const articleSelect = windowArt.querySelector(
            "select[name='article']"
          );
          const course = courseSelect.options[courseSelect.selectedIndex].text;

          const article =
            articleSelect.options[articleSelect.selectedIndex].text;

          element.href =
            "/courses/" +
            convertStringURL(course) +
            "/" +
            convertStringURL(article);
          element.textContent = article;
          element.title =
            'Przejdź do artykułu: "' + article + '" w kursie: "' + course + '"';
          windowArt.remove();
        });
        content.appendChild(button);
      });
    }
  });
}
//e.target.value getArticlesByCourseId(windowArt,e.target.value)
function getArticlesByCourseId(windowArt, courseID, div2, dataArtLinkValues) {
  fetchJSONFile("/courses/" + courseID).then((data) => {
    let selectArticle = windowArt.querySelector("select[name='article']");
    if (selectArticle) {
      selectArticle.innerHTML = "";
    } else {
      selectArticle = createElement("select");
      selectArticle.name = "article";
      div2.appendChild(selectArticle);
    }

    data.forEach((article) => {
      const option = createElement("option");
      option.value = article.id;
      option.textContent = article.title;
      if (article.title === dataArtLinkValues[1]) {
        option.selected = true;
      }
      selectArticle.appendChild(option);
    });
  });
}
function setupTextBlockName(element) {
  setElementAsDraggable(element);
  toggleEditableDraggable(element);
}
function setupKeysCombo(element) {
  setElementAsDraggable(element);
  element.addEventListener("click", function (e) {
    if (e.ctrlKey) {
      showKeyboardWindow(element);
    }
  });
}
let selectedKeys = [];
function showKeyboardWindow(element) {
  const keysFragments = [];

  const keyboardModalWindow = createModal("Konfiguracja klawiszy", 2, "large");
  const content = keyboardModalWindow.querySelector(".modal-content");
  content.style.flexDirection = "column";

  const keyboardWrapper = createElement("div", ["keyboard-wrapper"]);
  const keys1 = [
    [
      "Esc",
      "",
      "F1",
      "F2",
      "F3",
      "F4",
      "",
      "F5",
      "F6",
      "F7",
      "F8",
      "",
      "F9",
      "F10",
      "F11",
      "F12",
    ],
    [
      ["~", "`"],
      ["!", "1"],
      ["@", "2"],
      ["#", "3"],
      ["$", "4"],
      ["%", "5"],
      ["^", "6"],
      ["&", "7"],
      ["*", "8"],
      ["(", "9"],
      [")", "0"],
      ["_", "-"],
      ["+", "="],
      "Backspace",
    ],
    [
      "Tab",
      "Q",
      "W",
      "E",
      "R",
      "T",
      "Y",
      "U",
      "I",
      "O",
      "P",
      ["{", "["],
      ["}", "]"],
      ["|", "\\"],
      "",
    ],
    [
      "Caps Lock",
      "A",
      "S",
      "D",
      "F",
      "G",
      "H",
      "J",
      "K",
      "L",
      [":", ";"],
      ['"', "'"],
      "Enter",
    ],
    [
      "Shift",
      "Z",
      "X",
      "C",
      "V",
      "B",
      "N",
      "M",
      ["<", ","],
      [">", "."],
      ["?", "/"],
      "Shift",
    ],
    ["Ctrl", "Win", "Alt", "Space", "Alt", "Ctrl"],
  ];
  const keys2 = [
    ["Print Screen", "Scroll Lock", "Pause Break"],
    ["Insert", "Home", "Page Up"],
    ["Delete", "End", "Page Down"],
    ["", "", ""],
    ["", "arrowUP", ""],
    ["arrowLeft", "arrowDown", "arrowRight"],
  ];
  const keys3 = [
    ["", "", "", ""],
    ["numLock", "/", "*", "-"],
    ["num7", "num8", "num9", "+"],
    ["num4", "num5", "num6", "--"],
    ["num1", "num2", "num3", "--"],
    ["num0", "numDel", "num Enter"],
  ];

  keysFragments.push(keys1);
  keysFragments.push(keys2);
  keysFragments.push(keys3);
  keysFragments.forEach((keys) => {
    keyboardWrapper.appendChild(createKeysKeyboard(keys));
  });
  // Dodaj wywołanie updateSelectedKeys po każdej zmianie selectedKeys
  keyboardWrapper.querySelectorAll(".keyboard-key").forEach((key) => {
    key.addEventListener("click", function (e) {
      let keyvalue;
      if (key.tagName === "KBD") {
        keyvalue = key.parentElement.getAttribute("data-key");
      }
      if (key.tagName === "DIV") {
        keyvalue = key.getAttribute("data-key");
      }
      const index = selectedKeys.indexOf(keyvalue);
      if (index === -1) {
        if (selectedKeys.length < 3) {
          selectedKeys.push(keyvalue);
        } else {
          if (
            confirm(
              "Kombinacja klawiszy nie może zawierać więcej niż 3 klawisze. \nCzy chcesz usunąć wszystkie klawisze i zacząć od nowa?"
            )
          ) {
            selectedKeys = [];
          }
        }
      } else {
        // Jeśli wartość istnieje, usuń ją
        selectedKeys.splice(index, 1);
      }

      const selectedKeysDiv = document.querySelector(".selected-keys-combo");
      if (selectedKeysDiv) {
        updateSelectedKeys(selectedKeysDiv); // Aktualizuj zawartość div po każdej zmianie selectedKeys
      } else {
        console.error("Element .selected-keys-combo not found");
      }
    });
  });

  content.appendChild(selectedKeysCombo(element));
  content.appendChild(keyboardWrapper);
  const button = createButton("Zapisz", ["btn", "primary"], function () {
    element.innerHTML = "";
    selectedKeys.forEach((key) => {
      const kbd = createElement("kbd");
      if (key === "Win") {
        kbd.innerHTML = winIcon;
        kbd.children[0].style = "max-width: 11px;";
      } else {
        kbd.textContent = key;
      }
      kbd.setAttribute("data-key-kbd", key);
      element.appendChild(kbd);
      if (
        selectedKeys.length > 1 &&
        key !== selectedKeys[selectedKeys.length - 1]
      ) {
        const span = createElement("span");
        span.textContent = "+";
        element.appendChild(span);
      }
    });

    keyboardModalWindow.remove();
  });
  content.appendChild(button);
}

function updateSelectedKeys(div) {
  if (!div) {
    console.error("Element div is undefined");
    return;
  }

  // Wyczyść zawartość div
  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }

  // Dodaj nowe elementy na podstawie wartości selectedKeys
  selectedKeys.forEach((key, index) => {
    const keyCombo = createElement("div", ["key-combo", "bigWinKey"]);
    const kbd = createElement("kbd");
    if (key === "Win") {
      kbd.innerHTML = winIcon;
    } else {
      kbd.textContent = key;
    }
    keyCombo.appendChild(kbd);
    div.appendChild(keyCombo);

    if (selectedKeys.length > 1 && index !== selectedKeys.length - 1) {
      const span = createElement("span");
      span.textContent = "+";
      div.appendChild(span);
     
    }
  });
}

function selectedKeysCombo(element) {
  const div = createElement("div", ["selected-keys-combo"]);
  element.appendChild(div);

  // Początkowa aktualizacja
  updateSelectedKeys(div);
  return div;
}
const winIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 87.6"style="max-width: 50px;"><polyline points="0 12.5 35.7 7.6 35.7 42.1 0 42.1"></polyline><polyline points="40 6.9 87.3 0 87.3 41.8 40 41.8"></polyline><polyline points="0 45.74 35.7 45.74 35.7 80.34 0 75.34"></polyline><polyline points="40 46.2 87.3 46.2 87.3 87.6 40 80.9"></polyline></svg>`;

function createKeysKeyboard(keys) {
  let newText;
  const div = createElement("div", ["keyboard"]);
  keys.forEach((row) => {
    const divRow = createElement("div", ["keyboard-row"]);
    row.forEach((key) => {
      if (Array.isArray(key)) {
        const divKey = document.createElement("div");
        divKey.style.fontSize = "14px";
        divKey.classList.add("keyboard-key");
        divKey.setAttribute("data-key", key[1]);
        const kbd = document.createElement("kbd");
        kbd.textContent = key[0];
        const downKey = document.createElement("kbd");
        downKey.textContent = key[1];
        divKey.appendChild(kbd);
        divKey.appendChild(downKey);
        divRow.appendChild(divKey);
        kbd.style.backgroundColor = "transparent";
        kbd.style.border = "none";
        kbd.style.boxShadow = "none";
        downKey.style.backgroundColor = "transparent";
        downKey.style.border = "none";
        downKey.style.boxShadow = "none";

        return;
      }

      const divKey = createElement("div");
      divKey.setAttribute("data-key", key);
      divKey.classList.add("keyboard-key");
      const kbd = createElement("kbd");
      kbd.textContent = key;
      divKey.appendChild(kbd);
      divRow.appendChild(divKey);
      divKey.style = "max-height: 40px;";
      divKey.style.height = "30px";
      kbd.style.backgroundColor = "transparent";
      kbd.style.border = "none";
      kbd.style.boxShadow = "none";
      switch (key) {
        case "Space":
          divKey.style.width = "425px";
          kbd.style.width = "90%";
          kbd.style.color = "transparent";
          break;
        case "":
          divKey.style.width = "20px";
          divKey.innerHTML = "&nbsp;";
          divKey.style.backgroundColor = "transparent";
          divKey.style.border = "none";
          divKey.style.boxShadow = "none";
          break;
        case "--":
          divKey.style.width = "42px";
          divKey.innerHTML = "&nbsp;";
          divKey.style.backgroundColor = "transparent";
          divKey.style.border = "none";
          divKey.style.boxShadow = "none";
          break;
        case "Shift":
          divKey.style.width = "75px";
          divKey.style.fontSize = "14px";
          break;
        case "Caps Lock":
          divKey.style.width = "65px";
          divKey.style.fontSize = "14px";
          break;
        case "Tab":
          divKey.style.width = "50px";
          divKey.style.fontSize = "14px";
          break;
        case "Delete":
        case "End":
        case "Page Down":
        case "Page Up":
        case "Home":
        case "Insert":
        case "Print Screen":
        case "Scroll Lock":
        case "Pause Break":
          divKey.style.width = "35px";
          divKey.style.fontSize = "12px";

          newText = kbd.textContent.split(" ");
          kbd.innerHTML = newText.join("<br>");
          break;
        case "Enter":
          kbd.textContent = "↵ Enter";
          divKey.style.width = "100px";
          kbd.style.width = "90%";
          divKey.setAttribute("data-key", kbd.textContent);
          break;
        case "arrowUP":
          kbd.textContent = "↑";
          divKey.style.width = "35px";
          kbd.style.width = "90%";
          divKey.setAttribute("data-key", kbd.textContent);
          break;
        case "arrowDown":
          kbd.textContent = "↓";
          divKey.style.width = "35px";
          kbd.style.width = "90%";
          divKey.setAttribute("data-key", kbd.textContent);
          break;
        case "arrowLeft":
          kbd.textContent = "←";
          divKey.style.width = "35px";
          kbd.style.width = "90%";
          divKey.setAttribute("data-key", kbd.textContent);
          break;
        case "arrowRight":
          kbd.textContent = "→";
          divKey.style.width = "35px";
          kbd.style.width = "90%";
          divKey.setAttribute("data-key", kbd.textContent);
          break;
        case "Win":
          kbd.innerHTML = winIcon;
          divKey.style.width = "35px";
          kbd.style.width = "90%";
          divKey.setAttribute("data-key", "Win");
          break;
        case "numLock":
        case "numDel":
        case "num1":
        case "num2":
        case "num3":
        case "num4":
        case "num5":
        case "num6":
        case "num7":
        case "num8":
        case "num9":
        case "/":
        case "*":
        case "-":
          divKey.style.height = "30px";
          divKey.style.width = "50px";
          kbd.style.width = "90%";
          divKey.style.fontSize = "12px";

          break;
        case "num Enter":
          divKey.style = "max-height: 100px;";
          divKey.style.fontSize = "12px";
          divKey.style.height = "80px";
          divKey.style.width = "40px";
          kbd.style.width = "90%";
          divKey.style.transform = "translate(0px, -50px)";

          newText = kbd.textContent.split(" ");
          kbd.innerHTML = newText.join("<br>");
          break;
        case "+":
          divKey.style = "max-height: 72px;";
          divKey.style.fontSize = "12px";
          divKey.style.height = "85px";
          divKey.style.width = "40px";
          kbd.style.width = "90%";
          break;
        case "num0":
          divKey.style.fontSize = "12px";
          divKey.style.width = "115px";
          kbd.style.width = "90%";
          break;
        case "Backspace":
          divKey.style.fontSize = "12px";
          kbd.innerHTML = "&larr; Backspace";
          divKey.style.width = "80px";
          kbd.style.width = "90%";
          divKey.setAttribute("data-key", kbd.innerHTML);
          break;
      }
    });
    div.appendChild(divRow);
  });
  return div;
}

function setupIMG_BlurLoad(element) {
  setElementAsDraggable(element);

  element.addEventListener("click", function (e) {
    if (e.ctrlKey) {
      const img = e.target.querySelector("img");

      const modal = createModal("Konfiguracja obrazu", 1, "large");
      const content = modal.querySelector(".modal-content");
      const contentRight = modal.querySelector(".modal-right-container");
      content.style = "padding: 10px;";
      contentRight.style = "padding: 10px;";

      
      const imgPreview = createElement("img");
      imgPreview.src = img.src;
      content.appendChild(imgPreview);

      const divWrapper = createElement("div");
      divWrapper.style = "display: flex;flex-direction: column;flex-wrap: wrap;";
      createURLInput(divWrapper, img, imgPreview, "skompresowanego");

      createURLInput(divWrapper, img, imgPreview, "oryginalnego");

      const label = createElement("label");
      label.textContent = "Opisz obraz:";
      const input = createElement("input");
      input.type = "text";
      input.value = img.alt;
      input.addEventListener("input", function () {
        img.alt = input.value;
        img.title = input.value;
      });
      divWrapper.appendChild(label);
      divWrapper.appendChild(input);




      contentRight.appendChild(divWrapper);
      const button = createButton("Zapisz", ["btn", "primary"], function () {
        img.src = contentRight.querySelector("#skompresowanego").value;
        img.setAttribute("data-big-img", contentRight.querySelector("#oryginalnego").value);
        const Original_img = new Image();
        Original_img.src = contentRight.querySelector("#oryginalnego").value; // Podmień na właściwy URL

        Original_img.onload = function() {
          img.width = Original_img.width;
          img.height = Original_img.height;
          };

          Original_img.onerror = function() {
            console.error('Nie udało się załadować obrazka.');
          };
        modal.remove();
      });
      contentRight.appendChild(button);
    }
  });
}
function createURLInput(divWrapper, img, imgPreview, imgName) {
  const label = createElement("label");
  label.textContent = "Adres URL obrazu "+imgName+":";
  label.setAttribute("for", imgName);
  const input = createElement("input");
  input.id = imgName;
  input.type = "text";
  input.value = img.src;
  input.addEventListener("input", function () {
    if ((input.value.includes("github.com") || input.value.includes("raw.githubusercontent.com")) && input.value.endsWith(".webp")) {
      input.value = input.value.replace(
        "github.com",
        "raw.githubusercontent.com"
      );
      input.value = input.value.replace("/blob/", "/");
    }else{
      input.value = "https://raw.githubusercontent.com/Edu-Koala-V/koala-v-assets-art1/main/bad-img-url-hosting.webp";
    }
    
    imgPreview.src = input.value;
  });
  divWrapper.appendChild(label);
  divWrapper.appendChild(input);
}
//####################################################################################################################
//? Nowa lekcja której nie ma jeszcze w repozytorium GitHub
//####################################################################################################################
setTimeout(() => {
  if(document.querySelector(".article-header") && document.querySelector(".article-header").getAttribute("data-content")==""){
    const form = createElement("form");
    const form2 = createElement("form");
    form.addEventListener("submit", function (e) {e.preventDefault();});
    form2.addEventListener("submit", function (e) {e.preventDefault();});
    const labelToken = createElement("label");
    labelToken.textContent = "Do pobrania danych został wykorzystany token przypisany do twojego konta możesz skorzystać z innego podając go poniżej:";
    labelToken.for="token";
    const inputToken = createElement("input");
    inputToken.id="token";
    inputToken.placeholder="Podaj token do GitHub";
    form.appendChild(labelToken);
    form.appendChild(inputToken);
    
    document.querySelector("main").insertBefore(form,document.querySelector("article"));
    document.querySelector("main").insertBefore(form2,document.querySelector("article"));
    
    sendDataToServer({}, "/get-token").then((data) => {
      const token = data.token;
    setupRepoSource(form,token,form2)
    });
    inputToken.addEventListener("input",function(e){
      setupRepoSource(form,e.target.value,form2);
    });
  

  
  }
}, 10);
function setupRepoSource(form,token,form2){
  form.querySelector("span")?.remove();
  form.querySelector("label[for='repo_list'")?.remove();
  form.querySelector("select")?.remove();
  getGithubData(token).then((data) => {
    console.log(data);
    const span = createElement("span");
    const label = createElement("label");
    label.textContent = "Wybierz w którym repozytorium chcesz zapisać dane z tej lekcji (repozytorium musi mieć w nazwie koala-v-assets-art):";
    label.setAttribute("for","repo_list");
    const select = createElement("select");
    span.textContent = "Token i repozytoria należące do użytkownika: "+data.userName;
    form.appendChild(span);
    form.appendChild(label);
    form.appendChild(select);
    data.repoNameArray.forEach((repo) => {
      console.log(repo);
      if(repo.includes("koala-v-assets-art")){
        const option = createElement("option");
        option.value = repo;
        option.textContent = repo;
        select.appendChild(option);
      }
    });

    const labelFileName = createElement("label");
    labelFileName.textContent = "Podaj nazwę pliku do zapisu:";
    labelFileName.for="fileName";
    const inputFileName = createElement("input");
    inputFileName.id="fileName";
    inputFileName.placeholder="Podaj nazwę pliku do zapisu";
    form2.appendChild(labelFileName);
    form2.appendChild(inputFileName);

    const labelDirLocation = createElement("label");
    labelDirLocation.textContent = "Podaj lokalizację folderu do zapisu:";
    labelDirLocation.for="dirLocation";
    const inputDirLocation = createElement("input");
    inputDirLocation.id="dirLocation";
    inputDirLocation.placeholder="Podaj lokalizację folderu do zapisu";
    form2.appendChild(labelDirLocation);
    form2.appendChild(inputDirLocation);

    const button = createButton("Zapisz", ["btn", "primary"], function () {
     if(inputFileName.value!="" && inputDirLocation.value!=""){
      const userName = data.userName;
      const repoName = select.value;
      let fileName = inputFileName.value;
      if(!fileName.includes(".json")){
        fileName+=".json";
      }
      const dirLocation = inputDirLocation.value;
      const jsonData = `[
      {"type": "h2", "sectionID": "section1", "elementContent": ["Wstęp"]},
      {"type": "span", "sectionID": "section1","elementContent":["Przykładowy tekst wstępu do lekcji",""]},
      {"type": "br", "sectionID": "section1"}
      ]`;




      sendArticleToGithubRepository(jsonData, fileName, dirLocation, userName, repoName, token).then((result) => {
        console.log(result);
        if (result.status === 200) {
          const json_link = userName + "/" + repoName + "/main/" + dirLocation + "/" + fileName;
            document.querySelector(".article-header").setAttribute("data-content",
                json_link
            );
            sendDataToServer({lessonID:document.querySelector(".article-header").getAttribute("data-lesson-id"),lesson_data_link:json_link},"/update-lesson-content-json-link").then((data) => {
                console.log(data);
            });
        }
    });
    }else{
      createNotification("error","Podaj nazwę pliku i lokalizację folderu do zapisu");
    }
  });
  form2.appendChild(button);
  });
}
//####################################################################################################################
// Edu-Koala-V/koala-v-assets-art1/main/windows10/instalacja-windows-10.json

function setupCardBox(element){
  setElementAsDraggable(element);
  element.appendChild(createElement("div",["overlay-card-box"]));
  element.addEventListener("click", function (e) {
    if(e.altKey){
       e.target.parentElement.querySelector("a").click();
    }
    if (e.ctrlKey) {
      const img = e.target.parentElement.querySelector("img");
      const card_link = e.target.parentElement.querySelector("a");
      img.alt = card_link.textContent;
      img.title = card_link.textContent;
      console.log(e.target.parentElement);

      const modal = createModal("Konfiguracja karty", 1, "large");
      const content = modal.querySelector(".modal-content");
      content.style = "padding: 10px;";

      const divWrapper = createElement("div");
      divWrapper.style = "display: flex;flex-direction: column;flex-wrap: wrap;";

      
      const imgPreview = createElement("img");
      imgPreview.src = img.src;
      modal.querySelector(".modal-right-container").appendChild(imgPreview);
      modal.querySelector(".modal-right-container").style = `
      display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    background-color: var(--light-white);
    margin: 20px;
    border: 10px solid;`;

      

      const label = createElement("label");
      label.textContent = "Podpis linku (maksymalnie 9 znaków w tym spacje):";
      const input = createElement("input");
      input.type = "text";
      input.addEventListener("input", function () {
        if (input.value.length > 9) {
          input.value = input.value.slice(0, 9);
        }
      });
      input.value = card_link.textContent;
      const label2 = createElement("label");
      label2.textContent = "Adres URL linku:";
      const input2 = createElement("input");
      input2.type = "text";
      input2.value = card_link.href;

      divWrapper.appendChild(label);
      divWrapper.appendChild(input);
      divWrapper.appendChild(label2);
      divWrapper.appendChild(input2);

      createURLInput(divWrapper, img, imgPreview, card_link.textContent);

setTimeout(() => {
  modal.querySelector("label[for='"+card_link.textContent+"'").textContent = "Obraz docelowo bedzie renderowany w maksymalnie 80px szerokości i 100px wysokości";
}, 10);
      content.appendChild(divWrapper);

      const button = createButton("Zapisz", ["btn", "primary"], function () {
        img.src = imgPreview.src;
        card_link.href = input2.value;
        card_link.textContent = input.value;
        img.alt = input.value;
        img.title = input.value;
        modal.remove();
      });
      button.style = "position: absolute;bottom: 20px;";
      content.appendChild(button);

    }
  });
}


function addNewSection() {
  console.log(document.querySelectorAll("section").length);
  const section = createElement("section");
  section.id = "section" + (document.querySelectorAll("section").length);

  const heading = createElement("h2");
  heading.innerText = "Nagłówek";
  section.appendChild(heading);
  document.querySelector("section#authors").before(section);
  stylizedHeaderElement(heading);

}