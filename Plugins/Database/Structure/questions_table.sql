CREATE TABLE questions 
(
    `question_id` INT NOT NULL AUTO_INCREMENT ,
    `points` INT NOT NULL ,
    `type` ENUM('radio','checkbox','sort') NOT NULL ,
    `question` TEXT NOT NULL ,
    `img` JSON NULL ,
    `video` JSON NULL ,
    `answers` JSON NOT NULL ,
    `correct` INT NOT NULL ,
    `quiz_id` INT NOT NULL ,
    `is_hidden` BOOLEAN NOT NULL ,

    PRIMARY KEY (`question_id`)
    
    )
ENGINE = InnoDB;

ALTER TABLE `questions` ADD CONSTRAINT `FK_quizzes_id` 
    FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;