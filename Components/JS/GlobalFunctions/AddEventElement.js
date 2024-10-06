/**
 * Nadawanie event listenera dla pierwszego pasującego elementów
 *
 * Chwyta pierwszy element po id lub klasie i dodaje do niego event listenera o danym typie do wywołania funkcji oraz zwraca ten element
 * @param {string} anchor (#)Id lub (.)klasa elementu do którego ma być dodany event listener
 * @param {string} eventType Typ eventu do dodania do elementu (click, mouseover, itp.)
 * @param {function} eventFunction Funkcja do wywołania kiedy event jest wywołany na elemencie
 * @returns {Element} Element do którego został dodany event listener lub null jeśli element o podanym id lub klasie nie istnieje
 *
 * @example
 * * Przykład 1
 * const element1 = addEventElement("#idElementu", "click", function(){console.log("test");});
 *
 * * Przykład 2
 * const element2 = addEventElement(".klasaElementu", "click", () => funkcja(parametr1, parametr2));
 *
 * * Przykład 3
 * const element3 = addEventElement("#idElementu", "click", () => {console.log("test");});
 *
 * * Przykład 4
 * const element4 = addEventElement(".klasaElementu", "mouseover", () => alert("Mouse over event"));
 *
 * * Przykład 5
 * const element5 = addEventElement("#idElementu", "dblclick", () => {console.log("Double click event");});
 */
function addEventElement(anchor, eventType, eventFunction) {
  var anchorElement = document.querySelector(anchor);
  if (anchorElement === null) {
    return null;
  }
  anchorElement.addEventListener(eventType, eventFunction);
  return anchorElement;
}

/**
 * Nadawanie event listenera dla wielu elementów \
 * \
 * Chwyta wszystkie elementy po id lub klasie i dodaje do nich event listenera o danym typie do wywołania funkcji oraz zwraca te elementy w tablicy
 * @param {string} anchor (#)Id lub (.)klasa elementów do których ma być dodany event listener
 * @param {string} eventType Typ eventu do dodania do elementów (click, mouseover, itp.)
 * @param {function} eventFunction Funkcja do wywołania kiedy event jest wywołany na elementach
 * @returns {Element[]} Tablica elementów do których został dodany event listener lub null jeśli elementy o podanym id lub klasie nie istnieją
 *
 * @example
 *
 * * Przykład 0
 * const arrayElements = [] = addEventElements("#idElementu", "click", function(){console.log("test");});
 *
 * * Przykład 1
 * const arrayElements = [] = addEventElements(".klasaElementu", "click", function(){console.log("test");});
 *
 * * Przykład 2
 * const elements1 = [] = addEventElements(".klasaElementu", "click", () => funkcja(parametr1, parametr2));
 *
 * * Przykład 3
 * const elements2 = [] = addEventElements(".klasaElementu", "click", () => {console.log("test");});
 *
 * * Przykład 4
 * const elements3 = [] = addEventElements(".klasaElementu", "mouseover", () => alert("Mouse over event"));
 *
 * * Przykład 5
 * const elements4 = [] = addEventElements(".klasaElementu", "dblclick", () => {console.log("Double click event");});
 */
function addEventElements(anchor, eventType, eventFunction) {
  var anchorElements = document.querySelectorAll(anchor);
  if (anchorElements.length === 0) {
    return null;
  }
  anchorElements.forEach(function (element) {
    element.addEventListener(eventType, eventFunction);
  });
  return anchorElements;
}
