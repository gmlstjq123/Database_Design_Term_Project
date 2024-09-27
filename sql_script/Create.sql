-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Term_Project
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Term_Project
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Term_Project` DEFAULT CHARACTER SET utf8 ;
USE `Term_Project` ;

-- -----------------------------------------------------
-- Table `Term_Project`.`Medical_Speciality`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term_Project`.`Medical_Speciality` (
  `department_id` INT NOT NULL,
  `department_name` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`department_id`),
  UNIQUE INDEX `department_name_UNIQUE` (`department_name` ASC) VISIBLE,
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term_Project`.`Doctor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term_Project`.`Doctor` (
  `doctor_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(15) NOT NULL,
  `password` VARCHAR(15) NOT NULL,
  `Department_department_id` INT NOT NULL,
  PRIMARY KEY (`doctor_id`),
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE,
  INDEX `fk_Doctor_Department_idx` (`Department_department_id` ASC) VISIBLE,
  CONSTRAINT `fk_Doctor_Department`
    FOREIGN KEY (`Department_department_id`)
    REFERENCES `Term_Project`.`Medical_Speciality` (`department_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term_Project`.`Nurse`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term_Project`.`Nurse` (
  `nurse_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `phone_number` VARCHAR(15) NOT NULL,
  `password` VARCHAR(15) NOT NULL,
  `Department_department_id` INT NOT NULL,
  PRIMARY KEY (`nurse_id`),
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE,
  INDEX `fk_Nurse_Department1_idx` (`Department_department_id` ASC) VISIBLE,
  CONSTRAINT `fk_Nurse_Department1`
    FOREIGN KEY (`Department_department_id`)
    REFERENCES `Term_Project`.`Medical_Speciality` (`department_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term_Project`.`Patient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term_Project`.`Patient` (
  `patient_id` INT NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `social_security_number` VARCHAR(45) NOT NULL,
  `gender` VARCHAR(10) NOT NULL,
  `address` VARCHAR(45) NOT NULL,
  `blood_type` VARCHAR(15) NOT NULL,
  `height` INT NOT NULL,
  `weight` INT NOT NULL,
  `phone_number` VARCHAR(15) NOT NULL,
  `password` VARCHAR(15) NOT NULL,
  `Doctor_doctor_id` INT NOT NULL,
  `Nurse_nurse_id` INT NOT NULL,
  PRIMARY KEY (`patient_id`),
  UNIQUE INDEX `ssn_UNIQUE` (`social_security_number` ASC) VISIBLE,
  UNIQUE INDEX `phone_number_UNIQUE` (`phone_number` ASC) VISIBLE,
  INDEX `fk_Patient_Doctor1_idx` (`Doctor_doctor_id` ASC) VISIBLE,
  INDEX `fk_Patient_Nurse1_idx` (`Nurse_nurse_id` ASC) VISIBLE,
  CONSTRAINT `fk_Patient_Doctor1`
    FOREIGN KEY (`Doctor_doctor_id`)
    REFERENCES `Term_Project`.`Doctor` (`doctor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Patient_Nurse1`
    FOREIGN KEY (`Nurse_nurse_id`)
    REFERENCES `Term_Project`.`Nurse` (`nurse_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term_Project`.`Inpatient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term_Project`.`Inpatient` (
  `room_information` VARCHAR(45) NOT NULL,
  `admission_date_time` DATETIME NOT NULL,
  `discharge_date_time` DATETIME NOT NULL,
  `Patient_patient_id` INT NOT NULL,
  PRIMARY KEY (`Patient_patient_id`),
  CONSTRAINT `fk_Inpatient_Patient1`
    FOREIGN KEY (`Patient_patient_id`)
    REFERENCES `Term_Project`.`Patient` (`patient_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term_Project`.`Reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term_Project`.`Reservation` (
  `reservation_number` INT NOT NULL,
  `reservation_date_time` DATETIME NOT NULL,
  `Patient_patient_id` INT NOT NULL,
  `Medical_Speciality_department_id` INT NOT NULL,
  PRIMARY KEY (`reservation_number`),
  INDEX `fk_Reservation_Patient1_idx` (`Patient_patient_id` ASC) VISIBLE,
  INDEX `fk_Reservation_Medical_Speciality1_idx` (`Medical_Speciality_department_id` ASC) VISIBLE,
  CONSTRAINT `fk_Reservation_Patient1`
    FOREIGN KEY (`Patient_patient_id`)
    REFERENCES `Term_Project`.`Patient` (`patient_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Reservation_Medical_Speciality1`
    FOREIGN KEY (`Medical_Speciality_department_id`)
    REFERENCES `Term_Project`.`Medical_Speciality` (`department_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term_Project`.`Examination`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term_Project`.`Examination` (
  `examination_date_time` DATETIME NOT NULL,
  `examination_details` VARCHAR(45) NULL,
  `Doctor_doctor_id` INT NOT NULL,
  `Patient_patient_id` INT NOT NULL,
  PRIMARY KEY (`Doctor_doctor_id`, `Patient_patient_id`),
  INDEX `fk_Examination_Patient1_idx` (`Patient_patient_id` ASC) VISIBLE,
  CONSTRAINT `fk_Examination_Doctor1`
    FOREIGN KEY (`Doctor_doctor_id`)
    REFERENCES `Term_Project`.`Doctor` (`doctor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Examination_Patient1`
    FOREIGN KEY (`Patient_patient_id`)
    REFERENCES `Term_Project`.`Patient` (`patient_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Term_Project`.`Treatment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Term_Project`.`Treatment` (
  `treatment_date_time` DATETIME NOT NULL,
  `treatment_details` VARCHAR(45) NULL,
  `Nurse_nurse_id` INT NOT NULL,
  `Patient_patient_id` INT NOT NULL,
  PRIMARY KEY (`Nurse_nurse_id`, `Patient_patient_id`),
  INDEX `fk_Treatment_Patient1_idx` (`Patient_patient_id` ASC) VISIBLE,
  CONSTRAINT `fk_Treatment_Nurse1`
    FOREIGN KEY (`Nurse_nurse_id`)
    REFERENCES `Term_Project`.`Nurse` (`nurse_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Treatment_Patient1`
    FOREIGN KEY (`Patient_patient_id`)
    REFERENCES `Term_Project`.`Patient` (`patient_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
