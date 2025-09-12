/*
  Warnings:

  - The values [RESOLVED] on the enum `AlertStatus` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `alert_rules` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `alert_rules` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `alerts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `alerts` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AlertStatus_new" AS ENUM ('NEW', 'ACK', 'CLOSED');
ALTER TABLE "public"."alerts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."alerts" ALTER COLUMN "status" TYPE "public"."AlertStatus_new" USING ("status"::text::"public"."AlertStatus_new");
ALTER TYPE "public"."AlertStatus" RENAME TO "AlertStatus_old";
ALTER TYPE "public"."AlertStatus_new" RENAME TO "AlertStatus";
DROP TYPE "public"."AlertStatus_old";
ALTER TABLE "public"."alerts" ALTER COLUMN "status" SET DEFAULT 'NEW';
COMMIT;

-- AlterTable
ALTER TABLE "public"."alert_rules" DROP CONSTRAINT "alert_rules_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "alert_rules_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."alerts" DROP CONSTRAINT "alerts_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "alerts_pkey" PRIMARY KEY ("id");
