/*
  Warnings:

  - You are about to alter the column `ticketId` on the `Attachment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `ticketId` on the `SatisfactionSurvey` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - The primary key for the `Ticket` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Ticket` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `ticketId` on the `TicketComment` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `ticketId` on the `TicketTransition` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attachment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "filename" TEXT NOT NULL,
    "fileUrl" TEXT,
    "content" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "ticketId" INTEGER NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attachment_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attachment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Attachment" ("content", "createdAt", "fileUrl", "filename", "id", "mimeType", "size", "ticketId", "uploadedById") SELECT "content", "createdAt", "fileUrl", "filename", "id", "mimeType", "size", "ticketId", "uploadedById" FROM "Attachment";
DROP TABLE "Attachment";
ALTER TABLE "new_Attachment" RENAME TO "Attachment";
CREATE TABLE "new_SatisfactionSurvey" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT,
    "ticketId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SatisfactionSurvey_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SatisfactionSurvey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SatisfactionSurvey" ("createdAt", "feedback", "id", "rating", "ticketId", "userId") SELECT "createdAt", "feedback", "id", "rating", "ticketId", "userId" FROM "SatisfactionSurvey";
DROP TABLE "SatisfactionSurvey";
ALTER TABLE "new_SatisfactionSurvey" RENAME TO "SatisfactionSurvey";
CREATE UNIQUE INDEX "SatisfactionSurvey_ticketId_key" ON "SatisfactionSurvey"("ticketId");
CREATE TABLE "new_Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "budgetAmount" REAL,
    "budgetDescription" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ticket_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("assigneeId", "budgetAmount", "budgetDescription", "categoryId", "createdAt", "description", "id", "impact", "lastSlaPauseAt", "priority", "requesterId", "resolutionTimeDue", "responseTimeDue", "slaPaused", "status", "subcategoryId", "title", "totalPausedTime", "type", "updatedAt", "urgency") SELECT "assigneeId", "budgetAmount", "budgetDescription", "categoryId", "createdAt", "description", "id", "impact", "lastSlaPauseAt", "priority", "requesterId", "resolutionTimeDue", "responseTimeDue", "slaPaused", "status", "subcategoryId", "title", "totalPausedTime", "type", "updatedAt", "urgency" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE TABLE "new_TicketComment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "isInternal" BOOLEAN NOT NULL DEFAULT false,
    "timeSpent" INTEGER NOT NULL DEFAULT 0,
    "ticketId" INTEGER NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TicketComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TicketComment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TicketComment" ("authorId", "content", "createdAt", "id", "isInternal", "isPrivate", "ticketId", "timeSpent") SELECT "authorId", "content", "createdAt", "id", "isInternal", "isPrivate", "ticketId", "timeSpent" FROM "TicketComment";
DROP TABLE "TicketComment";
ALTER TABLE "new_TicketComment" RENAME TO "TicketComment";
CREATE TABLE "new_TicketTransition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" INTEGER NOT NULL,
    "fromStatus" TEXT NOT NULL,
    "toStatus" TEXT NOT NULL,
    "comment" TEXT,
    "performedById" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TicketTransition_performedById_fkey" FOREIGN KEY ("performedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TicketTransition_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TicketTransition" ("comment", "createdAt", "fromStatus", "id", "performedById", "ticketId", "toStatus") SELECT "comment", "createdAt", "fromStatus", "id", "performedById", "ticketId", "toStatus" FROM "TicketTransition";
DROP TABLE "TicketTransition";
ALTER TABLE "new_TicketTransition" RENAME TO "TicketTransition";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
