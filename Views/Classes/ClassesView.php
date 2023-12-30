<?php

class ClassesView
{

    public function renderTable($ClassesSortOfName, $error)
    {
        echo "<table>";
        echo "<tr><th>&nbsp; id &nbsp;</th><th>Klasa</th><th>Ilość punktów</th><th>Usuwanie</th><th>Szczegóły</th></tr>";
        foreach ($ClassesSortOfName as $class) {
            echo "<tr>";
            echo "<td>" . $class["id"] . "</td>";
            echo "<td>" . $class["name"] . "</td>";
            echo "<td>  &nbsp;	&nbsp;" . $class["points"] . "</td>";
            echo '<td><button id="' . $class["id"] . '" class="btn-delete">Usuń</button></td>';
            echo '<td><a href="/getStudentsOfClass?classID=' . $class["id"] . '&className=' . $class["name"] . '"><button id="' . $class["id"] . '" class="btn-update">Szczegóły</button></a></td>';
            echo "</tr>";
        }
        echo "</table>";
        if ($error != "") {
            echo '<div class="errors">' . $error . '</div>';
        }
        $this->renderNewClassCreator();
    }
    public function renderNewClassCreator()
    {
        echo <<<HTML
        
            <div class="flyBox fullBox">
            <label for="className">Nazwa Klasy:	&nbsp;	&nbsp;</label>
            <input type="text" name="className" id="className" required>	&nbsp;	&nbsp;
            <button id="createClass" class="btn-insert">Dodaj nową klasę</button>
            </div>

        HTML;
    }
    public function renderTableStudentsFromClass($studentsOfClass, $className)
    {
        echo <<<HTML
        <!DOCTYPE html>
        <html lang="pl">

        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <link rel="icon" type="image/x-icon" href="Views/Resource/Images/Website/favicon-v2.png" />
            <title>Klasa $className - Edu-Koala-V</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
            <link rel="stylesheet" href="Views/Resource/CSS/style.css">
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
        HTML;
        echo '<h2>Klasa' . $className . '</h2>';
        echo "<table>";
        echo "<tr><th>Nr. Ucznia</th><th>Imię</th><th>Nazwisko</th><th>Ocena</th></tr>";
        foreach ($studentsOfClass as $student) {
            echo "<tr>";
            echo "<td>" . $student["nr_student"] . "</td>";
            echo "<td>" . $student["name"] . "</td>";
            echo "<td>" . $student["surname"] . "</td>";
            echo "<td>" . $student["score"] . "</td>";
            echo "</tr>";
            echo '<tr>';
            echo '<td colspan="3">';
            echo '<details>';
            echo '<summary> statystyki </summary>';
            echo '<table>';
            echo '<tr>';
            echo '<td>Zadanie Konfiguracja DHCP w Windows Server 2022</td>';
            echo '</tr>';
            echo '<tr>';
            echo '<td>Zadanie Konfiguracja Domeny AD w Windows Server 2022</td>';
            echo '</tr>';
            echo '<tr>';
            echo '<td>Test wiedzy Malware 50% ocena 3</td>';
            echo '</tr>';
            echo '</table>';
            echo '</details>';
            echo '</td>';
            echo '</tr>';
        }
        echo "</table>";
        $this->renderNewStudentCreator();
        echo <<<HTML
            </main>
        <footer></footer>
        </body>
        <script src="Views/Resource/JS/sidebar-menu.js" ></script>
        <script src="Views/Resource/JS/LoadingPages.js"></script>
        <script src="Views/Resource/JS/StudentInClassManagement.js"></script>
        

        </html>
        HTML;
    }

    public function renderNewStudentCreator()
    {
        echo <<<HTML
            <div class="flyBox fullBox">

                <div class="fullBox">
                        <label for="name">Imię:</label>
                        <input type="text" name="name" id="name" required><br>
                </div>
                <div class="fullBox">
                        <label for="surname">Nazwisko:</label>
                        <input type="text" name="surname" id="surname" required><br>
                </div>
                <div class="fullBox">
                        <label for="nr">Nr.:</label>
                        <input type="number" name="nr" id="nr" required><br>
                </div>
                <div class="fullBox">
                <button id="createStudent" class="btn-insert">Dodaj ucznia do tej klasy</button>
                </div>
            </div>
        HTML;
    }
}
