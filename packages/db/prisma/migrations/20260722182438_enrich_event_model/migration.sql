/*
  Warnings:

  - You are about to drop the column `screen_width` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `user_agent` on the `events` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "events_anon_id_idx";

-- DropIndex
DROP INDEX "events_created_at_idx";

-- DropIndex
DROP INDEX "events_org_id_session_id_idx";

-- DropIndex
DROP INDEX "events_user_id_idx";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "screen_width",
DROP COLUMN "user_agent",
ADD COLUMN     "browser_name" TEXT,
ADD COLUMN     "device_type" TEXT,
ADD COLUMN     "os_name" TEXT,
ADD COLUMN     "page_path" TEXT,
ADD COLUMN     "timezone" TEXT;

-- CreateIndex
CREATE INDEX "events_org_id_browser_name_idx" ON "events"("org_id", "browser_name");

-- CreateIndex
CREATE INDEX "events_org_id_os_name_idx" ON "events"("org_id", "os_name");

-- CreateIndex
CREATE INDEX "events_org_id_device_type_idx" ON "events"("org_id", "device_type");
