


function activeQuizForClass(id) {
      let className = document.querySelector('input[type="checkbox"][data-class="x'+id+'"]:checked:not(:disabled)').name;
      let quizName = document.querySelector("#quiz"+id).innerText 
      console.log(className+quizName)
      sendPostActive('/addQuizColumnToClassTable', className, quizName);

    };

function sendPostActive(how, className, quizName,)
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  xhttp.open("POST", how, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("className=" + className + "&quizName=" + quizName);

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