CREATE TABLE lessons_groups 
(
    `id` INT NOT NULL AUTO_INCREMENT , 
    `name` TEXT NOT NULL , 
    `flashcard_id` INT NOT NULL,

    PRIMARY KEY (`id`)

) ENGINE = InnoDB;