-- CreateIndex
CREATE INDEX "logs_createdAt_idx" ON "public"."logs"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "logs_tenant_createdAt_idx" ON "public"."logs"("tenant", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "logs_tenant_source_createdAt_idx" ON "public"."logs"("tenant", "source", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "logs_tenant_action_createdAt_idx" ON "public"."logs"("tenant", "action", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "logs_tenant_eventType_createdAt_idx" ON "public"."logs"("tenant", "eventType", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "logs_tenant_ip_createdAt_idx" ON "public"."logs"("tenant", "ip", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "users_tenant_createdAt_idx" ON "public"."users"("tenant", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "users_role_createdAt_idx" ON "public"."users"("role", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "users_status_createdAt_idx" ON "public"."users"("status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "users_tenant_role_status_createdAt_idx" ON "public"."users"("tenant", "role", "status", "createdAt" DESC);
