function toggleMenu() {
  document.querySelector("nav").classList.toggle("show-sidebar");
}

function closeMenu() {
  document.querySelector("nav").classList.remove("show-sidebar");
}
const buttons = document.querySelectorAll('nav button');
buttons.forEach(button => {
  button.addEventListener('click', closeMenu);
});

var lessonContent = document.querySelector("main");
lessonContent.addEventListener("click", function () {
  closeMenu();
});

var menuBtn = document.getElementsByClassName("burger")[0];

menuBtn.addEventListener("click", function () {
  toggleMenu();
});

document.querySelector("#LOGOUT").addEventListener("click", function(){
  document.cookie.split(';').forEach(function(cookie) {
    document.cookie = cookie.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
});
window.location.replace("/");

});
var avatarIMG;

document.getElementById("user-avatar-change").addEventListener("click", function() {
  var input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function(event) {
      avatarIMG = event.target.result;
      document.getElementById("user-avatar").src = avatarIMG;
      detectImageAndSave(document.getElementById("user-avatar"));
    };
    reader.readAsDataURL(file);
  };
  input.click();
});







function saveImage(base64Data, fileName) {
  let contentType = '';
  let byteCharacters = atob(base64Data);

  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
    contentType = 'image/jpeg';
  } else if (fileName.endsWith('.png')) {
    contentType = 'image/png';
  } else if (fileName.endsWith('.gif')) {
    contentType = 'image/gif';
  }

  let byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  let byteArray = new Uint8Array(byteNumbers);
  let blob = new Blob([byteArray], {type: contentType});

 
  let formData = new FormData();
  formData.append('file', blob);
  formData.append('filename', fileName);
  formData.append('username', username);
  formData.append('type','avatar');

  let request = new XMLHttpRequest();
  request.open('POST', '/upload-image');
  request.send(formData);
  console.log(fileName);
  sendPostAvatar("/upload-image-avatar", fileName)
  return fileName;
}

function detectImageAndSave() {
  let test = document.getElementById("user-avatar");
let parser = new DOMParser();
let doc = parser.parseFromString(test.outerHTML, 'text/html');
let imgElements = doc.getElementsByTagName('img');
  
  let filesNames = [];
  for (let i = 0; i < imgElements.length; i++) {
    let imgElement = imgElements[i];
    let src = imgElement.getAttribute('src');

    if (src.startsWith('data:image/jpeg;base64,')) {
      let base64Data = src.replace(/^data:image\/jpeg;base64,/, '');
      let fileName = 'image' + Date.now() + '.jpg';
      saveImage(base64Data, username+'/'+fileName);
      filesNames[i] = '../Views/Resource/Images/Users/'+username+'/'+fileName;
    } else if (src.startsWith('data:image/png;base64,')) {
      let base64Data = src.replace(/^data:image\/png;base64,/, '');
      let fileName = 'image' + Date.now() + '.png';
      saveImage(base64Data, username+'/'+fileName);
      filesNames[i] = '../Views/Resource/Images/Users/'+username+'/'+fileName;
    } else if (src.startsWith('data:image/gif;base64,')) {
      let base64Data = src.replace(/^data:image\/gif;base64,/, '');
      let fileName = 'image' + Date.now() + '.gif';
      saveImage(base64Data, username+'/'+fileName);
      filesNames[i] = '../Views/Resource/Images/Users/'+username+'/'+fileName;
    }
   
  }
  return filesNames;
}

function sendPostAvatar(how, fileName)
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  xhttp.open("POST", how, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.send("fileName=" + fileName);
}