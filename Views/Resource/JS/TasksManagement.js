document.querySelector("#createTask").addEventListener("click", function () {
    let nameTask = document.querySelector("#name").value;
    let descriptionTask = document.querySelector("#description").value;
    let taskCategory = document.querySelector("#selCategory").value;
    sendPost("/newTask", nameTask, descriptionTask, taskCategory);
    loadContent("/tasks-List");
  });



function sendPost(how, nameTask, descriptionTask, taskCategory)
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  xhttp.open("POST", how, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("nameTask="+nameTask+"&description="+descriptionTask+"&taskCategory="+taskCategory);
}



document.querySelectorAll('.btn-update').forEach(function(btn) {
    btn.addEventListener('click', function(event) {
      var id = event.target.getAttribute('id');
      sendPost('/updateClass', "classID=" + id);
    });
  });
  
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