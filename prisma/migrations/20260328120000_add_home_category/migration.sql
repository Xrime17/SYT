-- CreateTable
CREATE TABLE "HomeCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "shortLabel" TEXT NOT NULL,
    "iconKey" TEXT NOT NULL,
    "emoji" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HomeCategory_userId_idx" ON "HomeCategory"("userId");

-- CreateIndex
CREATE INDEX "HomeCategory_userId_sortOrder_idx" ON "HomeCategory"("userId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "HomeCategory_userId_iconKey_key" ON "HomeCategory"("userId", "iconKey");

-- AddForeignKey
ALTER TABLE "HomeCategory" ADD CONSTRAINT "HomeCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
