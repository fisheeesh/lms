/*
  Warnings:

  - You are about to alter the column `tenant` on the `alert_rules` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(52)`.
  - You are about to alter the column `name` on the `alert_rules` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(52)`.
  - You are about to alter the column `condition` on the `alert_rules` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(52)`.
  - A unique constraint covering the columns `[tenant]` on the table `alert_rules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `alert_rules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[condition]` on the table `alert_rules` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."alert_rules" ALTER COLUMN "tenant" SET DATA TYPE VARCHAR(52),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(52),
ALTER COLUMN "condition" SET DATA TYPE VARCHAR(52);

-- CreateIndex
CREATE UNIQUE INDEX "alert_rules_tenant_key" ON "public"."alert_rules"("tenant");

-- CreateIndex
CREATE UNIQUE INDEX "alert_rules_name_key" ON "public"."alert_rules"("name");

-- CreateIndex
CREATE UNIQUE INDEX "alert_rules_condition_key" ON "public"."alert_rules"("condition");
