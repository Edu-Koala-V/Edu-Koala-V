-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sty 01, 2024 at 12:47 AM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `edu_platform`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `1a`
--

CREATE TABLE `1a` (
  `id` int(11) NOT NULL,
  `student_nr` int(11) NOT NULL,
  `Konfiguracja DHCP` tinyint(1) NOT NULL,
  `Zadanie dla Ciebie` tinyint(1) NOT NULL,
  `Nowość` tinyint(1) NOT NULL,
  `IP v4` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `1a`
--

INSERT INTO `1a` (`id`, `student_nr`, `Konfiguracja DHCP`, `Zadanie dla Ciebie`, `Nowość`, `IP v4`) VALUES
(1, 2, 0, 0, 1, ''),
(2, 12, 0, 0, 1, '5/10');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `1g`
--

CREATE TABLE `1g` (
  `student_nr` int(11) NOT NULL,
  `Zadanie dla Ciebie` tinyint(1) NOT NULL,
  `Nowość` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `1h`
--

CREATE TABLE `1h` (
  `student_nr` int(11) NOT NULL,
  `Nowość` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `2g`
--

CREATE TABLE `2g` (
  `id` int(11) NOT NULL,
  `student_nr` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(200) NOT NULL,
  `category` varchar(200) NOT NULL,
  `update_date` date NOT NULL,
  `classes` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `title`, `category`, `update_date`, `classes`) VALUES
(13, 'Konta i grupy lokalne', 'Systemy Operacyjne', '2023-12-29', '_1A_1G'),
(14, 'Edytor rejestru windows - Regedit', 'Systemy Operacyjne', '2023-12-29', '_1A'),
(15, 'nowa', 'Lokalne Sieci Komputerowe', '2023-12-30', ''),
(16, 'sada', 'asda', '2023-12-30', ''),
(17, 'sadasda', 'Systemy Operacyjne', '2023-12-30', ''),
(18, 'sadasda123', 'Systemy Operacyjne', '2023-12-30', ''),
(19, 'sadasda123', 'Systemy Operacyjne', '2023-12-30', ''),
(20, '123', 'Urządzenia Techniki Komputerowej', '2023-12-30', '');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL,
  `points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`, `points`) VALUES
(1, '1A', 0),
(2, '1G', 0),
(3, '1H', 0),
(4, '2G', 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `questions`
--

CREATE TABLE `questions` (
  `quiz_id` int(11) NOT NULL,
  `question` varchar(300) NOT NULL,
  `answerA` varchar(300) NOT NULL,
  `answerB` varchar(300) NOT NULL,
  `answerC` varchar(300) NOT NULL,
  `answerD` varchar(300) NOT NULL,
  `answer` enum('A','B','C','D') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`quiz_id`, `question`, `answerA`, `answerB`, `answerC`, `answerD`, `answer`) VALUES
(1, 'Wybierz Leniwca', 'Sroka', 'Lenin', 'Lewniwiec', 'Antylopa', 'C'),
(1, 'Wybierz Sok', 'Sok', 'Kanapka', 'Rower', 'Pilot', 'A'),
(2, 'Wybierz Leniwca1', 'Sroka', 'Lenin', 'Lewniwiec1', 'Antylopa', 'C'),
(2, 'Wybierz Sok3', 'Sok3', 'Kanapka', 'Rower', 'Pilot', 'A'),
(3, 'Wybierz Leniwca12', 'Sroka', 'Lenin', 'Lewniwiec12', 'Antylopa', 'C'),
(3, 'Wybierz Sok32', 'Sok32', 'Kanapka', 'Rower', 'Pilot', 'A');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `quizzes`
--

CREATE TABLE `quizzes` (
  `quiz_id` int(11) NOT NULL,
  `title` varchar(90) NOT NULL,
  `category` varchar(90) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`quiz_id`, `title`, `category`) VALUES
(1, 'Konta i grupy lokalne', 'Systemy Operacyjne'),
(2, 'RegEdit', 'Systemy Operacyjne'),
(3, 'IP v4', 'Lokalne Sieci Komputerowe');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(300) NOT NULL,
  `category` varchar(90) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`task_id`, `name`, `description`, `category`) VALUES
(1, 'Konfiguracja DHCP', 'IP: 192.168.0.1 <br>\nZakres: 192.168.0.20 - 192.168.0.30', 'Systemy Operacyjne'),
(2, 'Zadanie dla Ciebie', 'Wyluzuj', 'Systemy Operacyjne'),
(3, 'asdas', 'dasdasdasdas', 'Systemy Operacyjne'),
(5, 'Nowość', 'CZtery Kurwy', 'Lokalne Sieci Komputerowe');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(10) NOT NULL,
  `password` varchar(90) NOT NULL,
  `name` varchar(90) NOT NULL,
  `surname` varchar(90) NOT NULL,
  `class` int(11) NOT NULL,
  `nr_student` int(11) NOT NULL,
  `privileges` enum('student','teacher') NOT NULL,
  `avatar` varchar(255) NOT NULL,
  `theme` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`theme`)),
  `score` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password`, `name`, `surname`, `class`, `nr_student`, `privileges`, `avatar`, `theme`, `score`) VALUES
(1, 'RudekAlone', 'ZAQ!2wsx', 'Kamil', 'Zbrzeźniak', 1, 0, 'teacher', 'RudekAlone/image1703850287005.png', '{\r\n  \"root\": [\r\n    1,\r\n    2,\r\n    3\r\n  ]\r\n}', 1),
(2, 'KaZb12', 'ZAQ!2wsx', 'Kamil', 'Zbrzeźniak', 1, 12, 'student', 'KaZb12/image1703875392771.jpg', 'null', 1),
(3, 'AdKo1', 'ZAQ!2wsx', 'Adrian', 'Kowalski', 3, 1, 'student', 'defaultAvatar.jpg', 'null', 1),
(4, 'ArBo2', 'ZAQ!2wsx', 'Arnold', 'Boczek', 1, 2, 'student', 'defaultAvatar.jpg', 'null', 1);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `1a`
--
ALTER TABLE `1a`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `2g`
--
ALTER TABLE `2g`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`quiz_id`);

--
-- Indeksy dla tabeli `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `1a`
--
ALTER TABLE `1a`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `2g`
--
ALTER TABLE `2g`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `quiz_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
