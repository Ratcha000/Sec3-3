/*
  Warnings:

  - The values [REPORT_WARNING,ACCOUNT_BANNED] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `relatedId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the column `blacklistReason` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `blacklistedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isBlacklisted` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('SYSTEM', 'VERIFICATION', 'BOOKING', 'ROUTE');
ALTER TABLE "Notification" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Notification" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
ALTER TABLE "Notification" ALTER COLUMN "type" SET DEFAULT 'SYSTEM';
COMMIT;

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reportedUserId_fkey";

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_reporterId_fkey";

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "relatedId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "blacklistReason",
DROP COLUMN "blacklistedAt",
DROP COLUMN "isBlacklisted";

-- DropTable
DROP TABLE "Report";
