-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "general" BOOLEAN NOT NULL DEFAULT false,
    "product" BOOLEAN NOT NULL DEFAULT false
);
