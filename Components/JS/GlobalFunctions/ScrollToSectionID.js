/**
 * Ta funkcja odpowiada za płynne przewijanie do sekcji strony
 * Za parametr przyjmuje referencję do sekcji, do której ma zostać przewinięta strona
 * @param {HTMLElement} section
 */
function scrollToSection(section) {
    let topOffset = 65;
    if (section.id == "quiz-section") {
      topOffset = 120;
    }
    const rect = section.getBoundingClientRect();
    const scrollTop = window.scrollY;
    const targetY = rect.top + scrollTop - topOffset;
  
    window.scrollTo({
      top: targetY,
      behavior: "smooth", // Dodaj płynne przewijanie
    });
  }