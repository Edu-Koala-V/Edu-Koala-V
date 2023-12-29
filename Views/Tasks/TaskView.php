<?php

class TaskView
{


    public function renderTasksTable($tasksSortOfCategory, $classesArray = array())
    {

        foreach ($tasksSortOfCategory as $category => $task) {
            echo "<h2>" . $task["category"] . "</h2>";
            echo "<table>";
            echo "<tr><th>Nazwa zadania</th><th>Zarządzaj zadaniem</th></tr>";
            echo "<tr>";
            echo "<td>" . $task["name"] . "</td>";
            echo '<td>';
            echo "</tr>";
            echo '<tr>';
            echo '<td colspan="3">';
            echo '<details>';
            echo '<summary> Szczegóły </summary>';
            echo '<table>';
            echo '<tr>';
            echo '<td>' . $task["description"] . '</td>';
            echo '</tr>';
            echo '</table>';
            echo '</details>';
            echo '</td>';
            echo '</tr>';
            echo "<tr>";
            echo '<td colspan="2">';
            foreach ($classesArray as $class) {
                echo '<label for="' . $class["name"] . '">' . $class["name"] . '</label><input type="checkbox"';

                echo 'id="' . $class["name"] . '" name="' . $class["name"] . '" data-class="' . $task["task_id"] . '">';
            }
            echo '<button id="' . $task["name"] . '" class="btn-classSeter"';
            echo 'onclick="activeLessonForClasses(\'' . $task["task_id"] . '\')">Aktywuj dla wybranych klas</button>';
            echo "</td></tr>";

            echo "</table>";
        }
        $this->renderNewTaskCreator();
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
