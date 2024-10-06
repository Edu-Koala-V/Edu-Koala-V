const DragAndDropData = [];

function addElementToDragAndDropData(
  sectionID,
  type,
  elementContent,
  dragElementID
) {
  const newElement = {
    sectionID: sectionID,
    type: type,
    elementContent: elementContent,
    dragElementID: dragElementID,
  };
  elementsData.push(newElement);
}

function unsetElementAsDraggable(element) {
  if (element === null) return;
  element.removeAttribute("draggable");
  element.classList.remove("draggable");
}
function setElementAsDraggable(element) {
  if (element === null) return;
  element.setAttribute("draggable", "true");
  element.classList.add("draggable", "dragSwitch");
}

function setDraggableElements(containersDragOver = []) {
    const dragElements = document.querySelectorAll(".draggable");
    const filteredElements = Array.from(dragElements).filter(element => !element.classList.contains("skip-set-draggable"));
    
  
    filteredElements.forEach((element) => {
    element.addEventListener("dragstart", (event) => {
      event.target.classList.add("dragging");
      event.dataTransfer.setData("text/plain", event.target.id);
    });
    element.addEventListener("dragend", (event) => {
      event.target.classList.remove("dragging");
    });
  });
  containersDragOver.forEach((container) => {
    container.addEventListener("dragover", (event) => {
      event.preventDefault();
      const afterElement = getDragAfterElement(container, event.clientY);
      const draggable = document.querySelector(".dragging");

      if (container.classList.contains("dragDelete")) {
        container.addEventListener("dragover", (event) => {
          event.preventDefault();
          container.style.backgroundColor = "red";
        });
        container.addEventListener("drop", (event) => {
          event.preventDefault();
          document.querySelector(".dragging").remove();
          container.removeAttribute("style");
        });
      } else {
        if (afterElement === null) {
          container.appendChild(draggable);
        } else {
          try {
            container.insertBefore(draggable, afterElement);
          } catch (error) {
            // console.error(error);
          }
        }
      }
      container.addEventListener("dragleave", () => {
        container.removeAttribute("style");
      });
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".draggable:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}
