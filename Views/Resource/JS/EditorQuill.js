var htmlCode;
const COLORS = [
  "#9933ff", "#e60000", "#ff9900",  "#008a00", "#0066cc", 
  "#c285ff", "#f06666", "#ffc266",  "#66b966", "#66a3e0", 
  "#000000",
];
  
var toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  [{ 'color': COLORS }],
  [{ 'header': [1,2,3,4,5,6,false] }, { 'size': [] }],
  [{ 'list': 'ordered' }, { 'list': 'bullet'}, { 'indent': '-1' }, { 'indent': '+1' }],
  [{ 'font': ['sans-serif','monospace','serif'] }],
  [{ 'align': [] }],
  ['link', 'image', 'video'],
  ['clean'],
];
  
var quill = new Quill('#editor', {
  modules: {
    toolbar: toolbarOptions
  },
  theme: 'snow',
  
});

var title = document.querySelector('#title').value;
var category = document.querySelector('#selectCategory').value;
  
  
document.querySelector("#saveArticle").addEventListener('click', function(){
    sendData();
});


function replaceStyleWithClass() {
  let html = quill.root.innerHTML;
  let newHTML = html.replace(/style="color: rgb\(230, 0, 0\);"/g, 'class="redTextColor"');
  newHTML = newHTML.replace(/style="color: rgb\(0, 138, 0\);"/g, 'class="greenTextColor"');
  newHTML = newHTML.replace(/style="color: rgb\(255, 153, 0\);"/g, 'class="orangeTextColor"');
  newHTML = newHTML.replace(/style="color: rgb\(153, 51, 255\);"/g, 'class="purpleTextColor"');
  newHTML = newHTML.replace(/style="color: rgb\(0, 102, 204\);"/g, 'class="blueTextColor"');

  newHTML = newHTML.replace(/class="ql-indent-1"/g, 'class="textIndent-1"');
  newHTML = newHTML.replace(/class="ql-indent-2"/g, 'class="textIndent-2"');
  newHTML = newHTML.replace(/class="ql-indent-3"/g, 'class="textIndent-3"');
  newHTML = newHTML.replace(/class="ql-indent-4"/g, 'class="textIndent-4"');
  
  return replaceSrcWithFileName(newHTML)
}

function replaceSrcWithFileName(newHTML) {
  let html = newHTML;
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');
  let imgElements = doc.getElementsByTagName('img');
  let newFilesNames = detectImageAndSave(html);
  for (let i = 0; i < imgElements.length; i++) {
    let imgElement = imgElements[i];
    let src = imgElement.getAttribute('src');
    
     console.log(newFilesNames[i]);
    if (src) {
      imgElement.setAttribute('src', newFilesNames[i]);
    }
  }

  let newHTML2 = doc.documentElement.innerHTML;
  return newHTML2;
}





function sendData()
{
  var title = document.querySelector('#title').value;
  var category = document.querySelector('#selectCategory').value;
  var htmlCode = replaceStyleWithClass();
  let contentBlob = quill.getContents();

  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('content', htmlCode);
  formData.append('contentBlob', JSON.stringify(contentBlob));

  fetch('/create-article', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error(error));

}

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

  var title = document.querySelector('#title').value;
  let formData = new FormData();
  formData.append('file', blob);
  formData.append('filename', fileName);
  formData.append('title', title);

  let request = new XMLHttpRequest();
  request.open('POST', '/upload-image');
  request.send(formData);

  return fileName;
}

function detectImageAndSave(htmlCode) {
  var title = document.querySelector('#title').value;

  let parser = new DOMParser();
  let doc = parser.parseFromString(htmlCode, 'text/html');
  let imgElements = doc.getElementsByTagName('img');
  let filesNames = [];
  for (let i = 0; i < imgElements.length; i++) {
    let imgElement = imgElements[i];
    let src = imgElement.getAttribute('src');

    if (src.startsWith('data:image/jpeg;base64,')) {
      let base64Data = src.replace(/^data:image\/jpeg;base64,/, '');
      let fileName = 'image' + Date.now() + '.jpg';
      saveImage(base64Data, title+'/'+fileName);
      filesNames[i] = '../Views/Resource/Images/Articles/'+title+'/'+fileName;
    } else if (src.startsWith('data:image/png;base64,')) {
      let base64Data = src.replace(/^data:image\/png;base64,/, '');
      let fileName = 'image' + Date.now() + '.png';
      saveImage(base64Data, title+'/'+fileName);
      filesNames[i] = '../Views/Resource/Images/Articles/'+title+'/'+fileName;
    } else if (src.startsWith('data:image/gif;base64,')) {
      let base64Data = src.replace(/^data:image\/gif;base64,/, '');
      let fileName = 'image' + Date.now() + '.gif';
      saveImage(base64Data, title+'/'+fileName);
      var title = document.querySelector('#title').value;
      filesNames[i] = '../Views/Resource/Images/Articles/'+title+'/'+fileName;
    }
   
  }
  return filesNames;
}
