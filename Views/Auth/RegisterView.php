<?php
class RegisterView
{
    public function render($message = "")
    {
        echo <<<HTML
        <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Register</title>
            </head>
            <body>
                <form method="POST" action="/Rejestracja">
                    <label for="username">Username:</label>
                    <input type="text" name="username" id="username" required><br>

                    <label for="password">Password:</label>
                    <input type="password" name="password" id="password" required><br>

                    <label for="name">Name:</label>
                    <input type="text" name="name" id="name" required><br>

                    <label for="surname">Surname:</label>
                    <input type="text" name="surname" id="surname" required><br>

                    <label for="class">Class:</label>
                    <input type="text" name="class" id="class" required><br>

                    <input type="submit" value="Register">
                </form>
            </body>
            </html>
        HTML;
    }
}
