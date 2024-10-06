/**
 * 
 * @param {Object} data - Dane do wysłania na serwer jako obiekt {klucz: wartość}
 * @param {string} url - Adres URL, na który mają zostać wysłane dane
 * @param {string} method - Metoda HTTP, którą należy użyć do wysłania danych (domyślnie 'POST')
 * @returns Wartość zwracana z serwera jako obiekt JSON lub null w przypadku błędu
 * @example Przykład 1
 * const data = {name: 'Jan Kowalski', age: 30};
 * const url = '/users';
 * const response = sendDataToServer(data, url);
 * @example Przykład 2
 * const data = {name: 'Jan Kowalski', age: 30};
 * const url = 'https://example.com/api';
 * const response = sendDataToServer(data, url, 'GET');
 */
async function sendDataToServer(data, url, method = 'POST') {
    try {
        const userTokenElement = document.querySelector('h1');
        if (userTokenElement) {
            data.user_token = userTokenElement.getAttribute('data-code');
        } else {
            throw new Error('Element user_token nie istnieje');
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Błąd połączenia: ${response.status} ${response.statusText}`);
        }
        let responseData ={};
        try {
            responseData = await response.json();
        } catch (error) {
            throw new Error(`Błąd przetwarzania odpowiedzi: ${error.message}`);
        }

        if(responseData.error){
            throw new Error(responseData.error);
        }
        if(document.location.hostname == '127.0.0.1'){
            console.log('Odpowiedź z serwera:', responseData);
        }
        return responseData; 
    } catch (error) {
        createNotification('Koala-V   Napotkano problem: ', error.message);
        console.error('Koala-V   Napotkano problem: ', error.message);
        return null;
    }
}
/**
 * 
 * @param {string} url - Adres URL, z którego mają zostać pobrane dane
 * @returns Dane zwrócone z serwera jako obiekt JSON lub null w przypadku błędu
 * @example Przykład 1
 * const url = '/users';
 * const data = fetchJSONFile(url);
 */
async function fetchJSONFile(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Błąd połączenia: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if(document.location.hostname == '127.0.0.1'){
            console.log('Pobrano plik JSON:', data);
        }
        return data;
    } catch (error) {
        console.error('Błąd podczas pobierania pliku JSON:', error.message);
        return null;
    }
}

/**
 * 
 * @param {JSON} JSON_Article zawartość artykułu w formacie JSON
 * @param {string} fileName nazwa pliku, w którym zostanie zapisany artykuł
 * @param {string} dirLocation lokalizacja katalogu w repozytorium GitHub, w którym zostanie zapisany artykuł
 * @param {string} token token autoryzacyjny do repozytorium wskazanego repozytorium GitHub
 */

function sendArticleToGithubRepository(JSON_Article, fileName, dirLocation, userName, repoName, token) {
    // Normalize dirLocation
    if (dirLocation.endsWith('/')) {
        dirLocation = dirLocation.slice(0, -1);
    }
    if (dirLocation.startsWith('/')) {
        dirLocation = dirLocation.slice(1);
    }

    // Normalize fileName
    if (fileName.includes('/')) {
        fileName = fileName.replaceAll('/', '_');
    }
    if (!fileName.endsWith('.json')) {
        fileName += '.json';
    }

    // Encode JSON_Article to base64
    let encodedContent;
    try {
        encodedContent = btoa(JSON_Article);
    } catch (e) {
        // Fallback for characters outside Latin1 range
        const uint8Array = new TextEncoder().encode(JSON_Article);
        encodedContent = btoa(String.fromCharCode(...uint8Array));
    }

    const url = `https://api.github.com/repos/${userName}/${repoName}/contents/${dirLocation}/${fileName}`;

    return fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': 'token ' + token
        }
    }).then(response => {
        if (response.status === 404) {
            // File does not exist, create a new one
            return null;
        }
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        const sha = data ? data.sha : null;

        return fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'token ' + token
            },
            body: JSON.stringify({
                message: 'Dodanie nowego artykułu',
                content: encodedContent,
                sha: sha // Include sha if updating an existing file
            })
        });
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    }).then(data => {
        console.log('Plik został zapisany:', data);
        return { status: 200, data: data };
    })
    .catch(error => {
        console.error('Błąd podczas zapisywania pliku:', error);
        return { status: 'error', error: error };
    });
}
/**
 * Na podstawie tokena autoryzacyjnego do repozytorium GitHub pobiera nazwę użytkownika i nazwy repozytoriów
 * @param {string} token Token autoryzacyjny do repozytorium GitHub
 * @return {Promise<Object>} Obiekt z nazwą użytkownika i tablicą nazw repozytoriów
 */
async function getGithubData(token) {
    let userName = '';
    let repoNameArray = [];

    try {
        // Pobierz organizacje użytkownika
        const orgsResponse = await fetch('https://api.github.com/user/orgs', {
            method: 'GET',
            headers: {
                'Authorization': 'token ' + token
            }
        });

        if (!orgsResponse.ok) {
            throw new Error(`HTTP error! status: ${orgsResponse.status}`);
        }

        const orgsData = await orgsResponse.json();

        if (orgsData.length > 0) {
            // Zakładamy, że interesuje nas pierwsza organizacja
            const org = orgsData[0];
            userName = org.login;

            // Pobierz repozytoria organizacji
            const reposResponse = await fetch(`https://api.github.com/orgs/${userName}/repos`, {
                method: 'GET',
                headers: {
                    'Authorization': 'token ' + token
                }
            });

            if (!reposResponse.ok) {
                throw new Error(`HTTP error! status: ${reposResponse.status}`);
            }

            const reposData = await reposResponse.json();
            repoNameArray = reposData.map(repo => repo.name);
        } else {
            throw new Error('User does not belong to any organizations');
        }

    } catch (error) {
        console.error('Error:', error);
    }

    return {
        userName: userName,
        repoNameArray: repoNameArray
    };
}