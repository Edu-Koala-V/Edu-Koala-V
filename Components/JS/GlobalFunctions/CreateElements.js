/**
 * Tworzy element przycisku HTML <button> z podanymi właściwościami.
 *
 * @param {string} innerHTML - HTML, który ma być zawarty w przycisku.
 * @param {string[]} classes - Tablica klas CSS do dodania do przycisku.
 * @param {Function} [onClick=null] - Opcjonalna funkcja obsługi zdarzenia kliknięcia.
 * @returns {HTMLButtonElement} - Utworzony element przycisku.
 *
 * @example
 * * Tworzy przycisk z tekstem "Kliknij mnie", klasami "btn" i "btn-primary", oraz funkcją obsługi kliknięcia.
 *
 * const button = createButton("Kliknij mnie", ["btn", "btn-primary"], () => alert("Przycisk kliknięty!"));
 * document.body.appendChild(button);
 *
 * * Tworzy przycisk z tekstem "Bez akcji", klasą "btn", bez funkcji obsługi kliknięcia.
 *
 * const button = createButton("Bez akcji", ["btn", "secondary"]);
 * document.body.appendChild(button);
 */
function createButton(innerHTML, classes, onClick = null) {
    const button = document.createElement("button");
    try {
      // Filtruj puste ciągi z tablicy classes
        const validClasses = classes.filter(cls => cls.trim() !== "");
        if (validClasses.length > 0) {
          button.classList.add(...validClasses);
        }
      } catch {}
    button.innerHTML = innerHTML;
    if (onClick) {
      button.addEventListener("click", onClick);
    }
    return button;
  }
  
  /**
   * Tworzy nowy element danego typu i dodaje do niego podane klasy.
   * @param {string} type - Typ elementu do utworzenia (np. "div", "span", "p").
   * @param {Array<string>} classes - Opcjonalna tablica zawierająca nazwy klas do dodania.
   * @returns {HTMLElementType} - Nowo utworzony element.
   *
   * @example
   * const myDiv = createElement("div",["card", "bg-primary"]);
   * document.body.appendChild(myDiv);
   */
  function createElement(type, classes = []) {
    const element = document.createElement(type);
      try {
      // Filtruj puste ciągi z tablicy classes
        const validClasses = classes.filter(cls => cls.trim() !== "");
        if (validClasses.length > 0) {
            element.classList.add(...validClasses);
        }
      } catch {}
    return element;
  }
  /**
   * Tworzy element <img> z podanymi parametrami.
   *
   * @param {string} src - Źródło obrazka.
   * @param {Array<string>} classes - Tablica klas CSS do dodania do elementu.
   * @param {string} alt - Tekst alternatywny dla obrazka.
   * @param {string} title - Tytuł obrazka.
   * @param {number} width - Szerokość obrazka w pikselach.
   * @param {number} height - Wysokość obrazka w pikselach.
   * @param {Function} [onClick=null] - Opcjonalna funkcja obsługi zdarzenia kliknięcia.
   * @returns {HTMLImageElement} - Utworzony element <img>.
   *
   * @example
   * const img = createIMG("path/to/image.jpg", ["thumbnail"], "Podgląd obrazka", "Tytuł obrazka", 300, 300, handleClick);
   * document.body.appendChild(img);
   */
  function createIMG(
    src,
    classes,
    alt,
    title,
    width = 200,
    height = 200,
    onClick = null
  ) {
    const img = document.createElement("img");
    img.src = src;
    try {
      // Filtruj puste ciągi z tablicy classes
        const validClasses = classes.filter(cls => cls.trim() !== "");
        if (validClasses.length > 0) {
            img.classList.add(...validClasses);
        }
      } catch {}
    // img.classList.add(...classes);
    img.alt = alt;
    img.title = title;
    img.width = width;
    img.height = height;
    if (onClick) img.addEventListener("click", onClick);
    return img;
  }
  const headers = ["Name", "Age", "City"];
  const data = [
    ["John Doe", 25, "New York"],
    ["Jane Smith", 30, "Los Angeles"],
    ["Mike Johnson", 35, "Chicago"]
  ];

  function createTable(headers, data, classTable = "") {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    if (classTable !=="") { table.classList.add(classTable); console.log("classTable", classTable); }

    const headerRow = document.createElement("tr");
    headers.forEach((header) => {
      const th = document.createElement("th");
      if(header[0]==="<"){
        th.innerHTML = header;
      }else{
      th.textContent = header;
      }
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    data.forEach((row) => {
      const tr = document.createElement("tr");
      row.forEach((cell) => {
        const td = document.createElement("td");
        if(cell[0]==="<"){
          td.innerHTML = cell;
        }else{
        td.textContent = cell;
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    return table;
  }