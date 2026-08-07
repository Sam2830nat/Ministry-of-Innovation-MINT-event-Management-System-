/*
  Warnings:

  - You are about to drop the column `campus_id_verified_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `is_campus_id_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_student_id_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "campus_id_verified_at",
DROP COLUMN "is_campus_id_verified",
DROP COLUMN "student_id",
ALTER COLUMN "password_hash" DROP NOT NULL;
