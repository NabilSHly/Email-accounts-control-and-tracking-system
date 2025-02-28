-- CreateTable
CREATE TABLE "departments" (
    "departmentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "department" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT 'Unknown',
    "username" TEXT NOT NULL,
    "departmentsId" JSONB NOT NULL DEFAULT [],
    "password" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_users" ("createdAt", "id", "password", "permissions", "username") SELECT "createdAt", "id", "password", "permissions", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
