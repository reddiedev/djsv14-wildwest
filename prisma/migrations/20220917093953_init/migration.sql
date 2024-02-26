-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "wallet" INTEGER NOT NULL DEFAULT 0,
    "lastWorked" TEXT NOT NULL,
    "gameName" TEXT,
    "gameTag" TEXT
);
