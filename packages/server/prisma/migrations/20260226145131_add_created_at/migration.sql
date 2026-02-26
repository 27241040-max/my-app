/*
  Warnings:

  - You are about to drop the column `creatdAt` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `generateAt` on the `summaries` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `reviews` DROP COLUMN `creatdAt`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `summaries` DROP COLUMN `generateAt`,
    ADD COLUMN `generatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
