-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "org_id" TEXT NOT NULL,
    "anon_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT,
    "event" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "properties" JSONB NOT NULL,
    "context" JSONB NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "events_org_id_timestamp_idx" ON "events"("org_id", "timestamp");

-- CreateIndex
CREATE INDEX "events_anon_id_idx" ON "events"("anon_id");

-- CreateIndex
CREATE INDEX "events_user_id_idx" ON "events"("user_id");

-- CreateIndex
CREATE INDEX "events_org_id_event_idx" ON "events"("org_id", "event");
