-- AlterTable
ALTER TABLE "public"."alert_rules" ALTER COLUMN "windowSeconds" DROP NOT NULL,
ALTER COLUMN "windowSeconds" SET DEFAULT 0;
