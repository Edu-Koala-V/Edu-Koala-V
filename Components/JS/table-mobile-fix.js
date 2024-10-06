// Pobiera wszystkie elementy z klasą 'btn task-item' i dodaje do nich nasłuchiwacz zdarzeń 'click'
const taskItems = document.querySelectorAll('.btn.task-item');
if (taskItems.length > 0) {
    taskItems.forEach(item => {
        item.addEventListener('click', async function() {
            setTimeout(() => {
                fixTableRows();
                fixTableTH();
                setTableHeadersTextValuesToTD();
            }, 100);
        });
    });
}

// Funkcja ustawia wartości tekstowe nagłówków tabeli jako atrybuty 'data-label' dla komórek tabeli
function setTableHeadersTextValuesToTD() {
    document.querySelectorAll('table').forEach(table => {
        const tableHeadersTextValues = [];
        table.querySelectorAll("th").forEach((th, index) => {
            tableHeadersTextValues.push(th.textContent);
        });
        table.querySelectorAll("tr").forEach(tr => {
            tr.querySelectorAll("td").forEach((td, index) => {
                if (tableHeadersTextValues[index] === undefined) return;
                td.setAttribute("data-label", tableHeadersTextValues[index]);
            });
        });
    });
}

// Wywołanie funkcji na starcie, aby ustawić atrybuty 'data-label' dla komórek tabeli
setTableHeadersTextValuesToTD();