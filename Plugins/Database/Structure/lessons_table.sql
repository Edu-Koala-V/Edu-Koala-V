CREATE TABLE lessons 
(
    `id` INT NOT NULL AUTO_INCREMENT , 
    `title` VARCHAR(300) NOT NULL , 
    `progress` INT NOT NULL , 
    `lesson_content_id` INT NOT NULL , 
    `lesson_course` INT NOT NULL ,
    `lesson_group` INT NOT NULL ,
    `flashcard_id` INT NOT NULL,
    
    PRIMARY KEY (`id`), 
    
    INDEX `Index_lesson_title` (`title`(300))
    ) 
ENGINE = InnoDB;

ALTER TABLE `lessons` ADD CONSTRAINT `FK_course_id` 
    FOREIGN KEY (`id`) REFERENCES `course`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `lessons` ADD CONSTRAINT `FK_lessons_group`
    FOREIGN KEY (`lesson_group`) REFERENCES `lessons_groups`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;