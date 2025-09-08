-- CreateEnum
CREATE TYPE "public"."AlertStatus" AS ENUM ('NEW', 'ACK', 'RESOLVED');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ACTIVE', 'INACTIVE', 'FREEZE');

-- CreateEnum
CREATE TYPE "public"."LogSource" AS ENUM ('FIREWALL', 'API', 'CROWDSTRIKE', 'AWS', 'M365', 'AD', 'NETWORK');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(52),
    "lastName" VARCHAR(52),
    "email" VARCHAR(52) NOT NULL,
    "password" TEXT NOT NULL,
    "tenant" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "errorLoginCount" SMALLINT NOT NULL DEFAULT 0,
    "rndToken" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Otp" (
    "id" SERIAL NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "otp" TEXT NOT NULL,
    "rememberToken" TEXT NOT NULL,
    "count" SMALLINT NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "error" SMALLINT NOT NULL DEFAULT 0,
    "verifyToken" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Setting" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(50) NOT NULL,
    "value" VARCHAR(200) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."logs" (
    "id" SERIAL NOT NULL,
    "tenant" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "source" "public"."LogSource" NOT NULL,
    "eventType" TEXT,
    "ip" TEXT,
    "reason" TEXT,
    "raw" JSONB,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."alert_rules" (
    "id" SERIAL NOT NULL,
    "tenant" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL,
    "windowSeconds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."alerts" (
    "id" SERIAL NOT NULL,
    "tenant" TEXT NOT NULL,
    "ruleName" TEXT NOT NULL,
    "status" "public"."AlertStatus" NOT NULL DEFAULT 'NEW',
    "triggeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_phone_key" ON "public"."Otp"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Setting_key_key" ON "public"."Setting"("key");

-- CreateIndex
CREATE INDEX "logs_tenant_timestamp_idx" ON "public"."logs"("tenant", "timestamp");

-- CreateIndex
CREATE INDEX "logs_tenant_source_idx" ON "public"."logs"("tenant", "source");

-- CreateIndex
CREATE INDEX "logs_tenant_eventType_idx" ON "public"."logs"("tenant", "eventType");

-- CreateIndex
CREATE INDEX "logs_timestamp_idx" ON "public"."logs"("timestamp");

-- CreateIndex
CREATE INDEX "logs_tenant_ip_idx" ON "public"."logs"("tenant", "ip");

-- CreateIndex
CREATE INDEX "alert_rules_tenant_idx" ON "public"."alert_rules"("tenant");

-- CreateIndex
CREATE UNIQUE INDEX "alert_rules_tenant_name_key" ON "public"."alert_rules"("tenant", "name");

-- CreateIndex
CREATE INDEX "alerts_tenant_triggeredAt_idx" ON "public"."alerts"("tenant", "triggeredAt");

-- CreateIndex
CREATE INDEX "alerts_ruleName_triggeredAt_idx" ON "public"."alerts"("ruleName", "triggeredAt");

-- AddForeignKey
ALTER TABLE "public"."logs" ADD CONSTRAINT "logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
