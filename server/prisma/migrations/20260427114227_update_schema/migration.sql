/*
  Warnings:

  - You are about to drop the column `image` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `contact_messages` ADD COLUMN `service_need` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `image`,
    ADD COLUMN `image_public_id` VARCHAR(191) NULL,
    ADD COLUMN `image_url` VARCHAR(191) NULL;
