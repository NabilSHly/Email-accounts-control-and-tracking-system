-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL DEFAULT 'Unknown',
    "username" TEXT NOT NULL,
    "departmentsId" JSONB NOT NULL DEFAULT [],
    "password" TEXT NOT NULL,
    "permissions" JSONB NOT NULL DEFAULT [],
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "departments" (
    "departmentId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "department" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "municipalities" (
    "municipalityId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "municipality" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "employees" (
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
    CONSTRAINT "employees_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities" ("municipalityId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "auditLogs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" TEXT NOT NULL,
    "ipAddress" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "auditLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
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

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "employees_nationalID_key" ON "employees"("nationalID");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_UserDepartments_AB_unique" ON "_UserDepartments"("A", "B");

-- CreateIndex
CREATE INDEX "_UserDepartments_B_index" ON "_UserDepartments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_EmployeeDepartments_AB_unique" ON "_EmployeeDepartments"("A", "B");

-- CreateIndex
CREATE INDEX "_EmployeeDepartments_B_index" ON "_EmployeeDepartments"("B");
