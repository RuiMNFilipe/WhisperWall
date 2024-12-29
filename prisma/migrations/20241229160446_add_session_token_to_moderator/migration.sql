/*
  Warnings:

  - A unique constraint covering the columns `[sessionToken]` on the table `Moderator` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Moderator" ADD COLUMN "sessionToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Moderator_sessionToken_key" ON "Moderator"("sessionToken");
