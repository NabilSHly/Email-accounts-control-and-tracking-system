-- CreateTable
CREATE TABLE "employees" (
    "employeeId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "engname" TEXT NOT NULL,
    "arname" TEXT NOT NULL,
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
    CONSTRAINT "employees_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities" ("municipalityId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UserDepartments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UserDepartments_A_fkey" FOREIGN KEY ("A") REFERENCES "departments" ("departmentId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UserDepartments_B_fkey" FOREIGN KEY ("B") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_EmployeeDepartments" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_EmployeeDepartments_A_fkey" FOREIGN KEY ("A") REFERENCES "departments" ("departmentId") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EmployeeDepartments_B_fkey" FOREIGN KEY ("B") REFERENCES "employees" ("employeeId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_departments" (
    "departmentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "department" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_departments" ("department", "departmentId") SELECT "department", "departmentId" FROM "departments";
DROP TABLE "departments";
ALTER TABLE "new_departments" RENAME TO "departments";
CREATE TABLE "new_municipalities" (
    "municipalityId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "municipality" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_municipalities" ("municipality", "municipalityId") SELECT "municipality", "municipalityId" FROM "municipalities";
DROP TABLE "municipalities";
ALTER TABLE "new_municipalities" RENAME TO "municipalities";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_UserDepartments_AB_unique" ON "_UserDepartments"("A", "B");

-- CreateIndex
CREATE INDEX "_UserDepartments_B_index" ON "_UserDepartments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeDepartments_AB_unique" ON "_EmployeeDepartments"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeDepartments_B_index" ON "_EmployeeDepartments"("B");
