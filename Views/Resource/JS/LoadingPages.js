let fileLocation = "/App/Views/Dashboards/";

document.querySelector("#lessons").addEventListener("click", function () {
  loadContent("/articles-List");
});
document.querySelector("#tasks").addEventListener("click", function () {
  loadContent("/articles-List");
});
document.querySelector("#tests").addEventListener("click", function () {
  loadContent("/articles-List");
});
document
  .querySelector("#resourceToDownload")
  .addEventListener("click", function () {
    loadContent(fileLocation + "ResourceToDownload.php");
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
