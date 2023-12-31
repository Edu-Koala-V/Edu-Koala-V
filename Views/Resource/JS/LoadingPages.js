let fileLocation = "/App/Views/Dashboards/";

document.querySelector("#lessons").addEventListener("click", function () {
  loadContent("/articles-List");
});
document.querySelector("#tasks").addEventListener("click", function () {
  loadContentWithScript("/tasks-List","Views/Resource/JS/TasksManagement.js");
});
document.querySelector("#tests").addEventListener("click", function () {
  loadContent("/quizzes-list","Views/Resource/JS/QuizzesManagements.js");
});
document.querySelector("#classes").addEventListener("click", function () {
  loadContentWithScript("/get-classes","Views/Resource/JS/ClassManagements.js");
});

function loadScript(url) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  document.head.appendChild(script);
}




function loadContent(how) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.querySelector("main").innerHTML = this.responseText;
    }
  };

  xhttp.open("GET", how, true);
  xhttp.send();
}

function loadContentWithScript(how,srcScript) {
  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.querySelector("main").innerHTML = this.responseText;
      loadScript(srcScript);
    }
  };

  xhttp.open("GET", how, true);
  xhttp.send();
}



document
  .querySelector("#resourceToDownload")
  .addEventListener("click", function () {
    loadContent(fileLocation + "ResourceToDownload.php");
  });


  var names;
 function activeLessonForClasses(lesson){

    var checkboxes = document.querySelectorAll('[data-class="'+lesson+'"]:checked');
    names = '';
    for (var i = 0; i < checkboxes.length; i++) {
      names +='_'+checkboxes[i].name;
      
    }
    sendPost('/addClassToLesson', names, lesson)
 }

 function sendPost(how, names, lesson)
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    }
  };
  xhttp.open("POST", how, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("classesNames=" + names + "&lessonID=" + lesson);
}