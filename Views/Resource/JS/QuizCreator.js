let counter = 1;
document.querySelector("#addQuestBlock").addEventListener("click", function(){
    counter++;
    var QuizContainer = document.querySelector('#QuizContainer');
    var newDiv = document.createElement('div');
    newDiv.className = 'questionBlock';

    newDiv.innerHTML = `
        <div class="form-group">
            <label for="question`+counter+`">Pytanie nr.: `+counter+`</label>
            <input type="text" class="form-control" id="question`+counter+`" name="question`+counter+`" placeholder="Podaj Pytanie">

            <label for="answerA`+counter+`">Odpowiedź A</label>
            <input type="text" class="form-control" id="answerA`+counter+`" name="answerA`+counter+`" placeholder="Podaj odpowiedź A">

            <label for="answerB`+counter+`">Odpowiedź B</label>
            <input type="text" class="form-control" id="answerB`+counter+`" name="answerB`+counter+`" placeholder="Podaj odpowiedź B">

            <label for="answerC`+counter+`">Odpowiedź C</label>
            <input type="text" class="form-control" id="answerC`+counter+`" name="answerC`+counter+`" placeholder="Podaj odpowiedź C">

            <label for="answerD`+counter+`">Odpowiedź D</label>
            <input type="text" class="form-control" id="answerD`+counter+`" name="answerD`+counter+`" placeholder="Podaj odpowiedź D">

            <label for="answer`+counter+`">Prawidłowa odpowiedź to:</label>
            <input list="answer`+counter+`" name="answer`+counter+`" id="selectAnswer`+counter+`"/>
                <datalist id="answer`+counter+`" />
                    <option value="A" />
                    <option value="B" />
                    <option value="C" />
                    <option value="D" />
                </datalist>
        </div>
        `;
    QuizContainer.appendChild(newDiv);
});


document.querySelector("#saveQuiz").addEventListener("click", function (){
    let quizArray = [];
    for(let i=1; i<=counter;i++)
    {
        let quest = [];
        quest.push(document.querySelector("#question"+i).value);
        quest.push(document.querySelector("#answerA"+i).value);
        quest.push(document.querySelector("#answerB"+i).value);
        quest.push(document.querySelector("#answerC"+i).value);
        quest.push(document.querySelector("#answerD"+i).value);
        quest.push(document.querySelector("#selectAnswer"+i).value);
        quizArray.push(quest);
    }
    // console.log(tittleQuiz, categoryQuiz);
    // console.log(quizArray);
    sendQuizData(quizArray)
});

function sendQuizData(array) {
    const titleQuiz = document.querySelector("#title").value;
    const categoryQuiz = document.querySelector("#selectCategory").value;
    const quizArray = array;
    
    var data = {titleQuiz: titleQuiz, categoryQuiz: categoryQuiz, quizArray: quizArray};
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/create-quiz");
    xhr.onreadystatechange = function() { if (xhr.readyState === 4 && xhr.status === 200) { console.log(xhr.responseText); } }
    xhr.setRequestHeader("Content-type", "application/json") // or "text/plain"
    xhr.send(JSON.stringify(data)); 
}



