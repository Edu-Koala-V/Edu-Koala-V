<?php
class LoginView
{
    public function render($error = "", $nickName = '')
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
            

        HTML;
        // ##############################################################################################
        if ($error == "") {
        echo <<<HTML
        <div class="flyBox loginPanel">
        <form method="POST" action="../logowanie">
            <input type="text" name="username" placeholder="Login" required>
            <input type="password" name="password" placeholder="Hasło" required>
            <button type="submit">Login</button>
        </form>
        HTML;
        }
        // ##############################################################################################
        else if($error == "pass")
        {
            echo <<<HTML
            <div class="blurAll">
                
                <div class="flyBox loginPanel">
                <form method="POST" action="../new-password">
                    <input type="text" name="username" placeholder="Login" required value="$nickName">
                    <input type="password" name="password" placeholder="Nowe hasło" required>
                    <button type="submit">Zmień hasło</button>
                </form>
                </div>
                <div class="flyBox loginPanel">
                Twoje hasło jest "ZAQ!2wsx" musisz je zmienić przed pierwszym zalogowaniem
                </div>
                
            </div>
                

            HTML;
        }
        else if ($error == "x") {
            echo <<<HTML
        <div class="flyBox loginPanel">
        <form method="POST" action="../logowanie">
            <input type="text" name="username" placeholder="Login" required>
            <input type="password" name="password" placeholder="Hasło" required>
            <button type="submit">Login</button>
        </form>
        HTML;
            echo <<<HTML
            <div>
                <div class="flyBox loginPanel">
                    Podano nieprawidłowe dane logowania &#x1F614;
                </div>
            </div>
            HTML;
        }

        echo <<<HTML
        </main>
        <footer></footer>
        </body>
        </html>

        HTML;
    }
}
