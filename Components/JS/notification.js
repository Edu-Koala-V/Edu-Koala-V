//? Zmienna przechowująca wyświetlone powiadomienia. Wymagana do funkcjonalności zapobiegania duplikacji powiadomień 
let displayedNotifications = [];

/**
 * Tworzy powiadomienie na stronie
 * @param {string} title - Tytuł powiadomienia
 * @param {string} text - Treść powiadomienia
 * @param {string} type - Typ powiadomienia (error, success, warning, info, achievement)
 * @param {string} imagePath - Ścieżka do obrazka powiadomienia
 * @returns Zapobiega duplikacji. Czyli w przypadku gdy powiadomienie jest już wyświetlone, nie zostanie wyświetlone kolejne o tej samej treści
 * @example Przykłady użycia:
 * createNotification("Zdobyto osiągniecie","Droga którą znam :)","achievement","/achievements/DrogaKtórąZnam.jpg");
 * createNotification("Błąd logowania","Nie poprawne hasło");
 * createNotification("Udany zapis","Wszystkie dane zostały zapisane poprawnie","success");
 * createNotification("Uwaga","Nie wypełniono wszystkich wymaganych pól w formularzu","warning");
 * createNotification("Status zadania","Zmieniono status zadania 'DHCP' na 'Zaliczone'","info");
 */
function createNotification(title, text, type = 'error', imagePath = null) {
    if (displayedNotifications.includes(text)) {
        return;
    }
    displayedNotifications.push(text);

    let notificationContainer = document.querySelector('.notification-container');
    if (!notificationContainer) {
        notificationContainer = createElement('div', ['notification-container']);
        document.body.appendChild(notificationContainer);
    }

    let notification = createElement('div', ['notification', type]);
    const image = imagePath ? `<img src="./Resources/Web/${imagePath}" alt="Notification image">` : '';
    const titleHTML = title ? `<h2>${title}</h2>` : '';
    notification.innerHTML = image + `<div class="notification-description">${titleHTML}<p>${text}</p></div>`
    notificationContainer.appendChild(notification);

    // Usuń klasę no-scroll po zakończeniu animacji powiadomienia (po 500ms)
    setTimeout(function() {
        notificationContainer.classList.remove('no-scroll');
    }, 500);

    setTimeout(function() {
        notification.classList.add('hide');
        displayedNotifications = displayedNotifications.filter(notification => notification !== text);
        if(displayedNotifications.length === 0) {
            notificationContainer.classList.add('hide');
            setTimeout(function() {
                notificationContainer.remove();
            }, 500);
        }else{
            setTimeout(function() {
                notification.remove();
            }, 500);
        }
    }, 10000);
}
