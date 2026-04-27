-- AlterTable
ALTER TABLE `users` ADD COLUMN `reset_password_expires` DATETIME(3) NULL,
    ADD COLUMN `reset_password_otp` VARCHAR(191) NULL;
