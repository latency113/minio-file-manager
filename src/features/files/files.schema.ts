import { t } from "elysia";

// TODO: add permissions
// permissions FileRolePermission[]

export const fileSchema = t.Object({
	id: t.String(),
	filename: t.String(),
	filetype: t.String(),
	fileSize: t.Number(),
	minioKey: t.String(),
	uploadStatus: t.UnionEnum(["PENDING", "COMPLETED", "FAILED"]),
	createdAt: t.Date(),
	updatedAt: t.Date(),
});

export type FileSchema = typeof fileSchema.static;