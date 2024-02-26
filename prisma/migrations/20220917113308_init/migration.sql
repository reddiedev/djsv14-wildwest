/*
  Warnings:

  - You are about to alter the column `wallet` on the `Player` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wallet" REAL NOT NULL DEFAULT 0,
    "lastWorked" TEXT NOT NULL,
    "gameName" TEXT,
    "gameTag" TEXT
);
INSERT INTO "new_Player" ("gameName", "gameTag", "id", "lastWorked", "wallet") SELECT "gameName", "gameTag", "id", "lastWorked", "wallet" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
