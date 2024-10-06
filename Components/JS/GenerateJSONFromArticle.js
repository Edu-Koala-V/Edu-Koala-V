// {"type": "h2", "sectionID": "section1", "elementContent": ["Wymagania minimalne windows 10"]},

// {"type": "span", "sectionID": "section1","elementContent":["Poniżej przedstawiono minimalne wymagania do instalacji Windows 10. Pełna specyfikacja na stronie producenta: ",""]},
//  {"type": "link","sectionID":"section1","elementContent":["https://www.microsoft.com/pl-pl/windows/windows-10-specifications"]},

// {"type": "table", "sectionID": "section1","elementContent":
//   [
//     ["Nazwa podzespołu","Wymagania dla wersji 32-bitowej","Wymagania dla wersji 64-bitowej"],
//     ["Procesor CPU","1GHz lub lepszy"],
//     ["Pamięć RAM","1GB","2GB"],
//     ["Rozmiar dysku twardego","16GB","32GB"],
//     ["Karta graficzna","Zgodna z DirectX 9"]
//   ]
// },
// const getArticleAsJSON = generateJSONFromArticle();
// setupContentArticle(JSON.parse(getArticleAsJSON));

function generateJSONFromArticle() {
  // const articleJSON = {
  //   type: "tag",
  //   sectionID: "",
  //   elementContent: [],
  //   classes: ""
  // };

  const articleJSON = [];

  const article = document.querySelector("article");
  const sections = article.querySelectorAll('section[id^="section"]');
  const filteredSections = Array.from(sections).filter((section) =>
    /\d+$/.test(section.id)
  );

  filteredSections.forEach((section) => {
    const sectionID = section.id;
    const elements = section.querySelectorAll("*");
    let skipListElement = 0;

    elements.forEach((element, index) => {
      if (index < elements.length - skipListElement) {
        index += skipListElement;
        if (
          elements[index].tagName === "OL" ||
          elements[index].tagName === "UL"
        ) {
          elements[index].querySelectorAll("li").forEach((li) => {
            skipListElement += li.querySelectorAll("*").length+1;
          });
        }
        if (elements[index].tagName === "TABLE") {
          elements[index].querySelectorAll("tr").forEach((tr) => {
            skipListElement += tr.querySelectorAll("*").length;
          });
        }
        if (elements[index].tagName === "DIV") {
          if (elements[index].classList.contains("keys-combo")) {
            skipListElement += elements[index].querySelectorAll("*").length;
          }
        }

        const findElementType = setupDataElementByType(
          elements[index],
          sectionID
        );
        if (findElementType) {
          articleJSON.push(findElementType);
        }
      }
    });
  });
  console.log(articleJSON);
  return JSON.stringify(articleJSON);
}

function setupDataElementByType(element, sectionID) {
  let elementJSON = {
    type: "",
    sectionID: sectionID,
    elementContent: [],
  };
  let data = [];
  switch (element.tagName.toLowerCase()) {
    case "div":
      if (element.classList.contains("keys-combo")) {
        data=convertKeysComboToJSON(element);
        
      }else if(element.classList.contains("ref-btn-for-img")){
        data = convertRefBtnForImgToJSON(element);
        
      }else if(element.classList.contains("text-block-name")){
        data = convertTextBlockNameToJSON(element);
        
      }else if(element.classList.contains("blur-load")){
        data = convertIMGElementToJSON(element);

      }else{
        elementJSON = false;
      }
      elementJSON.type = data[0];
      elementJSON.elementContent = data[1];
      break;
    case "a":
      if (element.classList.contains("web-link")) {
        data = convertWebLinkElementToJSON(element);
        elementJSON.type = data[0];
        elementJSON.elementContent = data[1];
      } else if (element.classList.contains("link-art")) {
        data = convertLinkArtElementToJSON(element);
        elementJSON.type = data[0];
        elementJSON.elementContent = data[1];
      }else{
        elementJSON = false;
      }
      break;
    case "ol":
    case "ul":
      data = convertListElementToJSON(element, sectionID);
      elementJSON.type = data[0];
      elementJSON.elementContent = data[1];
      break;
    case "table":
      data = convertTableElementToJSON(element, sectionID);
      elementJSON.type = data[0];
      elementJSON.elementContent = data[1];
      break;
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6":
      data = convertTagElementToJSON(element);
      elementJSON.type = data[0];
      elementJSON.elementContent = data[1];
      break;
    case "b":
    case "i":
    case "u":
    case "s":
    case "bi":
    case "bu":
    case "bs":
    case "iu":
    case "is":
    case "us":
    case "span":
      if (
        element.classList.contains("wrapper-span") ||
        element.classList.contains("li-content")
      ) {
        elementJSON = false;
      }
      data = convertTagElementToJSON(element);
      elementJSON.type = data[0];
      elementJSON.elementContent = data[1];
      break;
    case "br":
      elementJSON = { type: "br", sectionID: sectionID };
      break;
    default:
      elementJSON = false;
      break;
  }
  if (elementJSON != false) {
    element.remove();
  }
  return elementJSON;
}
function convertTagElementToJSON(element) {
  const data = [];
  data.push(element.tagName.toLowerCase());
  data.push([
    element.textContent,
    element.getAttribute("class") != undefined
      ? element.getAttribute("class")
      : "",
  ]);
  return data;
}
function convertListElementToJSON(element, sectionID) {
  const data = [];

  element.querySelectorAll("li").forEach((li) => {
    const liContent = li.querySelectorAll("*");
    const liData = [];
    liContent.forEach((liElement) => {
      if (liElement.classList.contains("li-content")) {
        if (liElement.querySelectorAll("*").length > 0) {
          return;
        }
      }

      let findElementType = setupDataElementByType(liElement, sectionID);
      if (findElementType) {
        liData.push(findElementType);
      } else {
        const span = document.createElement("span");
        span.appendChild(liElement);
        findElementType = setupDataElementByType(span, sectionID);
        liData.push(findElementType);
      }
    });
    data.push(liData);
  });
  let ver = "";
  if(element.classList.contains("ordered-list")){
    ver = "ol";
  }else if(element.classList.contains("unordered-list")){
    ver = "ul";
  }

  const JSONData = { ver: ver, listElements: data };
  return ["list", JSONData];
}











function convertTableElementToJSON(element, sectionID) {
  const tableData = [];
  const tableRows = element.querySelectorAll("tr");

  tableRows.forEach((row) => {
    const rowData = [];
    const rowCells = row.querySelectorAll("th,td");

    rowCells.forEach((cell) => {
      let elTextContent = "";

      if (cell.children.length == 0) {
        elTextContent = cell.textContent;
      } else {
        const cellElement = cell.children[0];
        if (cellElement.children.length == 0) {
          elTextContent = cellElement.textContent;
        }
      }

      if (elTextContent !== "") {
        const span = document.createElement("span");
        span.textContent = elTextContent;
        cell.innerHTML = span.outerHTML;
      }

      if (cell.children[0] && cell.children[0].children.length == 0) {
        cell.children[0].classList.remove("wrapper-span");
        if(cell.children[0].textContent === "") {
        return;
        }
        const findElementType = setupDataElementByType(cell.children[0], sectionID);
        rowData.push(findElementType);
      } else if(cell.children[0]){
        const childNodes = cell.children[0].childNodes;
        const childTable = [];
        console.log("childNodes: ", childNodes);
        
        // Opakuj luźny tekst w span
        const nodesArray = Array.from(childNodes); // Konwertuj NodeList na tablicę, aby uniknąć problemów z modyfikacją listy podczas iteracji
        console.log(nodesArray)
        nodesArray.forEach(node => {
          if(node.classList.contains("wrapper-span")){return;}
          console.log("node: ", node);
          let newNode = null;
          if (node.nodeType === Node.ELEMENT_NODE) {
            newNode = node;
          } else if (node.nodeType === Node.TEXT_NODE) {
            if (node.textContent !== "") {
              const span = document.createElement('span');
              span.textContent = node.textContent;
              node.parentNode.replaceChild(span, node);
              newNode = span;
            }
          }
          console.log("newNode: ", newNode);
          if (newNode) {
            childTable.push(setupDataElementByType(newNode, sectionID));
          }
        });
          rowData.push(childTable);

      }
    });
    element.remove();
    tableData.push(rowData);
  });

  return ["table", tableData];
}

function convertWebLinkElementToJSON(element) {
  return ["link", [element.getAttribute("href")]];
}
function convertLinkArtElementToJSON(element) {
  const title = element.getAttribute("title");
  let tablica = [];

  // Wyrażenie regularne do znalezienia wartości w cudzysłowach
  const regex = /"([^"]*)"/g;
  let match;

  while ((match = regex.exec(title)) !== null) {
    tablica.push(match[1]);
  }

  return ["link-art", tablica];
}

function convertKeysComboToJSON(element) {
  const keys = element.querySelectorAll("kbd");
  const keysArray = [];
 keys.forEach((key) => {
  keysArray.push(key.getAttribute("data-key-kbd"));
 });
  return ["key-combo",keysArray];
}
function convertRefBtnForImgToJSON(element){
  const mark = element.querySelector("mark");
  return ["ref-btn-for-img",[mark.textContent]];
}
function convertTextBlockNameToJSON(element){
  return ["text-block-name",[element.textContent,""]];
}
function convertIMGElementToJSON(element){
  const img = element.querySelector("img");
  const imgData = [];
  imgData.push(img.getAttribute("src").replace("https://raw.githubusercontent.com/", ""));
  imgData.push(img.getAttribute("alt"));
  imgData.push(img.getAttribute("width"));
  imgData.push(img.getAttribute("height"));
  imgData.push(img.getAttribute("data-big-img").replace("https://raw.githubusercontent.com/", ""));
  return ["img",imgData];
}

// {
//   "type": "img",
//   "sectionID": "section4",
//   "elementContent": [
//       "Edu-Koala-V/koala-v-assets-art1/main/windows10/uruchomienie-diskpart.webp",
//       "Uruchomienie diskpart.",
//       "944",
//       "707",
//       "Edu-Koala-V/koala-v-assets-art1/main/windows10/uruchomienie-diskpart_ORIGINAL.webp"
//   ]
// }