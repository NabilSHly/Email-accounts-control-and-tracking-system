-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_employees" (
    "employeeId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "engname" TEXT NOT NULL,
    "arname" TEXT NOT NULL,
    "nationalID" TEXT NOT NULL,
    "departments" JSONB NOT NULL DEFAULT [],
    "municipalityId" INTEGER NOT NULL,
    "email" TEXT DEFAULT 'Unknown',
    "phoneNumber" TEXT DEFAULT 'Unknown',
    "password" TEXT NOT NULL,
    "reported" BOOLEAN NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "employees_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities" ("municipalityId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_employees" ("arname", "createdAt", "departments", "email", "employeeId", "engname", "municipalityId", "nationalID", "notes", "password", "phoneNumber", "reported", "status", "updatedAt") SELECT "arname", "createdAt", "departments", "email", "employeeId", "engname", "municipalityId", "nationalID", "notes", "password", "phoneNumber", "reported", "status", "updatedAt" FROM "employees";
DROP TABLE "employees";
ALTER TABLE "new_employees" RENAME TO "employees";
CREATE UNIQUE INDEX "employees_nationalID_key" ON "employees"("nationalID");
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
