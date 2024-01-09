
let count = document.querySelectorAll('.questionBlock').length;
console.log(count);
document.querySelector(".btn-update").addEventListener("click", alertQuiz);

function alertQuiz(){
  let text = "Czy aby na pewno chcesz zakończyć test?";
  if (confirm(text) == true) {
    radioButtons.forEach(function(radioButton) {
      radioButton.disabled = true;
    });
    sendAnswers();
    
  } 
}

let radioButtons = document.querySelectorAll('input[type="radio"]');
let answers = [];



radioButtons.forEach(function(radioButton) {
  radioButton.addEventListener('click', function() {
    let name = radioButton.name;
    let id = name.replace("answer","");
    let answer = {
      questID: id,
      value: radioButton.value
    };
    let index = answers.findIndex(x => x.questID === answer.questID);
    if (index === -1) {
      answers.push(answer);
    } else {
      answers[index].value = answer.value;
    }

  });
});

let goodAnswers = {};
function sendAnswers()
{
  let xhr = new XMLHttpRequest();
  let url = "/checkQuizAnswer";
  let params = "answers=" + JSON.stringify(answers);

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let response = JSON.parse(xhr.responseText);
      
      response.forEach(function(item) {
        if(item.questID==="0")
        {
          setPoints();
        }
        goodAnswers[item.questID] = item.goodAnswer;
      });
      
      setCheckAnswers();
    }
  };
  xhr.send(params);
}
let points = 0;
function setCheckAnswers()
{
  
  answers.forEach(answers => {
      if(goodAnswers[answers.questID] !== answers.value)
      {
        document.querySelector('label[for="answer'+answers.value+answers.questID + '"]').classList.add("bad")
      }
    else if(goodAnswers[answers.questID] === answers.value)
      {
        document.querySelector('label[for="answer'+answers.value+answers.questID + '"]').classList.add("good");
        points++;
      }
  });
  setPoints();
}

function setPoints()
{
  document.querySelector(".btn-update").removeEventListener('click', alertQuiz);
  document.querySelector(".btn-update").innerHTML = points + "/" + count;
  document.querySelector(".btn-update").style='height: 120px;font-size: 64px;font-family: cursive;cursor: default;background-color: #5d5b59;'
}

