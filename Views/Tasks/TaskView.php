<?php

class TaskView
{


    public function renderTasksTable($tasksSortOfCategory, $classesArray = array())
    {

        if ($_SESSION['user']['privileges'] == "teacher") {
            foreach ($tasksSortOfCategory as $category => $task) {
                echo "<h2>" . $task["category"] . "</h2>";
                echo <<<HTML
                <table>
                <tr><th>Nazwa zadania</th></tr>
                <tr>
                HTML;
                echo '<td id="task' . $task["task_id"] . '">' . $task["name"] . '</td>';
                echo <<<HTML
                </tr>
                <tr>
                    <td colspan="2">
                    <details>
                    <summary style="justify-content: center;"> Szczegóły </summary>
                        <table>
                        <tr>
                HTML;
                echo '<td><span>' . $task["description"] . '</span></td>';
                echo <<<HTML
                        </tr>
                        </table>
                    </details>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                HTML;
                foreach ($classesArray as $class) {
                    echo '<label for="' . $class["name"] . '">' . $class["name"] . '</label><input type="checkbox"';

                    echo 'id="' . $class["name"] . '" name="' . $class["name"] . '" data-class="x' . $task["task_id"] . '">';
                }
                echo '<button id="' . $task["name"] . '" class="btn-classSeter"';
                echo 'onclick="activeTaskForClass(\'' . $task["task_id"] . '\')">Aktywuj dla wybranej klasy</button>';
                echo "</td></tr>";

                echo "</table>";
            }
            $this->renderNewTaskCreator();
        } else {
            $i = 0;
            foreach ($tasksSortOfCategory as $category => $tasks) {
                echo "<h2>" . $category . "</h2>";
                echo "<table>";
                foreach ($tasks as $task) {
                    echo <<<HTML
                <tr><th>Nazwa zadania</th><th>Status Zadania</th></tr>
                <tr>
                HTML;
                    echo '<td>' . $task["name"] . '</td>';
                    if ($classesArray[0][$task["name"]]) {
                        echo '<td class="good"> Zaliczono </td>';
                    } else {
                        echo '<td class="bad"> Nie zaliczono </td>';
                    }

                    echo <<<HTML
                </tr>
                <tr>
                    <td colspan="3">
                    <details>
                    <summary style="justify-content: center;"> Szczegóły </summary>
                        <table>
                        <tr>
                HTML;
                    echo '<td><span>' . $task["description"] . '</span></td>';
                    echo <<<HTML
                        </tr>
                        </table>
                    </details>
                    </td>
                </tr>
                <tr>
                HTML;
                    $i++;
                }
            }
        }
    }




    private function renderNewTaskCreator()
    {
        echo <<<HTML
            <div class="flyBox fullBox">

                <div class="fullBox2">
                        <label for="name">Nazwa zadania: </label>
                        <input type="text" name="name" id="name" required><br>
                </div>
                
                <div class="form-group fullBox2">
                    <label for="category">Kategoria: </label>
                    <input list="category" name="category" id="selCategory"/>
                    <datalist id="category" />
                        <option value="Systemy Operacyjne" />
                        <option value="Lokalne Sieci Komputerowe" />
                        <option value="Urządzenia Techniki Komputerowej" />
                    </datalist>
                </div>
                <div class="bigTextInputContainer">
                        <label for="description">Szczegóły zadania: </label>
                        <input type="text" name="description" id="description" required><br>
                </div>
                <div class="fullBox">
                <button id="createTask" class="btn-insert">Dodaj nowe zadanie</button>
                </div>
            </div>
        HTML;
    }
}
