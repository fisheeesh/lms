/*
  Warnings:

  - You are about to drop the column `timestamp` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `logs` table. All the data in the column will be lost.
  - You are about to drop the `Setting` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `ts` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Action" AS ENUM ('ALLOW', 'DENY', 'CREATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ALERT');

-- DropForeignKey
ALTER TABLE "public"."logs" DROP CONSTRAINT "logs_userId_fkey";

-- DropIndex
DROP INDEX "public"."logs_tenant_timestamp_idx";

-- DropIndex
DROP INDEX "public"."logs_timestamp_idx";

-- AlterTable
ALTER TABLE "public"."logs" DROP COLUMN "timestamp",
DROP COLUMN "userId",
ADD COLUMN     "action" "public"."Action",
ADD COLUMN     "cloud_account_id" TEXT,
ADD COLUMN     "cloud_region" TEXT,
ADD COLUMN     "cloud_service" TEXT,
ADD COLUMN     "dst_ip" TEXT,
ADD COLUMN     "dst_port" TEXT,
ADD COLUMN     "eventSubtype" TEXT,
ADD COLUMN     "host" TEXT,
ADD COLUMN     "http_method" TEXT,
ADD COLUMN     "process" TEXT,
ADD COLUMN     "product" TEXT,
ADD COLUMN     "protocol" TEXT,
ADD COLUMN     "rule_id" TEXT,
ADD COLUMN     "rule_name" TEXT,
ADD COLUMN     "severity" SMALLINT,
ADD COLUMN     "src_ip" TEXT,
ADD COLUMN     "src_port" TEXT,
ADD COLUMN     "status_code" INTEGER,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "ts" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "url" TEXT,
ADD COLUMN     "user" TEXT,
ADD COLUMN     "vendor" TEXT;

-- DropTable
DROP TABLE "public"."Setting";

-- CreateIndex
CREATE INDEX "logs_tenant_ts_idx" ON "public"."logs"("tenant", "ts");

-- CreateIndex
CREATE INDEX "logs_ts_idx" ON "public"."logs"("ts");

-- CreateIndex
CREATE INDEX "logs_tenant_user_idx" ON "public"."logs"("tenant", "user");
