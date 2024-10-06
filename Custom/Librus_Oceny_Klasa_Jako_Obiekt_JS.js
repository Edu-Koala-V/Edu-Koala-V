//Tablica obiektów z danymi uczniów z Librusa
let studentData = []
// Wiersze w tabeli ocen na Librusie
document.querySelector("#tabSource").querySelectorAll("tr").forEach(tr=>{
        //Struktura danych
        let dataStructure = {student_nr:0, studentName: ""};
        //Sprawdzenie czy uczeń jest skreślony dla beki domyślnie stwierdzam że tak xD
        let isSkreslonyxD =true;
        //Łapię wszystkie komórki w wierszu i sprawdzam tylko dwie resztę pomijam i to index
    tr.querySelectorAll("td").forEach((td, i)=>{
        //Imię i nazwisko
        if(i==2){
            let span = td.querySelector("span");
            //Sprawdzam czy span ma spana w sobie bo tak idzie odróżnić skreślonych uczniów
            if(span){
                if(!span.querySelector("span")){
                    // Wywalam nadmiar spacji z imienia i nazwiska i ustawiam że uczeń nie jest skreślony
                    dataStructure.studentName=(span.textContent).replace(/\s+/g, ' ');
                    isSkreslonyxD=false;   
                }
            }
        }
        //NR
        if(i==1){
            if(td.classList.contains("right")){
                // Parsuję na int 
                dataStructure.student_nr=parseInt(td.textContent);
            }
        }
    });
    //Jeżeli uczeń nie jest skreślony to dodaję go do tablicy
    if(!isSkreslonyxD){
        studentData.push(dataStructure);
    }
})
//Wyświetlenie tablicy z danymi uczniów
console.log(studentData);