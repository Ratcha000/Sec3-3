/*
  Warnings:

  - The primary key for the `Incident` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Incident_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Incident_id_seq";
