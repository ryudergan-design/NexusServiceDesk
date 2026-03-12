-- CreateTable
CREATE TABLE "SLARule" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "priority" TEXT NOT NULL,
    "responseTime" INTEGER NOT NULL,
    "resolutionTime" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INCIDENT',
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "impact" TEXT NOT NULL DEFAULT 'LOW',
    "urgency" TEXT NOT NULL DEFAULT 'LOW',
    "responseTimeDue" DATETIME,
    "resolutionTimeDue" DATETIME,
    "slaPaused" BOOLEAN NOT NULL DEFAULT false,
    "lastSlaPauseAt" DATETIME,
    "totalPausedTime" INTEGER NOT NULL DEFAULT 0,
    "requesterId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ticket_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("assigneeId", "categoryId", "createdAt", "description", "id", "impact", "priority", "requesterId", "status", "subcategoryId", "title", "type", "updatedAt", "urgency") SELECT "assigneeId", "categoryId", "createdAt", "description", "id", "impact", "priority", "requesterId", "status", "subcategoryId", "title", "type", "updatedAt", "urgency" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "SLARule_priority_key" ON "SLARule"("priority");
