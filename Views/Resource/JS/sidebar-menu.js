function toggleMenu() {
  document.querySelector("nav").classList.toggle("show-sidebar");
}

function closeMenu() {
  document.querySelector("nav").classList.remove("show-sidebar");
}

var lessonContent = document.querySelector("main");
lessonContent.addEventListener("click", function () {
  closeMenu();
});

var menuBtn = document.getElementsByClassName("burger")[0];

menuBtn.addEventListener("click", function () {
  toggleMenu();
});
