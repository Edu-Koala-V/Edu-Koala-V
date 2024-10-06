CREATE TABLE user_achievements 
(
    `id` INT NOT NULL AUTO_INCREMENT ,
    `achievements_id` INT(220) NOT NULL ,
    `user_id` INT(220) NOT NULL ,
    `achievements_get_date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    
    PRIMARY KEY (`id`)
    )

ENGINE = InnoDB;

ALTER TABLE `user_achievements` ADD CONSTRAINT `FK_achievements_id` 
    FOREIGN KEY (`achievements_id`) REFERENCES `achievements`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
ALTER TABLE `user_achievements` ADD CONSTRAINT `FK_account_id` 
    FOREIGN KEY (`user_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
