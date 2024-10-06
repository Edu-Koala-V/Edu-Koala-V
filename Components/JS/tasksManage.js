setupSelectClassElement();

/**
 * Funkcja pobierająca rekordy zleconych zadań uczniom z bazy danych na podstawie ID klasy i ID zadania
 */
addEventElements('.tasks-items li', 'click', function(){
    const taskID = this.getAttribute('data-task-id');
    const classID = document.querySelector('select[name="classID"]').value;
    getStudentsInClass(classID, taskID);
    activeSelectTaskItem(this.getAttribute('data-task-id'));
});



function setupSelectClassElement(){
    /**
     * Przygotowanie elementów HTML do wyboru klasy
     */
    const selectClassElement = createElement('select');
    selectClassElement.name = 'classID';
    selectClassElement.id = 'classID';
    selectClassElement.title = 'Wybierz klasę'; 

    const label = document.createElement('label');
    label.htmlFor = 'classID';
    label.innerText = 'Wybierz klasę:';
    document.querySelector(".task-list").appendChild(label); 

    document.querySelector(".task-list").appendChild(selectClassElement);

    const studentsInClass = createElement('div');
    studentsInClass.id = 'studentsInClass';
    document.querySelector(".task-description").appendChild(studentsInClass);


/**
 * Pobranie listy {JSON} klas z serwera i dodanie ich do elementu select
 */
    sendDataToServer({}, "/get-classes").then(response => {        
        if(response){
            // Sortowanie tablicy response według właściwości name
            response.sort((a, b) => a.name.localeCompare(b.name));
            
            response.forEach(classData => {
                const option = document.createElement('option');
                option.value = classData.id;
                option.text = classData.name;
                selectClassElement.appendChild(option);
            });
        }
    });
/**
 * Nasłuchiwanie na zmianę wartości wybranej klasy w elemencie select i dokonuje aktualizacji za pośrednictwem funkcji getStudentsInClass
 */
    document.querySelector('select[name="classID"]').addEventListener('change', function(){
        const classID = this.value;
        const taskID = document.querySelector('.tasks-items').querySelector('.active').getAttribute('data-task-id');
        getStudentsInClass(classID, taskID);
    });
}



/**
 * Funkcja generująca element HTML z funkcjonalnością aktywacji zadania dla klasy
 * @param {string} taskName Nazwa zadania
 * @param {string} className Nazwa klasy
 * @param {number} classID ID klasy
 * @param {number} taskID ID zadania
 * @returns {HTMLElement} - Nowo utworzony element <div> z tytułem i przyciskiem aktywacji zadania
 */
function activateTaskByClassID(taskName, className, classID, taskID){
    
    const wrapper = createElement('div');
    wrapper.innerHTML = `<h2>Aktywuj zadanie "${taskName}" \n dla klasy ${className}</h2>`;

    const button = createButton("Aktywuj", ["btn", "secondary"], ()=>{
        sendDataToServer({classID: classID, taskID: taskID}, "/activate-task-by-class").then(response => {
            if(response){
                createNotification('Koala-V - Zadanie aktywowane:', `Zadanie "${taskName}" zostało aktywowane dla klasy: "${className}"`, 'success');

                getStudentsInClass(classID, taskID);

            }
        });
    });
    wrapper.appendChild(button);
    return wrapper;
}





/**
 * Pobiera listę uczniów w danej klasie, którzy mają przypisane zadanie i wyświetla ich w tabeli
 * @param {number} classID ID klasy
 * @param {number} taskID ID zadania
 */
function getStudentsInClass(classID, taskID){
    const className = document.querySelector('select[name="classID"]').querySelector(`option[value="${classID}"]`).text;
    const taskName = document.querySelector(`li[data-task-id="${taskID}"]`).querySelector('button').innerText;

    studentsInClass.innerHTML = "<h2>Studenci w klasie</h2>";

    document.querySelector('.task-description').querySelector('h2').innerText = `Zadanie "${taskName}" \n dla klasy ${className}`;

    sendDataToServer({classID: classID, taskID: taskID}, "/get-students-in-class-where-task").then(response => {
        
        const studentsInClass = document.querySelector(".task-description").querySelector("#studentsInClass");;
            // Jeśli nie ma uczniów w klasie to wyświetl przycisk aktywacji zadania
            if(response.length === 0){
                studentsInClass.innerHTML = "";
                studentsInClass.appendChild(activateTaskByClassID(taskName, className, classID, taskID))
                return;
            }
         

            let responseDataFormatted = [];

            response.forEach(student => {
                const row =[];
                const status_task = student.status === 'complete' ? 'checked' : '';
                row.push(student.student_nr);
                row.push(student.fname);
                row.push(student.sname);
                row.push(student.lname);
                row.push(`<input type="checkbox" name="taskStatus" data-status-id="${student.status_id}" ${status_task}>`);
                responseDataFormatted.push(row);
            });

            studentsInClass.appendChild(createTable(['Nr', 'Imię', 'Drugie imię', 'Nazwisko', 'Status zadania'], responseDataFormatted,'task-students-class'));


            addEventElements('input[name="taskStatus"]', 'click', function(){
                const statusID = this.getAttribute('data-status-id');
                const status = this.checked ? 'complete' : '';
                sendDataToServer({statusID: statusID, status: status}, "/update-task-status").then(response => {
                    if(response){
                        createNotification('Koala-V   Status zadania:', 'Status zadania został zmieniony', 'success');
                    }
                });
            });
            setTableHeadersTextValuesToTD();

    });
}


    




