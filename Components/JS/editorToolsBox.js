function setupToolsBox() {
  const toolsBox = createElement("div", ["toolsBox"]);
  toolsBox.appendChild(createElement("h2")).innerText = "Narzędzia";
  const inputDraggable = createElement("input", ["inputDraggable"]);
  inputDraggable.type = "checkbox";
  inputDraggable.checked = true;
  inputDraggable.id = "inputDraggable";
  inputDraggable.addEventListener("change", () =>
    switchingDraggableEditableAllElements(inputDraggable.checked)
  );
  toolsBox.appendChild(inputDraggable);
  toolsBox.appendChild(createElement("label")).innerText = "Przeciąganie";
  const toolsBoxItems = createElement("div", ["toolsBoxItems"]);
  toolsBox.appendChild(toolsBoxItems);
  document.body.appendChild(toolsBox);
  const tools = [
    { title: "textBlok", name: "TEXT BLOCK", action: "item_createSpanWrapper" },
    { title: "text-block-name", name: "T-B-N", action: "item_textBlockName" },
    { title: "table", name: "TABLE", action: "item_createTable" },
    { title: "list", name: "LIST", action: "item_createList" },
    { title: "image", name: "IMG", action: "item_createImage" },
    { title: "web-link", name: "WEB LINK", action: "item_createWebLink" },
    { title: "link-art", name: "LINK ART", action: "item_createLinkArt" },
    { title: "br", name: "BR", action: "item_createBreakLine" },
    { title: "heading", name: "H", action: "item_createHeading" },
    { title: "key-combo", name: "KEY COMBO", action: "item_createKeyCombo" },
    { title: "card-box", name: "CARD BOX", action: "item_createCardBox" },
  ];
  tools.forEach((tool) => createToolItem(tool.title, tool.name, tool.action));

  setDraggableElements(document.querySelectorAll(".toolsBox"));
  toolsBox.classList.add("dragDelete");
}
function switchingDraggableEditableAllElements(isDraggable) {
  const draggableElements = document.querySelectorAll(".dragSwitch");
  const filteredElements = Array.from(draggableElements).filter(
    (element) => !element.classList.contains("tool-item")
  );
  if (isDraggable) {
    filteredElements.forEach((element) => {
      element.removeAttribute("contenteditable");
      element.classList.remove("editable");
      setElementAsDraggable(element);
    });
  } else {
    filteredElements.forEach((element) => {
      element.setAttribute("contenteditable", true);
      element.classList.add("editable");
      unsetElementAsDraggable(element);
      element.classList.remove("display-block");
    });
  }
}
function createToolItem(title, name, action) {
  const toolItem = createElement("div", ["tool-item"]);
  toolItem.innerText = name;
  toolItem.title = title;

  toolItem.addEventListener("click", handleMouseClickDown);
  toolItem.setAttribute("data-action", action);
  document.querySelector(".toolsBoxItems").appendChild(toolItem);
}

function handleMouseClickDown(event) {
  switchingDraggableEditableAllElements(true);
  const toolItem = event.target;
  const clone = toolItem.cloneNode(true);
  setElementAsDraggable(clone);

  clone.style.position = "absolute";
  clone.style.pointerEvents = "none";
  document.body.appendChild(clone);

  function handleMouseMove(e) {
    clone.style.left = `${e.pageX}px`;
    clone.style.top = `${e.pageY}px`;
  }

  function handleMouseUp(e) {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.removeChild(clone);

    const section = document
      .elementFromPoint(e.clientX, e.clientY)
      .closest("section");
    if (section) {
      const action = toolItem.getAttribute("data-action");
      if (typeof window[action] === "function") {
        window[action](section, e.clientY);
        const sections = document.querySelectorAll('section[id^="section"]');
        const filteredSections = Array.from(sections).filter((section) =>
          /\d+$/.test(section.id)
        );
        setDraggableElements(filteredSections);
      } else {
        console.error(`Action ${action} is not a function`);
      }
    }
  }

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", handleMouseUp);
}
function insertCreatedElementAfter(container, element, y) {
  const afterElement = getDragAfterElement(container, y);
  if (afterElement == null) {
    container.appendChild(element);
  } else {
    container.insertBefore(element, afterElement);
  }
}

function item_createSpanWrapper(section, y) {
  const spanWrapper = createElement("span", ["wrapper-span"]);
  const span = createElement("span");
  span.innerText = "Tekst";
  spanWrapper.appendChild(span);
  stylizedTextElement(span);

  setElementAsDraggable(spanWrapper);
  toggleEditableDraggable(spanWrapper);

  insertCreatedElementAfter(section, spanWrapper, y);
}

function item_textBlockName(section, y) {
  const article = {
    type: "text-block-name",
    sectionID: "section4",
    elementContent: ["list disk", ""],
  };
  const element = textBlockName(article);
  setupTextBlockName(element);
  insertCreatedElementAfter(section, element, y);
}
function item_createTable(section, y) {
  const article = {
    type: "table",
    sectionID: "section1",
    elementContent: [["Nazwa kolumny"], ["Wartość"]],
  };
  const element = createTableFromArt(article);
  setupTable(element);

  insertCreatedElementAfter(section, element, y);
}
function item_createList(section, y) {
  const article = {
    type: "list",
    sectionID: "section2",
    elementContent: {
      ver: "ol",
      listElements: [
        [
          {
            type: "bi",
            sectionID: "section2",
            elementContent: ["Text: ", ""],
          },

          {
            type: "span",
            sectionID: "section2",
            elementContent: ["Text", ""],
          },
        ],
      ],
    },
  };
  const element = listArticleElement(article);
  setupList(element);

  insertCreatedElementAfter(section, element, y);
}
function item_createImage(section, y) {
    const article = {
        "type": "img",
        "sectionID": "section5",
        "elementContent": [
            "Edu-Koala-V/koala-v-assets-art1/main/zagrozenia-w-informatyce/malware.webp",
            "Malware - złośliwe oprogramowanie (wirus komputerowy).",
            "647",
            "652",
            "Edu-Koala-V/koala-v-assets-art1/main/zagrozenia-w-informatyce/malware_ORIGINAL.webp"
        ]
    };
    const element = createImgElement(article);
    setupIMG_BlurLoad(element);
    loaded(element);

    insertCreatedElementAfter(section, element, y);
}
function item_createWebLink(section, y) {
    const article = {
        "type": "link",
        "sectionID": "section2",
        "elementContent": [
            "https://github.com/"
        ]
    };
    const element = webLinkElement(article);
    setupWebLink(element)
    
    insertCreatedElementAfter(section, element, y);
}
function item_createLinkArt(section, y) {
    const article = {
        "type": "link-art",
        "sectionID": "section6",
        "elementContent": [
            "Wirusy nie rezydentne",
            "Zagrożenia w Informatyce"
        ]
    }
    const element = linkArt(article);
    setupArtLink(element);;
    
    insertCreatedElementAfter(section, element, y);
}
function item_createBreakLine(section, y) {
  const br = createElement("br");
  setElementAsDraggable(br);

  insertCreatedElementAfter(section, br, y);
}
function item_createHeading(section, y) {
  const heading = createElement("h3");
  heading.innerText = "Nagłówek";

  insertCreatedElementAfter(section, heading, y);
  stylizedHeaderElement(heading);

}
function item_createKeyCombo(section, y) {
  const article = {
    type: "key-combo",
    sectionID: "section4",
    elementContent: ["Shift"],
  };
  const element = keysCombo(article);
  setupKeysCombo(element);

  insertCreatedElementAfter(section, element, y);
}
function item_createCardBox(section, y) {
  const article = {
    type: "card-box",
    sectionID: "section1",
    elementContent: [
      "Ubuntu ",
      "Edu-Koala-V/koala-v-assets-art1/main/typy-rozszerzenia-plikow/linux/Ubuntu_logo.webp",
      "https://ubuntu.com/download",
    ],
  };
  const element = createCardBox(article);
  setupCardBox(element);

  insertCreatedElementAfter(section, element, y);
}
