CREATE SCHEMA IF NOT EXISTS `hotel` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hotel`;

CREATE TABLE IF NOT EXISTS `hotel`.`bathroom_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));


CREATE TABLE IF NOT EXISTS `hotel`.`country` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `ISO` VARCHAR(2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE,
  UNIQUE INDEX `ISO` (`ISO` ASC) VISIBLE);

CREATE TABLE IF NOT EXISTS `hotel`.`guest` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(15) NOT NULL,
  `last_name` VARCHAR(15) NOT NULL,
  `street` VARCHAR(50) NOT NULL,
  `city` VARCHAR(45) NOT NULL,
  `zip_code` VARCHAR(16) NOT NULL,
  `phone` VARCHAR(20) NOT NULL,
  `country_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Guest_Country1_idx` (`country_id` ASC) VISIBLE,
  CONSTRAINT `fk_Country_Guest1`
    FOREIGN KEY (`country_id`)
    REFERENCES `hotel`.`country` (`id`));

CREATE TABLE IF NOT EXISTS `hotel`.`room` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `bed_single` SMALLINT NOT NULL,
  `bed_double` SMALLINT NOT NULL,
  `price` INT NOT NULL,
  `bar` TINYINT NOT NULL,
  `smoking` TINYINT NULL DEFAULT NULL,
  `bathroomtype_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Room_BathroomType1_idx` (`bathroomtype_id` ASC) VISIBLE,
  CONSTRAINT `fk_Room_BathroomType1`
    FOREIGN KEY (`bathroomtype_id`)
    REFERENCES `hotel`.`bathroom_type` (`id`));

CREATE TABLE IF NOT EXISTS `hotel`.`reservation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `arrival` DATE NOT NULL,
  `checkout` DATE NOT NULL,
  `adult_count` SMALLINT NOT NULL,
  `child_count` SMALLINT NOT NULL,
  `room_id` INT NOT NULL,
  `guest_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Rezervacija_Soba1_idx` (`room_id` ASC) VISIBLE,
  INDEX `fk_Rezervacija_Gost1_idx` (`guest_id` ASC) VISIBLE,
  CONSTRAINT `fk_Reservation_Guest1`
    FOREIGN KEY (`guest_id`)
    REFERENCES `hotel`.`guest` (`id`),
  CONSTRAINT `fk_Reservation_Room1`
    FOREIGN KEY (`room_id`)
    REFERENCES `hotel`.`room` (`id`));