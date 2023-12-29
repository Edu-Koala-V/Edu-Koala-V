document.querySelector("#createClass").addEventListener("click", function () {
    let data = "className=" + document.querySelector("#className").value;
    sendPost("/newClass", data);
    loadContent("/get-classes");
  });


document.querySelectorAll('.btn-delete').forEach(function(btn) {
  btn.addEventListener('click', function(event) {
    var id = event.target.getAttribute('id');
    sendPost('/removeClass', "classID="+id);
  });
});

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
function sendPost(how, data)
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  xhttp.open("POST", how, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(data);
}