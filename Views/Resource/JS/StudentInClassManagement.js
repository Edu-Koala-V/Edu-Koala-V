
document.querySelector("#createStudent").addEventListener("click", function(){
let name = document.querySelector("#name").value;
let surname = document.querySelector("#surname").value;
let nr = document.querySelector("#nr").value;
var url = new URL(window.location.href);
let classID = url.searchParams.get('classID');
let className = url.searchParams.get('className');
sendPost("/Rejestracja", name, surname, nr, classID, className);
});



function sendPost(how, name, surname, nr, classID, className)
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  xhttp.open("POST", how, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("name=" + name + "&surname=" + surname + "&nr=" + nr + "&classID=" + classID + "&className="+className);
}

function subPoint(className)
{
  sendPostPoint(-1,className)
}
function addPoint(className)
{
  sendPostPoint(1,className)
}

function sendPostPoint(point, className)
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  xhttp.open("POST", "/change-point", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("point=" + point+"&className=" + className);
}