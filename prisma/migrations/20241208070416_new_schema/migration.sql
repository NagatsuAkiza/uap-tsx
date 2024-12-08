/*
  Warnings:

  - You are about to drop the `password_reset_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `two_factor_confirmations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `two_factor_tokens` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification_tokens` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `ownerName` on table `cars` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `two_factor_confirmations` DROP FOREIGN KEY `two_factor_confirmations_userId_fkey`;

-- AlterTable
ALTER TABLE `cars` MODIFY `ownerName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `fpUser` VARCHAR(191) NULL DEFAULT 'https://www.inforwaves.com/media/2021/04/dummy-profile-pic-300x300-1.png';

-- DropTable
DROP TABLE `password_reset_tokens`;

-- DropTable
DROP TABLE `two_factor_confirmations`;

-- DropTable
DROP TABLE `two_factor_tokens`;

-- DropTable
DROP TABLE `verification_tokens`;
