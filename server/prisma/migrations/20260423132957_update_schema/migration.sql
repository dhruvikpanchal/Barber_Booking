/*
  Warnings:

  - You are about to alter the column `provider` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - A unique constraint covering the columns `[provider_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `is_email_verified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `provider` ENUM('EMAIL', 'GOOGLE') NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_provider_id_key` ON `users`(`provider_id`);

-- CreateIndex
CREATE INDEX `users_email_provider_idx` ON `users`(`email`, `provider`);
