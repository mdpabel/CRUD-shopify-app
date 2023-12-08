/*
  Warnings:

  - Added the required column `shop` to the `Settings` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "general" BOOLEAN NOT NULL DEFAULT false,
    "product" BOOLEAN NOT NULL DEFAULT false,
    "shop" TEXT NOT NULL
);
INSERT INTO "new_Settings" ("createdAt", "general", "id", "product", "updatedAt") SELECT "createdAt", "general", "id", "product", "updatedAt" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
