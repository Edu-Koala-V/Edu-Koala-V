/**
 * Poprawia <title> strony artykułu, nadpisując tytuł nazwą lekcji i kursu
 */
fixPageArtLessonTitle();
function fixPageArtLessonTitle() {
  headerLessonTitleHTML = document.querySelector(".header-lesson-title");
  if (headerLessonTitleHTML) {
    const lessonURL = window.location.href;
    const lessonArray = lessonURL.split("/");
    const lessonTitle = lessonArray[lessonArray.length - 1];
    headerLessonTitleHTML.textContent = convertURLToString(
      lessonTitle.split("#")[0]
    );
    titleCourse = lessonArray[lessonArray.length - 2];
    document.title = headerLessonTitleHTML.textContent + " | " + titleCourse;
    window.onscroll = function () {
      stickyHeaderAndTitle(headerLessonTitleHTML);
    };
  }
}

/**
 * Funkcja odpowiedzialna za konfigurację nawigacji artykułów.
 */
function setupNavOfArticles() {
  navOfArticlesHTML = document.querySelector(".nav-of-articles");
  sections = document.querySelectorAll("section");
  if (navOfArticlesHTML && sections.length !== 0) {
    navArt = document.querySelector("ul");
    let li;
    sections.forEach((section) => {
      li = addNavOfArticles(section, navOfArticlesHTML);
      navArt.appendChild(li);
    });
    if (document.querySelector("#quiz-container")) {
      li = addNavOfArticles(
        null,
        navOfArticlesHTML,
        "Test wiedzy",
        "quiz-section"
      );
    }

    navArt.appendChild(li);
  }
}

/**
 * Funkcja zwraca element <li> z linkiem do sekcji artykułu dla nawigacji po stronie
 *
 * @param {HTMLElement} section - Sekcja artykułu.
 * @param {HTMLElement} navOfArticlesHTML - Element nawigacji artykułów.
 * @param {string} [sectionTitle=""] - Tytuł sekcji artykułu.
 * @param {string} [sectionID=""] - ID sekcji artykułu.
 * @returns {HTMLElement} - Element listy nawigacji.
 */
function addNavOfArticles(
  section,
  navOfArticlesHTML,
  sectionTitle = "",
  sectionID = ""
) {
  const id = section ? section.id : sectionID;
  if (sectionTitle === "") {
    sectionTitle = section.querySelector("h2").textContent;
  }
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = "#" + id;
  a.textContent = sectionTitle;
  a.addEventListener("click", (event) => {
    event.preventDefault(); // Zapobiegaj domyślnej akcji przewinięcia
    scrollToSection(document.querySelector("#" + id));
    navOfArticlesHTML.open = false;
  });
  li.appendChild(a);
  return li;
}

/**
 * Funkcja modyfikuje nagłówek do strony zmieniając kolor i dodając tytuł do górnej belki strony (header)
 */
function stickyHeaderAndTitle(headerLessonTitleHTML) {
  const header = document.documentElement.querySelector("header");
  setTimeout(function () {
    let h2 = header.querySelector("h2");
    const scrollY = Math.floor(window.scrollY);

    if (h2 == null) {
      h2 = document.createElement("h2");
      h2.textContent = headerLessonTitleHTML.textContent;
      header.appendChild(h2);
      header.classList.add("stickyHeder");
    }

    if (scrollY >= 120) {
      h2.style.visibility = "visible"; // Pokaż h2
      header.classList.add("stickyHeder");
    } else {
      h2.style.visibility = "hidden"; // Ukryj h2
      header.classList.remove("stickyHeder");
    }
  }, 300);
}

let linkContentArticle = "https://raw.githubusercontent.com/";
document.addEventListener("DOMContentLoaded", function () {
  const article = document.querySelector("article");
  if (article) {
    let authorsSection;
    if (
      document.querySelector(".article-header") &&
      document.querySelector(".article-header").getAttribute("data-content") !==
        ""
    ) {
      authorsSection = document.querySelector("section#authors").innerHTML;
      showQuizSection();
      const contentDataElement = document.querySelector("[data-content]");
      contentData = linkContentArticle + contentDataElement.dataset.content;
      fetchJSONFile(contentData).then((data) => {
        setupContentArticle(data);

        document.querySelector("article").appendChild(section);
        if (document.querySelector(".nav-of-articles")) {
          setupNavOfArticles();
        }
      });
    } else {
      article.innerHTML = "";
      const section = document.createElement("section");
      article.appendChild(section);
      document.querySelector("#quiz-page-section").remove();
    }
    const section = document.createElement("section");
    section.innerHTML = authorsSection;
    section.id = "authors";
  }
});

/**
 * usuwa sekcję z testem wiedzy jeśli nie ma tam żadnych pytań w innym przypadku ukrywa wyniki testu
 */
function showQuizSection() {
  const quizContainer = document.querySelector("#quiz-container");
  if (quizContainer !== null) {
    if (quizContainer.children.length < 2) {
      document.querySelector("#quiz-page-section").remove();
    } else {
      document.querySelector("#quiz-results").style.display = "none";
    }
  }
}
