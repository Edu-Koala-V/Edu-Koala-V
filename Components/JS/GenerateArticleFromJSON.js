/**
 * Funkcja odpowiedzialna za wygenerowanie zawartości artykułu.
 * @param {Array} contentData - Dane obiektu JSON zawierające informacje o artykułach.
 */
function setupContentArticle(contentData) {
  const articleContainer = document.querySelector("article");
  articleContainer.innerHTML = "";
  const sectionsElements = groupedBySection(contentData);
  const authorsSection = document.querySelector("section#authors");
  sectionsElements.forEach((section) => {
    const sectionElement = document.createElement("section");

    sectionElement.id = section[0].sectionID ;
   
    section.forEach((article,index) => {
      let articleElement;
      articleElement = checkTypeArticleElement(article);
      sectionElement.appendChild(articleElement);

        if( index+1 != section.length && article.type === "list" && section[index+1].type !== "br"){
          sectionElement.appendChild(createElement("br"));
        }
    });
    articleContainer.appendChild(sectionElement);
    loadingImgStyle();
  });

  // Usunięcie authorsSection z bieżącej lokalizacji i dodanie na koniec articleContainer
  if (authorsSection) {
    authorsSection.parentNode.removeChild(authorsSection);
    articleContainer.appendChild(authorsSection);
  }
}

/**
 * Grupuje elementy tablicy obiektu JSON według sectionID.
 *
 * @param {JSONArray} contentArray - Tablica obiektu JSON zawierająca elementy do pogrupowania.
 * @returns {JSONArray} - Tablica tablic, gdzie każda tablica zawiera elementy o tym samym sectionID.
 */
function groupedBySection(contentArray) {
  const sections = {};

  // Iteracja przez każdy element i grupowanie według sectionID
  contentArray.forEach((item) => {
    if (!sections[item.sectionID]) {
      sections[item.sectionID] = [];
    }
    sections[item.sectionID].push(item);
  });

  // Przekształcenie obiektu sekcji w tablicę tablic
  const result = Object.keys(sections).map((key) => sections[key]);

  return result;
}

/**
 * Funkcja `checkTypeArticleElement` sprawdza typ elementu artykułu i na jego podstawie tworzy odpowiedni element HTML.
 * 
 * @param {Object} article - Obiekt reprezentujący element artykułu, który zawiera typ i treść elementu.
 * @param {string} article.type - Typ elementu artykułu (np. "h1", "p", "img").
 * @param {Array} article.elementContent - Tablica zawierająca treść elementu artykułu.
 * 
 * @returns {HTMLElement} - Zwraca utworzony element HTML na podstawie typu elementu artykułu.
 * 
 * Funkcja obsługuje następujące typy elementów artykułu:
 * - "bi": Tworzy element zagnieżdżony z tagami <b> i <i>.
 * - "h1", "h2", "h3", "h4", "h5", "h6", "p", "b", "i", "u", "s", "span": Tworzy element HTML o odpowiednim tagu.
 * - "text-block-name": Wywołuje funkcję `textBlockName` do utworzenia elementu.
 * - "key-combo": Wywołuje funkcję `keysCombo` do utworzenia elementu.
 * - "list": Wywołuje funkcję `listArticleElement` do utworzenia elementu listy.
 * - "link-art": Wywołuje funkcję `linkArt` do utworzenia elementu linku artykułu.
 * - "link": Wywołuje funkcję `webLinkElement` do utworzenia elementu linku.
 * - "source": Wywołuje funkcję `sourceArtReferences` do utworzenia elementu źródła.
 * - "br": Tworzy element <br>.
 * - "table": Wywołuje funkcję `createTableFromArt` do utworzenia tabeli.
 * - "img": Wywołuje funkcję `createImgElement` do utworzenia elementu obrazka.
 * - "card-box": Wywołuje funkcję `createCardBox` do utworzenia elementu karty.
 * 
 * Jeśli typ elementu nie jest obsługiwany, funkcja tworzy element <span> z klasą "error-article-element" 
 * i wyświetla komunikat o braku obsługi dla danego typu elementu.
 */
function checkTypeArticleElement(article) {
  if (!article.type) {
    console.log("Brak typu elementu w obiekcie JSON: ", article);
  }
  switch (article.type) {
    case "bi":
      return createArticleElement(
        ["b", "i"],
        [article.elementContent[1]],
        article.elementContent[0]
      );
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
    case "p":
    case "b":
    case "i":
    case "u":
    case "s":
    case "span":
      if(article.type === "p"){article.type="span";}
      return createArticleElement(
        [article.type],
        [article.elementContent[1]],
        article.elementContent[0]
      );
    case "text-block-name":
      return textBlockName(article);
    case "key-combo":
      return keysCombo(article);
    case "list":
      return listArticleElement(article);
    case "link-art":
      return linkArt(article);
    case "link":
      return webLinkElement(article);
    case "source":
      return sourceArtReferences(article);
    case "br":
      return document.createElement("br");
    case "table":
      return createTableFromArt(article);
    case "img":
      return createImgElement(article);
    case "card-box":
      return createCardBox(article);
    case "ref-btn-for-img":
      return refBtnForImg(article);
    default:
      const articleElement = createElement("span", ["error-article-element"]);
      articleElement.innerHTML = "Brak obsługi dla elementu " + article.type + " o treści: " + article.elementContent[0];
      return articleElement;
  }
}


/**
 * Tworzy element artykułu na podstawie podanych typów, klas i zawartości.
 *
 * @param {Array} types - Tablica typów elementów.
 * @param {Array} classes - Tablica klas elementów.
 * @param {string} elementContent - Zawartość elementu.
 * @returns {HTMLElement} - Utworzony element artykułu.
 * @throws {TypeError} - Jeśli types lub classes nie są tablicami.
 */
function createArticleElement(types, classes, elementContent) {
  if (!Array.isArray(types) || !Array.isArray(classes)) {
    throw new TypeError("Both types and classes must be arrays");
  }

  let articleElement = null;
  let currentElement = null;

  types.forEach((type, index) => {
    if (classes === undefined) {
      classes = [];
    }

    const element = createElement(type, classes);
    if (index === 0) {
      articleElement = element;
    } else {
      currentElement.appendChild(element);
    }
    currentElement = element;
  });
  currentElement.innerHTML = elementContent;
  return articleElement;
}

/**
 * Tworzy element div z określonymi klasami i tekstem, a następnie dodaje do niego zdarzenie kliknięcia, 
 * które zaznacza cały tekst wewnątrz tego elementu.
 *
 * @param {Object} article - Obiekt JSON zawierający dane artykułu.
 * @param {Array} article.elementContent - Tablica zawierająca tekst i dodatkową klasę CSS.
 * @param {string} article.elementContent[0] - Tekst, który ma być wyświetlony w elemencie div.
 * @param {string} article.elementContent[1] - Dodatkowa klasa CSS, która ma być dodana do elementu div.
 * @returns {HTMLElement} - Utworzony element div z dodanym tekstem i zdarzeniem kliknięcia.
 */
function textBlockName(article) {
    const divTextBlockName = createElement("div", ["text-block-name", article.elementContent[1]]);

  divTextBlockName.textContent = article.elementContent[0];

  divTextBlockName.addEventListener("click", () => {
    // Zaznacz cały tekst wewnątrz diva
    if(!divTextBlockName.getAttribute("contenteditable")){
      const range = document.createRange();
      range.selectNodeContents(divTextBlockName);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
  return divTextBlockName;
}

/**
 * Funkcja `keysCombo` generuje element HTML reprezentujący kombinację klawiszy.
 *
 * @param {Object} article - Obiekt JSON artykułu.
 * @returns {HTMLElement} - Element HTML reprezentujący kombinację klawiszy.
 */
function keysCombo(article) {
  const divKeysCombo = createElement("div", ["keys-combo"]);
  article.elementContent.forEach((key, index) => {
    const kbd = createElement("kbd");
    if (key === "Windows" || key === "Win") {
    kbd.setAttribute("data-key-kbd", "Win");
      kbd.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 87.6" style="width: 11px;"><polyline points="0 12.5 35.7 7.6 35.7 42.1 0 42.1"></polyline><polyline points="40 6.9 87.3 0 87.3 41.8 40 41.8"></polyline><polyline points="0 45.74 35.7 45.74 35.7 80.34 0 75.34"></polyline><polyline points="40 46.2 87.3 46.2 87.3 87.6 40 80.9"></polyline></svg>';
    } else {
      kbd.textContent = key;
    kbd.setAttribute("data-key-kbd", key);

    }
    divKeysCombo.appendChild(kbd);
    if(index < article.elementContent.length-1){
      const span = createElement("span");
      span.textContent = "+";
      divKeysCombo.appendChild(span);
    }
  });
  return divKeysCombo;
}

function refBtnForImg(article) {
  const refBtnForImg = createElement("div", ["ref-btn-for-img"]);
  const mark=createElement("mark");
  mark.textContent=article.elementContent[0];
  refBtnForImg.appendChild(mark);
  return refBtnForImg;
}

/**
 * Funkcja tworząca element listy artykułu na podstawie danych z obiektu JSON.
 * @param {Object} article - Obiekt JSON artykułu zawierający dane do utworzenia elementu listy.
 * @returns {HTMLElement} - Utworzony element listy.
 */
function listArticleElement(article) {
  const list = createElement(article.elementContent.ver);
  article.elementContent.listElements.forEach((li) => {
    const liElement = createElement("li");
    let liContent = createElement("span", ["li-content"]);
    if(Array.isArray(li)){
      li.forEach((element) => {
        if (element.type) {
          liContent.appendChild(checkTypeArticleElement(element));
        } else {
          liContent.innerHTML += element;
        }
      });
      
    } else {
      liContent.innerHTML = li;
    }
    // console.log(liContent);
    liElement.appendChild(liContent)
    list.appendChild(liElement);
  });
  return list;
}

/**
 * Funkcja tworząca element przejścia do artykułu będący linkiem.
 * @param {Object} article - Obiekt artykułu.
 * @returns {HTMLAnchorElement} - Element <a> reprezentujący link do artykułu.
 */
function linkArt(article) {
  const a = createElement("a", ["link-art"]);
  a.href =
    location.origin +
    "/courses/" +
    convertStringURL(article.elementContent[1]) +
    "/" +
    convertStringURL(article.elementContent[0]);
  a.textContent = article.elementContent[0];
  a.title =
    'Przejdź do artykułu: "' +
    article.elementContent[0] +
    '" w kursie: "' +
    article.elementContent[1] +
    '"';
  return a;
}

/**
 * Tworzy tabelę na podstawie artykułu.
 *
 * @param {Object} article - Artykuł zawierający dane do utworzenia tabeli.
 * @returns {HTMLElement} - Zwraca element HTML reprezentujący utworzoną tabelę.
 */
function createTableFromArt(article) {
  const headers = article.elementContent[0];
  headers.forEach((header, index) => {
    if (header.type) {
      headers[index] = checkTypeArticleElement(header).outerHTML;
    }
  });

  const data = article.elementContent
    .slice(1)
    .map((row) => row.map((cell) => {
      if (cell.type) {
        return checkTypeArticleElement(cell).outerHTML;
      }else if(Array.isArray(cell)){
        return cell.map((element) => {
          if (element.type) {
            return checkTypeArticleElement(element).outerHTML;
          } else {
            return element;
          }
        }).join("");
      }
      return cell;
    }));
    if (window.innerWidth < 768) {
      const scrolledContainer = document.createElement("div");
      scrolledContainer.style.overflowX = "auto";
      scrolledContainer.appendChild(createTable(headers, data));
      return scrolledContainer;
    }
  return createTable(headers, data);
}

/**
 * Tworzy element obrazka na podstawie danych artykułu.
 * @param {Object} article - Obiekt artykułu zawierający dane elementu obrazka.
 * @returns {HTMLElement} - Zwraca element div zawierający obrazek z funkcją leniwego ładowania.
 */
function createImgElement(article) {
  const githubLink = "https://raw.githubusercontent.com/";
  const img = createIMG(
    githubLink + article.elementContent[0],
    ["article-img"],
    article.elementContent[1],
    article.elementContent[1],
    article.elementContent[2],
    article.elementContent[3]
  );
  img.setAttribute("loading", "lazy");
  if (article.elementContent.length > 4)
    img.setAttribute("data-big-img", githubLink + article.elementContent[4]);

  img.type = "image/webp";
  img.tabIndex = 0;

  const div = createElement("div", ["blur-load"]);
  div.appendChild(createElement("div", ["loader"]));
  div.appendChild(img);
  return div;
}

/**
 * Tworzy element linku internetowego otwierającego się w nowej karcie przeglądarki.
 *
 * @param {Object} article - Obiekt artykułu.
 * @returns {HTMLAnchorElement} - Element linku internetowego.
 */
function webLinkElement(article) {
  const a = createElement("a");
  a.classList.add("web-link");
  a.href = article.elementContent[0];
  let url = new URL(article.elementContent[0]);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.title = "Otwórz w nowej karcie";
  a.textContent = url.hostname;
  return a;
}
/**
 * Tworzy element "card-box" w którym jest obraz i poniżej link.
 * @param {Object} article - Obiekt reprezentujący artykuł.
 * @returns {HTMLElement} - Zwraca element "div" reprezentujący "card-box".
 */
function createCardBox(article) {
    const githubLink = "https://raw.githubusercontent.com/";
    const div = createElement("div", ["card-box"]);
    const img = createIMG(
      githubLink + article.elementContent[1],
      [],
      article.elementContent[0],
      article.elementContent[0]
    );
    img.classList.add("skip-set-draggable");
    const a = createElement("a");
    a.textContent = article.elementContent[0];
    a.href= article.elementContent[2];
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.title = "Otwórz w nowej karcie";
    a.classList.add("skip-set-draggable");
    div.appendChild(img);
    div.appendChild(a);
    return div;
}


//##########################################################################################################################################################################
//   FIXING      FIXING      FIXING      FIXING      FIXING      FIXING      FIXING      FIXING      FIXING      FIXING      FIXING      FIXING      FIXING      FIXING   //
//##########################################################################################################################################################################
setTimeout(function () {
  fixTableRows();
  fixTableTH();

}, 1000);
/**
 * Naprawia wiersze tabeli, dostosowując colspan i wyrównanie tekstu ostatniej komórki w każdym wierszu.
 * Czyli w przypadku mniejszej ilości komórek niż w nagłówków dodaje colspan do ostatniej komórki wiersza łącząc ją z resztą komórek.
 */
function fixTableRows() {
  document.querySelectorAll("table").forEach((table) => {
    const columnCount = table.querySelectorAll("th").length;
    table.querySelectorAll("tr").forEach((row, index) => {
      if (index === 0) {
        return;
      }
      const td = row.querySelectorAll("td");
      const rowCount = td.length;
      if (rowCount < columnCount) {
        if (td) {
          td[rowCount - 1].setAttribute("colspan", columnCount - rowCount + 1);
          td[rowCount - 1].style.textAlign = "center";
        }
      }
    });
  });
}
/**
 * Naprawia tabelę, dostosowując colspan ostatniej komórki w nagłówku.
 */
function fixTableTH() {
  document.querySelectorAll("table").forEach((table) => {
    const columnCount = table.querySelectorAll("tr")[1].querySelectorAll("td").length;
    const th = table.querySelectorAll("tr")[0].querySelectorAll("th");
    th[th.length-1].setAttribute("colspan",columnCount-th.length+1);
  });
}