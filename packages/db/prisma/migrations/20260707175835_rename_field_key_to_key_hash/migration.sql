/*
  Warnings:

  - You are about to drop the column `key` on the `write_keys` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[key_hash]` on the table `write_keys` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `key_hash` to the `write_keys` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "write_keys_key_idx";

-- DropIndex
DROP INDEX "write_keys_key_key";

-- AlterTable
ALTER TABLE "write_keys" DROP COLUMN "key",
ADD COLUMN     "key_hash" TEXT NOT NULL,
ADD COLUMN     "revoked_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "write_keys_key_hash_key" ON "write_keys"("key_hash");
