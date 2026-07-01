/*
  Warnings:

  - Added the required column `menu` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurant" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "images" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 5.0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "cuisine" TEXT NOT NULL,
    "priceRange" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "openingHours" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "ownerId" TEXT NOT NULL,
    "menu" TEXT NOT NULL
);
INSERT INTO "new_Restaurant" ("address", "cuisine", "description", "email", "featured", "id", "image", "images", "location", "name", "openingHours", "ownerId", "phone", "priceRange", "rating", "reviewCount") SELECT "address", "cuisine", "description", "email", "featured", "id", "image", "images", "location", "name", "openingHours", "ownerId", "phone", "priceRange", "rating", "reviewCount" FROM "Restaurant";
DROP TABLE "Restaurant";
ALTER TABLE "new_Restaurant" RENAME TO "Restaurant";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
