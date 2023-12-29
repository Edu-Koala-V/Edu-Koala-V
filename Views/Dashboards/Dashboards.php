<?php
class Dashboard
{

  public function render()
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
        <link rel="stylesheet" href="Views/Resource/CSS/style.css" type="text/css">
      </head>

      <body>
        <header>
          <h1><a href="/Dashboard">KoalaV</a></h1>
          <span class="burger" tabindex="0">&#9776;</span>
        </header>
      
          <nav data-overview-sidebar="true">
            
      HTML;
    include_once("Views/Templates/navSidebar.php");
    echo <<<HTML
            
          </nav>
        <main >

        
        </main>
        <footer></footer>
      </body>
      <script src="Views/Resource/JS/sidebar-menu.js"></script>
      <script src="Views/Resource/JS/LoadingPages.js"></script>

      </html>
    HTML;
  }
}
