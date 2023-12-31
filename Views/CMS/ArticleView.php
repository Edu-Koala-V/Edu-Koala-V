<?php
class ArticleView
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
        <link rel="stylesheet" href="Views/Resource/CSS/editorStyle.css">
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
        <button type="submit" class="btn btn-primary" id="saveArticle">Create article</button>
      
      <div id="editor">
        <!-- <div contenteditable="true" type="text" name="edit" id="edit"> -->
      </div>
        </main>
        <!-- <div id="toolbar">
          <button onclick="addDiv()" id="newDivIMG"><i class="fa-regular fa-images"></i></button>
          <button onclick="boldText()" id="BoldTextBtn"><i class="fa-solid fa-bold"></i></button>
        </div> -->
        <footer></footer>
      </body>
    <script src="//cdn.quilljs.com/1.3.6/quill.min.js"></script>
      <script src="Views/Resource/JS/sidebar-menu.js"></script>
      <script src="Views/Resource/JS/LoadingPages.js"></script>
      <!-- <script src="Views/Resource/JS/edit.js"></script> -->
      <script src="Views/Resource/JS/EditorQuill.js"></script>

      </html>
    HTML;
  }

  public function renderArticle($article)
  {
    echo $article;
  }
}
