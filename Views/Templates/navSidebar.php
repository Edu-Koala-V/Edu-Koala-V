<?php

echo '<div class="box">
              <img src="Views/Resource/Images/Users/' . $_SESSION["user"]["avatar"] . '" alt="User Avatar" id="user-avatar">
              <img src="Views/Resource/Images/Website/changeAvatar.png" alt="User Avatar change icon" id="user-avatar-change"></img></img>
              <div class="user-info">
                <br />
                <span>Witaj, <strong>' . $_SESSION["user"]["name"] . ' ' . $_SESSION["user"]["surname"] . '</strong></span> <br />
                <span>Klasa <strong>' . $_SESSION["user"]["className"] . '</strong>
                  nr. <strong>' . $_SESSION["user"]["nr_student"] . '</strong></span>
                <br />
              </div>';
echo <<<HTML
            </div>
            <a href="/dashboard" style="text-decoration: none;" id="dashboard">
              <button class="btn-sidebar-menu btn-rounded-down-right active">
              <i class="fa-solid fa-chart-line"></i>
              Dashboard
              </button>
            </a>
            <button class="btn-sidebar-menu" id="lessons">
              <i class="fa-regular fa-newspaper"></i>
              Lekcje
            </button>
            <button class="btn-sidebar-menu" id="tasks">
              <i class="fa-solid fa-list-check"></i>
              Zadania
            </button>
            <button class="btn-sidebar-menu" id="tests">
              <i class="fa-brands fa-stack-exchange"></i>
              Testy
            </button>
            <button class="btn-sidebar-menu" id="resourceToDownload">
              <i class="fa-solid fa-cloud-arrow-down"></i>
              Zasoby do pobrania
            </button>
            <button class="btn-sidebar-menu">
              <i class="fa-regular fa-clipboard"></i>
              Moje notatki
            </button>
            <a href="#" style="text-decoration: none;">
              <button class="btn-sidebar-menu" id="settings">
                <i class="fa-solid fa-gear"></i>
                Ustawienia
              </button>
            </a>
            HTML;
if (($_SESSION["user"]["privileges"]) == "teacher") {
  echo <<<HTML
    <a href="/create-article" style="text-decoration: none;">
      <button class="btn-sidebar-menu" >
        <i class="fa-solid fa-person-chalkboard"></i>
        Creator Lekcji
      </button>
    </a>
    <a href="/create-quiz" style="text-decoration: none;">
      <button class="btn-sidebar-menu" >
      <i class="fa-brands fa-readme"></i>
        Creator testu
      </button>
    </a>
    <button class="btn-sidebar-menu" id="classes">
      <i class="fa-solid fa-users"></i>
      Klasy
    </button>
  HTML;
}

echo <<<HTML
            <button class="btn-sidebar-menu" id="LOGOUT">
              <i class="fa-solid fa-arrow-right-from-bracket"></i>
              Wyloguj
            </button>


HTML;
echo '<script>var username = "' . $_SESSION["user"]["username"] . '";</script>';
