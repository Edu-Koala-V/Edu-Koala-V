if (!document.querySelector("edit-button")) {
  document.querySelector("#edit-button").remove();
  editButton = createButton("Edytuj zadanie", ["btn", "primary"], (e) => {
    toggleEditTaskMode(e);
  });
  editButton.id = "edit-btn-task";
  editButton.style.display = "none";
  document.body.appendChild(editButton);
  document.querySelectorAll(".task-item").forEach((task) => {
    task.addEventListener("click", (e) => {
      console.log(e.target);
      showEditButtonTask(true);
    });
  });

}
if (!document.querySelector("new-task-btn")) {
  newTaskButton = createButton("Nowe zadanie", ["btn", "primary"], () => {
    const form = createElement("form");
    const form2 = createElement("form");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
    });
    form2.addEventListener("submit", function (e) {
      e.preventDefault();
    });
    const labelToken = createElement("label");
    labelToken.textContent =
      "Do pobrania danych został wykorzystany token przypisany do twojego konta możesz skorzystać z innego podając go poniżej:";
    labelToken.for = "token";
    const inputToken = createElement("input");
    inputToken.id = "token";
    inputToken.placeholder = "Podaj token do GitHub";
    form.appendChild(labelToken);
    form.appendChild(inputToken);

    form.style.width = "60%";
    form2.style.width = "60%";

    document
      .querySelector(".task-description")
      .insertBefore(form, document.querySelector("article"));
    document
      .querySelector(".task-description")
      .insertBefore(form2, document.querySelector("article"));

    const selectTextInfoLabel =
      "Wybierz w którym repozytorium chcesz zapisać dane z tej lekcji (repozytorium musi mieć w nazwie koala-v-assets-task1):";
      let token;
    sendDataToServer({}, "/get-token").then((data) => {
      token = data.token;
      setupRepoSource(
        form,
        token,
        form2,
        selectTextInfoLabel,
        "koala-v-assets-task1"
      );

      inputToken.addEventListener("input", function (e) {
        setupRepoSource(
          form,
          e.target.value,
          form2,
          selectTextInfoLabel,
          "koala-v-assets-task1"
        );
      });
    }).then(() => {
      
        const button = createButton(
          "Zapisz nowe zadanie",
          ["btn", "primary"],
          () => {
            setNewArticleTask(
              form.querySelector('#spanGithubUserName').getAttribute('data-user-name'),
              form.querySelector("select").value,
              token,
              form2.querySelector("input#fileName").value,
              form2.querySelector("input#dirLocation").value
            );
          }
        );

    button.style.margin = "auto";
    button.style.display = "block";
        form2.parentElement.insertBefore(button, form2.nextSibling);
      
    });
  });
    newTaskButton.id = "new-task-btn";
    const taskList = document.querySelector(".tasks-items");
    taskList.appendChild(newTaskButton);
  
  taskList.querySelector("ul").style.height = "90%";
}

function setNewArticleTask(userName, repoName, token, fileName, dirLocation) {
  fileName = convertStringURL(fileName);
  dirLocation = convertStringURL(dirLocation);
  if (fileName != "" && dirLocation != "") {
    if (!fileName.includes(".json")) {
      fileName += ".json";
    }
    const jsonData = `[
    {"type": "h2", "sectionID": "section1", "elementContent": ["Nazwa zadania"]},
    {"type": "span", "sectionID": "section1","elementContent":["Przykładowy tekst wstępu do lekcji",""]},
    {"type": "br", "sectionID": "section1"}
    ]`;

    sendArticleToGithubRepository(
      jsonData,
      fileName,
      dirLocation,
      userName,
      repoName,
      token
    ).then((result) => {
      console.log(result);
      if (result.status === 200) {
        const json_link =
          userName + "/" + repoName + "/main/" + dirLocation + "/" + fileName;
          if(createNewTask(taskID, json_link)){
            saveTask();
      }
      }
    });
  } else {
    createNotification(
      "error",
      "Podaj nazwę pliku i lokalizację folderu do zapisu"
    );
  }
}
function showEditButtonTask(isShowEditButtonTask) {
  if (isShowEditButtonTask) {
    document.querySelector("#edit-btn-task").style.display = "block";
  document.querySelector("#new-task-btn").style.display = "none";
  }else{
    document.querySelector("#edit-btn-task").style.display = "none";
    document.querySelector("#new-task-btn").style.display = "block";
  }
  
}



function createNewTask(taskID, json_link) {
  document.querySelectorAll(".task-description form").forEach((form) => {
    form.remove();
  });
  document.querySelector(".task-description button").remove();
  const articleHTML = document.querySelector("article");

  articleHTML.innerHTML = `<section id="section1"><h2>Nazwa zadania</h2></section>`;
  const taskUL = document.querySelector(".tasks-items").querySelector("ul");

  const newTask = document.createElement("li");
  newTask.setAttribute("data-task-id", taskID);
  newTask.setAttribute("role", "listitem");
  newTask.setAttribute("aria-label", "task-item");
  newTask.innerHTML =
    `<div class="icon-task "></div><button class="btn task-item" data-link-task="` +
    json_link +
    `">Nazwa zadania</button>`;
    taskLink=json_link;
  taskUL.appendChild(newTask);
  activeSelectTaskItem(taskID);
  return true;
}

let taskID = null;
let taskLink = null;

function saveTask() {
  sendDataToServer(
    {
      taskName: document.querySelector("article h2").textContent,
      taskLink: taskLink,
    },
    "/saveTaskData",
    "POST"
  );
  saveLesson();
  showEditButtonTask(true);
}
function updateTask() {
  sendDataToServer(
    {
      taskID: taskID,
      taskName: document.querySelector("article h2").textContent,
    },
    "/updateTaksData",
    "POST"
  );
  saveLesson();
  showEditButtonTask(true);
}

function toggleEditTaskMode(e) {
  if (e.target.textContent === "Edytuj zadanie") {
    const tasksLi = document
      .querySelector(".tasks-items")
      .querySelectorAll("li");
    tasksLi.forEach((task) => {
      if (task.classList.contains("active")) {
        taskID = task.getAttribute("data-task-id");
        taskLink = task.querySelector("button").getAttribute("data-link-task");
      } else {
        task.style.display = "none";
      }
    });
    replacingNestedTextTags();
    e.target.textContent = "Zapisz zmiany";
    e.target.classList.remove("btn-primary");
    e.target.classList.add("btn-img");
    document.querySelector("article").style.backgroundColor = "dimgray";
    document.querySelector("main").style.paddingRight = "85px";
    editLesson();
    setupToolsBox();
    showEditButtonTask(true) 
  } else {
    if (
      !confirm(
        "Czy chcesz zapisać aktualne zmiany? Cały dokument zostanie przetworzony a jego historia zmian zostanie usunięta."
      )
    ) {
      return;
    }
    updateTask();
    e.target.textContent = "Edytuj zadanie";
    e.target.classList.remove("btn-img");
    e.target.classList.add("btn-primary");
    document.querySelector("main").removeAttribute("style");
    document.querySelector("article").removeAttribute("style");
    showEditButtonTask(false);
    window.location.reload();
  }
}
