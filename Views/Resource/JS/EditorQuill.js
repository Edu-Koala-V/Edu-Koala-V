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
  
  
  
  
  function modifyDelta(delta) {
    var ops = delta.ops;
    let customClasses = "defaultTextColor";
    for (var i = 0; i < ops.length; i++) {
      var op = ops[i];
      if (op.attributes) {
        var format = quill.getFormat({ index: i, length: 1 });
        if (format.list) {
          customClasses += ' list';
        }
        switch(op.attributes.color)
        {
          case "#e60000": customClasses = 'redTextColor';
          break;  
          case "#ff9900": customClasses = 'orangeTextColor';
          break;  
          case "#008a00": customClasses = 'greenTextColor';
          break;  
          case "#0066cc": customClasses = 'blueTextColor';
          break;  
          case "#9933ff": customClasses = 'purpleTextColor';
          break; 
          default:customClasses ='defaultTextColor';
          break;
        }
  
        
        if(op.attributes.bold)
        {
          customClasses+=" boldText";
        }
        if(op.attributes.underline)
        {
          customClasses+=" underlineText";
        }
        if(op.attributes.strike)
        {
          customClasses+=" strikeText";
        }
        if(op.attributes.italic)
        {
          customClasses+=" italicText";
        }
        
  
        op.attributes.class=customClasses;
        op.attributes.color='';
        delete op.attributes.color;
        delete op.attributes.bold;
      }
    }
    return delta;
  
  }
  
  var html;
  
  function test(){
    var delta = quill.getContents()
  
  var goodDelta = modifyDelta(delta);
   html = goodDelta.ops;
  
  console.log(html);
  
  }
  
  function test2(){
    var div = document.createElement('div');
  for (var i = 0; i < html.length-1; i++) {
    if(html[i].insert === "\n"  && i!=0)
    {
      try
      {
        html[i].attributes.header
      }catch{
        var br = document.createElement('br');
      div.appendChild(br);
      }
      
    }
  
  
    if (html[i].attributes) {
     
      if (html[i+1].attributes && html[i+1].attributes.header) {
        if (html[i].attributes.class) {
          var span = document.createElement('span');
      span.innerHTML = html[i].insert;
          span.className = html[i].attributes.class;
          div.appendChild(span);
        }
        div.innerHTML = '<h' + html[i+1].attributes.header + '>' + div.innerHTML + '</h' + html[i+1].attributes.header + '>';
      }
      else  if (html[i].attributes.class) {
        var span = document.createElement('span');
    span.innerHTML = html[i].insert;
        span.className = html[i].attributes.class;
        div.appendChild(span);
      }
    }
    
  }
  
 htmlCode = div.innerHTML;
  
  console.log(htmlCode);
  
  }
  
  

  var title = document.querySelector('#title').value;
  var category = document.querySelector('#selectCategory').value;
  
  
  document.querySelector("#saveArticle").addEventListener('click', function(){
    sendData();
  });
  
function sendData()
{
  var title = document.querySelector('#title').value;
  var category = document.querySelector('#selectCategory').value;
  console.log(title +category);
  test();
  test2();
  const formData = new FormData();
  formData.append('title', title);
  formData.append('category', category);
  formData.append('content', htmlCode);

  fetch('/create-article', {
    method: 'POST',
    body: formData
  })
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error(error));

}