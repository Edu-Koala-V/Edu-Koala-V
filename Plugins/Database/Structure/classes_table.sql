CREATE TABLE classes 
(
    `id` INT NOT NULL AUTO_INCREMENT ,
    `name` VARCHAR(100) NOT NULL ,
    `teacher_id` INT NOT NULL ,
    PRIMARY KEY (`id`)

    )
ENGINE = InnoDB;

ALTER TABLE `classes` ADD CONSTRAINT `FK_teachers_id` 
    FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
