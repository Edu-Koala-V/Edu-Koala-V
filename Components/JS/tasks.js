

/**
 * Dodawanie nasłuchiwaczy zdarzeń do przycisków zadań
 * Funkcja dodaje nasłuchiwacze zdarzeń do przycisków zadań. 
 * Po kliknięciu przycisku wywołuje funkcję loadTasks z obsługą błędów i ponownymi próbami w przypadku niepowodzenia.
 */
function setupTaskButtons() {
    
    const taskButtons = document.querySelectorAll('.tasks-items button');

    taskButtons.forEach(button => {
      if(button.getAttribute('data-link-task'))
        button.addEventListener('click', () => {
            retryLoadTaskContent(data, button);
        });
    });
}

function retryLoadTaskContent(data, button) {
    const articleContainer = document.querySelector("article");
    const retryLoadTasks = (button, retries = 3) => {
        if (retries == 3) {
          loadingTaskStyle(articleContainer);
      }
          loadTasks(button).then(data => {
             articleContainer.style = '';
             setupContentArticle(data);
              activeSelectTaskItem(button.parentElement.getAttribute('data-task-id'));
              setTimeout(() => {
              scrollToSection(document.querySelector("#section1"));

                  fixTableRows();
                  fixTableTH();
                  setTableHeadersTextValuesToTD();
              }, 100);
          }).catch(error => {
              if (retries > 0) {
                  setTimeout(() => {
                      retryLoadTasks(button, retries - 1);
                  }, 1000);
              } else {
                  console.error('Failed to load tasks after multiple attempts:', error);
              }
          });
      };
      retryLoadTasks(button);
    }

/**
 * Stylizacja kontenera artykułu podczas ładowania zadań
 * Funkcja stylizuje kontener artykułu podczas ładowania zadań, dodając elementy wizualne informujące o ładowaniu.
 */
function loadingTaskStyle(articleContainer) {
    const loadDiv = createElement('div', ['blur-load']);
    const loader = createElement('div', ['loader']);
    loadDiv.appendChild(loader);
    articleContainer.innerHTML = '';
    articleContainer.appendChild(loadDiv);
    articleContainer.style = 'min-height: 60vh;display: flex;';
}

// Tymczasowe przechowywanie zawartości zadań
const taskContentCache = {};

/**
 * Pobieranie pliku JSON z podanego URL z obsługą błędów
 * @param {string} url - URL pliku JSON do pobrania
 * @returns {Promise} - Promise z danymi JSON
 */
function fetchJSONFile(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Fetch error:', error);
            throw error;
        });
}

/**
 * Ładowanie zadań z obsługą błędów
 * @param {HTMLElement} buttonElement - Element przycisku, który wywołał funkcję
 * @returns {Promise} - Promise z danymi zadania
 */
async function loadTasks(buttonElement) {
    const parentId = buttonElement.parentElement.getAttribute('data-task-id');
    if (taskContentCache[parentId]) {
        return Promise.resolve(taskContentCache[parentId]);
    } else {
        const baseUrl = "https://raw.githubusercontent.com/";
        const taskLink = buttonElement.getAttribute('data-link-task');

        return fetchJSONFile(baseUrl + taskLink)
            .then(data => {
                taskContentCache[parentId] = data;
                return data;
            })
            .catch(error => {
                console.error('Load tasks error:', error);
                throw error;
            });
    }
}

/**
 * Aktywacja wybranego elementu zadania
 * Funkcja aktywuje wybrany element zadania, usuwając klasę 'active' z innych elementów i dodając ją do wybranego elementu.
 * @param {string} taskId - ID zadania do aktywacji
 */
function activeSelectTaskItem(taskId) {
    const taskItems = document.querySelectorAll('.tasks-items li');
    taskItems.forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.tasks-items li[data-task-id="${taskId}"]`).classList.add('active');
}

// Inicjalizacja
setupTaskButtons();

const buttonTaskFullScreen = document.querySelector('.task-content-fullscreen');
// setSVGIcon(buttonTaskFullScreen.querySelector("i"), '.fullscreen-enter');

buttonTaskFullScreen.addEventListener('click', () => {
    const taskContent = document.querySelector('.task-content');
    taskContent.classList.toggle('fullscreen');
    taskContent.style.width = taskContent.classList.contains('fullscreen') ? '100%' : taskContent.removeAttribute('style');
    const taskList = document.querySelector('.task-list');
    taskList.style.display = taskContent.classList.contains('fullscreen') ? 'none' : taskList.removeAttribute('style');
    setSVGIcon(buttonTaskFullScreen.querySelector("i"), taskContent.classList.contains('fullscreen') ? '.fullscreen-exit' : '.fullscreen-enter');
});