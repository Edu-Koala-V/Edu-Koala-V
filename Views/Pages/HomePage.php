<!DOCTYPE html>
<html lang="pl">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="icon" type="image/x-icon" href="/img/favicon-32x32.png" />
  <title>Strona główna - Edu-Koala-V</title>
  <link rel="stylesheet" href="Views/Resource/CSS/style.css" />
</head>

<body>
  <header>
    <h1><a href="index.php">KoalaPL.GitHub.io</a></h1>
  </header>
  <main>
    <div data-overview-sidebar="true">
      <div class="flyBox">
        <form id="loginPanel" action="Api/Models/Login_User.php" method="post">
          <div>
            <label for="Login">Nazwa użytkownika</label>
            <input class="inputText" type="text" name="Login" id="Login" required />
          </div>
          <div>
            <label for="Password">Hasło użytkownika</label>
            <input class="inputText" type="password" name="Password" id="Password" required />
          </div>
          <input class="btn Big-Resize" type="submit" value="Zaloguj się" />
        </form>
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