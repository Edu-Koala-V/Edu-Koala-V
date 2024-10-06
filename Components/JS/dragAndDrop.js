const allowedDraggableElements = [
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "b",
  "i",
  "u",
  "s",
  "span",
  "text-block-name",
  "keys-combo",
  "ul",
  "ol",
  "link-art",
  "br",
  "table",
  "blur-load"//"img",
];
function setDragElements(elements, isEditable = true) {
  elements.forEach((element) => {
    allowedDraggableElements.forEach((allowedElement) => {
        if (element.tagName.toLowerCase() === allowedElement || element.classList.contains(allowedElement)) {
            if (isEditable) {
                element.addEventListener("mouseenter",function(event){
                    element.style.cursor = "move";
                    element.contentEditable = false;
                });
                element.addEventListener("dblclick",function(event){
                  element.style.cursor = "text";
                  element.contentEditable = true;
                });
                
            }
            element.classList.add("draggable");
            element.setAttribute("draggable",true);
                element.addEventListener("dragstart",function(event){
                  if(event.target.classList.contains("draggable")){
                    event.target.classList.add("dragging");
                  }
                });
                element.addEventListener("dragend",function(event){
                    event.target.classList.remove("dragging");
                });
        }
        });
  });
}




function setDragContainers(containers) {
  containers.forEach((container) => {
    container.addEventListener("dragover", function (event) {
      event.preventDefault();
      const afterElementInfo = getDragAfterElement(container, event.clientY, event.clientX);
      const draggable = document.querySelector(".dragging");
      console.log(draggable);
      if (!draggable || draggable.classList.contains("item-tools")) {
        return;
    }
      if (afterElementInfo.element == null) {
        container.appendChild(draggable);
      } else {
        if (afterElementInfo.isAfter) {
          // Jeśli kursor jest po prawej stronie środka elementu, wstawiamy przeciągany element po znalezionym elemencie
          afterElementInfo.element.parentNode.insertBefore(draggable, afterElementInfo.element.nextSibling);
        } else {
          // Jeśli kursor jest po lewej stronie środka elementu, wstawiamy przeciągany element przed znalezionym elementem
          afterElementInfo.element.parentNode.insertBefore(draggable, afterElementInfo.element);
        }
      }
    });
  });
}

function getDragAfterElement(container, y, x) {
  const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offsetX = x - box.left - box.width / 2; // Poziomy offset od środka elementu
    const offsetY = y - box.top - box.height / 2; // Pionowy offset od środka elementu

    // Oddzielne obliczanie odległości dla przemieszczania w pionie i poziomie
    const distanceX = Math.abs(offsetX);
    const distanceY = Math.abs(offsetY);

    // Warunki dla umieszczania elementu w zależności od kierunku przemieszczania
    const isAfterX = offsetX > 0;
    const isAfterY = offsetY > 0;

    // Wybór elementu na podstawie odległości i kierunku przemieszczania
    if (closest.distanceX + closest.distanceY > distanceX + distanceY) {
      return { distanceX: distanceX, distanceY: distanceY, element: child, isAfterX: isAfterX, isAfterY: isAfterY };
    } else {
      return closest;
    }
  }, { distanceX: Infinity, distanceY: Infinity, element: null, isAfterX: false, isAfterY: false });
}


function createElementFromTool(event, container) {
  const objectID = event.dataTransfer.getData("text/plain");
  const type = event.dataTransfer.getData("type");
  console.log(objectID);
  console.log(type);
  const element = document.createElement(itemToolElements[type]);
  element.id = objectID;
  createElementInContainer(type, container);
}

function createElementInContainer(type, container) {
  let isDraggable = true;
  let element;
  switch (type) {
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
      element = document.createElement(type);
      
      break;
    case "text-block-name":
      element = document.createElement(type);
      element.textContent = "Nazwa bloku tekstu";
      element.classList.add("text-block-name");
      break;
    case "key-combo":
        keysComboSelect(container);
      isDraggable=false;
      break
    case "list":
      listElementType(container);
      isDraggable=false;
      break;
    case "ul":
    case "ol":
      element = document.createElement(type);
      element.appendChild(document.createElement("li"));
      break;
    
    case "link-art":
      linkArticleModal(container);
    case "br":
    case "table":
    case "img":
      element = document.createElement(type);
      break;
    default:
      console.log("Nieznany typ elementu");
      return;
  }
  if(isDraggable){
    setDragElements([element]);
  container.appendChild(element);
  }
  
}

function listElementType(container){
  createModal(headerText="Wybierz typ listy",2,size = "small")
  const modalBackBlur = document.querySelector(".back-blur");
  const modalDiv = document.querySelector(".modal-content");
  const ulDiv = document.createElement("div");
  const olDiv = document.createElement("div");
  const ul = document.createElement("ul");
  const ol = document.createElement("ol");
  const listElements = ["Element 1","Element 2","Element 3"];
  listElements.forEach(item=>{
    const li = document.createElement("li");
    li.textContent = item;
    ul.appendChild(li);
    ol.appendChild(li.cloneNode(true));
  });
  const ulButton = document.createElement("button");
  const olButton = document.createElement("button");
  ulButton.textContent = "Lista nienumerowana";
  olButton.textContent = "Lista numerowana";
  ulButton.addEventListener("click",function(){
    createElementInContainer("ul",container);
    modalBackBlur.remove();
  });
  olButton.addEventListener("click",function(){
    createElementInContainer("ol",container);
    modalBackBlur.remove();
  });
  ulDiv.appendChild(ul);
  olDiv.appendChild(ol);
  ulDiv.appendChild(ulButton);
  olDiv.appendChild(olButton);
  modalDiv.appendChild(ulDiv);
  modalDiv.appendChild(olDiv);
}

function keysComboSelect(container){
  createModal(headerText="Wybierz kombinację klawiszy",2,size = "medium");
  const modalBackBlur = document.querySelector(".back-blur");
  const modalDiv = document.querySelector(".modal-content");
  const keysCombo = document.createElement("div");
  keysCombo.appendChild(createKeyboard());
  modalDiv.appendChild(keysCombo);
  const divSelectedKeys = document.createElement("div");
  divSelectedKeys.classList.add("selected-keys");
  const button = document.createElement("button");
  button.textContent = "Dodaj";
  modalDiv.appendChild(divSelectedKeys);
  modalDiv.appendChild(button);
  button.addEventListener("click",function(){
    const keysCombo = document.querySelector(".selected-keys").children[0].cloneNode(true);
    setDragElements([keysCombo]);
    container.appendChild(keysCombo);
    modalBackBlur.remove();
  });

}
let selectedKeys = [];
function createKeyboard(){
  const keyboard = document.createElement("div");
  keyboard.classList.add("keyboard");
  const keys = [
    ["Esc","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12"],
    [["~","`"],["!","1"],["@","2"],["#","3"],["$","4"],["%","5"],["^","6"],["&","7"],["*","8"],["(","9"],[")","0"],["_","-"],["+","="],"Backspace"],
    ["Tab","Q","W","E","R","T","Y","U","I","O","P",["{","["],["}","]"],["/","\\"]],
    ["Caps","A","S","D","F","G","H","J","K","L",[":",";"],['"',"'"],"Enter"],
    ["Shift","Z","X","C","V","B","N","M",["<",","],[">","."],["?","/"],"Shift"],
    ["Ctrl","Windows","Alt","Space","Alt","Fn","Ctrl"]
  ];
  keys.forEach(row=>{
    selectedKeys=[];
    const rowDiv = document.createElement("div");
    rowDiv.classList.add("keyboard-row");
    row.forEach(key=>{
      const keyDiv = document.createElement("div");
      keyDiv.classList.add("keyboard-key");
      keyDiv.setAttribute("data-key",key);
      if(key === "Space"){
        keyDiv.classList.add("keyboard-space");
      }
      else if(key === "Windows"){
        keyDiv.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87.3 87.6" style="width: 11px;"><polyline points="0 12.5 35.7 7.6 35.7 42.1 0 42.1"></polyline><polyline points="40 6.9 87.3 0 87.3 41.8 40 41.8"></polyline><polyline points="0 45.74 35.7 45.74 35.7 80.34 0 75.34"></polyline><polyline points="40 46.2 87.3 46.2 87.3 87.6 40 80.9"></polyline></svg>';
      }
      else if(key  instanceof Array){
        key.forEach(subKey=>{
          const subKeySpan = document.createElement("span");
          subKeySpan.textContent = subKey;
          keyDiv.appendChild(subKeySpan);
        });
      }
      else{
        keyDiv.textContent = key;
      }
      rowDiv.appendChild(keyDiv);
      keyDiv.addEventListener("click",function(){
        keyDiv.classList.toggle("selected");
        if(keyDiv.classList.contains("selected")){
          selectedKeys.push(keyDiv.getAttribute("data-key"));
        }
        else{
          selectedKeys = selectedKeys.filter(item=>item!==keyDiv.getAttribute("data-key"));
        }
        console.log(selectedKeys);
        const selectedKeysDiv = document.querySelector(".selected-keys");
        selectedKeysDiv.innerHTML = "";
        article = {elementContent : selectedKeys};
        console.log(article);
          selectedKeysDiv.appendChild( keysCombo(article));


      });
    });
    keyboard.appendChild(rowDiv);
  });
  return keyboard;
}
function linkArticleModal(container){
  //TODO: Create modal for selecting article
}