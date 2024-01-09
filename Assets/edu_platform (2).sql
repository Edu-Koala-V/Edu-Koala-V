-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sty 09, 2024 at 06:16 PM
-- Wersja serwera: 10.4.28-MariaDB
-- Wersja PHP: 8.2.4

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
  `IP v4` varchar(10) NOT NULL,
  `Konfiguracja DHCP` tinyint(1) NOT NULL,
  `Nowość` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `1a`
--

INSERT INTO `1a` (`id`, `student_nr`, `IP v4`, `Konfiguracja DHCP`, `Nowość`) VALUES
(1, 1, '1/2', 0, 0),
(2, 2, '2/2', 1, 1),
(3, 2, '2/2', 0, 0),
(4, 56, '', 0, 0),
(5, 44, '5/5', 0, 0),
(6, 3, '6/10', 0, 1),
(7, 2, '2/2', 1, 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `1g`
--

CREATE TABLE `1g` (
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
(1, 'Historia od Tkacza do Administratora systemami operacyjnymi', 'Systemy Operacyjne', '2024-01-06', '_1A'),
(2, 'Historia od Tkacza do Administratora systemami operacyjnymi', 'Systemy Operacyjne', '2024-01-06', ''),
(3, 'test', 'Systemy Operacyjne', '2024-01-06', ''),
(4, 'test', 'Systemy Operacyjne', '2024-01-06', ''),
(5, 'test', 'Systemy Operacyjne', '2024-01-06', ''),
(6, 'test', 'Systemy Operacyjne', '2024-01-06', ''),
(7, 'test23', 'Systemy Operacyjne', '2024-01-06', ''),
(8, 'test234', 'Systemy Operacyjne', '2024-01-06', ''),
(9, 'VirtualBox', 'Systemy Operacyjne', '2024-01-08', ''),
(10, 'VirtualBox', 'Systemy Operacyjne', '2024-01-08', ''),
(11, 'VirtualBox', 'Systemy Operacyjne', '2024-01-08', ''),
(12, 'VirtualBox', 'Systemy Operacyjne', '2024-01-08', ''),
(13, 'VirtualBox', 'Systemy Operacyjne', '2024-01-08', ''),
(14, 'VirtualBox', 'Systemy Operacyjne', '2024-01-08', ''),
(15, 'VirtualBox', 'Systemy Operacyjne', '2024-01-08', '_1A');

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
(1, '1A', 3),
(2, '1G', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
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

INSERT INTO `questions` (`id`, `quiz_id`, `question`, `answerA`, `answerB`, `answerC`, `answerD`, `answer`) VALUES
(1, 1, 'Wybierz Leniwca', 'Sroka', 'Lenin', 'Lewniwiec', 'Antylopa', 'C'),
(2, 1, 'Wybierz Sok', 'Sok', 'Kanapka', 'Rower', 'Pilot', 'A'),
(3, 2, 'Wybierz Leniwca1', 'Sroka', 'Lenin', 'Lewniwiec1', 'Antylopa', 'C'),
(4, 2, 'Wybierz Sok3', 'Sok3', 'Kanapka', 'Rower', 'Pilot', 'A'),
(5, 3, 'Wybierz Leniwca12', 'Sroka', 'Lenin', 'Lewniwiec12', 'Antylopa', 'C'),
(6, 3, 'Wybierz Sok32', 'Sok32', 'Kanapka', 'Rower', 'Pilot', 'A');

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
(1, 'RudekAlone', '$2y$10$rZ0wQIV.18uQ07hCieN7ZOrJ60lVcdv0BSSdS6lpqdLsciUERddMW', 'Kamil', 'Zbrzeźniak', 0, 0, 'teacher', 'RudekAlone/image1704132375343.png', '{}', 0),
(49, 'RoPa3', '$2y$10$OKj9mujl7HMshFmnYDqH7eNhyt8cOO4yXck0.NJaMe2/cDyRio9SW', 'Roberto', 'Pascale', 1, 3, 'student', 'defaultAvatar.jpg', 'null', 1),
(50, 'MaDo2', '$2y$10$mVAG.7PX/VASChJrkbj11uvA.Ioc71p.48M0vu2OYXdYrsrhzoXCG', 'Maciej', 'Dombrowski', 1, 2, 'student', 'defaultAvatar.jpg', 'null', 1);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `1a`
--
ALTER TABLE `1a`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `1g`
--
ALTER TABLE `1g`
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
-- Indeksy dla tabeli `questions`
--
ALTER TABLE `questions`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `1g`
--
ALTER TABLE `1g`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

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
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
