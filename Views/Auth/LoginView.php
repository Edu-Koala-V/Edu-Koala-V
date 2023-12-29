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
        <link rel="icon" type="image/x-icon" href="/Views/Resource/Images/Website/favicon-v2.png" />
        <title>Strona główna - Edu-Koala-V</title>
        <link rel="stylesheet" href="Views/Resource/CSS/style.css" />
        </head>

        <body>
        <header>
            <h1><a href="/">KoalaPL.GitHub.io</a></h1>
        </header>
        <main>
            <div data-overview-sidebar="true">
            <div class="flyBox">

        HTML;
        // ##############################################################################################
        echo <<<HTML
        <form method="POST" action="../Logowanie">
            <input type="text" name="username" placeholder="Login" required>
            <input type="password" name="password" placeholder="Hasło" required>
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
