<?php
class LoginView
{
    public function render()
    {
        echo <<<HTML
        <!DOCTYPE html>
        <html lang="pl">

        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/x-icon" href="/img/favicon-32x32.png" />
        <title>Strona główna - Edu-Koala-V</title>
        <link rel="stylesheet" href="Views/Resource/CSS/newstyle.css" />
        </head>

        <body>
        <header>
            <h1><a href="index.php">KoalaPL.GitHub.io</a></h1>
        </header>
        <main>
            <div id="lesson-contener" data-overview-sidebar="true">
            <div class="flyBox">

        HTML;
        // ##############################################################################################
        echo <<<HTML
        <form method="POST" action="/Logowanie">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
        HTML;
        // ##############################################################################################

        echo <<<HTML
        </div>
            <div class="flyBox">
                Tu mają być błędy
                <!-- TODO Tu mają być błędy -->
            </div>
        </div>
        </main>
        <footer></footer>
        </body>
        </html>

        HTML;
    }
}
