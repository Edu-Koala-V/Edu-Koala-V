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