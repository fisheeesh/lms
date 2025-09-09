-- This is an empty migration.

ALTER TABLE "logs"
ADD CONSTRAINT logs_severity_range
CHECK (severity IS NULL OR severity BETWEEN 0 AND 10);

CREATE INDEX logs_tags_gin ON "logs" USING GIN ("tags");
CREATE INDEX logs_raw_gin ON "logs" USING GIN ("raw" jsonb_path_ops);