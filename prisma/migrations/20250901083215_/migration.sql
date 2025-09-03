-- CreateEnum
CREATE TYPE "public"."FileUploadStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "public"."files" (
    "id" UUID NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "filetype" VARCHAR(100) NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadStatus" "public"."FileUploadStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."file_role_permissions" (
    "fileId" UUID NOT NULL,
    "roleName" VARCHAR(50) NOT NULL,
    "grantedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedBy" VARCHAR(100) NOT NULL,

    CONSTRAINT "file_role_permissions_pkey" PRIMARY KEY ("fileId","roleName")
);

-- CreateIndex
CREATE INDEX "files_filename_idx" ON "public"."files"("filename");

-- CreateIndex
CREATE INDEX "files_createdAt_idx" ON "public"."files"("createdAt");

-- CreateIndex
CREATE INDEX "files_uploadStatus_idx" ON "public"."files"("uploadStatus");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "public"."roles"("name");

-- CreateIndex
CREATE INDEX "roles_name_idx" ON "public"."roles"("name");

-- CreateIndex
CREATE INDEX "file_role_permissions_roleName_idx" ON "public"."file_role_permissions"("roleName");

-- CreateIndex
CREATE INDEX "file_role_permissions_grantedAt_idx" ON "public"."file_role_permissions"("grantedAt");

-- CreateIndex
CREATE INDEX "file_role_permissions_grantedBy_idx" ON "public"."file_role_permissions"("grantedBy");

-- AddForeignKey
ALTER TABLE "public"."file_role_permissions" ADD CONSTRAINT "file_role_permissions_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "public"."files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."file_role_permissions" ADD CONSTRAINT "file_role_permissions_roleName_fkey" FOREIGN KEY ("roleName") REFERENCES "public"."roles"("name") ON DELETE CASCADE ON UPDATE CASCADE;
