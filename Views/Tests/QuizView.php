<?php
class QuizView
{
  public function renderEditor()
  {

    echo <<<HTML
        <!DOCTYPE html>
      <html lang="pl">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="Views/Resource/Images/Website/favicon-v2.png" />
        <title>Systemy operacyjne</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <link rel="stylesheet" href="Views/Resource/CSS/style.css">
      </head>
      
      <body>
        <header>
          <h1><a href="/dashboard">Edu-Koala-V</a></h1>
          <span class="burger" tabindex="0">&#9776;</span>
        </header>
      
          <nav data-overview-sidebar="true">

      HTML;
    include_once("Views/Templates/navSidebar.php");
    echo <<<HTML
          </nav>
        <main >
        <div class="form-group">
          <label for="title">Temat Lekcji</label>
          <input type="text" class="form-control" id="title" name="title" placeholder="Podaj temat lekcji">
        </div>
        <div class="form-group">
        <label for="category">Wybierz przedmiot</label>
        <input list="category" name="category" id="selectCategory"/>
            <datalist id="category" />
                <option value="Systemy Operacyjne" />
                <option value="Lokalne Sieci Komputerowe" />
                <option value="Urządzenia Techniki Komputerowej" />
            </datalist>
        </div>
      <div id="QuizContainer">
        <div class="questionBlock">
          <div class="form-group">
            <label for="question1">Pytanie nr.: 1</label>
            <input type="text" class="form-control" id="question1" name="question1" placeholder="Podaj Pytanie">

            <label for="answerA1">Odpowiedź A</label>
            <input type="text" class="form-control" id="answerA1" name="answerA1" placeholder="Podaj odpowiedź A">

            <label for="answerB1">Odpowiedź B</label>
            <input type="text" class="form-control" id="answerB1" name="answerB1" placeholder="Podaj odpowiedź B">

            <label for="answerC1">Odpowiedź C</label>
            <input type="text" class="form-control" id="answerC1" name="answerC1" placeholder="Podaj odpowiedź C">

            <label for="answerD1">Odpowiedź D</label>
            <input type="text" class="form-control" id="answerD1" name="answerD1" placeholder="Podaj odpowiedź D">

            <label for="answer1">Prawidłowa odpowiedź to:</label>
            <input list="answer1" name="answer1" id="selectAnswer1"/>
                <datalist id="answer1" />
                    <option value="A" />
                    <option value="B" />
                    <option value="C" />
                    <option value="D" />
                </datalist>
            
          </div>
        </div>
      </div>
        <button type="submit" class="btn btn-primary" id="saveQuiz">Stwórz test</button>

        <button type="button" class="btn btn-primary" id="addQuestBlock">Dodaj kolejny blok pytania</button>
        
      
        </main>
        <footer></footer>
      </body>
      <script src="Views/Resource/JS/sidebar-menu.js"></script>
      <script src="Views/Resource/JS/LoadingPages.js"></script>
      <script src="Views/Resource/JS/QuizCreator.js"></script>

      </html>
    HTML;
  }

  public function renderArticle($article)
  {
    echo $article;
  }
}
