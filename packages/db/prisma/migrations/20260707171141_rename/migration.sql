/*
  Warnings:

  - You are about to drop the `api_keys` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_org_id_fkey";

-- DropTable
DROP TABLE "api_keys";

-- CreateTable
CREATE TABLE "write_keys" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "allowed_domains" TEXT[],
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "write_keys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "write_keys_key_key" ON "write_keys"("key");

-- CreateIndex
CREATE INDEX "write_keys_key_idx" ON "write_keys"("key");

-- CreateIndex
CREATE INDEX "write_keys_org_id_idx" ON "write_keys"("org_id");

-- AddForeignKey
ALTER TABLE "write_keys" ADD CONSTRAINT "write_keys_org_id_fkey" FOREIGN KEY ("org_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
