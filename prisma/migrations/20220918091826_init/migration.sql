/*
  Warnings:

  - A unique constraint covering the columns `[gameName]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_gameName_key" ON "Player"("gameName");
