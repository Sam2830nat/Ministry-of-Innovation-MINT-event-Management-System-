-- AlterTable
ALTER TABLE "users"
ADD COLUMN IF NOT EXISTS "student_id" VARCHAR,
ADD COLUMN IF NOT EXISTS "academic_program" VARCHAR,
ADD COLUMN IF NOT EXISTS "is_campus_id_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "campus_id_verified_at" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "national_id" VARCHAR,
ADD COLUMN IF NOT EXISTS "is_ministry_id_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "ministry_id_verified_at" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_student_id_key" ON "users"("student_id");
CREATE UNIQUE INDEX IF NOT EXISTS "users_national_id_key" ON "users"("national_id");