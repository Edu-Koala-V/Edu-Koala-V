CREATE TABLE student_tasks_status 
(
    `id` INT NOT NULL AUTO_INCREMENT ,
    `student_id` INT NOT NULL ,
    `task_id` INT NOT NULL ,
    `status` ENUM('','complete') NOT NULL ,

    PRIMARY KEY (`id`)

    ) ENGINE = InnoDB;


ALTER TABLE `student_tasks_status` ADD CONSTRAINT `FK_student_id` 
    FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT; 
ALTER TABLE `student_tasks_status` ADD CONSTRAINT `FK_task_id` 
    FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
