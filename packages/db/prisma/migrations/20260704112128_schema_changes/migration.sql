/*
  Warnings:

  - You are about to drop the column `orgId` on the `api_keys` table. All the data in the column will be lost.
  - You are about to drop the column `passowrd_hash` on the `organizations` table. All the data in the column will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[org_id,event_id]` on the table `events` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `org_id` to the `api_keys` table without a default value. This is not possible if the table is not empty.
  - Added the required column `event_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `organizations` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "organizations_email_idx";

-- AlterTable
ALTER TABLE "api_keys" DROP COLUMN "orgId",
ADD COLUMN     "org_id" TEXT NOT NULL,
ALTER COLUMN "last_used_at" DROP NOT NULL;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "content_id" TEXT,
ADD COLUMN     "content_type" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "event_id" TEXT NOT NULL,
ADD COLUMN     "language" TEXT,
ADD COLUMN     "page_url" TEXT,
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "screen_width" INTEGER,
ADD COLUMN     "user_agent" TEXT;

-- AlterTable
ALTER TABLE "organizations" DROP COLUMN "passowrd_hash",
ADD COLUMN     "password_hash" TEXT NOT NULL;

-- DropTable
DROP TABLE "users";

-- CreateIndex
CREATE INDEX "api_keys_org_id_idx" ON "api_keys"("org_id");

-- CreateIndex
CREATE INDEX "events_org_id_session_id_idx" ON "events"("org_id", "session_id");

-- CreateIndex
CREATE INDEX "events_org_id_user_id_timestamp_idx" ON "events"("org_id", "user_id", "timestamp");

-- CreateIndex
CREATE INDEX "events_org_id_anon_id_timestamp_idx" ON "events"("org_id", "anon_id", "timestamp");

-- CreateIndex
CREATE INDEX "events_org_id_session_id_timestamp_idx" ON "events"("org_id", "session_id", "timestamp");

-- CreateIndex
CREATE INDEX "events_created_at_idx" ON "events"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "events_org_id_event_id_key" ON "events"("org_id", "event_id");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
