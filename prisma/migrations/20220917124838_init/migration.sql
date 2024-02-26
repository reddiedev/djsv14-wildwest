/*
  Warnings:

  - You are about to drop the column `gameTag` on the `Player` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wallet" INTEGER NOT NULL DEFAULT 0,
    "lastWorked" TEXT NOT NULL,
    "gameName" TEXT
);
INSERT INTO "new_Player" ("gameName", "id", "lastWorked", "wallet") SELECT "gameName", "id", "lastWorked", "wallet" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
